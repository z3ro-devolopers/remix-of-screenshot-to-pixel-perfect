import { describe, expect, it } from "vitest";
import { obras } from "./obras";
import { ordenar } from "./preferencias";

describe("ordenação por preferências", () => {
  it("mantém a ordem padrão sem preferências", () => {
    expect(ordenar(obras, null, obras).map((o) => o.id)).toEqual(obras.map((o) => o.id));
  });
  it("prioriza séries de mistério quando escolhidas", () => {
    const r = ordenar(obras, { tipos: ["serie"], generos: ["Suspense"], experiencias: ["Tensão e mistério"], obras: [] }, obras);
    expect(r[0]!.id).toBe("dark");
  });
});
