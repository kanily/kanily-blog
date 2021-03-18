#### instanceof
**instanceof** 判断左边原型是否存在右边的原型链中
实现思路： 逐层网上查找原型，如果最终原型为null，证明不在原型链中，否认存在
``` js
function myInstanceof (left, right) {
    if(typeof left !== 'object' || left === null) return false;
    let proto = Object.getPrototype(left);
    while(true) {
        if(proto === null) return false;
        if(proto === right.prototype) return true;
        proto = Object.getPrototype(proto);
    }
}
```
#### Object.create
创建一个继承 obj 原型属性的纯净对象
```js
const myCreate = function(obj) {
    function F () {};
    F.prototype = obj;
    return new F();
}
```
#### new
new 被调用做了三件事
* 让实例对象可以访问到私有属性
* 让实例对象可以访问构造函数原型所在的原型链的属性
* 考虑构造函数有返回值的
``` js
function myNew() {
    // 1.获得构造函数，同时删除arguments 中第一个参数；
    let ctor = [].shift.call(arguments);
    // 2.创建一个空的对象饼链接到原型， obj可以访问构造函数原型中的属性
    let obj = Object.create(ctor.prototype);
    // 3.绑定 this 实现继承，object 可以访问到构造函数中的属性
    let result = ctor.apply(obj, arguments);
    // 4.优先返回构造函数返回的对象
    return result instanceof Object ? result : obj;
}
```
#### call&apply
实现思路： 利用谁调用函数，函数的this 就指向谁这一特点实现
```js
Function.prototype.myCall = function() {
    if(typeof this !== 'function') throw 'caller must be a function';
    let self = arguments[0] || window;
    self._fn = this;
    let args = [...arguments].flat().slice(1) // 展开后取参数列表
    let res = self._fn(...args);
    delete self._fn;
    return res
}
```
#### bind
bind 用于改变 this指向 并返回一个函数
```js
Function.prototype.myBind = function() {
    if(typeof this !== 'function') throw 'caller must be a function';
    let self = this;
    let context = arguments[0]
    let args = Array.prototype.slice.call(arguments, 1);
    let fn = function() {
        let fnArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof self ? this: context, args.concat(fnArgs))        
    }
    fn.prototype = Object.create(self.prototype) // 维护原型
    return fn

}
```
#### curry
```js
    function curry(fn, args=[]) {
        return function () {
            let newArgs = args.concat(Array.prototype.slice(arguments));
            if (newArgs.length < fn.length) {
                return curry.call(this, fn, newArgs)
            } else {
                return fn.apply(this, newArgs)
            }
        }
    }
```
#### 数组排序
##### 冒泡
```js
    function bubbleSort(arr) {
        for(let i = arr.length; i >= 0; i--) {
            for(let j = 0; j < i; i++) {
                if(arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                }
            }
        }
        return nums
    }
```
##### 快速排序
```js
    function quickSort(arr) {
        if(arr.length <= 1) return arr;
        let left = [], right = [], mid = arr.splice(0, 1);
        for (let i = 0; i < arr.length; i ++) {
            if (arr[i] < mid) {
                left.push(arr[i])
            } else {
                right.push(arr[i])
            }
        }
        return quickSort(left).concat(mid, quickSort(right))
    }
```
#### 深浅拷贝
##### 浅拷贝
```js
    function shadowCopy(source) {
        var target = {};
        for(var key in source) {
            if(Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }
    return target;
```
##### 深拷贝
JSON.parse(JSON.stringify(a)) 这种方法无法解决循环引用 无法拷贝特殊对象
解决方案： 使用哈希表：检测当前对象，取该值
```js
    function deepClone(source, hash = new WeakMap()) {
        function isObject() {
            return typeof obj === 'object' && obj !== null;
        }
        if(!isObject(source)) return source;
        if(hash.has(soucre)) return hash.get(source);

        var target = Array.isArray(source) ? [] : {};
        hash.set(source, target);
        for(var key in source) {
            if(typeof source[key] === 'object') {
                deepClone(source[key])
            } else {
                target[key] = source[key]
            }
        }
        return target;
    }
```
#### 防抖/节流
#### 防抖
```js
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            if(timer) clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }
```
##### 节流
``` js
    function throttle(fn, delay) {
        let flag = true;
        return function (...args) {
            if(!flag) return;
            setTimeout(() => {
                fn.apply(this, args)
                flag = true;
            }, delay)
        }
    }
```
#### 加强版节流
```js
    const throttle = (fn, delay) => {
        let timer = null, last = 0;
        return function() {
            let now = +new Date();
            if(now - last === delay && timer) {
                clearTimer(timer);
                timer = setTimeout(() => {
                    fn.apply(this, args)
                }, delay)
            } else {
                last = now;
                fn.apply(this, args)
            }
        }
    }
```
#### Promise 系列
链式调用
错误捕获
##### promise.race
```js
    Promise.prototype.race = function(promises) {
        return new Promise((resolve, reject) => {
            if(promises.length === 0) return;
            promises.forEach((promise) => {
                Promise.resolve(promise).then((data) => {
                    resolve(data)
                    return;
                }).catch(err => {
                    reject(err)
                    return;
                })
            }) 
        })

    }
```
##### promise.all
```js
    Promise.prototype.all = function(promises) {
        return new Promise((resolve, reject) => {
            let result = [],
                index = 0
                len = promises.length;
            function proccessData(data, idx) {
                result[idx] = data;
                index++;
            }
            promises.forEach((item, idx) => {
                Promise.resolve(item).then((data) => {
                    processData(data, idx);
                    if(index ==len) {
                        resolve(result);
                    }
                }).catch((err) => {
                    reject(err)
                })
            })
        })
    }
```

#### 设计模式
##### 观察者模式
```js
 class Subject {
     constructor() {
         this.observers = [] //观察者队列
     }
     
     add(observer) {
         this.observers.push(observer);
         this.observers = [...new Set(this.observers)];
     }

     notify(...agrs) {
         this.observers.forEach((observer) => observer.update(...agrs))
     }

    remove(observer) {
        let observers = this.observers;
        for(let i= 0; i < observers.length; i++) {
            if(observer === observer[i]) {
                observers.splice(i, 1)
            }
        }
    }
 }

 class Observer {
     update(...ars) {
         console.log(...args)
     }
 }
```
##### 发布订阅
``` js
    class EventEmitter {
        constructor() {
            this.handles = {}
        }

        on = (eventName, cb) {
            const eventCallback = this._getHandler(eventName).callbackStack;
            eventCallback.push(cb);
        }

        emit = (eventName, ...args) => {
            if(this.handlers[eventName]) {
                this.handlers[eventName].callbackStack.for(() => {
                    cb.call(cb, ...args);
                })
            }
            if(this.handlers[eventName].isOnce) {
                this.off(eventName)
            }
        }
        off = (eventName) => {
            if(this.handlers[eventName]) {
                delete this.handlers[eventName];
            }
        }

        once = (eventName) => {
            const eventCallbackStack = this._getHandler(eventName, true).callbackStack;
            callbackStack.push(cb)
        }

        _getHandler = (eventName) => {
            if(!this.handlers[eventName]) {
                this.hanlers[eventName] = {
                    isOnce,
                    callbackStack: []
                }
            }
            return this.handlers[eventName]
        }
       
    }
```
#### Redux
```js
    function createStore(reducer, enhancer) {
        // 先处理 enhancer
        // 如果 enhancer 存在并且是函数， 我们将 createStore 作为参数传给它
        // 在拿这个 新的createStore执行，应该得到一个Store，返回Store
        if(enhancer && typeof enhancer === 'function') {
            const newCreateStore = enhancer(createStore);
            const newStore = newCreateStore(reducer)
            return newStore;
        }

        let state, // state记录所有状态
            listeners = [] // 保存所有的注册回调
        function subscribe(callback) {
            listeners.push(callback)
        }
        // 先执行reducer 修改并返回新的state，然后将所有的回调拿出来依次执行
         function dispatch(action) {
             state = reducer(state, action) //这一步别忘
             for(let i = 0; i < listeners.length; i++) {
                 const listener = listeners[i]
                 listener()
             }
         }
         function getState() {
             return state;
         }
         // store 包装一下前面的方法直接返回
         const store = {
             subscribe,
             dispatch,
             getState
         }
         return store;
    }
```
#### LRU Cache 
```js
    class ListNode {
        constructor(key, value) {
            this.key = key;
            this.value = value;
            this.count = 0;
            this.next = null;
            this.prev = null;
        }
    }

    class LRUCache {
        constructor(capacity) {
            this.capacity = capacity;
            this.hash = {}
            this.count = 0
            this.dummyHead = new ListNode()
            this.dummyTail = new ListNode()
            this.dummyHead.next = this.dummyTail;
            this.dummyTail.prev = this.dummyHead;
        }

        get() {
            let node = this.hash[key]
            if(node == null) return -1
            this.moveToHead(node);
            return node.value;
        }

        put(key, value) {
            let node = this.hash[key];
            if(node == null) {
                if(this.count == this.capacity) {
                    this.removeLRUItem()
                }
                let newNode = new ListNode(key, value);
                this.hash[key] = newNode;
                this.addTohead(newNode);
                this.count++;
            } else {
                node.value = value;
                this.moveTohead(node)
            }
        }
        
        moveToHead(node) {
            this.removeFromList(node);
            this.addToHead(node)
        }

        removeFromToList(node) {
            let temp1 = node.prev;
            let temp2 = node.next
            temp1.next = tem2;
            temp2.prev = temp1
        }

        addToHead(node) {
            node.prev = this.dummyHead;
            node.next = this.dummyHead.next;
            this.dummyHead.next.prev = node;
            this.dummyHead.next = node;
        }
        removeLRUItem() {
            let tail = this.popTail();
            delete this.hash[tail.key]
            return tail
        }
        popTail() {
            let tail = this.dummyTail.prev;
            this.removeFromList(tail);
            return tail
        }
    }
```
### js树转换
```js
function array2Tree(arr){
    if(!Array.isArray(arr) || !arr.length) return;
    let map = {};
    arr.forEach(item => map[item.id] = item);

    let roots = [];
    arr.forEach(item => {
        const parent = map[item.parentId];
        if(parent){
            (parent.children || (parent.children=[])).push(item);
        }
        else{
            roots.push(item);
        }
    })

    return roots;
}

```
#### 控制请求并发树
```js
//递归方式
function handleFetchQueue(urls, max, callback) {
    let urlsCopy = [... urls];//防止影响外部urls变量
    function request() {
        function Handle () {
            count--;
            console.log('end 当前并发数为: '+count);
            if(urlsCopy.length) {//还有未请求的则递归
                request();
            } else if (count === 0) {//并发数为0则表示全部请求完成
                callback()
            }
        }
        count++;
        console.log('start 当前并发数为: '+count);
        //请求
        fetch(urlsCopy.shift()).then(Handle).catch(Handle);
        //并发数不足时递归
        count < max && request();
    }
    let count = 0;//几率并发数
    request();
}
```
#### 实现一个计算器
```js
var calculate = function(s) {
    let sign = '+', n = 0, c, stack = [];
    for (let i = 0; i <= s.length; i++) {
        c = s.charAt(i);
        if(c === ' ') continue;
        if(c <= '9' && c >= '0') {
            n = n * 10 + parseInt(c);
            continue;
        }
        if(sign === '+') {
            stack.push(n)
        } else if (sign === '-') {
             stack.push(-n)
        } else if(sign === '*') {
            stack.push(stack.pop() * n)
        } else if(sign === '/') {
            stack.push(Math.trunc(stack.pop() / n))
        }
        sign = c;
        n = 0
    }
    return stack.reduce((prev, cur) => prev + cur, 0)
};
```
#### 层序遍历
```js
var levelOrder = function(root) {
    const ret = [];
    if (!root) {
        return ret;
    }

    const q = [];
    q.push(root);
    while (q.length !== 0) {
        const currentLevelSize = q.length;
        ret.push([]);
        for (let i = 1; i <= currentLevelSize; ++i) {
            const node = q.shift();
            ret[ret.length - 1].push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
        
    return ret;
};
```
#### 最大深度
```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) {
        return 0;
    } else {
        const left = maxDepth(root.left);
        const right = maxDepth(root.right);
        return Math.max(left, right) + 1;
    }
};
```
##### 验证二叉搜索树
```js
var isValidBST = function (node) {
    var prev = -Infinity

    function inorder(node) {
        if (!node) {
            return true
        }

        var preResult = inorder(node.left)
        var inResult = node.val > prev
        prev = node.val
        var postResult = inorder(node.right)
        return preResult && inResult && postResult
    }

    return  inorder(node)
}
```
#### 深度优先
```js
function deepTraversal(node) {  
    var nodeList = [];  
    if (node) {  
        var stack = [];  
        stack.push(node);  
        while (stack.length != 0) {  
            var childrenItem = stack.pop();  
            nodeList.push(childrenItem);  
            var childrenList = childrenItem.children;  
            for (var i = childrenList.length - 1; i >= 0; i--)  
                stack.push(childrenList[i]);  
        }  
    }    
    return nodeList;  
}   
```
##### 前序遍历
```js
var inorderTraversal = function(root) {
    const res = [];
    const inorder = (root) => {
        if (!root) {
            return;
        }
        inorder(root.left);
        res.push(root.val);
        inorder(root.right);
    }
    inorder(root);
    return res;
};
```
##### dict
```js
function getWords(keys, dict) {
  const result = [];
  const loop = (suffix = '', depth = 0 ) => {
    let letters = dict[keys[depth]];
    for(let i = 0; i < letters.length; i++) {
       const nextSuffix = letters[i] + suffix;
       if(depth !== keys.length - 1) {
          loop(nextSuffix, depth++)
        } else {
            result.push(nextSuffix)
        }
    }
   }
  loop()
  return result;
}
```
