import { useState, type FormEvent } from 'react'
import { api, type Conta } from './estoqueApi'

interface Props {
  conta: Conta
  token: string
  lista: Conta[]
  ocupado: boolean
  alterar: (acao: () => Promise<unknown>) => Promise<void>
}

export default function Equipe({ conta, token, lista, ocupado, alterar }: Props) {
  const [cadastro, mostrarCadastro] = useState(false)
  const [editando, editar] = useState<Conta>()
  const [mensagem, informar] = useState('')
  const perfis = conta.perfil === 'ADMIN' ? ['FUNCIONARIO', 'GERENTE', 'ADMIN'] : ['FUNCIONARIO']

  function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = Object.fromEntries(new FormData(evento.currentTarget))
    informar('')
    void alterar(async () => {
      await api('/usuarios', token, 'POST', dados)
      mostrarCadastro(false)
      informar('Conta cadastrada.')
    })
  }

  function excluir(pessoa: Conta) {
    if (!window.confirm('Excluir a conta de ' + pessoa.nome + ' (' + pessoa.email + ')?')) return
    informar('')
    void alterar(async () => {
      await api('/usuarios/' + pessoa.id, token, 'DELETE')
      informar('Conta excluída.')
    })
  }

  return <>
    <header><h1>Funcionários</h1><button disabled={ocupado} onClick={() => { editar(undefined); mostrarCadastro(!cadastro) }}>{cadastro ? 'Cancelar cadastro' : 'Cadastrar pessoa'}</button></header>
    {mensagem && <p role="status">{mensagem}</p>}
    {editando && <form key={editando.id} className="box" onSubmit={evento => {
      evento.preventDefault()
      const dados = Object.fromEntries(new FormData(evento.currentTarget))
      informar('')
      void alterar(async () => {
        await api('/usuarios/' + editando.id, token, 'PUT', dados)
        editar(undefined)
        informar('Conta atualizada.')
      })
    }}>
      <h2>Alterar conta</h2>
      <label>Nome<input name="nome" defaultValue={editando.nome} required maxLength={100}/></label>
      <label>E-mail<input name="email" type="email" defaultValue={editando.email} required maxLength={150}/></label>
      <label>Perfil<select name="perfil" defaultValue={editando.perfil}>{perfis.map(perfil => <option key={perfil}>{perfil}</option>)}</select></label>
      <button disabled={ocupado}>Salvar alterações</button> <button type="button" disabled={ocupado} onClick={() => editar(undefined)}>Cancelar</button>
    </form>}
    {cadastro && <form className="box" onSubmit={cadastrar}>
      <label>Nome<input name="nome" required maxLength={100}/></label>
      <label>E-mail<input name="email" type="email" required maxLength={150}/></label>
      <label>Senha (12 a 72 caracteres)<input name="senha" type="password" autoComplete="new-password" required minLength={12} maxLength={72}/></label>
      <label>Perfil<select name="perfil">{perfis.map(perfil => <option key={perfil}>{perfil}</option>)}</select></label>
      <button disabled={ocupado}>Salvar cadastro</button>
    </form>}
    <div className="box"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Ações</th></tr></thead>
      <tbody>{lista.map(p => <tr key={p.id}><td>{p.nome}</td><td>{p.email}</td><td>{p.perfil}</td>
        <td>{conta.perfil === "ADMIN" && p.id !== conta.id && <button disabled={ocupado} onClick={() => { editar(p); mostrarCadastro(false); informar("") }}>Alterar</button>} {p.id !== conta.id && (conta.perfil === 'ADMIN' || p.perfil === 'FUNCIONARIO') && <button disabled={ocupado} onClick={() => excluir(p)}>Excluir</button>}</td>
      </tr>)}</tbody></table></div>
  </>
}