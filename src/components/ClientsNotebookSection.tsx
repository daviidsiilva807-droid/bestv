import { useMemo } from 'react';
import { useAppStore } from '../context/AppStore';
import { formatDate, formatMoney } from '../utils/format';

export function ClientsNotebookSection() {
  const { clientLedgers, clients, deleteClient, toggleReminder } = useAppStore();

  const clientMap = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  );

  return (
    <div className="section-layout">
      <div className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Caderno de clientes</p>
            <h3>Informações e observações</h3>
          </div>
        </div>

        <div className="client-grid">
          {clientLedgers.length ? clientLedgers.map((ledger) => {
            const client = clientMap.get(ledger.clientId);

            if (!client) {
              return null;
            }

            return (
              <article key={ledger.clientId} className="client-card">
                <div className="client-card__top">
                  <div>
                    <strong>{client.name}</strong>
                    <span>{client.contact}</span>
                  </div>

                  <span className={`status-badge status-badge--${ledger.status.replace(' ', '-').toLowerCase()}`}>
                    {ledger.status}
                  </span>
                </div>

                <div className="client-meta-grid">
                  <div>
                    <span>Plano</span>
                    <strong>{client.planName}</strong>
                  </div>
                  <div>
                    <span>Valor</span>
                    <strong>{formatMoney(client.planValue)}</strong>
                  </div>
                  <div>
                    <span>Investimento</span>
                    <strong>{formatMoney(client.investmentValue)}</strong>
                  </div>
                  <div>
                    <span>Vencimento</span>
                    <strong>{formatDate(client.dueDate)}</strong>
                  </div>
                  <div>
                    <span>Saldo do mês</span>
                    <strong>{formatMoney(ledger.balanceDue)}</strong>
                  </div>
                  <div>
                    <span>Lembrete</span>
                    <strong>{client.reminderEnabled ? 'Ativo' : 'Desativado'}</strong>
                  </div>
                </div>

                <p className="client-card__note">{client.observation}</p>

                <div className="client-card__actions">
                  <button className="secondary-button" onClick={() => toggleReminder(client.id)} type="button">
                    {client.reminderEnabled ? 'Desativar lembrete' : 'Ativar lembrete'}
                  </button>

                  <button
                    className="secondary-button secondary-button--danger"
                    onClick={() => {
                      if (window.confirm(`Excluir ${client.name}? Os dados vinculados também serão removidos.`)) {
                        deleteClient(client.id);
                      }
                    }}
                    type="button"
                  >
                    Excluir cliente
                  </button>
                </div>
              </article>
            );
          }) : <p className="empty-state">Nenhum cliente cadastrado.</p>}
        </div>
      </div>
    </div>
  );
}