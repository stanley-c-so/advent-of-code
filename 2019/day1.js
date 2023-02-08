/*

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // PARSE INPUT DATA
  const MODULES = inputArr.map(n => +n);

  // INIT
  let sum = 0;

  // ANLAYZE
  for (const module of MODULES) {
    let fuel = Math.floor(module / 3) - 2;

    if (part === 1) {                                         // PART 1: JUST ADD FUEL REQUIRED FOR MODULE

      sum += fuel;

    } else {                                                  // PART 2: ALSO ADD FUEL REQUIRED FOR FUEL

      while (fuel > 0) {
        sum += fuel;
        fuel = Math.floor(fuel / 3) - 2;                      // get fuel required for the fuel you just added
      }

    }
  }

  return sum;
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
`12
14
1969
100756`
);

const sampleInput2 = parseSampleInput(
`14
1969
100756`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2 + 2 + 654 + 33583;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 3226822;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 2 + 966 + 50346;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 4837367;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);