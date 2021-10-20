import { Map } from "immutable";
import { Hix, Syn } from "./Syntax";

type Sub = Map<Hix, Syn>;

// substitute hix for s in t
export function substitute(sub: Sub, t: Syn): Syn {
  switch (t.case) {
    case "uni": return t;
    case "pie": return {case: "pie", var: t.var, dom: substitute(sub, t.dom), cod: substitute(sub, t.cod)}
    case "lam": return {case: "lam", var: t.var, dom: substitute(sub, t.dom), bod: substitute(sub, t.bod)}
    case "neu": return {case: "neu", var: t.var, args: t.args.map(arg => substitute(sub, arg))}
    case "let": return {case: "let", var: t.var, sig: substitute(sub, t.sig), imp: substitute(sub, t.imp), bod: substitute(sub, t.bod)}
    case "hol": {
      let res = sub.get(t.hix);
      return res !== undefined ? res : t;
    }
  }
}

// unify s and t if possible, otherwise undefined
// the unification of s and t is a substitution sigma such that sigma s = sigma t
export function unify(s: Syn, t: Syn): Sub | undefined {
  if (s.case === "uni" && t.case === s.case) {
    if (s.lvl === t.lvl) return Map();
  } else
  if (s.case === "pie" && t.case === s.case) {
    let sigma1 = unify(s.dom, t.dom);
    let sigma2 = unify(s.cod, t.cod);
    return (sigma1 !== undefined && sigma2 !== undefined) ? sigma1.concat(sigma2) : undefined;
  } else
  if (s.case === "lam" && t.case === s.case) {
    let sigma1 = unify(s.dom, t.dom);
    let sigma2 = unify(s.bod, t.bod);
    return (sigma1 !== undefined && sigma2 !== undefined) ? sigma1.concat(sigma2) : undefined;
  } else
  if (s.case === "neu" && t.case === s.case && s.args.size === t.args.size) {
    let sigma: Sub = Map();
    for (let i = 0; i < s.args.size; i++) {
      let sigma_i = unify(s.args.get(i) as Syn, t.args.get(i) as Syn);
      if (sigma_i !== undefined)
        sigma = sigma.concat(sigma_i);
      else
        return undefined;
    }
    return sigma;
  } else
  if (s.case === "let" && t.case === s.case) {
    let sigma1 = unify(s.sig, t.sig);
    let sigma2 = unify(s.imp, t.imp);
    let sigma3 = unify(s.bod, t.bod);
    return (sigma1 !== undefined && sigma2 !== undefined && sigma3 !== undefined) ? sigma1.concat(sigma2.concat(sigma3)) : undefined;
  } else
  if (s.case === "hol" && t.case === s.case) {
    // the holes must be the same
    // substitute ?s -> ?t
    return Map<Hix, Syn>().set(s.hix, {case: "hol", hix: t.hix, sig: t.sig});
  } else {
    if (s.case === "hol") {
      // substitute ?s -> t
      return Map<Hix, Syn>().set(s.hix, t);
    } else
    if (t.case === "hol") {
      // substitute ?t -> s
      return Map<Hix, Syn>().set(t.hix, s);
    } else {
      return undefined;
    }
  }
}