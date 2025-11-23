// Importa o Model que tem as funções do banco
const BookModel = require('../../models/book_model');

const bookController = {

  /**
   * Cria um novo livro (registro)
   */
  async create(req, res) {
    try {
      console.log('Controller create() chamado');
      console.log('req.body recebido:', req.body);
      
      // Verifica se req.body existe
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log('req.body está vazio ou undefined');
        return res.status(400).json({ 
          error: 'Dados não recebidos. Verifique o Content-Type e o corpo da requisição.' 
        });
      }

      const { titulo, autor, editora, ano_publicacao, isbn } = req.body;
      console.log('Dados extraídos:', { titulo, autor, editora, ano_publicacao, isbn });

      // Validação dos campos obrigatórios
      if (!titulo || !autor) {
        return res.status(400).json({ 
          error: 'Título e autor são campos obrigatórios',
          campos: { titulo, autor, editora, ano_publicacao, isbn }
        });
      }

      // Verifica se já existe livro com mesmo ISBN (se ISBN foi fornecido)
      if (isbn) {
        const livroExistente = await BookModel.findByISBN(isbn);
        if (livroExistente) {
          return res.status(409).json({ 
            error: 'Já existe um livro com este ISBN' 
          });
        }
      }

      // Cria o novo livro
      console.log('Tentando criar livro no banco...');
      const novoLivro = await BookModel.create({
        titulo,
        autor,
        editora,
        ano_publicacao,
        isbn
      });

      console.log('Livro criado com sucesso! ID:', novoLivro?.id);
      res.status(201).json({
        message: 'Livro criado com sucesso',
        livro: novoLivro
      });

    } catch (err) {
      console.error('ERRO ao criar livro:', err);
      console.error('Stack:', err.stack);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  },

  /**
   * Busca um livro pelo ID e o retorna como JSON.
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const livro = await BookModel.findById(id);

      if (!livro) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }

      res.status(200).json(livro);

    } catch (err) {
      console.error('Erro ao buscar livro:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  /**
   * Busca todos os livros e retorna como JSON.
   */
  async getAll(req, res) {
    try {
      const livros = await BookModel.findAll();
      res.status(200).json(livros);
      
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  /**
   * Busca livros disponíveis para empréstimo (com exemplares disponíveis)
   */
  async getAvailable(req, res) {
    try {
      const livros = await BookModel.findAvailable();
      res.status(200).json(livros);
      
    } catch (err) {
      console.error('Erro ao buscar livros disponíveis:', err);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  }
};

module.exports = bookController;