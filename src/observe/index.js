import { isObject } from './../util';

// es6类实现
class Observer {
    constructor(data) {
        this.walk(data);
    }
    walk(data) {
        
    }
}

export function observe(data) {
    // 对象就是defineProperty 来实现响应式原理
    // 如果数据不是对象或者为null 那就不用监控了
    if(!isObject(data)) {
        return;
    }
    console.log('---observe---', data);

    // 对数据进行defineProperty
    return new Observer(data); // 当前数据是否被观测过
}