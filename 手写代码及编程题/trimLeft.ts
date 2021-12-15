type LeftTrim<T> = T extends ` ${infer Rest}` ? LeftTrim<Rest> : T

type A = "    Hello world  ";
type B = LeftTrim<A>