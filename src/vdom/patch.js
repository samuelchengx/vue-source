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

export function createElm(vnode) { // 需要递归创建
    let { tag, children, data, key, text } = vnode;
    if (typeof tag == 'string') {
        // 元素 // 将虚拟节点和真实节点做一个映射关系 （后面diff时如果元素相同直接复用老元素 ）
        vnode.el = document.createElement(tag);
        updateProperties(vnode); // 跟新元素属性
        children.forEach(child => {
            // 递归渲染子节点 将子节点 渲染到父节点中
            vnode.el.appendChild(createElm(child));
        });
    } else {
        // 普通的文本
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

export function patch(oldVnode, newVnode) {
    const isRealElement = oldVnode.nodeType;
    if(isRealElement) {
        // 真实元素
        const oldEle = oldVnode;
        const parentElm = oldVnode.parentNode;
        let el = createElm(newVnode);
        // console.log('el',oldEle.nextSibling)
        parentElm.insertBefore(el, oldEle.nextSibling);
        parentElm.removeChild(oldEle);
        return el; // 渲染的真实dom
    } else {
        // dom diff算法  特点: 同层比较 O(n^3) O(n)
        // 不需要跨级比较
        // 两棵树要先比较树根一不一样，再去比子节点
        console.log('patch diff');
        if(oldVnode.tag !== newVnode.tag) { // 标签名不一致,两个不一样的节点
            oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
        }

    }
}