const https = require('https')

// 第一版，只能打印错误或结果，没有返回值，不算完整的实现
const requestWithRetryLimit = (url, limit = 3) => {
    https.get(url, res => {
        console.log(res)
    }).on('error', (err) => {
        if (--limit > 0) {
            console.log(`request failed, ${limit} try left...`)
            requestWithRetryLimit(url, limit)
        } else {
            console.log(err)
        }
    })
}

// requestWithRetryLimit('https://www.fdsfwer.com', 3)

const promisifyHttpsGet = (url) => {
  return new Promise((resolve, reject) => {
    console.log(`making request to ${url}...`)
    https.get(url, res => {
      resolve(res)
    }).on('error', err => {
      reject(err)
    })
  })
}

// 第二版，async/await + try/catch
const requestWithRetryLimit1 = async (url, limit = 3) => {
  try {
    return await promisifyHttpsGet(url)
  } catch(error) {
    if (--limit > 0) {
      console.log(`request failed, ${limit} try left...`)
      return await requestWithRetryLimit1(url, limit)
    } else {
      return Promise.reject(error)
    }
  }
}

requestWithRetryLimit1('https://www.efarrwwrew.com', 5).then(res => console.log(res)).catch(err => console.log(err))

// 第三版，使用串行promise代替递归的写法
const requestWithRetryLimit2 = (url, limit = 3) => {
  return Array.from({length: limit}).reduce(
    (prevPromise) => 
      prevPromise
      .then((val) => {
        return val === undefined ? promisifyHttpsGet(url) : val
      })
      .catch(err => {
        if (--limit > 0) {
          console.log(`request failed, ${limit} try left...`)
        } else {
          return Promise.reject(err)
        }
      })      
    ,
    Promise.resolve()
  )
}

// requestWithRetryLimit2('https://www.baidu.com', 3).then(res => console.log(res)).catch(err => console.log(err))