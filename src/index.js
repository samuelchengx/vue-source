import { initMixin } from './init';
import { renderMixin } from './render';
import { lifeCycleMixin } from './lifeCycle';
import { initGlobalApi } from './global-api/index';
import {nextTick} from "./observe/scheduler";
function Vue(options) {
    // 内部初始化操作
    // console.log(options);
    this._init(options);
}
// Vue.prototype._init = function (opt) {}
initMixin(Vue); // 添加原型方法
// Vue.prototype._init = function (opt) {}
renderMixin(Vue);
lifeCycleMixin(Vue);
// 组件初始化
// initGlobalApi 给构造函数扩展全局方法
initGlobalApi(Vue);

Vue.prototype.$nextTick = nextTick;


// ---------------------diff---------------------
// diff是比较两个树的差异 (虚拟dom) 把前后的dom节点渲染成虚拟dom，通过虚拟节点比对，找到差异，更新真实的dom

import { compileToFunctions } from './compile/index';
import { createElm, patch } from './vdom/patch';
let vm1 = new Vue({
    data: function () {
        return {
            name: 'samuelcheng'
        }
    }
});
let vm2 = new Vue({
    data: function () {
        return {
            name: 'gina'
        }
    }
});

let render1 = compileToFunctions(`<div id="a" c="a" style="background: red;color: blue;">{{name}}</div>`);
let oldVnode = render1.call(vm1);
// let dom2 = render.call(vm2);
let realElement = createElm(oldVnode);
document.body.appendChild(realElement);

let render2 = compileToFunctions(`<div id="b" style="background: green;">{{name}}</div>`);
let newVnode = render2.call(vm2);
// console.log('newVnode', newVnode);
// 没有虚拟dom时和diff算法时，直接重新渲染，强制更新,没有复用老的dom
// diff 比对差异，再更新
// patch(realElement, newVnode);
setTimeout(() => {
    patch(oldVnode, newVnode); // 老的节点和新的节点比对
}, 1000);


export default Vue;