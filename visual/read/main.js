document.addEventListener("DOMContentLoaded", async () => {
    const tableName = document.querySelector("#taskName tbody");
    const finalidadeList = document.querySelector("#finalidadeList");

    try {
        // Carregar tarefas
        const taskResponse = await fetch("http://localhost:3031/tarefas");
        if (!taskResponse.ok) {
            throw new Error("Erro ao buscar tarefas");
        }
        const tarefas = await taskResponse.json();

        // Carregar relatórios
        const reportResponse = await fetch("http://localhost:3031/relatorios");
        if (!reportResponse.ok) {
            throw new Error("Erro ao buscar relatórios");
        }
        const relatorios = await reportResponse.json();

        // Preencher a lista de relatórios
        relatorios.forEach(relatorio => {
            const row1 = document.createElement("tr");
            row1.dataset.id = relatorio.id;  // Armazenando o id na linha
            row1.innerHTML = `<td class="relatorioLista">${relatorio.finalidade}</td>`;
        
            // Tornando a linha clicável
            row1.addEventListener("click", () => {
                const id = row1.dataset.id;  // Pegando o id do relatório clicado
                loadReportDetails(id, relatorios, tarefas);  // Chama a função para carregar os detalhes do relatório
            });
        
            finalidadeList.appendChild(row1);
        });        

        // Preencher a lista de tarefas
        tarefas.forEach(tarefa => {
            const row1 = document.createElement("tr");
            row1.dataset.id = tarefa.id;  // Armazenando o id na linha
            row1.innerHTML = `<td>${tarefa.nome}</td>`;
            
            // Tornando a linha clicável
            row1.addEventListener("click", () => {
                const id = row1.dataset.id;  // Pegando o id do item clicado
                loadTaskDetails(id, tarefas);  // Chama a função para carregar os detalhes da tarefa
            });

            tableName.appendChild(row1);
        });

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }

    // Função para carregar detalhes da tarefa
    function loadTaskDetails(id, tarefas) {
        const tarefa = tarefas.find(t => t.id == id);
        if (tarefa) {
            document.getElementById('taskTittle').innerHTML = `<h1 class="nomeTaf">${tarefa.nome}</h1>`;
            document.getElementById('taskDate').innerHTML = `<h2>${new Date(tarefa.data).toLocaleDateString("pt-BR")}</h2>`;
            document.getElementById('taskSetor').innerHTML = `<h3>${tarefa.setor}</h3>`;
            document.getElementById('taskRes').innerHTML = `<h4>${tarefa.responsaveis}</h4>`;
            document.getElementById('taskDesc').innerHTML = `<h4>${tarefa.descricao}</h4>`;
        }
    }

    // Função para carregar detalhes do relatório
    function loadReportDetails(id, relatorios, tarefas) {
        const relatorio = relatorios.find(r => r.id == id);
        if (relatorio) {
            // Encontrar a tarefa associada ao relatório
            const tarefa = tarefas.find(t => t.id == relatorio.tarefaId);

            // Exibir os detalhes do relatório e o nome da tarefaS
            document.getElementById('taskTittle').innerHTML = `<h1 class="nomeTaf">${relatorio.finalidade}</h1>`;
            document.getElementById('taskDate').innerHTML = `<h2>${new Date(relatorio.data).toLocaleDateString("pt-BR")}</h2>`;

            if (tarefa) {
                document.getElementById('taskSetor').innerHTML = `<h3>Tarefa: ${tarefa.nome}</h3>`;  // Exibe o nome da tarefa associada
            } else {
                document.getElementById('taskSetor').innerHTML = `<h3>Tarefa não encontrada</h3>`;
            }

            document.getElementById('taskRes').innerHTML = `<h4>Componentes: ${relatorio.componentes}</h4>`;
            document.getElementById('taskDesc').innerHTML = `<h4>${relatorio.descricao}</h4>`;
        }
    }
});
