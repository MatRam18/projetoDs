document.getElementById('formTarefa').addEventListener('submit', async function(event) {
    event.preventDefault();  // Previne o envio padrão do formulário

    // Captura os dados do formulário
    const nome = document.getElementById('nomeTarefa').value;
    const descricao = document.getElementById('descricaoEvento').value;
    const data = document.getElementById('dataEvento').value;
    const responsaveis = document.getElementById('responsaveisTarefa').value;
    const setor = document.getElementById('setorTarefa').value;

    // Cria um objeto com os dados
    const tarefaData = {
        nome,
        descricao,
        data,
        responsaveis,
        setor
    };

    try {
        // Envia os dados para a API
        const response = await fetch('http://localhost:3031/tarefa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefaData)  // Envia os dados do formulário em JSON
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.ok) {
            const result = await response.json();
            alert('Tarefa criada com sucesso!');
            console.log(result); // Log do resultado da API (para depuração)

            // Redireciona para a página "index.html" após o sucesso
            window.location.href = '../read/index.html';  // Altere o caminho conforme necessário
        } else {
            const error = await response.json();
            alert('Erro ao criar tarefa: ' + error.erro);
        }
    } catch (error) {
        alert('Erro de conexão com a API: ' + error.message);
    }
});
