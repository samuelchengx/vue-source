let oldArrayMethods =  Array.prototype;

export let ArrayMethods = Object.create(oldArrayMethods);

// 改变原数组的七个方法
let methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

methods.forEach( methods => {
    ArrayMethods[methods] = function (...args) { //函数劫持 AOP
        // 当用户调用数组的时候，会先执行改造的逻辑，再执行数组默认的逻辑
        oldArrayMethods[methods].apply(this, args);
        // push unshift splice 都会新增属性 【新增属性为对象】
        // 内部还对数组引用类型做了一次劫持

    }
});

