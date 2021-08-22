// 参考 https://mp.weixin.qq.com/s/lgdMXsQJUX363cEfEtK0KQ

const isObject = (source) => {
    return Object.prototype.toString.call(source) === '[object Object]'
}

const BFSDeepCopy = (source) => {
    if (!isObject(source)) return source
    const set = new WeakSet()
    const queue = []
    const target = {}
    queue.push({
        parent: target,
        data: source
    })
    while (queue.length > 0) {
        current = queue.shift()
        parent = current.parent
        data = current.data
        for (let k of Reflect.ownKeys(data)) {
            if (isObject(data[k])) {
                if (set.has(data[k])) {
                    parent[k] = data[k]
                } else {
                    set.add(data[k])
                }
                newParent = parent[k] = {}
                queue.push({
                    parent: newParent,
                    data: data[k]
                })
            } else {
                parent[k] = data[k]
            }
        }
    }
    return target
}

(function test() {
    let a = { 
        'a': {
            'b': {
                'c': 1
            }
        }
    }
    let b = BFSDeepCopy(a)
    b['a']['b']['c'] = 2
    console.log(a['a']['b']['c'] === b['a']['b']['c'])
})()