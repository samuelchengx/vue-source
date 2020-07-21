class Watcher {
    constructor(vm, exprOrfn, cb, options) {
        // console.log('Watcher', vm, exprOrfn);
        exprOrfn();
    }
}

export default Watcher;