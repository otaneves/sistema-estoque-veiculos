
import "./App.css";

function App() {
  const veiculo = {
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2022,
    cor: "Prata",
    quilometragem: 35000,
    preco: 115000,
    status: "DISPONIVEL"
  };

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

  return (
    <div className="catalogo">
      <h1>Catálogo de Veículos</h1>

      <p>Bem-Vindo a nossa Concessionária!</p>

      <button className="catalogo-button">
        Ver veículos disponíveis
      </button>

      <div className="veiculo-card">
        <h2>
          {veiculo.marca} {veiculo.modelo}
        </h2>

        <p>Ano: {veiculo.ano}</p>
        <p>Cor: {veiculo.cor}</p>

        <p>
          Quilometragem:{" "}
          {veiculo.quilometragem.toLocaleString("pt-BR")} km
        </p>

        <h3>
          {veiculo.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        </h3>

        <span>{formatarStatus(veiculo.status)}</span>
      </div>
    </div>
  );
}

export default App;
