/*

--- Day 17: No Such Thing as Too Much ---

The elves bought too much eggnog again - 150 liters this time. To fit it all into your refrigerator, you'll need to move it into smaller containers. You take an inventory of the capacities of the available containers.

For example, suppose you have containers of size 20, 15, 10, 5, and 5 liters. If you need to store 25 liters, there are four ways to do it:

15 and 10
20 and 5 (the first 5)
20 and 5 (the second 5)
15, 5, and 5

Filling all containers entirely, how many different combinations of containers can exactly fit all 150 liters of eggnog?


--- Part Two ---

While playing with all the containers in the kitchen, another load of eggnog arrives! The shipping and receiving department is requesting as many containers as you can spare.

Find the minimum number of containers that can exactly fit all 150 liters of eggnog. How many different ways can you fill that number of containers and still hold exactly 150 litres?

In the example above, the minimum number of containers was two. There were three ways to use that many containers, and so the answer there would be 3.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function fillContainersWithEggnog (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  const CONTAINERS = [];
  for (const line of inputArr) CONTAINERS.push(+line);

  let numWays = 0;
  let numContainersUsed = 0;

  let eggnog = extraParam;
  const freq = {};
  const containersUsed = [];                                          // not needed for solution, but helps with debug

  function backtrack(i) {

    // BASE CASE SUCCESS
    if (eggnog === 0) {                                               // if eggnog ever reaches exactly 0, this is a possible way
      ++numWays;

      freq[numContainersUsed] = (freq[numContainersUsed] || 0) + 1;

      if (DISPLAY_EXTRA_INFO && DEBUG) {
        console.log('CONTAINERS USED:', containersUsed);
      }
    }

    // BASE CASE FAIL
    else if (i === CONTAINERS.length) return;                         // if i goes out of bounds without triggering success, then it's a fail

    // RECURSIVE CASE
    else {
      if (eggnog >= CONTAINERS[i]) {                                  // if enough eggnog to use current container, try doing so
        eggnog -= CONTAINERS[i];
        ++numContainersUsed;
        containersUsed.push(i);
        backtrack(i + 1);
        eggnog += CONTAINERS[i];
        --numContainersUsed;
        containersUsed.pop();
      }
      backtrack(i + 1);                                               // you can always try NOT using current container
    }
  }
  backtrack(0);

  return part === 1 ? numWays                                         // PART 1: RETURN NUMBER OF WAYS TO FILL YOUR CONTAINERS
                    : freq[ Math.min(...Object.keys(freq)) ];         // PART 2: RETURN NUMBER OF WAYS TO FILL MIN # OF CONTAINERS
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = fillContainersWithEggnog;
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
`20
15
10
5
5`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 25,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 150,
};
expected = 1638;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 25,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 150,
};
expected = 17;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);