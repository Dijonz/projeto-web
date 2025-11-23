// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const loansContainer = document.getElementById('loans-container');

    // Função para buscar todos os empréstimos ativos da API
    async function fetchActiveLoans() {
        try {
            loadingElement.style.display = 'block';
            errorElement.style.display = 'none';
            loansContainer.innerHTML = '';

            const response = await fetch('http://localhost:3000/api/emprestimos/ativos');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar empréstimos');
            }

            const emprestimos = await response.json();
            
            loadingElement.style.display = 'none';

            if (emprestimos.length === 0) {
                loansContainer.innerHTML = '<p class="no-books">Nenhum empréstimo ativo no momento.</p>';
                return;
            }

            // Cria a tabela de empréstimos
            displayLoans(emprestimos);

        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = 'Erro ao carregar empréstimos. Verifique se o servidor está rodando.';
            errorElement.style.display = 'block';
        }
    }

    // Função para formatar data
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Função para calcular dias de atraso
    function calculateDaysOverdue(dataDevolucaoPrevista) {
        if (!dataDevolucaoPrevista) return 0;
        const hoje = new Date();
        const prevista = new Date(dataDevolucaoPrevista);
        const diffTime = hoje - prevista;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    // Função para exibir os empréstimos em uma tabela
    function displayLoans(emprestimos) {
        let html = `
            <table class="books-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>LIVRO</th>
                        <th>AUTOR</th>
                        <th>ALUNO</th>
                        <th>MATRÍCULA</th>
                        <th>DATA RETIRADA</th>
                        <th>DEVOLUÇÃO PREVISTA</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
        `;

        emprestimos.forEach(emprestimo => {
            const diasAtraso = calculateDaysOverdue(emprestimo.data_devolucao_prevista);
            const isOverdue = diasAtraso > 0;
            const statusClass = isOverdue ? 'status-overdue' : 'status-ok';
            const statusText = isOverdue ? `${diasAtraso} dia(s) em atraso` : 'No prazo';

            html += `
                <tr>
                    <td>${emprestimo.id_emprestimo || '-'}</td>
                    <td>${emprestimo.titulo || '-'}</td>
                    <td>${emprestimo.autor || '-'}</td>
                    <td>${emprestimo.nome_aluno || '-'}</td>
                    <td>${emprestimo.matricula || '-'}</td>
                    <td>${formatDate(emprestimo.data_retirada)}</td>
                    <td>${formatDate(emprestimo.data_devolucao_prevista)}</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        loansContainer.innerHTML = html;
    }

    // Busca os empréstimos quando a página carrega
    fetchActiveLoans();
});

