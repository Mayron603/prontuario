// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Prontuario = require('./models/Prontuario');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas de Prontuários
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

// Inicializar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});