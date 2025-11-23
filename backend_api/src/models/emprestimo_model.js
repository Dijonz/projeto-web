const pool = require('../db');

const EmprestimoModel = {
  /**
   * Busca todos os empréstimos ativos (não devolvidos)
   * Retorna informações do empréstimo, aluno e livro
   */
  async findActiveLoans() {
    try {
      const query = `
        SELECT 
          e.id_emprestimo,
          e.data_retirada,
          e.data_devolucao_prevista,
          e.data_devolucao_real,
          a.id_aluno,
          a.nome_completo as nome_aluno,
          a.matricula,
          a.email as email_aluno,
          l.id_livro,
          l.titulo,
          l.autor,
          l.editora,
          ex.id_exemplar,
          ex.codigo_barras,
          ex.status as status_exemplar
        FROM emprestimo e
        INNER JOIN aluno a ON e.id_aluno = a.id_aluno
        INNER JOIN exemplar ex ON e.id_exemplar = ex.id_exemplar
        INNER JOIN livro l ON ex.id_livro = l.id_livro
        WHERE e.data_devolucao_real IS NULL
        ORDER BY e.data_retirada DESC
      `;
      
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar empréstimos ativos:', error);
      throw error;
    }
  },

  /**
   * Busca todos os empréstimos (ativos e devolvidos)
   */
  async findAll() {
    try {
      const query = `
        SELECT 
          e.id_emprestimo,
          e.data_retirada,
          e.data_devolucao_prevista,
          e.data_devolucao_real,
          a.id_aluno,
          a.nome_completo as nome_aluno,
          a.matricula,
          a.email as email_aluno,
          l.id_livro,
          l.titulo,
          l.autor,
          l.editora,
          ex.id_exemplar,
          ex.codigo_barras,
          ex.status as status_exemplar
        FROM emprestimo e
        INNER JOIN aluno a ON e.id_aluno = a.id_aluno
        INNER JOIN exemplar ex ON e.id_exemplar = ex.id_exemplar
        INNER JOIN livro l ON ex.id_livro = l.id_livro
        ORDER BY e.data_retirada DESC
      `;
      
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todos os empréstimos:', error);
      throw error;
    }
  },

  /**
   * Busca um empréstimo pelo ID
   */
  async findById(id) {
    try {
      const query = `
        SELECT 
          e.id_emprestimo,
          e.data_retirada,
          e.data_devolucao_prevista,
          e.data_devolucao_real,
          a.id_aluno,
          a.nome_completo as nome_aluno,
          a.matricula,
          a.email as email_aluno,
          l.id_livro,
          l.titulo,
          l.autor,
          l.editora,
          ex.id_exemplar,
          ex.codigo_barras,
          ex.status as status_exemplar
        FROM emprestimo e
        INNER JOIN aluno a ON e.id_aluno = a.id_aluno
        INNER JOIN exemplar ex ON e.id_exemplar = ex.id_exemplar
        INNER JOIN livro l ON ex.id_livro = l.id_livro
        WHERE e.id_emprestimo = ?
      `;
      
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar empréstimo por ID:', error);
      throw error;
    }
  },

  /**
   * Busca um exemplar pelo código de barras
   */
  async findExemplarByCodigoBarras(codigoBarras) {
    try {
      const query = `
        SELECT 
          ex.id_exemplar,
          ex.id_livro,
          ex.status,
          ex.codigo_barras,
          l.titulo,
          l.autor,
          l.editora
        FROM exemplar ex
        INNER JOIN livro l ON ex.id_livro = l.id_livro
        WHERE ex.codigo_barras = ?
      `;
      
      const [rows] = await pool.execute(query, [codigoBarras]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar exemplar por código de barras:', error);
      throw error;
    }
  },

  /**
   * Busca um empréstimo ativo pelo código de barras do exemplar
   */
  async findActiveLoanByCodigoBarras(codigoBarras) {
    try {
      const query = `
        SELECT 
          e.id_emprestimo,
          e.data_retirada,
          e.data_devolucao_prevista,
          e.data_devolucao_real,
          a.id_aluno,
          a.nome_completo as nome_aluno,
          a.matricula,
          a.email as email_aluno,
          l.id_livro,
          l.titulo,
          l.autor,
          l.editora,
          ex.id_exemplar,
          ex.codigo_barras,
          ex.status as status_exemplar
        FROM emprestimo e
        INNER JOIN aluno a ON e.id_aluno = a.id_aluno
        INNER JOIN exemplar ex ON e.id_exemplar = ex.id_exemplar
        INNER JOIN livro l ON ex.id_livro = l.id_livro
        WHERE ex.codigo_barras = ?
          AND e.data_devolucao_real IS NULL
        ORDER BY e.data_retirada DESC
        LIMIT 1
      `;
      
      const [rows] = await pool.execute(query, [codigoBarras]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar empréstimo ativo por código de barras:', error);
      throw error;
    }
  },

  /**
   * Cria um novo empréstimo (retirada de livro)
   * Atualiza o status do exemplar para 'emprestado'
   */
  async create(emprestimoData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { id_aluno, id_exemplar, data_devolucao_prevista } = emprestimoData;

      // Insere o empréstimo
      const [result] = await connection.execute(
        `INSERT INTO emprestimo (id_aluno, id_exemplar, data_retirada, data_devolucao_prevista) 
         VALUES (?, ?, NOW(), ?)`,
        [id_aluno, id_exemplar, data_devolucao_prevista]
      );

      // Atualiza o status do exemplar para 'emprestado'
      await connection.execute(
        `UPDATE exemplar SET status = 'emprestado' WHERE id_exemplar = ?`,
        [id_exemplar]
      );

      await connection.commit();

      // Busca o empréstimo criado com todas as informações
      const emprestimo = await this.findById(result.insertId);
      return emprestimo;
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao criar empréstimo:', error);
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Registra a devolução de um empréstimo
   * Atualiza data_devolucao_real e o status do exemplar para 'disponivel'
   */
  async returnLoan(idEmprestimo) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Busca o empréstimo para obter o id_exemplar
      const emprestimo = await this.findById(idEmprestimo);
      if (!emprestimo) {
        throw new Error('Empréstimo não encontrado');
      }

      if (emprestimo.data_devolucao_real) {
        throw new Error('Este empréstimo já foi devolvido');
      }

      // Atualiza a data de devolução real
      await connection.execute(
        `UPDATE emprestimo SET data_devolucao_real = NOW() WHERE id_emprestimo = ?`,
        [idEmprestimo]
      );

      // Atualiza o status do exemplar para 'disponivel'
      await connection.execute(
        `UPDATE exemplar SET status = 'disponivel' WHERE id_exemplar = ?`,
        [emprestimo.id_exemplar]
      );

      await connection.commit();

      // Retorna o empréstimo atualizado
      const emprestimoAtualizado = await this.findById(idEmprestimo);
      return emprestimoAtualizado;
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao devolver empréstimo:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = EmprestimoModel;

