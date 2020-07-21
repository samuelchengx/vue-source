import {initState} from './state'
import { compileToFunctions } from './compile/index'
import { mountComponent } from './lifeCycle';
import { mergeOptions } from './util';
export function initMixin(Vue) {

    Vue.prototype._init = function (options) {
        // vue的内部 $options 就是用户传递的所有参数
        const vm = this;
        // 这个options就包含了用户创建的实例时传入的所有属性
        vm.$options = mergeOptions(vm.constructor.options, options);
        console.log(vm.$options, '---------');
        vm.$options = options; // 用户传入的参数
        // options.data props computed watch
        initState(vm); // 初始化状态
        // 需要通过模版进行渲染
        if(vm.$options.el) { // 用户传入了el属性
            vm.$mount(vm.$options.el, vm);
        }
    };
    Vue.prototype.$mount = function (el) { // 可能是字符串 可能是dom对象
        const vm = this;
        el = vm.$el = document.querySelector(el);
        // 同时传入template 和 render, 默认采用render，抛弃template 如果都没传，默认使用id=app中的模版
        const opts = vm.$options;
        if(!opts.render) {
            let template = opts.template;
            if(!template && el) { // 使用外部模版
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);
            opts.render = render;
        }
        // 默认采用render
        // opts.render;
        mountComponent(vm, el); // 组件的挂载流程
    };
}