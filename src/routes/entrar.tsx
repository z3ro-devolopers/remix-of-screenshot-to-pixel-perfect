import { Brand } from "@/components/brand";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Info } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Img } from "@/components/frame";
import { obras } from "@/data/obras";
import { introducaoConcluida } from "@/data/preferencias";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Entrar — Vimo" },
      { name: "description", content: "Entre no Vimo para começar a descobrir filmes e séries." },
      { property: "og:title", content: "Entrar — Vimo" },
      { property: "og:description", content: "Entre no Vimo para começar a descobrir filmes e séries." },
    ],
  }),
  component: Entrar,
});

const input = "mt-1 min-h-11 w-full rounded-xl bg-background px-4 text-sm ring-1 ring-border outline-none focus:ring-primary";

function Entrar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState(false);

  const seguir = () => navigate({ to: introducaoConcluida() ? "/" : "/introducao" });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErro("Informe um e-mail válido.");
    if (senha.length < 4) return setErro("A senha precisa ter pelo menos 4 caracteres.");
    setErro("");
    setAviso(true);
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <div className="absolute inset-0 grid -rotate-6 scale-125 grid-cols-4 gap-3 opacity-60">
          {[...obras, ...obras].map((o, i) => (
            <Img key={i} src={o.poster} alt="" className="aspect-[2/3] w-full rounded-xl" />
          ))}
        </div>
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="flex flex-col justify-center px-4 py-10 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Brand />
          <h1 className="mt-6 text-3xl font-extrabold leading-tight">Histórias que combinam com você.</h1>
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
            <Info className="h-4 w-4 shrink-0" /> Formulário de demonstração. Nenhum dado é enviado ou salvo.
          </p>

          {aviso ? (
            <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-primary/40">
              <p className="font-semibold">Preenchimento válido</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Este é um protótipo: nenhuma autenticação foi realizada e seus dados não foram guardados.
              </p>
              <button onClick={seguir} className="mt-4 min-h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground">
                Continuar
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-6 space-y-4" noValidate>
              <label className="block text-sm">
                E-mail
                <input type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
              </label>
              <label className="block text-sm">
                Senha
                <span className="relative block">
                  <input type={ver ? "text" : "password"} autoComplete="off" value={senha} onChange={(e) => setSenha(e.target.value)} className={`${input} pr-12`} />
                  <button
                    type="button"
                    onClick={() => setVer(!ver)}
                    aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-0 top-1 flex h-11 w-11 items-center justify-center text-muted-foreground"
                  >
                    {ver ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
              <button className="min-h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground">Entrar</button>
            </form>
          )}

          <button onClick={seguir} className="mt-4 min-h-11 w-full rounded-full text-sm text-muted-foreground ring-1 ring-border hover:text-foreground">
            Explorar sem conta
          </button>
        </div>
      </div>
    </div>
  );
}
