const test1 = "a2[b]a2[b2[c]]"
// abbabccbcc
const test2 = "2[3[c]]a2a"
// cccccca2a
const test3 = "[abc][d]3[e2]4"
// abcde2e2e24

const parseString = (str: string): string => {
  const stacks: string[][] = [[]]
  let activeStack = stacks[0]
  for (let i = 0; i < str.length; i++) { 
    // debugger  
    if (str[i] === "[") {
      stacks.push([])
      activeStack = stacks[stacks.length-1]
    } else if (str[i] === "]") {
      let repeatTimes = 1
      if (stacks.length >= 2) {
        const lastStack = stacks[stacks.length - 2]
        if (lastStack.length > 0) {
          let regResult = /[0-9]+$/.exec(lastStack.join(''))
          if (regResult !== null) {
            repeatTimes = +regResult[0]
            stacks[stacks.length - 2] = stacks[stacks.length - 2].slice(0, regResult.index)
          }
        }
      }
      while (repeatTimes > 0) {
        stacks[stacks.length - 2] = stacks[stacks.length - 2].concat(activeStack)
        repeatTimes--
      }
      stacks.pop()
      activeStack = stacks[stacks.length-1]
    } else {
      activeStack.push(str[i])
    }
  }
  
  return stacks[0].join('')
}

console.log(parseString(test1))
console.log(parseString(test2))
console.log(parseString(test3))