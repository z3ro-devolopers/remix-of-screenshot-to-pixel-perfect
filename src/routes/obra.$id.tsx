import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { Img, PosterGrid, Section, Shell, useWatchlist } from "@/components/frame";
import { getObra, relacionadas } from "@/data/obras";

export const Route = createFileRoute("/obra/$id")({
  loader: ({ params }) => {
    const obra = getObra(params.id);
    if (!obra) throw notFound();
    return obra;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          { title: `${loaderData.titulo} — Vimo` },
          { name: "description", content: loaderData.sinopse },
          { property: "og:title", content: `${loaderData.titulo} — Vimo` },
          { property: "og:description", content: loaderData.sinopse },
          { property: "og:image", content: loaderData.backdrop },
          { name: "twitter:image", content: loaderData.backdrop },
        ]
      : [{ title: "Obra não encontrada — Vimo" }, { name: "description", content: "Esta obra não está no catálogo do Vimo." }, { property: "og:title", content: "Obra não encontrada — Vimo" }, { property: "og:description", content: "Esta obra não está no catálogo do Vimo." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }],
  }),
  component: Detalhes,
});

function Detalhes() {
  const obra = Route.useLoaderData();
  const router = useRouter();
  const [on, toggle] = useWatchlist(obra.id);

  return (
    <Shell>
      <section className="relative -mx-4 md:mx-0 md:mt-6">
        <div className="relative h-52 overflow-hidden md:h-80 md:rounded-2xl">
          <Img src={obra.backdrop} alt="" className="h-full w-full" />
          <div className="hero-overlay-bottom absolute inset-0" />
        </div>
        <button
          onClick={() => router.history.back()}
          aria-label="Voltar"
          className="glass absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </section>

      <div className="relative -mt-20 grid gap-6 md:-mt-32 md:grid-cols-[240px_1fr] md:px-10 lg:gap-10">
        <div className="mx-auto w-40 self-start overflow-hidden rounded-xl shadow-poster ring-1 ring-border md:w-full">
          <Img src={obra.poster} alt={obra.titulo} className="block aspect-[2/3] w-full" />
        </div>
        <div className="md:pt-36">
          <h1 className="text-3xl font-extrabold md:text-5xl">{obra.titulo}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {obra.ano} · {obra.tipo === "filme" ? "Filme" : "Série"} · {obra.generos.join(", ")}
          </p>
          <button
            onClick={toggle}
            aria-pressed={on}
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-6 font-semibold ${on ? "bg-card text-primary ring-1 ring-primary" : "bg-primary text-primary-foreground"}`}
          >
            {on ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {on ? "Na sua lista" : "Quero assistir"}
          </button>
          <p className="mt-6 max-w-2xl leading-relaxed">{obra.sinopse}</p>

          <h2 className="mt-8 font-semibold">A personalidade desta obra</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {obra.personalidade.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-primary/10 px-4 py-2 text-sm text-primary ring-1 ring-primary/30">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Classificações demonstrativas.</p>
        </div>
      </div>

      <Section title="Obras relacionadas">
        <PosterGrid obras={relacionadas(obra, 4)} />
      </Section>
    </Shell>
  );
}
