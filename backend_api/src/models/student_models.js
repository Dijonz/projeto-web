const pool = require('../db');

const AlunoModel = {
  /**
   * Busca um aluno pelo ID
   */
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM aluno WHERE id_aluno = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar aluno por ID:', error);
      throw error;
    }
  },

  /**
   * Busca todos os alunos
   */
  async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM aluno');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todos os alunos:', error);
      throw error;
    }
  },

  /**
   * Insere um novo aluno no banco de dados
   */
  async create(alunoData) {
    try {
      const { nome_completo, matricula, email, senha } = alunoData;
      
      console.log('Tentando inserir aluno:', { nome_completo, matricula, email });
      
      const [result] = await pool.execute(
        'INSERT INTO aluno (nome_completo, matricula, email, senha) VALUES (?, ?, ?, ?)',
        [nome_completo, matricula, email, senha]
      );
      
      console.log('Resultado da inserção:', result);
      
      if (!result.insertId) {
        throw new Error('Não foi possível obter o ID do aluno inserido');
      }
      
      // Retorna o aluno recém-criado
      console.log('Buscando aluno criado com ID:', result.insertId);
      const newAluno = await this.findById(result.insertId);
      
      console.log('Aluno encontrado:', newAluno);
      
      // Renomeia o campo id_aluno para id na resposta
      if (newAluno) {
        newAluno.id = newAluno.id_aluno;
        delete newAluno.id_aluno;
      } else {
        throw new Error('Aluno foi inserido mas não pôde ser recuperado');
      }
      return newAluno;
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      throw error;
    }
  },

  /**
   * Verifica se já existe um aluno com o email ou matrícula
   */
  async findByEmailOrMatricula(email, matricula) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM aluno WHERE email = ? OR matricula = ?',
        [email, matricula]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao verificar email/matrícula:', error);
      throw error;
    }
  }
};

module.exports = AlunoModel;

