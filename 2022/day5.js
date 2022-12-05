/*

--- Day 5: Supply Stacks ---

The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2

In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 

In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3

Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3

Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3

The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?


--- Part Two ---

As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

Again considering the example above, the crates begin in the same configuration:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

Moving a single crate from stack 2 to stack 1 behaves the same as before:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 

However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

        [D]
        [N]
    [C] [Z]
    [M] [P]
 1   2   3

Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

        [D]
        [N]
[C]     [Z]
[M]     [P]
 1   2   3

Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

        [D]
        [N]
        [Z]
[M] [C] [P]
 1   2   3

In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?

*/

function pushAndPopStacks (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  const COLS = (inputArr[0].length + 1) / 4;                          // each col is [X] with 1 space in between - 4 spaces per col
                                                                      // but we also add 1 before dividing because of fencepost

  const STACKS = Array.from({length: COLS}, () => []);                // beginning of stack is bottom, while end of stack is top

  let finishedParsingInitialPosition = false;                         // becomes true once we hit the blank line in the input

  for (const line of inputArr) {

    if (!finishedParsingInitialPosition) {

      for (let i = 0; i < line.length; i += 4) {
        if (line[i] === '[') {
          const col = i / 4;
          STACKS[col].unshift(line[i + 1]);                           // since we read the data top to bottom, we UNSHIFT as we find
        }
      }

      if (!line) finishedParsingInitialPosition = true;               // there is a blank line between the stack data and move instructions

    } else {

      const [MOVE, RANGE] = line.split(' from ');                     // MOVE: e.g. 'move 6'; RANGE: e.g. '5 to 7'
      const N = +(MOVE.slice(5));                                     // N: e.g. 6
      const [colA, colB] = RANGE.split(' to ').map(n => +n - 1);      // colA: e.g. 4; colB: e.g. 6 (REMEMBER TO SUBTRACT 1 TO CONVERT FROM 1-INDEX TO 0-INDEX!)

      if (part === 1) {                                               // PART 1: ELEMENTS GET POPPED AND PUSHED ONE AT A TIME

        for (let i = 0; i < N; ++i) {
          STACKS[colB].push(STACKS[colA].pop());
        }

      } else {                                                        // PART 2: ELEMENTS GET POPPED AND PUSHED ALL AT ONCE
        
        const TEMP_STACK = [];                                        // effectively, the group will be in reversed order relative to part 1
        for (let i = 0; i < N; ++i) {                                 // so, we can simply pop/push the elements in the same way into a temporary stack...
          TEMP_STACK.push(STACKS[colA].pop());
        }
        for (let i = 0; i < N; ++i) {                                 // ...and then likewise from the temporary stack to the destination stack
          STACKS[colB].push(TEMP_STACK.pop());
        }

      }

    }
    
  }

  return STACKS.map(c => c[c.length - 1]).join('');
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = pushAndPopStacks;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'CMZ';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 'ZSQVCCJLL';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'MCD';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 'QZFJRWHGS';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);