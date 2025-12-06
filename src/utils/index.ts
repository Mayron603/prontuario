// src/utils/index.ts

// Função simples para gerar URLs. Ajuste conforme sua estrutura de rotas.
export const createPageUrl = (pageName: string) => {
  if (pageName === 'Home') return '/';
  // Converte CamelCase para kebab-case (ex: ProntuarioDetalhe -> /prontuario-detalhe)
  const path = pageName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return `/${path}`;
};

// Utilitário para classes condicionais (usado pelo shadcn/ui se você tiver)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}