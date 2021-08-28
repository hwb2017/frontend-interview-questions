const isObj = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

const symbolDeepCopy = (obj, set = new WeakSet()) => {
    if (!isObj) return obj
    if (set.has(obj)) {
        return set.get(obj)
    } else {
        set.add(obj)
    }
    let target = {}
    // Reflect.ownKeys 获取所有可枚举或不可枚举的String类型或Symbol类型的属性，不包括继承属性
    for (const k of Reflect.ownKeys(obj)) {
        target[k] = symbolDeepCopy(obj[k], set)
    }
    return target
}