let oldArrayMethods =  Array.prototype;
export let ArrayMethods = Object.create(oldArrayMethods);
// 改变原数组的七个方法
let methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
methods.forEach( method => {
    ArrayMethods[method] = function (...args) { //函数劫持 AOP
        const ob = this.__ob__;
        // 当用户调用数组的时候，会先执行改造的逻辑，再执行数组默认的逻辑
        let result = oldArrayMethods[method].apply(this, args);
        let inserted;
        // push unshift splice 都会新增属性 【新增属性为对象】
        // 内部还对数组引用类型做了一次劫持
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice': // 也是新增属性 可修改，可删，可增
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        inserted && ob.observeArray(inserted);
        return  result;
    }
});

