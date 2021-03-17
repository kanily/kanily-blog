## HTTP 简介
**HTTP** 
超文本传输协议，主要规定浏览器和服务器相互通信规则，它是基于TCP/IP通信协议来进行传递数据。对于
TCP协议来说，TCP协议是一套双向通讯通道，HTTP在TCP的基础上规定了Request和Reponse的模式。这个模式
决定了通讯必定是有浏览器发起的。
浏览器发起http请求， 首先建立TCP连接  也就是常说的三次握手， 接下来发起Http请求
一个http请求主要包括 请求行 请求头 请求正文
##### 请求行：请求地址、请求的方法（get， post、put、delete）、请求状态
* 2** 成功
#excerpt_link: Read More...
* 3** 重定向
    301 永久重定向
    302 临时重定向
    304 not modify
* 4** 客户端错误
    400 Bad request 请求中有语法错误
    401 Unauthorize 未被授权
    403 forbidden 禁止访问
    404 Not found 请求的页面不存在
* 5** 服务端请求错误
    500 服务端错误
    503 service unavailable
##### 请求头
 Accept 
 host 
 UserAgent
 cookie （key value domin expires size httponly）4k 最多可以有20个 默认到浏览器关闭
 connection keep-alive
##### 请求体
http 响应请求 
 响应行 
 响应体
  cache-control
  content-type
  status
  expires
  date
  Last-Modified
结束
断开 TCP 连接 四次挥手
## HTTPS = http + ssl
HTTPS 是使用加密通道来传输HTTP的内容，但是HTTPS首先与服务端建立一条TLS加密通道。TLS构于TCP协议之上对内容做一个次加密，
所以他主要有两个作用
* 确定请求目标服务器的身份
* 保证传输的数据不会被网络中间节点窃听或篡改
## HTTP2
是HTTP1.1的升级版本， 最大的改进点是
* 支持服务端推送
  服务端推送能够在客户端发送第一个请求到达服务端时，提前把一部分内容推送客户端，放入缓存之中，避免客户端请求顺序带来的并行度不高，
  从而导致性能问题
* 支持TCP连接复用
  TCP连接复用，则使用TCP连接来传输多个HTTP请求，避免TCP连接建立时的三次握手开销和初建TCP连接的传输窗口小的问题