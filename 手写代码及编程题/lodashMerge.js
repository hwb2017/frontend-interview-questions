const getRawType = (val) => {
  return Object.prototype.toString.call(val).slice(8,-1)
}
const isPlainObject = (val) => {
  return getRawType(val) === 'Object'
}

const isPlainObjectOrArray = (val) => {
  return isPlainObject(val) || Array.isArray(val)
}

const merge = (object, ...sources) => {
  for (const source of sources) {
    for (const key in source) {
      if (source[key] === undefined && key in object) {
        continue
      }
      if (isPlainObjectOrArray(source[key])) {
        if (isPlainObjectOrArray(object[key]) && getRawType(object[key]) === getRawType(source[key])) {
          if (isPlainObject(object[key])) {
            merge(object[key], source[key])
          } else {
            object[key] = object[key].concat(source[key])
          }
        } else {
          object[key] = source[key]
        }
      } else {
        object[key] = source[key]
      }
    }
  }  
}

// merge array
var object = {
  'a': [{ 'b': 2 }, { 'd': 4 }]
};
merge(object, {'a': [{ 'c': 3 }, { 'e': 5 }]});
console.log(object)

// merge object
var object = {
  'a': { 'b': { 'c': 1 } },
};
merge(object, { 'a': { 'b': { 'd': 2 } } });
console.log(object)

// overwrite primitive value
object = {
  'a': {'b': 1}
};
merge(object, { 'a': {'b': 2} })
console.log(object)

// skip undefined
object = {
  'a': {'b': 1}
};
merge(object, { 'a': { 'b': undefined } })
console.log(object)

// multiple sources
var object = {
  'a': { 'b': { 'c': 1 , 'd': [1] } },
};
merge(object, { 'a': { 'b': { 'e': 2 } } }, { 'a': { 'b': { 'd': [2] } } });
console.log(JSON.stringify(object))