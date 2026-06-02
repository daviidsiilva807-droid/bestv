import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { plans } from '../data/plans';
import type {
  Activity,
  AppSnapshot,
  Client,
  ClientInput,
  ClientLedger,
  MarketingUpdate,
  MarketingUpdateInput,
  Metrics,
  Payment,
  PaymentInput,
  Plan,
  Promotion,
  PromotionInput,
} from '../types';
import { daysUntil, monthKey } from '../utils/format';

interface AuthState {
  username: string | null;
}

interface AppStoreValue {
  isAuthenticated: boolean;
  username: string | null;
  plans: Plan[];
  clients: Client[];
  payments: Payment[];
  promotions: Promotion[];
  marketingUpdates: MarketingUpdate[];
  activities: Activity[];
  clientLedgers: ClientLedger[];
  metrics: Metrics;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addClient: (input: ClientInput) => void;
  updateClient: (clientId: string, patch: Partial<Client>) => void;
  toggleReminder: (clientId: string) => void;
  registerPayment: (input: PaymentInput) => void;
  addPromotion: (input: PromotionInput) => void;
  addMarketingUpdate: (input: MarketingUpdateInput) => void;
  toggleMarketingSent: (updateId: string) => void;
}

const STORAGE_KEY = 'besttv.dashboard.state.v1';
const AUTH_KEY = 'besttv.dashboard.auth.v1';

const defaultState: AppSnapshot = {
  clients: [
    {
      id: 'client-1',
      name: 'João Silva',
      contact: '(11) 98888-1111',
      startDate: '2026-05-03',
      dueDate: '2026-06-05',
      planName: 'Plano Família',
      planValue: 120,
      investmentValue: 18,
      observation: 'Cliente com prioridade de renovação e suporte rápido.',
      reminderEnabled: true,
      whatsappAlert: true,
      active: true,
    },
    {
      id: 'client-2',
      name: 'Maria Souza',
      contact: '(11) 97777-2222',
      startDate: '2026-05-18',
      dueDate: '2026-06-10',
      planName: 'Plano Casal',
      planValue: 50,
      investmentValue: 10,
      observation: 'Uso compartilhado em dois aparelhos.',
      reminderEnabled: true,
      whatsappAlert: false,
      active: true,
    },
    {
      id: 'client-3',
      name: 'Pedro Lima',
      contact: '(11) 96666-3333',
      startDate: '2026-06-01',
      dueDate: '2026-06-15',
      planName: 'Plano Light',
      planValue: 30,
      investmentValue: 8,
      observation: 'Cliente novo em fase de acompanhamento.',
      reminderEnabled: true,
      whatsappAlert: true,
      active: true,
    },
  ],
  payments: [
    {
      id: 'payment-1',
      clientId: 'client-1',
      clientName: 'João Silva',
      date: '2026-06-01',
      amount: 120,
      method: 'PIX',
      note: 'Pagamento do mês confirmado.',
    },
    {
      id: 'payment-2',
      clientId: 'client-2',
      clientName: 'Maria Souza',
      date: '2026-06-02',
      amount: 50,
      method: 'Cartão',
      note: 'Renovação com cartão de crédito.',
    },
  ],
  promotions: [
    {
      id: 'promotion-1',
      clientId: 'client-3',
      clientName: 'Pedro Lima',
      title: 'Indicação de amigo',
      description: 'Cliente recebeu um mês grátis por indicação confirmada.',
      discountValue: 30,
      appliesToMonth: '2026-06',
      active: true,
      createdAt: '2026-06-01',
    },
  ],
  marketingUpdates: [
    {
      id: 'marketing-1',
      title: 'Atualização semanal de catálogo',
      channel: 'WhatsApp',
      description: 'Enviar novidades de filmes, séries e canais para a base ativa.',
      scheduledAt: '2026-06-04',
      sent: false,
    },
  ],
  activities: [
    {
      id: 'activity-1',
      title: 'Base inicial carregada',
      description: 'Clientes, pagamentos e promoções de exemplo foram preparados.',
      createdAt: '2026-06-02T08:00:00.000Z',
      tone: 'info',
    },
  ],
};

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

function randomId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function normalizeSnapshot(snapshot: Partial<AppSnapshot> | null): AppSnapshot {
  if (!snapshot) {
    return defaultState;
  }

  return {
    clients: snapshot.clients ?? defaultState.clients,
    payments: snapshot.payments ?? defaultState.payments,
    promotions: snapshot.promotions ?? defaultState.promotions,
    marketingUpdates: snapshot.marketingUpdates ?? defaultState.marketingUpdates,
    activities: snapshot.activities ?? defaultState.activities,
  };
}

function readInitialState(): AppSnapshot {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return defaultState;
  }

  try {
    return normalizeSnapshot(JSON.parse(rawState) as Partial<AppSnapshot>);
  } catch {
    return defaultState;
  }
}

function readInitialAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { username: null };
  }

  const rawAuth = window.localStorage.getItem(AUTH_KEY);

  if (!rawAuth) {
    return { username: null };
  }

  try {
    const parsed = JSON.parse(rawAuth) as AuthState;
    return { username: parsed.username ?? null };
  } catch {
    return { username: null };
  }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(() => readInitialState());
  const [auth, setAuth] = useState<AuthState>(() => readInitialAuth());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [snapshot]);

  useEffect(() => {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  const addActivity = (title: string, description: string, tone: Activity['tone'] = 'info') => {
    const activity: Activity = {
      id: randomId('activity'),
      title,
      description,
      createdAt: new Date().toISOString(),
      tone,
    };

    setSnapshot((current) => ({
      ...current,
      activities: [activity, ...current.activities].slice(0, 12),
    }));
  };

  const login = (username: string, password: string) => {
    const normalizedUsername = username.trim().toLowerCase();
    const isValid = normalizedUsername === 'admin' && password === 'admin';

    if (isValid) {
      setAuth({ username: 'admin' });
      addActivity('Acesso liberado', 'O usuário admin entrou no painel BESTv.', 'success');
    }

    return isValid;
  };

  const logout = () => {
    setAuth({ username: null });
    addActivity('Sessão encerrada', 'O acesso ao painel foi finalizado.', 'warning');
  };

  const addClient = (input: ClientInput) => {
    const client: Client = {
      id: randomId('client'),
      ...input,
      active: true,
    };

    setSnapshot((current) => ({
      ...current,
      clients: [client, ...current.clients],
    }));

    addActivity('Cliente cadastrado', `${client.name} foi incluído no caderno de clientes.`, 'success');
  };

  const updateClient = (clientId: string, patch: Partial<Client>) => {
    setSnapshot((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        client.id === clientId ? { ...client, ...patch } : client,
      ),
    }));

    addActivity('Cliente atualizado', 'As informações do cadastro foram sincronizadas.', 'info');
  };

  const toggleReminder = (clientId: string) => {
    const client = snapshot.clients.find((item) => item.id === clientId);

    if (!client) {
      return;
    }

    updateClient(clientId, { reminderEnabled: !client.reminderEnabled });
    addActivity(
      'Lembrete ajustado',
      `Notificação de vencimento ${client.reminderEnabled ? 'desativada' : 'ativada'} para ${client.name}.`,
      'info',
    );
  };

  const registerPayment = (input: PaymentInput) => {
    const client = snapshot.clients.find((item) => item.id === input.clientId);

    if (!client) {
      return;
    }

    const payment: Payment = {
      id: randomId('payment'),
      clientId: client.id,
      clientName: client.name,
      date: input.date,
      amount: input.amount,
      method: input.method,
      note: input.note,
    };

    setSnapshot((current) => ({
      ...current,
      payments: [payment, ...current.payments],
    }));

    addActivity(
      'Pagamento registrado',
      `${client.name} pagou ${input.amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })} via ${input.method}.`,
      'success',
    );
  };

  const addPromotion = (input: PromotionInput) => {
    const client = snapshot.clients.find((item) => item.id === input.clientId);

    if (!client) {
      return;
    }

    const promotion: Promotion = {
      id: randomId('promotion'),
      clientId: client.id,
      clientName: client.name,
      title: input.title,
      description: input.description,
      discountValue: input.discountValue,
      appliesToMonth: input.appliesToMonth,
      active: input.active,
      createdAt: new Date().toISOString(),
    };

    setSnapshot((current) => ({
      ...current,
      promotions: [promotion, ...current.promotions],
    }));

    addActivity(
      'Promoção aplicada',
      `${client.name} recebeu ${input.discountValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })} de desconto.`,
      'info',
    );
  };

  const addMarketingUpdate = (input: MarketingUpdateInput) => {
    const update: MarketingUpdate = {
      id: randomId('marketing'),
      title: input.title,
      channel: input.channel,
      description: input.description,
      scheduledAt: input.scheduledAt,
      sent: input.sent,
    };

    setSnapshot((current) => ({
      ...current,
      marketingUpdates: [update, ...current.marketingUpdates],
    }));

    addActivity('Marketing agendado', `${input.title} foi preparado para ${input.channel}.`, 'info');
  };

  const toggleMarketingSent = (updateId: string) => {
    setSnapshot((current) => ({
      ...current,
      marketingUpdates: current.marketingUpdates.map((update) =>
        update.id === updateId ? { ...update, sent: !update.sent } : update,
      ),
    }));

    addActivity('Status de campanha alterado', 'A campanha de marketing teve seu envio atualizado.', 'success');
  };

  const clientLedgers = useMemo(() => {
    const currentMonth = monthKey(new Date());

    return snapshot.clients.map<ClientLedger>((client) => {
      const receivedThisMonth = snapshot.payments
        .filter((payment) => payment.clientId === client.id && monthKey(payment.date) === currentMonth)
        .reduce((sum, payment) => sum + payment.amount, 0);

      const discountValue = snapshot.promotions
        .filter(
          (promotion) =>
            promotion.clientId === client.id && promotion.active && promotion.appliesToMonth === currentMonth,
        )
        .reduce((sum, promotion) => sum + promotion.discountValue, 0);

      const balanceDue = Math.max(0, client.planValue - receivedThisMonth - discountValue);
      const deadlineDistance = daysUntil(client.dueDate);
      const status: ClientLedger['status'] =
        balanceDue === 0 ? 'Em dia' : deadlineDistance < 0 ? 'Atrasado' : 'Acompanhar';

      return {
        id: client.id,
        clientId: client.id,
        clientName: client.name,
        dueDate: client.dueDate,
        planValue: client.planValue,
        receivedThisMonth,
        discountValue,
        balanceDue,
        reminderEnabled: client.reminderEnabled,
        status,
      };
    });
  }, [snapshot.clients, snapshot.payments, snapshot.promotions]);

  const metrics = useMemo<Metrics>(() => {
    const currentMonth = monthKey(new Date());
    const totalExpectedRevenue = snapshot.clients.reduce((sum, client) => sum + client.planValue, 0);
    const totalInvestment = snapshot.clients.reduce((sum, client) => sum + client.investmentValue, 0);
    const receivedThisMonth = snapshot.payments
      .filter((payment) => monthKey(payment.date) === currentMonth)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const totalDiscounts = snapshot.promotions
      .filter((promotion) => promotion.active && promotion.appliesToMonth === currentMonth)
      .reduce((sum, promotion) => sum + promotion.discountValue, 0);
    const averagePlanValue = snapshot.clients.length ? totalExpectedRevenue / snapshot.clients.length : 0;
    const upcomingRenewals = snapshot.clients.filter((client) => {
      const distance = daysUntil(client.dueDate);
      return distance >= 0 && distance <= 7;
    }).length;

    return {
      totalClients: snapshot.clients.length,
      activeClients: snapshot.clients.filter((client) => client.active).length,
      totalExpectedRevenue,
      receivedThisMonth,
      totalInvestment,
      totalDiscounts,
      netProfit: receivedThisMonth - totalInvestment - totalDiscounts,
      averagePlanValue,
      upcomingRenewals,
    };
  }, [snapshot.clients, snapshot.payments, snapshot.promotions]);

  const value = useMemo<AppStoreValue>(
    () => ({
      isAuthenticated: Boolean(auth.username),
      username: auth.username,
      plans,
      clients: snapshot.clients,
      payments: snapshot.payments,
      promotions: snapshot.promotions,
      marketingUpdates: snapshot.marketingUpdates,
      activities: snapshot.activities,
      clientLedgers,
      metrics,
      login,
      logout,
      addClient,
      updateClient,
      toggleReminder,
      registerPayment,
      addPromotion,
      addMarketingUpdate,
      toggleMarketingSent,
    }),
    [auth.username, clientLedgers, metrics, snapshot.activities, snapshot.clients, snapshot.marketingUpdates, snapshot.payments, snapshot.promotions],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useAppStore deve ser usado dentro de AppStoreProvider.');
  }

  return context;
}