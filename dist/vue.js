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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 工具方法
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'mounted', 'beforeUpdate', 'updated'];
  var strategys = [];

  function mergeHook(parent, child) {
    if (child) {
      if (parent) {
        return parent.concat(child);
      } else {
        return [child];
      }
    } else {
      return parent;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strategys[hook] = mergeHook;
  }); // strategys.data = function (parent, child) {
  //     // 扩展不同属性的策略
  // }
  //
  // strategys.computed = function (parent, child) {
  //     // 扩展不同属性的策略
  // }
  //
  // strategys.watch = function (parent, child) {
  //     // 扩展不同属性的策略
  // }

  function mergeOptions(parent, child) {
    console.log(parent, child);
    var options = {}; // 如果父亲和儿子里都有一个属性 这个属性不冲突

    for (var key in parent) {
      // 处理父亲的所有属性
      mergeField(key);
    }

    for (var _key in child) {
      // 处理儿子的所有属性,如果父亲有值，在上面已经处理完毕
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      // 两个组件间data是函数
      // 写代码时忌讳 各种if else
      // 使用策略模式
      if (strategys[key]) {
        // 这里是merge hook的逻辑
        options[key] = strategys[key](parent[key], child[key]);
      } else if (isObject(parent[key]) && isObject(child[key])) {
        // options[key] = {
        //     ...parent[key],
        //     ...child[key]
        // }
        options[key] = Object.assign(parent[key], child[key]);
      } else {
        // if(child[key]){
        //     options[key] = child[key]; // 用儿子的值覆盖父亲的值
        // } else {
        //     options[key] = parent[key];
        // }
        options[key] = child[key] || parent[key];
      }
    }

    return options;
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

  function proxy(target, property, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[property][key];
      },
      set: function set(v) {
        target[property][key] = v;
      }
    });
  }

  function initData(vm) {
    // 数据响应式原理
    // console.log('---initData1---', vm.$options.data);
    var data = vm.$options.data; // 用户传入的数据
    // vm._data代表检测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // console.log('---initData2---', data);
    // 观测数据
    // 将数据全部代理到vm实例上

    for (var key in data) {
      proxy(vm, '_data', key);
    }

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
      stack.push(element); // console.log('start', root);
    }

    function end(tagName) {
      // 结束标签 确定父子关系
      // console.log('tagName', tagName);
      // <div><span></span> hello world! </div>
      // let element = stack.pop();
      // let parent = stack[stack.length -1];
      // if(parent){
      //     element.parent = parent;
      //     parent.children.push(element);
      // }
      // fix: 嵌套层级问题 parent => currentParent 改变父亲节点
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
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


      var text = void 0; // console.log('textEnd', html, textEnd);

      if (textEnd > 0) {
        text = html.substring(0, textEnd); // 是文本就把文本内容进行截取
        // console.log(text);

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

  // 匹配动态变量的  +? 尽可能少匹配
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = "";

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj; // 将原来的字符串换成格式化后的对象
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      // 文本处理
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = []; // 每次正则使用后 需重新指定lastIndex

        var lastIndex = defaultTagRE.lastIndex = 0;
        var match, index;

        while (match = defaultTagRE.exec(text)) {
          index = match.index; // 通过lastIndex index

          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        } // console.log('tokens', tokens);


        return "_v(".concat(tokens.join('+'), ")");
      } // _v(helloworld {{msg}} aa {{bb}}) => _v('helloworld' + _s(msg) + 'aa' + _s(bb));

    }
  }

  function genChildren(el) {
    // <div><span></span>hello</div>
    var children = el.children;

    if (children.length) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    } else {
      return false;
    }
  }

  function generate(ast) {
    var children = genChildren(ast); // 生成子节点

    var code = "_c(\"".concat(ast.tag, "\", ").concat(ast.attrs.length ? "".concat(genProps(ast.attrs)) : undefined).concat(children.length ? ",".concat(children) : '', ")"); // console.log('code', code);

    return code;
  }
   // 语法级别的编译

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

    var code = generate(ast); // 代码生成 => 拼接字符串

    code = "with(this){ return ".concat(code, " }");
    var render = new Function(code); // 相当于把字符串变成了函数
    // 注释节点 自闭合标签 事件绑定 class slot插槽
    // console.log('render', render);

    return render;
  }

  var Watcher = function Watcher(vm, exprOrfn, cb, options) {
    _classCallCheck(this, Watcher);

    // console.log('Watcher', vm, exprOrfn);
    exprOrfn();
  };

  function updateProperties(vNode) {
    var el = vNode.el;
    var newProps = vNode.data || {}; // console.log('updateProperties', el, newProps);

    for (var key in newProps) {
      if (key == 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function createElm(vNode) {
    // 递归创建
    // console.log(vNode);
    var tag = vNode.tag,
        children = vNode.children,
        data = vNode.data,
        key = vNode.key,
        text = vNode.text;

    if (typeof tag == 'string') {
      // 元素 虚拟节点和真实节点做一个映射关系(后面diff时直接使用老元素)
      vNode.el = document.createElement(tag); // 更新元素属性

      updateProperties(vNode);
      children.forEach(function (child) {
        // 递归渲染子节点 将子节点渲染到父节点中
        vNode.el.appendChild(createElm(child));
      });
    } else {
      // 普通文本
      vNode.el = document.createTextNode(text);
    }

    return vNode.el;
  }

  function patch(oldVnode, newVnode) {
    // console.log(oldVnode, newVnode);
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 真实元素
      var oldEle = oldVnode;
      var parentElm = oldVnode.parentNode;
      var el = createElm(newVnode); // console.log('el',oldEle.nextSibling);

      parentElm.insertBefore(el, oldEle);
      parentElm.removeChild(oldEle);
      return el; // 渲染的真实dom
    }
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // console.log('_update', vnode);
      var vm = this; // 将虚拟节点变成真实节点替换掉$el
      // 后续dom diff也会执行该方法

      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // console.log(vm, el);
    // vue在渲染过程中 会创建渲染watcher
    // watcher就是一个回调
    // vue是不是MVVM框架
    callHook(vm, 'beforeMount');

    var updateComponent = function updateComponent() {
      // 内部调用解析后的render方法 => 虚拟node
      // _render => options.render 方法
      // _update => 将虚拟dom变成真实dom
      vm._update(vm._render());
    }; // 每次数据变化就执行updateComponent 进行更新操作


    new Watcher(vm, updateComponent, function () {}, true); // vue响应式数据规则 数据变化，视图刷新

    callHook(vm, 'created');
  }
  function callHook(vm, hook) {
    var handles = vm.$options[hook];

    if (handles) {
      for (var i = 0; i < handles.length; i++) {
        handles[i].call(vm); // 所有的生命周期的this 指向的都是当前的实例
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this; // 这个options就包含了用户创建的实例时传入的所有属性

      vm.$options = mergeOptions(vm.constructor.options, options);
      vm.$options = options; // 用户传入的参数
      // options.data props computed watch

      callHook(vm, 'beforeCreate');
      initState(vm); // 初始化状态

      callHook(vm, 'created'); // 需要通过模版进行渲染

      if (vm.$options.el) {
        // 用户传入了el属性
        vm.$mount(vm.$options.el, vm);
      }
    };

    Vue.prototype.$mount = function (el) {
      // 可能是字符串 可能是dom对象
      var vm = this;
      el = vm.$el = document.querySelector(el); // 同时传入template 和 render, 默认采用render，抛弃template 如果都没传，默认使用id=app中的模版

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


      mountComponent(vm); // 组件的挂载流程
    };
  }

  function createTextVNode(text) {
    // console.log('text', text);
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function createElementVNode(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // console.log(tag, data, children);
    // vue中的key不会作为属性传递给组件
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children);
  }
  // ast 描述 dom语法

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._render = function () {
      // 调用vm自身的render方法
      // console.log('_render');
      var vm = this;
      var render = vm.$options.render;

      Vue.prototype._v = function (text) {
        // console.log('_v');
        return createTextVNode(text);
      };

      Vue.prototype._c = function () {
        // console.log('_c');
        return createElementVNode.apply(void 0, arguments);
      };

      Vue.prototype._s = function (val) {
        // console.log('_s');
        // 判断当前的值是否是对象
        return val == null ? '' : _typeof(val) ? JSON.stringify(val) : val;
      };

      var vnode = render.call(vm); // _c _v _s
      // console.log('vnode', vnode);

      return vnode;
    };
  }

  // Vue.filter
  function initGlobalApi(Vue) {
    // 全局api接收很多参数
    Vue.options = {}; // 所有的全局api 用户传递的参数 都会绑定到这个对象中
    // 提取公共的方法的逻辑，混合到每个每个实例中

    Vue.mixin = function (mixin) {
      console.log('mixin', mixin);
      this.options = mergeOptions(this.options, mixin);
      console.log('this.options', this.options);
    };
  }

  function Vue(options) {
    // 内部初始化操作
    // console.log(options);
    this._init(options);
  } // Vue.prototype._init = function (opt) {}


  initMixin(Vue); // 添加原型方法
  // Vue.prototype._init = function (opt) {}

  renderMixin(Vue);
  lifeCycleMixin(Vue); // 组件初始化
  // initGlobalApi 给构造函数扩展全局方法

  initGlobalApi(Vue);

  return Vue;

})));
