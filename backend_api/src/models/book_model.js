const pool = require('../db');

const BookModel = {

  /**
   * Busca todos os livros
   */
  async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM livro');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todos os livros:', error);
      throw error;
    }
  },

  /**
   * Busca um livro pelo ID
   */
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM livro WHERE id_livro = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar livro por ID:', error);
      throw error;
    }
  },

  /**
   * Insere um novo livro no banco de dados
   */
  async create(bookData) {
    try {
      const { titulo, autor, editora, ano_publicacao, isbn } = bookData;
      
      console.log('Tentando inserir livro:', { titulo, autor, editora, ano_publicacao, isbn });
      
      const [result] = await pool.execute(
        'INSERT INTO livro (titulo, autor, editora, ano_publicacao, isbn) VALUES (?, ?, ?, ?, ?)',
        [titulo, autor, editora, ano_publicacao, isbn]
      );
      
      console.log('Resultado da inserção:', result);
      
      if (!result.insertId) {
        throw new Error('Não foi possível obter o ID do livro inserido');
      }
      
      // Retorna o livro recém-criado
      console.log('Buscando livro criado com ID:', result.insertId);
      const newBook = await this.findById(result.insertId);
      
      console.log('Livro encontrado:', newBook);
      
      // Renomeia o campo id_livro para id na resposta
      if (newBook) {
        newBook.id = newBook.id_livro;
        delete newBook.id_livro;
      } else {
        throw new Error('Livro foi inserido mas não pôde ser recuperado');
      }
      return newBook;
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      throw error;
    }
  },

  /**
   * Verifica se já existe um livro com o ISBN
   */
  async findByISBN(isbn) {
    try {
      if (!isbn) return null;
      const [rows] = await pool.execute(
        'SELECT * FROM livro WHERE isbn = ?',
        [isbn]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao verificar ISBN:', error);
      throw error;
    }
  },

  /**
   * Busca livros que têm exemplares disponíveis para empréstimo
   * Um livro está disponível se tem pelo menos um exemplar com status 'disponivel'
   * e que não está em um empréstimo ativo (data_devolucao_real IS NULL)
   */
  async findAvailable() {
    try {
      const query = `
        SELECT DISTINCT
          l.id_livro,
          l.titulo,
          l.autor,
          l.editora,
          l.ano_publicacao,
          l.isbn,
          COUNT(DISTINCT ex.id_exemplar) as quantidade_disponivel
        FROM livro l
        INNER JOIN exemplar ex ON l.id_livro = ex.id_livro
        LEFT JOIN emprestimo emp ON ex.id_exemplar = emp.id_exemplar 
          AND emp.data_devolucao_real IS NULL
        WHERE ex.status = 'disponivel'
          AND emp.id_emprestimo IS NULL
        GROUP BY l.id_livro, l.titulo, l.autor, l.editora, l.ano_publicacao, l.isbn
        HAVING quantidade_disponivel > 0
        ORDER BY l.titulo ASC
      `;
      
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar livros disponíveis:', error);
      throw error;
    }
  }
};

module.exports = BookModel;
