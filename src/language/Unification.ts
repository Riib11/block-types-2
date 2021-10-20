import { Map } from "immutable";
import { Nrm, Syn, toSyn, U_omega } from "./Syntax";
import { Option, chain, map, some, none } from "fp-ts/Option";
import { pipe } from 'fp-ts/function'
import { Sub, substitute } from "./Substitution";
import { dummyMeta } from "./Meta";
import { infer } from "./Inference";
import { Ctx } from "./Context";
import { normalize } from "./Normalization";

// unify s and t if possible, otherwise undefined
// the unification of s and t is a substitution sub such that sub s = sub t
export function unify(s: Syn, t: Syn, ctx: Ctx): Option<Sub> {
  if (s.case === "uni" && t.case === s.case) {
    return s.lvl === t.lvl ? some(Map()) : none;
  } else
  if (s.case === "pie" && t.case === s.case) {
    return pipe(
      unify(s.dom, t.dom, ctx),
      chain(sub1 => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.cod), substitute(sub1, t.cod), ctx.push({id: s.var.id, t: normalize(toSyn(U_omega()), substitute(sub1, s.dom))})))),
    );
  } else
  if (s.case === "lam" && t.case === s.case) {
    return pipe(
      unify(s.dom, t.dom, ctx),
      chain(sub1 => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.bod), substitute(sub1, t.bod), ctx.push({id: s.var.id, t: normalize(toSyn(U_omega()), substitute(sub1, s.dom))}))))
    );
  } else
  if (s.case === "neu" && t.case === s.case && s.args.size === t.args.size) {
    return s.args.zip(t.args).reduce<Option<Sub>>((m_sub, [si, ti]) => chain<Sub, Sub> (sub => unify(substitute(sub, si), substitute(sub, ti), ctx))(m_sub), none);
  } else
  if (s.case === "let" && t.case === s.case) {
    return pipe(
      unify(s.sig, t.sig, ctx),
      chain(sub1 => map<Sub, Sub>(sub2 => sub1.concat(sub2))(unify(substitute(sub1, s.imp), substitute(sub1, t.imp), ctx))),
      chain(sub2 => map<Sub, Sub>(sub3 => sub2.concat(sub3))(unify(substitute(sub2, s.bod), substitute(sub2, t.bod), ctx.push({id: s.var.id, t: normalize(U_omega() as Syn, substitute(sub2, s.sig))}))))
    );
  } else
  if (s.case === "hol" && t.case === s.case) {
    // the holes must be the same
    // substitute ?s -> ?t
    return pipe(
      unify(s.sig, t.sig, ctx),
      map(sub => sub.set(s.hix, {case: "hol", hix: t.hix, sig: substitute(sub, t.sig), meta: dummyMeta}))
    )
  } else {
    if (s.case === "hol") {
      // substitute ?s -> t
      let r: Nrm = infer(t, ctx);
      return pipe(
        unify(s.sig, toSyn(r), ctx),
        map(sub => sub.set(s.hix, substitute(sub, t)))
      );
    } else
    if (t.case === "hol") {
      // substitute ?t -> s
      let r: Nrm = infer(s, ctx);
      return pipe(
        unify(t.sig, toSyn(r), ctx),
        map(sub => sub.set(t.hix, substitute(sub, s)))
      );
    } else {
      // unification failure
      return none;
    }
  }
}