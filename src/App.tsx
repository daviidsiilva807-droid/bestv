import { DashboardShell } from './components/DashboardShell';
import { LoginScreen } from './components/LoginScreen';
import { useAppStore } from './context/AppStore';

export default function App() {
  const { isAuthenticated, login, logout } = useAppStore();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <DashboardShell onLogout={logout} />;
}
