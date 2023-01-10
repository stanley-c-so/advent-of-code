/*

--- Day 1: No Time for a Taxicab ---

Santa's sleigh uses a very high-precision clock to guide its movements, and the clock's oscillator is regulated by stars. Unfortunately, the stars have been stolen... by the Easter Bunny. To save Christmas, Santa needs you to retrieve all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You're airdropped near Easter Bunny Headquarters in a city somewhere. "Near", unfortunately, is as close as you can get - the instructions on the Easter Bunny Recruiting Document the Elves intercepted start here, and nobody had time to work them out further.

The Document indicates that you should start at the given coordinates (where you just landed) and face North. Then, follow the provided sequence: either turn left (L) or right (R) 90 degrees, then walk forward the given number of blocks, ending at a new intersection.

There's no time to follow such ridiculous instructions on foot, though, so you take a moment and work out the destination. Given that you can only walk on the street grid of the city, how far is the shortest path to the destination?

For example:

Following R2, L3 leaves you 2 blocks East and 3 blocks North, or 5 blocks away.
R2, R2, R2 leaves you 2 blocks due South of your starting position, which is 2 blocks away.
R5, L5, R5, R3 leaves you 12 blocks away.

How many blocks away is Easter Bunny HQ?


--- Part Two ---

Then, you notice the instructions continue on the back of the Recruiting Document. Easter Bunny HQ is actually at the first location you visit twice.

For example, if your instructions are R8, R4, R4, R8, the first location you visit twice is 4 blocks away, due East.

How many blocks away is the first location you visit twice?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function findBunnyHQ (part, inputStr, DEBUG = false) {

  // CONSTANTS
  const DELTAS = [                                                      // i.e. [ dy, dx ]
    [ +1, 0 ],
    [ 0, +1 ],
    [ -1, 0 ],
    [ 0, -1 ],
  ];

  // INIT
  let dir = 0;
  let [ y, x ] = [ 0, 0 ];
  const visited = new Set([`${y},${x}`]);                               // PART 2: track locations that have been visited
  let part2Done = false;                                                // needed to fully break out of nested loop

  // ANALYZE
  for (const instruction of inputStr.split(', ')) {
    const rotation = instruction[0];
    const steps = +instruction.slice(1);

    if (rotation === 'L') dir = (dir + 4 - 1) % 4;
    else if (rotation === 'R') dir = (dir + 1) % 4;
    else throw `ERROR: UNRECOGNIZED ROTATION ${rotation}`;
    
    const [ dy, dx ] = DELTAS[dir];
    for (let i = 0; i < steps; ++i) {
      y += dy;
      x += dx;
      const serial = `${y},${x}`;
      if (part === 2 && visited.has(serial)) {                          // PART 2: STOP IMMEDIATELY IF REVISITING A LOCATION
        part2Done = true;
        break;
      }
      visited.add(serial);
    }
    if (part2Done) break;
  }

  return Math.abs(y) + Math.abs(x);                                     // PART 1: GET MANHATTAN DISTANCE AFTER INSTRUCTIONS
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findBunnyHQ;
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
`R2, L3`
);

const sampleInput2 = parseSampleInput(
`R2, R2, R2`
);

const sampleInput3 = parseSampleInput(
`R5, L5, R5, R3`
);

const sampleInput4 = parseSampleInput(
`R8, R4, R4, R8`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 12;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 161;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 110;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);