import { Syn } from "./Syntax";

// replace r with s in t
export function replace(r: Syn, s: Syn, t: Syn): Syn {
  // compare by reference
  if (r === t) return s;
  else {
    switch (t.case) {
      case "uni": return t;
      case "pie": return {case: "pie", var: t.var, dom: replace(r, s, t.dom), cod: replace(r, s, t.cod), meta: t.meta};
      case "lam": return {case: "lam", var: t.var, dom: replace(r, s, t.dom), bod: replace(r, s, t.bod), meta: t.meta}
      case "neu": return {case: "neu", var: t.var, args: t.args.map(arg => replace(r, s, arg)), meta: t.meta};
      case "let": return {case: "let", var: t.var, sig: replace(r, s, t.sig), imp: replace(r, s, t.imp), bod: replace(r, s, t.bod), meta: t.meta};
      case "hol": return {case: "hol", hix: t.hix, sig: replace(r, s, t.sig), meta: t.meta};
    }
  }
}