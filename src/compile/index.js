import {parseHTML} from './parser'
import { generate } from './generate';

export function compileToFunctions (template) {
    // console.log('template', template);
    let ast = parseHTML(template);
    // 实现模版的编译
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
    let code = generate(ast); // 代码生成 => 拼接字符串
    code = `with(this){ return ${code} }`;
    let render = new Function(code);  // 相当于把字符串变成了函数

    // 注释节点 自闭合标签 事件绑定 class slot插槽
    // console.log('render', render);
    return render;
}