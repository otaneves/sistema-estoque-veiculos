import { useState, type FormEvent } from 'react'
import Catalogo from './Catalogo'
import Painel from './Painel'
import { api, type Conta } from './estoqueApi'
import './portal.css'

export default function Portal() {
 const login = /^\/login\/?$/.test(window.location.pathname)
 const [sessao, entrar] = useState<{ conta: Conta; token: string }>()
 const [erro, avisar] = useState('')
 const [ocupado, aguardar] = useState(false)
 async function autenticar(e:FormEvent<HTMLFormElement>) {
   e.preventDefault()
   const dados = new FormData(e.currentTarget)
   const bytes = new TextEncoder().encode(String(dados.get('email')).trim()+':'+dados.get('senha'))
   const token = btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))
   aguardar(true); avisar('')
   try { const conta = await api<Conta>('/conta',token); entrar({conta,token}) }
   catch(e){ avisar(e instanceof Error ? e.message : 'Falha no acesso.') }
   finally { aguardar(false) }
 }
 return <><nav><strong>Concessionária Luizon</strong><span>{sessao?.conta.nome} {sessao?.conta.perfil}</span>{sessao ? <button onClick={()=>window.location.assign("/")}>Sair</button> : login && <a href="/">Voltar ao catálogo</a>}</nav>
 <main>{sessao ? <Painel {...sessao}/> : login ? <form className="box login" onSubmit={autenticar}><h1>Acesse sua conta</h1><label>E-mail<input name="email" type="email" required autoComplete="username"/></label><label>Senha<input name="senha" type="password" required autoComplete="current-password"/></label>{erro && <p role="alert">{erro}</p>}<button disabled={ocupado}>{ocupado?'Entrando…':'Entrar'}</button></form> : <Catalogo/>}</main></>
}