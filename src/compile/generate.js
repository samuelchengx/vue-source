// 匹配动态变量的  +? 尽可能少匹配
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    let str = "";
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if(attr.name === 'style'){
            let obj = {};
            attr.value.split(";").forEach(item=>{
                let [key, value] = item.split(":");
                obj[key] = value;
            });
            attr.value = obj; // 将原来的字符串换成格式化后的对象
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0, -1)}}`;
}

function gen(node) {
    if(node.type === 1) {
        return generate(node);
    } else {
        // 文本处理
        let text = node.text;
        if(!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`;
        } else {
            let tokens = []; // 每次正则使用后 需重新指定lastIndex
            let lastIndex = defaultTagRE.lastIndex = 0;
            let match, index;
            while (match = defaultTagRE.exec(text)) {
                index = match.index;
                // 通过lastIndex index
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length;
            }
            if(lastIndex < text.length){
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            // console.log('tokens', tokens);
            return  `_v(${tokens.join('+')})`
        }
        // _v(helloworld {{msg}} aa {{bb}}) => _v('helloworld' + _s(msg) + 'aa' + _s(bb));

    }
}

function genChildren(el) { // <div><span></span>hello</div>
    const children = el.children;
    if(children.length){
        return children.map(c => gen(c)).join(',');
    } else {
        return false;
    }
}

export function generate(ast) {
    let children = genChildren(ast); // 生成子节点
    let code = `_c("${ast.tag}", ${
            ast.attrs.length ? `${genProps(ast.attrs)}` : undefined
        }${
            children.length ? `,${children}` : ''
        })`;
    // console.log('code', code);
    return code;
};

// 语法级别的编译