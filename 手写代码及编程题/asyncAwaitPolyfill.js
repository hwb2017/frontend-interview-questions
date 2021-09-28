// 参考 https://github.com/shfshanyue/Daily-Question/issues/241

// 接受转化为generator函数的async/await语法函数，并通过promise实现自执行
function asyncToGenerator(generatorFunc) {
  return function() {
    // 先执行generator函数
    const gen = generatorFunc.apply(this, arguments)
    // async函数最后返回一个promise
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult
        try {
          generatorResult = gen[key](arg)
        } catch(error) {
          return reject(error)
        }
        const { value, done} = generatorResult
        if (done) {
            resolve(value)
        } else {
            Promise.resolve(value).then(
                (value) => step("next", value),
                (err) => step("throw", err)
            )
        }
      }
      step("next")
    })
  }
}