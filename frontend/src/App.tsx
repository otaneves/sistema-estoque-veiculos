
import { useState, useEffect } from "react";
import "./App.css";

type StatusVeiculo = "DISPONIVEL" | "RESERVADO" | "VENDIDO";

type FiltroVeiculo = StatusVeiculo | "TODOS";

type OrdemPreco = "CRESCENTE" | "DECRESCENTE";

type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  quilometragem: number;
  preco: number;
  status: StatusVeiculo;
};

type NovoVeiculo = Omit<Veiculo, "id">;


function App() {
  
  const [novoVeiculo, setNovoVeiculo] = useState<NovoVeiculo>({
    marca: "",
    modelo: "",
    ano: 2026,
    cor: "",
    quilometragem: 0,
    preco: 0,
    status: "DISPONIVEL"
  });
  
  const [salvando, setSalvando] = useState(false);
  
  const [mensagemCadastro, setMensagemCadastro] = useState<string | null>(null);

  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  function iniciarEdicao(carro: Veiculo) {
    setIdEmEdicao(carro.id);

    setNovoVeiculo({
      marca: carro.marca,
      modelo: carro.modelo,
      ano: carro.ano,
      cor: carro.cor,
      quilometragem: carro.quilometragem,
      preco: carro.preco,
      status: carro.status
    });

    setMensagemCadastro("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Estado responsável pelo filtro selecionado
  const [filtroStatus, setFiltroStatus] =
    useState<FiltroVeiculo>("DISPONIVEL");

  const [ordemPreco, setOrdemPreco] = useState<OrdemPreco>("CRESCENTE");

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  const [busca, setBusca] = useState("");

  const [erroApi, setErroApi] = useState<string | null>(null);

  const [carregando, setCarregando] = useState(true);

  // Filtra os veículos pelo status selecionado
  const veiculosDisponiveis = veiculos.filter((carro) => {
    const correspondeStatus =
      filtroStatus === "TODOS" ||
      carro.status === filtroStatus;

    const correspondeBusca =
      carro.marca.toLowerCase().includes(busca.toLowerCase()) ||
      carro.modelo.toLowerCase().includes(busca.toLowerCase());

    return correspondeStatus && correspondeBusca;
  });

  const veiculosOrdenados = [...veiculosDisponiveis].sort(
    (a, b) => {
      if (ordemPreco === "CRESCENTE") {
        return a.preco - b.preco;
      } else {
        return b.preco - a.preco;
      }
    }
  );

  // Formata o status exibido no card
  function formatarStatus(status: StatusVeiculo): string {
    switch (status) {
      case "DISPONIVEL":
        return "Disponível";

      case "RESERVADO":
        return "Reservado";

      case "VENDIDO":
        return "Vendido";

      default:
        return "Desconhecido";
    }
  }

  // Formata o título conforme o filtro selecionado
  function formatarTituloFiltro(status: FiltroVeiculo): string {
    switch (status) {
      case "TODOS":
        return "Todos os veículos";

      case "DISPONIVEL":
        return "Veículos disponíveis";

      case "RESERVADO":
        return "Veículos reservados";

      case "VENDIDO":
        return "Veículos vendidos";

      default:
        return "Veículos";
    }
  }
  
  useEffect(() => {
    carregarVeiculos();
  }, []);

  async function carregarVeiculos() {
    setCarregando(true);
    setErroApi(null); // Limpa qualquer mensagem de erro anterior

    try{
      const resposta = await fetch("http://localhost:8080/veiculos");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar veículos");
      }

    const dados: Veiculo[] = await resposta.json();

    setVeiculos(dados);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      setErroApi("Erro ao carregar veículos da API. Por favor, tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  async function salvarVeiculo() {
    setSalvando(true);
    setMensagemCadastro(null);

    const editando = idEmEdicao !== null;

    try {
      const url = editando 
        ? `http://localhost:8080/veiculos/${idEmEdicao}`
        : "http://localhost:8080/veiculos";

      const resposta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoVeiculo)
      });

      if (!resposta.ok) {
        throw new Error
        (editando ? "Erro ao atualizar veículo" : 
          "Erro ao cadastrar veículo");
      }

      setMensagemCadastro(
        editando 
        ? "Veículo atualizado com sucesso!"
        : "Veículo cadastrado com sucesso!"
      );

      setIdEmEdicao(null); // Limpa o estado de edição após salvar

      setNovoVeiculo({
        marca: "",
        modelo: "",
        ano: 2026,
        cor: "",
        quilometragem: 0,
        preco: 0,
        status: "DISPONIVEL"
      });

      await carregarVeiculos(); // Atualiza a lista de veículos após o cadastro

    } catch (error) {
      console.error("Erro ao cadastrar veículo:", error);
      setMensagemCadastro("Erro ao cadastrar veículo. Por favor, tente novamente mais tarde.");

      setMensagemCadastro(
        editando 
        ? "Erro ao atualizar veículo. Por favor, tente novamente mais tarde."
        : "Erro ao cadastrar veículo. Por favor, tente novamente mais tarde."
      )
    } finally {
      setSalvando(false);
    }
  }

    async function excluirVeiculo(id: number) {
      const confirmou = window.confirm(
        "Tem certeza que deseja excluir este veículo?"
      );

      if (!confirmou) {
        return;
      }

      try {
        const resposta = await fetch(
          `http://localhost:8080/veiculos/${id}`,
          {
            method: "DELETE"
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao excluir veículo");
        }

        await carregarVeiculos();

        alert("Veículo excluído com sucesso!");

      } catch (erro) {
        console.error("Erro ao excluir veículo:", erro);
        alert("Não foi possível excluir o veículo.");
      }
    }

  return (
    <div className="catalogo">

      <h1>Catálogo de Veículos</h1>

      <p>Bem-Vindo a nossa Concessionária!</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          salvarVeiculo();
        }}
      >
        <h2>{idEmEdicao !== null ? "Editar veículo" : "Cadastrar veículo"}</h2>

        <input
          type="text"
          placeholder="Marca"
          value={novoVeiculo.marca}
          required
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              marca: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Modelo"
          value={novoVeiculo.modelo}
          required
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              modelo: e.target.value
            })
          }
        />

        <input
          type="number"
          placeholder="Ano"
          value={novoVeiculo.ano}
          required
          min="1900"
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              ano: Number(e.target.value)
            })
          }
        />

        <input
          type="text"
          placeholder="Cor"
          value={novoVeiculo.cor}
          required
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              cor: e.target.value
            })
          }
        />

        <input
          type="number"
          placeholder="Quilometragem"
          value={novoVeiculo.quilometragem}
          required
          min="0"
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              quilometragem: Number(e.target.value)
            })
          }
        />

        <input
          type="number"
          placeholder="Preço"
          value={novoVeiculo.preco}
          required
          min="0"
          step="0.01"
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              preco: Number(e.target.value)
            })
          }
        />

        <select
          value={novoVeiculo.status}
          onChange={(e) =>
            setNovoVeiculo({
              ...novoVeiculo,
              status: e.target.value as StatusVeiculo
            })
          }
        >
          <option value="DISPONIVEL">Disponível</option>
          <option value="RESERVADO">Reservado</option>
          <option value="VENDIDO">Vendido</option>
        </select>

        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : idEmEdicao !== null ? "Atualizar veículo" : "Cadastrar veículo"}
        </button>

        {idEmEdicao !== null && (
          <button
            type="button"
            disabled={salvando}
            onClick={() => {
              setIdEmEdicao(null);

              setNovoVeiculo({
                marca: "",
                modelo: "",
                ano: 2026,
                cor: "",
                quilometragem: 0,
                preco: 0,
                status: "DISPONIVEL"
              });

              setMensagemCadastro("");
            }}
          >
            Cancelar edição
          </button>
        )}

        {mensagemCadastro && <p>{mensagemCadastro}</p>}
      </form>

      {erroApi && (
        <p className="mensagem-erro">{erroApi}</p>
      )}

      {carregando && (
        <p>Carregando veículos...</p>
      )}

      <button onClick={carregarVeiculos} disabled={carregando}>
        {carregando ? "Atualizando..." : "Atualizar veículos"}
      </button>

      <button className={filtroStatus === "TODOS" ? "filtro-ativo" : ""} 
              onClick={() => setFiltroStatus("TODOS")}>
        Ver todos os veículos
      </button>

      <div className="pesquisa">
        <input
          type="text"
          placeholder="Pesquisar por marca ou modelo"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        >
        </input>
      </div>

      <h3>Filtrar veículos por status</h3>

      {/* Botões interativos de filtro */}
      <div className="filtros">

        <button
          className={
            filtroStatus === "DISPONIVEL" ? "filtro-ativo" : ""
          }
          onClick={() => setFiltroStatus("DISPONIVEL")}
        >
          Disponíveis
        </button>

        <button
          className={
            filtroStatus === "RESERVADO" ? "filtro-ativo" : ""
          }
          onClick={() => setFiltroStatus("RESERVADO")}
        >
          Reservados
        </button>

        <button
          className={
            filtroStatus === "VENDIDO" ? "filtro-ativo" : ""
          }
          onClick={() => setFiltroStatus("VENDIDO")}
        >
          Vendidos
        </button>

      </div>
      
      <h3>Ordenar veículos por preço</h3>

      <div className="ordenacao">
          <button className={ordemPreco === "CRESCENTE" ? "filtro-ativo" : ""}
          onClick={() => setOrdemPreco("CRESCENTE")}>
            Menor preço
          </button>

          <button className={ordemPreco === "DECRESCENTE" ? "filtro-ativo" : ""}
          onClick={() => setOrdemPreco("DECRESCENTE")}>
            Maior preço
          </button>
      </div>

      {/* Quantidade de veículos filtrados */}
      <p>
        {formatarTituloFiltro(filtroStatus)}:{" "}
        {veiculosDisponiveis.length}
      </p>

      {/* Mensagem para lista vazia */}
      {!carregando && !erroApi && veiculosDisponiveis.length === 0 && (
        <p>
          {busca.trim() !== "" ?
          `Nenhum veículo encontrado para a pesquisa: "${busca}"`
          :
          "Nenhum veículo encontrado para os filtros selecionados."
          }
        </p>
      )}
      {/* Cards gerados automaticamente */}
      {!carregando && !erroApi && (
        <>
        {veiculosOrdenados.map((carro) => (

          <div className="veiculo-card" key={carro.id}>

            <h2>
              {carro.marca} {carro.modelo}
            </h2>

            <p>Ano: {carro.ano}</p>

            <p>Cor: {carro.cor}</p>

            <p>
              Quilometragem:{" "}
              {carro.quilometragem.toLocaleString("pt-BR")} km
            </p>

            <h3>
              {carro.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </h3>

            <span>{formatarStatus(carro.status)}</span>

            <button
              type="button"
              onClick={() => iniciarEdicao(carro)}
            >
              Editar veículo
            </button>

            <button
              type="button"
              onClick={() => excluirVeiculo(carro.id)}
            >
              Excluir veículo
            </button>

          </div>

        ))}

        </>
      )}
    </div>
  );
}

export default App;
