export type Tipo = "filme" | "serie";
export type Obra = {
  id: string;
  titulo: string;
  ano: number;
  tipo: Tipo;
  generos: string[];
  temas: string[];
  sinopse: string;
  personalidade: string[];
  poster: string;
  backdrop: string;
};

const T = "https://image.tmdb.org/t/p/";

export const TEMAS = ["Desastres naturais", "Investigação", "Ficção científica"] as const;

export const obras: Obra[] = [
  {
    id: "a-onda",
    titulo: "A Onda",
    ano: 2015,
    tipo: "filme",
    generos: ["Ação", "Drama", "Thriller"],
    temas: ["Desastres naturais", "Investigação"],
    sinopse:
      "Um geólogo percebe sinais de que a montanha sobre o fiorde de Geiranger vai desabar. Quando o alarme soa, restam apenas dez minutos antes que um tsunami atinja a cidade.",
    personalidade: ["Tensão crescente", "Investigação científica", "Sobrevivência", "Laços familiares"],
    poster: "https://image.tmdb.org/t/p/w500/nUra0UF9MLlTRZH9LCA8xYvhd6D.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xFA39KxZYLIB6N5CnAqreqHArob.jpg",
  },
  {
    id: "terremoto",
    titulo: "Terremoto",
    ano: 2018,
    tipo: "filme",
    generos: ["Ação", "Drama", "Thriller"],
    temas: ["Desastres naturais", "Investigação"],
    sinopse:
      "Três anos após o tsunami de Geiranger, o geólogo Kristian descobre indícios de que um grande terremoto está prestes a atingir Oslo.",
    personalidade: ["Tensão crescente", "Investigação científica", "Sobrevivência", "Laços familiares"],
    poster: "https://image.tmdb.org/t/p/w500/tbP1vcLKUXRJkuffFe3bfOaRRKQ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/vEzvmmLkt64eV1CcWteCo28bCAC.jpg",
  },
  {
    id: "mar-em-chamas",
    titulo: "Mar em Chamas",
    ano: 2021,
    tipo: "filme",
    generos: ["Ação", "Thriller"],
    temas: ["Desastres naturais", "Investigação"],
    sinopse:
      "Na costa norueguesa, o colapso de plataformas de petróleo desencadeia uma corrida contra o tempo em alto-mar.",
    personalidade: ["Tensão crescente", "Sobrevivência", "Ambiente isolado"],
    poster: "https://image.tmdb.org/t/p/w500/1bB7uV5ljDWKG2m5Z4cgWwDMAeY.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9JLl9UYkcWbkLWWHtzuVB6fc9Qr.jpg",
  },
  {
    id: "dia-depois",
    titulo: "O Dia Depois de Amanhã",
    ano: 2004,
    tipo: "filme",
    generos: ["Ação", "Ficção científica"],
    temas: ["Desastres naturais", "Ficção científica"],
    sinopse:
      "Um climatologista tenta alertar o mundo sobre uma nova era glacial enquanto parte para resgatar o filho em Nova York.",
    personalidade: ["Escala épica", "Investigação científica", "Sobrevivência"],
    poster: "https://image.tmdb.org/t/p/w500/Wr4HeYQRvwVCxzOV5TmGE7UkXq.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/smqQ71MIn1DSdSiQzCzCOV6rgRq.jpg",
  },
  {
    id: "interestelar",
    titulo: "Interestelar",
    ano: 2014,
    tipo: "filme",
    generos: ["Aventura", "Drama", "Ficção científica"],
    temas: ["Ficção científica", "Investigação"],
    sinopse:
      "Com a Terra à beira do colapso, um grupo de exploradores atravessa um buraco de minhoca em busca de um novo lar.",
    personalidade: ["Contemplativo", "Investigação científica", "Laços familiares", "Escala épica"],
    poster: `${T}w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    backdrop: `${T}w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg`,
  },
  {
    id: "a-chegada",
    titulo: "A Chegada",
    ano: 2016,
    tipo: "filme",
    generos: ["Drama", "Ficção científica"],
    temas: ["Ficção científica", "Investigação"],
    sinopse:
      "Uma linguista é recrutada para se comunicar com visitantes alienígenas antes que a tensão global se torne guerra.",
    personalidade: ["Contemplativo", "Investigação científica", "Mistério"],
    poster: `${T}w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg`,
    backdrop: `${T}w1280/8MUZz7oPXQftFTslZpRP3CVMOoq.jpg`,
  },
  {
    id: "twisters",
    titulo: "Twisters",
    ano: 2024,
    tipo: "filme",
    generos: ["Ação", "Aventura"],
    temas: ["Desastres naturais", "Investigação"],
    sinopse:
      "Uma ex-caçadora de tempestades volta ao campo para testar um sistema capaz de enfraquecer tornados.",
    personalidade: ["Ação constante", "Investigação científica", "Tensão crescente"],
    poster: `${T}w500/pjnD08FlMAIXsfOLKQbvmO0f0MD.jpg`,
    backdrop: `${T}w1280/7aPrv2HFssWcOtpig5G3HEVk3uS.jpg`,
  },
  {
    id: "dark",
    titulo: "Dark",
    ano: 2017,
    tipo: "serie",
    generos: ["Drama", "Mistério", "Ficção científica"],
    temas: ["Ficção científica", "Investigação"],
    sinopse:
      "O desaparecimento de duas crianças em uma pequena cidade alemã revela segredos que atravessam gerações e o próprio tempo.",
    personalidade: ["Mistério", "Tensão crescente", "Narrativa complexa"],
    poster: `${T}w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg`,
    backdrop: `${T}w1280/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg`,
  },
];

export const getObra = (id: string) => obras.find((o) => o.id === id);

export const parecidosComOnda = ["terremoto", "mar-em-chamas", "twisters", "dia-depois"];
export const paraExplorar = ["interestelar", "a-chegada", "dark"];

export const porque = (base: Obra, o: Obra) => {
  const comuns = o.personalidade.filter((t) => base.personalidade.includes(t)).slice(0, 2);
  return comuns.length ? comuns.join(" · ") : o.temas[0];
};

export const relacionadas = (obra: Obra, n = 4) =>
  obras
    .filter((o) => o.id !== obra.id)
    .map((o) => ({ o, s: o.temas.filter((t) => obra.temas.includes(t)).length }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.o);
