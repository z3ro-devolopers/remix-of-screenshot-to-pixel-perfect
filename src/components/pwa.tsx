import { Download, RefreshCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

function previewOrDev() {
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true;
  const h = location.hostname;
  if (h.startsWith("id-preview--") || h.startsWith("preview--")) return true;
  if (/(^|\.)lovableproject(-dev)?\.com$/.test(h) || /(^|\.)beta\.lovable\.dev$/.test(h)) return true;
  return new URLSearchParams(location.search).get("sw") === "off";
}

async function unregisterAppSW() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs.filter((r) => r.active?.scriptURL.endsWith("/sw.js")).map((r) => r.unregister()),
  );
}

/** Single place that registers the service worker. Never runs in dev or preview. */
function useServiceWorker() {
  const [update, setUpdate] = useState<null | (() => void)>(null);
  useEffect(() => {
    if (previewOrDev()) {
      void unregisterAppSW();
      return;
    }
    void import("virtual:pwa-register").then(({ registerSW }) => {
      const updateSW = registerSW({
        onNeedRefresh: () => setUpdate(() => () => void updateSW(true)),
      });
    });
  }, []);
  return update;
}

function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const f = () => setOnline(navigator.onLine);
    f();
    addEventListener("online", f);
    addEventListener("offline", f);
    return () => {
      removeEventListener("online", f);
      removeEventListener("offline", f);
    };
  }, []);
  return online;
}

export function useInstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  useEffect(() => {
    if (matchMedia("(display-mode: standalone)").matches) return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    const onInstalled = () => setEvt(null);
    addEventListener("beforeinstallprompt", onPrompt);
    addEventListener("appinstalled", onInstalled);
    return () => {
      removeEventListener("beforeinstallprompt", onPrompt);
      removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  if (!evt) return null;
  return async () => {
    await evt.prompt();
    await evt.userChoice;
    setEvt(null);
  };
}

export function InstallButton() {
  const install = useInstallPrompt();
  if (!install) return null;
  return (
    <button
      onClick={install}
      className="flex h-11 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground hover:text-foreground"
    >
      <Download className="h-4 w-4" />
      <span className="hidden lg:inline">Instalar aplicativo</span>
      <span className="sr-only lg:hidden">Instalar aplicativo</span>
    </button>
  );
}

export function PwaStatus() {
  const update = useServiceWorker();
  const online = useOnline();
  if (online && !update) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-6">
      <div className="glass pointer-events-auto flex items-center gap-3 rounded-full px-4 py-2 text-sm ring-1 ring-border">
        {!online ? (
          <>
            <WifiOff className="h-4 w-4 text-muted-foreground" /> Sem conexão — exibindo o que já foi salvo
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 text-primary" /> Nova versão disponível
            <button onClick={update!} className="min-h-9 rounded-full bg-primary px-3 font-semibold text-primary-foreground">
              Atualizar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
