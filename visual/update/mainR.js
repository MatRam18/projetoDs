// Função para exibir os detalhes do relatório com base no ID da URL
async function exibirDetalhes() {
  const relatorioId = obterIdDaURL();  // Captura o id da URL

  // Se não houver ID na URL, não faz nada
  if (!relatorioId) return;

  try {
      // Requisição para buscar todos os relatórios
      const resposta = await fetch('http://localhost:3031/relatorios');

      // Verificar se a resposta foi bem-sucedida
      if (!resposta.ok) {
          throw new Error(`Erro na requisição: ${resposta.statusText}`);
      }

      // Tentar analisar a resposta como JSON
      const relatorios = await resposta.json();

      // Procurar o relatório com o id correspondente
      const relatorio = relatorios.find(r => r.id == relatorioId);

      // Se o relatório não for encontrado, mostrar erro
      if (!relatorio) {
          throw new Error(`Relatório com ID ${relatorioId} não encontrado`);
      }

      // Requisição para buscar todas as tarefas (para obter o nome da tarefa pelo id)
      const respostaTarefas = await fetch('http://localhost:3031/tarefas');
      if (!respostaTarefas.ok) {
          throw new Error(`Erro ao buscar as tarefas: ${respostaTarefas.statusText}`);
      }
      const tarefas = await respostaTarefas.json();

      // Encontrar o nome da tarefa com base no tarefaId do relatório
      const tarefa = tarefas.find(t => t.id == relatorio.tarefaId);

      // Exibir as informações no aside
      document.getElementById("finalidadeRelato").textContent = relatorio.finalidade;

      // Formatar a data para o formato brasileiro (dd/mm/aaaa)
      const dataFormatada = formatarData(brParserDate(relatorio.data)); // Aqui a data é convertida corretamente
      document.getElementById("dataRelato").textContent = dataFormatada;

      document.getElementById("descricaoRelato").textContent = relatorio.descricao;
      document.getElementById("componenteRelato").textContent = relatorio.componentes;
      document.getElementById("tarefaRelato").textContent = tarefa ? tarefa.nome : "Nenhuma tarefa";

  } catch (erro) {
      console.error("Erro ao buscar os relatórios:", erro);
      alert("Erro ao buscar os relatórios. Verifique a URL ou a resposta do servidor.");
  }
}


// Função para formatar a data no formato brasileiro (dd/mm/aaaa)
function formatarData(data) {
  const dia = data.getDate().toString().padStart(2, '0'); // Adiciona 0 à frente de dias menores que 10
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 0 à frente de meses menores que 10
  const ano = data.getFullYear(); // Pega o ano

  return `${dia}/${mes}/${ano}`;
}


// Função para converter a string de data para um objeto Date
function brParserDate(dataStr) {
  const [dia, mes, ano] = dataStr.split('/');
  
  // Criando a data corretamente usando a abordagem yyyy-mm-dd
  return new Date(`${ano}-${mes}-${dia}`);
}




// Função para obter o ID da URL
function obterIdDaURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');  // Obtém o valor do parâmetro 'id' na URL
}

// Função para preencher o select de tarefas
async function preencherTarefas() {
  try {
      const resposta = await fetch('http://localhost:3031/tarefas');
      const tarefas = await resposta.json();

      // Seleciona o campo select de tarefas
      const tarefaSelect = document.getElementById("tarefa");

      // Limpa as opções existentes
      tarefaSelect.innerHTML = "<option value=''>Nenhuma tarefa</option>";

      // Preenche o select com as tarefas
      tarefas.forEach(tarefa => {
          const option = document.createElement("option");
          option.value = tarefa.id;
          option.textContent = tarefa.nome;
          tarefaSelect.appendChild(option);
      });
  } catch (erro) {
      console.error("Erro ao carregar as tarefas: ", erro);
  }
}

// Função para atualizar o relatório
async function atualizarRelatorio() {
  const relatorioId = obterIdDaURL();  // Captura o id da URL
  
  // Verifica se há um ID na URL, caso contrário, não faz nada
  if (!relatorioId) {
    alert("ID do relatório não encontrado na URL.");
    return;
  }

  // Pega os dados dos campos de input e textarea
  const finalidade = document.getElementById("finalidade").value;
  const dataRelatorio = document.getElementById("dataRelatorio").value;
  const descricao = document.getElementById("descricaoRelatorio").value;
  const componente = document.getElementById("componente").value;  // Garantir que o campo componente está sendo capturado corretamente
  const tarefaId = document.getElementById("tarefa").value;  // ID da tarefa selecionada no select
  
  console.log("Componente Capturado:", componente);  // Log para verificar o valor do componente

  // Prepara o corpo da requisição, incluindo apenas os campos preenchidos
  const dadosAtualizados = {};
  
  if (finalidade) dadosAtualizados.finalidade = finalidade;
  if (dataRelatorio) dadosAtualizados.data = dataRelatorio;
  if (descricao) dadosAtualizados.descricao = descricao;
  if (componente) dadosAtualizados.componentes = componente;  // Garantir que 'componente' está sendo enviado corretamente
  if (tarefaId) dadosAtualizados.tarefaId = tarefaId;

  // Se nenhum campo for preenchido, alerta e não faz a requisição
  if (Object.keys(dadosAtualizados).length === 0) {
    alert("Pelo menos um campo deve ser preenchido.");
    return;
  }

  console.log("Dados Atualizados:", dadosAtualizados);  // Log para verificar os dados enviados

  try {
    // Envia a requisição PUT para atualizar o relatório
    const resposta = await fetch(`http://localhost:3031/relatorio/${relatorioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizados),
    });

    // Verifica se a requisição foi bem-sucedida
    if (!resposta.ok) {
      throw new Error("Erro ao atualizar o relatório");
    }

    const resultado = await resposta.json();
    alert("Relatório atualizado com sucesso!");

    // Redirecionar para a página de leitura de relatórios após a atualização
    window.location.href = '../read/index.html';

  } catch (erro) {
    console.error("Erro ao atualizar o relatório:", erro);
    alert("Erro ao atualizar o relatório. Tente novamente.");
  }
}



// Carregar as tarefas e exibir os detalhes do relatório na página
window.onload = function() {
  preencherTarefas();  // Preenche o select de tarefas
  exibirDetalhes();  // Exibe os detalhes do relatório com base no id da URL
};
