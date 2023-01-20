/*

--- Day 6: Memory Reallocation ---

A debugger program here is having an issue: it is trying to repair a memory reallocation routine, but it keeps getting stuck in an infinite loop.

In this area, there are sixteen memory banks; each memory bank can hold any number of blocks. The goal of the reallocation routine is to balance the blocks between the memory banks.

The reallocation routine operates in cycles. In each cycle, it finds the memory bank with the most blocks (ties won by the lowest-numbered memory bank) and redistributes those blocks among the banks. To do this, it removes all of the blocks from the selected bank, then moves to the next (by index) memory bank and inserts one of the blocks. It continues doing this until it runs out of blocks; if it reaches the last memory bank, it wraps around to the first one.

The debugger would like to know how many redistributions can be done before a blocks-in-banks configuration is produced that has been seen before.

For example, imagine a scenario with only four memory banks:

The banks start with 0, 2, 7, and 0 blocks. The third bank has the most blocks, so it is chosen for redistribution.
Starting with the next bank (the fourth bank) and then continuing to the first bank, the second bank, and so on, the 7 blocks are spread out over the memory banks. The fourth, first, and second banks get two blocks each, and the third bank gets one back. The final result looks like this: 2 4 1 2.
Next, the second bank is chosen because it contains the most blocks (four). Because there are four memory banks, each gets one block. The result is: 3 1 2 3.
Now, there is a tie between the first and fourth memory banks, both of which have three blocks. The first bank wins the tie, and its three blocks are distributed evenly over the other three banks, leaving it with none: 0 2 3 4.
The fourth bank is chosen, and its four blocks are distributed such that each of the four banks receives one: 1 3 4 1.
The third bank is chosen, and the same thing happens: 2 4 1 2.

At this point, we've reached a state we've seen before: 2 4 1 2 was already seen. The infinite loop is detected after the fifth block redistribution cycle, and so the answer in this example is 5.

Given the initial block counts in your puzzle input, how many redistribution cycles must be completed before a configuration is produced that has been seen before?


--- Part Two ---

Out of curiosity, the debugger would also like to know the size of the loop: starting from a state that has already been seen, how many block redistribution cycles must be performed before that same state is seen again?

In the example above, 2 4 1 2 is seen again after four cycles, and so the answer in that example would be 4.

How many cycles are in the infinite loop that arises from the configuration in your puzzle input?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function getLoopPeriod (part, inputStr, DEBUG = false) {
  
  // PARSE INPUT DATA
  const BANKS = inputStr.split(String.fromCodePoint(9))           // real data has nums separated by tabs (ASCII 9)...
                        .join(' ')
                        .split(' ')                               // ...whereas sample data has nums separated by spaces
                        .map(n => +n);
  
  // DATA STRUCTURES - FOR EVERY BANK ARRANGEMENT, SAVE INDEX WHERE IT WAS FIRST SEEN
  const seen = {};

  // INIT
  let moves = 0;

  // ANALYZE - REDISTRIBUTE BLOCKS AMONG BANKS UNTIL THERE IS A REPEATED POSITION
  while (!(BANKS.join(',') in seen)) {
    seen[BANKS.join(',')] = moves;
    const max = Math.max(...BANKS);
    const idxToBeRedistributed = BANKS.indexOf(max);              // if there is a tie for max, the winner is the lowest index

    let amount = BANKS[idxToBeRedistributed];
    BANKS[idxToBeRedistributed] = 0;

    let i = (idxToBeRedistributed + 1) % BANKS.length;
    while (amount--) {
      ++BANKS[i];
      i = (i + 1) % BANKS.length;
    }

    ++moves;
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log(`after ${
      moves} moves, this arrangement was repeated:`, BANKS);
  }

  return part === 1 ? moves                                       // PART 1: COUNT MOVES TO GET TO A REPEATED POSITION
                    : moves - seen[BANKS.join(',')];              // PART 2: CALCULATE PERIOD OF LOOP - find the difference between
                                                                  // current moves (since we have the repeated position) and
                                                                  // the index at which we first saw that position
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = getLoopPeriod;
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
`0 2 7 0`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 14029;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2765;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);