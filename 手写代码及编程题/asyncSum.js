// https://github.com/shfshanyue/Daily-Question/issues/662

function add(a,b) {
  return Promise.resolve(a + b)
}

// 串行
function sum(arr) {
  return arr.reduce((a,b) => a.then(val => add(val, b)), Promise.resolve(0))
}
sum([2,2,2,2]).then(res=>{console.log(res)})

// 并行
function chunk (arr, size) {
  const list = []
  for (let i = 0; i < arr.length; i++ ) {
    const index = Math.floor(i / size)
    if (list[index] === undefined) {
      list[index] = [arr[i]]
    } else {
      list[index].push(arr[i])
    }
  }
  return list
}
function sum2(arr) {
  if (arr.length === 1) return arr[0]
  const promises = chunk(arr, 2).map(([x, y]) => y === undefined ? x : add(x, y))
  return Promise.all(promises).then(list => sum2(list))
}
sum2([2,2,2,2]).then(res=>{console.log(res)})

//并发控制
function pMap(list, mapper, concurrency = Infinity) {
  return new Promise((resolve, reject) => {
    let currentIndex = 0
    let result = []
    let resolvedCount = 0
    let len = list.length
    function next() {
      const index = currentIndex++
      Promise.resolve(list[index]).then(o => mapper(o, index).then(o => {
        result[index] = o
        if (++resolvedCount === len) resolve(result)
        if (currentIndex < len) next()
      }))
    }
    for (let i = 0; i < concurrency && i < len; i++) {
      next()
    }    
  })
}
function sum3(arr, concurrency) {
  if (arr.length === 1) return arr[0]
  return pMap(chunk(arr, 2), ([x, y]) => {
    return y === undefined ? x : add(x, y)
  }, concurrency).then(list => sum3(list, concurrency))
}
sum3([2,2,2,2]).then(res=>{console.log(res)})