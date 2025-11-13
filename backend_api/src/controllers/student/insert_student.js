// Importa o Model que tem as funções do banco
const AlunoModel = require('../../models/student_models');

const studentController = {

  /**
   * Cria um novo aluno (registro)
   */
  async create(req, res) {
    try {
      console.log('Controller create() chamado');
      console.log('req.body recebido:', req.body);
      
      // Verifica se o body está vazio 
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log('req.body está vazio ou undefined');
        return res.status(400).json({ 
          error: 'Dados não recebidos. Verifique o Content-Type e o corpo da requisição.' 
        });
      }

      const { nome_completo, matricula, email, senha } = req.body;
      console.log('Dados extraídos:', { nome_completo, matricula, email, senha: senha ? '***' : 'vazio' });

      if (!nome_completo || !matricula || !email || !senha) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios',
          campos: { nome_completo, matricula, email, senha }
        });
      }

      // Verifica se já existe aluno com mesmo email ou matrícula
      const alunoExistente = await AlunoModel.findByEmailOrMatricula(email, matricula);
      if (alunoExistente) {
        return res.status(409).json({ 
          error: 'Já existe um aluno com este email ou matrícula' 
        });
      }

      // Cria o novo aluno
      console.log('Tentando criar aluno no banco...');
      const novoAluno = await AlunoModel.create({
        nome_completo,
        matricula,
        email,
        senha
      });

      console.log('Aluno criado com sucesso! ID:', novoAluno?.id);
      res.status(201).json({
        message: 'Aluno criado com sucesso',
        aluno: novoAluno
      });

    } catch (err) {
      console.error('ERRO ao criar aluno:', err);
      console.error('Stack:', err.stack);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  },

  /**
   * Busca um aluno pelo ID e o retorna como JSON.
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const aluno = await AlunoModel.findById(id);

      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }

      res.status(200).json(aluno);

    } catch (err) {
      console.error('Erro ao buscar aluno:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  /**
   * Busca todos os alunos e retorna como JSON.
   */
  async getAll(req, res) {
    try {
      const alunos = await AlunoModel.findAll();
      res.status(200).json(alunos);
      
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = studentController;