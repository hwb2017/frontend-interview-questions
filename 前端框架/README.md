### 操作真实DOM和Virtual DOM 相比的性能问题
> 不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 没 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。

参考 https://www.zhihu.com/question/31809713/answer/53544875

### Vue3中使用 Proxy 代替 Object.defineProperty 来实现响应性有什么好处
1. Object.defineProperty只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy可以劫持整个对象，并返回一个新的对象。
2. Proxy不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。