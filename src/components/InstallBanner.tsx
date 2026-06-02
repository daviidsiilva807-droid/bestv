import { useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISS_KEY = 'besttv.install-banner.dismissed.v1';

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === 'true');
    setInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const shouldShow = useMemo(() => {
    if (installed || dismissed) {
      return false;
    }

    return window.matchMedia('(max-width: 860px)').matches || Boolean(deferredPrompt);
  }, [deferredPrompt, dismissed, installed]);

  if (!shouldShow) {
    return null;
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setDismissed(true);
      window.localStorage.setItem(DISMISS_KEY, 'true');
      return;
    }

    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, 'true');
  };

  const handleDismiss = () => {
    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, 'true');
  };

  return (
    <aside className="install-banner" aria-label="Aviso de instalação do aplicativo">
      <div>
        <strong>Instale o BESTv na tela inicial</strong>
        <p>Para abrir como aplicativo no smartphone, adicione este site à tela de início do seu aparelho.</p>
      </div>

      <div className="install-banner__actions">
        <button className="primary-button primary-button--compact" onClick={handleInstall} type="button">
          {deferredPrompt ? 'Instalar agora' : 'Como instalar'}
        </button>
        <button className="secondary-button secondary-button--compact" onClick={handleDismiss} type="button">
          Depois
        </button>
      </div>
    </aside>
  );
}