import { useMemo, useState } from 'react';
import { BrandMark } from './BrandMark';
import { HomeSection } from './HomeSection';
import { ClientsNotebookSection } from './ClientsNotebookSection';
import { ClientRegistrationSection } from './ClientRegistrationSection';
import { BillingSection } from './BillingSection';
import { PlansSection } from './PlansSection';
import { DatesMarketingSection } from './DatesMarketingSection';
import type { SectionId } from '../types';
import { useAppStore } from '../context/AppStore';
import { formatMoney } from '../utils/format';

interface DashboardShellProps {
  onLogout: () => void;
}

const sections: Array<{ id: SectionId; label: string; description: string }> = [
  { id: 'dashboard', label: 'Visão geral', description: 'Resumo do painel' },
  { id: 'caderno', label: 'Caderno de clientes', description: 'Lista e alertas' },
  { id: 'cadastro', label: 'Cadastro de clientes', description: 'Novo registro' },
  { id: 'faturamento', label: 'Faturamento', description: 'Pagamentos e lucro' },
  { id: 'planos', label: 'Preços e planos', description: 'Planos atuais' },
  { id: 'datas', label: 'Datas importantes', description: 'Promoções e marketing' },
];

export function DashboardShell({ onLogout }: DashboardShellProps) {
  const [section, setSection] = useState<SectionId>('dashboard');
  const { metrics, username } = useAppStore();

  const currentSectionLabel = useMemo(
    () => sections.find((item) => item.id === section)?.label ?? 'Visão geral',
    [section],
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <BrandMark size="medium" />
          <div>
            <strong>BESTv</strong>
            <span>Dashboard IPTV</span>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Seções do aplicativo">
          {sections.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${section === item.id ? 'nav-item--active' : ''}`}
              onClick={() => setSection(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div>
            <span>Usuário</span>
            <strong>{username ?? 'admin'}</strong>
          </div>

          <button className="secondary-button" onClick={onLogout} type="button">
            Sair
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace__header">
          <div>
            <p className="eyebrow">{currentSectionLabel}</p>
            <h1>BESTv</h1>
            <p className="workspace__subtitle">
              Comunicação entre clientes, pagamentos, descontos e promoções em tempo real.
            </p>
          </div>

          <div className="workspace__stats">
            <div className="workspace__stat-pill">
              <span>Clientes ativos</span>
              <strong>{metrics.activeClients}</strong>
            </div>
            <div className="workspace__stat-pill">
              <span>Recebido no mês</span>
              <strong>{formatMoney(metrics.receivedThisMonth)}</strong>
            </div>
            <div className="workspace__stat-pill">
              <span>Lucro líquido</span>
              <strong>{formatMoney(metrics.netProfit)}</strong>
            </div>
          </div>
        </header>

        <nav className="workspace__mobile-nav" aria-label="Atalhos móveis do aplicativo">
          {sections.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-item ${section === item.id ? 'mobile-nav-item--active' : ''}`}
              onClick={() => setSection(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <section className="hero-card">
          <div className="hero-card__logo">
            <BrandMark size="large" />
          </div>

          <div className="hero-card__content">
            <p className="eyebrow">Painel central</p>
            <h2>Controle operacional com a mesma paleta da referência</h2>
            <p>
              A estrutura abaixo atualiza clientes, valores, notificações, promoções e faturamento a partir de uma
              única fonte de dados.
            </p>

            <div className="hero-card__chips">
              {sections.map((item) => (
                <button key={item.id} className="hero-chip" onClick={() => setSection(item.id)} type="button">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="content-panel">
          {section === 'dashboard' ? <HomeSection onNavigate={setSection} /> : null}
          {section === 'caderno' ? <ClientsNotebookSection /> : null}
          {section === 'cadastro' ? <ClientRegistrationSection /> : null}
          {section === 'faturamento' ? <BillingSection /> : null}
          {section === 'planos' ? <PlansSection /> : null}
          {section === 'datas' ? <DatesMarketingSection /> : null}
        </section>
      </main>
    </div>
  );
}