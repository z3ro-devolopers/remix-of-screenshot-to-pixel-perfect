import type { Obra, Tipo } from "./obras";

export type Preferencias = {
  tipos: Tipo[];
  generos: string[];
  experiencias: string[];
  obras: string[];
};

export const GENEROS = ["Ação", "Suspense", "Drama", "Comédia", "Terror", "Ficção científica", "Romance", "Animação", "Documentário"];
export const EXPERIENCIAS = [
  "Tensão e mistério",
  "Investigação",
  "Desastres e sobrevivência",
  "Histórias emocionantes",
  "Algo leve para relaxar",
  "Mundos e ideias diferentes",
  "Baseado em fatos reais",
];
export const MAX_EXPERIENCIAS = 5;
export const MAX_OBRAS = 3;

const PREF_KEY = "frame:preferencias";
const DONE_KEY = "frame:introducao-concluida";

/** Which genres/tags/themes of a work each answer matches. */
const GENERO_MAP: Record<string, string[]> = {
  Suspense: ["Thriller", "Mistério"],
};
const EXP_MAP: Record<string, string[]> = {
  "Tensão e mistério": ["Tensão crescente", "Mistério"],
  Investigação: ["Investigação", "Investigação científica"],
  "Desastres e sobrevivência": ["Desastres naturais", "Sobrevivência"],
  "Histórias emocionantes": ["Laços familiares", "Drama"],
  "Mundos e ideias diferentes": ["Ficção científica", "Contemplativo"],
};

export function lerPreferencias(): Preferencias | null {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? (JSON.parse(raw) as Preferencias) : null;
  } catch {
    return null;
  }
}
export function salvarPreferencias(p: Preferencias) {
  localStorage.setItem(PREF_KEY, JSON.stringify(p));
}
export const introducaoConcluida = () => localStorage.getItem(DONE_KEY) === "1";
export const concluirIntroducao = () => localStorage.setItem(DONE_KEY, "1");

export function pontuar(o: Obra, p: Preferencias, catalogo: Obra[]): number {
  const marcas = new Set([...o.generos, ...o.personalidade, ...o.temas]);
  let s = 0;
  if (p.tipos.includes(o.tipo)) s += 1;
  for (const g of p.generos) for (const m of GENERO_MAP[g] ?? [g]) if (marcas.has(m)) s += 1;
  for (const e of p.experiencias) for (const m of EXP_MAP[e] ?? []) if (marcas.has(m)) s += 1;
  for (const id of p.obras) {
    const fav = catalogo.find((x) => x.id === id);
    if (fav && fav.id !== o.id) s += fav.temas.filter((t) => o.temas.includes(t)).length;
  }
  return s;
}

/** Stable sort by score; with no preferences, the original order is kept. */
export function ordenar(lista: Obra[], p: Preferencias | null, catalogo: Obra[]): Obra[] {
  if (!p) return lista;
  return lista
    .map((o, i) => ({ o, i, s: pontuar(o, p, catalogo) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.o);
}
