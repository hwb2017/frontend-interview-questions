// 作用域链是由函数创建时的上下文决定的，而不是函数调用时的上下文，参考 https://www.cnblogs.com/leftJS/p/11067908.html

function bar() {
  console.log(project)
}

function foo() {
  var project = "foo"
  bar()
}

function foo1() {
  var project = "foo";
  (function () {
    console.log(project)
  })()
}

var project = "global"
foo()
foo1()