import { Mutation } from "../language/Mutation";

// TODO
export type Transition
  // mutation
  = {readonly case: "mutate", mut: Mutation}
  // buffers
  | {readonly case: "create buffer"}
  | {readonly case: "delete buffer"}
  | {readonly case: "submit buffer"}
  // transitions
  | {readonly case: "select transition"}
  // meta
  | {readonly case: "rename id"}
  | {readonly case: "undo"}
;

// TODO
// MetaTransitions are contextually expanded into a sequence of base
// transitions.
export type MetaTransition
  = {readonly case: "base", delta: Transition}
  | {readonly case: "move syntax selection", dir: Direction}
  | {readonly case: "move transition selection", dir: DirectionVertical}
;

export type Direction = DirectionVertical | DirectionVertical;
export type DirectionVertical = "up" | "down";
export type DirectionHorizontal = "left" | "right";