function FiberNode (
    tag: WorkTag,
    pendingProps: mixed,
    key: null | string,
    mode: TypeOfMode
) {
 // 作为静态数据结构的属性
    this.tag = tag; // 对应的组件类型 Function/Class/Host
    this.key = key; // key 属性
    this.elementType = null; //大部分情况相同，某些情况不同，比如FunctionComponent使用React.memo 包裹
    this.type =null; // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
    this.stateNode = null; // Fiber对应的真实Dom节点

    //用于连接其他fiber节点形成Fiber树

    // 指向父节点
    this.return = null;
    // 指向子fiber节点
    this.child = null;
    // 指向右边第一个兄弟Fiber节点
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    // 作为动态的工作单元的属性
    // 保存本次更新造成的状态改变相关信息
    this.pendingProps = pendingProps;
    this.memorizedProps = null;
    this.updateQueue = null;
    this.memorizedState = null;
    this.dependencies = null;

    this.mode = mode;

    this.effectTag = NoEffect;
    this.nextEffect = null;
    // 保存本次更新会造成的DOM操作
    this.firstEffect = null;
    this.lastEffect = null;

    // 调度优先级相关
    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    // 指向该fiber在另一次更新时对应的fiber
    this.alterate = null
}

function beginWork(
    current: Fiber | null,
    workInProgress: Fiber | null,
    renderLanes: Lanes
) : Fiber | null {
    // update时，如果current存在可能会有优化路径， 可能复用current
    if (current !== null) {
        const oldProps = current.memorizedProps;
        const newProps = current.pendingProps;
        if (oldProps !== newProps ||
            hasLegacyContentChanged() ||
            (__DEV__ ? workInProgress.type !== current.type : false)
        ) {
            didReceiveUpdate = true;
        } else if (!includesSomeLanes(renderLanes, updateQueue)) {
            didReceiveUpdate = false;
            switch (workInProgress) {
                // 省略处理
            }
        } else {
            didReceiveUpdate = false;
        }
        return bailoutOnAlreadyFinishedWork(
            current,
            workInProgress,
            renderLanes
        )
    } else {
        didReceiveUpdate = false;
    }
    // mount时：根据不同的tag类型创建不同的Fiber类型
    switch(workInProgress.tag) {
        case IndeterminateComponent:
            // 省略
        case LazyComponent:
            // 省略
        case ClassComponent:
            // 省略
        case FunctionComponent:
            // 省略
        case ClassComponent:
            // 省略
        case HostRoot:
            // 省略
        case HostComponent:
            // 省略
        case HostTest:

    } 
    
}

export function reconcileChildren (
    current: Fiber | null,
    workInProgress: Fiber,
    nextChildren: any,
    renderLanes: Lanes
) {
    if(current === null) {
        // 对于mount的组件
        workInProgress.child = mountChildFibers(
            workInProgress,
            null,
            nextChildren,
            renderLanes
        )
    } else {
        // 对于update的组件
        workInProgress.child = reconcileChildrenFibers(
            workInProgress,
            current.child,
            nextChildren,
            renderLanes
        )
    }
}

function completeWork(
    current: Fiber | null,
    workInProgress: Fiber,
    renderLanes: Lanes
) : Fiber | null {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case HostComponent: {
            popHostContext(workInProgress);
            const rootContainerInstance = getRootHostContainber();
            const type = workInProgress.type;
            // 判断该Fiber节点是否存在的对应的DOM节点
            if (current !== null && workInProgress.stateNode !== null) {
                // update 的情况
                updateHostComponent(
                    current,
                    workInProgress,
                    type,
                    newProps,
                    rootContainerInstance
                )
            } else {
                // mount 的情况
                const currentHostContext = getHostContext();
                // 为fiber创建对应的DOM的节点
                const instance = createInstance(
                    type,
                    newProps,
                    rootContainerInstance,
                    currentHostContext,
                    workInProgress
                );
                // 将子孙DOM节点插入刚生成的DOM节点中
                appendAllChildren(instance, workInProgress, false, false);
                // DOM节点赋值给fiber.stateNode
                workInProgress.stateNode = instance;
                //与update逻辑中updateHost类似处理props的过程
                if(
                    finallyInitialChidren(
                        instance,
                        type,
                        newProps,
                        rootContainerInstance,
                        currentHostContext
                    )
                ) {
                    markUpdate(workInProgress);
                }

            }
        }
    }
}

const update: Update<*> = {
    eventTime,
    lane,
    suspenseConfig,
    tag: UpdateState, // 更新的类型，包括UpdateState， ReplaceStae, ForceUpdate, CaptureUpdate
    payload: null, // 更新挂载数据，不同类型组件挂在数据不一样， 对于ClassComponent, payload 为setState的第一个传参
    callback: null

    next: null
}

const queue: UpdateQueue<State> = {
    baseState: fiber.memorizedState, // 本次更新前该Fiber节点的State， Update基于该State计算更新后的state
    firstBaseUpdate: null, // 本次更新前该Fiber节点已经保存的Update。以链表形式存在，链表头为firstBaseUpdate，
    lastBaseUpdate: null, // 链表尾为lastBaseUpdate， 之所以产生该Fiber节点内就存在Update，是由于某些Update优先级较低 所以在上次render阶段由Update计算被跳过
    shared: {
        pending: null // 触发更新时，产生的Update会保存在share.pending 中形成单项环状链表。当由Update计算state时这个环会被剪开并链接在lastBaseUpdate后面
    },
    effects: null
}

export function createFiberRoot (
    containerInfo: any,
    tag: RootTag,
    hydrate: Boolean,
    hydrationCallback: null | SuspenseHydrationCallbacks,
): FiberRoot {
    // 创建fiberRootNode
    const root: Fiber = (new FiberRootNode(containerInfo, tag, hydrate): any);

    // 创建rootFiber
    const uninitailizedFiber = createHostRootFiber(tag);

    // 链接rootFiber和fiberRootNode
    root.current= uninitalizedFiber;
    uninitalizedFiber.stateNode = root;

    return root;
}


function dispatchAndLog(store, action) {
    console.log('dispatching', action);
    store.dispatch(addTdo('Use Redux'));
    console.log('next state', store.getState());
}

const next = store.dispatch
store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
}

function patchStoreToAddLogging(store) {
    const next = store.dispatch
    // store.dispatch = function dispatchAndLog(action) {
    //     console.log('dispatching', action);
    //     let result = next(action);
    //     console.log('next state', store.getState());
    //     return result;
    // }
    return function dispatchAndLog() {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result;
    }
}

function patchStoreToAddCrashReporting(store) {
    const next = store.dispatch
    store.dispatch = function dispatchAndReportErrors(action) {
        try {
            return next(action)
        } catch (err) {
            console.log('捕获一个error', err);
            Raven.captureException(err, {
                extra: {
                    action,
                    state: store.getState()
                }
            })
            throw err;
        }
    }
}

function applyMiddlewareByMonkeyPatch(store, middlewares) {
    middlewares = middlewares.slice();
    middlewares.reverse();
    let dispatch = store.dispatch
    middlewares.forEach(middleware => {
        store.dispatch = middleware(store)(dispatch)
    })
    return Object.assign({}, store, {dispatch})
}

function logger(store) {
    return function warpDsipatchToAddLogging(next) {
        return function dispatchAndLog(action) {
            console.log('dispatching');
            let result = next(action);
            console.log('next state', store.getState());
            return result;
        }
    }
}
const logger = store => next => action => {
    console.log('dispatching');
    let result = next(action);
    console.log('next state', store.getState());
    return result;
}

/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    const map = {
        I : 1,
        IV: 4,
        V: 5,
        IX: 9,
        X: 10,
        XL: 40,
        L: 50,
        XC: 90,
        C: 100,
        CD: 400,
        D: 500,
        CM: 900,
        M: 1000
    };
    let ans = 0;
    for(let i = 0;i < s.length;) {
        if(i + 1 < s.length && map[s.substring(i, i+2)]) {
            ans += map[s.substring(i, i+2)];
            i += 2;
        } else {
            ans += map[s.substring(i, i+1)];
            i ++;
        }
    }
    return ans;
};

const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: 'd',
        filename: 'main.js'
    }
}

const fs = require('fs');
const path = require('path')
const parser = require('@babel/parser');
const options = require('webpack.config')
const traverse = require('@babel/traverse').defaut
const { transformFromAst } = require('@babel/core')

const Parse = {
    getAst: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8');
        // 将文件内容转换为AST抽象语法树
        return parser.parser(content, {
            sourceType: 'moudle'
        })
    },
    getDependecies: (ast, filename) => {
        const dependencies = {};
        // 遍历所有的import模块，存入dependecies
        traverse(ast, {
            // 类型为ImportDeclaration的AST节点（即为import语句)
            ImportDecalaration({ node }) {
                const dirname = path.dirname(filename);
                // 保存依赖模块路径，之后生成依赖关系图需要用到
                const filepath = './' + path.join(dirname, node.source.value);
                dependencies[node.source.value] = filepath;
            }
        })
        return dependencies;
    },
    getCode: ast => {
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        })
        return code;
    }
}

class Compiler {
    constructor(options) {
        const { entry, output } = options;
        // 入口
        this.entry = entry;
        // 出口
        this.output = output;
        // 模块
        this.moudles = [];
    }
    // 构建启动
    run() {
        const info = this.build(this.entry);
        this.modules.push(info)
        this.modules.forEach((dependencies) => {
            // 判断是否有依赖项递归 解析所有的依赖项
            if(dependencies) {
                for(const dependency in dependencies) {
                    this.modules.push(this.build(dependency))
                }
            }
        })
        // 生成依赖关系图
        const dependencyGraph = this.module.reduce((graph, item)= ({
            ...graph,
             // 使用文件路径作为每个模块的唯一标识符,保存对应模块的依赖对象和文件内容
            [item.filename]: {
                dependencies: item.dependencies,
                code: item.code
            }
        }),
        {}
        )
        this.generate(dependencyGraph);
    }

    build(filename) {
        const { getAst, getDependecies, getCode } = Parser
        const ast = getAst(this.entry);
        const dependencies = getDependecies(this.entry);
        const code = getCode(ast);
        return {
            filename,
            dependencies,
            code
        }
    }
    // 重写 require 函数， 输出bundle
    generate() {
        const filepath = path.join(this.output.path, this.output.filename);
        const bundle = `(function(graph){
            function require(moulde) {
                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath])
                }
                var exports = [];
                (function(require, exports, code){
                    eval(code)
                })(localRequire, exports, graph[module].code)
                return exports
            }
            require('${this.entry}')
        })(${JSON.stringify(code)})`
        // 把文件写入文件系统
        fs.writeFileSync(filepath, bundle, 'utf-8')
    }
}

class Event {
    constructor() {
        this.handlers = {}
    }

    on = (eventName, cb) => {
        const eventCallbackStack = this._getHandler(eventName).callbackStack;
        callbackStack.push(cb)
    }
    emit = (eventName, ...args) => {
        if(this.handlers[eventName]) {
            this.handlers[eventName].eventCallbackStack.forEach(() => {
                cb.call(cb, ...args);
            })
        }
        if(this.handlers[eventName].isOnce) {
            this.off(eventName)
        }
    }

    off = (eventName) => {
        if(this.handlers[eventName]) {
            delete this.handlers[eventName];
        }
    }

    once = () => {
        const eventCallbackStack = this._getHandler(eventName, true).callbackStack;
        callbackStack.push(cb)
    }

    _getHandler = (eventName, isOnce) => {
        if(!this.handlers[eventName]) {
            this.handlers[eventName] = {
                isOnce,
                callbackStack: []
            }
        }
        return this.handlers[eventName]
    }
}

const threeSum = function(nums) {
    let result = [];
    const len = nums.length;
    if(nums == null || len < 2) return result;
    // 排序
    for(let i = 0; i < len; i++) {
        // 如果当前数字大于0， 则三数之和一定大于0， 所以结束循环
        if(nums[i] > 0) break;
        if(i > 0 && nums[i] == nums[i-1]) continue; // 去重
        let left = i + 1;
        let right = len - 1;
        while(left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while(left < right && nums[left] == nums[left + 1]) left++;
                while(left < right && nums[right] == nums[right + 1]) right--;
                left++;
                right++
            } else if(sum > 0) {
                right--;
            } else {
                left++
            }
        }
        
    }
    return result;
}