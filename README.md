# Projeto Web - Sistema de Biblioteca

Sistema completo de gerenciamento de biblioteca com backend em Node.js/Express e frontend em HTML/CSS/JavaScript.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu computador:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MySQL](https://www.mysql.com/downloads/) (versão 5.7 ou superior)
- [Git](https://git-scm.com/) (para clonar o repositório)
- Um editor de código (VS Code recomendado)

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Dijonz/projeto-web.git
cd projeto-web
```

### 2. Instalar dependências do backend

```bash
cd backend_api
npm install
```

### 3. Configurar variáveis de ambiente

1. Crie um arquivo `.env` na pasta `backend_api`:

```bash
cd backend_api
copy env_example.txt .env
```

2. Edite o arquivo `.env` com suas credenciais do MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_DATABASE=nome_da_sua_database
PORT=3000
```

**⚠️ Importante:** Substitua:
- `sua_senha_do_mysql` pela sua senha do MySQL
- `nome_da_sua_database` pelo nome do banco de dados que você criou

### 4. Criar o banco de dados

1. Abra o MySQL (via linha de comando ou MySQL Workbench)
2. Crie o banco de dados:

```sql
CREATE DATABASE nome_da_sua_database;
USE nome_da_sua_database;
```

3. Execute os seguintes comandos SQL **na ordem apresentada** (respeitando as dependências de foreign keys):

```sql
-- 1. Tabela livro (sem dependências)
CREATE TABLE `livro` (
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
CREATE TABLE `aluno` (
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
CREATE TABLE `exemplar` (
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
CREATE TABLE `emprestimo` (
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
```

**⚠️ Importante:** 
- Substitua `nome_da_sua_database` pelo nome que você configurou no arquivo `.env`
- Execute os comandos na ordem apresentada para evitar erros de foreign key

### 5. Executar o backend

```bash
cd backend_api
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

### 6. Executar os projetos frontend

O frontend possui **3 projetos separados** que podem ser executados simultaneamente. Cada um precisa de uma **porta diferente** se você quiser rodar todos ao mesmo tempo.

#### 📌 Portas Recomendadas:
- **Backend API**: `http://localhost:3000` (já configurado)
- **Programa Aluno**: `http://localhost:8000`
- **Programa Gerencial**: `http://localhost:8001`
- **Autoatendimento**: `http://localhost:8002`

#### Opção 1: Abrir diretamente no navegador
- Navegue até a pasta do projeto desejado e abra o arquivo `index.html`
- ⚠️ **Limitação**: Alguns recursos podem não funcionar devido a políticas CORS do navegador

#### Opção 2: Usar servidor local (recomendado)

**Usando Python:**

Abra **3 terminais diferentes** e execute cada projeto em uma porta:

```bash
# Terminal 1 - Programa Aluno
cd frontend/programa_aluno
python -m http.server 8000

# Terminal 2 - Programa Gerencial
cd frontend/programa_gerencial
python -m http.server 8001

# Terminal 3 - Autoatendimento
cd frontend/autoatendimento
python -m http.server 8002
```

**Usando Node.js (http-server):**

```bash
# Instalar globalmente (apenas uma vez)
npm install -g http-server

# Terminal 1 - Programa Aluno
cd frontend/programa_aluno
http-server -p 8000

# Terminal 2 - Programa Gerencial
cd frontend/programa_gerencial
http-server -p 8001

# Terminal 3 - Autoatendimento
cd frontend/autoatendimento
http-server -p 8002
```

**Usando Node.js (live-server) - com auto-reload:**

```bash
# Instalar globalmente (apenas uma vez)
npm install -g live-server

# Terminal 1 - Programa Aluno
cd frontend/programa_aluno
live-server --port=8000

# Terminal 2 - Programa Gerencial
cd frontend/programa_gerencial
live-server --port=8001

# Terminal 3 - Autoatendimento
cd frontend/autoatendimento
live-server --port=8002
```

#### Opção 3: Rodar apenas um projeto por vez

Se você não precisa rodar todos simultaneamente, pode usar a mesma porta (8000) para cada projeto:

```bash
cd frontend/programa_aluno
python -m http.server 8000
# Acesse: http://localhost:8000
```

## 📁 Estrutura do Projeto

```
projeto-web/
├── backend_api/          # API Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── models/      # Modelos de dados
│   │   ├── routes/      # Rotas da API
│   │   ├── db.js        # Configuração do banco
│   │   └── index.js     # Arquivo principal
│   ├── .env             # Variáveis de ambiente (não commitado)
│   └── package.json
│
└── frontend/            # Frontend (HTML/CSS/JavaScript)
    ├── programa_aluno/   # Sistema do aluno
    ├── programa_gerencial/ # Sistema gerencial
    └── autoatendimento/  # Sistema de autoatendimento
```

## 🔌 Endpoints da API

### Alunos
- `POST /api/alunos` - Criar novo aluno
- `GET /api/alunos` - Listar todos os alunos
- `GET /api/alunos/:id` - Buscar aluno por ID

### Livros
- `POST /api/livros` - Criar novo livro
- `GET /api/livros` - Listar todos os livros
- `GET /api/livros/:id` - Buscar livro por ID

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

## 🔌 Resumo das Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| Backend API | 3000 | `http://localhost:3000` |
| Programa Aluno | 8000 | `http://localhost:8000` |
| Programa Gerencial | 8001 | `http://localhost:8001` |
| Autoatendimento | 8002 | `http://localhost:8002` |

## 📝 Notas Importantes

- O arquivo `.env` não deve ser commitado (já está no `.gitignore`)
- Certifique-se de que o MySQL está rodando antes de iniciar o backend
- A porta padrão do backend é 3000, mas pode ser alterada no arquivo `.env`
- O frontend precisa estar configurado para fazer requisições para `http://localhost:3000/api`
- **Cada projeto frontend precisa de uma porta diferente** se você quiser rodar todos simultaneamente
- Se rodar apenas um projeto por vez, pode usar a mesma porta (8000) para todos

## ❓ Problemas Comuns

### Erro de conexão com o banco de dados
- Verifique se o MySQL está rodando
- Confirme se as credenciais no `.env` estão corretas
- Certifique-se de que o banco de dados foi criado

### Erro de CORS no frontend
- O backend já está configurado com CORS
- Verifique se o backend está rodando na porta 3000

### Porta já em uso
- Altere a porta no arquivo `.env` ou encerre o processo que está usando a porta 3000

## 📄 Licença

Este projeto está sob a licença ISC.
