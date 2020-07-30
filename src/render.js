import {
    createTextVNode,
    createElementVNode
} from "./vdom/create-element";

export function renderMixin(Vue) {
    Vue.prototype._v = function(text){
        return createTextVNode(text);
    }
    Vue.prototype._c = function(){
        return createElementVNode(...arguments);
    }
    Vue.prototype._s = function(val){
        // 判断当前的值是否是对象
        return val == null ? '' : (typeof val ? JSON.stringify(val) : val);
    }

    Vue.prototype._render = function () {
        // 调用vm自身的render方法
        // console.log('_render');
        const vm = this;
        const { render } = vm.$options;
        // Vue.prototype._v = function(text){
        //     return createTextVNode(text);
        // }
        // Vue.prototype._c = function(){
        //     return createElementVNode(...arguments);
        // }
        // Vue.prototype._s = function(val){
        //     // 判断当前的值是否是对象
        //     return val == null ? '' : (typeof val ? JSON.stringify(val) : val);
        // }
        let vnode = render.call(vm); // _c _v _s
        return vnode;
    }
}