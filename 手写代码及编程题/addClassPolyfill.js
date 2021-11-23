// 参考 https://github.com/eligrey/classList.js/blob/master/classList.js

// 判断是否是在浏览器环境，能访问到dom对象
// 要点1： 检测环境中是否可以访问 dom 对象
if ("document" in self) {
  // 如果环境中没有 classList 这个属性，则开始 polifill
  // 要点2： 检测Element元素上是否有 classList 属性
  if (!("classList" in document.createElement("_"))) {
  
    (function (context) {
      "use strict";
      // 如果环境中没有Element的构造函数，则跳出
      if (!('Element' in context)) return;
      var
        classListProp = "classList"
        , protoProp = "prototype"
        , elemCtrProto = context.Element[protoProp]
        , objCtr = Object
        , strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, ""); 
          }
        , arrIndexOf = Array[protoProp].indexOf || function (item) {
            var i = 0;
            var len = this.length;
            for (; i < len; i++) {
              if (i in this && this[i] === item) {
                return i;
              }
            }
            return -1;
          }
        // 基于 DomExeption 封装一个 error 对象
        , DOMEx = function (type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
          }
        // 要点3：检测传入的单个 class 是否语法有问题（不能是空字符串或包含空格），已经在 classList 中
        , checkTokenAndGetIndex = function (classList, token) {
            if (token === "") {
              throw new DOMEx("SYNTAX_ERR", "The token must not be empty.");
            }
            if (/\s/.test(token)) {
              throw new DOMEx("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
            }
            return arrIndexOf.call(classList, token);
          }
        // ClassList 构造函数的实现
        , ClassList = function (elem) {
            var
              // 要点4：使用 getAttribute 来获取class属性，而不是 classList 或 className 等后出的 API
              // 要点5：对原有的 class 进行 trim 操作，去除多余的前后空格
              trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
              , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
              , i = 0
              , len = classes.length;
            for (; i < len; i++) {
              this.push(classes[i]);
            }
            this._updateClassName = function () {
              elem.setAttribute("class", this.toString());
            };
          }
        // 要点6：将构造函数的原型赋值为数组，支持通过 Element.classList[0] 的方式访问某个 className，并且有length属性
        , classListProto = ClassList[protoProp] = []
        , classListGetter = function () {
            return new ClassList(this);
          }
        ;
      classListProto.add = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
        ;
        do {
          token = tokens[i] + "";
          if (!~checkTokenAndGetIndex(this, token)) {
            this.push(token);
            updated = true;
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toString = function () {
        return this.join(" ");
      };
      // 要点7：使用Object.defineProperty 或者 Element.__defineGetter__ 方法将 classList 属性挂载到 Element 的 prototype 上，只在首次访问时初始化
      if (objCtr.defineProperty) {
        var classListPropDesc = {
            // 在 getter 函数中创建 ClassList 对象并返回
            get: classListGetter
          , enumerable: true
          , configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    }(self));
  }
}