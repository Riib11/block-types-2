export type Hix = {ix: number};

var freshIx: number = -1;

export function freshHix(): Hix {
  freshIx++;
  return {ix: freshIx}
}