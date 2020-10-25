export default (function() {
  // 利用闭包实现私有属性
  const items = new WeakMap()

  class Stack {
    constructor() {
      items.set(this, [])
    }
    push(element) {
      const s = items.get(this)
      s.push(element)
    }
    pop() {
      const s = items.get(this)
      const r = s.pop()
      return r
    }
    peek() {
      const s = items.get(this)
      return s[s.length - 1]
    }
    isEmpty() {
      return items.get(this).length === 0
    }
    size() {
      return items.get(this).length
    }
    toArray() {
      return items.get(this)
    }
  }
  return Stack
})()
