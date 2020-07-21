// 工具方法
export function isObject(data) {
    return (typeof data === 'object') && data !== null;
};

const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'mounted',
    'beforeUpdate',
    'updated'
];
let strategys = [];

function mergeHook(parent, child) {
    if(child) {
        if (parent) {
            return parent.concat(child);
        } else {
            return [child]
        }
    } else {
        return parent;
    }
}

LIFECYCLE_HOOKS.forEach( hook => {
    strategys[hook] = mergeHook;
});

// strategys.data = function (parent, child) {
//     // 扩展不同属性的策略
// }
//
// strategys.computed = function (parent, child) {
//     // 扩展不同属性的策略
// }
//
// strategys.watch = function (parent, child) {
//     // 扩展不同属性的策略
// }

export function mergeOptions(parent, child) {
    console.log(parent, child);
    const options = {};
    // 如果父亲和儿子里都有一个属性 这个属性不冲突
    for(let key in parent) { // 处理父亲的所有属性
        mergeField(key);
    }
    for(let key in child) { // 处理儿子的所有属性,如果父亲有值，在上面已经处理完毕
        if(!parent.hasOwnProperty(key)){
            mergeField(key);
        }
    }
    function mergeField(key) {
        // 两个组件间data是函数
        // 写代码时忌讳 各种if else
        // 使用策略模式
        if(strategys[key]) {
            // 这里是merge hook的逻辑
            options[key] = strategys[key](parent[key], child[key]);
        } else if (isObject(parent[key]) && isObject(child[key])) {
            // options[key] = {
            //     ...parent[key],
            //     ...child[key]
            // }
            options[key] = Object.assign(parent[key], child[key]);
        } else {
            // if(child[key]){
            //     options[key] = child[key]; // 用儿子的值覆盖父亲的值
            // } else {
            //     options[key] = parent[key];
            // }
            options[key] = child[key] || parent[key];
        }
    }
    return options;
}