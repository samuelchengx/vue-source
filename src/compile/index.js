const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function compileToFunctions (template) {
    console.log('template', template);
    // 实现模版的编译
    // 模版编译原理
    // 1、先把代码转换成ast语法树 (1) parse解析 正则
    // 2、标记静态树 <span>123</span> (2) 树的遍历标记 makeup
    // 3、通过ast产生的语法树 生成代码 => render (3) codegen






}