import type { SectionId } from '../types';
import { useAppStore } from '../context/AppStore';
import { formatDate, formatMoney } from '../utils/format';
import { MetricCard } from './MetricCard';

interface HomeSectionProps {
  onNavigate: (section: SectionId) => void;
}

export function HomeSection({ onNavigate }: HomeSectionProps) {
  const { metrics, activities, clientLedgers } = useAppStore();
  const dueSoon = clientLedgers.filter((item) => item.status !== 'Em dia').slice(0, 3);

  return (
    <div className="section-layout section-layout--home">
      <div className="stat-grid">
        <MetricCard label="Clientes" value={String(metrics.totalClients)} note="Base total cadastrada" />
        <MetricCard label="Receita esperada" value={formatMoney(metrics.totalExpectedRevenue)} note="Valor mensal bruto" />
        <MetricCard label="Investimento" value={formatMoney(metrics.totalInvestment)} note="Custos operacionais" />
        <MetricCard label="Descontos" value={formatMoney(metrics.totalDiscounts)} note="Promoções ativas no mês" />
      </div>

      <div className="dual-grid">
        <article className="panel-card">
          <div className="panel-card__header">
            <div>
              <p className="eyebrow">Acesso rápido</p>
              <h3>Atalhos operacionais</h3>
            </div>
          </div>

          <div className="shortcut-grid">
            {[
              ['cadastro', 'Cadastrar cliente'],
              ['caderno', 'Abrir caderno'],
              ['faturamento', 'Ver faturamento'],
              ['datas', 'Promoções e marketing'],
            ].map(([section, label]) => (
              <button key={section} className="shortcut-card" onClick={() => onNavigate(section as SectionId)} type="button">
                <strong>{label}</strong>
                <span>Atualiza automaticamente os dados relacionados.</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card__header">
            <div>
              <p className="eyebrow">Alertas</p>
              <h3>Vencimentos próximos</h3>
            </div>
          </div>

          <div className="summary-list">
            {dueSoon.length ? (
              dueSoon.map((item) => (
                <div key={item.clientId} className="summary-row">
                  <div>
                    <strong>{item.clientName}</strong>
                    <span>Vencimento em {formatDate(item.dueDate)}</span>
                  </div>
                  <strong>{formatMoney(item.balanceDue)}</strong>
                </div>
              ))
            ) : (
              <p className="empty-state">Nenhum vencimento próximo encontrado.</p>
            )}
          </div>
        </article>
      </div>

      <article className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Comunicação interna</p>
            <h3>Últimas movimentações</h3>
          </div>
        </div>

        <div className="activity-feed">
          {activities.map((activity) => (
            <div key={activity.id} className={`activity-item activity-item--${activity.tone}`}>
              <div>
                <strong>{activity.title}</strong>
                <span>{activity.description}</span>
              </div>
              <small>{formatDate(activity.createdAt)}</small>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}