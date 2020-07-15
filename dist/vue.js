(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  // 工具方法
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  var Observer = function Observer(data) {
    _classCallCheck(this, Observer);
  };

  function observe(data) {
    // 对象就是defineProperty 来实现响应式原理
    // 如果数据不是对象或者为null 那就不用监控了
    if (!isObject(data)) {
      return;
    }

    console.log('---observe---', data); // 对数据进行defineProperty

    return new Observer(data); // 当前数据是否被观测过
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    } // computed watch ...

  }

  function initData(vm) {
    // 数据响应式原理
    // console.log('---initData1---', vm.$options.data);
    var data = vm.$options.data; // 用户传入的数据

    data = typeof data === 'function' ? data.call(vm) : data; // console.log('---initData2---', data);
    // 观测数据

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options; // 用户传入的参数
      // options.data props computed watch

      initState(vm); // 初始化状态
    };
  }

  function Vue(options) {
    // 内部初始化操作
    // console.log(options);
    this._init(options);
  }

  initMixin(Vue); // 添加原型方法

  return Vue;

})));
