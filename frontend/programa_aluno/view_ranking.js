// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const rankingContainer = document.getElementById('ranking-container');

    // Função para buscar o ranqueamento do aluno logado
    async function fetchRanking() {
        try {
            loadingElement.style.display = 'block';
            errorElement.style.display = 'none';
            rankingContainer.innerHTML = '';

            // Busca dados do aluno logado no localStorage
            const alunoLogadoStr = localStorage.getItem('alunoLogado');
            console.log('Dados do localStorage:', alunoLogadoStr);
            
            if (!alunoLogadoStr) {
                // Redireciona para a tela de login se não estiver logado
                console.log('Nenhum aluno logado encontrado, redirecionando...');
                window.location.href = 'index.html';
                return;
            }

            let alunoLogado;
            try {
                alunoLogado = JSON.parse(alunoLogadoStr);
                console.log('Aluno logado parseado:', alunoLogado);
            } catch (e) {
                console.error('Erro ao fazer parse do localStorage:', e);
                localStorage.removeItem('alunoLogado');
                window.location.href = 'index.html';
                return;
            }

            // Tenta obter o ID de diferentes formas possíveis
            const alunoId = alunoLogado.id || alunoLogado.id_aluno || alunoLogado.aluno?.id || alunoLogado.aluno?.id_aluno;
            console.log('ID do aluno encontrado:', alunoId);

            if (!alunoId) {
                // Redireciona para a tela de login se não conseguir identificar o aluno
                console.log('ID do aluno não encontrado, redirecionando...');
                localStorage.removeItem('alunoLogado');
                window.location.href = 'index.html';
                return;
            }

            // Busca o ranqueamento do aluno específico
            const response = await fetch(`http://localhost:3000/api/alunos/${alunoId}/ranking`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar ranqueamento');
            }

            const alunoRanking = await response.json();
            
            loadingElement.style.display = 'none';

            // Exibe o ranqueamento do aluno
            displayStudentRanking(alunoRanking);

        } catch (error) {
            console.error('Erro ao buscar ranqueamento:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = 'Erro ao carregar ranqueamento. Verifique se o servidor está rodando.';
            errorElement.style.display = 'block';
        }
    }

    // Função para exibir o ranqueamento do aluno logado
    function displayStudentRanking(alunoRanking) {
        const categoriaClass = getCategoriaClass(alunoRanking.categoria);
        const posicao = alunoRanking.posicao || '-';
        
        let html = `
            <div class="student-ranking-card">
                <h2>Seu Ranqueamento</h2>
                <div class="ranking-info">
                    <div class="info-item">
                        <span class="info-label">Posição:</span>
                        <span class="info-value position-badge-large">${posicao}º</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nome:</span>
                        <span class="info-value">${alunoRanking.nome_completo || '-'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Matrícula:</span>
                        <span class="info-value">${alunoRanking.matricula || '-'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Livros Lidos:</span>
                        <span class="info-value livros-count-large">${alunoRanking.livros_lidos || 0}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Categoria:</span>
                        <span class="categoria-badge categoria-${categoriaClass}">${alunoRanking.categoria || '-'}</span>
                    </div>
                    ${alunoRanking.total_alunos ? `
                    <div class="info-item">
                        <span class="info-label">Total de Alunos:</span>
                        <span class="info-value">${alunoRanking.total_alunos}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
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

