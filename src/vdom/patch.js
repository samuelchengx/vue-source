function updateProperties(vNode, oldProps={}) {
    // 需要比较 vNode.data 和 oldProps的差异
    let el = vNode.el;
    let newProps = vNode.data || {};
    // 获取老的样式和新的样式差异，如果新的属性丢失 应该删除老的元素上的属性
    let newStyle = newProps.style || {};
    let oldStyle = oldProps.style || {};
    // console.log('updateProperties', el, newProps);
    for (let key in oldStyle) {
        if(!newStyle[key]){
            el.style[key] = ''; // 删除老的样式
        }
    }
    for (let key in oldProps) {
        if(!newProps[key]){
            el.removeAttribute(key); // 删除元素老的属性
        }
    }
    //其它情况直接覆盖
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
        // console.log('patch diff');
        if(oldVnode.tag !== newVnode.tag) { // 标签名不一致,两个不一样的节点
            oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
        }
        // 标签一致 div， 都是文本 tag: undefined
        if(!oldVnode.tag){ // 如果是文本 文本变化 直接用新文本替换掉老文本
            if(oldVnode.text !== newVnode.text) {
                oldVnode.text = newVnode.text;
            }
        }
        // 一定是标签 标签名一致
        // 需要复用老的节点，替换掉老的属性
        let el = newVnode.el = oldVnode.el;
        // 更新属性 diff属性
        updateProperties(newVnode, oldVnode.data); // 属性更新完毕，当前树根更新完毕
        
        return el;
    }
}