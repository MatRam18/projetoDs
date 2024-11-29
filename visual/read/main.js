document.addEventListener("DOMContentLoaded", async () => {
    const atualizarButton = document.getElementById("atualizar");

    // Função para carregar os detalhes do relatório
    // Função para carregar os detalhes do relatório
function loadReportDetails(id, relatorios, tarefas) {
    const relatorio = relatorios.find(r => r.id == id);
    if (relatorio) {
        // Atualizar o botão "atualizar"
        atualizarButton.value = "ATUALIZAR";
        atualizarButton.onclick = function() {
            window.location.href = `../update/atualizarRelatorio.html?id=${relatorio.id}`;
        };

        // Buscar a tarefa correspondente ao tarefaId
        const tarefa = tarefas.find(t => t.id == relatorio.tarefaId);

        // Restante do código para carregar os detalhes do relatório
        document.getElementById('taskTittle').innerHTML = `<h1 class="nomeTaf">${relatorio.finalidade}</h1>`;
        document.getElementById('taskDate').innerHTML = `<h2>${new Date(relatorio.data).toLocaleDateString("pt-BR")}</h2>`;

        // Exibir o nome da tarefa correspondente ao relatorio.tarefaId
        document.getElementById('taskSetor').innerHTML = `<h3>Tarefa: ${tarefa ? tarefa.nome : 'Tarefa não encontrada'}</h3>`;

        document.getElementById('taskRes').innerHTML = `<h4>Componentes: ${relatorio.componentes}</h4>`;
        document.getElementById('taskDesc').innerHTML = `<h4>${relatorio.descricao}</h4>`;
    }
}


    // Função para carregar os detalhes da tarefa
    function loadTaskDetails(id, tarefas) {
        const tarefa = tarefas.find(t => t.id == id);
        if (tarefa) {
            // Atualizar o botão "atualizar"
            atualizarButton.value = "ATUALIZAR";
            atualizarButton.onclick = function() {
                window.location.href = `../update/atualizarTarefa.html?id=${tarefa.id}`;
            };

            // Restante do código para carregar os detalhes da tarefa
            document.getElementById('taskTittle').innerHTML = `<h1 class="nomeTaf">${tarefa.nome}</h1>`;
            document.getElementById('taskDate').innerHTML = `<h2>${new Date(tarefa.data).toLocaleDateString("pt-BR")}</h2>`;
            document.getElementById('taskSetor').innerHTML = `<h3>${tarefa.setor}</h3>`;
            document.getElementById('taskRes').innerHTML = `<h4>${tarefa.responsaveis}</h4>`;
            document.getElementById('taskDesc').innerHTML = `<h4>${tarefa.descricao}</h4>`;
        }
    }

    // Código existente para carregar as tarefas e relatórios e associar os eventos
    try {
        const taskResponse = await fetch("http://localhost:3031/tarefas");
        if (!taskResponse.ok) {
            throw new Error("Erro ao buscar tarefas");
        }
        const tarefas = await taskResponse.json();

        const reportResponse = await fetch("http://localhost:3031/relatorios");
        if (!reportResponse.ok) {
            throw new Error("Erro ao buscar relatórios");
        }
        const relatorios = await reportResponse.json();

        // Preencher a lista de relatórios
        relatorios.forEach(relatorio => {
            const row1 = document.createElement("tr");
            row1.dataset.id = relatorio.id;
            row1.innerHTML = `<td class="relatorioLista">${relatorio.finalidade}</td>`;

            row1.addEventListener("click", () => {
                const id = row1.dataset.id;
                loadReportDetails(id, relatorios, tarefas);
            });

            document.getElementById('finalidadeList').appendChild(row1);
        });

        // Preencher a lista de tarefas
        tarefas.forEach(tarefa => {
            const row1 = document.createElement("tr");
            row1.dataset.id = tarefa.id;
            row1.innerHTML = `<td>${tarefa.nome}</td>`;

            row1.addEventListener("click", () => {
                const id = row1.dataset.id;
                loadTaskDetails(id, tarefas);
            });

            document.getElementById('taskName').querySelector('tbody').appendChild(row1);
        });

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
});
