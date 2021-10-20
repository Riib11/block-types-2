import { List } from "immutable"
import { Transition } from "../state/Transition"
import { Code } from "./Code"
import { Fix } from "./Fix"

// metadata
export type Meta = {
  fix: Fix,
  parent: Code | "top",
  transitions: () => List<Transition>
}
