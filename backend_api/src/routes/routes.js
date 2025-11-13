const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student/insert_student');
const bookController = require('../controllers/book/insert_book');

// Rotas para alunos
router.post('/alunos', studentController.create);
router.get('/alunos', studentController.getAll);
router.get('/alunos/:id', studentController.getById);

// Rotas para livros
router.post('/livros', bookController.create);
router.get('/livros', bookController.getAll);
router.get('/livros/:id', bookController.getById);

module.exports = router;

