/*
* 数组的扁平化
* 已知如下数组：var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
* 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
* */
Array.prototype.flat = function (arr, result) {
  result
  arr.forEach((item) => {
    Array.isArray(item) ? arguments.callee(item) : item.push(newArr)
  })
  return newArr
}
var levelOrder = function(root) {
  const ret = [];
  if (!root) {
      return ret;
  }

  const q = [];
  q.push(root);
  while (q.length !== 0) {
      const currentLevelSize = q.length;
      ret.push([]);
      for (let i = 1; i <= currentLevelSize; ++i) {
          const node = q.shift();
          ret[ret.length - 1].push(node.val);
          if (node.left) q.push(node.left);
          if (node.right) q.push(node.right);
      }
  }
      
  return ret;
};