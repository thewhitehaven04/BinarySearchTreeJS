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

  /** @param {function(TreeNode): any} callback */
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
   * Perform in-order depth-first search.
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
   * Perform pre-order depth-first search.
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
   * Perform post-order depth-first search.
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
        if (node.right) {
          node = node.right;
        } else {
          node.right = new TreeNode(value);
          break;
        }
      }
    } while (node);
  }

  delete(value) {
    /**
     * @param {TreeNode} startNode
     * @returns {TreeNode}
     */
    const getNextInOrderSuccessor = (startNode) => {
      let arr = [];
      this.inOrder((iterNode) => arr.push(iterNode.data), startNode);
      console.log(arr);
      return (
        arr[arr.findIndex((value) => value === startNode.data) + 1] ?? null
      );
    };

    this.inOrder((node) => {
      const leftChild = node.left;
      const rightChild = node.right;

      if (leftChild?.data === value) {
        if (!(leftChild.left || leftChild.right)) node.left = null;
        else if (leftChild.left && leftChild.right) {
          const successor = this.find(getNextInOrderSuccessor(leftChild));
          successor.left = leftChild?.left;
          successor.right = leftChild?.right;
          node.left = successor;
        } else node.left = leftChild.left ?? leftChild.right;
      } else if (rightChild?.data === value) {
        if (!(rightChild.left || rightChild.right)) node.right = null;
        else if (rightChild.left && rightChild.right) {
          const successor = this.find(getNextInOrderSuccessor(rightChild));
          successor.left = rightChild?.left;
          successor.right = rightChild?.right;
          node.right = successor;
        } else node.right = leftChild.left ?? leftChild.right;
      }
    });
  }

  /**
   * Returns the number of edges between the node with the specified value
   * and the tree's root.
   * @param {any} value
   */
  depth(value) {
    let node = this.find(value);
    let count = 0;
    let currentNode = this.root;
    while (currentNode !== node && currentNode) {
      count += 1;
      if (currentNode.data > value) currentNode = currentNode.left;
      else if (currentNode.data < value) currentNode = currentNode.right;
      else break;
    }
    return count;
  }

  isBalanced() {
    return (
      this.height(this.root?.left.data) === this.height(this.root?.right.data)
    );
  }

  /** Returns the number of edges between the node and the deepest leaf.
   * @param {any} value
   */
  height(value) {
    let arr = [];
    tree.preOrder((value) => arr.push(value.data), this.find(value));
    return arr.findIndex((val) => val === Math.min(...arr));
  }

  rebalance() {
    let arr = [];
    this.inOrder((node) => arr.push(node));
    this.root = buildTree(arr);
  }
}

let p = [2, 1, 5, 0, 9, 14, 18, 6, 3, 24, 10, 4, 7, 11, 8, 16, 48, 13, 15];
p.sort((a, b) => (a > b ? 1 : -1));

const tree = new Tree(buildTree(p));
prettyPrint(tree.root);

console.log('Balanced: ', tree.isBalanced());
console.log('Find: ', tree.find(14).data + '\n');

console.log('Inorder:\n');
tree.inOrder((value) => console.log(value.data));

// console.log('Preorder:\n');
// tree.preOrder((value) => console.log(value.data));

// console.log('Postorder:\n');
// tree.postOrder((value) => console.log(value.data));

// console.log('Level-Order:\n');
// tree.levelOrder((value) => console.log(value));

// const value = 15;
// console.log(`Height of ${value}: `, tree.height(value));

// const depthValue = 18;
// console.log(`Depth of ${depthValue}: `, tree.depth(depthValue) + '\n');

tree.delete(15);
prettyPrint(tree.root);
