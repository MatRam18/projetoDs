// Função para carregar as tarefas no select
async function carregarTarefas() {
    try {
        const response = await fetch('http://localhost:3031/tarefas');
        const tarefas = await response.json();
        const selectTarefa = document.getElementById('tarefa');
        
        // Limpa as opções existentes
        selectTarefa.innerHTML = '';

        // Preenche o select com as tarefas
        tarefas.forEach(tarefa => {
            const option = document.createElement('option');
            option.value = tarefa.id;
            option.textContent = tarefa.nome;
            selectTarefa.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

// Função para exibir os detalhes da tarefa selecionada
async function exibirDetalhes() {
    const tarefaId = document.getElementById('tarefa').value;

    if (!tarefaId) return;  // Se não houver seleção, não faz nada

    try {
        // Chama a API para buscar os detalhes da tarefa
        const response = await fetch(`http://localhost:3031/tarefas`);
        const tarefa = await response.json();

        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            // Atualiza os campos com os detalhes da tarefa
            tarefa.forEach(tarefas => {
                const tarefaId = document.getElementById('tarefa').value;
                if (tarefaId.value === tarefas.id){
                document.getElementById('nomeT').textContent = `Nome: ${tarefas.nome}`;
                document.getElementById('setorT').textContent = `Setor: ${tarefas.setor}`;
                document.getElementById('dataT').textContent = `Data: ${new Date(tarefas.data).toLocaleDateString()}`;
                document.getElementById('respT').textContent = `Responsáveis: ${tarefas.responsaveis}`;
                document.getElementById('descT').textContent = `Descrição: ${tarefas.descricao}`;
            }})
            
        } else {
            // Se não encontrar a tarefa, exibe um erro
            alert('Tarefa não encontrada!');
        }
    } catch (error) {
        console.error('Erro ao exibir os detalhes da tarefa:', error);
    }
}


// Função para mostrar a confirmação de exclusão
function confirmarApagar() {
    const tarefaId = document.getElementById('tarefa').value;
    
    if (!tarefaId) return;

    const certeza = document.getElementById('certeza');
    certeza.innerHTML = `
        <p>Você tem certeza de que quer apagar essa tarefa?</p>
        <button class="confirmar" onclick="apagarTarefa(${tarefaId})">Confirmar</button>
    `;
}

// Função para apagar a tarefa
async function apagarTarefa(tarefaId) {
    try {
        const response = await fetch(`http://localhost:3031/tarefa/${tarefaId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
            alert('Tarefa apagada com sucesso');
            window.location.href = '../read/index.html';
        } else {
            alert(result.mensagem || 'Erro ao apagar tarefa');
        }
    } catch (error) {
        console.error('Erro ao apagar a tarefa:', error);
        alert('Erro ao apagar a tarefa');
    }
}

// Chama a função para carregar as tarefas quando a página for carregada
window.onload = carregarTarefas;
