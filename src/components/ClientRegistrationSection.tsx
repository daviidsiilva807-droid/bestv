import { useMemo, useState } from 'react';
import { useAppStore } from '../context/AppStore';

export function ClientRegistrationSection() {
  const { addClient, plans } = useAppStore();
  const defaultPlan = plans[0];

  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlan.id);
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? defaultPlan,
    [defaultPlan, plans, selectedPlanId],
  );

  const [form, setForm] = useState({
    name: '',
    contact: '',
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
    planName: selectedPlan.name,
    planValue: selectedPlan.price,
    investmentValue: 10,
    observation: '',
    reminderEnabled: true,
    whatsappAlert: true,
  });

  const syncPlan = (planId: string) => {
    const plan = plans.find((item) => item.id === planId) ?? defaultPlan;

    setSelectedPlanId(plan.id);
    setForm((current) => ({
      ...current,
      planName: plan.name,
      planValue: plan.price,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addClient(form);

    setForm({
      name: '',
      contact: '',
      startDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      planName: selectedPlan.name,
      planValue: selectedPlan.price,
      investmentValue: 10,
      observation: '',
      reminderEnabled: true,
      whatsappAlert: true,
    });
  };

  return (
    <div className="section-layout section-layout--split">
      <article className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Cadastro de clientes</p>
            <h3>Novo cliente</h3>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nome</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>

          <label className="field">
            <span>Número para contato</span>
            <input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} required />
          </label>

          <label className="field">
            <span>Data de início</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              required
            />
          </label>

          <label className="field">
            <span>Vencimento</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              required
            />
          </label>

          <label className="field">
            <span>Plano</span>
            <select value={selectedPlanId} onChange={(event) => syncPlan(event.target.value)}>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Valor do plano</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.planValue}
              onChange={(event) => setForm({ ...form, planValue: Number(event.target.value) })}
              required
            />
          </label>

          <label className="field">
            <span>Investimento por cliente</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.investmentValue}
              onChange={(event) => setForm({ ...form, investmentValue: Number(event.target.value) })}
              required
            />
          </label>

          <label className="field field--full">
            <span>Observação</span>
            <textarea
              rows={4}
              value={form.observation}
              onChange={(event) => setForm({ ...form, observation: event.target.value })}
            />
          </label>

          <label className="toggle-field">
            <input
              type="checkbox"
              checked={form.reminderEnabled}
              onChange={(event) => setForm({ ...form, reminderEnabled: event.target.checked })}
            />
            <span>Notificação de vencimento ativa</span>
          </label>

          <label className="toggle-field">
            <input
              type="checkbox"
              checked={form.whatsappAlert}
              onChange={(event) => setForm({ ...form, whatsappAlert: event.target.checked })}
            />
            <span>Enviar alertas por WhatsApp</span>
          </label>

          <button className="primary-button" type="submit">
            Salvar cliente
          </button>
        </form>
      </article>

      <article className="panel-card panel-card--soft">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Ligação com faturamento</p>
            <h3>Plano selecionado</h3>
          </div>
        </div>

        <div className="plan-highlight">
          <strong>{selectedPlan.name}</strong>
          <span>{selectedPlan.screens}</span>
          <p>{selectedPlan.description}</p>
          <strong>{selectedPlan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
        </div>

        <p className="helper-text">
          O plano escolhido alimenta o valor do cliente, o faturamento e os alertas de promoção automaticamente.
        </p>
      </article>
    </div>
  );
}