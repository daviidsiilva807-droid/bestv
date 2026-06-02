import { useAppStore } from '../context/AppStore';
import { formatMoney } from '../utils/format';

export function PlansSection() {
  const { plans } = useAppStore();

  return (
    <div className="section-layout">
      <article className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Preços e planos</p>
            <h3>Planos atuais</h3>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <article key={plan.id} className={`plan-card ${plan.featured ? 'plan-card--featured' : ''}`}>
              <span className="plan-card__tag">{plan.screens}</span>
              <h4>{plan.name}</h4>
              <p>{plan.description}</p>
              <strong>{formatMoney(plan.price)}</strong>
            </article>
          ))}
        </div>
      </article>

      <article className="panel-card panel-card--soft">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Integração</p>
            <h3>Ligação com cadastro e faturamento</h3>
          </div>
        </div>

        <p className="helper-text">
          O plano escolhido no cadastro alimenta o valor mensal, o saldo do cliente e os relatórios de lucro líquido.
        </p>
      </article>
    </div>
  );
}