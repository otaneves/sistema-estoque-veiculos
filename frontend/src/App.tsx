import './App.css';
import {useState} from "react";

function App() {

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

  const carro = [
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

  const [filtroStatus, setFiltroStatus] = useState("DISPONIVEL");

  const veiculosDisponiveis = carro.filter((carro) => carro.status === filtroStatus);

  console.log("Veículos disponíveis:", veiculosDisponiveis);

  return (
    <div className="catalogo">
      <h1>Catálogo de Veículos</h1>

      <p>Bem-Vindo a nossa Concessionária!</p>

      <button>
        Ver veículos disponíveis
      </button>

      <div className="filtros">
        <button onClick={() => setFiltroStatus("DISPONIVEL")}>Disponíveis</button>
        <button onClick={() => setFiltroStatus("RESERVADO")}>Reservados</button>
        <button onClick={() => setFiltroStatus("VENDIDO")}>Vendidos</button>
      </div>

      {veiculosDisponiveis.length === 0 ? (
        <p>Não há veículos disponíveis no momento.</p>
      ) : (
        <p>Confira os veículos disponíveis abaixo:</p>
      )}

      {veiculosDisponiveis.map((carro) => (
        <div className="veiculo-card" key={carro.id}>
          <h2>{carro.marca} {carro.modelo}</h2>

          <p>Ano: {carro.ano}</p>
          <p>Cor: {carro.cor}</p>
          
          <p>Quilometragem: {carro.quilometragem.toLocaleString('pt-BR')} km</p>
          <h3>{carro.preco.toLocaleString('pt-BR', {style:"currency", currency: "BRL", minimumFractionDigits: 2 })}</h3>
          <span>{formatarStatus(carro.status)}</span>
        </div>
      ))}

    </div>
  );
}

export default App;