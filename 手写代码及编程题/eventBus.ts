type Listener = (eventName: string, ...args: any[]) => void

class EventBus {
  bus = new Map<string, Listener[]>()
  on(eventName: string, listener: Listener) {
    let listeners = this.bus.get(eventName)
    if (!listeners) {
      this.bus.set(eventName, (listeners = []))
    }
    listeners.push(listener)
  }
  emit(eventName: string, ...options: any[]) {
    let listeners = this.bus.get(eventName)
    if (!listeners) return
    listeners.forEach(listener => {
      listener && listener(eventName, ...options)
    })
  }
  off(eventName: string, listener: Listener) {
    let listeners = this.bus.get(eventName)
    if (!listeners) return
    const deleteIdx = listeners.indexOf(listener)
    listeners.splice(deleteIdx, 1)
  }
  once(eventName: string, listener: Listener) {
    let listeners = this.bus.get(eventName)
    if (!listeners) {
      this.bus.set(eventName, (listeners = []))
    }
    
    const once: Listener = (eventName: string,...options: any[]) => {
      listener(eventName, options)
      this.off(eventName, once)
    }
    listeners.push(once)
  }
}

const eventBus = new EventBus()
const listener1 = (eventName: string, times: number) => {
  console.log(`[${eventName}] wow ${times} times`)
}
const listener2 = (eventName: string, times: number) => {
  console.log(`[${eventName}] woof ${times} times`)
}
const listener3 = (eventName: string) => {
  console.log(`[${eventName}] only bark once`)
}

// 订阅 bark 事件，事件发布时执行 listener1
eventBus.on('bark', listener1)
// 订阅 bark 事件，事件发布时执行 listener2
eventBus.on('bark', listener2)
// 只订阅一次 bark 事件，事件发布时执行 listener3
eventBus.once('bark', listener3)

// 发布 bark 事件
eventBus.emit('bark', 3)
// [bark] wow 3 times
// [bark] woof 3 times
// [bark] only bark once

// 取消 listener2 对 bark 事件的订阅
eventBus.off('bark', listener2)

eventBus.emit('bark', 2)
// [bark] wow 2 times