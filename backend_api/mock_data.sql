-- ============================================
-- Script completo: Criar tabelas e inserir dados MOCK
-- livro, aluno, exemplar e emprestimo
-- ============================================
-- 
-- IMPORTANTE: 
-- 1. Ajuste o nome do banco de dados na linha abaixo
-- 2. Execute os comandos na ordem: CREATE DATABASE → CREATE TABLE → INSERT
-- 3. Se as tabelas já existirem, comente ou remova os comandos CREATE TABLE
-- ============================================

-- ============================================
-- CRIAR BANCO DE DADOS (se necessário)
-- ============================================
-- Descomente e ajuste o nome do banco se necessário:
-- CREATE DATABASE IF NOT EXISTS nome_da_sua_database;
-- USE nome_da_sua_database;

-- ============================================
-- CRIAR TABELAS
-- ============================================
-- Execute na ordem apresentada (respeitando as dependências de foreign keys)
-- ============================================

-- 1. Tabela livro (sem dependências)
CREATE TABLE IF NOT EXISTS `livro` (
  `id_livro` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `editora` varchar(100) DEFAULT NULL,
  `ano_publicacao` int DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`id_livro`),
  UNIQUE KEY `isbn` (`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Tabela aluno (sem dependências)
CREATE TABLE IF NOT EXISTS `aluno` (
  `id_aluno` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(200) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_aluno`),
  UNIQUE KEY `matricula` (`matricula`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Tabela exemplar (depende de livro)
CREATE TABLE IF NOT EXISTS `exemplar` (
  `id_exemplar` int NOT NULL AUTO_INCREMENT,
  `id_livro` int NOT NULL,
  `status` enum('disponivel','emprestado','manutencao','descartado') NOT NULL DEFAULT 'disponivel',
  `codigo_barras` varchar(100) NOT NULL,
  PRIMARY KEY (`id_exemplar`),
  UNIQUE KEY `codigo_barras` (`codigo_barras`),
  KEY `id_livro` (`id_livro`),
  CONSTRAINT `exemplar_ibfk_1` FOREIGN KEY (`id_livro`) REFERENCES `livro` (`id_livro`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Tabela emprestimo (depende de aluno e exemplar)
CREATE TABLE IF NOT EXISTS `emprestimo` (
  `id_emprestimo` int NOT NULL AUTO_INCREMENT,
  `id_aluno` int NOT NULL,
  `id_exemplar` int NOT NULL,
  `data_retirada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_devolucao_prevista` date NOT NULL,
  `data_devolucao_real` datetime DEFAULT NULL,
  PRIMARY KEY (`id_emprestimo`),
  KEY `id_aluno` (`id_aluno`),
  KEY `id_exemplar` (`id_exemplar`),
  CONSTRAINT `emprestimo_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  CONSTRAINT `emprestimo_ibfk_2` FOREIGN KEY (`id_exemplar`) REFERENCES `exemplar` (`id_exemplar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- INSERIR DADOS MOCK
-- ============================================
-- Execute os INSERTs na ordem: livro → aluno → exemplar → emprestimo
-- ============================================

-- ============================================
-- INSERIR DADOS MOCK NA TABELA LIVRO
-- ============================================
-- 
-- NOTA: Os ISBNs são únicos e devem ser diferentes para cada livro
-- ============================================

INSERT INTO livro (titulo, autor, editora, ano_publicacao, isbn) VALUES
('Dom Casmurro', 'Machado de Assis', 'Editora Globo', 1899, '9788535911234'),
('O Cortiço', 'Aluísio Azevedo', 'Editora Ática', 1890, '9788508084567'),
('Memórias Póstumas de Brás Cubas', 'Machado de Assis', 'Editora Globo', 1881, '9788535912345'),
('Iracema', 'José de Alencar', 'Editora Melhoramentos', 1865, '9788506083456'),
('O Guarani', 'José de Alencar', 'Editora Melhoramentos', 1857, '9788506082345'),
('Capitães da Areia', 'Jorge Amado', 'Editora Record', 1937, '9788501001234'),
('Gabriela, Cravo e Canela', 'Jorge Amado', 'Editora Record', 1958, '9788501002345'),
('Vidas Secas', 'Graciliano Ramos', 'Editora Record', 1938, '9788501003456'),
('O Tempo e o Vento', 'Érico Veríssimo', 'Editora Globo', 1949, '9788535913456'),
('Grande Sertão: Veredas', 'João Guimarães Rosa', 'Editora Nova Fronteira', 1956, '9788520923456'),
('A Hora da Estrela', 'Clarice Lispector', 'Editora Rocco', 1977, '9788532501234'),
('O Quinze', 'Rachel de Queiroz', 'Editora José Olympio', 1930, '9788503001234'),
('Macunaíma', 'Mário de Andrade', 'Editora Globo', 1928, '9788535914567'),
('O Auto da Compadecida', 'Ariano Suassuna', 'Editora José Olympio', 1955, '9788503002345'),
('A Moreninha', 'Joaquim Manuel de Macedo', 'Editora Ática', 1844, '9788508085678');

-- ============================================
-- INSERIR DADOS MOCK NA TABELA ALUNO
-- ============================================
-- 
-- NOTA: As senhas estão em texto plano para facilitar testes
-- Em produção, use hash (ex: bcrypt)
-- ============================================

INSERT INTO aluno (nome_completo, matricula, email, senha, telefone) VALUES
('João Silva Santos', '2024001', 'joao.silva@email.com', 'senha123', '(11) 98765-4321'),
('Maria Oliveira Costa', '2024002', 'maria.oliveira@email.com', 'senha123', '(11) 98765-4322'),
('Pedro Almeida Souza', '2024003', 'pedro.almeida@email.com', 'senha123', '(11) 98765-4323'),
('Ana Paula Ferreira', '2024004', 'ana.ferreira@email.com', 'senha123', '(11) 98765-4324'),
('Carlos Eduardo Lima', '2024005', 'carlos.lima@email.com', 'senha123', '(11) 98765-4325'),
('Juliana Rodrigues', '2024006', 'juliana.rodrigues@email.com', 'senha123', '(11) 98765-4326'),
('Roberto Martins', '2024007', 'roberto.martins@email.com', 'senha123', '(11) 98765-4327'),
('Fernanda Gomes', '2024008', 'fernanda.gomes@email.com', 'senha123', '(11) 98765-4328'),
('Lucas Pereira', '2024009', 'lucas.pereira@email.com', 'senha123', '(11) 98765-4329'),
('Beatriz Araújo', '2024010', 'beatriz.araujo@email.com', 'senha123', '(11) 98765-4330');

-- ============================================
-- INSERIR DADOS MOCK NA TABELA EXEMPLAR
-- ============================================
-- 
-- NOTA: Usando subconsultas para buscar os IDs reais dos livros
-- Isso garante que funcionará mesmo se a tabela já tiver dados
-- Os códigos de barras são únicos
-- ============================================

-- Exemplares disponíveis (status: 'disponivel')
INSERT INTO exemplar (id_livro, status, codigo_barras) VALUES
((SELECT id_livro FROM livro WHERE titulo = 'Dom Casmurro' LIMIT 1), 'disponivel', 'EX001'),
((SELECT id_livro FROM livro WHERE titulo = 'Dom Casmurro' LIMIT 1), 'disponivel', 'EX002'),
((SELECT id_livro FROM livro WHERE titulo = 'O Cortiço' LIMIT 1), 'disponivel', 'EX003'),
((SELECT id_livro FROM livro WHERE titulo = 'O Cortiço' LIMIT 1), 'disponivel', 'EX004'),
((SELECT id_livro FROM livro WHERE titulo = 'Memórias Póstumas de Brás Cubas' LIMIT 1), 'disponivel', 'EX005'),
((SELECT id_livro FROM livro WHERE titulo = 'Memórias Póstumas de Brás Cubas' LIMIT 1), 'disponivel', 'EX006'),
((SELECT id_livro FROM livro WHERE titulo = 'Iracema' LIMIT 1), 'disponivel', 'EX007'),
((SELECT id_livro FROM livro WHERE titulo = 'O Guarani' LIMIT 1), 'disponivel', 'EX008'),
((SELECT id_livro FROM livro WHERE titulo = 'Capitães da Areia' LIMIT 1), 'disponivel', 'EX009'),
((SELECT id_livro FROM livro WHERE titulo = 'Gabriela, Cravo e Canela' LIMIT 1), 'disponivel', 'EX010'),
((SELECT id_livro FROM livro WHERE titulo = 'Vidas Secas' LIMIT 1), 'disponivel', 'EX021'),
((SELECT id_livro FROM livro WHERE titulo = 'O Tempo e o Vento' LIMIT 1), 'disponivel', 'EX022'),
((SELECT id_livro FROM livro WHERE titulo = 'Grande Sertão: Veredas' LIMIT 1), 'disponivel', 'EX023'),
((SELECT id_livro FROM livro WHERE titulo = 'A Hora da Estrela' LIMIT 1), 'disponivel', 'EX024'),
((SELECT id_livro FROM livro WHERE titulo = 'O Quinze' LIMIT 1), 'disponivel', 'EX025');

-- Exemplares emprestados (status: 'emprestado')
INSERT INTO exemplar (id_livro, status, codigo_barras) VALUES
((SELECT id_livro FROM livro WHERE titulo = 'Dom Casmurro' LIMIT 1), 'emprestado', 'EX011'),
((SELECT id_livro FROM livro WHERE titulo = 'O Cortiço' LIMIT 1), 'emprestado', 'EX012'),
((SELECT id_livro FROM livro WHERE titulo = 'Memórias Póstumas de Brás Cubas' LIMIT 1), 'emprestado', 'EX013'),
((SELECT id_livro FROM livro WHERE titulo = 'Iracema' LIMIT 1), 'emprestado', 'EX014'),
((SELECT id_livro FROM livro WHERE titulo = 'O Guarani' LIMIT 1), 'emprestado', 'EX015'),
((SELECT id_livro FROM livro WHERE titulo = 'Capitães da Areia' LIMIT 1), 'emprestado', 'EX026'),
((SELECT id_livro FROM livro WHERE titulo = 'Gabriela, Cravo e Canela' LIMIT 1), 'emprestado', 'EX027'),
((SELECT id_livro FROM livro WHERE titulo = 'Vidas Secas' LIMIT 1), 'emprestado', 'EX028');

-- Exemplares em manutenção (status: 'manutencao')
INSERT INTO exemplar (id_livro, status, codigo_barras) VALUES
((SELECT id_livro FROM livro WHERE titulo = 'O Tempo e o Vento' LIMIT 1), 'manutencao', 'EX016'),
((SELECT id_livro FROM livro WHERE titulo = 'Grande Sertão: Veredas' LIMIT 1), 'manutencao', 'EX017'),
((SELECT id_livro FROM livro WHERE titulo = 'A Hora da Estrela' LIMIT 1), 'manutencao', 'EX018'),
((SELECT id_livro FROM livro WHERE titulo = 'O Quinze' LIMIT 1), 'manutencao', 'EX029'),
((SELECT id_livro FROM livro WHERE titulo = 'Macunaíma' LIMIT 1), 'manutencao', 'EX030');

-- Exemplares descartados (status: 'descartado')
INSERT INTO exemplar (id_livro, status, codigo_barras) VALUES
((SELECT id_livro FROM livro WHERE titulo = 'Macunaíma' LIMIT 1), 'descartado', 'EX019'),
((SELECT id_livro FROM livro WHERE titulo = 'O Auto da Compadecida' LIMIT 1), 'descartado', 'EX020'),
((SELECT id_livro FROM livro WHERE titulo = 'A Moreninha' LIMIT 1), 'descartado', 'EX031');

-- ============================================
-- INSERIR DADOS MOCK NA TABELA EMPRESTIMO
-- ============================================
-- 
-- NOTA: Os exemplares usados aqui devem existir na tabela exemplar
-- Os alunos usados devem existir na tabela aluno
-- Os id_exemplar referem-se aos exemplares criados acima
-- ============================================

-- Empréstimos ativos (sem data_devolucao_real)
INSERT INTO emprestimo (id_aluno, id_exemplar, data_retirada, data_devolucao_prevista, data_devolucao_real) VALUES
(1, 11, '2024-01-15 10:30:00', '2024-02-15', NULL),
(2, 12, '2024-01-20 14:20:00', '2024-02-20', NULL),
(3, 13, '2024-01-25 09:15:00', '2024-02-25', NULL),
(4, 14, '2024-02-01 11:00:00', '2024-03-01', NULL),
(5, 15, '2024-02-05 16:45:00', '2024-03-05', NULL);

-- Empréstimos devolvidos no prazo
INSERT INTO emprestimo (id_aluno, id_exemplar, data_retirada, data_devolucao_prevista, data_devolucao_real) VALUES
(1, 1, '2023-12-01 10:00:00', '2024-01-01', '2023-12-28 15:30:00'),
(2, 2, '2023-12-05 14:00:00', '2024-01-05', '2024-01-03 11:20:00'),
(3, 3, '2023-12-10 09:00:00', '2024-01-10', '2024-01-08 16:45:00'),
(4, 4, '2023-12-15 11:30:00', '2024-01-15', '2024-01-12 10:15:00'),
(5, 5, '2023-12-20 13:00:00', '2024-01-20', '2024-01-18 14:00:00');

-- Empréstimos devolvidos com atraso
INSERT INTO emprestimo (id_aluno, id_exemplar, data_retirada, data_devolucao_prevista, data_devolucao_real) VALUES
(6, 6, '2023-11-01 10:00:00', '2023-12-01', '2023-12-05 09:30:00'),
(7, 7, '2023-11-10 14:00:00', '2023-12-10', '2023-12-15 11:00:00'),
(8, 8, '2023-11-15 09:00:00', '2023-12-15', '2023-12-20 16:20:00'),
(9, 9, '2023-11-20 11:00:00', '2023-12-20', '2024-01-02 10:45:00'),
(10, 10, '2023-11-25 13:30:00', '2023-12-25', '2024-01-05 14:30:00');

-- Empréstimos recentes
INSERT INTO emprestimo (id_aluno, id_exemplar, data_retirada, data_devolucao_prevista, data_devolucao_real) VALUES
(2, 1, '2024-02-10 10:00:00', '2024-03-10', '2024-02-28 15:00:00'),
(3, 2, '2024-02-12 14:30:00', '2024-03-12', NULL),
(4, 3, '2024-02-15 09:45:00', '2024-03-15', NULL),
(5, 4, '2024-02-18 11:20:00', '2024-03-18', '2024-02-25 16:00:00'),
(6, 5, '2024-02-20 13:15:00', '2024-03-20', NULL);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- Para verificar os dados inseridos, execute:
-- SELECT * FROM livro;
-- SELECT * FROM aluno;
-- SELECT * FROM exemplar;
-- SELECT * FROM emprestimo;
-- 
-- Para contar os registros:
-- SELECT COUNT(*) as total_livros FROM livro;
-- SELECT COUNT(*) as total_alunos FROM aluno;
-- SELECT COUNT(*) as total_exemplares FROM exemplar;
-- SELECT COUNT(*) as total_emprestimos FROM emprestimo;
-- ============================================

