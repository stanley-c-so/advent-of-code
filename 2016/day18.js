/*

--- Day 18: Like a Rogue ---

As you enter this room, you hear a loud click! Some of the tiles in the floor here seem to be pressure plates for traps, and the trap you just triggered has run out of... whatever it tried to do to you. You doubt you'll be so lucky next time.

Upon closer examination, the traps and safe tiles in this room seem to follow a pattern. The tiles are arranged into rows that are all the same width; you take note of the safe tiles (.) and traps (^) in the first row (your puzzle input).

The type of tile (trapped or safe) in each row is based on the types of the tiles in the same position, and to either side of that position, in the previous row. (If either side is off either end of the row, it counts as "safe" because there isn't a trap embedded in the wall.)

For example, suppose you know the first row (with tiles marked by letters) and want to determine the next row (with tiles marked by numbers):

ABCDE
12345

The type of tile 2 is based on the types of tiles A, B, and C; the type of tile 5 is based on tiles D, E, and an imaginary "safe" tile. Let's call these three tiles from the previous row the left, center, and right tiles, respectively. Then, a new tile is a trap only in one of the following situations:

Its left and center tiles are traps, but its right tile is not.
Its center and right tiles are traps, but its left tile is not.
Only its left tile is a trap.
Only its right tile is a trap.

In any other situation, the new tile is safe.

Then, starting with the row ..^^., you can determine the next row by applying those rules to each new tile:

The leftmost character on the next row considers the left (nonexistent, so we assume "safe"), center (the first ., which means "safe"), and right (the second ., also "safe") tiles on the previous row. Because all of the trap rules require a trap in at least one of the previous three tiles, the first tile on this new row is also safe, ..
The second character on the next row considers its left (.), center (.), and right (^) tiles from the previous row. This matches the fourth rule: only the right tile is a trap. Therefore, the next tile in this new row is a trap, ^.
The third character considers .^^, which matches the second trap rule: its center and right tiles are traps, but its left tile is not. Therefore, this tile is also a trap, ^.
The last two characters in this new row match the first and third rules, respectively, and so they are both also traps, ^.

After these steps, we now know the next row of tiles in the room: .^^^^. Then, we continue on to the next row, using the same rules, and get ^^..^. After determining two new rows, our map looks like this:

..^^.
.^^^^
^^..^

Here's a larger example with ten tiles per row and ten rows:

.^^.^.^^^^
^^^...^..^
^.^^.^.^^.
..^^...^^^
.^^^^.^^.^
^^..^.^^..
^^^^..^^^.
^..^^^^.^^
.^^^..^.^^
^^.^^^..^^

In ten rows, this larger example has 38 safe tiles.

Starting with the map in your puzzle input, in a total of 40 rows (including the starting row), how many safe tiles are there?


--- Part Two ---

How many safe tiles are there in a total of 400000 rows?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function fillOutGridByPreviousRow (part, inputStr, extraParam, DEBUG = false) {
  
  // CONSTANTS
  const H = extraParam;                                                         // PART 1: ACTUAL GRID HAS 40 ROWS; PART 2: IT HAS 400,000 ROWS
  const W = inputStr.length;
  const GRID = Array.from({length: H}, () => Array(W));
  GRID[0] = inputStr.split('');                                                 // init first row based on inputStr
  const TRAP = '^';
  const SAFE = '.';

  // ANALYZE: COMPLETE GRID
  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  for (let row = 1; row < H; ++row) {                                           // NOTE: start at row 1, not 0
    for (let col = 0; col < W; ++col) {
      const left = col === 0 ? SAFE : GRID[row - 1][col - 1];                   // safe if out of bounds, else check corresponding col of previous row
      const right = col === W - 1 ? SAFE : GRID[row - 1][col + 1];
      GRID[row][col] = left !== right ? TRAP : SAFE;                            // if and only if left !== right, we have a trap scenario
                                                                                // NOTE: we don't even care what the tile above the current one is!
    }
  }

  if (DISPLAY_EXTRA_INFO && part === 1) {
    for (const row of GRID) console.log(row.join(''));
  }

  // COUNT SAFE TILES
  let safeCount = 0;
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === SAFE) ++safeCount;
    }
  }
  if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return safeCount;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = fillOutGridByPreviousRow;
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
`..^^.`
);

const sampleInput2 = parseSampleInput(
`.^^.^.^^^^`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 3,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  extraParam: 10,
  DEBUG: true,
};
expected = 38;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 40,
};
expected = 1956;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 400000,
};
expected = 19995121;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);