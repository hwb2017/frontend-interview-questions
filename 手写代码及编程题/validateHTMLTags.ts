const str1 = "<html><div>123</div></html>" //true
const str2 = "<div><div>123</div><div></div></div>" //true
const str3 = "<html><div>123</html></div>" //false
const str4 = "<html><span>123<input /><input /></span></html>" //true

interface Tag {
  tagName: string
  type: 'start' | 'end'
}

const normalTagList = ["html", "div", "span"]
const selfCloseTagList = ["input"]
const tagList = ([] as string[]).concat(normalTagList, selfCloseTagList)

const isTagPairMatch = (prevTag: Tag, currentTag: Tag): boolean => {
  if (prevTag.tagName === currentTag.tagName) {
    return prevTag.type === "start" && currentTag.type === "end"
  } else {
    return false
  }
}

const parseHTML = (str: string) => {
  let isStartTagComposing = false
  let isEndTagComposing = false
  let isSelfCloseTagComposing = false
  let len = str.length
  let tagName = ""
  let stack = [] as Tag[]
  for (let i = 0; i < len; i++) {
    if (str[i] === "<") {
      isStartTagComposing = true
    } else if (str[i] === "/") {
      if (isStartTagComposing) {
        if (tagName.length === 0) {
          isEndTagComposing = true
          isStartTagComposing = false
        } else {
          isSelfCloseTagComposing = true
          isStartTagComposing = false
          isEndTagComposing = false
        }
      }
    } else if (str[i] === ">") {
        tagName = tagName.trim()
        if (!tagList.includes(tagName)) {
          console.warn(`unsupport tag name: ${tagName}`)
          return false
        }
        if (isSelfCloseTagComposing) {
          console.log(`self closed tag found: ${tagName}`)
          tagName = ""
          isSelfCloseTagComposing = false
          continue
        }
        const currentTag: Tag = {
          tagName: tagName,
          type: isStartTagComposing ? "start" : "end"
        }
        if (currentTag.type === "start") {
          stack.push(currentTag)
        } else {
          if (stack.length > 0) {
            const prevTag = stack[stack.length-1]
            if (isTagPairMatch(prevTag, currentTag)) {
              console.log(`tag matched: ${currentTag.tagName}`)
              stack.pop()
            } else {
              return false
            }
          } else {
            return false
          }
        }
        tagName = ""
        isStartTagComposing = false
        isEndTagComposing = false
    } else {
      if (isStartTagComposing || isEndTagComposing) {
        tagName += str[i]
      }
    }
  }
  return true
}

console.log(parseHTML(str1))
console.log(parseHTML(str2))
console.log(parseHTML(str3))
console.log(parseHTML(str4))