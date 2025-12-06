// src/api/base44Client.ts
import axios from 'axios';

// Cria a instância do axios apontando para /api
// O vercel.json redirecionará isso para o seu backend server/index.js
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
      // Adicionado para permitir a Edição
      update: async (id: string, data: any) => {
        const response = await api.put(`/prontuarios/${id}`, data);
        return response.data;
      },
      delete: async (id: string) => {
    const response = await api.delete(`/prontuarios/${id}`);
    return response.data;
      },
      filter: async (criteria: any) => {
        // Busca um prontuário específico pelo ID
        if (criteria.id) {
          try {
            const response = await api.get(`/prontuarios/${criteria.id}`);
            // Retorna um array contendo o objeto, pois o frontend espera um array no .filter()
            return [response.data];
          } catch (error) {
            console.error("Erro ao buscar prontuário:", error);
            return [];
          }
        }
        return [];
      }
    },

    // --- ANOTAÇÕES DO ESTUDANTE ---
    AnotacaoEstudante: {
      filter: async (criteria: any) => {
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

    // --- RECURSOS (Biblioteca) ---
    // Mesmo tendo removido a página, mantive aqui caso precise no futuro ou para evitar erro de TS se algo ainda referenciar
    RecursoBiblioteca: {
      list: async (sort?: string) => {
        // Se você não tiver essa rota no backend, isso retornará 404, mas não quebra o build
        try {
          const response = await api.get(`/recursos${sort ? `?sort=${sort}` : ''}`);
          return response.data;
        } catch (error) {
          return [];
        }
      },
    }
  }
};