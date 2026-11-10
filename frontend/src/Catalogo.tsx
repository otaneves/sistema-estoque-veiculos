import { useEffect, useState } from 'react'
import { api, dinheiro, situacao, type Carro } from './estoqueApi'

function Foto({ carro }: { carro: Carro }) {
 const nomes = (carro.marca + ' ' + carro.modelo).toLowerCase().split(/\W+/)
 const modelo = ['civic', 'corolla', 'siena', 'fox'].find(m => nomes.includes(m))
 if (!modelo) return null
 return <figure className="foto-carro"><img loading="lazy" src={'/veiculos/' + modelo + '.jpg'} alt={'Imagem ilustrativa do modelo ' + modelo}/><figcaption>Imagem ilustrativa</figcaption></figure>
}
export function Detalhes({ carro, fechar }: { carro: Carro; fechar: () => void }) {
 return <section className="box"><button onClick={fechar}>← Voltar</button><h1>{carro.marca} {carro.modelo}</h1>
 <Foto carro={carro}/><p>{carro.ano} · {carro.cor} · {carro.quilometragem.toLocaleString('pt-BR')} km</p>
 <strong>{dinheiro(carro.preco)}</strong><p>{situacao[carro.status]}</p></section>
}

export default function Catalogo() {
 const [lista, setLista] = useState<Carro[]>([])
 const [erro, setErro] = useState('')
 const [carregando, carregar] = useState(true)
 const [busca, buscar] = useState('')
 const [marca, filtrarMarca] = useState('')
 const [ano, filtrarAno] = useState('')
 const [detalhe, abrir] = useState<Carro>()
 useEffect(() => { api<Carro[]>('/veiculos/disponiveis').then(setLista).catch(e => setErro(e.message)).finally(() => carregar(false)) }, [])
 const filtrados = lista.filter(c => (!marca || marca === c.marca) && (!ano || ano === String(c.ano)) && (c.marca+' '+c.modelo).toLowerCase().includes(busca.trim().toLowerCase()))
 if (detalhe) return <Detalhes carro={detalhe} fechar={() => abrir(undefined)} />
 return <><h1>Encontre seu próximo veículo</h1><p>Explore os veículos disponíveis em nosso estoque.</p>
 <section className="box filtros"><input aria-label="Buscar marca ou modelo" placeholder="Buscar marca ou modelo" value={busca} onChange={e=>buscar(e.target.value)}/>
 <select aria-label="Marca" value={marca} onChange={e=>filtrarMarca(e.target.value)}><option value="">Todas as marcas</option>{[...new Set(lista.map(c=>c.marca))].sort().map(m=><option key={m}>{m}</option>)}</select>
 <select aria-label="Ano" value={ano} onChange={e=>filtrarAno(e.target.value)}><option value="">Todos os anos</option>{[...new Set(lista.map(c=>c.ano))].sort((a,b)=>b-a).map(a=><option key={a}>{a}</option>)}</select></section>
 <h2>Veículos disponíveis</h2>{erro ? <p role="alert">{erro}</p> : carregando ? <p>Carregando…</p> : <p>{filtrados.length} veículo(s) encontrado(s)</p>}
 <div className="cards">{filtrados.map(c=><article className="box" key={c.id}><Foto carro={c}/><span className="badge">Disponível</span><h2>{c.marca} {c.modelo}</h2><p>{c.ano} · {c.cor}</p><strong>{dinheiro(c.preco)}</strong><hr/><button onClick={()=>abrir(c)}>Ver detalhes</button></article>)}</div></>
}