### DOM事件是如何实现的
JavaScript与HTML之间的交互是通过事件实现的

从设计模式的角度来看，事件是基于发布订阅模式实现的，就是在浏览器加载的时候会读取事件相关的代码，但是只有实际等到具体事件触发的时候才会执行

事件最早是为了降低服务器的负载而诞生的，即把一部分网页交互通过客户端脚本来处理

### 闭包是什么
在JavaScript中，闭包是指有权访问另一个函数作用域中的变量的函数(在外部函数已经调用完的情况下依然可以访问)

JavaScript代码执行的整个过程分为两个阶段，代码编译阶段与代码执行阶段。编译阶段由JavaS引擎的编译器完成，将代码依次进行词法分析、语法分析的处理转为抽象语法树(AST)，再转为可执行代码，这个阶段作用域链规则会确定(作用域链由当前作用域与上层所有作用域的一系列变量对象组成，它保证了当前执行的作用域对符合访问权限的变量和函数的有序访问)

一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。
[MDN-闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
[MDN-作用域](https://developer.mozilla.org/zh-CN/docs/Glossary/Scope)

### 变量对象(VO)和活动对象(AO)的区别和联系
在执行上下文中，所有的变量和函数都是变量对象，在全局执行上下文中定义的变量，以及浏览器提供的window、Math、JSON等对象都是全局变量对象

活动对象本质上也是变量对象，但它是进入到某一个执行上下文中才会被激活的，比如函数执行上下文中的参数 arguments就是一个活动对象，函数内定义的变量也是活动对象

### Set、Map、WeakSet 和 WeakMap 的区别
WeekSet 的值和 WeekMap的键都只能是对象，且都是对对象的弱引用，如果对象删除则 WeekSet 和 WeekMap 中也无法访问这些对象，相应的，它们也不支持遍历(因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到)

### ES5/ES6 的继承除了写法以外还有什么区别
ES5中的继承，基本实现就是：
```javascript
function Sub(...args) {
    Super.apply(this, args)
}
Sub.prototype = new Super()
Sub.prototype.constructor = Sub
```
跟ES6的class继承相比，ES6的实现中，Sub.__proto__ = Super, 而ES5的基本实现中，Sub.__proto__ = Function.prototype。

其实ES6的class只是语法糖，本质上都可以用ES5的语法实现的，通过Babel转译就可以看出 class 的ES5实现是怎么样的

### 函数声明与变量声明的优先级关系
```javascript
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();
// 输出
// ƒ b() {
//   b = 20;
//   console.log(b)
// }
```
原因： 声明提前：一个声明在函数体内都是可见的，函数声明优先于变量声明；在非匿名自执行函数中，函数变量为只读状态无法修改

### 利用 concat API 通过迭代方法实现数组 flatten
```javascript
let arr = [1, 2, [3, 4, 5, [6, 7], 8], 9, 10, [11, [12, 13]]]

const flatten = function (arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}

console.log(flatten(arr))
```

主要利用 concat API 的特性，它的参数可以是多个数组或值，最终所有数组里的元素都会解开放到 concat API 左边的数组中

### 箭头函数和普通函数的区别
箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1、函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

2、不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

3、不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

4、不可以使用 new 命令，因为：

- 没有自己的 this，无法调用 call，apply。
- 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__

### 模拟实现一个 Promise.finally
```javascript
// finally 实现要点
// 1. 前面的状态只要不是pending，则一定会进入执行
// 2. 不接受任何参数(resolve或reject)
// 3. 除非在回调函数内抛出异常会根据异常来改变 promise 的状态和值，否则它所做的只是把状态和值传递
Promise.prototype.finally = function(callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {throw reason})
    )
}
```