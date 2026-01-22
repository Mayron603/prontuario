const mongoose = require('mongoose');

const SAESchema = new mongoose.Schema({
  prontuario_id: { type: String, required: true },
  data_plantao: String,
  turno: String,
  enfermeiro_responsavel: String, // Enfermeiro geral da SAE
  
  historico_enfermagem: String,
  
  diagnosticos_enfermagem: [
    {
      diagnostico: String,
      caracteristicas: String,
      fatores_relacionados: String
    }
  ],

  // [MODIFICADO] Planejamento agora com Enfermeiro e Tabela SMART
  planejamento: [
    {
      enfermeiro: String, // Enfermeiro responsável pelo planejamento
      // Array de ações SMART
      acoes_smart: [
        {
          especifico: String,   // O que fazer?
          mensuravel: String,   // Como medir?
          atingivel: String,    // É possível?
          relevante: String,    // Por que é importante?
          temporal: String      // Quando/Quanto tempo?
        }
      ]
    }
  ],

  implementacao: String,
  avaliacao: String, // Avaliação geral da SAE
  
  created_date: { type: Date, default: Date.now }
});

SAESchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('SAE', SAESchema);