// 字母a-zA-Z_ - . 数组小写字母 大写字母
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配不捕获   <aaa:aaa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 闭合标签 </xxxxxxx>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// <div aa   =   "123"  bb=123  cc='123'
// 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
// <div >   <br/>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
// 匹配动态变量的  +? 尽可能少匹配
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function parseHTML(html) {

    function start(tagName, attr) {
        
    }
    
    function end() {

    }

    function chars() {

    }

    // 根据 html 解析成树结构  </span></div>
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            const startTagMatch = parseStartTag();
            // 开始标签
            if(startTagMatch){
                // console.log('开始', startTagMatch);
            }
            const endTagMatch = html.match(endTag);
            // 结束标签
            if(endTagMatch){
                advance(endTagMatch[0].length);
                // console.log('开始', endTagMatch);
            }
        }
        // 如果不是0 说明是文本
        let text;
        console.log('textEnd', html, textEnd);
        if(textEnd >= 0){
            text = html.substring(0,textEnd); // 是文本就把文本内容进行截取
            console.log(text);
        }
        if(text){
            advance(text.length); // 删除文本
        }

    }
    function advance(n) {
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen); // 匹配开始标签
        if (start) {
            const match = {
                tagName: start[1], // 匹配到的标签名
                attrs: []
            }
            advance(start[0].length);
            let end, attr;
            while (
                !(end = html.match(startTagClose))
                && (attr = html.match(attribute))
            ) {
                // console.log('end, attr', end, attr);
                advance(attr[0].length);
                match.attrs.push(
                    { name: attr[1],
                        value: attr[3] || attr[4] || attr[5]
                    });
            };
            // console.log('match', match);
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }
}