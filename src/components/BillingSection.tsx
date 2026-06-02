import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../context/AppStore';
import { formatDate, formatMoney, formatMonthLabel, monthKey } from '../utils/format';
import { MetricCard } from './MetricCard';

export function BillingSection() {
  const { clients, clientLedgers, metrics, payments, plans, registerPayment } = useAppStore();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '');
  const [selectedMonth, setSelectedMonth] = useState(() => monthKey(new Date()));
  const [form, setForm] = useState({
    amount: clients[0]?.planValue ?? 0,
    method: 'PIX' as const,
    date: new Date().toISOString().slice(0, 10),
    note: 'Pagamento mensal registrado no painel.',
  });

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? clients[0],
    [clients, selectedClientId],
  );

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.name === selectedClient?.planName) ?? plans[0],
    [plans, selectedClient],
  );

  useEffect(() => {
    if (!clients.length) {
      setSelectedClientId('');
      setForm((current) => ({ ...current, amount: 0 }));
      return;
    }

    const clientStillExists = clients.some((client) => client.id === selectedClientId);

    if (!clientStillExists) {
      const firstClient = clients[0];
      setSelectedClientId(firstClient.id);
      setForm((current) => ({ ...current, amount: firstClient.planValue }));
    }
  }, [clients, selectedClientId]);

  const currentMonth = monthKey(new Date());
  const monthlyBilling = useMemo(() => {
    const grouped = payments.reduce<Record<string, { total: number; count: number }>>((accumulator, payment) => {
      const key = monthKey(payment.date);
      const current = accumulator[key] ?? { total: 0, count: 0 };

      accumulator[key] = {
        total: current.total + payment.amount,
        count: current.count + 1,
      };

      return accumulator;
    }, {});

    return Object.entries(grouped)
      .map(([month, summary]) => ({ month, ...summary }))
      .sort((first, second) => second.month.localeCompare(first.month));
  }, [payments]);

  const selectedMonthPayments = useMemo(
    () => payments.filter((payment) => monthKey(payment.date) === selectedMonth),
    [payments, selectedMonth],
  );

  const selectedMonthTotal = selectedMonthPayments.reduce((accumulator, payment) => accumulator + payment.amount, 0);
  const methodCounter = selectedMonthPayments.reduce<Record<string, number>>((accumulator, payment) => {
    accumulator[payment.method] = (accumulator[payment.method] ?? 0) + 1;
    return accumulator;
  }, {});

  useEffect(() => {
    if (!monthlyBilling.length) {
      setSelectedMonth(currentMonth);
      return;
    }

    const monthStillExists = monthlyBilling.some((entry) => entry.month === selectedMonth);

    if (!monthStillExists) {
      setSelectedMonth(monthlyBilling[0].month);
    }
  }, [currentMonth, monthlyBilling, selectedMonth]);

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((item) => item.id === clientId);

    if (client) {
      setForm((current) => ({ ...current, amount: client.planValue }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedClient) {
      return;
    }

    registerPayment({
      clientId: selectedClient.id,
      amount: form.amount,
      method: form.method,
      date: form.date,
      note: form.note,
    });

    setForm({
      amount: selectedClient.planValue,
      method: 'PIX',
      date: new Date().toISOString().slice(0, 10),
      note: 'Pagamento mensal registrado no painel.',
    });
  };

  return (
    <div className="section-layout">
      <div className="stat-grid stat-grid--compact">
        <MetricCard label="Lucro líquido" value={formatMoney(metrics.netProfit)} note="Receita - investimento - descontos" />
        <MetricCard label="Receita recebida" value={formatMoney(metrics.receivedThisMonth)} note={`Mês atual (${currentMonth})`} />
        <MetricCard label="Investimento total" value={formatMoney(metrics.totalInvestment)} note="Custos por cliente" />
        <MetricCard label="Média por plano" value={formatMoney(metrics.averagePlanValue)} note="Valor médio do ticket" />
      </div>

      <article className="panel-card panel-card--soft">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Faturamento por mês</p>
            <h3>Botões com valores consolidados</h3>
          </div>
          <div className="billing-month__selected">
            <span>Mês ativo</span>
            <strong>{formatMonthLabel(selectedMonth)}</strong>
          </div>
        </div>

        <div className="billing-month__grid" role="list" aria-label="Resumo mensal de faturamento">
          {monthlyBilling.map((item) => (
            <button
              key={item.month}
              className={`billing-month__button ${selectedMonth === item.month ? 'billing-month__button--active' : ''}`}
              type="button"
              onClick={() => setSelectedMonth(item.month)}
            >
              <span>{formatMonthLabel(item.month)}</span>
              <strong>{formatMoney(item.total)}</strong>
              <small>{item.count} lançamentos</small>
            </button>
          ))}
        </div>

        <div className="summary-list summary-list--spaced">
          <div className="summary-row">
            <div>
              <strong>{formatMonthLabel(selectedMonth)}</strong>
              <span>Receita total do mês</span>
            </div>
            <div className="summary-row__numbers">
              <strong>{formatMoney(selectedMonthTotal)}</strong>
              <span>{selectedMonthPayments.length} pagamentos</span>
            </div>
          </div>

          <div className="summary-row">
            <div>
              <strong>Valor médio por lançamento</strong>
              <span>Baseado nos pagamentos do mês ativo</span>
            </div>
            <div className="summary-row__numbers">
              <strong>{formatMoney(selectedMonthPayments.length ? selectedMonthTotal / selectedMonthPayments.length : 0)}</strong>
              <span>Ticket mensal</span>
            </div>
          </div>
        </div>
      </article>

      <div className="dual-grid">
        <article className="panel-card">
          <div className="panel-card__header">
            <div>
              <p className="eyebrow">Registro de pagamento</p>
              <h3>Lançar movimentação</h3>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field field--full">
              <span>Cliente</span>
              <select value={selectedClient?.id ?? ''} onChange={(event) => handleClientChange(event.target.value)}>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Valor</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })}
                required
              />
            </label>

            <label className="field">
              <span>Método</span>
              <select value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value as typeof form.method })}>
                <option value="PIX">PIX</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Transferência">Transferência</option>
              </select>
            </label>

            <label className="field">
              <span>Data</span>
              <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            </label>

            <label className="field field--full">
              <span>Observação</span>
              <textarea rows={4} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
            </label>

            <button className="primary-button" type="submit">
              Registrar pagamento
            </button>
          </form>
        </article>

        <article className="panel-card panel-card--soft">
          <div className="panel-card__header">
            <div>
              <p className="eyebrow">Resumo por cliente</p>
              <h3>Comunicação de saldos</h3>
            </div>
          </div>

          <div className="plan-highlight">
            <strong>{selectedClient?.name ?? 'Cliente selecionado'}</strong>
            <span>{selectedPlan.name}</span>
            <p>
              Valor do plano: {formatMoney(selectedPlan.price)} | Vencimento: {selectedClient ? formatDate(selectedClient.dueDate) : '--'}
            </p>
          </div>

          <div className="summary-list summary-list--dense">
            {clientLedgers.map((ledger) => (
              <div key={ledger.clientId} className="summary-row summary-row--stacked">
                <div>
                  <strong>{ledger.clientName}</strong>
                  <span>Vencimento: {formatDate(ledger.dueDate)}</span>
                </div>

                <div className="summary-row__numbers">
                  <strong>{formatMoney(ledger.balanceDue)}</strong>
                  <span>{ledger.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="method-bars">
            {Object.entries(methodCounter).map(([method, count]) => (
              <div key={method} className="method-bars__item">
                <span>{method}</span>
                <div className="method-bars__track">
                  <div className="method-bars__fill" style={{ width: `${Math.min(100, count * 30)}%` }} />
                </div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}