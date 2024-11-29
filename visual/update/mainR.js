document.addEventListener("DOMContentLoaded", function() {
    // Função para pegar o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const relatorioId = urlParams.get('id');  // Obtém o 'id' da URL

    if (relatorioId) {
        carregarRelatorio(relatorioId);  // Se o ID existir, carrega os dados
    } else {
        alert('ID do relatório não encontrado na URL!');
    }
});

// Função para carregar os dados do relatório com base no ID
function carregarRelatorio(id) {
    // Supondo que a API que retorna os dados do relatório esteja disponível em /api/relatorios/{id}
    fetch(`/api/relatorios/${id}`)
        .then(response => response.json())
        .then(data => {
            // Preenche os campos com os dados do relatório
            document.getElementById('tarefa').value = data.tarefaId || '';  // Caso a tarefa não exista, deixe em branco
            document.getElementById('finalidade').value = data.finalidade || '';
            document.getElementById('dataRelatorio').value = data.data || '';
            document.getElementById('descricaoRelatorio').value = data.descricao || '';
            document.getElementById('componente').value = data.componentes || '';

            // Exibe os dados no lado direito da página
            document.getElementById('finalidadeRelato').textContent = data.finalidade || '';
            document.getElementById('dataRelato').textContent = data.data || '';
            document.getElementById('componenteRelato').textContent = data.componentes || '';
            document.getElementById('descricaoRelato').textContent = data.descricao || '';
            document.getElementById('tarefaRelato').textContent = data.tarefaId || '';

            // Se houver tarefas relacionadas, preenche o campo de seleção
            carregarTarefasRelacionadas(data.tarefas || []);  // Garantir que seja um array vazio caso não haja tarefas
        })
        .catch(error => console.error('Erro ao carregar relatório:', error));
}

// Função para carregar as tarefas relacionadas no campo de seleção
function carregarTarefasRelacionadas(tarefas) {
    const tarefaSelect = document.getElementById('tarefa');
    
    // Limpa as opções anteriores
    tarefaSelect.innerHTML = '<option value="">Nenhuma tarefa</option>';

    // Verifica se há tarefas
    if (tarefas.length > 0) {
        tarefas.forEach(tarefa => {
            const option = document.createElement('option');
            option.value = tarefa.id;  // Supondo que cada tarefa tem um 'id'
            option.textContent = tarefa.nome;  // Supondo que cada tarefa tem um 'nome'
            tarefaSelect.appendChild(option);
        });
    }
}

// Função para enviar os dados atualizados
async function atualizarRelatorio() {
    const id = document.getElementById('id').value;
    const finalidade = document.getElementById('finalidade').value;
    const data = document.getElementById('dataRelatorio').value;
    const descricao = document.getElementById('descricaoRelatorio').value;
    const componente = document.getElementById('componente').value;
    const tarefaId = document.getElementById('tarefa').value;

    // Criação de um objeto com os dados a serem atualizados
    const dadosAtualizados = {};

    // Adiciona os campos ao objeto de dados se não estiverem vazios
    if (finalidade.trim() !== "") dadosAtualizados.finalidade = finalidade;
    if (data.trim() !== "") dadosAtualizados.data = data;
    if (descricao.trim() !== "") dadosAtualizados.descricao = descricao;
    if (componente.trim() !== "") dadosAtualizados.componente = componente;
    if (tarefaId.trim() !== "") dadosAtualizados.tarefaId = tarefaId;

    // Se o objeto estiver vazio, significa que nenhum campo foi alterado
    if (Object.keys(dadosAtualizados).length === 0) {
        alert('Nenhum campo foi alterado.');
        return;
    }

    // Exibindo o objeto com os dados a serem atualizados para depuração
    console.log("Dados a serem atualizados:", dadosAtualizados);

    try {
        // Envia os dados atualizados para o servidor
        const resposta = await fetch(`/relatorio/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (resposta.ok) {
            alert('Relatório atualizado com sucesso!');
            carregarRelatorio(id);  // Recarregar os dados para refletir as mudanças
        } else {
            // Exibindo o erro de resposta
            const erro = await resposta.json();
            alert(`Erro ao atualizar o relatório: ${erro.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        alert('Erro ao tentar atualizar o relatório. Verifique sua conexão ou tente novamente mais tarde.');
    }
}
