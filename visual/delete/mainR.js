// Função para carregar os relatórios no select
async function carregarRelatorios() {
    try {
        const response = await fetch('http://localhost:3031/relatorios');
        const relatorios = await response.json();
        const selectRelatorio = document.getElementById('relatorio');
        
        // Limpa as opções existentes, incluindo a opção 'Nenhum relatório'
        selectRelatorio.innerHTML = '';

        // Adiciona a opção 'Nenhum relatório' de volta ao início
        const optionNone = document.createElement('option');
        optionNone.value = '';
        optionNone.textContent = 'Nenhum relatório';
        selectRelatorio.appendChild(optionNone);

        // Preenche o select com os relatórios
        relatorios.forEach(relatorio => {
            const option = document.createElement('option');
            option.value = relatorio.id;
            option.textContent = relatorio.finalidade;
            selectRelatorio.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
    }
}

// Função para exibir os detalhes do relatório selecionado
async function exibirDetalhes() {
    const relatorioId = document.getElementById('relatorio').value;

    if (!relatorioId) {
        // Se a opção 'Nenhum relatório' for selecionada, apenas mostra os textos padrões
        document.getElementById('finalidadeR').textContent = 'Finalidade:';
        document.getElementById('dataR').textContent = 'Data:';
        document.getElementById('descricaoR').textContent = 'Descrição:';
        document.getElementById('componentesR').textContent = 'Componentes:';
        document.getElementById('tarefaR').textContent = 'Tarefa Relacionada:';
        return;
    }

    try {
        // Chama a API para buscar os detalhes do relatório
        const response = await fetch(`http://localhost:3031/relatorios`);
        const relatorios = await response.json();

        if (response.ok) {
            // Filtra o relatório selecionado
            const relatorioSelecionado = relatorios.find(relatorio => relatorio.id == relatorioId);

            if (relatorioSelecionado) {
                // Atualiza os campos com os detalhes do relatório
                document.getElementById('finalidadeR').textContent = `Finalidade: ${relatorioSelecionado.finalidade}`;
                document.getElementById('dataR').textContent = `Data: ${new Date(relatorioSelecionado.data).toLocaleDateString()}`;
                document.getElementById('descricaoR').textContent = `Descrição: ${relatorioSelecionado.descricao}`;
                document.getElementById('componentesR').textContent = `Componentes: ${relatorioSelecionado.componentes}`;
                
                // Verifica se a tarefa associada existe e a exibe
                if (relatorioSelecionado.tarefaId) {
                    const tarefaResponse = await fetch(`http://localhost:3031/tarefas`);
                    const tarefas = await tarefaResponse.json();
                    const tarefaAssociada = tarefas.find(tarefa => tarefa.id === relatorioSelecionado.tarefaId);
                    document.getElementById('tarefaR').textContent = `Tarefa Relacionada: ${tarefaAssociada ? tarefaAssociada.nome : 'Não encontrada'}`;
                } else {
                    document.getElementById('tarefaR').textContent = 'Tarefa Relacionada: Nenhuma';
                }
            } else {
                alert('Relatório não encontrado!');
            }
        } else {
            alert('Erro ao buscar relatórios!');
        }
    } catch (error) {
        console.error('Erro ao exibir os detalhes do relatório:', error);
    }
}

// Função para mostrar a confirmação de exclusão
function confirmarApagar() {
    const relatorioId = document.getElementById('relatorio').value;
    
    if (!relatorioId) return;

    const certeza = document.getElementById('certeza');
    certeza.innerHTML = ` 
        <p>Você tem certeza de que quer apagar esse relatório?</p>
        <button class="confirmar" onclick="apagarRelatorio(${relatorioId})">Confirmar</button>
    `;
}

// Função para apagar o relatório
async function apagarRelatorio(relatorioId) {
    try {
        const response = await fetch(`http://localhost:3031/relatorio/${relatorioId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
            alert('Relatório apagado com sucesso');
            window.location.href = '../read/index.html';
        } else {
            alert(result.mensagem || 'Erro ao apagar relatório');
        }
    } catch (error) {
        console.error('Erro ao apagar o relatório:', error);
        alert('Erro ao apagar o relatório');
    }
}

// Função que será chamada quando a seleção de relatório mudar
function limparConfirmacao() {
    // Remove a mensagem de confirmação caso o usuário mude a seleção do relatório
    const certeza = document.getElementById('certeza');
    certeza.innerHTML = '';
}

// Chama a função para carregar os relatórios quando a página for carregada
window.onload = () => {
    carregarRelatorios();

    // Adiciona um ouvinte para o evento de mudança de seleção no <select> 
    document.getElementById('relatorio').addEventListener('change', limparConfirmacao);
};
