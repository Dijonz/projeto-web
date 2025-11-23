// URL base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Função para exibir mensagens
function exibirMensagem(elementId, mensagem, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    elemento.textContent = mensagem;
    elemento.className = `mensagem ${tipo}`;
    elemento.style.display = 'block';

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        elemento.style.display = 'none';
        elemento.textContent = '';
    }, 5000);
}

// Função para formatar data e hora
function formatarDataHora(dataHoraStr) {
    if (!dataHoraStr) return 'N/A';
    const data = new Date(dataHoraStr);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Handler para retirada de livro
document.getElementById('form-retirada').addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigoBarras = document.getElementById('codigo-barras-retirada').value.trim();
    const matricula = document.getElementById('matricula-retirada').value.trim();
    const mensagemElement = document.getElementById('mensagem-retirada');

    // Limpa mensagens anteriores
    mensagemElement.style.display = 'none';
    mensagemElement.textContent = '';

    // Desabilita o botão durante a requisição
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processando...';

    try {
        const response = await fetch(`${API_BASE_URL}/emprestimos/retirada`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo_barras: codigoBarras,
                matricula: matricula
            })
        });

        const data = await response.json();

        if (response.ok) {
            const emprestimo = data.emprestimo;
            const mensagem = `
                Retirada realizada com sucesso!
                Livro: ${emprestimo.titulo}
                Aluno: ${emprestimo.nome_aluno} (${emprestimo.matricula})
                Data/Hora da Retirada: ${formatarDataHora(emprestimo.data_retirada)}
                Data de Devolução Prevista: ${new Date(emprestimo.data_devolucao_prevista).toLocaleDateString('pt-BR')}
            `;
            exibirMensagem('mensagem-retirada', mensagem, 'success');
            
            // Limpa o formulário
            e.target.reset();
        } else {
            exibirMensagem('mensagem-retirada', data.message || data.error || 'Erro ao realizar retirada', 'error');
        }
    } catch (error) {
        console.error('Erro ao realizar retirada:', error);
        exibirMensagem('mensagem-retirada', 'Erro de conexão. Verifique se o servidor está rodando.', 'error');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Realizar Retirada';
    }
});

// Handler para devolução de livro
document.getElementById('form-devolucao').addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigoBarras = document.getElementById('codigo-barras-devolucao').value.trim();
    const mensagemElement = document.getElementById('mensagem-devolucao');

    // Limpa mensagens anteriores
    mensagemElement.style.display = 'none';
    mensagemElement.textContent = '';

    // Desabilita o botão durante a requisição
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processando...';

    try {
        const response = await fetch(`${API_BASE_URL}/emprestimos/devolucao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo_barras: codigoBarras
            })
        });

        const data = await response.json();

        if (response.ok) {
            const emprestimo = data.emprestimo;
            const dataRetirada = formatarDataHora(emprestimo.data_retirada);
            const dataDevolucao = formatarDataHora(emprestimo.data_devolucao_real);
            const dataPrevista = new Date(emprestimo.data_devolucao_prevista);
            const dataDevolucaoReal = new Date(emprestimo.data_devolucao_real);
            
            let statusAtraso = '';
            if (dataDevolucaoReal > dataPrevista) {
                const diasAtraso = Math.ceil((dataDevolucaoReal - dataPrevista) / (1000 * 60 * 60 * 24));
                statusAtraso = ` ⚠️ Devolvido com ${diasAtraso} dia(s) de atraso`;
            } else {
                statusAtraso = ' ✓ Devolvido no prazo';
            }

            const mensagem = `
                Devolução realizada com sucesso!
                Livro: ${emprestimo.titulo}
                Aluno: ${emprestimo.nome_aluno} (${emprestimo.matricula})
                Data/Hora da Retirada: ${dataRetirada}
                Data/Hora da Devolução: ${dataDevolucao}
                ${statusAtraso}
            `;
            exibirMensagem('mensagem-devolucao', mensagem, 'success');
            
            // Limpa o formulário
            e.target.reset();
        } else {
            exibirMensagem('mensagem-devolucao', data.message || data.error || 'Erro ao realizar devolução', 'error');
        }
    } catch (error) {
        console.error('Erro ao realizar devolução:', error);
        exibirMensagem('mensagem-devolucao', 'Erro de conexão. Verifique se o servidor está rodando.', 'error');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Realizar Devolução';
    }
});

// Foco automático nos campos de código de barras ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('codigo-barras-retirada').focus();
});

