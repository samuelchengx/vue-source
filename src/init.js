import {initState} from './state'

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // vue的内部 $options 就是用户传递的所有参数
        const vm = this;
        vm.$options = options; // 用户传入的参数
        // options.data props computed watch
        initState(vm); // 初始化状态
        // 需要通过模版进行渲染
        if(vm.$options.el) { // 用户传入了el属性
            vm.$mount(vm.$options.el);
        }
    };

    Vue.prototype.$mount = function (el) { // 可能是字符串 可能是dom对象
        el = document.querySelector(el);
        console.log(el);
        // 同时传入template 和 render, 默认采用render，抛弃template 如果都没传，默认使用id=app中的模版
        

    };
}