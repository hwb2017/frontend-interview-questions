const addOne = val => val + 1
const addTwo = val => val + 2
const addThree = val => val + 3
const addFour = val => val + 4
const pipe = (...fns) => {
  return fns.reduce((f, g) => (...args) => g(f(...args)))
}
const fn = pipe(addOne, addTwo, addThree, addFour)
console.log(fn(1))