import {
    observe
} from './observe/index';

export function initState(vm) {
    const opts = vm.$options;
    if(opts.props) {
        initProps(vm);
    }
    if(opts.methods) {
        initMethod(vm);
    }
    if(opts.data) {
        initData(vm);
    }
    // computed watch ...
}

function initProps() {

}
function initMethod() {

}
function initData(vm) {
    // 数据响应式原理
    // console.log('---initData1---', vm.$options.data);
    let data = vm.$options.data; // 用户传入的数据
    data = typeof data === 'function' ? data.call(vm) : data;
    // console.log('---initData2---', data);
    // 观测数据
    observe(data);
}