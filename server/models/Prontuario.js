const mongoose = require('mongoose');

const ProntuarioSchema = new mongoose.Schema({
  nome_paciente: { type: String, required: true },
  idade: { type: Number, required: true },
  sexo: { type: String, required: true },
  diagnostico_principal: { type: String, required: true },
  diagnosticos_secundarios: [String],
  estado_clinico: String,
  prioridade: String,
  complexidade: String,
  quarto_leito: String,
  data_internacao: Date,
  historia_clinica: String,
  antecedentes: String,
  alergias: [String],
  sinais_vitais: [
    {
      data_hora: String,
      pa: String,
      fc: Number,
      fr: Number,
      temperatura: Number,
      spo2: Number,
      dor: Number
    }
  ],
  evolucao_enfermagem: [
    {
      data_hora: String,
      descricao: String,
      enfermeiro: String
    }
  ],
  intervencoes: [
    {
      intervencao: String,
      horario: String,
      responsavel: String
    }
  ],
  prescricoes: [
    {
      medicamento: String,
      dose: String,
      via: String,
      horarios: String
    }
  ],
  observacoes: String,
  created_date: { type: Date, default: Date.now }
});

// --- A MÁGICA ACONTECE AQUI ---
// Essa configuração faz o MongoDB devolver "id" em vez de "_id" para o frontend
ProntuarioSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id; // Remove o _id original para não ficar duplicado
  }
});

module.exports = mongoose.model('Prontuario', ProntuarioSchema);