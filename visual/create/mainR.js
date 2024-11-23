// mainR.js

// Função para carregar as tarefas na caixa de seleção
async function carregarTarefas() {
    try {
      // Fetch todas as tarefas da API
      const resposta = await fetch('http://localhost:3031/tarefas');
      const tarefas = await resposta.json();
  
      // Pegue a referência do input select
      const selectTarefa = document.getElementById('tarefa');
  
      // Crie a opção padrão
      const opcaoPadrao = document.createElement('option');
      opcaoPadrao.text = 'Selecione a Tarefa';
      opcaoPadrao.value = '';  // valor vazio, para indicar que nenhuma tarefa foi selecionada
      selectTarefa.appendChild(opcaoPadrao);
  
      // Preencha o select com as tarefas do banco
      tarefas.forEach(tarefa => {
        const option = document.createElement('option');
        option.value = tarefa.id; // A chave primária da tarefa
        option.text = tarefa.nome; // Nome da tarefa para exibir
        selectTarefa.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }
  
  // Função para enviar os dados do formulário e criar o relatório
  async function cadastrarRelatorio(event) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário
  
    // Obter os dados dos inputs do formulário
    const tarefaId = document.getElementById('tarefa').value;
    const finalidade = document.getElementById('finalidade').value;
    const dataRelatorio = document.getElementById('dataRelatorio').value;
    const descricaoRelatorio = document.getElementById('descricaoRelatorio').value;
    const componente = document.getElementById('componente').value;
  
    // Verificar se todos os campos foram preenchidos
    if (!tarefaId || !finalidade || !dataRelatorio || !descricaoRelatorio || !componente) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  
    // Preparar os dados para enviar para o backend
    const dadosRelatorio = {
      finalidade,
      data: dataRelatorio,
      descricao: descricaoRelatorio,
      componentes: componente,
      tarefaId: tarefaId, // ID da tarefa selecionada
    };
  
    try {
      // Enviar os dados para criar o relatório
      const resposta = await fetch('http://localhost:3031/relatorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosRelatorio),
      });
  
      const resultado = await resposta.json();
  
      if (resposta.ok) {
        // Exibir alert de sucesso
        alert('Relatório criado com sucesso!');
  
        // Após o alerta, redirecionar para a página de leitura
        window.location.href = '../read/index.html';
      } else {
        // Se houver erro, exibir o erro
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      alert(`Erro ao enviar o relatório: ${error.message}`);
    }
  }
  
  // Adicionar evento de envio do formulário
  document.getElementById('formRelatorio').addEventListener('submit', cadastrarRelatorio);
  
  // Carregar tarefas ao carregar a página
  window.onload = carregarTarefas;
  