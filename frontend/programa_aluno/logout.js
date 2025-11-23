// Função para fazer logout
function logout() {
    // Remove os dados do aluno do localStorage
    localStorage.removeItem('alunoLogado');
    // Redireciona para a tela de login
    window.location.href = 'index.html';
}

