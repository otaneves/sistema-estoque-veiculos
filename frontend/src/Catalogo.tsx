import { useEffect, useState } from 'react'
import { api, dinheiro, situacao, type Carro } from './estoqueApi'

function Foto({ carro }: { carro: Carro }) {
 if (carro.foto) return <figure className="foto-carro"><img loading="lazy" src={carro.foto} alt={carro.marca + " " + carro.modelo}/></figure>
 const nomes = (carro.marca + ' ' + carro.modelo).toLowerCase().split(/\W+/)
 const modelo = ['civic', 'corolla', 'siena', 'fox'].find(m => nomes.includes(m))
 if (!modelo) return null
 return <figure className="foto-carro"><img loading="lazy" src={'/veiculos/' + modelo + '.jpg'} alt={'Imagem ilustrativa do modelo ' + modelo}/><figcaption>Imagem ilustrativa</figcaption></figure>
}
export function Detalhes({ carro, fechar }: { carro: Carro; fechar: () => void }) {
 const [extras, definirExtras] = useState<string[]>([])
 const [indice, selecionar] = useState(0)
 const [erro, avisar] = useState('')
 useEffect(() => {
   let ativo = true
   api<string[]>('/veiculos/' + carro.id + '/fotos')
     .then(imagens => { if (ativo) definirExtras(imagens) })
     .catch(() => { if (ativo) avisar('Não foi possível carregar as fotos adicionais.') })
   return () => { ativo = false }
 }, [carro.id])
 const imagens = carro.foto ? [carro.foto, ...extras] : extras
 return <section className="box"><button onClick={fechar}>← Voltar</button><h1>{carro.marca} {carro.modelo}</h1>
  {imagens.length ? <figure className="foto-carro">
   <img src={imagens[indice]} alt={carro.marca + ' ' + carro.modelo + ', foto ' + (indice + 1)}/>
   {imagens.length > 1 && <figcaption><button disabled={indice === 0} onClick={() => selecionar(indice - 1)}>Anterior</button>
     {' '}{indice + 1} de {imagens.length}{' '}
     <button disabled={indice === imagens.length - 1} onClick={() => selecionar(indice + 1)}>Próxima</button></figcaption>}
 </figure> : <Foto carro={carro}/>}
 {erro && <p role="alert">{erro}</p>}<p>{carro.ano} · {carro.cor} · {carro.quilometragem.toLocaleString('pt-BR')} km</p>
 <strong>{dinheiro(carro.preco)}</strong><p>{situacao[carro.status]}</p></section>
}

export default function Catalogo() {
 const [lista, setLista] = useState<Carro[]>([])
 const [erro, setErro] = useState('')
 const [carregando, carregar] = useState(true)
 const [busca, buscar] = useState('')
 const [marca, filtrarMarca] = useState('')
 const [ano, filtrarAno] = useState('')
 const [valor, filtrarValor] = useState('')
 const [detalhe, abrir] = useState<Carro>()
 useEffect(() => { api<Carro[]>('/veiculos/disponiveis').then(setLista).catch(e => setErro(e.message)).finally(() => carregar(false)) }, [])
 const filtrados = lista.filter(c => (!valor || (valor === '150000+' ? c.preco > 150000 : c.preco >= Number(valor.split('-')[0]) && c.preco <= Number(valor.split('-')[1]))) && (!marca || marca === c.marca) && (!ano || ano === String(c.ano)) && (c.marca+' '+c.modelo).toLowerCase().includes(busca.trim().toLowerCase()))
 if (detalhe) return <Detalhes carro={detalhe} fechar={() => abrir(undefined)} />
 return <><h1>Encontre seu próximo veículo</h1><p>Explore os veículos disponíveis em nosso estoque.</p>
 <section className="box filtros"><input aria-label="Buscar marca ou modelo" placeholder="Buscar marca ou modelo" value={busca} onChange={e=>buscar(e.target.value)}/>
 <select aria-label="Marca" value={marca} onChange={e=>filtrarMarca(e.target.value)}><option value="">Todas as marcas</option>{[...new Set(lista.map(c=>c.marca))].sort().map(m=><option key={m}>{m}</option>)}</select>
 <select aria-label="Ano" value={ano} onChange={e=>filtrarAno(e.target.value)}><option value="">Todos os anos</option>{[...new Set(lista.map(c=>c.ano))].sort((a,b)=>b-a).map(a=><option key={a}>{a}</option>)}</select><select aria-label="Faixa de valor" value={valor} onChange={e=>filtrarValor(e.target.value)}><option value="">Todos os valores</option><option value="0-50000">Até R$ 50.000</option><option value="50000.01-100000">R$ 50.000,01 a R$ 100.000</option><option value="100000.01-150000">R$ 100.000,01 a R$ 150.000</option><option value="150000+">Acima de R$ 150.000</option></select></section>
 <h2>Veículos disponíveis</h2>{erro ? <p role="alert">{erro}</p> : carregando ? <p>Carregando…</p> : <p>{filtrados.length} veículo(s) encontrado(s)</p>}
 <div className="cards">{filtrados.map(c=><article className="box" key={c.id}><Foto carro={c}/><span className="badge">Disponível</span><h2>{c.marca} {c.modelo}</h2><p>{c.ano} · {c.cor}</p><strong>{dinheiro(c.preco)}</strong><hr/><button onClick={()=>abrir(c)}>Ver detalhes</button></article>)}</div></>
}