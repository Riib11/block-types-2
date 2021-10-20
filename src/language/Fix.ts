import { Syn, Var } from "./Syntax";

// Fix

export type Fix = "free" | "type" | "term"

const isTypeFixed = (f: Fix) => f === "term" || isTermFixed(f);
const isTermFixed = (f: Fix) => f === "type";
const isFree = (f: Fix) => f === "free";

// "free" < "type" < "term"
function maxFix(f1: Fix, f2: Fix): Fix {
  switch (f1) {
    case "free": return f2;
    case "type": return f2 === "term" ? "term" : "type";
    case "term": return "term";
  }
}

const maximumFix = (fs: Fix[]) => fs.reduce((f1, f2) => maxFix(f1, f2), "free")

// Update

export function updateFix(t: Syn): void {
  switch (t.case) {
    case "uni": return;
    case "pie": {
      // cod
      if (isTermFixed(t.meta.fix)) t.cod.meta.fix = "term";
      updateFix(t.cod);
      // dom
      let xFix = getFixIn(t.var, t.cod);
      if (isTermFixed(xFix)) t.dom.meta.fix = "term"; else 
      if (isTypeFixed(xFix)) t.dom.meta.fix = "type";
      updateFix(t.dom);
      break;
    }
    case "lam": {
      // bod
      if (isTermFixed(t.meta.fix)) t.bod.meta.fix = "term"; else 
      if (isTypeFixed(t.meta.fix)) t.bod.meta.fix = "type";
      updateFix(t.bod);
      // dom
      let xFix = getFixIn(t.var, t.bod);
      if (isTypeFixed(xFix)) t.dom.meta.fix = "term";
      updateFix(t.dom);
      break;
    }
    case "neu": {
      t.args.forEach(t => {
        t.meta.fix = "term";
        updateFix(t);
      });
      break;
    }
    case "let": {
      // bod
      if (isTermFixed(t.meta.fix)) t.bod.meta.fix = "term";
      updateFix(t.bod);
      // sig
      let xFix = getFixIn(t.var, t.bod);
      if (isTypeFixed(xFix)) t.sig.meta.fix = "term";
      updateFix(t.sig);
      // imp
      if (isTermFixed(t.meta.fix)) t.imp.meta.fix = "term"; else 
      if (isTypeFixed(t.meta.fix)) t.imp.meta.fix = "type"; 
      updateFix(t.imp);
      break;
    }
    case "hol": {
      if (isTypeFixed(t.meta.fix)) t.sig.meta.fix = "term";
      updateFix(t.sig);
      break;
    }
  }
}

function getFixIn(x: Var, t: Syn): Fix {
  switch (t.case) {
    case "uni": return "free";
    case "pie": return maxFix(getFixIn(x, t.dom), getFixIn(x, t.cod));
    case "lam": return maxFix(getFixIn(x, t.dom), getFixIn(x, t.bod));
    case "neu": return x.dbl === t.var.dbl ? maxFix(t.meta.fix, "type") : maximumFix(t.args.map(t => getFixIn(x, t)));
    case "let": return maximumFix([getFixIn(x, t.sig), getFixIn(x, t.imp), getFixIn(x, t.bod)]);
    case "hol": return getFixIn(x, t.sig);
  }
}