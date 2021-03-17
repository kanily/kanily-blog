### 常见问题QA
#### React
##### React 合成事件
React 合成事件（SyntheticEvent）
是 React 模拟原生 DOM 事件所有能力的一个自定义事件对象，可以理解为浏览器原生事件的跨浏览器包装器。
它根据 W3C 规范 来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口。合成事件的原理是利用事件冒泡，通过 事件委托 把事件统一在
 document 这个 DOM 节点上。
React事件系统
 涉及到的主要类如下
ReactEventListener：负责事件注册和事件分发。React将DOM事件全都注册到document这个节点上，这个我们在事件注册小节详细讲。事件分发主要调用dispatchEvent进行，从事件触发组件开始，向父元素遍历。我们在事件执行小节详细讲。
ReactEventEmitter：负责每个组件上事件的执行。
EventPluginHub：负责事件的存储，合成事件以对象池的方式实现创建和销毁，大大提高了性能。
SimpleEventPlugin等plugin：根据不同的事件类型，构造不同的合成事件。如focus对应的React合成事件为SyntheticFocusEvent

* React组件上声明的事件最终绑定到了document这个DOM节点上，而不是React组件对应的DOM节点。故只有document这个节点上面才绑定了DOM原生事件，
  其他节点没有绑定事件。这样简化了DOM原生事件，减少了内存开销
* React以队列的方式，从触发事件的组件向父组件回溯，调用它们在JSX中声明的callback。也就是React自身实现了一套事件冒泡机制。
* React有一套自己的合成事件SyntheticEvent，不同类型的事件会构造不同的SyntheticEvent
* React使用对象池来管理合成事件对象的创建和销毁，这样减少了垃圾的生成和新对象内存的分配，大大提高了性能
##### React v16 解决了什么问题 
答：React 16 以前，在协调阶段阶段，由于是采用的递归的遍历方式，这种也被成为 Stack Reconciler。
这种方式有一个特点：一旦任务开始进行，就无法中断，那么 js 将一直占用主线程， 一直要等到整棵 Virtual DOM 树计算完成之后，
才能把执行权交给渲染引擎，那么这就会导致一些用户交互、动画等任务无法立即得到处理，就会有卡顿，非常的影响用户体验。
React 16，实现状态更新机制，支持不同任务的优先级，可中断和恢复，并且恢复后可复用之前的中间状态
##### React Fiber 是什么
答： React Fiber 是一种基于浏览器的单线程调度算法
React Fiber 用类似``requestIdleCallback`` 的机制来做异步 diff。但是之前数据结构不支持这样的实现异步 diff，
于是 React 实现了一个类似链表的数据结构，将原来的 递归diff 变成了现在的 遍历diff，这样就能做到异步可更新了。
##### 聊一聊diff
* tree diff 只对比同一层的 dom 节点，忽略 dom 节点的跨层级移动
* component diff：如果不是同一类型的组件，会删除旧的组件，创建新的组件
* element diff：对于同一层级的一组子节点，需要通过唯一 id 进行来区分
##### setState 的 同步异步
* 合成事件中是异步
* 钩子函数中的是异步
* 原生事件中是同步
* setTimeout中是同步
##### setState 之后发生了什么
* 在 setState 的时候，React 会为当前节点创建一个 updateQueue 的更新列队。
* 然后会触发 reconciliation 过程，在这个过程中，会使用名为 Fiber 的调度算法，开始生成新的 Fiber 树
* 然后 React Scheduler 会根据优先级高低，先执行优先级高的节点，具体是执行 doWork 方法。
* 在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 Tag。
* 当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
* 当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
* 在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素。
###### React有哪些优化性能的手段?
1、类组件中的优化手段
* 使用纯组件 pureComponent
* 使用React.memo 高阶函数包装组件
* 使用shouldComponentUpdate 生命周期函数来自定义渲染逻辑
2.其他方式
* 列表中使用key
* 使用Suspense 和 lazy 进行懒加载
###### 什么是suspense组件
Suspense 让组件“等待”某个异步操作，直到该异步操作结束即可渲染。
###### react-redux 的实现原理？
通过 redux 和 react context 配合使用，并借助高阶函数，实现了 react-redux。
##### react组件逻辑复用的几种方式
* Render props
``render props``指在一种React组件之间使用一个值为函数的props共享代码的简单技术，具有render props的组件接收一个函数，该函数返回一个React元素并调用它而不是实现一个自己的渲染逻辑，render props是一个用于告知组件需要渲染什么内容的函数props，也是组件逻辑复用的一种实现方式，简单来说就是在被复用的组件中，通过一个名为render(属性名也可以不是render，只要值是一个函数即可)的prop属性，该属性是一个函数，这个函数接受一个对象并返回一个子组件，会将这个函数参数中的对象作为props传入给新生成的组件，而在使用调用者组件这里，只需要决定这个组件在哪里渲染以及该以何种逻辑渲染并传入相关对象即可
* mixin
* HOC
  属性代理
  反向继承
* Hook
##### react-router 原理
三个API的大致的技术实现如下:
* createBrowserHistory: 利用HTML5里面的history
* createHashHistory: 通过hash来存储在不同状态下的history信息
* createMemoryHistory: 在内存中进行历史记录的存储
#### 浏览器
##### 浏览器缓存
##### 浏览器渲染原理（从url输入到返回请求的过程）
* 首先进行url解析，根据dns系统进行IP查找（迭代查找）
  * 首先检查hosts文件是否有记录 有返回对应的ip
  * hosts文件没有检查本地的dns解析器有无缓存 有返回
  * 计算机上配置DNS服务器是否有缓存 有返回
  * 然后就去找根DNS服务器，直到查到域名对应的IP地址
* 建立TCP链接，HTTP协议的三次握手
  * 1) 客户端发送一个带 SYN=1，Seq=X 的数据包到服务器端口（第一次握手，由浏览器发起，告诉服务器我要发送请求了）
  * 2）服务器发回一个带 SYN=1， ACK=X+1， Seq=Y 的响应包以示传达确认信息（第二次握手，由服务器发起，告诉浏览器我准备接受了，你赶紧发送吧）
  * 3) 客户端再回传一个带 ACK=Y+1， Seq=Z 的数据包，代表“握手结束”（第三次握手，由浏览器发送，告诉服务器，我马上就发了，准备接受吧）
* 请求html文件了，如果html文件在缓存里面浏览器直接返回
  * 构建DOM树(DOM tree)：从上到下解析HTML文档生成DOM节点树（DOM tree），也叫内容树（content tree）；
  * 解析图片、CSS、JavaScript脚本等资源，这些资源是需要从网络或者缓存中获取，浏览器会逐一发起请求获取
  * 构建CSSOM(CSS Object Model)树：加载解析样式生成CSSOM树；
  * 执行JavaScript：加载并执行JavaScript代码（包括内联代码或外联JavaScript文件）
  * 构建渲染树(render tree)：根据DOM树和CSSOM树,生成渲染树(render tree)；
  * 渲染树：按顺序展示在屏幕上的一系列矩形，这些矩形带有字体，颜色和尺寸等视觉属性。
  * 布局（layout）：根据渲染树将节点树的每一个节点布局在屏幕上的正确位置；
  * 绘制（painting）：遍历渲染树绘制所有节点，为每一个节点适用对应的样式，这一过程是通过UI后端模块完成；
* 断开连接：TCP 四次挥手
  * 发起方向被动方发送报文，Fin、Ack、Seq，表示已经没有数据传输了。并进入 FIN_WAIT_1 状态。(第一次挥手：由浏览器发起的，发送给服务器，我请求报文发送完了，你准备关闭吧)
  *  被动方发送报文，Ack、Seq，表示同意关闭请求。此时主机发起方进入 FIN_WAIT_2 状态。(第二次挥手：由服务器发起的，告诉浏览器，我请求报文接受完了，我准备关闭了，你也准备吧)
  *  被动方向发起方发送报文段，Fin、Ack、Seq，请求关闭连接。并进入 LAST_ACK 状态。(第三次挥手：由服务器发起，告诉浏览器，我响应报文发送完了，你准备关闭吧)
  *  发起方向被动方发送报文段，Ack、Seq。然后进入等待 TIME_WAIT 状态。被动方收到发起方的报文段以后关闭连接。发起方等待一定时间未收到回复，则正常关闭。

#### Webpack
##### webpack 流程细节
初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
确定入口：根据配置中的 entry 找出所有的入口文件；
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
##### webpack 中，module，chunk 和 bundle 的区别是什么？
* 1. 对于一份同逻辑的代码，当我们手写下一个一个的文件，它们无论是 ESM 还是 commonJS 或是 AMD，他们都是 module ；
* 2. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 chunk 文件，webpack 会对这个 chunk 文件进行一些操作；
* 3. webpack 处理好 chunk 文件后，最后会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。
##### webpack 中，hash、chunkhash、contenthash 有什么不同？
* 1. hash 计算是跟整个项目的构建相关
* 2. 它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。
* 3. 将根据资源内容创建出唯一 hash，也就是说文件内容不变，hash 就不变。
##### Webpack 自动刷新
* webpack负责文件监听
在 Webpack 中监听一个文件发生变化的原理是定时的去获取这个文件的最后编辑时间，每次都存下最新的最后编辑时间，如果发现当前获取的和最后一次保存
的最后编辑时间不一致，就认为该文件发生了变化。 配置项中的 watchOptions.poll 就是用于控制定时检查的周期，具体含义是每隔多少毫秒检查一次。
当发现某个文件发生了变化时，并不会立刻告诉监听者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。
配置项中的 watchOptions.aggregateTimeout 就是用于配置这个等待时间。
* webpack 模块会在文件发生变化时告诉 webpack-dev-server 模块。
webpack-dev-sever 负责刷新浏览器
    * 控制浏览器刷新有三种方法：
        1.借助浏览器扩展去通过浏览器提供的接口刷新，WebStorm IDE 的 LiveEdit 功能就是这样实现的。
        2.往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
        3.把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。
##### Webpack HMR 原理
* 注入一个代理客户端用于连接 DevServer 和网页
##### tree-shaking
Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码。它依赖静态的 ES6 模块化语法。Webpack 只是指出了哪些函数用上了哪些没用上，要剔除用不上
的代码还得经过 UglifyJS 去处理一遍。 要接入 UglifyJS 也很简单，
#### 性能优化
