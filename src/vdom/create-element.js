export function createTextVNode(text) {
    // console.log('text', text);
    return vnode(undefined, undefined, undefined, undefined, text);
};

export function createElementVNode(tag, data= {}, ...children) {
    // console.log(tag, data, children);
    // vue中的key不会作为属性传递给组件
    let key = data.key;
    if(key){
        delete data.key;
    }
    return vnode(tag, data, key, children);
};

// 虚拟节点 产生一个对象 描述dom结构
// ast 描述 dom语法
function vnode(tag, data, key, children, text) {
    return{
        tag,
        data,
        key,
        children,
        text
    }
}