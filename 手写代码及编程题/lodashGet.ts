const lodashGet = (object: { [key: string]: any }, path: Array<string> | string, defaultValue?: any): any => {
    let result: any
    const findArrayPath = (path: Array<string>): any => {
        if (path.length === 0) {
            return result = defaultValue
        }
        result = object
        for (const p of path) {
            if (p in result) {
                result = result[p]
            } else {
                result = defaultValue
                break
            }
        }
        return result
    }
    if (Array.isArray(path)) {
        result = findArrayPath(path)
    } else  {
        path.replace
        let normalizedPath = path.replace(/\.|\[|\]/g, ' ').split(/\s+/)
        result = findArrayPath(normalizedPath)
    }
    return result
}

const object = { 'a': [{ 'b': { 'c': 3 } }] }

console.log(lodashGet(object, 'a[0].b.c'))
console.log(lodashGet(object, ['a', '0', 'b', 'c']))
console.log(lodashGet(object, 'a.b.c', 'default'))