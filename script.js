async function carregarDados() {
  const resposta = await fetch("dados.csv"); 
  const texto = await resposta.text();

  const linhas = texto.trim().split("\n");
  const cabecalho = linhas[0].split(";");

  const dados = linhas.slice(1).map(linha => {
    const valores = linha.split(";");
    const registro = {};
    cabecalho.forEach((coluna, i) => registro[coluna.trim()] = valores[i].trim());
    return registro;
  });

  return dados;
}

function agruparPorDia(dados) {
  const agrupado = {};
  dados.forEach(item => {
    const dia = item.Data; 
    agrupado[dia] = (agrupado[dia] || 0) + 1;
  });
  return agrupado;
}

function agruparPorSemana(dados) {
  const agrupado = {};
  dados.forEach(item => {
    const semana = `Semana ${item.Semana}`;
    agrupado[semana] = (agrupado[semana] || 0) + 1;
  });
  return agrupado;
}

function preencherTabela(dados) {
  const corpo = document.getElementById("tabelaDados");
  corpo.innerHTML = "";
  dados.forEach(item => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.Data}</td>
      <td>${item.Hora}</td>
      <td>${item.Semana}</td>
    `;
    corpo.appendChild(linha);
  });
}

async function iniciarDashboard() {
  const dados = await carregarDados();
  preencherTabela(dados);

  const diario = agruparPorDia(dados);
  new Chart(document.getElementById("graficoDiario"), {
    type: "bar",
    data: {
      labels: Object.keys(diario),
      datasets: [{
        label: "Aberturas por Dia",
        data: Object.values(diario),
        backgroundColor: "#0077b6"
      }]
    }
  });

  const semanal = agruparPorSemana(dados);
  new Chart(document.getElementById("graficoSemanal"), {
    type: "line",
    data: {
      labels: Object.keys(semanal),
      datasets: [{
        label: "Aberturas por Semana",
        data: Object.values(semanal),
        borderColor: "#ff6f61",
        fill: false
      }]
    }
  });
}

iniciarDashboard();
