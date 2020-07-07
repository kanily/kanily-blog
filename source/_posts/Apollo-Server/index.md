---
title: Apollo-Server
date: 2020-07-06 17:42:18
---
[Apollo Server]:http://www.baidu.com
[full-stack-tutorial]:https://www.apollographql.com/docs/tutorial/introduction
[apollo-server]:https://www.npmjs.com/package/apollo-server
[graphql]:https://www.npmjs.com/package/graphql
### 简介
#### Apollo Server 是什么
 [Apollo Server] 是一种符合规范的开源 GraphQL服务器，能与任何GraphQL客户端（包括Apollo Client）兼容。并且可以使用任何来源数据去构建生产预发环境、生成 GraphQL API 文档的最佳方法。
 
 您可以将**Apollo Server**用作：
* 独立的GraphQL服务器，包括在serverless环境中
* 现有应用的Node.js中间件的扩展（例如Express或Fastify）的附件
* Federated data graph的网关

 **Apollo Server** 提供：
* 简单易用的设置，因此您的客户端开发人员可以快速开始获取数据
* 渐进式采用，使您可以根据需要添加功能
* 可以兼容任何数据源、构建工具、GraphQL客户端
* 生产就绪，使您能够更快地发布功能

### 开始使用 Apollo Server
 > 本教程主要引导你安装和配置Apollo Server。如果您刚刚开始使用GraphQL 或者 Apollo平台，我们推荐您先完成[full-stack-tutorial]。

本教程可以帮助您：
* 对GraphQL原理有基本了解
* 定义一个代表数据集结构的GraphQL **schema**
* 运行Apollo Server实例，使您可以依照你的schema执行查询

本教程假定您熟悉命令行和JavaScript，并且已安装了最新版本的Node.js（8+）。

#### 第一步：创建一个新的项目
1.在您首选的开发目录中，为新项目创建目录并 ``cd`` 进入该目录：
````
 mkdir graphql-server-example
 cd graphql-server-example
````
2.使用``npm``（或您喜欢的另一个包管理器，例如Yarn）初始化一个新的Node.js项目：
````
 npm init --yes
````
您的项目目录现在包含一个``package.json``文件。

#### 第二步：安装依赖项

运行Apollo Server的应用程序需要两个顶级依赖项：
* [apollo-server] 是Apollo Server本身的核心库，可帮助您定义数据的形状以及如何获取数据。
* [graphql] 是用于构建GraphQL Schema并对其执行查询的库。

运行以下命令以安装这两个依赖项并将它们保存在项目的``node_modules``目录中：
````
npm install apollo-server graphql
````
还要``index.js``在项目的根目录中创建一个空文件：
````
touch index.js
````
为简单起见，``index.js``将包含此示例应用程序的所有代码。

#### 第三步：定义您的GraphQL Schema
每个GraphQL服务器（包括Apollo服务器）都使用一种**Schema**来定义客户端可以查询的数据结构。在此示例中，我们将创建一个服务器，用于按书名和作者查询书籍集合。

``index.js``在您喜欢的编辑器中打开并将以下内容粘贴到其中：
````
const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
````

此代码段定义了一个简单有效的GraphQL Schema。客户将能够执行名为的查询books，并且我们的服务器将返回零个或多个Books 的数组。

#### 第四步：定义您的数据集

现在我们已经定义了数据的结构，我们可以定义数据本身了。Apollo服务器可以从您连接到的任何源（包括数据库，REST API，静态对象存储服务，甚至另一个GraphQL服务器）中获取数据。出于本教程的目的，我们将对一些示例数据进行硬编码。

将以下内容添加到的底部``index.js``：
````
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];
````
此代码段定义了客户端可以查询的简单数据集。注意，数组中的两个对象均与Book我们在架构中定义的类型的结构匹配。

#### 第五步：定义解析器
我们已经定义了数据集，但是Apollo Server不知道在执行查询时应该如何使用该数据集。为了解决这个问题，我们创建了一个 resolver。

让解析器告诉Apollo Server 如何获取与特定类型关联的数据。因为我们的Book数组是硬编码的，所以相应的解析器很简单。

将以下内容添加到的底部``index.js``：
````
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};
````
#### 第六步：创建ApolloServer实例
我们已经定义了架构，数据集和解析器。现在，我们只需要在初始化时向Apollo Server提供此信息即可。

将以下内容添加到的底部index.js：

````
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
````
#### 第七步：启动服务器
我们已经准备好启动服务器！从项目的根目录运行以下命令：
````
node index.js
````
您应该看到以下输出：
<pre>
🚀 Server ready at http://localhost:4000/
</pre>

#### 第八步：执行第一个查询
现在，我们可以在服务器上执行GraphQL查询。要执行查询时，我们将使用一个名为GraphQL Playground的工具。


{% note info %}

注意：如果将服务器部署到NODE_ENV设置为的环境，则production默认情况下将禁用GraphQL Playground和自省功能。要启用它们，您需要显式设置，playground: true并 introspection: true在的Constructor 选项ApolloServer内。

{% endnote %}


在服务器仍在运行的情况下，http://localhost:4000在浏览器中访问以打开GraphQL Playground。（在开发中运行GraphQL Playground时，Apollo Server会自动托管它。

GraphQL Playground UI包括
* 用于编写查询的文本区域（左侧）
* 用于执行查询的“播放”按钮（中间的三角形按钮）
* 用于查看查询结果的文本区域（右侧）
* 查看架构检查和生成的文档的视图（通过右侧的选项卡）

我们的服务器支持一个名为的查询``books``。让我们执行它！

这是用于执行查询的GraphQL 查询字符串``books``。
<pre>
{
  books {
    title
    author
  }
}
</pre>
将此字符串粘贴到左侧文本区域，然后单击“播放”按钮。结果（来自我们的硬编码数据集）显示在右侧：

GraphQL的最重要概念之一是我们可以选择仅查询 所需的字段。``author``从查询字符串中删除并再次执行。响应更新为仅包括``title``每本书的字段！
### 定义一个Schema
#### schema基础
GraphQL服务器使用**Schema**描述数据图的形状。Schema用来源于后端的数据字段来定义不同层级类型层次，schema还精确指定了能针对您的数据图、可用于客户端执行的query和mutation。
本文旨在介绍schema的基本构成以及如何为您的GraphQL服务器创建一个Schema。
##### schema定义语言
GraphQL规范包含一种人类可读的架构定义语言（或SDL），可用于定义Schema并将其存储为字符串

我们来定义两个对象类型：``Author`` 和 ``Book``
<pre>
type Book {
  title: String
  author: Author
}

type Author {
  name: String
  books: [Book]
}
</pre>

Schema 定义了类型的集合和类型的关系。在上面的例子中，每一个``Book``有一个``author``，每一个``Author``有``books``的列表。通过在整合的Schema中定义这些类型的关系，我们可以确保每一个客户端开发者可以准确查看可用数据，
并且通过单个优化查询请求该数据的特定子集

注意Schema并不关注数据的来源或者如何存储。它完全与实现无关。
##### 支持的类型
* 标量类型
* 对象类型
* Query 类型
* Mutation 类型
* 输入类型
下面分别详细介绍这些内容。

###### 标量类型
标量类型类似于编程语言中的基本类型。他们总是解析具体的数据。

GraphQL的默认标量类型为：
* ``Int``：有符号的32位整数
* ``Float``：带符号的双精度浮点值
* ``String``：UTF-8字符序列
* ``Boolean``：true或false
* ``ID（序列化为String）``：唯一标识符，通常用于重新获取对象或用作缓存的键。尽管将其序列化为String，但``ID``并不旨在使其易于理解。

这些原始类型涵盖了大多数用例。对于更特定的用例，您可以创建自定义标量类型。
###### 对象类型
在GraphQL模式中定义的大多数类型都是对象类型。对象类型包含字段的集合，每个字段可以是标量类型或其他对象类型。

两种对象类型可以彼此包含为字段，就像前面的示例Schema中那样：
<pre>
type Book {
  title: String
  author: Author
}

type Author {
  name: String
  books: [Book]
}
</pre>
###### Query 类型
Query类型定义根据您的数据图执行查询的入口点。它类似于对象类型，但其名称始终为Query。

Query类型的每个字段定义不同入口点的名称和返回类型。Query我们的Schema类型可能类似于以下内容：
<pre>
type Query {
  books: [Book]
  authors: [Author]
}
</pre>
这个查询类型定义了两个字段：``books`` 和 ``authors``。每个字段都返回一个列表
基于RestFul API，books 和 authors 很可能从不同的端点返回（eg： ``/api/books`` 和 ``/api/authors``。而GraphQL的灵活性能保证通过一个请求返回这两个数据。

**构造一个query**
当你开始根据你的数据图来创建查询时，这些查询必须与你在Schema中定义好的结构相匹配。

基于我们例子中Schema，客户端执行下面的查询操作，将会返回所有的books和author 的列表
<pre>
query GetBooksAndAuthors {
  books {
    title
  }

  authors {
    name
  }
}
</pre>
服务端会根据查询结构，将查询到的结果做如下返回
<pre>
{
  "data": {
    "books": [
      {
        "title": "Jurassic Park"
      },
      ...
    ],
    "authors": [
      {
        "name": "Michael Crichton"
      },
      ...
    ]
  }
}
</pre>
尽管在某些情况下获取这两个单独的列表可能很有用，但是客户可能更喜欢获取一个图书列表，其中每本书的作者都包含在结果中。
因为我们的Schema的Book类型具有type的author字段Author，所以客户端可以改为这样构造其查询：
<pre>
query GetBooks {
  books {
    title
    author {
      name
    }
  }
}
</pre>
再一次，我们的服务器将响应与查询结构匹配的结果：
<pre>
{
  "data": {
    "books": [
      {
        "title": "Jurassic Park",
        "author": {
          "name": "Michael Crichton"
        }
      },
      ...
    ]
  }
}
</pre>
###### Mutation 类型
Mutation类型在结构和目的与Query类型类似。Query类型定义了读操作的入口点，而Mutation类型定义了写操作的入口点。

Mutation类型的每个字段定义不同入口点的标志和返回类型。Mutation我们的示例Schema的类型可能类似于以下内容：

<pre>
type Mutation {
  addBook(title: String, author: String): Book
}
</pre>

这个mutation类型定义了一个可用的mutation，``addBook``。这个mutation接收两个参数（title和author）并且返回一个新的``Book``对象。正如你所期望的，这个``Book``对象遵循我们在schema中定义的结构。

**构造一个mutation**
和query一样，mutations也应与我们的schema 定义的类型相匹配。下面的mutation 创建了一个新的``Book``而且请求已创建的对象的特定字段作为返回值。
<pre>
mutation CreateBook {
  addBook(title: "Fox in Socks", author: "Dr. Seuss") {
    title
    author {
      name
    }
  }
}
</pre>
服务端将根据我们设计的mutation结构返回结果
<pre>
{
  "data": {
    "addBook": {
      "title": "Fox in Socks",
      "author": {
        "name": "Dr. Seuss"
      }
    }
  }
}
</pre>
一个客户端请求可能包含多个需要执行的mutation。为了避免出现竞态，mutations的执行是线性的（根据列出的顺序）

学习更多关于mutations的设计

###### 输入类型
输入类型是特殊的对象类型，它允许你传递一个对象作为参数进行query和mutation操作（与仅支持传标量类型相对）。输入类型可以帮助保持操作标识的整洁，就像在JavaScript函数中接受单个``options``对象比重复添加参数更干净一样。

看一下这个提交创建blog的mutation操作：
<pre>
type Mutation {
  createPost(title: String, body: String, mediaUrls: [String]): Post
}
</pre>

与接收三个参数相对，下面这个mutation只接受一个输入类型（包含这三个参数）。如果我们在将来决定增加一个参数会显得格外的方便，例如 ``author``

定义输入类型和对象类型很相似， 唯一不同就是我们需要使用 ``input``关键字
<pre>
type Mutation {
  createPost(post: PostAndMediaInput): Post
}

input PostAndMediaInput {
  title: String
  body: String
  mediaUrls: [String]
}
</pre>

输入类型不仅促进了PostAndMediaInput类型在我们Schema中的传递，而且提供了给字段增加注释空间，该描述可以自动的暴露给GraphQL可用工具。
<pre>
input PostAndMediaInput {
  "A main title for the post"
  title: String
  "The text body of the post."
  body: String
  "A list of URLs to render in the post."
  mediaUrls: [String]
}
</pre>

当多个操作需要完全相同的数据集合时，输入类型有时会很有用，但是您应该谨慎地复用它们。操作最终可能会在其所需的参数之间产生分歧。

**不要对query和mutation使用相同**的输入类型。在许多情况下，mutation所需的参数对于相应的query是可选的。
##### Schema的扩大
随着你的组织成长与演变，你的数据图也会相应的成长。新的产品和特性会引入新的Schema类型和字段。为了追踪这段时间的变化，你应该用版本控制去维护你的定义的Schema。

大多数的Schema的增加是安全且向后兼容的。但是，发生的变化产生的删除和修改行为对于一个或更多已存在的应用可能是破坏性的改变。下面的schema改变会具有潜在的破坏性：
* 删除一个类型或字段
* 重命名一个类型或字段
* 增加一个可为空字段
* 删除一个字段参数

诸如Apollo Studio[https://studio.apollographql.com/]之类的图形管理工具可帮助您了解潜在的Schema更改是否会影响您的正在使用客户端。Studio还通过操作安全列表提供字段级性能指标，Schema历史记录跟踪和高级安全性。

##### 文档字符串
GraphQL的Schema定义语言（SDL）支持启用markdown的文档字符串。这些可帮助数据图的使用者发现字段并学习如何使用它们。

以下代码段显示了如何同时使用单行字符串文字和多行块：
<pre>
"Description for the type"
type MyObjectType {
  """
  Description for field
  Supports **multi-line** description for your [API](http://example.com)!
  """
  myField: String!

  otherField(
    "Description for argument"
    arg: Int
  )
}
</pre>
文档完善的schema可以提升开发者体验，因为GraphQL开发者工具（例如Apollo VS Code extension 和 GraphQL Playground）可以根据我们提供的描述自动填写字段名。而且 Apollo Studio在使用其指标报告和客户端感知功能时，会在字段使用情况和性能详细信息的旁边显示说明

##### 命名规范
GraphQL规范是很灵活的而且不强制特定的命名规范。但是在组织中建立一个约定集合确保持续集成是很有用的。我们推荐如下：
* 字段名 使用``camelCase``命名。大部分GraphQL客户端都使用 JavaScript, Java, Kotlin, or Swift，我们都推荐使用``camelCase``命名变量名
* 类型名 使用``PascalCase``命名。这与上述语言中定义类的方式匹配
* 枚举名 使用``PascalCase``
* 枚举值 使用``ALL_CAPS``，因为它们类似于常量

这些约定有助于确保大多数客户端不需要定义额外的逻辑即可转换服务器返回的结果

##### query 驱动的Schema设计
当GraphQL schema的执行操作是依据客户端的需求而设计时，其功能最为强大。尽管您可以构造类型，使它们与后端数据存储的结构匹配，但您duck不必这样！单个对象类型的字段可以许多不同来源的数据所填充。**根据数据的使用方式（而不是数据的存储方式）设计Schema**。

如果您的数据存储区包含客户尚不需要的字段或关系，请从您的模式中将其忽略。向架构中添加新字段比删除某些客户端正在使用的现有字段更加容易和安全。

**query 驱动的Schema设计示例**
假设我们正在创建一个Web应用程序，其中列出了我们区域内的近期活动。我们希望该应用程序显示每个事件的名称，日期和位置，以及天气预报。

在这种情况下，我们希望Web应用程序能够执行具有类似于以下内容的结构的查询
<pre>
query EventList {
  upcomingEvents {
    name
    date
    location {
      name
      weather {
        temperature
        description
      }
    }
  }
}
</pre>
因为我们知道这是对我们的客户有帮助的数据结构，所以可以通知我们架构的结构：
<pre>
type Query {
  upcomingEvents: [Event]
}

type Event {
  name: String
  date: String
  location: Location
}

type Location {
  name: String
  weather: WeatherInfo
}

type WeatherInfo {
  temperature: Float
  description: String
}
</pre>
如上所述，可以使用来自不同数据源（或多个数据源）的数据填充这些类型中的每一个。例如，该Event类型的name和date可能会填充有我们后端数据库中的数据，而该WeatherInfo类型的可能会填充有来自第三方Weather API的数据。

##### 设计mutation
在GraphQL中，建议每个突变的响应都包含该突变修改的数据。这使客户端无需发送后续查询即可获取最新的持久化数据。

一个模式，支持更新email的User会包括以下内容：
<pre>
 type Mutation {
   # This mutation takes id and email parameters and responds with a User
   updateUserEmail(id: ID!, email: String!): User
 }
 
 type User {
   id: ID!
   name: String!
   email: String!
 }
</pre>
然后，客户端可以针对具有以下结构的架构执行变异：

<pre>
mutation updateMyUser {
  updateUserEmail(id: 1, email: "jane@example.com"){
    id
    name
    email
  }
}
</pre>
GraphQL服务器执行更改并为用户存储新的电子邮件地址后，它将使用以下内容响应客户端：
<pre>
{
  "data": {
    "updateUserEmail": {
      "id": "1",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
</pre>
虽然它不是强制性的突变的响应包括修改的对象，这样大大提高了客户端代码的效率。与查询一样，确定哪些突变对您的客户有用，这有助于告知架构的结构。
###### 构建突变反应
单个突变可以修改多种类型，或同一类型的多个实例。例如，使用户能够“喜欢”博客文章的突变可能会增加a的likes计数Post 并更新的likedPosts列表User。这使得突变响应的结构看起来像什么不太明显。

此外，由于突变会修改数据，因此比查询引起错误的可能性要高得多。变异甚至可能导致部分错误，在该错误中，成功修改了一条数据而没有修改另一条数据。无论错误的类型如何，以一致的方式将错误传达回客户端都是很重要的。

为帮助解决这两个问题，建议MutationResponse您在架构中定义一个接口，以及实现该接口的对象类型的集合（每个突变一个）。

下面是什么MutationResponse接口的样子：

<pre>
interface MutationResponse {
  code: String!
  success: Boolean!
  message: String!
}
</pre>

这是一个实现对象类型：
<pre>
type UpdateUserEmailMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  user: User
}
</pre>
我们的updateUserEmail突变将指定UpdateUserEmailMutationResponse为返回类型（而不是User），其响应的结构如下：
<pre>
{
  "data": {
    "updateUser": {
      "code": "200",
      "success": true,
      "message": "User email was successfully updated",
      "user": {
        "id": "1",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  }
}
</pre>

让我们按字段细分此字段：
code是代表数据传输状态的字符串。可以将其视为HTTP状态代码。
success是一个布尔值，指示突变是否成功。这允许客户端进行粗略检查，以了解是否存在故障。
message是描述突变结果的人类可读字符串。它打算在产品的UI中使用。
user由实现类型添加，UpdateUserEmailMutationResponse以将新更新的用户返回给客户端。

如果变异修改多种类型（例如我们前面的“喜欢”博客文章的示例），则其实现类型可以为每个被修改的类型包括一个单独的字段：
<pre>
type LikePostMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  post: Post
  user: User
}
</pre>
由于我们的假设likePost突变会同时修改a Post和a 上的字段User，因此其响应对象包括这两种类型的字段。响应具有以下结构：
<pre>
{
  "data": {
    "likePost": {
      "code": "200",
      "success": true,
      "message": "Thanks!",
      "post": {
        "id": "123",
        "likes": 5040
      },
      "user": {
        "likedPosts": ["123"]
      }
    }
  }
}
</pre>
遵循此模式可为客户提供有关每个请求的操作结果的有用的详细信息。有了这些信息，开发人员可以更好地应对其客户端代码中的操作失败。
#### 自定义标量类型和枚举类型
#### 联合与接口
#### 使用schema指令
#### 执行指令
