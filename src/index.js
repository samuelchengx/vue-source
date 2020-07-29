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

export default Vue;