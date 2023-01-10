/*

--- Day 3: Squares With Three Sides ---

Now that you can think clearly, you move deeper into the labyrinth of hallways and office furniture that makes up this part of Easter Bunny HQ. This must be a graphic design department; the walls are covered in specifications for triangles.

Or are they?

The design document gives the side lengths of each triangle it describes, but... 5 10 25? Some of these aren't triangles. You can't help but mark the impossible ones.

In a valid triangle, the sum of any two sides must be larger than the remaining side. For example, the "triangle" given above is impossible, because 5 + 10 is not larger than 25.

In your puzzle input, how many of the listed triangles are possible?


--- Part Two ---

Now that you've helpfully marked up their design documents, it occurs to you that triangles are specified in groups of three vertically. Each set of three numbers in a column specifies a triangle. Rows are unrelated.

For example, given the following specification, numbers with the same hundreds digit would be part of the same triangle:

101 301 501
102 302 502
103 303 503
201 401 601
202 402 602
203 403 603

In your puzzle input, and instead reading by columns, how many of the listed triangles are possible?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function countValidTriangles (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  let validTriangles = 0;

  // ANALYZE
  if (part === 1) {

    for (const line of inputArr) {
      const triangle = [
        +line.slice(2, 5),                                        // all numbers take up 3 spaces (leading spaces if fewer than 3 digits), with 2 spaces before each number
        +line.slice(7, 10),
        +line.slice(12, 15),
      ].sort((a, b) => a - b);
      if (triangle[0] + triangle[1] > triangle[2]) {
        ++validTriangles;
      }
    }

  } else {

    if (inputArr.length % 3) {
      throw `ERROR: NUMBER OF LINES IS NOT A MULTIPLE OF 3 - ${
        inputArr.length
      }`;
    }

    for (let row = 0; row < inputArr.length; row += 3) {
      const line1 = inputArr[row];
      const line2 = inputArr[row + 1];
      const line3 = inputArr[row + 2];

      const lines = [ line1, line2, line3 ];

      const col1 = lines.map(line => +line.slice(2, 5))
                        .sort((a, b) => a - b);
      const col2 = lines.map(line => +line.slice(7, 10))
                        .sort((a, b) => a - b);
      const col3 = lines.map(line => +line.slice(12, 15))
                        .sort((a, b) => a - b);

      const triangles = [ col1, col2, col3 ];

      for (const triangle of triangles) {
        if (triangle[0] + triangle[1] > triangle[2]) {
          ++validTriangles;
        }
      }

    }

  }

  return validTriangles;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = countValidTriangles;
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
`5 10 25`
);

const sampleInput2 = parseSampleInput(
`  101  301  501
  102  302  502
  103  303  503
  201  401  601
  202  402  602
  203  403  603`
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
  inputStr: actualInput,
};
expected = 917;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1649;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);