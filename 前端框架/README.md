### 操作真实DOM和Virtual DOM 相比的性能问题
> 不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 没 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。

参考 https://www.zhihu.com/question/31809713/answer/53544875