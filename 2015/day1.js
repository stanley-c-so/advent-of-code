/*

--- Day 1: Not Quite Lisp ---

Santa was hoping for a white Christmas, but his weather machine's "snow" function is powered by stars, and he's fresh out! To save Christmas, he needs you to collect fifty stars by December 25th.

Collect stars by helping Santa solve puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

Here's an easy puzzle to warm you up.

Santa is trying to deliver presents in a large apartment building, but he can't find the right floor - the directions he got are a little confusing. He starts on the ground floor (floor 0) and then follows the instructions one character at a time.

An opening parenthesis, (, means he should go up one floor, and a closing parenthesis, ), means he should go down one floor.

The apartment building is very tall, and the basement is very deep; he will never find the top or bottom floors.

For example:

(()) and ()() both result in floor 0.
((( and (()(()( both result in floor 3.
))((((( also results in floor 3.
()) and ))( both result in floor -1 (the first basement level).
))) and )())()) both result in floor -3.

To what floor do the instructions take Santa?


--- Part Two ---

Now, given the same instructions, find the position of the first character that causes him to enter the basement (floor -1). The first character in the instructions has position 1, the second character has position 2, and so on.

For example:

) causes him to enter the basement at character position 1.
()()) causes him to enter the basement at character position 5.

What is the position of the character that causes Santa to first enter the basement?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function elevator (part, inputStr, DEBUG = false) {

  let floor = 0;
  for (let i = 0; i < inputStr.length; ++i) {
    const c = inputStr[i];

    if (c === '(') ++floor;
    else if (c === ')') --floor;
    else throw `ERROR: UNRECOGNIZED CHARACTER ${c}`;

    if (part === 2 && floor === -1) return i + 1;                       // PART 2: RETURN AS SOON AS BASEMENT IS REACHED (positions are 1-indexed)
  }
  return floor;                                                         // PART 1: RETURN FINAL FLOOR NUMBER

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = elevator;
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
`(())`
);

const sampleInput2 = parseSampleInput(
`()()`
);

const sampleInput3 = parseSampleInput(
`(((`
);

const sampleInput4 = parseSampleInput(
`(()(()(`
);

const sampleInput5 = parseSampleInput(
`))(((((`
);

const sampleInput6 = parseSampleInput(
`())`
);

const sampleInput7 = parseSampleInput(
`))(`
);

const sampleInput8 = parseSampleInput(
`)))`
);

const sampleInput9 = parseSampleInput(
`)())())`
);

const sampleInput10 = parseSampleInput(
`)`
);

const sampleInput11 = parseSampleInput(
`()())`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = -1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: sampleInput7,
  DEBUG: true,
};
expected = -1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 1,
  inputStr: sampleInput8,
  DEBUG: true,
};
expected = -3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 1,
  inputStr: sampleInput9,
  DEBUG: true,
};
expected = -3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 138;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput10,
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInput11,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1771;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);