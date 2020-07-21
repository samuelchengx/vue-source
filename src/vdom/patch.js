
function updateProperties(vNode) {
    let el = vNode.el;
    let newProps = vNode.data || {};
    // console.log('updateProperties', el, newProps);
    for(let key in newProps) {
        if(key == 'style') {
            for(let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            }
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}

function createElm(vNode) { // 递归创建
    // console.log(vNode);
    let {tag, children, data, key, text} = vNode;
    if(typeof tag == 'string'){
        // 元素 虚拟节点和真实节点做一个映射关系(后面diff时直接使用老元素)
        vNode.el = document.createElement(tag);
        // 更新元素属性
        updateProperties(vNode);
        children.forEach( child => {
            // 递归渲染子节点 将子节点渲染到父节点中
            vNode.el.appendChild(createElm(child));
        });
    } else {
        // 普通文本
        vNode.el = document.createTextNode(text);
    }
    return vNode.el;
}

export function patch(oldVnode, newVnode) {
    // console.log(oldVnode, newVnode);
    const isRealElement = oldVnode.nodeType;
    if(isRealElement) {
        // 真实元素
        const oldEle = oldVnode;
        const parentElm = oldVnode.parentNode;
        let el = createElm(newVnode);
        // console.log('el',oldEle.nextSibling);
        parentElm.insertBefore(el, oldEle);
        parentElm.removeChild(oldEle);
        return el; // 渲染的真实dom
    } else {
        // dom diff算法

    }

}