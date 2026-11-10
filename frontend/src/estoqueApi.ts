export type Perfil = 'FUNCIONARIO' | 'GERENTE' | 'ADMIN'
export interface Conta { id: number; nome: string; email: string; perfil: Perfil }
export interface Carro {
 id: number; marca: string; modelo: string; ano: number; cor: string
 preco: number; quilometragem: number; status: 'DISPONIVEL' | 'RESERVADO' | 'VENDIDO'
}
export async function api<T>(rota: string, token = '', method = 'GET', dados?: unknown): Promise<T> {
 const headers = new Headers({ Accept: 'application/json' })
 if (token) headers.set('Authorization', 'Basic ' + token)
 if (dados) headers.set('Content-Type', 'application/json')
 const res = await fetch('/api' + rota, { method, headers, credentials: 'omit', body: JSON.stringify(dados) })
 if (!res.ok) {
   if (res.status === 401) throw Error('Confira seu e-mail e senha.')
   if (res.status === 403) throw Error('Sua conta não tem permissão para esta ação.')
   throw Error('A solicitação falhou (HTTP ' + res.status + '). Confira os dados e a conexão.')
 }
 const texto = await res.text()
 return texto ? JSON.parse(texto) : undefined
}
export const dinheiro = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const situacao = { DISPONIVEL: 'Disponível', RESERVADO: 'Reservado', VENDIDO: 'Vendido' }
