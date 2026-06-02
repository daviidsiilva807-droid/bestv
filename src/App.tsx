import { DashboardShell } from './components/DashboardShell';
import { InstallBanner } from './components/InstallBanner';
import { LoginScreen } from './components/LoginScreen';
import { useAppStore } from './context/AppStore';

export default function App() {
  const { isAuthenticated, login, logout } = useAppStore();

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={login} />
        <InstallBanner />
      </>
    );
  }

  return (
    <>
      <DashboardShell onLogout={logout} />
      <InstallBanner />
    </>
  );
}
