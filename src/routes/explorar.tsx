import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, SlidersHorizontal, X, Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { PosterGrid, Shell } from "@/components/frame";
import { obras, TEMAS } from "@/data/obras";

const schema = z.object({
  q: z.string().optional().catch(undefined),
  tipo: z.enum(["filme", "serie"]).optional().catch(undefined),
  tema: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/explorar")({
  validateSearch: schema,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Explorar — Vimo" },
      { name: "description", content: "Busque e filtre filmes e séries por tipo e tema." },
      { property: "og:title", content: "Explorar — Vimo" },
      { property: "og:description", content: "Busque e filtre filmes e séries por tipo e tema." },
    ],
  }),
  component: Explorar,
});

const chip = (on: boolean) =>
  `inline-flex min-h-11 items-center rounded-full px-4 text-sm ring-1 ${on ? "bg-primary text-primary-foreground ring-primary" : "bg-card ring-border"}`;

function Explorar() {
  const { q = "", tipo, tema } = Route.useSearch();
  const navigate = useNavigate({ from: "/explorar" });
  const [sheet, setSheet] = useState(false);
  const set = (p: Partial<z.infer<typeof schema>>) =>
    navigate({ search: (s) => ({ ...s, ...p }), replace: true });

  const res = obras.filter(
    (o) =>
      o.titulo.toLowerCase().includes(q.toLowerCase()) &&
      (!tipo || o.tipo === tipo) &&
      (!tema || o.temas.includes(tema)),
  );
  const ativo = !!(q || tipo || tema);
  const limpar = () => navigate({ search: {}, replace: true });

  const filtros = (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
      <div className="flex flex-wrap gap-2">
        {([undefined, "filme", "serie"] as const).map((t) => (
          <button key={t ?? "todos"} className={chip(tipo === t)} onClick={() => set({ tipo: t })}>
            {t === "filme" ? "Filmes" : t === "serie" ? "Séries" : "Todos"}
          </button>
        ))}
      </div>
      <span className="hidden h-6 w-px bg-border md:block" />
      <div className="flex flex-wrap gap-2">
        {TEMAS.map((t) => (
          <button key={t} className={chip(tema === t)} onClick={() => set({ tema: tema === t ? undefined : t })}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Shell>
      <div className="mt-6 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">Explorar</h1>
        <Link to="/introducao" className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-muted-foreground hover:text-foreground">
          <Sparkles className="h-4 w-4" /> Ajustar preferências
        </Link>
      </div>
      <div className="mt-4 flex gap-2">
        <label className="flex min-h-11 flex-1 items-center gap-2 rounded-full bg-card px-4 ring-1 ring-border focus-within:ring-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="Buscar por título"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <button
          onClick={() => setSheet(true)}
          aria-label="Filtros"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card ring-1 ring-border md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 hidden md:block">{filtros}</div>

      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {res.length} {res.length === 1 ? "resultado" : "resultados"}
        </p>
        {ativo && (
          <button onClick={limpar} className="min-h-11 px-2 text-sm text-primary">
            Limpar filtros
          </button>
        )}
      </div>

      {res.length ? (
        <PosterGrid obras={res} />
      ) : (
        <div className="rounded-2xl bg-card p-10 text-center ring-1 ring-border">
          <p className="font-semibold">Nenhuma obra encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">Tente outro título ou remova alguns filtros.</p>
          <button onClick={limpar} className="mt-4 min-h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground">
            Limpar filtros
          </button>
        </div>
      )}

      {sheet && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/70" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-card p-4 pb-8 ring-1 ring-border">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Filtros</h2>
              <button aria-label="Fechar" onClick={() => setSheet(false)} className="flex h-11 w-11 items-center justify-center">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filtros}
            <button onClick={() => setSheet(false)} className="mt-6 min-h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground">
              Ver {res.length} resultados
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
