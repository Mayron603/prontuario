// src/api/base44Client.ts
import axios from 'axios';

// Cria a instância do axios apontando para /api
// No Vercel, o vercel.json redirecionará isso para o seu backend
const api = axios.create({
  baseURL: '/api' 
});

export const base44 = {
  entities: {
    // --- PRONTUÁRIOS ---
    Prontuario: {
      list: async (sort?: string) => {
        const response = await api.get(`/prontuarios${sort ? `?sort=${sort}` : ''}`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await api.post('/prontuarios', data);
        return response.data;
      },
      filter: async (criteria: any) => {
        // O código antigo usava filter({ id: '...' }) para pegar um único prontuário
        if (criteria.id) {
          try {
            const response = await api.get(`/prontuarios/${criteria.id}`);
            return [response.data]; // Retorna array pois o componente espera um array
          } catch (error) {
            return [];
          }
        }
        return [];
      }
    },

    // --- ANOTAÇÕES DO ESTUDANTE ---
    AnotacaoEstudante: {
      filter: async (criteria: any) => {
        // Busca anotações pelo ID do prontuário
        if (criteria.prontuario_id) {
          const response = await api.get(`/anotacoes?prontuario_id=${criteria.prontuario_id}`);
          return response.data;
        }
        return [];
      },
      create: async (data: any) => {
        const response = await api.post('/anotacoes', data);
        return response.data;
      },
    },

    // --- SAE (Sistematização da Assistência de Enfermagem) ---
    SAE: {
      filter: async (criteria: any) => {
        if (criteria.prontuario_id) {
          const response = await api.get(`/saes?prontuario_id=${criteria.prontuario_id}`);
          return response.data;
        }
        return [];
      },
      create: async (data: any) => {
        const response = await api.post('/saes', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await api.put(`/saes/${id}`, data);
        return response.data;
      },
      delete: async (id: string) => {
        const response = await api.delete(`/saes/${id}`);
        return response.data;
      },
    },

    // --- RELATÓRIO DE ALTA ---
    RelatorioAlta: {
      filter: async (criteria: any) => {
        if (criteria.prontuario_id) {
          const response = await api.get(`/relatorios-alta?prontuario_id=${criteria.prontuario_id}`);
          return response.data;
        }
        return [];
      },
      create: async (data: any) => {
        const response = await api.post('/relatorios-alta', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await api.put(`/relatorios-alta/${id}`, data);
        return response.data;
      },
    },

    // --- BIBLIOTECA (Seus PDFs e Recursos) ---
    RecursoBiblioteca: {
      list: async (sort?: string) => {
        const response = await api.get(`/recursos${sort ? `?sort=${sort}` : ''}`);
        return response.data;
      },
    }
  }
};