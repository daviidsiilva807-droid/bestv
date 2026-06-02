import type { Plan } from '../types';

export const plans: Plan[] = [
  {
    id: 'light',
    name: 'Plano Light',
    price: 30,
    screens: '1 tela',
    description: 'Entrada acessível para clientes que usam apenas um dispositivo.',
  },
  {
    id: 'casal',
    name: 'Plano Casal',
    price: 50,
    screens: '2 telas',
    description: 'Equilíbrio entre custo e uso simultâneo em dois aparelhos.',
  },
  {
    id: 'familia',
    name: 'Plano Família',
    price: 120,
    screens: '4 telas',
    description: 'Plano para compartilhamento familiar com mais estabilidade operacional.',
    featured: true,
  },
];