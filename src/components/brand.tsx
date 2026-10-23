import symbol from "@/assets/vimo-symbol.svg.asset.json";

export function Brand() {
  return (
    <span className="inline-flex shrink-0 items-center gap-2.5" aria-label="Vimo">
      <img src={symbol.url} alt="" aria-hidden="true" className="h-8 w-8 shrink-0 object-contain" />
      <span className="font-brand text-[28px] leading-none font-bold tracking-normal">vimo</span>
    </span>
  );
}