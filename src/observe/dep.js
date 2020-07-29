
// 每个属性都有一个dep属性， dep存放着watcher
// 一个dep可能有多个watcher， 一个watcher可能被多个属性所依赖
// dep和watcher是一个多对对的关系
let id = 0;

class Dep {
    constructor() {
        this.id = id++;
        this.subs = [];
    }
    depend() {
        // 1.让dep记住watcher
        // 2.让watcher记住dep 双向记忆
        Dep.target.addDep(this); // 让watcher存储dep
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach( watcher =>{
            watcher.update();
        });
    }
}

Dep.target = null; // 默认为空
const stack = [];
export function pushTarget(watcher) {
    Dep.target = watcher;
    // stack.push(watcher);
}

export function popTarget(watcher) {
    Dep.target = null;
    // stack.pop();
    // Dep.target = stack[stack.length-1];
}

export default Dep;