// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona o formulário pelo ID
    const form = document.getElementById('form-cadastro-livro');

    // Adiciona um "ouvinte" para o evento de 'submit' (envio) do formulário
    form.addEventListener('submit', (evento) => {
        
        // 1. Impede o comportamento padrão do formulário (que é recarregar a página)
        evento.preventDefault();

        // 2. Coleta os dados dos campos de input
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const editora = document.getElementById('editora').value;
        const anoPublicacao = document.getElementById('ano_publicacao').value;
        const isbn = document.getElementById('isbn').value;

        // 3. Monta um objeto com os dados (pronto para enviar para uma API)
        const novoLivro = {
            titulo: titulo,
            autor: autor,
            editora: editora,
            ano_publicacao: anoPublicacao,
            isbn: isbn
        };

        // 4. Envia os dados para a API
        console.log('Enviando dados do novo livro:', novoLivro);
        
        fetch('http://localhost:3000/api/livros', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(novoLivro)
        })
        .then(response => {
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Erro ao cadastrar livro');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Livro cadastrado:', data);
            alert('Livro cadastrado com sucesso!');
            form.reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro ao cadastrar livro:', error);
            alert('Erro ao cadastrar livro: ' + error.message);
        });
    });

});