import {
    pushTarget,
    popTarget
} from './dep';

import { queueWatcher } from './scheduler';
// watcher id
let id = 0;
// 目前只有一个watcher

class Watcher {
    constructor(vm, exprOrfn, cb, options) {
        this.vm = vm;
        this.exprOrfn = exprOrfn;
        this.cb = cb;
        this.options = options;
        this.deps = []; // watcher存放所有的dep
        this.depId = new Set();
        if(typeof exprOrfn === 'function'){
            this.getter = exprOrfn;
        }
        this.id = id++;
        this.get();
    }
    get() {
        pushTarget(this); // 在取值之前，把watcher保存起来
        this.getter(); // 实现视图渲染 => 渲染取值
        popTarget(); // 删除watcher
    }
    addDep(dep) {
        // console.log(dep.id);
        let id = dep.id;
        if(!this.depId.has(id)) {
            this.depId.add(id);
            this.deps.push(dep);
            dep.addSub(this); // 让dep订阅watcher
        }
    }
    update() { //更新原理
        queueWatcher(this); // 将watcher存储起来
        // console.log('-----id-----', this.id);
        // this.get(); // 以前调用get方法是直接更新视图
    }
    run() {
        this.get();
    }
}

export default Watcher;