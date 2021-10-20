import { List } from "immutable";
import { predLvl } from "./Level";
import { dummyMeta } from "./Meta";
import { Sem } from "./Semantics";
import { Dbl, Nrm, Syn } from "./Syntax";

type Sub = List<Sem>;

/*
## Normalization
*/

export function normalize(T: Syn, t: Syn, sub: Sub = List()): Nrm {
  return reify(evaluate(T), evaluate(t));
}

/*
## Evaluation
*/

export function evaluate(t: Syn, sub: Sub = List()): Sem {
  switch (t.case) {
    case "uni": return t;
    case "pie": return {
      case: "spi",
      var: t.var,
      dom: evaluate(t.dom, sub),
      cod: (a: Sem) => evaluate(t.cod, sub.push(a))
    };
    case "lam": return {
      case: "arr",
      arr: (a: Sem) => evaluate(t.bod, sub.push(a))
    };
    case "let": return evaluate(t.bod, sub.push(evaluate(t.imp, sub)));
    case "neu": {
      let res = sub.get(t.var.dbl) as Sem;
      t.args.forEach(arg => {
        switch (res.case) {
          case "arr": res = res.arr(arg); break;
          case "spi": res = res.cod(arg); break;
          default: throw new Error("Impossible for well-typed term.");
        }
      });
      return res;
    }
    case "hol": return t;
  }
}

/*
## Reflection
*/

export function reflect(T: Sem, t: Syn, dbl: Dbl = 0): Sem {
  switch (T.case) {
    case "uni": return t;
    case "spi": {
      switch (t.case) {
        case "neu": return {
          case: "arr",
          // TODO: is casting to Syn ok here?
          arr: (a: Sem) => reflect(T.cod(a), {case: "neu", var: t.var, args: t.args.push(reify(T.dom, a, dbl) as Syn), meta: t.meta}, dbl)
        }
        default: throw errorNormalization();
      }
    }
    case "neu": return t;
    case "hol": return t;
    default: throw errorNormalization();
  }
}

/*
## Reification
*/

export function reify(T: Sem, t: Sem, dbl: Dbl = 0): Nrm {
  switch (T.case) {
    case "uni": {
      switch (t.case) {
        case "uni": return {case: "uni", lvl: t.lvl};
        case "spi": return {
          case: "pie",
          var: t.var,
          dom: reify({case: "uni", lvl: predLvl(T.lvl), meta: dummyMeta}, t.dom, dbl),
          cod: reify({case: "uni", lvl: predLvl(T.lvl), meta: dummyMeta}, t.cod(reflect(t.dom, {case: "neu", var: t.var, args: List(), meta: dummyMeta}, dbl + 1)))
        }
        case "neu": return t as Nrm;
        case "hol": return t as Nrm;
        default: throw errorNormalization();
      }
    }
    case "spi": {
      switch (t.case) {
        case "arr": return {
          case: "lam",
          var: T.var,
          dom: reify({case: "uni", lvl: "omega", meta: dummyMeta}, T.cod(reflect(T.dom, {case: "neu", var: T.var, args: List(), meta: dummyMeta}, dbl + 1)), dbl),
          bod: reify(T.cod(reflect(T.dom, {case: "neu", var: T.var, args: List(), meta: dummyMeta}, dbl + 1)), t.arr(reflect(T.dom, {case: "neu", var: T.var, args: List(), meta: dummyMeta}, dbl + 1)))
        };
        default: throw errorNormalization();
      }
    }
    case "neu": return t as Nrm;
    case "hol": return t as Nrm;
    default: throw errorNormalization();
  }
}

const errorNormalization = (): Error => new Error("Error in normalization.");