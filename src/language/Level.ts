import { List } from "immutable";
import { Syn } from "./Syntax";

export type Lvl = number | "omega"

export const sucLvl = (lvl: Lvl): Lvl => lvl === "omega" ? "omega" : lvl + 1;

export function predLvl(lvl: Lvl): Lvl {
  if (lvl === "omega") {
    return "omega";
  } else if (lvl === 0) {
    throw new Error("Cannot get predecessor or level 0.");
  } else {
    return lvl - 1;
  }
}

export const maxLvl = (lvl1: Lvl, lvl2: Lvl): Lvl => lvl1 === "omega" ? "omega" : lvl2 === "omega" ? "omega" : Math.max(lvl1, lvl2);

export const maximumLvl = (lvls: List<Lvl>): Lvl => lvls.reduce<Lvl>((lvl1, lvl2) => maxLvl(lvl1, lvl2), 0);

export function getLvl(t: Syn): Lvl {
  switch (t.case) {
    case "uni": return t.lvl;
    case "pie": return maxLvl(getLvl(t.dom), getLvl(t.cod));
    case "lam": return maxLvl(getLvl(t.dom), getLvl(t.bod));
    case "neu": return maximumLvl(t.args.map(t => getLvl(t)));
    case "let": return maximumLvl(List([getLvl(t.sig), getLvl(t.imp), getLvl(t.bod)]));
    case "hol": return getLvl(t.sig);
  }
}