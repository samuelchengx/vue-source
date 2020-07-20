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

  var oldArrayMethods = Array.prototype;
  var ArrayMethods = Object.create(oldArrayMethods); // 改变原数组的七个方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    ArrayMethods[method] = function () {
      //函数劫持 AOP
      var ob = this.__ob__; // 当用户调用数组的时候，会先执行改造的逻辑，再执行数组默认的逻辑

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted; // push unshift splice 都会新增属性 【新增属性为对象】
      // 内部还对数组引用类型做了一次劫持

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 也是新增属性 可修改，可删，可增
          inserted = args.slice(2);
          break;
      }

      inserted && ob.observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 数据上可以获取到__ob__属性,保存observe的实例
      // 递归调用不会遍历不可枚举类型的属性
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      }); // data.__ob__ = this;
      // 对数组索引进行拦截 性能差而且直接更改索引的方式(a[10] = 100)并不多

      if (Array.isArray(data)) {
        // vue对数组进行处理 数组使用重写数组的方式 函数劫持
        // 改变数组的方法
        data.__proto__ = ArrayMethods; // 通过原型链向上查找的方式
        // arr = [{a: 1}] arr[0].a  = 100;

        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0; i < data.length; i++) {
          observe(data[i]);
        }
      }
    }, {
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
    } // 防止对象被重复观测


    if (data.__ob__ instanceof Observer) {
      return;
    } // console.log('---observe---', data);
    // 对数据进行defineProperty


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
  /**
   *
   *
   *
   * */

  // 字母a-zA-Z_ - . 数组小写字母 大写字母
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获   <aaa:aaa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  // 闭合标签 </xxxxxxx>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // <div aa   =   "123"  bb=123  cc='123'
  // 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  // <div >   <br/>

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  function parseHTML(html) {
    // ast语法树 表示html语法
    var root; // 树根

    var currentParent;
    var stack = []; // 用来判断标签是否正常闭合
    // 利用常见的数据结构解析标签
    // <div id="app" style="color: red;"><span>hello world {{msg}}</span></div>
    // {
    //     tag: 'div',
    //     type: 1,
    //     children: [],
    //     attrs: [{name: 'id', value:  'app'}, {name: 'style', value: 'color: red;'}],
    //     parent: null
    // }
    // vue2.0 只能有一个根节点 必须是html元素
    // stack = [divAstElement, spanAstElement]

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        attrs: attrs,
        children: [],
        parent: null,
        type: 1 // 1是普通元素 3是文本

      };
    }

    function start(tagName, attrs) {
      // 开始标签, 每次解析开始标签都会执行次方法
      // console.log('tagName, attr', tagName, attrs);
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
      console.log('start', root);
    }

    function end(tagName) {
      // 结束标签 确定父子关系
      console.log('tagName', tagName);
      var element = stack.pop();
      var parent = stack[stack.length - 1];

      if (parent) {
        element.parent = parent;
        parent.children.push(element);
      }
    }

    function chars(text) {
      // 文本
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    } // 根据 html 解析成树结构  </span></div>


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // 开始标签

        if (startTagMatch) {
          // console.log('startTagMatch', startTagMatch);
          start(startTagMatch.tagName, startTagMatch.attrs); // console.log('开始', startTagMatch);
        }

        var endTagMatch = html.match(endTag); // 结束标签

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[0]); // console.log('开始', endTagMatch);
        }
      } // 如果不是0 说明是文本


      var text = void 0;
      console.log('textEnd', html, textEnd);

      if (textEnd > 0) {
        text = html.substring(0, textEnd); // 是文本就把文本内容进行截取

        console.log(text);
        chars(text);
      }

      if (text) {
        advance(text.length); // 删除文本
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // 匹配开始标签

      if (start) {
        var match = {
          tagName: start[1],
          // 匹配到的标签名
          attrs: []
        };
        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // console.log('end, attr', end, attr);
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  function genProps(attrs) {
    console.log('attrs', attrs);

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      console.log('attr', attr.name);
    }
  }

  function generate(ast) {
    console.log('---generate ast---', ast);
    var code = "\n        _c(\"".concat(ast.tag, "\", ").concat(ast.attrs.length ? "".concat(genProps(ast.attrs)) : undefined, ")\n    ");
    return code;
  }

  function compileToFunctions(template) {
    // console.log('template', template);
    var ast = parseHTML(template); // 实现模版的编译
    // 模版编译原理
    // 1、先把代码转换成ast语法树 (1) parse解析 正则
    // 2、标记静态树 <span>123</span> (2) 树的遍历标记 makeup
    // 3、通过ast产生的语法树 生成代码 => render (3) codegen
    // console.log('---ast---', ast);
    // 代码生成
    // template => render 函数

    /**
     * render(){
     *      with(this._data){
     *          return _c('div', {id: 'app', style:{color: red}}, _c('span', undefined, _v(hello world + _s(msg))))
     *      }
     * }
     */
    // 核心思想字符串拼接

    var code = generate(ast);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options; // 用户传入的参数
      // options.data props computed watch

      initState(vm); // 初始化状态
      // 需要通过模版进行渲染

      if (vm.$options.el) {
        // 用户传入了el属性
        vm.$mount(vm.$options.el, vm);
      }
    };

    Vue.prototype.$mount = function (el) {
      // 可能是字符串 可能是dom对象
      var vm = this;
      el = document.querySelector(el); // 同时传入template 和 render, 默认采用render，抛弃template 如果都没传，默认使用id=app中的模版

      var opts = vm.$options;

      if (!opts.render) {
        var template = opts.template;

        if (!template && el) {
          // 使用外部模版
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        opts.render = render;
      } // 默认采用render
      // opts.render;

    };
  }

  function Vue(options) {
    // 内部初始化操作
    // console.log(options);
    this._init(options);
  } // Vue.prototype._init = function (opt) {}


  initMixin(Vue); // 添加原型方法

  return Vue;

})));
