// Espera o HTML ser totalmente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os formulários
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // --- Função de Login ---
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        
        const loginEmail = document.getElementById('login-email').value;
        const loginPassword = document.getElementById('login-password').value;
        
        const dadosLogin = {
            email: loginEmail,
            senha: loginPassword,
        };
        
        console.log('Enviando dados de Login:', dadosLogin);
        
        try {
            const response = await fetch('http://localhost:3000/api/alunos/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosLogin),
            });

            const data = await response.json();
            console.log('Resposta do login:', data);

            if (response.ok) {
                // Login bem-sucedido, salva dados do aluno no localStorage
                if (data.aluno) {
                    // Garante que o ID está presente
                    const aluno = { ...data.aluno };
                    if (aluno.id_aluno && !aluno.id) {
                        aluno.id = aluno.id_aluno;
                    }
                    localStorage.setItem('alunoLogado', JSON.stringify(aluno));
                    console.log('Aluno salvo no localStorage:', aluno);
                } else {
                    // Se não retornou dados do aluno, busca pelo email
                    try {
                        const alunosResponse = await fetch('http://localhost:3000/api/alunos');
                        const alunos = await alunosResponse.json();
                        const aluno = alunos.find(a => a.email === loginEmail);
                        if (aluno) {
                            // Garante que o ID está presente
                            const alunoComId = { ...aluno };
                            if (alunoComId.id_aluno && !alunoComId.id) {
                                alunoComId.id = alunoComId.id_aluno;
                            }
                            localStorage.setItem('alunoLogado', JSON.stringify(alunoComId));
                            console.log('Aluno salvo no localStorage (fallback):', alunoComId);
                        }
                    } catch (err) {
                        console.error('Erro ao buscar dados do aluno:', err);
                    }
                }
                // Redireciona para o dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Erro ao realizar login. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            // Em caso de erro de conexão, ainda permite acesso ao dashboard para desenvolvimento
            alert('Erro ao conectar com o servidor. Redirecionando para o dashboard...');
            window.location.href = 'dashboard.html';
        }
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

