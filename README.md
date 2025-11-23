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

### 4. Criar o banco de dados e popular com dados de teste

1. Abra o MySQL (via linha de comando ou MySQL Workbench)

2. Crie o banco de dados:

```sql
CREATE DATABASE nome_da_sua_database;
USE nome_da_sua_database;
```

**⚠️ Importante:** Substitua `nome_da_sua_database` pelo nome que você configurou no arquivo `.env`

3. Execute o arquivo `mock_data.sql` que está na pasta `backend_api`:

**Opção A: Via MySQL Workbench**
- Abra o MySQL Workbench
- Conecte-se ao servidor MySQL
- Abra o arquivo `backend_api/mock_data.sql`
- Antes de executar, descomente e ajuste as linhas 16-17 se necessário:
  ```sql
  CREATE DATABASE IF NOT EXISTS nome_da_sua_database;
  USE nome_da_sua_database;
  ```
- Execute todo o script (Ctrl+Shift+Enter ou botão "Execute")

**Opção B: Via linha de comando**
```bash
mysql -u root -p nome_da_sua_database < backend_api/mock_data.sql
```

**Opção C: Copiar e colar no MySQL**
- Abra o arquivo `backend_api/mock_data.sql` em um editor de texto
- Descomente e ajuste as linhas 16-17 se necessário:
  ```sql
  CREATE DATABASE IF NOT EXISTS nome_da_sua_database;
  USE nome_da_sua_database;
  ```
- Copie todo o conteúdo
- Cole no MySQL Workbench ou linha de comando e execute

**📋 O que o script faz:**
- Cria todas as tabelas necessárias (`livro`, `aluno`, `exemplar`, `emprestimo`)
- Insere dados de teste:
  - 15 livros de literatura brasileira
  - 10 alunos com matrículas e senhas (todas: `senha123`)
  - Múltiplos exemplares de cada livro com diferentes status
  - Empréstimos de exemplo (ativos, devolvidos no prazo, devolvidos com atraso)

**🔑 Credenciais de teste:**
- **Email:** `joao.silva@email.com` até `beatriz.araujo@email.com`
- **Senha:** `senha123` (para todos os alunos)
- **Matrículas:** `2024001` até `2024010`
- **Códigos de barras de exemplares:** `EX001`, `EX002`, `EX003`, etc.

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
│   ├── mock_data.sql    # Script SQL com tabelas e dados de teste
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
- `POST /api/alunos/login` - Login do aluno
- `GET /api/alunos` - Listar todos os alunos
- `GET /api/alunos/ranking` - Buscar ranqueamento de leitura
- `GET /api/alunos/:id/ranking` - Buscar ranqueamento de um aluno específico
- `GET /api/alunos/:id` - Buscar aluno por ID

### Livros
- `POST /api/livros` - Criar novo livro
- `GET /api/livros` - Listar todos os livros
- `GET /api/livros/disponiveis` - Listar livros disponíveis para empréstimo
- `GET /api/livros/:id` - Buscar livro por ID

### Empréstimos
- `GET /api/emprestimos/ativos` - Listar empréstimos ativos
- `GET /api/emprestimos` - Listar todos os empréstimos
- `GET /api/emprestimos/:id` - Buscar empréstimo por ID
- `POST /api/emprestimos/retirada` - Realizar retirada de livro
- `POST /api/emprestimos/devolucao` - Realizar devolução de livro

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

## 🧪 Dados de Teste

O arquivo `mock_data.sql` já inclui dados de teste prontos para uso:

### Alunos para Login
- **Email:** `joao.silva@email.com`
- **Senha:** `senha123`
- **Matrícula:** `2024001`

Ou use qualquer um dos 10 alunos criados (matrículas de `2024001` a `2024010`, todos com senha `senha123`)

### Códigos de Barras para Autoatendimento
- **Exemplares disponíveis:** `EX001`, `EX002`, `EX003`, etc.
- **Exemplares emprestados:** `EX011`, `EX012`, `EX013`, etc. (para testar devolução)

### Exemplos de Uso
1. **Login no Programa Aluno:** Use `joao.silva@email.com` / `senha123`
2. **Retirada no Autoatendimento:** Use código `EX001` e matrícula `2024001`
3. **Devolução no Autoatendimento:** Use código `EX011` (já está emprestado nos dados de teste)

## ❓ Problemas Comuns

### Erro de conexão com o banco de dados
- Verifique se o MySQL está rodando
- Confirme se as credenciais no `.env` estão corretas
- Certifique-se de que o banco de dados foi criado
- Verifique se executou o arquivo `mock_data.sql` corretamente

### Erro de CORS no frontend
- O backend já está configurado com CORS
- Verifique se o backend está rodando na porta 3000

### Porta já em uso
- Altere a porta no arquivo `.env` ou encerre o processo que está usando a porta 3000

## 📄 Licença

Este projeto está sob a licença ISC.
