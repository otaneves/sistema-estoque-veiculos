
import { useState } from "react";
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
function App() {

  // Lista de veículos
  const veiculos: Veiculo[] = [
    {
      id: 1,
      marca: "Toyota",
      modelo: "Corolla",
      ano: 2022,
      cor: "Prata",
      quilometragem: 35000,
      preco: 115000,
      status: "DISPONIVEL"
    },
    {
      id: 2,
      marca: "Honda",
      modelo: "Civic",
      ano: 2023,
      cor: "Preto",
      quilometragem: 18000,
      preco: 135000,
      status: "RESERVADO"
    },
    {
      id: 3,
      marca: "Volkswagen",
      modelo: "Golf",
      ano: 2021,
      cor: "Branco",
      quilometragem: 42000,
      preco: 98000,
      status: "VENDIDO"
    }
  ];

  // Estado responsável pelo filtro selecionado
  const [filtroStatus, setFiltroStatus] =
    useState<FiltroVeiculo>("DISPONIVEL");

  const [ordemPreco, setOrdemPreco] = useState<OrdemPreco>("CRESCENTE");

  const [busca, setBusca] = useState("");

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

  return (
    <div className="catalogo">

      <h1>Catálogo de Veículos</h1>

      <p>Bem-Vindo a nossa Concessionária!</p>

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
      {veiculosDisponiveis.length === 0 && (
        <p>
          {busca.trim() !== "" ?
          `Nenhum veículo encontrado para a pesquisa: "${busca}"`
          :
          "Nenhum veículo encontrado para os filtros selecionados."
          }
        </p>
      )}
      {/* Cards gerados automaticamente */}
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

        </div>

      ))}

    </div>
  );
}

export default App;
