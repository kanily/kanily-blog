## 函数
### 如何定义函数
* 普通函数： 用*function*关键字定义的函数
  <pre>
    function foo () {

    }
  </pre>
* 箭头函数：用 => 运算符定义的函数
  <pre>
    const foo = () => {
        // code
    }
  </pre>
* 方法： 在class中定义的函数
  <pre>
    class C {
        foo () {
            // code
        }
    }
  </pre>
* 生成器函数： 用function* 定义的函数
  <pre>
    function* foo() {
        // code
    }
  </pre>
* 类：用class定义的类，实际上也是函数
   <pre>
    class Foo {
        constructor() {

        }
        // code
    }
  </pre>
* 其他： 异步函数： 普通函数、箭头函数和生成器函数前 增加async关键字
    <pre>
        async function foo() {

        }
        const foo = async () =>  {

        }
        async function* foo() {
                // code
        }
    </pre>