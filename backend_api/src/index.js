require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json({ limit: '10mb' })); // Permite receber JSON no body
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Permite receber dados de formulários

// Middleware de logging - mostra todas as requisições (deve vir DEPOIS dos body parsers)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl || req.path}`);
  console.log(`IP: ${req.ip || req.connection.remoteAddress}`);
  
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  if (Object.keys(req.query).length > 0) {
    console.log('Query params:', req.query);
  }

  // Log da resposta
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.log(`Error Response:`, data);
    } else {
      console.log(`Success Response:`, typeof data === 'string' ? data.substring(0, 200) : data);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return originalSend.apply(this, arguments);
  };
  
  next();
});

// Rotas
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API da Biblioteca funcionando!' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

