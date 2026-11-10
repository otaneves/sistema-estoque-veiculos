import { useEffect, useState } from 'react';
import type { Credenciais, Veiculo } from './types/Veiculo';
import { veiculoApi } from './services/veiculoApi';
import './App.css';

function lerJson(texto: string): Veiculo {
  let valor: unknown;

  try {
    valor = JSON.parse(texto);
  } catch {
    throw new Error('JSON inválido. Confira as aspas, vírgulas e chaves.');
  }

  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    throw new Error('Informe um objeto JSON entre chaves: { ... }.');
  }

  if (Object.keys(valor).length === 0) {
    throw new Error('Preencha o JSON com os campos exigidos pelo backend.');
  }

  return valor as Veiculo;
}

function mensagemErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.';
}

export default function App() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [id, setId] = useState('');
  const [json, setJson] = useState('{}');
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    veiculoApi.listarDisponiveis()
      .then(dados => {
        if (ativo) setVeiculos(dados);
      })
      .catch(falha => {
        if (ativo) setErro(mensagemErro(falha));
      });

    return () => {
      ativo = false;
    };
  }, []);

  function credenciaisObrigatorias(): Credenciais {
    if (!usuario.trim() || !senha) {
      throw new Error('Preencha o usuário e a senha para esta operação.');
    }

    if (usuario.includes(':')) {
      throw new Error('O usuário do HTTP Basic não pode conter dois-pontos.');
    }

    return { usuario: usuario.trim(), senha };
  }

  function idObrigatorio(): string {
    if (!id.trim()) {
      throw new Error('Informe o ID do veículo.');
    }

    return id.trim();
  }

  async function executar(acao: () => Promise<void>) {
    setOcupado(true);
    setErro('');
    setMensagem('');

    try {
      await acao();
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setOcupado(false);
    }
  }

  async function recarregarAposAlteracao(sucesso: string) {
    setMensagem(sucesso);

    try {
      setVeiculos(await veiculoApi.listarDisponiveis());
    } catch (falha) {
      setErro(
        `A operação foi concluída, mas a lista não atualizou: ${mensagemErro(falha)}`,
      );
    }
  }

  function listar() {
    void executar(async () => {
      setVeiculos(await veiculoApi.listarDisponiveis());
      setMensagem('Lista atualizada.');
    });
  }

  function buscar() {
    void executar(async () => {
      const credenciais = usuario.trim() || senha
        ? credenciaisObrigatorias()
        : undefined;

      const veiculo = await veiculoApi.buscar(idObrigatorio(), credenciais);

      setJson(JSON.stringify(veiculo, null, 2));
      setMensagem('Veículo carregado no editor.');
    });
  }

  function cadastrar() {
    void executar(async () => {
      await veiculoApi.criar(lerJson(json), credenciaisObrigatorias());
      await recarregarAposAlteracao('Veículo cadastrado.');
    });
  }

  function atualizar() {
    void executar(async () => {
      await veiculoApi.atualizar(
        idObrigatorio(),
        lerJson(json),
        credenciaisObrigatorias(),
      );

      await recarregarAposAlteracao('Veículo atualizado.');
    });
  }

  function excluir() {
    void executar(async () => {
      const identificador = idObrigatorio();
      const credenciais = credenciaisObrigatorias();

      if (!window.confirm(`Excluir o veículo de ID ${identificador}?`)) {
        return;
      }

      await veiculoApi.excluir(identificador, credenciais);
      setId('');
      setJson('{}');
      await recarregarAposAlteracao('Veículo excluído.');
    });
  }

  return (
    <main className="container">
      <header>
        <h1>Estoque de veículos</h1>
        <p>Integração React + Spring Boot</p>
      </header>

      <section className="painel">
        <h2>Credenciais para operações protegidas</h2>

        <div className="campos">
          <label>
            Usuário / e-mail
            <input
              value={usuario}
              onChange={evento => setUsuario(evento.target.value)}
              autoComplete="off"
              disabled={ocupado}
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={evento => setSenha(evento.target.value)}
              autoComplete="off"
              disabled={ocupado}
            />
          </label>
        </div>

        <p className="ajuda">
          As credenciais ficam somente na memória desta página.
          O backend valida as permissões.
        </p>

        <button
          type="button"
          disabled={ocupado}
          onClick={() => {
            setUsuario('');
            setSenha('');
          }}
        >
          Limpar credenciais
        </button>
      </section>

      {erro && <p className="erro" role="alert">{erro}</p>}
      {mensagem && <p className="sucesso" role="status">{mensagem}</p>}
      {ocupado && <p role="status">Processando...</p>}

      <section className="painel">
        <h2>Consultar, cadastrar e editar</h2>

        <label>
          ID — necessário para buscar, atualizar ou excluir
          <input
            value={id}
            onChange={evento => setId(evento.target.value)}
            placeholder="Informe o ID"
            disabled={ocupado}
          />
        </label>

        <div className="acoes">
          <button type="button" onClick={buscar} disabled={ocupado}>
            Buscar por ID
          </button>
        </div>

        <label>
          Dados do veículo em JSON
          <textarea
            value={json}
            onChange={evento => setJson(evento.target.value)}
            spellCheck={false}
            disabled={ocupado}
            rows={12}
          />
        </label>

        <p className="ajuda">
          Para cadastrar, use os mesmos campos do JSON de POST já testado
          no backend. Para editar, busque o veículo e ajuste o JSON conforme
          os campos aceitos pelo PUT.
        </p>

        <div className="acoes">
          <button type="button" onClick={cadastrar} disabled={ocupado}>
            Cadastrar
          </button>

          <button type="button" onClick={atualizar} disabled={ocupado}>
            Atualizar pelo ID
          </button>

          <button
            type="button"
            className="perigo"
            onClick={excluir}
            disabled={ocupado}
          >
            Excluir pelo ID
          </button>
        </div>

        <p className="ajuda">
          Cadastro e atualização: FUNCIONARIO, GERENTE ou ADMIN.
          Exclusão: GERENTE ou ADMIN.
        </p>
      </section>

      <section className="painel">
        <div className="cabecalho-lista">
          <h2>Veículos disponíveis ({veiculos.length})</h2>
          <button type="button" onClick={listar} disabled={ocupado}>
            Atualizar lista
          </button>
        </div>

        {veiculos.length === 0 && <p>Nenhum veículo disponível na lista.</p>}

        <div className="lista">
          {veiculos.map((veiculo, indice) => (
            <article className="veiculo" key={indice}>
              <h3>Veículo {indice + 1}</h3>
              <pre>{JSON.stringify(veiculo, null, 2)}</pre>
              <button
                type="button"
                disabled={ocupado}
                onClick={() => {
                  setJson(JSON.stringify(veiculo, null, 2));
                  setId('');
                  setMensagem(
                    'JSON carregado. Informe o ID do veículo antes de atualizar.',
                  );
                  setErro('');
                }}
              >
                Carregar JSON no editor
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}