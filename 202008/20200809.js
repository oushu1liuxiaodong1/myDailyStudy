// 模拟new操作符的实现
// 1.创建一个空的对象
// 2.对该对象执行原型操作，即链接该对象到另一个对象
// 3.将步骤1新创建的对象作为this的上下文
// 4.如果该函数没有返对象，则返回this
function mockNew() {
  let obj = new Object();
  const Constructor = [].shift.apply(arguments);
  obj.__proto__ = Constructor.prototype;
  const ret = Constructor.apply(obj, arguments);
  return typeof ret === 'Object' ? ret : obj;
}

function Dog(name, color, age) {
  this.name = name;
  this.color = color;
  this.age = age;
}

Dog.prototype={
  getName: function() {
    return this.name
  }
}

var dog = mockNew(Dog, '大黄', 'yellow', 4);
console.log('dog======', dog);

// 模拟实现Promise(够用版)
function Promise(executor) {
  let _this = this;
  this.state = 'pending';
  this.value = undefined;
  this.reason = undefined;
  // 保存成功和失败回调
  this.onResolvedCallbacks = [];
  this.onRejectedCallbacks = [];
  // 让其处理器函数立即执行
  try {
    executor(resolve, reject);
  } catch(err) {
    reject(err);
  }
  function resolve(value) {
    if (_this.state === 'pending') {
      _this.value = value;
      // 遍历执行成功回调
      _this.onResolvedCallbacks.forEach(cb => cb(value));
      _this.state = 'resolved';
    }
  }
  function reject(reason) {
    if (_this.state === 'pending') {
      _this.reason = reason;
      // 遍历执行失败回调
      _this.onRejectedCallbacks.forEach(cb => cb(reason))
      _this.state = 'rejected';
    }
  }
}
Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.state === 'pending') {
    if (typeof onFulfilled === 'function') {
      this.onResolvedCallbacks.push(onFulfilled);
    }
    if (typeof onRejected === 'function') {
      this.onRejectedCallbacks.push(onRejected);
    }
  }
  if (this.state === 'resolved') {
    if (typeof onFulfilled === 'function') {
      onFulfilled(this.value);
    }
    if (this.state === 'rejected') {
      if (typeof onRejected === 'function') {
        onRejected(this.reason);
      }
    }
  }
}

let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then(data => console.log(data)) // 1

// instanceof 的原理是什么?自定义实现instanceof
// 原理：判断right 类型是否在left对象的圆形脸上；
// 通过一直循环判断left对象的原型是否等于right类型的原型，直到找到或者left对象的原型为null
function myInstanceof(left, right) {
  let prototype = right.prototype;
  left = left.__proto__;
  while(true) {
    if (left === null || left === undefined) {
      return false;
    }
    if (left = prototype) {
      return true;
    }
    left = left.__proto__
  }
}
// 函数防抖和函数节流
// 函数防抖：当事件被触发n秒后再次执行回调，如果在这n秒内又被触发，则重新计时
// 如果有人进入电梯，那电梯将在10s后出发，这10s内如果又有人进了电梯，我们又得等10s才能出发；
// 函数节流：规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间
// 内某事件被多次触发，只有一次能生效
function debounce(fn, wait) {
  let timer = null;
  return function() {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  }
}

function throttle(fn, wait) {
  let preTime = Date.now();
  return function() {
    let context = this;
    let args = arguments;
    let curTime = Date.now();
    if (curTime - preTime > wait) {
      fn.apply(context, arguments);
      preTime = Date.now();
    }
  }
}