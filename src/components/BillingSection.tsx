import { useMemo, useState } from 'react';
import { useAppStore } from '../context/AppStore';
import { formatDate, formatMoney, monthKey } from '../utils/format';
import { MetricCard } from './MetricCard';

export function BillingSection() {
  const { clients, clientLedgers, metrics, payments, plans, registerPayment } = useAppStore();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '');
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

  const currentMonth = monthKey(new Date());
  const methodCounter = payments.reduce<Record<string, number>>((accumulator, payment) => {
    accumulator[payment.method] = (accumulator[payment.method] ?? 0) + 1;
    return accumulator;
  }, {});

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