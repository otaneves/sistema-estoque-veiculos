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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d712685 (feat: Adicionando filtros de exibição e condição para pesquisas sem retorno)
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

<<<<<<< HEAD
<<<<<<< HEAD
  const [filtroStatus, setFiltroStatus] = useState("DISPONIVEL");

  const veiculosDisponiveis = carro.filter((carro) => carro.status === filtroStatus);

  console.log("Veículos disponíveis:", veiculosDisponiveis);
=======
  const veiculo = {
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2022,
    cor: "Prata",
    quilometragem: 35000,
    preco: 115000,
    status: "DISPONIVEL"
  };
>>>>>>> 1de8164 (feat(frontend): Adicionando dados dinâmicos e formatação de veiculos)
=======
  const veiculosDisponiveis = carro.filter((carro) => carro.status === "DISPONIVEL");
=======
  const [filtroStatus, setFiltroStatus] = useState("DISPONIVEL");

  const veiculosDisponiveis = carro.filter((carro) => carro.status === filtroStatus);
>>>>>>> b51f51e (feat: (frontend) Adicionando botão interativo para filtro de visibilidade)

  console.log("Veículos disponíveis:", veiculosDisponiveis);
>>>>>>> d712685 (feat: Adicionando filtros de exibição e condição para pesquisas sem retorno)

  return (
    <div className="catalogo">
      <h1>Catálogo de Veículos</h1>

      <p>Bem-Vindo a nossa Concessionária!</p>

      <button>
        Ver veículos disponíveis
      </button>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b51f51e (feat: (frontend) Adicionando botão interativo para filtro de visibilidade)
      <div className="filtros">
        <button onClick={() => setFiltroStatus("DISPONIVEL")}>Disponíveis</button>
        <button onClick={() => setFiltroStatus("RESERVADO")}>Reservados</button>
        <button onClick={() => setFiltroStatus("VENDIDO")}>Vendidos</button>
      </div>

<<<<<<< HEAD
=======
>>>>>>> d712685 (feat: Adicionando filtros de exibição e condição para pesquisas sem retorno)
=======
>>>>>>> b51f51e (feat: (frontend) Adicionando botão interativo para filtro de visibilidade)
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
<<<<<<< HEAD

=======
      <div className="veiculo-card">
        <h2>{veiculo.marca} {veiculo.modelo}</h2>
        <p>Ano: {veiculo.ano}</p>
        <p>Cor: {veiculo.cor}</p>
        <p>Quilometragem: {veiculo.quilometragem.toLocaleString('pt-BR')} km</p>
        <h3>R$ {veiculo.preco.toLocaleString('pt-BR', {style:"currency", currency: "BRL", minimumFractionDigits: 2 })}</h3>
        <span>{formatarStatus(veiculo.status)}</span>
      </div>
=======
>>>>>>> d712685 (feat: Adicionando filtros de exibição e condição para pesquisas sem retorno)

>>>>>>> 1de8164 (feat(frontend): Adicionando dados dinâmicos e formatação de veiculos)
    </div>
  );
}

export default App;