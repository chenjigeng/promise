const PROMISE_STATUS = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
}

class Promise {
  constructor(fn) {
    this.status = PROMISE_STATUS.PENDING;
    this.value = null;
    this.error = null;
    this.fulfilledCbs = [];
    this.rejectedCbs = [];
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(val) {
    if (this.status === PROMISE_STATUS.PENDING) {
      setTimeout(() => {
        this.status = PROMISE_STATUS.FULFILLED;
        this.value = val;
        this.fulfilledCbs.forEach(cb => cb(val));
      });
      
    }
  }

  reject(error) {
    if (this.status === PROMISE_STATUS.PENDING) {
      setTimeout(() => {
        this.status = PROMISE_STATUS.REJECTED;
        this.error = error;
        this.rejectedCbs.forEach(cb => cb(error));
      });
    }
  }

  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : function (value) { return value; };
    onRejected = typeof onRejected === 'function' ? onRejected : function (error) { throw error; };


    let promise;
    let self = this;
    function handlePromise(func, resolve, reject) {
      return (val) => {
        setTimeout(() => {
          try {
            let x = func(val);
            self.resolvePromise(promise, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
    }
    if (this.status === PROMISE_STATUS.FULFILLED) {
      promise = new Promise((resolve, reject) => {
        handlePromise(onResolved, resolve, reject)(this.value);
      })
    }
    if (this.status === PROMISE_STATUS.REJECTED) {
      promise = new Promise((resolve, reject) => {
        handlePromise(onRejected, resolve, reject)(this.error);
      })
    }
    if (this.status === PROMISE_STATUS.PENDING) {
      promise = new Promise((resolve, reject) => {
        this.fulfilledCbs.push(handlePromise(onResolved, resolve, reject));
        this.rejectedCbs.push(handlePromise(onRejected, resolve, reject));
      })
    }

    return promise;
  }

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      throw new TypeError('递归错误');
    }
    if (x instanceof Promise) {
      if (x.status === PROMISE_STATUS.PENDING) {
        x.then((val) => {
          this.resolvePromise(promise, val, resolve, reject)
        }, reject);
      } else {
        x.then(resolve, reject);
      }
      return;
    }
    let isCall = false;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then;
        if (typeof then === 'function') {
          then.call(x, (v) => {
            if (isCall) return;
            isCall = true;
            return this.resolvePromise(promise, v, resolve, reject);
          }, (r) => {
            if (isCall) return;
            isCall = true;
            return reject(r);
          });
        } else {
          resolve(x);
        }
      } catch (e) {
        if (isCall) return;
        isCall = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }
}

Promise.deferred = function () {
  var global = {};

  var promise = new Promise(function (onResolve, onReject) {
    global.onResolve = onResolve;
    global.onReject = onReject;
  });

  var resolve = function (value) {
    global.onResolve(value);
  };

  var reject = function (reason) {
    global.onReject(reason);
  }

  return {
    promise,
    resolve,
    reject
  }
}


module.exports = Promise;



// const rejected = d.reject;
// module.exports = Promise;