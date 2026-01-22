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
  // [MODIFICADO] Adicionado campo avaliacao
  evolucao_enfermagem: [
    {
      data_hora: String,
      descricao: String,
      avaliacao: String, 
      enfermeiro: String
    }
  ],
  // [NOVO] Novo campo para Diagnósticos de Enfermagem
  diagnosticos_enfermagem: [
    {
      tipo: String, // 'Diagnóstico', 'Risco', 'Promoção'
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

ProntuarioSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Prontuario', ProntuarioSchema);