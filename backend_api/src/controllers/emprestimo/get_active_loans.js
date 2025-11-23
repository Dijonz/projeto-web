const EmprestimoModel = require('../../models/emprestimo_model');
const AlunoModel = require('../../models/student_models');

const emprestimoController = {
  /**
   * Busca todos os empréstimos ativos (não devolvidos)
   */
  async getActiveLoans(req, res) {
    try {
      const emprestimos = await EmprestimoModel.findActiveLoans();
      res.status(200).json(emprestimos);
    } catch (err) {
      console.error('Erro ao buscar empréstimos ativos:', err);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  },

  /**
   * Busca todos os empréstimos (ativos e devolvidos)
   */
  async getAll(req, res) {
    try {
      const emprestimos = await EmprestimoModel.findAll();
      res.status(200).json(emprestimos);
    } catch (err) {
      console.error('Erro ao buscar empréstimos:', err);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  },

  /**
   * Busca um empréstimo pelo ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const emprestimo = await EmprestimoModel.findById(id);

      if (!emprestimo) {
        return res.status(404).json({ message: 'Empréstimo não encontrado' });
      }

      res.status(200).json(emprestimo);
    } catch (err) {
      console.error('Erro ao buscar empréstimo:', err);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  },

  /**
   * Cria um novo empréstimo (retirada de livro)
   * Recebe: codigo_barras (do exemplar) e matricula (do aluno)
   */
  async createLoan(req, res) {
    try {
      const { codigo_barras, matricula } = req.body;

      if (!codigo_barras || !matricula) {
        return res.status(400).json({ 
          error: 'Dados incompletos',
          message: 'É necessário informar o código de barras do exemplar e a matrícula do aluno' 
        });
      }

      // Busca o exemplar pelo código de barras
      const exemplar = await EmprestimoModel.findExemplarByCodigoBarras(codigo_barras);
      if (!exemplar) {
        return res.status(404).json({ 
          error: 'Exemplar não encontrado',
          message: 'Código de barras não encontrado no sistema' 
        });
      }

      // Verifica se o exemplar está disponível
      if (exemplar.status !== 'disponivel') {
        return res.status(400).json({ 
          error: 'Exemplar não disponível',
          message: `O exemplar está com status: ${exemplar.status}` 
        });
      }

      // Verifica se o exemplar não está em um empréstimo ativo
      const emprestimoAtivo = await EmprestimoModel.findActiveLoanByCodigoBarras(codigo_barras);
      if (emprestimoAtivo) {
        return res.status(400).json({ 
          error: 'Exemplar já emprestado',
          message: 'Este exemplar já está em um empréstimo ativo' 
        });
      }

      // Busca o aluno pela matrícula
      const aluno = await AlunoModel.findByMatricula(matricula);
      if (!aluno) {
        return res.status(404).json({ 
          error: 'Aluno não encontrado',
          message: 'Matrícula não encontrada no sistema' 
        });
      }

      // Calcula a data de devolução prevista (30 dias a partir de hoje)
      const dataDevolucaoPrevista = new Date();
      dataDevolucaoPrevista.setDate(dataDevolucaoPrevista.getDate() + 30);
      const dataDevolucaoPrevistaStr = dataDevolucaoPrevista.toISOString().split('T')[0];

      // Cria o empréstimo
      const emprestimoData = {
        id_aluno: aluno.id_aluno,
        id_exemplar: exemplar.id_exemplar,
        data_devolucao_prevista: dataDevolucaoPrevistaStr
      };

      const novoEmprestimo = await EmprestimoModel.create(emprestimoData);

      res.status(201).json({
        message: 'Empréstimo realizado com sucesso',
        emprestimo: novoEmprestimo
      });
    } catch (err) {
      console.error('Erro ao criar empréstimo:', err);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  },

  /**
   * Registra a devolução de um empréstimo
   * Recebe: codigo_barras (do exemplar)
   */
  async returnLoan(req, res) {
    try {
      const { codigo_barras } = req.body;

      if (!codigo_barras) {
        return res.status(400).json({ 
          error: 'Dados incompletos',
          message: 'É necessário informar o código de barras do exemplar' 
        });
      }

      // Busca o empréstimo ativo pelo código de barras
      const emprestimo = await EmprestimoModel.findActiveLoanByCodigoBarras(codigo_barras);
      if (!emprestimo) {
        return res.status(404).json({ 
          error: 'Empréstimo não encontrado',
          message: 'Não foi encontrado um empréstimo ativo para este código de barras' 
        });
      }

      // Registra a devolução
      const emprestimoDevolvido = await EmprestimoModel.returnLoan(emprestimo.id_emprestimo);

      res.status(200).json({
        message: 'Devolução realizada com sucesso',
        emprestimo: emprestimoDevolvido
      });
    } catch (err) {
      console.error('Erro ao devolver empréstimo:', err);
      
      if (err.message === 'Empréstimo não encontrado' || err.message === 'Este empréstimo já foi devolvido') {
        return res.status(400).json({ 
          error: 'Erro na devolução',
          message: err.message 
        });
      }

      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
      });
    }
  }
};

module.exports = emprestimoController;

