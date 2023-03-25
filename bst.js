class Queue {
  constructor() {
    this.arr = [];
  }
  dequeue() {
    return this.arr.pop();
  }
  enqueue(value) {
    this.arr.unshift(value);
  }
  isEmpty() {
    return this.arr.length === 0;
  }
}

/**
 * printer function
 */
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

class TreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  toString() {
    return `Root: ${this.data}\nLeft: ${this.left}\nRight: ${this.right}`;
  }
}

class Tree {
  /** @param {TreeNode} root */
  constructor(root) {
    this.root = root;
  }

  /** @param {any} value */
  find(value) {
    const queue = new Queue();
    let node = this.root;
    do {
      if (node.data === value) {
        return node;
      }
      if (node.left) {
        queue.enqueue(node.left);
      }
      if (node.right) {
        queue.enqueue(node.right);
      }

      node = queue.dequeue();
    } while (!queue.isEmpty());
    return null;
  }

  inOrder(callback, node = this.root) {
    if (node.left) {
      this.inOrder(callback, node.left);
    }
    callback(node);
    if (node.right) {
      this.inOrder(callback, node.right);
    }
  }

  preOrder(callback, node = this.root) {
    callback(node);
    if (node.left) {
      this.preOrder(node.left, callback);
    }
    if (node.right) {
      this.preOrder(node.right, callback);
    }
  }

  postOrder(callback, node = this.root) {
    if (node.left) {
      this.preOrder(node.left, callback);
    }
    if (node.right) {
      this.preOrder(node.right, callback);
    }
    callback(node);
  }

}

/**
 * @param {Array} arr
 * @returns {TreeNode}
 */
const buildTree = function (arr) {
  const mid = Math.floor(arr.length / 2);
  const node = new TreeNode(arr[mid]);
  if (mid >= 1) {
    node.left = buildTree(arr.slice(0, mid));
  }
  if (arr.length > mid + 1) {
    node.right = buildTree(arr.slice(mid + 1));
  }
  return node;
};

let p = [1, 5, 0, 9, 2, 14, 18, 6, 3];
const tree = new Tree(buildTree(p));
console.log(prettyPrint(tree.root));

console.log('Find: ', tree.find(8) + '\n');

console.log("Inorder:\n");
tree.inOrder((value) => console.log(value.toString()));

console.log("Preorder:\n");
tree.preOrder((value) => console.log(value.toString()));

console.log("Postorder:\n");
tree.postOrder((value) => console.log(value.toString()));