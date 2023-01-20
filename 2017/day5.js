/*

--- Day 5: A Maze of Twisty Trampolines, All Alike ---

An urgent interrupt arrives from the CPU: it's trapped in a maze of jump instructions, and it would like assistance from any programs with spare cycles to help find the exit.

The message includes a list of the offsets for each jump. Jumps are relative: -1 moves to the previous instruction, and 2 skips the next one. Start at the first instruction in the list. The goal is to follow the jumps until one leads outside the list.

In addition, these instructions are a little strange; after each jump, the offset of that instruction increases by 1. So, if you come across an offset of 3, you would move three instructions forward, but change it to a 4 for the next time it is encountered.

For example, consider the following list of jump offsets:

0
3
0
1
-3

Positive jumps ("forward") move downward; negative jumps move upward. For legibility in this example, these offset values will be written all on one line, with the current instruction marked in parentheses. The following steps would be taken before an exit is found:

(0) 3  0  1  -3  - before we have taken any steps.
(1) 3  0  1  -3  - jump with offset 0 (that is, don't jump at all). Fortunately, the instruction is then incremented to 1.
 2 (3) 0  1  -3  - step forward because of the instruction we just modified. The first instruction is incremented again, now to 2.
 2  4  0  1 (-3) - jump all the way to the end; leave a 4 behind.
 2 (4) 0  1  -2  - go back to where we just were; increment -3 to -2.
 2  5  0  1  -2  - jump 4 steps forward, escaping the maze.

In this example, the exit is reached in 5 steps.

How many steps does it take to reach the exit?


--- Part Two ---

Now, the jumps are even stranger: after each jump, if the offset was three or more, instead decrease it by 1. Otherwise, increase it by 1 as before.

Using this rule with the above example, the process now takes 10 steps, and the offset values after finding the exit are left as 2 3 2 3 -1.

How many steps does it now take to reach the exit?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function jumpInstructions (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  const INSTRUCTIONS = inputArr.map(n => +n);

  let i = 0;
  let moves = 0;

  while (0 <= i && i < INSTRUCTIONS.length) {
    if (DISPLAY_EXTRA_INFO && DEBUG) {
      console.log(`move ${moves}: i is ${i}`);
    }
    const nextI = i + INSTRUCTIONS[i];                                // save the destination of the jump, before updating the instruction
    
    INSTRUCTIONS[i] += part === 2 && INSTRUCTIONS[i] >= 3 ? -1        // PART 2: IF OFFSET IS 3 OR MORE, DECREMENT THE INSTRUCTION
                                                          : 1;        // PART 1: ALWAYS INCREMENT THE INSTRUCTION

    i = nextI;                                                        // make the jump
    ++moves;
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log(`exited instructions with i having value ${i}`);
    console.log('state of instructions:', INSTRUCTIONS);
  }
  return moves;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = jumpInstructions;
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
`0
3
0
1
-3`
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
expected = 394829;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 31150702;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);