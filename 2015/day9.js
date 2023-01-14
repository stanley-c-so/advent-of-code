/*

--- Day 9: All in a Single Night ---

Every year, Santa manages to deliver all of his presents in a single night.

This year, however, he has some new locations to visit; his elves have provided him the distances between every pair of locations. He can start and end at any two (different) locations he wants, but he must visit each location exactly once. What is the shortest distance he can travel to achieve this?

For example, given the following distances:

London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141

The possible routes are therefore:

Dublin -> London -> Belfast = 982
London -> Dublin -> Belfast = 605
London -> Belfast -> Dublin = 659
Dublin -> Belfast -> London = 659
Belfast -> Dublin -> London = 605
Belfast -> London -> Dublin = 982

The shortest of these is London -> Dublin -> Belfast = 605, and so the answer is 605 in this example.

What is the distance of the shortest route?


--- Part Two ---

The next year, just to show off, Santa decides to take the route with the longest distance instead.

He can still start and end at any two (different) locations he wants, and he still must visit each location exactly once.

For example, given the distances above, the longest route would be 982 via (for example) Dublin -> London -> Belfast.

What is the distance of the longest route?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const LOCATIONS = new Set();
  const DISTANCES = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const split = line.split(' ');
    const [ A, B, distance ] = [ split[0], split[2], +split[4] ];

    LOCATIONS.add(A);
    LOCATIONS.add(B);

    if (!(A in DISTANCES)) DISTANCES[A] = {};
    if (!(B in DISTANCES)) DISTANCES[B] = {};
    DISTANCES[A][B] = distance;
    DISTANCES[B][A] = distance;
  }

  // INIT
  let shortestPath = Infinity;
  let longestPath = 0;
  let distance = 0;

  // ANALYZE EVERY PERMUTATION
  const path = [];                                                    // this is not needed for our solution, but it helps for debugging
  const visited = new Set();
  
  function backtrack(currentLocation) {

    // BASE CASE
    if (visited.size === LOCATIONS.size) {

      if (DISPLAY_EXTRA_INFO && DEBUG) {
        console.log('PATH:', path.join(' -> '));
        console.log('distance:', distance);
        console.log('-----');
      }

      shortestPath = Math.min(shortestPath, distance);
      longestPath = Math.max(longestPath, distance);
    }

    // RECURSIVE CASE
    else {
      for (const next of LOCATIONS) {
        if (!visited.has(next)) {
          path.push(next);
          visited.add(next);
          distance += DISTANCES[currentLocation][next];
          backtrack(next);
          path.pop();
          visited.delete(next);
          distance -= DISTANCES[currentLocation][next];
        }
      }
    }
  }
  for (const start of LOCATIONS) {                                    // for each location, set it as start, then kick start backtrack
    path.push(start);
    visited.add(start);
    backtrack(start);
    path.pop();
    visited.delete(start);
  }

  return part === 1 ? shortestPath                                    // PART 1: GET SHORTEST PATH LENGTH
                    : longestPath;                                    // PART 2: GET LONGEST PATH LENGTH
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
`London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 605;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 207;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 982;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 804;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);