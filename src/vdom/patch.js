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
                oldVnode.el.textContent = newVnode.text;
            }
        }
        // 一定是标签 标签名一致
        // 需要复用老的节点，替换掉老的属性
        let el = newVnode.el = oldVnode.el;
        // 更新属性 diff属性
        updateProperties(newVnode, oldVnode.data); // 属性更新完毕，当前树根更新完毕
        // 比对子节点
        let oldChildren = oldVnode.children || []; // 老的孩子
        let newChildren = newVnode.children || []; // 新的孩子
        // 新老都有才能diff
        // 老的有孩子 新的没孩子 直接删除
        // 新的有孩子 老的没孩子 直接插入
        if(oldChildren.length > 0 && newChildren.length > 0){
            // diff 两者都有孩子 不断比较孩子节点
            updateChildren(el, oldChildren, newChildren);
            // 通过比较老孩子和新孩子，操作el的孩子
        } else if(oldChildren.length > 0) {
            el.innerHTML = '';
        } else if(newChildren.length >0) {
            for (let i=0; i<newChildren.length; i++){
                let child = newChildren[i]; // 拿到单个孩子
                el.append(createElm(child)); // 浏览器自己优化
            }
        }
        return el;
    }
}

function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.key == newVnode.key) && (oldVnode.tag == newVnode.tag);
}
function updateChildren (parent, oldChildren, newChildren) {
    // vue2.0使用双指针方式进行比对
    // v-for要有key key可以标示元素是否发生变化 前后key相同，可以复用该元素
    let oldStartIndex = 0; // 老的节点索引
    let oldStartVnode = oldChildren[0]; // 老的开始
    let oldEndIndex = oldChildren.length-1; // 老的尾部索引
    let oldEndVnode = oldChildren[oldEndIndex]; // 获取老的子节点最后一个

    let newStartIndex = 0; // 新的节点索引
    let newStartVnode = newChildren[0]; // 新的开始
    let newEndIndex = newChildren.length-1; // 新的尾部索引
    let newEndVnode = newChildren[newEndIndex]; // 获取新的子节点最后一个
    
    function makeIndexByKey(children) {
        let map = {};
        children.forEach( (item, index) => {
            map[item.key] = index;
        });
        return map;
    }
    // 1.方案1 先开始从头部开始比较 O(n) 优化向后插入的逻辑
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if(!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex];
        } else if(!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex];
        }
        // 判断两个虚拟节点是否一致 用key+type
        if(isSameVnode(oldStartVnode, newStartVnode)){
            // 标签和key一致，但属性不一致
            patch(oldStartVnode, newStartVnode); //属性 + 递归比较
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
            // 指针++
        } else if(isSameVnode(oldEndVnode, newEndVnode)){
            // 2.方案2从尾部开始比较 头部不一致，尾部比较，优化向前插入
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex]; // 移动尾部指针
            newEndVnode = newChildren[--newEndIndex]; //
        } else if(isSameVnode(oldStartVnode, newEndVnode)){ // 正序 倒序 reverse sort
            // 3.方案3 头不一样 尾不一样 头移尾 倒序操作
            patch(oldStartVnode, newEndVnode);
            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 具备移动性
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if(isSameVnode(oldEndVnode, newStartVnode)){
            patch(oldEndVnode, newStartVnode);
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else {
            // 交叉比对
            let map = makeIndexByKey(oldChildren); // 根据老的孩子的key创建映射表
            let moveIndex = map[newStartVnode.key];
            if(moveIndex == undefined) { // 新元素 添加进去
                parent.insertBefore(createElm(newStartVnode) ,oldStartVnode.el);
            } else {
                let moveVnode = oldChildren[moveIndex];
                oldChildren[moveIndex] = null; // 占位，直接删除导致数组塌陷
                // 比对当前的元素的属性和孩子
                patch(moveVnode, oldStartVnode);
                parent.insertBefore(moveVnode.el, oldStartVnode.el);
            }
            newStartVnode = newChildren[++newStartIndex]; // 移动新的指针
        }
    }
    if(newStartIndex <= newEndIndex){
        for (let i = newStartIndex; i <= newEndIndex; i++ ) {
            // appendChild insertBefore
            let ele = newChildren[newEndIndex+1] == null ? null : newChildren[newEndIndex+1].el;
            // parent.appendChild(createElm(newChildren[i]));
            parent.insertBefore(createElm(newChildren[i]), ele);
        }
    }
    if(oldStartIndex <= oldEndIndex){ //说明新的循环完毕
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            
        }
    }
}