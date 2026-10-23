import { describe, expect, it } from "vitest";
import { obras } from "./obras";
import { introducaoConcluida, lerPreferencias, ordenar, salvarPreferencias } from "./preferencias";

describe("ordenação por preferências", () => {
  it("mantém a ordem padrão sem preferências", () => {
    expect(ordenar(obras, null, obras).map((o) => o.id)).toEqual(obras.map((o) => o.id));
  });
  it("prioriza séries de mistério quando escolhidas", () => {
    const r = ordenar(obras, { tipos: ["serie"], generos: ["Suspense"], experiencias: ["Tensão e mistério"], obras: [] }, obras);
    expect(r[0]!.id).toBe("dark");
  });
});

describe("compatibilidade dos dados salvos após mudança de marca", () => {
  it("lê preferências e conclusão existentes sem apagar a lista salva", () => {
    const preferencias = { tipos: ["filme"] as const, generos: ["Drama"], experiencias: [], obras: ["a-onda"] };
    localStorage.setItem("frame:preferencias", JSON.stringify(preferencias));
    localStorage.setItem("frame:introducao-concluida", "1");
    localStorage.setItem("frame:quero-assistir", '["a-onda"]');
    expect(lerPreferencias()).toEqual(preferencias);
    expect(introducaoConcluida()).toBe(true);
    salvarPreferencias({ ...preferencias, tipos: ["filme"] });
    expect(JSON.parse(localStorage.getItem("frame:preferencias") ?? "null")).toEqual(preferencias);
    expect(localStorage.getItem("frame:quero-assistir")).toBe('["a-onda"]');
  });
});
