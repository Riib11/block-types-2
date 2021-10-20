import { Map } from "immutable";
import { Syn } from "./Syntax";
import { Option, chain, map, some, none } from "fp-ts/Option";
import { pipe } from 'fp-ts/function'
import { Sub, substitute } from "./Substitution";
import { Hix } from "./Hix";
import { dummyMeta } from "./Meta";

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
      unify(s.dom, t.dom),
      chain(sub1 => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.cod), substitute(sub1, t.cod)))),
    );
  } else
  if (s.case === "lam" && t.case === s.case) {
    return pipe(
      unify(s.dom, t.dom),
      chain(sub1 => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.bod), substitute(sub1, t.bod))))
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
    return pipe(
      unify(s.sig, t.sig),
      map(sub => sub.set(s.hix, {case: "hol", hix: t.hix, sig: substitute(sub, t.sig), meta: dummyMeta}))
    )
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