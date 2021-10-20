# Notes

REPL

- click anywhere to get a REPL at that "location"
- a REPL is just a program

copy/pasting:

- find most recent ancestor (MRA) context and keep those free variables fixed
- turn other free variables not bound in MRA into holes

- we need concepts of _replacement_ and _substitution_, since sometimes you want
  to replace one instance of a hole (which may appear elsewhere) with a fresh
  hole, digs are replacements not substitutions

mutation

- a _mutation_ is either a _substitution_ or a _replacement_
  - a _substitution_ is a mapping from a hole to a term of a unifiable type
  - a _replacement_ is a mapping of a particular sub-term to a term, not
    necessarily of a compatible type
    - conditions: fixity of the original sub-term
