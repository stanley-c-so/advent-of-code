/*

--- Day 3: Perfectly Spherical Houses in a Vacuum ---

Santa is delivering presents to an infinite two-dimensional grid of houses.

He begins by delivering a present to the house at his starting location, and then an elf at the North Pole calls him via radio and tells him where to move next. Moves are always exactly one house to the north (^), south (v), east (>), or west (<). After each move, he delivers another present to the house at his new location.

However, the elf back at the north pole has had a little too much eggnog, and so his directions are a little off, and Santa ends up visiting some houses more than once. How many houses receive at least one present?

For example:

> delivers presents to 2 houses: one at the starting location, and one to the east.
^>v< delivers presents to 4 houses in a square, including twice to the house at his starting/ending location.
^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.


--- Part Two ---

The next year, to speed up the process, Santa creates a robot version of himself, Robo-Santa, to deliver presents with him.

Santa and Robo-Santa start at the same location (delivering two presents to the same starting house), then take turns moving based on instructions from the elf, who is eggnoggedly reading from the same script as the previous year.

This year, how many houses receive at least one present?

For example:

^v delivers presents to 3 houses, because Santa goes north, and then Robo-Santa goes south.
^>v< now delivers presents to 3 houses, and Santa and Robo-Santa end up back where they started.
^v^v^v^v^v now delivers presents to 11 houses, with Santa going one direction and Robo-Santa going the other.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function numberHousesReached (part, inputStr, DEBUG = false) {

  // CONSTANTS
  const DELTAS = {
    '^': [ 0, +1 ],
    'v': [ 0, -1 ],
    '>': [ +1, 0 ],
    '<': [ -1, 0 ],
  };

  // INIT
  const set = new Set();
  let [ santaX, santaY ] = [ 0, 0 ];
  let [ robotX, robotY ] = [ santaX, santaY ];
  set.add(`${santaX},${santaY}`);

  // ANALYZE
  for (let i = 0; i < inputStr.length; ++i) {
    const c = inputStr[i];
    if (!(c in DELTAS)) throw `ERROR: UNRECOGNIZED CHARACTER ${c}`;
    const [ dx, dy ] = DELTAS[c];

    if (part === 2 && i % 2) {                                          // PART 2: EVERY OTHER TURN, ROBOT SANTA MOVES
      robotX += dx;
      robotY += dy;
      set.add(`${robotX},${robotY}`);
    } else {                                                            // PART 1 (OR PART 2, EVERY OTHER TURN): SANTA MOVES
      santaX += dx;
      santaY += dy;
      set.add(`${santaX},${santaY}`);
    }
  }

  return set.size;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = numberHousesReached;
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
`>`
);

const sampleInput2 = parseSampleInput(
`^>v<`
);

const sampleInput3 = parseSampleInput(
`^v^v^v^v^v`
);

const sampleInput4 = parseSampleInput(
`^v`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2081;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 11;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2341;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);