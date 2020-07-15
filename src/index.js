import { initMixin } from './init';
function Vue(options) {
    // 内部初始化操作
    // console.log(options);
    this._init(options);
}

initMixin(Vue); // 添加原型方法
// Vue.prototype._init = function (opt) {}

// 组件初始化


export default Vue;