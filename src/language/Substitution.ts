import { Syn } from "./Syntax";
import { Map } from "immutable";
import { Hix } from "./Hix";

export type Sub = Map<Hix, Syn>;

export const Sub = (): Sub => Map();

// apply `sub` to `t`
export function substitute(sub: Sub, t: Syn): Syn {
  switch (t.case) {
    case "uni": return t;
    case "pie": return {case: "pie", var: t.var, dom: substitute(sub, t.dom), cod: substitute(sub, t.cod), meta: t.meta}
    case "lam": return {case: "lam", var: t.var, dom: substitute(sub, t.dom), bod: substitute(sub, t.bod), meta: t.meta}
    case "neu": return {case: "neu", var: t.var, args: t.args.map(arg => substitute(sub, arg)), meta: t.meta}
    case "let": return {case: "let", var: t.var, sig: substitute(sub, t.sig), imp: substitute(sub, t.imp), bod: substitute(sub, t.bod), meta: t.meta}
    case "hol": {
      let res = sub.get(t.hix);
      return res !== undefined ? res : t;
    }
  }
}