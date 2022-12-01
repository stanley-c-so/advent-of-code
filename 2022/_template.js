/*

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

function NAME_OF_FUNC_HERE (part, inputStr) {
  const inputArr = inputStr.split('\r\n');
  console.log(inputArr);

  // if (part === 1) {

  // } else {

  // }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(``);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = null;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = null;
test(func, input, expected, testNum, lowestTest, highestTest);

// // Test case 3
// input = {
//   part: 2,
//   inputStr: sampleInput,
// };
// expected = null;
// test(func, input, expected, testNum, lowestTest, highestTest);

// // Test case 4
// input = {
//   part: 2,
//   inputStr: actualInput,
// };
// expected = null;
// test(func, input, expected, testNum, lowestTest, highestTest);