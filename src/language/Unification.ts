import { Map } from "immutable";
import { Hix, Syn } from "./Syntax";
import { Option, chain, bind, bindTo, map, some, none } from "fp-ts/Option";
import { pipe } from 'fp-ts/function'

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
// the unification of s and t is a substitution sub such that sub s = sub t
export function unify(s: Syn, t: Syn): Option<Sub> {
  if (s.case === "uni" && t.case === s.case) {
    if (s.lvl === t.lvl) 
      return some(Map());
    else
      return none;
  } else
  if (s.case === "pie" && t.case === s.case) {
    return pipe(
      unify(s.dom, t.dom), bindTo('sub1'),
      chain(({ sub1 }) => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.cod), substitute(sub1, t.cod)))),
    );
  } else
  if (s.case === "lam" && t.case === s.case) {
    return pipe(
      unify(s.dom, t.dom), bindTo('sub1'),
      chain(({ sub1 }) => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.bod), substitute(sub1, t.bod))))
    );
  } else
  if (s.case === "neu" && t.case === s.case && s.args.size === t.args.size) {
    return s.args.zip(t.args).reduce<Option<Sub>>((m_sub, [si, ti]) => chain<Sub, Sub> (sub => unify(substitute(sub, si), substitute(sub, ti)))(m_sub), none);
  } else
  if (s.case === "let" && t.case === s.case) {
    return pipe(
      unify(s.sig, t.sig),
      chain(sub1 => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.imp), substitute(sub1, t.imp)))),
      chain(sub2 => map<Sub, Sub>(sub3 => sub2.concat(sub3))(unify(substitute(sub2, s.bod), substitute(sub2, t.bod))))
    );
  } else
  if (s.case === "hol" && t.case === s.case) {
    // the holes must be the same
    // substitute ?s -> ?t
    return some(Map<Hix, Syn>().set(s.hix, {case: "hol", hix: t.hix, sig: t.sig}));
  } else {
    if (s.case === "hol") {
      // substitute ?s -> t
      return some(Map<Hix, Syn>().set(s.hix, t));
    } else
    if (t.case === "hol") {
      // substitute ?t -> s
      return some(Map<Hix, Syn>().set(t.hix, s));
    } else {
      return none;
    }
  }
}