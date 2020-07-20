import {parseHTML} from './parser'

export function compileToFunctions (template) {
    // console.log('template', template);
    parseHTML(template);
    // 实现模版的编译
    // 模版编译原理
    // 1、先把代码转换成ast语法树 (1) parse解析 正则
    // 2、标记静态树 <span>123</span> (2) 树的遍历标记 makeup
    // 3、通过ast产生的语法树 生成代码 => render (3) codegen


}