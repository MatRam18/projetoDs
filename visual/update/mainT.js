// Função para exibir os detalhes da tarefa com base no ID da URL
async function exibirDetalhes() {
    const tarefaId = obterIdDaURL();  // Captura o id da URL
  
    // Se não houver ID na URL, não faz nada
    if (!tarefaId) return;
  
    try {
        // Requisição para buscar todas as tarefas
        const resposta = await fetch('http://localhost:3031/tarefas');
  
        // Verificar se a resposta foi bem-sucedida
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.statusText}`);
        }
  
        // Tentar analisar a resposta como JSON
        const tarefas = await resposta.json();
  
        // Procurar a tarefa com o id correspondente
        const tarefa = tarefas.find(t => t.id == tarefaId);
  
        // Se a tarefa não for encontrada, mostrar erro
        if (!tarefa) {
            throw new Error(`Tarefa com ID ${tarefaId} não encontrada`);
        }
  
        // Exibir as informações no aside
        document.getElementById("nomeTarefaRelato").textContent = tarefa.nome;
        document.getElementById("descricaoTarefaRelato").textContent = tarefa.descricao;
  
        // Formatar a data para o formato brasileiro (dd/mm/aaaa)
        const dataFormatada = formatarData(brParserDate(tarefa.data)); // Aqui a data é convertida corretamente
        document.getElementById("dataTarefaRelato").textContent = dataFormatada;
  
        document.getElementById("responsaveisTarefaRelato").textContent = tarefa.responsaveis;
        document.getElementById("setorTarefaRelato").textContent = tarefa.setor;
  
    } catch (erro) {
        console.error("Erro ao buscar as tarefas:", erro);
        alert("Erro ao buscar as tarefas. Verifique a URL ou a resposta do servidor.");
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
  
  // Função para atualizar a tarefa
  async function atualizarTarefa() {
    const tarefaId = obterIdDaURL();  // Captura o id da URL
  
    if (!tarefaId) {
      alert("ID da tarefa não encontrado na URL.");
      return;
    }
  
    // Pega os dados dos campos de input e textarea
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const data = document.getElementById("data").value;
    const responsaveis = document.getElementById("responsaveis").value;
    const setor = document.getElementById("setor").value;
  
    // Prepara o corpo da requisição
    const dadosAtualizados = {};
  
    if (nome) dadosAtualizados.nome = nome;
    if (descricao) dadosAtualizados.descricao = descricao;
    if (data) dadosAtualizados.data = data;
    if (responsaveis) dadosAtualizados.responsaveis = responsaveis;
    if (setor) dadosAtualizados.setor = setor;
  
    // Se nenhum campo for preenchido, alerta e não faz a requisição
    if (Object.keys(dadosAtualizados).length === 0) {
      alert("Pelo menos um campo deve ser preenchido.");
      return;
    }
  
    try {
      // Envia a requisição PUT para atualizar a tarefa
      const resposta = await fetch(`http://localhost:3031/tarefa/${tarefaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosAtualizados),
      });
  
      // Verifica se a requisição foi bem-sucedida
      if (!resposta.ok) {
        throw new Error("Erro ao atualizar a tarefa");
      }
  
      const resultado = await resposta.json();
      alert("Tarefa atualizada com sucesso!");
  
      // Redirecionar para a página de leitura de tarefas após a atualização
      window.location.href = '../read/index.html';
  
    } catch (erro) {
      console.error("Erro ao atualizar a tarefa:", erro);
      alert("Erro ao atualizar a tarefa. Tente novamente.");
    }
  }
  
  // Carregar os detalhes da tarefa na página
  window.onload = function() {
    exibirDetalhes();  // Exibe os detalhes da tarefa com base no id da URL
  };
  