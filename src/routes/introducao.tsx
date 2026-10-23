import { Brand } from "@/components/brand";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Img } from "@/components/frame";
import { obras, type Tipo } from "@/data/obras";
import {
  concluirIntroducao,
  EXPERIENCIAS,
  GENEROS,
  lerPreferencias,
  MAX_EXPERIENCIAS,
  MAX_OBRAS,
  salvarPreferencias,
  type Preferencias,
} from "@/data/preferencias";

export const Route = createFileRoute("/introducao")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Seu gosto — Vimo" },
      { name: "description", content: "Conte o que você gosta de assistir para o Vimo ordenar suas descobertas." },
      { property: "og:title", content: "Seu gosto — Vimo" },
      { property: "og:description", content: "Conte o que você gosta de assistir para o Vimo ordenar suas descobertas." },
    ],
  }),
  component: Introducao,
});

const vazio: Preferencias = { tipos: [], generos: [], experiencias: [], obras: [] };
const chip = (on: boolean, off = false) =>
  `inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm ring-1 transition ${on ? "bg-primary text-primary-foreground ring-primary" : off ? "bg-card text-muted-foreground opacity-50 ring-border" : "bg-card ring-border hover:ring-primary"}`;

function alterna<T>(l: T[], v: T, max = Infinity) {
  return l.includes(v) ? l.filter((x) => x !== v) : l.length < max ? [...l, v] : l;
}

function Introducao() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [p, setP] = useState<Preferencias>(vazio);
  useEffect(() => setP(lerPreferencias() ?? vazio), []);

  const sair = (salvar: boolean) => {
    if (salvar) salvarPreferencias(p);
    concluirIntroducao();
    navigate({ to: "/" });
  };

  const titulos = ["O que você gosta de assistir?", "Que tipo de experiência você procura?", "Escolha algumas obras que você curte"];

  let corpo: ReactNode;
  if (etapa === 0)
    corpo = (
      <>
        <div className="flex flex-wrap gap-2">
          {(["filme", "serie"] as Tipo[]).map((t) => (
            <button key={t} aria-pressed={p.tipos.includes(t)} className={chip(p.tipos.includes(t))} onClick={() => setP({ ...p, tipos: alterna(p.tipos, t) })}>
              {p.tipos.includes(t) && <Check className="h-4 w-4" />} {t === "filme" ? "Filmes" : "Séries"}
            </button>
          ))}
        </div>
        <h2 className="mt-8 text-sm font-semibold text-muted-foreground">Gêneros</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {GENEROS.map((g) => (
            <button key={g} aria-pressed={p.generos.includes(g)} className={chip(p.generos.includes(g))} onClick={() => setP({ ...p, generos: alterna(p.generos, g) })}>
              {p.generos.includes(g) && <Check className="h-4 w-4" />} {g}
            </button>
          ))}
        </div>
      </>
    );
  else if (etapa === 1) {
    const cheio = p.experiencias.length >= MAX_EXPERIENCIAS;
    corpo = (
      <>
        <p className="mb-4 text-sm text-muted-foreground">
          Escolha até {MAX_EXPERIENCIAS} · <span className={cheio ? "text-primary" : ""}>{p.experiencias.length} de {MAX_EXPERIENCIAS} selecionadas</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCIAS.map((e) => {
            const on = p.experiencias.includes(e);
            return (
              <button key={e} aria-pressed={on} disabled={!on && cheio} className={chip(on, !on && cheio)} onClick={() => setP({ ...p, experiencias: alterna(p.experiencias, e, MAX_EXPERIENCIAS) })}>
                {on && <Check className="h-4 w-4" />} {e}
              </button>
            );
          })}
        </div>
      </>
    );
  } else
    corpo = (
      <>
        <p className="mb-4 text-sm text-muted-foreground">
          Escolha até três para começarmos a conhecer seu gosto · {p.obras.length} de {MAX_OBRAS}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {obras.map((o) => {
            const on = p.obras.includes(o.id);
            const bloq = !on && p.obras.length >= MAX_OBRAS;
            return (
              <button
                key={o.id}
                aria-pressed={on}
                disabled={bloq}
                onClick={() => setP({ ...p, obras: alterna(p.obras, o.id, MAX_OBRAS) })}
                className={`relative overflow-hidden rounded-xl text-left ring-2 transition ${on ? "ring-primary" : "ring-transparent"} ${bloq ? "opacity-40" : ""}`}
              >
                <Img src={o.poster} alt={o.titulo} className="block aspect-[2/3] w-full" />
                {on && (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span className="block truncate bg-card px-2 py-1.5 text-xs">{o.titulo}</span>
              </button>
            );
          })}
        </div>
      </>
    );

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6 md:py-12">
      <div className="flex items-center justify-between">
        <Brand />
        <button onClick={() => sair(false)} className="min-h-11 px-2 text-sm text-muted-foreground hover:text-foreground">
          Pular por enquanto
        </button>
      </div>
      <div className="mt-6 flex gap-2" aria-label={`Etapa ${etapa + 1} de 3`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= etapa ? "bg-primary" : "bg-card"}`} />
        ))}
      </div>
      <p className="mt-6 text-xs uppercase tracking-widest text-primary">Etapa {etapa + 1} de 3</p>
      <h1 className="mt-2 mb-6 text-2xl font-bold md:text-3xl">{titulos[etapa]}</h1>
      <div className="flex-1 pb-28">{corpo}</div>
      <div className="glass fixed inset-x-0 bottom-0 border-t border-border">
        <div className="mx-auto flex max-w-3xl gap-3 px-4 py-3">
          {etapa > 0 && (
            <button onClick={() => setEtapa(etapa - 1)} className="min-h-11 flex-1 rounded-full ring-1 ring-border">
              Voltar
            </button>
          )}
          <button
            onClick={() => (etapa < 2 ? setEtapa(etapa + 1) : sair(true))}
            className="min-h-11 flex-[2] rounded-full bg-primary font-semibold text-primary-foreground"
          >
            {etapa < 2 ? "Continuar" : "Explorar o Vimo"}
          </button>
        </div>
      </div>
    </div>
  );
}
