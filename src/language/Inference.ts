import { List } from "immutable";
import { Ctx } from "./Context";
import { getLvl, Lvl, maximumLvl, maxLvl, sucLvl } from "./Level";
import { Syn, Var } from "./Syntax";

// Extract a Syn's type
function infer(t: Syn, ctx: Ctx): Syn {
  switch (t.case) {
    case "uni": return {case: "uni", lvl: sucLvl(t.lvl)};
    case "pie": return {case: "uni", lvl: maxLvl(getLvl(t.dom), getLvl(t.cod))}
    case "lam": return {case: "pie", var: t.var, dom: t.dom, cod: infer(t.bod, ctx.push([{id: t.var.id, t: t.dom}]))}
    case "neu": return inferNeu(t.var, t.args , ctx);
    case "let": return infer(t.bod, ctx.push([{id: t.var.id, t: t.sig}]));
    case "hol": return t.sig;
  }
}

function inferNeu(x: Var, args: List<Syn>, ctx: Ctx): Syn {
  // evaluate type of `x` as `A`
  // fold "apply A" over the args
  // the resulting type is the infered result
  throw new Error("unimplemented");
}
