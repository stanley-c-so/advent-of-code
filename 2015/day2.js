/*

--- Day 2: I Was Told There Would Be No Math ---

The elves are running low on wrapping paper, and so they need to submit an order for more. They have a list of the dimensions (length l, width w, and height h) of each present, and only want to order exactly as much as they need.

Fortunately, every present is a box (a perfect right rectangular prism), which makes calculating the required wrapping paper for each gift a little easier: find the surface area of the box, which is 2*l*w + 2*w*h + 2*h*l. The elves also need a little extra paper for each present: the area of the smallest side.

For example:

A present with dimensions 2x3x4 requires 2*6 + 2*12 + 2*8 = 52 square feet of wrapping paper plus 6 square feet of slack, for a total of 58 square feet.
A present with dimensions 1x1x10 requires 2*1 + 2*10 + 2*10 = 42 square feet of wrapping paper plus 1 square foot of slack, for a total of 43 square feet.

All numbers in the elves' list are in feet. How many total square feet of wrapping paper should they order?


--- Part Two ---

The elves are also running low on ribbon. Ribbon is all the same width, so they only have to worry about the length they need to order, which they would again like to be exact.

The ribbon required to wrap a present is the shortest distance around its sides, or the smallest perimeter of any one face. Each present also requires a bow made out of ribbon as well; the feet of ribbon required for the perfect bow is equal to the cubic feet of volume of the present. Don't ask how they tie the bow, though; they'll never tell.

For example:

A present with dimensions 2x3x4 requires 2+2+3+3 = 10 feet of ribbon to wrap the present plus 2*3*4 = 24 feet of ribbon for the bow, for a total of 34 feet.
A present with dimensions 1x1x10 requires 1+1+1+1 = 4 feet of ribbon to wrap the present plus 1*1*10 = 10 feet of ribbon for the bow, for a total of 14 feet.

How many total feet of ribbon should they order?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function giftWrappingMaterials (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  let totalPaper = 0;
  let totalRibbon = 0;

  for (const line of inputArr) {

    const [ a, b, c ] = line.split('x').map(n => +n).sort((a, b) => a - b);

    const surfaceArea = 2 * ((a * b) + (b * c) + (c * a));
    const areaOfSmallestSide = a * b;
    totalPaper += surfaceArea + areaOfSmallestSide;

    const perimeterOfSmallestSide = 2 * (a + b);
    const volume = a * b * c;
    totalRibbon += perimeterOfSmallestSide + volume;
  }

  return part === 1 ? totalPaper                                              // PART 1: RETURN TOTAL PAPER NEEDED
                    : totalRibbon;                                            // PART 2: RETURN TOTAL RIBBON NEEDED
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = giftWrappingMaterials;
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
`2x3x4
1x1x10`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 58 + 43;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1586300;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 34 + 14;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3737498;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);