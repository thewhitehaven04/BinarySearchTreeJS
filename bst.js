const { Queue } = require('./queue.js');

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

/**
 * @param {Array} arr
 * @returns {TreeNode}
 */
function buildTree(arr) {
  const mid = Math.floor(arr.length / 2);
  const node = new TreeNode(arr[mid]);
  if (mid >= 1) {
    node.left = buildTree(arr.slice(0, mid));
  }
  if (arr.length > mid + 1) {
    node.right = buildTree(arr.slice(mid + 1));
  }
  return node;
}

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
    const q = new Queue();
    q.enqueue(this.root);
    do {
      let node = q.dequeue();
      if (node.data === value) {
        return node;
      }
      if (node.left) {
        q.enqueue(node.left);
      }
      if (node.right) {
        q.enqueue(node.right);
      }
    } while (!q.isEmpty());
    return null;
  }

  levelOrder(callback) {
    const q = new Queue();
    q.enqueue(this.root);
    do {
      let node = q.dequeue();
      callback(node);
      if (node.left) {
        q.enqueue(node.left);
      }
      if (node.right) {
        q.enqueue(node.right);
      }
    } while (!q.isEmpty());
  }

  /**
   *
   * @param {function(TreeNode): any} callback
   * @param {TreeNode} node
   */
  inOrder(callback, node = this.root) {
    if (node.left) {
      this.inOrder(callback, node.left);
    }
    callback(node);
    if (node.right) {
      this.inOrder(callback, node.right);
    }
  }

  /**
   * @param {function(TreeNode): any} callback
   * @param {TreeNode} node
   */
  preOrder(callback, node = this.root) {
    callback(node);
    if (node.left) {
      this.preOrder(callback, node.left);
    }
    if (node.right) {
      this.preOrder(callback, node.right);
    }
  }

  /**
   * @param {function(TreeNode): any} callback
   * @param {TreeNode} node
   */
  postOrder(callback, node = this.root) {
    if (node.left) {
      this.postOrder(callback, node.left);
    }
    if (node.right) {
      this.postOrder(callback, node.right);
    }
    callback(node);
  }

  insert(value) {
    if (this.find(value))
      throw RangeError(
        'This Binary Search Tree implementation does not support repeated values',
      );

    let node = this.root;

    do {
      if (value < node.data) {
        if (node.left) {
          node = node.left;
        } else {
          node.left = new TreeNode(value);
          break;
        }
      } else {
        if (node.left) {
          node = node.right;
        } else {
          node.right = new TreeNode(value);
          break;
        }
      }
    } while (node);
  }

  delete(value) {
    this.inOrder((node) => {
      if (node.left && node.left.data === value) {
        let arr = [];
        this.inOrder((node) => {
          if (node.data !== value) {
            arr.push(node.data);
          }
        }, node.left);
        if (node.left.data === value) node.left = buildTree(arr);
      }
      if (node.right && node.right.data === value) {
        let arr = [];
        this.inOrder((node) => {
          if (node.data !== value) {
            arr.push(node.data);
          }
        }, node.right);
        if (node.right.data === value) node.right = buildTree(arr);
      }
    });
  }

  depth() {
    let _depth = 0;
    this.preOrder(() => {});
  }
}

let p = [1, 5, 0, 9, 2, 14, 18, 6, 3];
p.sort((a, b) => (a < b ? 1 : -1));

const tree = new Tree(buildTree(p));
prettyPrint(tree.root);

// console.log('Find:\n', tree.find(14) + '\n');

// console.log('Inorder:\n');
// tree.inOrder((value) => console.log(value.data));

// console.log('Preorder:\n');
// tree.preOrder((value) => console.log(value.data));

// console.log('Postorder:\n');
// tree.postOrder((value) => console.log(value.data));

// console.log('Level-Order:\n');
// tree.levelOrder((value) => console.log(value));

tree.delete(9);
prettyPrint(tree.root);
