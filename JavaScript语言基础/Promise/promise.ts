// 参考 https://juejin.cn/post/6987674192166518821

// Promise 内部状态枚举
enum PROMISE_STATES {
    PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected'
}

type PromiseStates = PROMISE_STATES.PENDING | PROMISE_STATES.FULFILLED | PROMISE_STATES.REJECTED;

export const isFunction = (fn: any): boolean => typeof fn === 'function';
export const isObject = (obj: any): boolean => typeof obj === 'object';

export interface ICallbackFn {
    (value?: any): any;
}
type CallbackParams = ICallbackFn | undefined;

export interface IExecutorFn {
    (resolve: ICallbackFn, reject: ICallbackFn): any;
}

export interface IPromiseType {
    then: IExecutorFn
    catch: ICallbackFn
    finally: ICallbackFn
}

class PromiseLike implements IPromiseType {
    protected PromiseState: PromiseStates;
    protected PromiseResult: any;
    resolveCallbackQueues: Array<CallbackParams>;
    rejectCallbackQueues: Array<CallbackParams>;
    
    constructor(executor: IExecutorFn) {
        if (!isFunction(executor)) {
            throw new Error('Promise resolver undefined is not a function');
        }
        this.PromiseState = PROMISE_STATES.PENDING;
        this.PromiseResult = undefined;
        // 分别用于两个注册事件保留的数组
        this.resolveCallbackQueues = [];
        this.rejectCallbackQueues = [];

        executor(this._resolve, this._reject);
    }

    _resolve = (value?: any) => {
        const resolveCb = () => {
            if (this.PromiseState !== PROMISE_STATES.PENDING) {
                return;
            }
            while (this.resolveCallbackQueues.length) {
                const fn = this.resolveCallbackQueues.shift();
                fn && fn(value);
            }
            this.PromiseState = PROMISE_STATES.FULFILLED;
            this.PromiseResult = value;
        }
        // 使任务变成异步的, 暂时放到宏任务队列里
        setTimeout(resolveCb, 0);
    }

    _reject = (value?: any) => {
        const rejectCb = () => {
            if (this.PromiseState !== PROMISE_STATES.PENDING) {
                return;
            }
            while (this.rejectCallbackQueues.length) {
                const fn = this.rejectCallbackQueues.shift();
                fn && fn(value);
            }
            this.PromiseState = PROMISE_STATES.REJECTED;
            this.PromiseResult = value;            
        }
        setTimeout(rejectCb, 0)
    }

    then = (onFulfilled?: ICallbackFn, onRejected?: ICallbackFn) => {
        // 默认处理
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value;
        onRejected = isFunction(onRejected) ? onRejected : err => { throw err };

        return new PromiseLike((resolve, reject) => {
            const handleFulfilled = (val?: any) => {
                try {
                    const res = onFulfilled!(val);
                    // 将当前 promise 对象的值传递给下一个 promise 对象
                    resolve(res);
                } catch(err) {
                    // 如果当前执行逻辑内发生异常，则抛出异常
                    reject(err);
                }
            };

            const handleRejected = (val?: any) => {
                try {
                    const res = onRejected!(val);
                    reject(res);
                } catch(err) {
                    reject(err);
                }
            }

            switch (this.PromiseState) {
                case PROMISE_STATES.PENDING:
                    isFunction(onFulfilled) && this.resolveCallbackQueues.push(onFulfilled);
                    isFunction(onRejected) && this.rejectCallbackQueues.push(onRejected);
                    break;
                case PROMISE_STATES.FULFILLED:
                    handleFulfilled(this.PromiseResult);
                    break;
                case PROMISE_STATES.REJECTED:
                    handleRejected(this.PromiseResult);
                    break;
            }
        });
    }

    catch = (rejectedCb?: ICallbackFn) => {
        return this.then(undefined, rejectedCb);
    }

    // finally 实现要点
    // 1. 前面的状态只要不是pending，则一定会进入执行
    // 2. 不接受任何参数(resolve或reject)
    // 3. 除非在回调函数内抛出异常会根据异常来改变 promise 的状态和值，否则它所做的只是把状态和值传递
    finally = (finallyCb: CallbackParams) => {
        return this.then(
            val => PromiseLike.resolve(finallyCb && finallyCb()).then(() => val),
            err => PromiseLike.resolve(finallyCb && finallyCb()).then(() => { throw err })
        )
    }

    static resolve(value?: any) {
        if (PromiseLike.is(value)) {
            return value;
        }
        return new PromiseLike((resolve: Function) => resolve(value));
    }

    static reject(value?: any) {
        return new PromiseLike((resolve: Function, reject: Function) => reject(value));
    }

    static is(promise: any) {
        return promise instanceof PromiseLike
    }

    /**
    * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    * @param promises 严格意义上来说，参数是可迭代对象，为了简化实现这里统一成数组
    * @return
    */
    static all(promises: Array<ICallbackFn>) {
      // 支持链式调用，因此要返回一个新的Promise实例
      return new PromiseLike((resolve, reject) => {
          const len = promises.length;
          let resolvedPromiseCount = 0;
          let resolvedPromiseResult = <any>[];
          for (let i = 0; i < len; i++) {
              const currentPromise = promises[i];
              // 如果不是 Promise 实例，则需要转化成 Promise, 已经是 Promise 的话，进行转化后也是幂等的
              this.resolve(currentPromise)
              .then((res: any) => {
                  resolvedPromiseCount++;
                  resolvedPromiseResult[i] = res;
                  // 当所有值都 resolve 之后，返回结果数组
                  if (resolvedPromiseCount === len) {
                      resolve(resolvedPromiseResult);
                  }
              })
              // 如果有一个存在异常，则直接退出
              .catch((err: any) => {
                  reject(err);
              })
          }
      })
    }

    /**
    * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
    * @param promises
    * @return
    */
    static race(promises: Array<ICallbackFn>) {
        return new PromiseLike((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                const currentPromise = promises[i];
                PromiseLike.resolve(currentPromise)
                    .then((res: any) => {
                        resolve(res)
                    })
                    .catch((err: any) => {
                        reject(err);
                    })
            }
        })
    }

    /**
     * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
     * @param promise
     * @return
     */
    static allSettled(promises: Array<ICallbackFn>) {
        return new PromiseLike((resolve, reject) => {
            const len = promises.length;
            const startTime = Date.now();
            let resolvedPromiseCount = 0;
            let resolvedPromiseResult = <any>[];
            for (let i = 0; i < len; i++) {
                const currentPromise = promises[i];
                PromiseLike.resolve(currentPromise)
                    .then((res: any) => {
                        resolvedPromiseCount++;
                        resolvedPromiseResult[i] = {
                            status: PROMISE_STATES.FULFILLED,
                            value: res
                        };
                        if (resolvedPromiseCount === len) {
                            resolvedPromiseResult.duringTime = Date.now() - startTime + 'ms';
                            resolve(resolvedPromiseResult);
                        }
                    })
                    .catch((err: any) => {
                        resolvedPromiseCount++;
                        resolvedPromiseResult[i] = {
                            status: PROMISE_STATES.REJECTED,
                            reason: err
                        };
                        if (resolvedPromiseCount === len) {
                            resolvedPromiseResult.duringTime = Date.now() - startTime + 'ms';
                            resolve(resolvedPromiseResult);
                        }
                    });
            }
        });
    }

    /**
     * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
     * @param promise
     * @return
     */
    static any(promises: Array<ICallbackFn>) {
        return new PromiseLike((resolve, reject) => {
            const len = promises.length;
            let rejectedPromisesCount = 0;
            let rejectedPromisesResult = <any>[];
            for (let i = 0; i < promises.length; i++) {
                const currentPromise = promises[i];
                PromiseLike.resolve(currentPromise)
                    .then((res: any) => {
                        resolve(res);
                    })
                    .catch((err: any) => {
                        rejectedPromisesCount++;
                        rejectedPromisesResult[i] = err;
                        if (rejectedPromisesCount === len) {
                            throw rejectedPromisesResult;
                        }
                    })
            }
        })
    }
}