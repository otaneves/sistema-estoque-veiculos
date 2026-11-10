import { useEffect, useState, type FormEvent } from 'react'
import { api, situacao, type Carro, type Conta } from './estoqueApi'
import { Detalhes } from './Catalogo'

export default function Painel({ conta, token }: { conta: Conta; token: string }) {
 const gestor = ['GERENTE','ADMIN'].includes(conta.perfil)
 const [aba, trocar] = useState('Veículos')
 const [lista, listar] = useState<Carro[]>([])
 const [equipe, definirEquipe] = useState<Conta[]>([])
 const [erro, avisar] = useState('')
 const [busca, buscar] = useState('')
 const [detalhe, abrir] = useState<Carro>()
 const [edicao, editar] = useState<Carro | null | undefined>()
 const [ocupado, aguardar] = useState(false)
 const [versao, atualizar] = useState(0)
 useEffect(()=>{
   let ativo = true
   const rota = aba === 'Funcionários' ? '/usuarios' : '/veiculos'
   async function carregar() {
    try {
     if (aba === 'Funcionários') { const dados = await api<Conta[]>(rota,token); if(ativo) definirEquipe(dados) }
     else { const dados = await api<Carro[]>(rota,token); if(ativo) listar(dados) }
    } catch(e){ if(ativo) avisar(e instanceof Error ? e.message : 'Erro ao carregar.') }
   }
   void carregar()
   return ()=>{ ativo=false }
 },[aba,token,versao])
 async function alterar(acao:()=>Promise<unknown>) {
   aguardar(true); avisar('')
   try { await acao(); editar(undefined); atualizar(v=>v+1) }
   catch(e){ avisar(e instanceof Error ? e.message : 'Falha na operação.') }
   finally { aguardar(false) }
 }
 function salvar(evento:FormEvent<HTMLFormElement>) {
   evento.preventDefault()
   const dados = Object.fromEntries(new FormData(evento.currentTarget))
   const corpo = {...dados, ano:Number(dados.ano), preco:Number(dados.preco), quilometragem:Number(dados.quilometragem)}
   void alterar(()=>api(edicao ? '/veiculos/'+edicao.id : '/veiculos',token,edicao ? 'PUT':'POST',corpo))
 }
 return <div className="painel"><aside>{['Visão geral','Veículos',...(gestor?['Funcionários']:[])].map(item=><button key={item} aria-pressed={aba===item} onClick={()=>{trocar(item); abrir(undefined); editar(undefined); avisar('')}}>{item}</button>)}</aside><section>
 {erro && <p role="alert">{erro}</p>}
 {aba==='Funcionários' ? <><h1>Funcionários</h1><div className="box"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th></tr></thead><tbody>{equipe.map(p=><tr key={p.id}><td>{p.nome}</td><td>{p.email}</td><td>{p.perfil}</td></tr>)}</tbody></table></div></> :
 detalhe ? <Detalhes carro={detalhe} fechar={()=>abrir(undefined)}/> :
 edicao!==undefined ? <form className="box" onSubmit={salvar}><h1>{edicao?'Editar veículo':'Novo veículo'}</h1>
 <div className="grid">{([['marca','Marca'],['modelo','Modelo'],['cor','Cor'],['ano','Ano'],['preco','Preço (R$)'],['quilometragem','Quilometragem']] as const).map(([campo,label])=><label key={campo}>{label}<input name={campo} required defaultValue={edicao?.[campo]} type={['ano','preco','quilometragem'].includes(campo)?'number':'text'} min="0" step={campo==='preco'?'.01':undefined}/></label>)}
 <label>Situação<select name="status" defaultValue={edicao?.status}>{Object.entries(situacao).map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label></div>
 <button disabled={ocupado}>Salvar</button> <button type="button" disabled={ocupado} onClick={()=>editar(undefined)}>Cancelar</button></form> :
 <><header><h1>{aba}</h1><button onClick={()=>editar(null)}>+ Novo veículo</button></header>
 <div className="cards">{[['Total',lista.length],['Disponíveis',lista.filter(c=>c.status==='DISPONIVEL').length],['Indisponíveis',lista.filter(c=>c.status!=='DISPONIVEL').length]].map(([t,n])=><div className="box" key={t}>{t}<h2>{n}</h2></div>)}</div>
 <div className="box"><input placeholder="Buscar veículo..." aria-label="Buscar veículo" value={busca} onChange={e=>buscar(e.target.value)}/><table><thead><tr><th>Veículo</th><th>Ano</th><th>Situação</th><th>Ações</th></tr></thead><tbody>{lista.filter(c=>(c.marca+' '+c.modelo).toLowerCase().includes(busca.toLowerCase())).map(c=><tr key={c.id}><td>{c.marca} {c.modelo}</td><td>{c.ano}</td><td>{situacao[c.status]}</td><td><button onClick={()=>abrir(c)}>Ver</button> <button onClick={()=>editar(c)}>Editar</button> {gestor && <button disabled={ocupado} onClick={()=>{if(confirm('Excluir '+c.marca+' '+c.modelo+'?')) void alterar(()=>api('/veiculos/'+c.id,token,'DELETE'))}}>Excluir</button>}</td></tr>)}</tbody></table></div></>}
 </section></div>
}