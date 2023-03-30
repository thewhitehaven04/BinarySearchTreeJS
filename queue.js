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

module.exports = {
  Queue
}
