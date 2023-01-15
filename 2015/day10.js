/*

--- Day 10: Elves Look, Elves Say ---

Today, the Elves are playing a game called look-and-say. They take turns making sequences by reading aloud the previous sequence and using that reading as the next sequence. For example, 211 is read as "one two, two ones", which becomes 1221 (1 2, 2 1s).

Look-and-say sequences are generated iteratively, using the previous value as input for the next step. For each step, take the previous value, and replace each run of digits (like 111) with the number of digits (3) followed by the digit itself (1).

For example:

1 becomes 11 (1 copy of digit 1).
11 becomes 21 (2 copies of digit 1).
21 becomes 1211 (one 2 followed by one 1).
1211 becomes 111221 (one 1, one 2, and two 1s).
111221 becomes 312211 (three 1s, two 2s, and one 1).

Starting with the digits in your puzzle input, apply this process 40 times. What is the length of the result?


--- Part Two ---

Neat, right? You might also enjoy hearing John Conway talking about this sequence (that's Conway of Conway's Game of Life fame).

Now, starting again with the digits in your puzzle input, apply this process 50 times. What is the length of the new result?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function sayTheNumber (part, inputStr, DEBUG = false) {
  
  // CONSTANTS
  const NUM_TIMES_REAL = part === 1 ? 40                          // PART 1: RUN THE PROCESS 40 TIMES
                                    : 50;                         // PART 2: RUN THE PROCESS 50 TIMES

  const NUM_TIMES = DEBUG ? 1                                     // for sample inputs, run the process only once
                          : NUM_TIMES_REAL;

  // HELPER FUNCTION
  function go(str) {
    let res = '';
    let currentChar = null;
    let currentCharCount = 0;
    for (const c of str + ' ') {                                  // add extra space at the end to trigger the reset block
      if (currentChar && c !== currentChar) {                     // don't run this reset block on the first character
        res += currentCharCount + currentChar
        currentCharCount = 0;
      }
      currentChar = c;
      ++currentCharCount;
    }
    return res;
  }

  // INIT
  let res = inputStr;

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  for (let i = 0; i < NUM_TIMES; ++i) res = go(res);
  if (!DEBUG) console.log(`(RUN TOOK ${
    (Date.now() - TIME_AT_START)/1000
  } SECS)`);
  
  return DEBUG  ? res                                             // for sample inputs, return the res itself
                : res.length;                                     // for actual data, return the length of res
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = sayTheNumber;
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
`1`
);

const sampleInput2 = parseSampleInput(
`11`
);

const sampleInput3 = parseSampleInput(
`21`
);

const sampleInput4 = parseSampleInput(
`1211`
);

const sampleInput5 = parseSampleInput(
`111221`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '11';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = '21';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = '1211';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = '111221';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = '312211';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 492982;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 6989950;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);