import { useState } from 'react';
import { BrandMark } from './BrandMark';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = onLogin(username, password);

    if (!isValid) {
      setError('Usuário ou senha inválidos. Use admin/admin.');
      return;
    }

    setError('');
  };

  return (
    <main className="auth-screen">
      <div className="auth-screen__glow auth-screen__glow--left" />
      <div className="auth-screen__glow auth-screen__glow--right" />
      <section className="auth-card">
        <div className="auth-card__brand">
          <BrandMark size="large" />
          <div>
            <p className="eyebrow">BESTv</p>
            <h1>Monitoramento IPTV</h1>
            <p>Entre com a conta administrativa para acessar clientes, faturamento e promoções.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Usuário</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin"
            />
          </label>

          {error ? <p className="field-error">{error}</p> : null}

          <button className="primary-button primary-button--full" type="submit">
            Entrar no painel
          </button>
        </form>

        <div className="auth-card__hint">
          <span>Credenciais padrão</span>
          <strong>admin / admin</strong>
        </div>
      </section>
    </main>
  );
}