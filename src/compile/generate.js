
function genProps(attrs) {
    console.log('attrs', attrs);
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        console.log('attr', attr.name);
    }
}

export function generate(ast) {
    console.log('---generate ast---', ast);
    let code = `
        _c("${ast.tag}", ${
            ast.attrs.length ? `${genProps(ast.attrs)}` : undefined
        })
    `;
    return code;
};
