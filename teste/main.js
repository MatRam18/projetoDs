document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#taskTable tbody");

    try {
        const response = await fetch("http://localhost:3031/mostrarTask");
        if (!response.ok) {
            throw new Error("Erro ao buscar os dados");
        }

        const tarefas = await response.json();

        tarefas.forEach(tarefa => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tarefa.id}</td>
                <td>${tarefa.nome}</td>
                <td>${tarefa.descricao}</td>
                <td>${new Date(tarefa.data).toLocaleDateString("pt-BR")}</td>
                <td>${tarefa.responsaveis}</td>
                <td>${tarefa.setor}</td>
                <td>${tarefa.relatorioId}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        const errorRow = document.createElement("tr");
        errorRow.innerHTML = `<td colspan="7">Erro ao carregar tarefas: ${error.message}</td>`;
        tableBody.appendChild(errorRow);
    }
});
