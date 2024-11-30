document.addEventListener("DOMContentLoaded", async () => {
    const atualizarButton = document.getElementById("atualizar");

    // Função para formatar a data no formato dd/mm/yyyy
    function formatDate(dateString) {
        const date = new Date(dateString);
        // Ajustar para o UTC sem fazer alterações no fuso horário
        const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

        // Converter para o formato desejado (dd/mm/yyyy)
        const day = String(utcDate.getUTCDate()).padStart(2, '0');
        const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0'); // Meses começam de 0
        const year = utcDate.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

    // Função para carregar os detalhes do relatório
    function loadReportDetails(id, relatorios, tarefas) {
        const relatorio = relatorios.find(r => r.id == id);
        if (relatorio) {
            atualizarButton.value = "ATUALIZAR";
            atualizarButton.onclick = function() {
                window.location.href = `../update/atualizarRelatorio.html?id=${relatorio.id}`;
            };

            const tarefa = tarefas.find(t => t.id == relatorio.tarefaId);

            document.getElementById('taskTittle').innerHTML = `<h1 class="nomeTaf">${relatorio.finalidade}</h1>`;
            document.getElementById('taskDate').innerHTML = `<h2>${formatDate(relatorio.data)}</h2>`;
            document.getElementById('taskSetor').innerHTML = `<h3>Tarefa: ${tarefa ? tarefa.nome : 'Tarefa não encontrada'}</h3>`;
            document.getElementById('taskRes').innerHTML = `<h4>Componentes: ${relatorio.componentes}</h4>`;
            document.getElementById('taskDesc').innerHTML = `<h4>${relatorio.descricao}</h4>`;
        }
    }

    // Função para carregar os detalhes da tarefa
    function loadTaskDetails(id, tarefas) {
        const tarefa = tarefas.find(t => t.id == id);
        if (tarefa) {
            atualizarButton.value = "ATUALIZAR";
            atualizarButton.onclick = function() {
                window.location.href = `../update/atualizarTarefa.html?id=${tarefa.id}`;
            };

            document.getElementById('taskTittle').innerHTML = `<h1 class="nomeTaf">${tarefa.nome}</h1>`;
            document.getElementById('taskDate').innerHTML = `<h2>${formatDate(tarefa.data)}</h2>`;
            document.getElementById('taskSetor').innerHTML = `<h3>${tarefa.setor}</h3>`;
            document.getElementById('taskRes').innerHTML = `<h4>${tarefa.responsaveis}</h4>`;
            document.getElementById('taskDesc').innerHTML = `<h4>${tarefa.descricao}</h4>`;
        }
    }

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
function formatDate(dateString) {
    // Criar a data em UTC
    const date = new Date(dateString);
    // Ajustar para o UTC sem fazer alterações no fuso horário
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    // Converter para o formato desejado (dd/mm/yyyy)
    const day = String(utcDate.getUTCDate()).padStart(2, '0');
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0'); // Meses começam de 0
    const year = utcDate.getUTCFullYear();

    return `${day}/${month}/${year}`;
}
