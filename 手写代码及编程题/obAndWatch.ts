const targetMap = new WeakMap<object, Map<string | symbol, Set<Function>>>()
let activeEffect: Function
const effectsStack: Function[] = []

const createReactiveEffet = (fn: Function): Function => {
  const reactiveEffect = () => {
    if (effectsStack.includes(fn)) return
    try {
      effectsStack.push(reactiveEffect)
      activeEffect = reactiveEffect
      return fn()
    } finally {
      effectsStack.pop()
      activeEffect = effectsStack[effectsStack.length - 1]
    }
  }
  return reactiveEffect
}

const track = (target: object, key: string | symbol) => {
  if (activeEffect === undefined) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
    // console.log(key, deps)
  }
}

const trigger = (target: object, key: string | symbol) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return

  deps.forEach((effect) => {
    effect && effect()
  })
}

const ob = <T extends object>(obj: T) => {
  const handler: ProxyHandler<T> = {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return res
    }
  }
  return new Proxy<T>(obj, handler)
}

const watch = (fn: Function) => {
  const reactiveEffect = createReactiveEffet(fn)
  reactiveEffect()
}

interface Data {
  count: number
  foo: string
}

const data = ob<Data>({ count: 0, foo: "test" })

watch(() => {
  console.log("watch-count", data.count)
})

watch(() => {
  console.log("watch-foo", data.foo)
})

data.count += 1
// watch-count 1
data.foo = "test2"
// watch-foo test2