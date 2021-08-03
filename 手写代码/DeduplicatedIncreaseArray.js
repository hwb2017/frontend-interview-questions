// 将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组
const process = (arr) => {
    return Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b)
}

(function test() {
    arr = [[3, 12, 1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
    console.log(process(arr))
})()