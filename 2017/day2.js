/*

--- Day 2: Corruption Checksum ---

As you walk through the door, a glowing humanoid shape yells in your direction. "You there! Your state appears to be idle. Come help us repair the corruption in this spreadsheet - if we take another millisecond, we'll have to display an hourglass cursor!"

The spreadsheet consists of rows of apparently-random numbers. To make sure the recovery process is on the right track, they need you to calculate the spreadsheet's checksum. For each row, determine the difference between the largest value and the smallest value; the checksum is the sum of all of these differences.

For example, given the following spreadsheet:

5 1 9 5
7 5 3
2 4 6 8

The first row's largest and smallest values are 9 and 1, and their difference is 8.
The second row's largest and smallest values are 7 and 3, and their difference is 4.
The third row's difference is 6.

In this example, the spreadsheet's checksum would be 8 + 4 + 6 = 18.

What is the checksum for the spreadsheet in your puzzle input?


--- Part Two ---

"Great work; looks like we're on the right track after all. Here's a star for your effort." However, the program seems a little worried. Can programs be worried?

"Based on what we're seeing, it looks like all the User wanted is some information about the evenly divisible values in the spreadsheet. Unfortunately, none of us are equipped for that kind of calculation - most of us specialize in bitwise operations."

It sounds like the goal is to find the only two numbers in each row where one evenly divides the other - that is, where the result of the division operation is a whole number. They would like you to find those numbers on each line, divide them, and add up each line's result.

For example, given the following spreadsheet:

5 9 2 8
9 4 7 3
3 8 6 5

In the first row, the only two numbers that evenly divide are 8 and 2; the result of this division is 4.
In the second row, the two numbers are 9 and 3; the result is 3.
In the third row, the result is 2.

In this example, the sum of the results would be 4 + 3 + 2 = 9.

What is the sum of each row's result in your puzzle input?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function getChecksumFromNumsOnEachRow (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  const NUMS = [];
  for (const line of inputArr) {
    NUMS.push(line.split(String.fromCodePoint(9))                     // real data has nums separated by tabs (ASCII 9)...
                      .join(' ')
                      .split(' ')                                     // ...whereas sample data has nums separated by spaces
                      .map(n => +n));
  }

  let checksum = 0;

  // ANALYZE
  if (part === 1) {                                                   // PART 1: DIFFERENCE BETWEEN MAX AND MIN OF EACH ROW

    for (const row of NUMS) {
      const max = Math.max(...row);
      const min = Math.min(...row);
      checksum += max - min;
    }

  } else {                                                            // PART 2: QUOTIENT BETWEEN ONLY TWO EVENLY DIVISIBLE NUMBERS OF EACH ROW

    for (const row of NUMS) {
      const seen = new Set();
      let quotient = null;
      for (const A of row) {
        for (const B of seen) {
          const [ larger, smaller ] = A > B ? [ A, B ] : [ B, A ];
          if (larger % smaller === 0) {
            quotient = larger / smaller;
            break;
          }
        }
        if (quotient !== null) break;
        seen.add(A);
      }
      checksum += quotient;
    }

  }

  return checksum;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = getChecksumFromNumsOnEachRow;
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
`5 1 9 5
7 5 3
2 4 6 8`
);

const sampleInput2 = parseSampleInput(
`5 9 2 8
9 4 7 3
3 8 6 5`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 18;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 36174;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 9;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 244;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);