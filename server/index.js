require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Prontuario = require('./models/Prontuario');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota Raiz (Opcional, mas bom para testar se o backend subiu)
app.get('/', (req, res) => {
  res.send('API Prontuário Eletrônico rodando!');
});

// Conexão com MongoDB otimizada para Serverless
// Evita criar múltiplas conexões a cada requisição
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Conectado ao MongoDB Atlas');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
    }
  }
};

// Middleware para garantir conexão com banco antes das rotas
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Rota para Atualizar Prontuário (PUT)
app.put('/api/prontuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    
    // findByIdAndUpdate: procura pelo ID e atualiza com o body
    // { new: true }: retorna o objeto já atualizado
    const prontuario = await Prontuario.findByIdAndUpdate(id, dadosAtualizados, { new: true });
    
    if (!prontuario) return res.status(404).json({ message: 'Prontuário não encontrado' });
    
    res.json(prontuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- Rotas de Prontuários ---
app.get('/api/prontuarios', async (req, res) => {
  try {
    const { sort } = req.query;
    let query = Prontuario.find();
    if (sort === '-created_date') {
      query = query.sort({ created_date: -1 });
    }
    const prontuarios = await query.exec();
    res.json(prontuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/prontuarios/:id', async (req, res) => {
  try {
    const prontuario = await Prontuario.findById(req.params.id);
    if (!prontuario) return res.status(404).json({ message: 'Prontuário não encontrado' });
    res.json(prontuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/prontuarios', async (req, res) => {
  try {
    const novoProntuario = new Prontuario(req.body);
    const salvo = await novoProntuario.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- CONFIGURAÇÃO FINAL PARA VERCEL ---

// Só inicia o servidor na porta se NÃO estiver na Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando localmente na porta ${PORT}`);
  });
}

// Exporta o app para a Vercel
module.exports = app;