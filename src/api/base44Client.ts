// src/api/base44Client.ts

// Banco de dados em memória (Simulação)
const db = {
  prontuarios: [] as any[],
  anotacoes: [] as any[],
  saes: [] as any[],
  relatoriosAlta: [] as any[],
  recursos: [
    {
      id: '1',
      titulo: 'Protocolo de Sepse',
      descricao: 'Diretrizes atualizadas para identificação e tratamento.',
      tipo: 'Protocolo',
      categoria: 'Emergência',
      created_date: new Date().toISOString()
    },
    {
      id: '2',
      titulo: 'Guia de Curativos',
      descricao: 'Manual técnico para tratamento de feridas.',
      tipo: 'PDF',
      categoria: 'Procedimentos',
      created_date: new Date().toISOString()
    }
  ] as any[]
};

// Função auxiliar para gerar ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Função auxiliar para simular delay de rede (para ver o loading do botão)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const base44 = {
  entities: {
    Prontuario: {
      list: async (sort?: string) => {
        await delay(500);
        return [...db.prontuarios];
      },
      create: async (data: any) => {
        await delay(800);
        const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
        db.prontuarios.push(newItem);
        return newItem;
      },
      filter: async (criteria: any) => {
        await delay(300);
        // Filtro simples por ID
        if (criteria.id) {
          return db.prontuarios.filter(p => p.id === criteria.id);
        }
        return [...db.prontuarios];
      }
    },
    AnotacaoEstudante: {
      filter: async (criteria: any) => {
        await delay(300);
        return db.anotacoes.filter(a => a.prontuario_id === criteria.prontuario_id);
      },
      create: async (data: any) => {
        await delay(500);
        const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
        db.anotacoes.push(newItem);
        return newItem;
      },
    },
    SAE: {
      filter: async (criteria: any) => {
        await delay(300);
        return db.saes.filter(s => s.prontuario_id === criteria.prontuario_id);
      },
      create: async (data: any) => {
        await delay(800);
        const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
        db.saes.push(newItem);
        return newItem;
      },
      update: async (id: string, data: any) => {
        await delay(500);
        const index = db.saes.findIndex(s => s.id === id);
        if (index !== -1) {
          db.saes[index] = { ...db.saes[index], ...data };
          return db.saes[index];
        }
        return null;
      },
      delete: async (id: string) => {
        await delay(500);
        db.saes = db.saes.filter(s => s.id !== id);
        return true;
      },
    },
    RelatorioAlta: {
      filter: async (criteria: any) => {
        await delay(300);
        // Retorna array com os relatórios daquele prontuário
        return db.relatoriosAlta.filter(r => r.prontuario_id === criteria.prontuario_id);
      },
      create: async (data: any) => {
        await delay(1000); // Delay maior para ver o botão "Salvando..."
        const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
        db.relatoriosAlta.push(newItem);
        return newItem;
      },
      update: async (id: string, data: any) => {
        await delay(800);
        const index = db.relatoriosAlta.findIndex(r => r.id === id);
        if (index !== -1) {
          db.relatoriosAlta[index] = { ...db.relatoriosAlta[index], ...data };
          return db.relatoriosAlta[index];
        }
        return null;
      },
    },
    RecursoBiblioteca: {
      list: async () => {
        await delay(500);
        return [...db.recursos];
      },
    }
  }
};