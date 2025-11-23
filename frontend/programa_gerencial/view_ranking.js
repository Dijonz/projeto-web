// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const rankingContainer = document.getElementById('ranking-container');

    // Função para buscar o ranqueamento da API
    async function fetchRanking() {
        try {
            loadingElement.style.display = 'block';
            errorElement.style.display = 'none';
            rankingContainer.innerHTML = '';

            const response = await fetch('http://localhost:3000/api/alunos/ranking');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar ranqueamento');
            }

            const ranking = await response.json();
            
            loadingElement.style.display = 'none';

            if (ranking.length === 0) {
                rankingContainer.innerHTML = '<p class="no-books">Nenhum aluno encontrado no ranqueamento.</p>';
                return;
            }

            // Exibe o ranqueamento
            displayRanking(ranking);

        } catch (error) {
            console.error('Erro ao buscar ranqueamento:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = 'Erro ao carregar ranqueamento. Verifique se o servidor está rodando.';
            errorElement.style.display = 'block';
        }
    }

    // Função para exibir o ranqueamento em uma tabela
    function displayRanking(ranking) {
        let html = `
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>POSIÇÃO</th>
                        <th>NOME</th>
                        <th>MATRÍCULA</th>
                        <th>LIVROS LIDOS</th>
                        <th>CATEGORIA</th>
                    </tr>
                </thead>
                <tbody>
        `;

        ranking.forEach((aluno, index) => {
            const posicao = index + 1;
            const categoriaClass = getCategoriaClass(aluno.categoria);
            
            html += `
                <tr class="${categoriaClass}">
                    <td class="position-cell">
                        <span class="position-badge">${posicao}º</span>
                    </td>
                    <td>${aluno.nome_completo || '-'}</td>
                    <td>${aluno.matricula || '-'}</td>
                    <td class="livros-count">${aluno.livros_lidos || 0}</td>
                    <td>
                        <span class="categoria-badge categoria-${categoriaClass}">${aluno.categoria || '-'}</span>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        rankingContainer.innerHTML = html;
    }

    // Função para obter a classe CSS baseada na categoria
    function getCategoriaClass(categoria) {
        if (!categoria) return '';
        
        const categoriaLower = categoria.toLowerCase();
        if (categoriaLower.includes('iniciante')) return 'iniciante';
        if (categoriaLower.includes('regular')) return 'regular';
        if (categoriaLower.includes('ativo')) return 'ativo';
        if (categoriaLower.includes('extremo')) return 'extremo';
        return '';
    }

    // Busca o ranqueamento quando a página carrega
    fetchRanking();
});

