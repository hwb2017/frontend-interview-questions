Array.prototype.reduce = Array.prototype.reduce || function (func, initialValue) {
  let acc
  let arr = this
  arr.forEach((val, index) => {
    if (index === 0) {
      if (initialValue) {
        acc = func(initialValue, val, index, arr)
      } else {
        acc = val
      }
    } else {
      acc = func(acc, val, index, arr)
    }
  })
  return acc
}