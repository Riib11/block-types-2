import { List } from "immutable";
import { Ctx } from "./Context";
import { Fix } from "./Fix";
import { freshHix, Hix } from "./Hix";
import { predLvl } from "./Level";
import { dummyMeta } from "./Meta";
import { replace } from "./Replacement";
import { Sub, substitute } from "./Substitution";
import { freshVar, Nrm, Syn, toSyn } from "./Syntax";
import { unify } from "./Unification";

export type Mutation
  // substitutes with `sub`
  = {readonly case: "substitute", sub: Sub}
  // replaces code `c0` with code `c1`, requiring that `c0` has fixity at most `fix`
  | {readonly case: "replace", s: Syn, t: Syn, fix: Fix}

export function mutate(t: Syn, mut: Mutation): Syn {
  switch (mut.case) {
    case "substitute": return substitute(mut.sub, t)
    case "replace": return replace(mut.s, mut.t, t);
  }
}

export function getSubstitutions(hix: Hix, T: Nrm, ctx: Ctx): List<Mutation> {
  let ms = List<Mutation>();
  switch (T.case) {
    case "uni": {
      if (T.lvl > 0) {
        ms = ms.concat(List<Mutation>([
          {
            case: "substitute",
            sub: Sub().set(hix, {
              case: "uni",
              lvl: predLvl(T.lvl),
              meta: dummyMeta
            })
          }, 
          {
            case: "substitute",
            sub: Sub().set(hix, {
              case: "pie",
              var: freshVar(ctx.size),
              dom: {case: "uni", lvl: predLvl(T.lvl), meta: dummyMeta},
              cod: {case: "uni", lvl: predLvl(T.lvl), meta: dummyMeta}, meta: dummyMeta
            })
          }
        ]));
      }
    }
  }
  // from context
  ctx.forEach(({ id, t }, dbl) => {
    // try to unify t and T
    let sub = unify(toSyn(t), toSyn(t));
    switch (sub._tag) {
      case "Some": {
        ms = ms.concat(List([
          {case: "substitute", sub: sub.value},
          {case: "substitute", sub: Sub().set(hix, {case: "neu", var: {id, dbl: dbl}, args: getArgsTypes(t).map(ti => ({case: "hol", hix: freshHix(), sig: toSyn(ti), meta: dummyMeta})), meta: dummyMeta})}
        ]))
        break;
      }
      case "None": break;
    }
  });
  return ms;
}

// `t` is the type of a function with `getArgsCount(t)` arguments
export function getArgsTypes(t: Nrm): List<Nrm> {
  switch (t.case) {
    case "pie": return List([t.dom]).concat(getArgsTypes(t.cod));
    default: return List();
  }
}