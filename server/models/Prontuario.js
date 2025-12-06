// server/models/Prontuario.js
const mongoose = require('mongoose');

const SinalVitalSchema = new mongoose.Schema({
  data_hora: String,
  pa: String,
  fc: Number,
  fr: Number,
  temperatura: Number,
  spo2: Number,
  dor: Number
});

const EvolucaoSchema = new mongoose.Schema({
  data_hora: String,
  descricao: String,
  enfermeiro: String
});

const IntervencaoSchema = new mongoose.Schema({
  intervencao: String,
  horario: String,
  responsavel: String
});

const PrescricaoSchema = new mongoose.Schema({
  medicamento: String,
  dose: String,
  via: String,
  horarios: String
});

const ProntuarioSchema = new mongoose.Schema({
  nome_paciente: { type: String, required: true },
  idade: Number,
  sexo: String,
  diagnostico_principal: { type: String, required: true },
  diagnosticos_secundarios: [String],
  estado_clinico: String,
  prioridade: String,
  complexidade: String,
  quarto_leito: String,
  data_internacao: String,
  historia_clinica: String,
  antecedentes: String,
  alergias: [String],
  sinais_vitais: [SinalVitalSchema],
  evolucao_enfermagem: [EvolucaoSchema],
  intervencoes: [IntervencaoSchema],
  prescricoes: [PrescricaoSchema],
  observacoes: String,
  created_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prontuario', ProntuarioSchema);