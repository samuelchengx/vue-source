// Vue.filter
// Vue.directive
// Vue.filter('filter', function () {
//
// });
//
// Vue.directive('bind', function () {
//
// });

import { mergeOptions } from '../util';

export function initGlobalApi(Vue) { // 全局api接收很多参数
    Vue.options = {}; // 所有的全局api 用户传递的参数 都会绑定到这个对象中
    // 提取公共的方法的逻辑，混合到每个每个实例中
    Vue.mixin = function (mixin) {
        console.log('mixin', mixin);
        this.options = mergeOptions(this.options, mixin);
        console.log('this.options', this.options);
    }
}