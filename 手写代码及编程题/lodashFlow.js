const lodashFlow = (...fns) => (...args) => fns.reduce((a, b) => b(+a), args.map(a => +a))

const add10 = x => x + 10
const mul10 = x => x * 10
const add100 = x => x + 100
console.log(lodashFlow(add10, mul10, add100)(10))