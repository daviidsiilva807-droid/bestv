export type PaymentMethod = 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência';

export type SectionId =
  | 'dashboard'
  | 'caderno'
  | 'cadastro'
  | 'faturamento'
  | 'planos'
  | 'datas';

export type ActivityTone = 'success' | 'info' | 'warning';

export interface Client {
  id: string;
  name: string;
  contact: string;
  startDate: string;
  dueDate: string;
  planName: string;
  planValue: number;
  investmentValue: number;
  observation: string;
  reminderEnabled: boolean;
  whatsappAlert: boolean;
  active: boolean;
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  note: string;
}

export interface Promotion {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  discountValue: number;
  appliesToMonth: string;
  active: boolean;
  createdAt: string;
}

export interface MarketingUpdate {
  id: string;
  title: string;
  channel: 'WhatsApp' | 'Instagram' | 'E-mail' | 'Telegram';
  description: string;
  scheduledAt: string;
  sent: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tone: ActivityTone;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  screens: string;
  description: string;
  featured?: boolean;
}

export interface ClientLedger {
  id: string;
  clientId: string;
  clientName: string;
  dueDate: string;
  planValue: number;
  receivedThisMonth: number;
  discountValue: number;
  balanceDue: number;
  reminderEnabled: boolean;
  status: 'Em dia' | 'Acompanhar' | 'Atrasado';
}

export interface Metrics {
  totalClients: number;
  activeClients: number;
  totalExpectedRevenue: number;
  receivedThisMonth: number;
  totalInvestment: number;
  totalDiscounts: number;
  netProfit: number;
  averagePlanValue: number;
  upcomingRenewals: number;
}

export interface AppSnapshot {
  clients: Client[];
  payments: Payment[];
  promotions: Promotion[];
  marketingUpdates: MarketingUpdate[];
  activities: Activity[];
}

export interface ClientInput {
  name: string;
  contact: string;
  startDate: string;
  dueDate: string;
  planName: string;
  planValue: number;
  investmentValue: number;
  observation: string;
  reminderEnabled: boolean;
  whatsappAlert: boolean;
}

export interface PaymentInput {
  clientId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  note: string;
}

export interface PromotionInput {
  clientId: string;
  title: string;
  description: string;
  discountValue: number;
  appliesToMonth: string;
  active: boolean;
}

export interface MarketingUpdateInput {
  title: string;
  channel: MarketingUpdate['channel'];
  description: string;
  scheduledAt: string;
  sent: boolean;
}