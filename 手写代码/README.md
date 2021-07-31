> 主要参考[三元博客](http://47.98.159.95/my_blog/blogs/javascript/js-api/001.html)，手写代码系列
### 手写 new 函数
```javascript
function newFactory(ctor, ...args) {
  // 参数校验，第一个参数(构造函数)的类型必须为函数
  if (typeof ctor !== 'function') {
    throw new TypeError('the first parameter must be function');
  }
  // 使obj的[[Prototype]]执行构造函数的prototype属性所指向的原型对象
  let obj = Object.create(ctor.prototype);
  let res = ctor.apply(obj, args);

  let isObject = typeof res === 'object' && res !== null;
  //如果构造函数的返回结果不是对象或者函数，则直接返回创建的新对象，不应用构造函数
  return isObject ? res : obj;
}
```
### 手写 bind 函数
1. 对于普通函数，绑定this指向
2. 对于构造函数，要保证在原函数的原型对象上的属性不丢失
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
```javascript
Function.protorype.bind = function(context, ...args) {
  if (typepf this !== 'function') {
    throw TypeError('what is trying to bind is not callable');
  }
  // self 为绑定前的原函数
  let self = this;
  let fbound = function() {
    // 由于new运算符是先构建对象并将[[protype]]指向构造函数的prototype属性所指向的原型对象，再执行构造函数，此时的对象(this)已经是构造函数原型的一个实例了，因此可以用来判定
    self.apply(this instanceof self ?
      this :
      context, args.concat(Array.prototype.slice.call(arguments)))
  }
  // 由于bind返回的是一个新函数，如果这部不写的话，上面的 this instanceof self 永远不成立，因为self不在fbound的原型链上
  fbound = Object.create(this.prototype);
  return fbound;
}
```
### 手写 apply 和 call 函数
```javascript
Function.prototype.call = function(context, ...args) {
  let context = context ?? window;
  let context.fn = this;
  let result = eval('context.fn(...args)');
  delete context.fn;
  return result;
}
Function.prototype.apply = function(context, args) {
  let context = context ?? window;
  let context.fn = this;
  let result = eval('context.fn(...args)');
  delete context.fn;
  return result;
}
```
### 实现浅拷贝和深拷贝
```javascript
const shallowCopy = (target) => {
  if (typeof target === 'object' && target !== null) {
    let copyObj = Array.isArray(target) ? [] : {};
    // Reflec.ownKeys 返回一个数组，包含对象自身(不含继承)的所有键，不过是不是可遍历的，不管是不是symbol
    for (let key of Reflect.ownKeys(target)) {
      copyObj[key] = target[key];
    }
    return copyObj;
  } else {
    return target;
  }
}
```
> JSON.parse(JSON.stringify()) 可以简单暴力地实现深拷贝，但是无法解决循环引用问题，无法拷贝Date，Set，Map，RegExp等特殊对象，无法拷贝函数
```javascript
const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;
const deepCopy = (target, map = new WeakMap()) => {
  if(!isObject(target))
    return target;

  if(map.get(target))
    return target;
  if (isObject(target)) {
    map.set(target, true);
    const copyObj = Array.isArray(target) ? [] : {};
    for (let key of Reflect.ownKeys(target)) {
      copyObj[key] = deepCopy(target[key], map);
    }
    return copyObj;
  }
} 
```
### 函数柯里化
函数柯里化类似于构造一个状态机，这个状态机每次接收若干个参数，当没有接受到足够的参数(原函数期望的参数个数)时，返回一个新的柯里化函数，当接收到足够参数后，返回原函数的执行结果
```javascript
function curry(fn, ...args) {
  return function(..._args) {
    // 合并已有的参数列表和新传进来的参数列表
    let currentArgs = args.concat(_args);
    // 如果参数个数未达到期望个数，则返回新的柯里化函数
    if (currentArgs.length < fn.length) {
      // 使用 call 方法，而不是直接递归调用，是为了传递this
      return curry.call(this, fn, ...currentArgs);
    } else {
    // 如果参数个数达到期望个数，则立即执行原函数  
      return fn.call(this, ...currentArgs);
    }
  }
}
```