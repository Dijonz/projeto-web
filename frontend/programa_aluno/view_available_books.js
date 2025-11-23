// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const booksContainer = document.getElementById('books-container');

    // Função para buscar livros disponíveis da API
    async function fetchBooks() {
        try {
            loadingElement.style.display = 'block';
            errorElement.style.display = 'none';
            booksContainer.innerHTML = '';

            const response = await fetch('http://localhost:3000/api/livros/disponiveis');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar livros disponíveis');
            }

            const livros = await response.json();
            
            loadingElement.style.display = 'none';

            if (livros.length === 0) {
                booksContainer.innerHTML = '<p class="no-books">Nenhum livro disponível para empréstimo no momento.</p>';
                return;
            }

            // Cria a tabela de livros
            displayBooks(livros);

        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = 'Erro ao carregar livros. Verifique se o servidor está rodando.';
            errorElement.style.display = 'block';
        }
    }

    // Função para exibir os livros em uma tabela
    function displayBooks(livros) {
        let html = `
            <table class="books-table">
                <thead>
                    <tr>
                        <th>TÍTULO</th>
                        <th>AUTOR</th>
                        <th>EDITORA</th>
                        <th>ANO DE PUBLICAÇÃO</th>
                        <th>ISBN</th>
                        <th>QUANTIDADE DISPONÍVEL</th>
                    </tr>
                </thead>
                <tbody>
        `;

        livros.forEach(livro => {
            html += `
                <tr>
                    <td>${livro.titulo || '-'}</td>
                    <td>${livro.autor || '-'}</td>
                    <td>${livro.editora || '-'}</td>
                    <td>${livro.ano_publicacao || '-'}</td>
                    <td>${livro.isbn || '-'}</td>
                    <td>${livro.quantidade_disponivel || 0}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        booksContainer.innerHTML = html;
    }

    // Busca os livros quando a página carrega
    fetchBooks();
});

