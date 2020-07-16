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

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 工具方法
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.walk(data);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 对象的循环 data= {name: 'samuelcheng'}
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }(); // vue2的性能 递归重写get set  vue3使用proxy优化性能问题
  // 定义响应式的数据变化


  function defineReactive(data, key, value) {
    // 如果传入的值还是对象的话，递归循环操作
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(v) {
        if (!value == v) {
          // 赋值vm.msg = {b: 200}为对象也需要监控一下
          observe(v);
          value = v;
        }
      }
    });
  }

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
    // vm._data代表检测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // console.log('---initData2---', data);
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
