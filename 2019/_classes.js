class Node {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class Queue {
  constructor(val) {
    this.head = null;
    this.tail = null;
    this.length = 0;
    if (val) this.enqueue(val);
  }
  enqueue(val) {
    const node = new Node(val);
    if (this.isEmpty()) this.head = node;
    else this.tail.next = node;
    this.tail = node;
    ++this.length;
  }
  dequeue() {
    if (this.isEmpty()) return null;
    const node = this.head;
    this.head = this.head.next;
    --this.length;
    if (this.isEmpty()) this.tail = null;
    return node;
  }
  isEmpty() {
    return this.length === 0;
  }
}

class MinHeap {

  constructor () {
    this.queue = [];                                            // elements will be in the form of {value: someValue, priority: somePriority}
  }
  
  // ===== UTILITY METHODS =====

  _swap (idxA, idxB) {
    [this.queue[idxA], this.queue[idxB]] = [this.queue[idxB], this.queue[idxA]];
  }

  _parentIdx (childIdx) {
    return Math.floor((childIdx - 1) / 2);
  }

  _childrenIndices (parentIdx) {
    return [2 * parentIdx + 1, 2 * parentIdx + 2];
  }

  // ===== PQ METHODS =====

  isEmpty () {
    return this.queue.length === 0;
  }

  peek () {
    return this.isEmpty() ? null : this.queue[0];
  }

  insert (value, priority = value) {

    // FIRST, ADD THE NEW ELEMENT TO THE END OF QUEUE
    this.queue.push({value, priority});

    // NEXT, 'HEAPIFY UP' ('bubble up' the first element in queue until heap is proper)
    let currentNodeIdx = this.queue.length - 1;
    while (currentNodeIdx !== 0 && this.queue[currentNodeIdx].priority < this.queue[this._parentIdx(currentNodeIdx)].priority) {
      this._swap(currentNodeIdx, this._parentIdx(currentNodeIdx));
      currentNodeIdx = this._parentIdx(currentNodeIdx);
    }
    
    return this;                                                // for chaining
  }

  popMin () {

    // EDGE CASES: 0- OR 1-LENGTH HEAP
    if (this.isEmpty()) return null;
    if (this.queue.length === 1) return this.queue.pop();       // if only one node, just pop it off the queue and return
    
    // FIRST, SAVE THE TOP ELEMENT AND THEN REPLACE IT WITH LAST ELEMENT (AFTER POPPING IT OFF)
    const poppedMin = this.peek();                              // use .peek() to save the top element inside poppedMin, to be returned later
    this.queue[0] = this.queue.pop();                           // replace top of heap with node popped off from end of queue

    // NEXT, 'HEAPIFY DOWN' ('push down' the first element in queue until heap is proper)
    let currentNodeIdx = 0;
    let [left, right] = this._childrenIndices(currentNodeIdx);
    while (left < this.queue.length) {                          // while left child exists...
      let smallestChildIdx = right < this.queue.length && this.queue[right].priority < this.queue[left].priority
        ? right                                                 // ...smallestChildIdx is right if right child exists AND takes priority over left child...
        : left;                                                 // ...otherwise, smallestChildIdx is left
      if (this.queue[smallestChildIdx].priority < this.queue[currentNodeIdx].priority) {    // see if smallest child is smaller than parent
        this._swap(currentNodeIdx, smallestChildIdx);           // swap parent and smaller child
        currentNodeIdx = smallestChildIdx;                      // update currentNodeIdx
        [left, right] = this._childrenIndices(currentNodeIdx);  // update left and right
      } else {
        break;                                                  // if smaller child is not smaller than parent, break out of heapify down
      }
    }

    return poppedMin;                                           // finally, return the stored top element from the beginning
  }
}

module.exports = {
  Node,
  Queue,
  MinHeap,
};