import { useMemo, useState } from 'react';
import { useAppStore } from '../context/AppStore';
import { formatDate, formatLongDate, formatMoney, formatMonthLabel } from '../utils/format';

export function DatesMarketingSection() {
  const { clients, promotions, marketingUpdates, addPromotion, addMarketingUpdate, toggleMarketingSent } = useAppStore();
  const [promotionForm, setPromotionForm] = useState({
    clientId: clients[0]?.id ?? '',
    title: 'Indicação de amigo',
    description: 'Cliente recebeu o próximo mês grátis por trazer um novo assinante.',
    discountValue: clients[0]?.planValue ?? 0,
    appliesToMonth: new Date().toISOString().slice(0, 7),
    active: true,
  });
  const [marketingForm, setMarketingForm] = useState({
    title: 'Catálogo da semana',
    channel: 'WhatsApp' as const,
    description: 'Divulgar novos filmes, séries e canais para a base ativa.',
    scheduledAt: new Date().toISOString().slice(0, 10),
    sent: false,
  });

  const importantDates = useMemo(
    () =>
      clients
        .slice()
        .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
        .slice(0, 5),
    [clients],
  );

  const handlePromotionClientChange = (clientId: string) => {
    const client = clients.find((item) => item.id === clientId);

    setPromotionForm((current) => ({
      ...current,
      clientId,
      discountValue: current.title === 'Indicação de amigo' && client ? client.planValue : current.discountValue,
    }));
  };

  const handlePromotionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = clients.find((item) => item.id === promotionForm.clientId);

    addPromotion({
      ...promotionForm,
      discountValue: promotionForm.title === 'Indicação de amigo' && client ? client.planValue : promotionForm.discountValue,
    });

    if (client) {
      setPromotionForm({
        clientId: client.id,
        title: 'Indicação de amigo',
        description: 'Cliente recebeu o próximo mês grátis por trazer um novo assinante.',
        discountValue: client.planValue,
        appliesToMonth: new Date().toISOString().slice(0, 7),
        active: true,
      });
    }
  };

  const handleMarketingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addMarketingUpdate(marketingForm);

    setMarketingForm({
      title: 'Catálogo da semana',
      channel: 'WhatsApp',
      description: 'Divulgar novos filmes, séries e canais para a base ativa.',
      scheduledAt: new Date().toISOString().slice(0, 10),
      sent: false,
    });
  };

  return (
    <div className="section-layout section-layout--split">
      <article className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Datas importantes</p>
            <h3>Promoções e indicação</h3>
          </div>
        </div>

        <form className="form-grid" onSubmit={handlePromotionSubmit}>
          <label className="field field--full">
            <span>Cliente</span>
            <select value={promotionForm.clientId} onChange={(event) => handlePromotionClientChange(event.target.value)}>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Título da promoção</span>
            <input
              value={promotionForm.title}
              onChange={(event) => setPromotionForm({ ...promotionForm, title: event.target.value })}
            />
          </label>

          <label className="field">
            <span>Mês aplicado</span>
            <input
              type="month"
              value={promotionForm.appliesToMonth}
              onChange={(event) => setPromotionForm({ ...promotionForm, appliesToMonth: event.target.value })}
            />
          </label>

          <label className="field field--full">
            <span>Descrição</span>
            <textarea
              rows={4}
              value={promotionForm.description}
              onChange={(event) => setPromotionForm({ ...promotionForm, description: event.target.value })}
            />
          </label>

          <label className="field">
            <span>Desconto</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={promotionForm.discountValue}
              onChange={(event) => setPromotionForm({ ...promotionForm, discountValue: Number(event.target.value) })}
            />
          </label>

          <label className="toggle-field">
            <input
              type="checkbox"
              checked={promotionForm.active}
              onChange={(event) => setPromotionForm({ ...promotionForm, active: event.target.checked })}
            />
            <span>Ativar promoção no faturamento</span>
          </label>

          <button className="primary-button" type="submit">
            Aplicar promoção
          </button>
        </form>

        <div className="summary-list summary-list--dense summary-list--spaced">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="summary-row summary-row--stacked">
              <div>
                <strong>{promotion.clientName}</strong>
                <span>{promotion.title}</span>
                <span>{promotion.description}</span>
              </div>
              <div className="summary-row__numbers">
                <strong>{formatMoney(promotion.discountValue)}</strong>
                <span>{formatMonthLabel(promotion.appliesToMonth)}</span>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card panel-card--soft">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Marketing</p>
            <h3>Atualizações e WhatsApp</h3>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleMarketingSubmit}>
          <label className="field field--full">
            <span>Título</span>
            <input
              value={marketingForm.title}
              onChange={(event) => setMarketingForm({ ...marketingForm, title: event.target.value })}
            />
          </label>

          <label className="field">
            <span>Canal</span>
            <select
              value={marketingForm.channel}
              onChange={(event) => setMarketingForm({ ...marketingForm, channel: event.target.value as typeof marketingForm.channel })}
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="E-mail">E-mail</option>
              <option value="Telegram">Telegram</option>
            </select>
          </label>

          <label className="field">
            <span>Envio</span>
            <input
              type="date"
              value={marketingForm.scheduledAt}
              onChange={(event) => setMarketingForm({ ...marketingForm, scheduledAt: event.target.value })}
            />
          </label>

          <label className="field field--full">
            <span>Mensagem</span>
            <textarea
              rows={4}
              value={marketingForm.description}
              onChange={(event) => setMarketingForm({ ...marketingForm, description: event.target.value })}
            />
          </label>

          <button className="primary-button" type="submit">
            Agendar atualização
          </button>
        </form>

        <div className="summary-list summary-list--dense">
          {marketingUpdates.map((update) => (
            <div key={update.id} className="summary-row summary-row--stacked">
              <div>
                <strong>{update.title}</strong>
                <span>{update.channel}</span>
                <span>{update.description}</span>
              </div>
              <div className="summary-row__numbers">
                <strong>{formatDate(update.scheduledAt)}</strong>
                <button className="secondary-button" type="button" onClick={() => toggleMarketingSent(update.id)}>
                  {update.sent ? 'Marcar como pendente' : 'Marcar como enviado'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="important-dates">
          <h4>Próximas datas do caderno</h4>
          {importantDates.map((client) => (
            <div key={client.id} className="important-dates__item">
              <strong>{client.name}</strong>
              <span>Vence em {formatLongDate(client.dueDate)}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}