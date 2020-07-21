import {
    createTextVNode,
    createElementVNode
} from "./vdom/create-element";

export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        // 调用vm自身的render方法
        // console.log('_render');
        const vm = this;
        const { render } = vm.$options;

        Vue.prototype._v = function(text){
            // console.log('_v');
            return createTextVNode(text);
        }
        Vue.prototype._c = function(){
            // console.log('_c');
            return createElementVNode(...arguments);
        }
        Vue.prototype._s = function(val){
            // console.log('_s');
            // 判断当前的值是否是对象
            return val == null ? '' : (typeof val ? JSON.stringify(val) : val);
        }
        let vnode = render.call(vm); // _c _v _s
        // console.log('vnode', vnode);
        return vnode;
    }
}