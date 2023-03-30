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
    let parent;
    let nodeToDelete = this.find(value);

    /**
     * @param {TreeNode} node
     * @returns {TreeNode}
     */
    const getInOrderPredecessor = (node) => {
      let ret;
      let previous;
      this.inOrder((treeNode) => {
        if (treeNode === node) {
          ret = previous;
        }
        previous = treeNode;
      });
      return ret;
    };

    this.preOrder((node) => {
      // find parent
      if (node.left === nodeToDelete || node.right === nodeToDelete) {
        parent = node;
      }
    });

    if (!(nodeToDelete.left || nodeToDelete.right)) {
      parent.left === nodeToDelete
        ? (parent.left = null)
        : (parent.right = null);
    } else if (nodeToDelete.left && nodeToDelete.right) {
      const predecessor = getInOrderPredecessor(nodeToDelete);

      let predecessorParent;
      this.preOrder((node) => {
        if (node.left === predecessor || node.right === predecessor) {
          predecessorParent = node;
        }
      });

      predecessor.left = nodeToDelete.left;
      predecessor.right = nodeToDelete.right;

      predecessorParent.left === predecessor
        ? (predecessorParent.left = null)
        : (predecessorParent.right = null);

      parent.left === nodeToDelete
        ? (parent.left = predecessor)
        : (parent.right = predecessor);
    } else {
      let child = nodeToDelete.left ?? nodeToDelete.right;
      parent.left === nodeToDelete
        ? (parent.left = child)
        : (parent.right = child);
    }
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
    return this.height(this.root.left) === this.height(this.root.right);
  }

  /** Returns the number of edges between the node and the deepest leaf.
   * @param {TreeNode} node
   */
  height(node) {
    const traverse = (node, length = 0) => {
      let leftLength = length;
      let rightLength = length;
      length++;
      if (node.left) {
        leftLength = traverse(node.left, length);
      }
      if (node.right) {
        rightLength = traverse(node.right, length);
      }
      return Math.max(leftLength, rightLength);
    };
    return traverse(node);
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

console.log('Preorder:\n');
tree.preOrder((value) => console.log(value.data));

console.log('Postorder:\n');
tree.postOrder((value) => console.log(value.data));

console.log('Level-Order:\n');
tree.levelOrder((value) => console.log(value));

const depthValue = 18;
console.log(`Depth of ${depthValue}: `, tree.depth(depthValue) + '\n');

tree.delete(4);

tree.insert(103);
tree.insert(101);
tree.insert(121);
tree.insert(109);
tree.insert(141);
tree.insert(104);
tree.insert(100);
prettyPrint(tree.root);

const value = 15;
console.log(`Height of ${value}: `, tree.height(tree.find(value)));

console.log('Balanced ', tree.isBalanced());
tree.rebalance();

console.log('Balanced ', tree.isBalanced());