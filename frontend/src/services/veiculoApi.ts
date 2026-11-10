import type { Credenciais, Veiculo } from '../types/Veiculo';

const BASE = '/api/veiculos';

function basicAuth({ usuario, senha }: Credenciais): string {
    const bytes = new TextEncoder().encode(`${usuario}:${senha}`);
    const texto = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return `Basic ${btoa(texto)}`;
}

async function requisicao(
    caminho: string,
    metodo: string,
    credenciais?: Credenciais,
    dados?: Veiculo,
): Promise<unknown> {
    const headers = new Headers({ Accept: 'application/json' });

    if (credenciais) {
        headers.set('Authorization', basicAuth(credenciais));
    }

    if (dados !== undefined) {
        headers.set('Content-Type', 'application/json');
    }

    let resposta: Response;

    try {
        resposta = await fetch(`${BASE}${caminho}`, {
            method: metodo,
            headers,
            credentials: 'omit',
            body: dados === undefined ? undefined : JSON.stringify(dados),
        });
    } catch {
        throw new Error(
            'Não foi possível acessar a API. Confira se o Spring Boot está ligado.',
        );
    }

    const texto = await resposta.text();

    if (!resposta.ok) {
        const mensagens: Record<number, string> = {
            400: 'Dados inválidos. Confira os campos enviados.',
            401: 'Autenticação necessária ou usuário/senha inválidos.',
            403: 'Acesso negado. Confira seu perfil e a configuração de CSRF no backend.',
            404: 'Veículo ou endereço não encontrado.',
            409: 'Conflito com os dados existentes.',
        };

        throw new Error(
            mensagens[resposta.status] ??
            `Erro na API: HTTP ${resposta.status}.`,
        );
    }

    if (!texto.trim()) return undefined;

    try {
        return JSON.parse(texto) as unknown;
    } catch {
        throw new Error('A API respondeu com um conteúdo que não é JSON.');
    }
}

function objeto(valor: unknown): valor is Veiculo {
    return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

export const veiculoApi = {
    async listarDisponiveis(): Promise<Veiculo[]> {
        const dados = await requisicao('/disponiveis', 'GET');

        if (!Array.isArray(dados) || !dados.every(objeto)) {
            throw new Error('A listagem deve retornar um array JSON de veículos.');
        }

        return dados;
    },

    async buscar(id: string, credenciais?: Credenciais): Promise<Veiculo> {
        const dados = await requisicao(
            `/${encodeURIComponent(id)}`,
            'GET',
            credenciais,
        );

        if (!objeto(dados)) {
            throw new Error('A consulta não retornou um objeto JSON de veículo.');
        }

        return dados;
    },

    criar(dados: Veiculo, credenciais: Credenciais): Promise<unknown> {
        return requisicao('', 'POST', credenciais, dados);
    },

    atualizar(
        id: string,
        dados: Veiculo,
        credenciais: Credenciais,
    ): Promise<unknown> {
        return requisicao(
            `/${encodeURIComponent(id)}`,
            'PUT',
            credenciais,
            dados,
        );
    },

    excluir(id: string, credenciais: Credenciais): Promise<unknown> {
        return requisicao(`/${encodeURIComponent(id)}`, 'DELETE', credenciais);
    },
};