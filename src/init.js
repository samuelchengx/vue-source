import {initState} from './state'

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // vue的内部 $options 就是用户传递的所有参数
        const vm = this;
        vm.$options = options; // 用户传入的参数
        // options.data props computed watch
        initState(vm); // 初始化状态
    }
}