/*

--- Day 17: Spinlock ---

Suddenly, whirling in the distance, you notice what looks like a massive, pixelated hurricane: a deadly spinlock. This spinlock isn't just consuming computing power, but memory, too; vast, digital mountains are being ripped from the ground and consumed by the vortex.

If you don't move quickly, fixing that printer will be the least of your problems.

This spinlock's algorithm is simple but efficient, quickly consuming everything in its path. It starts with a circular buffer containing only the value 0, which it marks as the current position. It then steps forward through the circular buffer some number of steps (your puzzle input) before inserting the first new value, 1, after the value it stopped on. The inserted value becomes the current position. Then, it steps forward from there the same number of steps, and wherever it stops, inserts after it the second new value, 2, and uses that as the new current position again.

It repeats this process of stepping forward, inserting a new value, and using the location of the inserted value as the new current position a total of 2017 times, inserting 2017 as its final operation, and ending with a total of 2018 values (including 0) in the circular buffer.

For example, if the spinlock were to step 3 times per insert, the circular buffer would begin to evolve like this (using parentheses to mark the current position after each iteration of the algorithm):

(0), the initial state before any insertions.
0 (1): the spinlock steps forward three times (0, 0, 0), and then inserts the first value, 1, after it. 1 becomes the current position.
0 (2) 1: the spinlock steps forward three times (0, 1, 0), and then inserts the second value, 2, after it. 2 becomes the current position.
0  2 (3) 1: the spinlock steps forward three times (1, 0, 2), and then inserts the third value, 3, after it. 3 becomes the current position.

And so on:

0  2 (4) 3  1
0 (5) 2  4  3  1
0  5  2  4  3 (6) 1
0  5 (7) 2  4  3  6  1
0  5  7  2  4  3 (8) 6  1
0 (9) 5  7  2  4  3  8  6  1

Eventually, after 2017 insertions, the section of the circular buffer near the last insertion looks like this:

1512  1134  151 (2017) 638  1513  851

Perhaps, if you can identify the value that will ultimately be after the last value written (2017), you can short-circuit the spinlock. In this example, that would be 638.

What is the value after 2017 in your completed circular buffer?


--- Part Two ---

The spinlock does not short-circuit. Instead, it gets more angry. At least, you assume that's what happened; it's spinning significantly faster than it was a moment ago.

You have good news and bad news.

The good news is that you have improved calculations for how to stop the spinlock. They indicate that you actually need to identify the value after 0 in the current state of the circular buffer.

The bad news is that while you were determining this, the spinlock has just finished inserting its fifty millionth value (50000000).

What is the value after 0 the moment 50000000 is inserted?

*/

const { Node } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function followNodeInCircularLinkedList (part, inputStr, DEBUG = false) {
  
  // CONSTANTS
  const STEPS = +inputStr;
  const NUM_ROUNDS = part === 1 ? 2017                                                        // PART 1: RUN 2017 TIMES
                                : 50000000;                                                   // PART 2: RUN 50 MIL TIMES

  // ANALYZE
  if (part === 1) {                                                                           // PART 1: ACTUALLY RUN SIMULATION

    // INIT CIRCULAR LINKED LIST
    let node = new Node(0);
    node.next = node;

    for (let ringSize = 1; ringSize <= NUM_ROUNDS; ++ringSize) {
      for (let i = 0; i < STEPS % ringSize; ++i) {                                            // mini-optimization: only move STEPS % ringSize times
        node = node.next;
      }
      const nextNode = node.next;                                                             // save reference to 'next' node after the current one
      const newNodeVal = ringSize;                                                            // (new node value always matches current ring size)
      const newNode = new Node(newNodeVal);                                                   // instantiate new node
      node.next = newNode;                                                                    // connect current node to new node
      newNode.next = nextNode;                                                                // connect new node to 'next' node
      node = newNode;                                                                         // move pointer to new node
    }
  
    return node.next.val;
    
  } else {                                                                                    // PART 2: USE MATH SHORTCUT

    // SIMULATING 50 MILLION ROUNDS IS NOT FEASIBLE. INSTEAD, REALIZE THAT WE DO NOT NEED TO TRACK THE POSITIONS OF EVERY NODE;
    // IN THE END WE ONLY NEED TO RETURN THE VALUE OF THE NODE THAT COMES AFTER NODE ZERO. SO WE CAN CALCULATE THE INDEX POSITION
    // OF WHERE OUR CURRENT NODE WOULD GO (WHERE NODE ZERO IS ALWAYS AT INDEX 0). IF THE NEW NODE GETS INSERTED INTO INDEX 1, THEN
    // IT BECOMES A CANDIDATE FOR THE NODE THAT COMES AFTER NODE ZERO. EVERY TIME A NEW NODE GETS INSERTED INTO INDEX 1, WE OVERWRITE
    // THE PREVIOUS STORED CANDIDATE (IF ANY). THE ANSWER WILL BE THE MOST RECENT NODE THAT GOT INSERTED INTO INDEX 1.

    const TIME_AT_START = Date.now();
    if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  
    // INIT
    let idx = 0;                                                                              // current position
    let output = 0;                                                                           // update this every time a new node is placed in front
                                                                                              // of node zero. the final time this happens, that new
                                                                                              // node's value will be the answer!

    for (let ringSize = 1; ringSize <= NUM_ROUNDS; ++ringSize) {

      idx = (idx + STEPS) % ringSize;                                                         // advance idx forward by STEPS
      if (idx === 0) {                                                                        // if idx reaches node zero...
        const newNodeVal = ringSize;                                                          // (new node value always matches current ring size)
        output = newNodeVal;                                                                  // you will place new node after zero. this becomes the
                                                                                              // latest candidate for the node after zero in the end.
                                                                                              // (its value is equal to ringSize)
        if (DISPLAY_EXTRA_INFO) {
          console.log(`NEW NODE PLACED AFTER NODE ZERO: ${newNodeVal}`);
        }
      }
      idx = (idx + 1) % (ringSize + 1);                                                       // idx goes to new node's position (take mod of new
                                                                                              // ring size)
    }
  
    if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return output;                                                                            // return value of latest node to be put after node zero

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = followNodeInCircularLinkedList;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`3`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 638;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1971;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 17202899;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);