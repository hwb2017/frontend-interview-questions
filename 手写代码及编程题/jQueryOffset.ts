// jQuery offset API 返回元素距离document元素的偏移距离(top和left)
const offset = (element: Element) => {
  // 如果当前浏览器为 IE11 以下版本，则直接返回 { top: 0, left: 0 }
  if (!element.getClientRects().length) {
    return {
      top: 0,
      left: 0
    }
  }
  if (window.getComputedStyle(element)['display'] === 'none') {
    return {
      top: 0,
      left: 0
    }
  }
  const result = element.getBoundingClientRect()
  // 获取ownerDocument，应该是为了区别iframe场景下的多个document元素
  const docElement = element.ownerDocument.documentElement

  return {
    top: result.top + docElement.scrollTop,
    left: result.left + docElement.scrollLeft
  }
}