const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student/insert_student');
const bookController = require('../controllers/book/insert_book');
const emprestimoController = require('../controllers/emprestimo/get_active_loans');

// Rotas para alunos
router.post('/alunos', studentController.create);
router.post('/alunos/login', studentController.login);
router.get('/alunos', studentController.getAll);
router.get('/alunos/ranking', studentController.getReadingRanking);
router.get('/alunos/:id/ranking', studentController.getStudentRanking);
router.get('/alunos/:id', studentController.getById);

// Rotas para livros
router.post('/livros', bookController.create);
router.get('/livros', bookController.getAll);
router.get('/livros/disponiveis', bookController.getAvailable);
router.get('/livros/:id', bookController.getById);

// Rotas para empréstimos
router.get('/emprestimos/ativos', emprestimoController.getActiveLoans);
router.post('/emprestimos/retirada', emprestimoController.createLoan);
router.post('/emprestimos/devolucao', emprestimoController.returnLoan);
router.get('/emprestimos', emprestimoController.getAll);
router.get('/emprestimos/:id', emprestimoController.getById);

module.exports = router;

