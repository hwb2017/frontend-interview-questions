// https://github.com/shfshanyue/Daily-Question/issues/625

const countOfLetters = (str) => {
  let frequencyMap = {}
  let regArray = [
    /([a-zA-Z])([a-zA-Z])/g, //AA
    /([a-zA-Z])(\))/g, //A)
    /([a-zA-Z])(\()/g, //A(
    /(\))([a-zA-Z])/g, //)A
    /(\))(\))/g, //))
    /(\))(\()/g, //)(
  ]
  let targetStr = str
  for (const reg of regArray) {
    targetStr = targetStr.replace(reg,"$11$2")
  }
  // let targetStr = str.replace(/([a-zA-Z]|\))(\(|[a-zA-Z]|\))/g,"$11$2") // 这种写法最后一个测试用例会通过不了  
  let unfoldable = /(\([0-9a-zA-Z]*\))([0-9]+)/
  while (unfoldable.test(targetStr)) {
    targetStr = targetStr.replace(unfoldable, (match, p1, p2) => p1.slice(1,-1).replace(/[0-9]+/g, (count) => +count*p2))
  }
  let matchResult
  let unit = /[a-zA-Z][0-9]+/g
  while ((matchResult = unit.exec(targetStr)) !== null) {
    let letter = matchResult[0][0]
    let frequency = matchResult[0].slice(1)
    frequencyMap[letter] = frequencyMap[letter] ? frequencyMap[letter] + Number(frequency) : +frequency
  }
  return frequencyMap
}

console.log(countOfLetters('A2B3'))
console.log(countOfLetters('A(A3B)2'))
console.log(countOfLetters('C4(A(A3B)2)2'))
console.log(countOfLetters('C4(A()2)2'))
console.log(countOfLetters('(A2B3)'))
console.log(countOfLetters('(A2B3)(A5B6)'))
console.log(countOfLetters('(A2B3)C(A5B6)'))
console.log(countOfLetters('(A11B9)11'))