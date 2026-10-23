import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Img, PosterCard, PosterGrid, Section, Shell } from "@/components/frame";
import { getObra, obras, relacionadas, TEMAS } from "@/data/obras";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRAME — Descubra filmes e séries" },
      { name: "description", content: "Descubra e organize filmes e séries pela personalidade de cada obra." },
      { property: "og:title", content: "FRAME — Descubra filmes e séries" },
      { property: "og:description", content: "Descubra e organize filmes e séries pela personalidade de cada obra." },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const onda = getObra("a-onda")!;
  return (
    <Shell>
      <section className="relative -mx-4 overflow-hidden md:mx-0 md:mt-6 md:rounded-2xl">
        <Img src={onda.backdrop} alt="" className="absolute inset-0 h-full w-full" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative flex min-h-[460px] flex-col justify-end p-4 md:min-h-[520px] md:max-w-2xl md:p-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Em destaque</span>
          <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">{onda.titulo}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{onda.ano} · Filme · {onda.generos.join(", ")}</p>
          <p className="mt-3 line-clamp-3 text-sm md:text-base">{onda.sinopse}</p>
          <Link
            to="/obra/$id"
            params={{ id: onda.id }}
            className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
          >
            <Info className="h-4 w-4" /> Ver detalhes
          </Link>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {TEMAS.map((t) => (
          <Link
            key={t}
            to="/explorar"
            search={{ tema: t }}
            className="inline-flex min-h-11 items-center rounded-full bg-card px-4 text-sm ring-1 ring-border hover:ring-primary"
          >
            {t}
          </Link>
        ))}
      </div>

      <Section title="Porque você gostou de A Onda">
        <PosterGrid obras={relacionadas(onda, 6)} />
      </Section>

      <Section title="Filmes e séries para explorar">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[obras[7], obras[4], obras[5], obras[1]].map((o) => (
            <PosterCard key={o.id} obra={o} />
          ))}
        </div>
      </Section>
    </Shell>
  );
}
