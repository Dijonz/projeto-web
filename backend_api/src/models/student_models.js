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
  },

  /**
   * Busca um aluno pelo email e senha (para login)
   */
  async findByEmailAndPassword(email, senha) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM aluno WHERE email = ? AND senha = ?',
        [email, senha]
      );
      if (rows[0]) {
        // Remove a senha do objeto retornado por segurança
        const aluno = { ...rows[0] };
        delete aluno.senha;
        // Garante que o id está presente
        if (aluno.id_aluno) {
          aluno.id = aluno.id_aluno;
        }
        return aluno;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar aluno por email e senha:', error);
      throw error;
    }
  },

  /**
   * Busca um aluno pela matrícula
   */
  async findByMatricula(matricula) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM aluno WHERE matricula = ?',
        [matricula]
      );
      if (rows[0]) {
        const aluno = { ...rows[0] };
        delete aluno.senha;
        if (aluno.id_aluno) {
          aluno.id = aluno.id_aluno;
        }
        return aluno;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar aluno por matrícula:', error);
      throw error;
    }
  },

  /**
   * Busca o ranqueamento de leitura dos alunos
   * Conta quantos livros cada aluno leu (empréstimos devolvidos) no semestre atual
   * Classifica em categorias: Leitor Iniciante (até 5), Regular (6-10), Ativo (11-20), Extremo (21+)
   */
  async getReadingRanking() {
    try {
      // Calcula o início do semestre atual (últimos 6 meses)
      const query = `
        SELECT 
          a.id_aluno,
          a.nome_completo,
          a.matricula,
          a.email,
          COUNT(DISTINCT e.id_emprestimo) as livros_lidos,
          CASE 
            WHEN COUNT(DISTINCT e.id_emprestimo) <= 5 THEN 'Leitor Iniciante'
            WHEN COUNT(DISTINCT e.id_emprestimo) BETWEEN 6 AND 10 THEN 'Leitor Regular'
            WHEN COUNT(DISTINCT e.id_emprestimo) BETWEEN 11 AND 20 THEN 'Leitor Ativo'
            WHEN COUNT(DISTINCT e.id_emprestimo) > 20 THEN 'Leitor Extremo'
            ELSE 'Sem classificação'
          END as categoria
        FROM aluno a
        LEFT JOIN emprestimo e ON a.id_aluno = e.id_aluno
          AND e.data_devolucao_real IS NOT NULL
          AND e.data_devolucao_real >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY a.id_aluno, a.nome_completo, a.matricula, a.email
        ORDER BY livros_lidos DESC, a.nome_completo ASC
      `;
      
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar ranqueamento de leitura:', error);
      throw error;
    }
  },

  /**
   * Busca o ranqueamento de um aluno específico
   * Retorna a posição do aluno no ranking e suas informações
   */
  async getStudentRanking(idAluno) {
    try {
      // Primeiro busca o ranking completo
      const ranking = await this.getReadingRanking();
      
      // Encontra a posição do aluno no ranking
      const alunoIndex = ranking.findIndex(aluno => aluno.id_aluno === idAluno);
      
      if (alunoIndex === -1) {
        // Aluno não encontrado no ranking, retorna informações básicas
        const aluno = await this.findById(idAluno);
        if (!aluno) {
          return null;
        }
        return {
          id_aluno: aluno.id_aluno,
          nome_completo: aluno.nome_completo,
          matricula: aluno.matricula,
          email: aluno.email,
          livros_lidos: 0,
          categoria: 'Sem classificação',
          posicao: null,
          total_alunos: ranking.length
        };
      }
      
      const alunoRanking = ranking[alunoIndex];
      return {
        ...alunoRanking,
        posicao: alunoIndex + 1,
        total_alunos: ranking.length
      };
    } catch (error) {
      console.error('Erro ao buscar ranqueamento do aluno:', error);
      throw error;
    }
  }
};

module.exports = AlunoModel;

