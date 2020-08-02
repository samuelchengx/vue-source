import { isObject } from './../util';
import { ArrayMethods } from './array';
import Dep from "./dep";

// es6类实现
class Observer {
    constructor(data) {
        // 数据上可以获取到__ob__属性,保存observe的实例
        // 递归调用不会遍历不可枚举类型的属性
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
            configurable: false,
            value: this
        });
        // data.__ob__ = this;
        // 对数组索引进行拦截 性能差而且直接更改索引的方式(a[10] = 100)并不多
        if(Array.isArray(data)) {
            // vue对数组进行处理 数组使用重写数组的方式 函数劫持
            // 改变数组的方法
            data.__proto__ = ArrayMethods; // 通过原型链向上查找的方式
            // arr = [{a: 1}] arr[0].a  = 100;
            this.observeArray(data);
        } else {
            this.walk(data);
        }
    }
    observeArray(data) {
        for (let i = 0; i < data.length; i++) {
            observe(data[i]);
        }
    }
    walk(data) {
        // 对象的循环 data= {name: 'samuelcheng'}
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        });
    }
}
// vue2的性能 递归重写get set  vue3使用proxy优化性能问题
// 定义响应式的数据变化
function defineReactive(data, key, value) {
    // 如果传入的值还是对象的话，递归循环操作
    observe(value);
    let dep = new Dep();
    // name.dep=[watcher] age.dep=[watcher] msg.dep=[watcher]
    // 渲染watcher中的deps [name.deps, age.dep, msg.dep]
    Object.defineProperty(data, key,{
        get() {
            // 取值的时候，就会给属性增加一个dep
            // dep要和全局变量上的watcher做一个对应关系
            if(Dep.target) {
                dep.depend(); // dep收集watcher
                // console.log('dep', key, dep);
            }
            return value;
        },
        set(v) {
            if(value == v) return;
            // 赋值vm.msg = {b: 200}为对象也需要监控一下
            observe(v);
            value = v;
            // 当数据更新时，自己对应的watcher需重新执行
            dep.notify();
        }
    });
}

export function observe(data) {
    // 对象就是defineProperty 来实现响应式原理
    // 如果数据不是对象或者为null 那就不用监控了
    if(!isObject(data)) {
        return;
    }
    // 防止对象被重复观测
    if(data.__ob__ instanceof Observer) {
        return;
    }
    // console.log('---observe---', data);
    // 对数据进行defineProperty
    return new Observer(data); // 当前数据是否被观测过
}