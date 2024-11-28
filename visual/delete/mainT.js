// Função para carregar as tarefas no select
async function carregarTarefas() {
    try {
        const response = await fetch('http://localhost:3031/tarefas');
        const tarefas = await response.json();
        const selectTarefa = document.getElementById('tarefa');
        
        // Limpa as opções existentes, incluindo a opção 'Nenhuma tarefa'
        selectTarefa.innerHTML = '';

        // Adiciona a opção 'Nenhuma tarefa' de volta ao início
        const optionNone = document.createElement('option');
        optionNone.value = '';
        optionNone.textContent = 'Nenhuma tarefa';
        selectTarefa.appendChild(optionNone);

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
// Função para exibir os detalhes da tarefa selecionada
async function exibirDetalhes() {
    const tarefaId = document.getElementById('tarefa').value;

    if (!tarefaId) {
        // Se a opção 'Nenhuma tarefa' for selecionada, apenas mostra os textos padrões
        document.getElementById('nomeT').textContent = 'Nome:';
        document.getElementById('setorT').textContent = 'Setor:';
        document.getElementById('dataT').textContent = 'Prazo:';
        document.getElementById('respT').textContent = 'Responsáveis:';
        document.getElementById('descT').textContent = 'Descrição:';
        return; 
    }

    try {
        // Chama a API para buscar os detalhes da tarefa
        const response = await fetch(`http://localhost:3031/tarefas`);
        const tarefas = await response.json();

        if (response.ok) {
            // Filtra a tarefa selecionada
            const tarefaSelecionada = tarefas.find(tarefa => tarefa.id == tarefaId);

            if (tarefaSelecionada) {
                // Atualiza os campos com os detalhes da tarefa
                document.getElementById('nomeT').textContent = `Nome: ${tarefaSelecionada.nome}`;
                document.getElementById('setorT').textContent = `Setor: ${tarefaSelecionada.setor}`;
                document.getElementById('dataT').textContent = `Prazo: ${new Date(tarefaSelecionada.data).toLocaleDateString()}`;
                document.getElementById('respT').textContent = `Responsáveis: ${tarefaSelecionada.responsaveis}`;
                document.getElementById('descT').textContent = `Descrição: ${tarefaSelecionada.descricao}`;
            } else {
                alert('Tarefa não encontrada!');
            }
        } else {
            alert('Erro ao buscar tarefas!');
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

// Função que será chamada quando a seleção de tarefa mudar
function limparConfirmacao() {
    // Remove a mensagem de confirmação caso o usuário mude a seleção da tarefa
    const certeza = document.getElementById('certeza');
    certeza.innerHTML = '';
}

// Chama a função para carregar as tarefas quando a página for carregada
window.onload = () => {
    carregarTarefas();

    // Adiciona um ouvinte para o evento de mudança de seleção no <select> 
    document.getElementById('tarefa').addEventListener('change', limparConfirmacao);
};
