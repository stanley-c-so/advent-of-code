/*

--- Day 19: An Elephant Named Joseph ---

The Elves contact you over a highly secure emergency channel. Back at the North Pole, the Elves are busy misunderstanding White Elephant parties.

Each Elf brings a present. They all sit in a circle, numbered starting with position 1. Then, starting with the first Elf, they take turns stealing all the presents from the Elf to their left. An Elf with no presents is removed from the circle and does not take turns.

For example, with five Elves (numbered 1 to 5):

  1
5   2
 4 3

Elf 1 takes Elf 2's present.
Elf 2 has no presents and is skipped.
Elf 3 takes Elf 4's present.
Elf 4 has no presents and is also skipped.
Elf 5 takes Elf 1's two presents.
Neither Elf 1 nor Elf 2 have any presents, so both are skipped.
Elf 3 takes Elf 5's three presents.

So, with five Elves, the Elf that sits starting in position 3 gets all the presents.

With the number of Elves given in your puzzle input, which Elf gets all the presents?


--- Part Two ---

Realizing the folly of their present-exchange rules, the Elves agree to instead steal presents from the Elf directly across the circle. If two Elves are across the circle, the one on the left (from the perspective of the stealer) is stolen from. The other rules remain unchanged: Elves with no presents are removed from the circle entirely, and the other elves move in slightly to keep the circle evenly spaced.

For example, with five Elves (again numbered 1 to 5):

The Elves sit in a circle; Elf 1 goes first:
  1
5   2
 4 3

Elves 3 and 4 are across the circle; Elf 3's present is stolen, being the one to the left. Elf 3 leaves the circle, and the rest of the Elves move in:
  1           1
5   2  -->  5   2
 4 -          4

Elf 2 steals from the Elf directly across the circle, Elf 5:
  1         1 
-   2  -->     2
  4         4 

Next is Elf 4 who, choosing between Elves 1 and 2, steals from Elf 1:
 -          2  
    2  -->
 4          4

Finally, Elf 2 steals from Elf 4:
 2
    -->  2  
 -

So, with five Elves, the Elf that sits starting in position 2 gets all the presents.

With the number of Elves given in your puzzle input, which Elf now gets all the presents?

*/

const { Node } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {

  // INIT
  const N = +inputStr;
  let count = N;

  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  // MUCH FASTER PART 1 SOLUTION (COMMENT OUT TO USE GENERAL SOLUTION FOR BOTH PARTS)
  if (part === 1) {
    let powerOf2 = 1;
    while (powerOf2 * 2 < N) powerOf2 *= 2;
    let elf = 1;
    while (count > powerOf2) {
      --count;
      elf += 2;
    }
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return elf;
  }

  // PRE-PROCESSING: CREATE CIRCULAR DOUBLY-LINKED LIST
  let prev = null;
  let ptr = null;
  for (let elf = 1; elf <= N; ++elf) {
    const node = new Node(elf);
    if (!ptr) ptr = node;                             // FIRST ITERATION ONLY: set ptr to elf 1
    
    node.prev = prev;                                 // connect to prev node
    if (prev) prev.next = node;                       // connect prev node to current node
    prev = node;                                      // advance prev
  }
  ptr.prev = prev;                                    // connect first node to last node
  prev.next = ptr;                                    // connect last node to first node

  if (part === 1) {                                   // PART 1: EACH ELF ELIMINATES NEXT ELF

    // ANALYZE
    while (count > 1) {

      ptr.next = ptr.next.next;                       // eliminate next active elf relative to ptr
      ptr = ptr.next;                                 // then move ptr to next active elf
      --count;
  
    }  

  } else {                                            // PART 2: EACH ELF ELIMINATES ELF ACROSS HIMSELF

    // init targetPtr
    let targetPtr = ptr;
    let advance = Math.floor(count / 2);
    while (advance--) targetPtr = targetPtr.next;     // go to target elf

    // ANALYZE
    while (count > 1) {

      targetPtr.prev.next = targetPtr.next;           // eliminate target elf: connect elf before target to elf after target
      targetPtr.next.prev = targetPtr.prev;           // eliminate target elf: connect elf after target to elf before target

      targetPtr = count % 2 ? targetPtr.next.next     // if count is currently odd, advance targetPtr twice
                            : targetPtr.next;         // if count is currently even, advance targetPtr once

      ptr = ptr.next;                                 // then move ptr to next active elf
      --count;
  
    }

  }

  if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return ptr.val;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
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
`5`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1816277;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1410967;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);