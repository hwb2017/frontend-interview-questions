## 图片懒加载
图片懒加载即图片的CSSOM对象进入视口时才触发对图片的加载(设置src属性)，常用的方法是 getBoundingClientRect API + Scroll with Throttle + DataSet API，或者使用 IntersectionObserver API + DataSet API，参考 https://github.com/shfshanyue/Daily-Question/issues/1

## 获取浏览器的唯一标识
通过Canvas指纹技术，可以获取浏览器的唯一标识。大概流程是: 
1. 绘制 canvas, 获取它的 dataurl
2. 对 dataurl 这个字符串进行 md5 摘要计算，得到指纹信息

在生产环境中使用的话，可以使用 fingerprintjs2，参考 https://github.com/shfshanyue/Daily-Question/issues/28