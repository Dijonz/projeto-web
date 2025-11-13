// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os formulários
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // --- Função de Login ---
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        
        const loginEmail = document.getElementById('login-email').value;
        const loginPassword = document.getElementById('login-password').value;
        
        const dadosLogin = {
            email: loginEmail,
            senha: loginPassword,
        };
        
        console.log('Enviando dados de Login:', dadosLogin);
        // TODO: Adicionar a lógica de fetch() para a API de Login
        // Por enquanto, redireciona para o dashboard
        alert('Login realizado! (Funcionalidade de login será implementada)');
        // window.location.href = 'dashboard.html';
    });

    // --- Função de Registro ---
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const regNome = document.getElementById('reg-nome').value;
        const regMatricula = document.getElementById('reg-matricula').value;
        const regEmail = document.getElementById('reg-email').value;
        const regPassword = document.getElementById('reg-password').value;
        
        const dadosRegistro = {
            nome_completo: regNome,
            matricula: regMatricula,
            email: regEmail,
            senha: regPassword,
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/alunos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosRegistro),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro realizado com sucesso!');
                // Limpa os campos do formulário
                formRegister.reset();
            } else {
                alert(data.error || 'Erro ao realizar registro');
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        }
    });
});

