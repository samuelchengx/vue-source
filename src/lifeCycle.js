import  Watcher  from './observe/watcher';
import  { patch } from './vdom/patch';

export function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // console.log('_update', vnode);
        const vm = this;
        // 将虚拟节点变成真实节点替换掉$el
        // 后续dom diff也会执行该方法
        vm.$el = patch(vm.$el, vnode);
    }
}
export function mountComponent(vm, el) {
    // console.log(vm, el);
    // vue在渲染过程中 会创建渲染watcher
    // watcher就是一个回调
    // vue是不是MVVM框架
    const updateComponent = () => {
        // 内部调用解析后的render方法 => 虚拟node
        // _render => options.render 方法
        // _update => 将虚拟dom变成真实dom
        vm._update(vm._render());
    };
    // 每次数据变化就执行updateComponent 进行更新操作
    new Watcher(vm, updateComponent, ()=>{}, true);
    // vue响应式数据规则 数据变化，视图刷新
}