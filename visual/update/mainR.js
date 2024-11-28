// Função para preencher os relatórios no select
// Função para preencher os relatórios no select
async function preencherRelatorios() {
    const relatorioSelect = document.getElementById("relatorio");
    const tarefaSelect = document.getElementById("tarefa");
    
    // Preencher o select de relatórios
    const respostaRelatorios = await fetch("http://localhost:3031/relatorios");
    const relatorios = await respostaRelatorios.json();
    relatorios.forEach(relatorio => {
        const option = document.createElement("option");
        option.value = relatorio.id;
        option.textContent = relatorio.finalidade;
        relatorioSelect.appendChild(option);
    });

    // Preencher o select de tarefas
    const respostaTarefas = await fetch("http://localhost:3031/tarefas");
    const tarefas = await respostaTarefas.json();
    tarefas.forEach(tarefa => {
        const option = document.createElement("option");
        option.value = tarefa.id;
        option.textContent = tarefa.nome;
        tarefaSelect.appendChild(option);
    });
}


// Função para exibir os detalhes do relatório selecionado
// Função para exibir os detalhes do relatório selecionado
// Função para exibir os detalhes do relatório selecionado
async function exibirDetalhes() {
    const relatorioId = document.getElementById("relatorio").value;

    // Se não houver seleção, não faz nada
    if (!relatorioId) return;

    try {
        // Requisição para buscar o relatório pelo ID
        const resposta = await fetch(`http://localhost:3031/relatorio/${relatorioId}`);
        const relatorio = await resposta.json();

        // Preencher os campos de formulário com os dados do relatório
        document.getElementById("finalidade").value = relatorio.finalidade;
        document.getElementById("dataRelatorio").value = relatorio.data;
        document.getElementById("descricaoRelatorio").value = relatorio.descricao;
        document.getElementById("componente").value = relatorio.componentes;

        // Preencher a tabela com os detalhes do relatório
        document.getElementById("relato").rows[0].cells[0].textContent = `Finalidade: ${relatorio.finalidade}`;
        document.getElementById("relato").rows[1].cells[0].textContent = `Data: ${relatorio.data}`;
        document.getElementById("relato").rows[2].cells[0].textContent = `Componente: ${relatorio.componentes}`;
        document.getElementById("relato").rows[3].cells[0].textContent = `Descrição: ${relatorio.descricao}`;
        
        // Exibir a tarefa associada, se houver
        const tarefaSelect = document.getElementById("tarefa");
        if (relatorio.tarefaId) {
            tarefaSelect.value = relatorio.tarefaId; // Preenche com o ID da tarefa associada
            document.getElementById("relato").rows[4].cells[0].textContent = `Tarefa: ${relatorio.tarefaId}`; // Exibe o ID da tarefa na tabela
        } else {
            tarefaSelect.value = ""; // Limpa o campo de tarefa se não houver tarefa associada
            document.getElementById("relato").rows[4].cells[0].textContent = `Tarefa: Nenhuma tarefa associada`;
        }
    } catch (erro) {
        console.error("Erro ao buscar o relatório: ", erro);
    }
}



// Função para atualizar o relatório com os dados preenchidos
// Função para atualizar o relatório com os dados preenchidos
async function atualizarRelatorio() {
    const relatorioId = document.getElementById("relatorio").value;
    const finalidade = document.getElementById("finalidade").value;
    const data = document.getElementById("dataRelatorio").value;
    const descricao = document.getElementById("descricaoRelatorio").value;
    const componentes = document.getElementById("componente").value;
    const tarefaId = document.getElementById("tarefa").value;

    if (!relatorioId) {
        alert("Selecione um relatório para atualizar!");
        return;
    }

    // Cria um objeto para enviar com apenas os campos preenchidos
    const dados = {};
    if (finalidade) dados.finalidade = finalidade;
    if (data) dados.data = data;
    if (descricao) dados.descricao = descricao;
    if (componentes) dados.componentes = componentes;
    if (tarefaId) dados.tarefaId = tarefaId; // Inclui o ID da tarefa se houver

    try {
        const resposta = await fetch(`http://localhost:3031/relatorio/${relatorioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();
        if (resposta.ok) {
            alert("Relatório atualizado com sucesso!");
            window.location.href = "../read/index.html";  // Redireciona para a página de leitura
        } else {
            alert("Erro ao atualizar relatório: " + resultado.erro);
        }
    } catch (erro) {
        alert("Erro ao atualizar relatório: " + erro.message);
    }
}


// Carregar os relatórios ao iniciar a página
window.onload = preencherRelatorios;
