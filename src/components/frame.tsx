import { Link } from "@tanstack/react-router";
import { Compass, Film, Home, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { Obra } from "@/data/obras";
import { InstallButton } from "@/components/pwa";

export function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (err || !mounted)
    return (
      <div className={`img-fallback flex items-center justify-center ${className ?? ""}`}>
        <Film className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
    );
  return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className={`object-cover ${className ?? ""}`} />;
}

export function PosterCard({ obra, motivo }: { obra: Obra; motivo?: string | undefined }) {
  return (
    <Link to="/obra/$id" params={{ id: obra.id }} className="group block min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-card ring-1 ring-border transition group-hover:ring-primary">
        <Img src={obra.poster} alt={obra.titulo} className="h-full w-full" />
      </div>
      <p className="mt-2 truncate text-sm font-medium">{obra.titulo}</p>
      <p className="text-xs text-muted-foreground">
        {obra.ano} · {obra.tipo === "filme" ? "Filme" : "Série"}
      </p>
      {motivo && <p className="mt-1 line-clamp-2 text-xs text-primary">Também tem: {motivo}</p>}
    </Link>
  );
}

export function PosterGrid({ obras }: { obras: Obra[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {obras.map((o) => (
        <PosterCard key={o.id} obra={o} />
      ))}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold md:text-xl">{title}</h2>
      {children}
    </section>
  );
}

const nav = "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground";
const navActive = { className: "text-foreground bg-card" };

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
          <Link to="/" className="text-xl font-extrabold tracking-[0.25em]">
            FR<span className="text-primary">A</span>ME
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/" className={nav} activeProps={navActive} activeOptions={{ exact: true }}>Início</Link>
            <Link to="/explorar" className={nav} activeProps={navActive}>Explorar</Link>
          </nav>
          <div className="flex items-center gap-1">
          <InstallButton />
          <Link
            to="/explorar"
            aria-label="Buscar"
            className="flex h-11 items-center gap-2 rounded-full bg-card px-3 text-sm text-muted-foreground ring-1 ring-border md:w-64 md:px-4"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Buscar filmes e séries</span>
          </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 pb-28 md:px-8 md:pb-16">{children}</main>
      <nav className="glass fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden">
        <Link to="/" className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
          <Home className="h-5 w-5" /> Início
        </Link>
        <Link to="/explorar" className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground" activeProps={{ className: "text-primary" }}>
          <Compass className="h-5 w-5" /> Explorar
        </Link>
      </nav>
    </div>
  );
}

const KEY = "frame:quero-assistir";
export function useWatchlist(id: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      setOn((JSON.parse(localStorage.getItem(KEY) || "[]") as string[]).includes(id));
    } catch {}
  }, [id]);
  const toggle = () => {
    const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    setOn(next.includes(id));
  };
  return [on, toggle] as const;
}
