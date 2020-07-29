let has = {}; // vue源码里有的时候去重用set，有的时候用对象去重
let queue = [];
// 队列是否正在等待更新
let pending  = false;
function flushSchedulerQueue() {
    for (let i=0; i < queue.length; i++) {
        let watcher = queue[i];
        watcher.run();
    }
    queue=[];
    has={};
}
// [flushSchedulerQueue, fn]
export function queueWatcher(watcher) {
    const id = watcher.id;
    if(has[id] == null){
        has[id] = true; // 如果没有注册过，就注册该watcher
        queue.push(watcher);
        // if(!pending){
        //setTimeout(()=>{
            // flushSchedulerQueue();
            // pending = true; // 正在刷新中
            // }, 0);
        // }
        // setTimeout(flushSchedulerQueue ,0);
        nextTick(flushSchedulerQueue); // flushSchedulerQueue调用渲染watcher
    }
}

let callbacks = []; // 先调用flushSchedulerQueue，再调用用户注册的函数
let lock = false;
function flushCallbackQueue() {
    callbacks.forEach(fn => fn());
    lock = false;
}
export function nextTick(fn) {
    callbacks.push(fn);
    if(!lock){
        setTimeout(()=>{
            flushCallbackQueue();
        }, 0);
        lock = true;
    }
}