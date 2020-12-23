// --- Day 23: Crab Cups ---

// The small crab challenges you to a game! The crab is going to mix up some cups, and you have to predict where they'll end up.

// The cups will be arranged in a circle and labeled clockwise (your puzzle input). For example, if your labeling were 32415, there would be five cups in the circle; going clockwise around the circle from the first cup, the cups would be labeled 3, 2, 4, 1, 5, and then back to 3 again.

// Before the crab starts, it will designate the first cup in your list as the current cup. The crab is then going to do 100 moves.

// Each move, the crab does the following actions:

// The crab picks up the three cups that are immediately clockwise of the current cup. They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
// The crab selects a destination cup: the cup with a label equal to the current cup's label minus one. If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up. If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
// The crab places the cups it just picked up so that they are immediately clockwise of the destination cup. They keep the same order as when they were picked up.
// The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
// For example, suppose your cup labeling were 389125467. If the crab were to do merely 10 moves, the following changes would occur:

// -- move 1 --
// cups: (3) 8  9  1  2  5  4  6  7 
// pick up: 8, 9, 1
// destination: 2

// -- move 2 --
// cups:  3 (2) 8  9  1  5  4  6  7 
// pick up: 8, 9, 1
// destination: 7

// -- move 3 --
// cups:  3  2 (5) 4  6  7  8  9  1 
// pick up: 4, 6, 7
// destination: 3

// -- move 4 --
// cups:  7  2  5 (8) 9  1  3  4  6 
// pick up: 9, 1, 3
// destination: 7

// -- move 5 --
// cups:  3  2  5  8 (4) 6  7  9  1 
// pick up: 6, 7, 9
// destination: 3

// -- move 6 --
// cups:  9  2  5  8  4 (1) 3  6  7 
// pick up: 3, 6, 7
// destination: 9

// -- move 7 --
// cups:  7  2  5  8  4  1 (9) 3  6 
// pick up: 3, 6, 7
// destination: 8

// -- move 8 --
// cups:  8  3  6  7  4  1  9 (2) 5 
// pick up: 5, 8, 3
// destination: 1

// -- move 9 --
// cups:  7  4  1  5  8  3  9  2 (6)
// pick up: 7, 4, 1
// destination: 5

// -- move 10 --
// cups: (5) 7  4  1  8  3  9  2  6 
// pick up: 7, 4, 1
// destination: 3

// -- final --
// cups:  5 (8) 3  7  4  1  9  2  6 

// In the above example, the cups' values are the labels as they appear moving clockwise around the circle; the current cup is marked with ( ).

// After the crab is done, what order will the cups be in? Starting after the cup labeled 1, collect the other cups' labels clockwise into a single string with no extra characters; each number except 1 should appear exactly once. In the above example, after 10 moves, the cups clockwise from 1 are labeled 9, 2, 6, 5, and so on, producing 92658374. If the crab were to complete all 100 moves, the order after cup 1 would be 67384529.

// Using your labeling, simulate 100 moves. What are the labels on the cups after cup 1?

// --- Part Two ---

// Due to what you can only assume is a mistranslation (you're not exactly fluent in Crab), you are quite surprised when the crab starts arranging many cups in a circle on your raft - one million (1000000) in total.

// Your labeling is still correct for the first few cups; after that, the remaining cups are just numbered in an increasing fashion starting from the number after the highest number in your list and proceeding one by one until one million is reached. (For example, if your labeling were 54321, the cups would be numbered 5, 4, 3, 2, 1, and then start counting up from 6 until one million is reached.) In this way, every number from one through one million is used exactly once.

// After discovering where you made the mistake in translating Crab Numbers, you realize the small crab isn't going to do merely 100 moves; the crab is going to do ten million (10000000) moves!

// The crab is going to hide your stars - one each - under the two cups that will end up immediately clockwise of cup 1. You can have them if you predict what the labels on those cups will be when the crab is finished.

// In the above example (389125467), this would be 934001 and then 159792; multiplying these together produces 149245887792.

// Determine which two cups will end up immediately clockwise of cup 1. What do you get if you multiply their labels together?

function cupCircleGame (part, inputStr) {
  const inputArr = inputStr.split('').map(n => +n);

  // DATA STRUCTURES
  class cupNode {                                                             // a circular singly linked list (as opposed to an array) is required to solve part 2 efficiently!
    constructor(val) {
      this.val = val;
      this.next = null;
    }
  }
  const ref = [];                                                             // in addition to using a LL, in part 2, we need O(1) lookup to find the node of a specified unique value

  // CONSTRUCT CIRCULAR SINGLY LINKED LIST BASED ON INPUT DATA
  let head;
  let curr;
  let max = part === 1 ? -Infinity : 1000000;                                 // PART 1: I MAKE NO ASSUMPTIONS ABOUT THE NUMBERS; PART 2: WE ARE TOLD THE NUMBERS GO FROM 1 TO 1 MILLION
  let min = part === 1 ? Infinity : 1;                                        // DITTO
  for (let i = 0; i < (part === 1 ? inputArr.length : 1000000); ++i) {        // PART 1: ITERATE THROUGH inputArr ONLY; PART 2: CONTINUE ON FOR ALL CUPS UP TO 1 MILLION
    const cup = i < inputArr.length ? inputArr[i] : i + 1;                    // cup number is based on inputArr, and in part 2, based on i (in fact, i + 1, since cups are 1-indexed)
    if (part === 1) max = Math.max(max, cup);                                 // (PART 1 ONLY) update max number
    if (part === 1) min = Math.min(min, cup);                                 // (PART 1 ONLY) update min number
    const node = new cupNode(cup);                                            // create the standalone singly linked list node
    ref[cup] = node;                                                          // save a reference to the node for O(1) lookup (use array indices as keys, since all cup values are unique)
    if (!head) head = node;                                                   // for the first node, set the head
    else curr.next = node;                                                    // otherwise, link the end of the linked list to the newly made node
    curr = node;
  }
  curr.next = head;                                                           // link the final node back to head (making the linked list circular)
  curr = head;                                                                // reset curr to head before we start the game

  const startTime = Date.now();                                               // NOT PART OF SOLUTION. used to track elapsed time.

  const moves = part === 1 ? 100 : 10000000;                                  // PART 1: PLAY 100 MOVES; PART 2: PLAY 10,000,000 MOVES
  for (let i = 0; i < moves; ++i) {

    if (i && i % 1000000 === 0) {                                             // NOT PART OF SOLUTION. used to track elapsed time.
      console.log(`JUST REACHED ${i} AFTER ${(Date.now() - startTime) / 1000} seconds - ${(S = (i / moves * 100).toString()) && S.slice(0, S.indexOf(".") + 3)}% complete`);
    }

    // STEP 1: disconnect the 3 nodes after the current one
    const start = curr;                                                       // save reference to current node
    const next3Head = curr.next;                                              // save individual references to next 3 nodes
    const next3Mid = next3Head.next;
    const next3Tail = next3Mid.next;
    const next3Vals = [next3Head.val, next3Mid.val, next3Tail.val];           // save values of the next 3 nodes into an array
    curr.next = next3Tail.next;                                               // disconnect current node from 3 nodes to be removed, and connect it to the node that comes after
    next3Tail.next = null;                                                    // disconnect the tail fo the 3 nodes to be removed from the node that comes after
    
    // STEP 2: find the destination cup
    let destination = curr.val;                                               // determine the number of the destination node by first setting it to the value of the current node...
    while (destination === curr.val || next3Vals.includes(destination)) {     // ...while destination matches either current value, or any of the values in the 3 nodes to be removed...
      if (destination === min) destination = max;                             // ...if destination reaches the minimum number, wrap it around to the max number
      else --destination;                                                     // ...otherwise, simply decrement it
    }
    curr = ref[destination];                                                  // now, destination properly points to the correct cup. jump to it in O(1) time using the ref array

    // STEP 3: insert the 3 removed nodes after the destination node
    const nodeAfterDestination = curr.next;                                   // save a reference to the node that comes immediately after the destination node, prior to insertion
    curr.next = next3Head;                                                    // connect destination node to the head of the 3 removed nodes
    next3Tail.next = nodeAfterDestination;                                    // connect the tail of the 3 removed nodes to the one that initially came after the destination node
    curr = start.next;                                                        // jump to whichever node now comes after the node we started on for this move

  }

  if (part === 1) {

    let output = "";                                                          // string representation of cups from clockwise order after cup 1
    curr = ref[1].next;                                                       // use ref array to jump to the node immediately after the node with value 1
    while (curr.val !== 1) {                                                  // for the remaining nodes in the circular linked list (excluding the node with value 1)...
      output += curr.val;                                                     // ...concatenate the node value to the output string
      curr = curr.next;                                                       // ...and move to the next node
    }
    return +output;                                                           // my test suite assumes the output will be a number, so we cast the string to a number before returning it

  } else {

    console.log(`JUST REACHED ${moves} AFTER ${(Date.now() - startTime) / 1000} seconds - 100% complete`);       // NOT PART OF SOLUTION. used to track elapsed time.
    return ref[1].next.val * ref[1].next.next.val;                            // use ref array to jump to the two nodes immediately after the node with value 1, and return their product

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = cupCircleGame;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `389125467`;

const actualInput = `586439172`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 67384529;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 28946753;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 934001 * 159792;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 519044017360;
test(func, input, expected, testNum, lowestTest, highestTest);