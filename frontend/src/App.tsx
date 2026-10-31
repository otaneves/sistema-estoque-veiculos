
import { useState } from "react";
import "./App.css";

function App() {

  // Lista de veículos
  const veiculos = [
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
    useState("DISPONIVEL");

  // Filtra os veículos pelo status selecionado
  const veiculosDisponiveis = veiculos.filter((carro) => {
    return carro.status === filtroStatus;
  });

  // Formata o status exibido no card
  function formatarStatus(status: string): string {
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
  function formatarTituloFiltro(status: string): string {
    switch (status) {
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

      <button className="catalogo-button">
        Ver veículos disponíveis
      </button>

      {/* Botões interativos de filtro */}
      <div className="filtros">

        <button
          onClick={() => setFiltroStatus("DISPONIVEL")}
        >
          Disponíveis
        </button>

        <button
          onClick={() => setFiltroStatus("RESERVADO")}
        >
          Reservados
        </button>

        <button
          onClick={() => setFiltroStatus("VENDIDO")}
        >
          Vendidos
        </button>

      </div>

      {/* Quantidade de veículos filtrados */}
      <p>
        {formatarTituloFiltro(filtroStatus)}:{" "}
        {veiculosDisponiveis.length}
      </p>

      {/* Mensagem para lista vazia */}
      {veiculosDisponiveis.length === 0 && (
        <p>Nenhum veículo disponível no momento.</p>
      )}

      {/* Cards gerados automaticamente */}
      {veiculosDisponiveis.map((carro) => (

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
