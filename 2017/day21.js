/*

--- Day 21: Fractal Art ---

You find a program trying to generate some art. It uses a strange process that involves repeatedly enhancing the detail of an image through a set of rules.

The image consists of a two-dimensional square grid of pixels that are either on (#) or off (.). The program always begins with this pattern:

.#.
..#
###

Because the pattern is both 3 pixels wide and 3 pixels tall, it is said to have a size of 3.

Then, the program repeats the following process:

If the size is evenly divisible by 2, break the pixels up into 2x2 squares, and convert each 2x2 square into a 3x3 square by following the corresponding enhancement rule.
Otherwise, the size is evenly divisible by 3; break the pixels up into 3x3 squares, and convert each 3x3 square into a 4x4 square by following the corresponding enhancement rule.
Because each square of pixels is replaced by a larger one, the image gains pixels and so its size increases.

The artist's book of enhancement rules is nearby (your puzzle input); however, it seems to be missing rules. The artist explains that sometimes, one must rotate or flip the input pattern to find a match. (Never rotate or flip the output pattern, though.) Each pattern is written concisely: rows are listed as single units, ordered top-down, and separated by slashes. For example, the following rules correspond to the adjacent patterns:

../.#  =  ..
          .#

                .#.
.#./..#/###  =  ..#
                ###

                        #..#
#..#/..../#..#/.##.  =  ....
                        #..#
                        .##.
When searching for a rule to use, rotate and flip the pattern as necessary. For example, all of the following patterns match the same rule:

.#.   .#.   #..   ###
..#   #..   #.#   ..#
###   ###   ##.   .#.

Suppose the book contained the following two rules:

../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#

As before, the program begins with this pattern:

.#.
..#
###

The size of the grid (3) is not divisible by 2, but it is divisible by 3. It divides evenly into a single square; the square matches the second rule, which produces:

#..#
....
....
#..#

The size of this enhanced grid (4) is evenly divisible by 2, so that rule is used. It divides evenly into four squares:

#.|.#
..|..
--+--
..|..
#.|.#

Each of these squares matches the same rule (../.# => ##./#../...), three of which require some flipping and rotation to line up with the rule. The output for the rule is the same in all four cases:

##.|##.
#..|#..
...|...
---+---
##.|##.
#..|#..
...|...

Finally, the squares are joined into a new grid:

##.##.
#..#..
......
##.##.
#..#..
......

Thus, after 2 iterations, the grid contains 12 pixels that are on.

How many pixels stay on after 5 iterations?


--- Part Two ---

How many pixels stay on after 18 iterations?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function fractalPixelArt (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const RULES = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ input, output ] = line.split(' => ');
    RULES[input] = output;
  }

  // HELPER FUNCTION - CONVERT SERIAL TO GRID
  function serialToGrid(serial) {
    const rows = serial.split('/');
    return rows.map(row => row.split(''));
  }

  // HELPER FUNCTION - CONVERT GRID TO SERIAL
  function gridToSerial(grid) {
    const output = [];
    for (const row of grid) output.push(row.join(''));
    return output.join('/');
  }

  // HELPER FUNCTION - ROTATE A GRID 90 DEGREES CLOCKWISE
  function rotateGridCW(grid) {
    const N = grid.length;
    for (let row = 0; row < Math.floor(N/2); ++row) {                                                         // for odd numbers, skip middle row...
      for (let col = 0; col < N/2; ++col) {                                                                   // ...but don't skip middle column
                                                                                                              // (or vice versa works too)
        [
          grid[row][col],
          grid[col][N - 1 - row],
          grid[N - 1 - row][N - 1 - col],
          grid[N - 1 - col][row],
        ] = [
          grid[N - 1 - col][row],
          grid[row][col],
          grid[col][N - 1 - row],
          grid[N - 1 - row][N - 1 - col],
        ];
      }
    }
    return grid;
  }

  // HELPER FUNCTION - FLIP A GRID HORIZONTALLY
  function flipGridHorizontally(grid) {
    const N = grid.length;
    for (let row = 0; row < N; ++row) {
      for (let col = 0; col < N/2; ++col) {
        [ grid[row][col], grid[row][N - 1 - col] ] = [ grid[row][N - 1 - col], grid[row][col] ];
      }
    }
    return grid;
  }

  // CONSTANTS
  const NUM_ROUNDS = extraParam;                                                                              // REAL DATA PART 1: 5; PART 2: 18
  const ON = '#';
  const GRID_STARTING_STR =                                                                                   // this is given by the prompt
`.#.
..#
###`;

  // INIT DATA STRUCTURE
  let GRID = GRID_STARTING_STR.split('\n').map(row => row.split(''));                                         // declare with let for reassignment

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  for (let i = 0; i < NUM_ROUNDS; ++i) {

    // CURRENT GRID CONSTANTS
    const N = GRID.length;
    const pieceSize = N % 2 ? 3 : 2;

    // INIT NEW GRID
    const NEW_N = N / pieceSize * (pieceSize + 1);                                                            // i.e. N / 2 * 3, or N / 3 * 4
    const NEW_GRID = Array.from({length: NEW_N}, () => Array(NEW_N).fill(null));

    for (let row = 0; row < N; row += pieceSize) {
      for (let col = 0; col < N; col += pieceSize) {

        // GET PIECE BEING EXAMINED
        const PIECE = [];
        for (let r = row; r < row + pieceSize; ++r) {
          PIECE.push(GRID[r].slice(col, col + pieceSize));
        }

        // ROTATE/FLIP IT UNTIL ITS SERIAL IS FOUND IN THE RULES OBJECT
        let rotations = 0;
        while (!(gridToSerial(PIECE) in RULES) && rotations < 3) {                                            // first try up to 3 rotations...
          rotateGridCW(PIECE);
          ++rotations;
        }
        if (!(gridToSerial(PIECE) in RULES)) flipGridHorizontally(PIECE);                                     // ...then flip and try again...
        while (!(gridToSerial(PIECE) in RULES) && rotations < 6) {                                            // ...then try up to 3 more rotations
          rotateGridCW(PIECE);
          ++rotations;
        }
        if (!(gridToSerial(PIECE) in RULES)) {
          throw `ERROR: DID NOT FIND MATCH FOR PIECE ${gridToSerial(PIECE)} ON ROW ${row}, COL ${col}`;
        }
        
        // FINALLY, DRAW CORRESPONDING NEW PIECE INTO PROPER LOCATION IN NEW GRID
        const NEW_PIECE = serialToGrid(RULES[gridToSerial(PIECE)]);
        const rowSector = Math.floor(row / pieceSize);
        const colSector = Math.floor(col / pieceSize);
        const rowOffset = rowSector * (pieceSize + 1);
        const colOffset = colSector * (pieceSize + 1);
        for (let row = 0; row < (pieceSize + 1); ++row) {
          for (let col = 0; col < (pieceSize + 1); ++col) {
            NEW_GRID[row + rowOffset][col + colOffset] = NEW_PIECE[row][col];
          }
        }
      }
    }
    
    GRID = NEW_GRID;

    if (DISPLAY_EXTRA_INFO && part === 1) {
      console.log(`AFTER i ${i}`);
      for (const row of GRID) console.log(row.join(' '));
      console.log('');
    }
  }

  // CALCULATE NUMBER OF PIXELS THAT ARE ON
  let numOn = 0;
  for (const row of GRID) {
    for (const c of row) {
      if (c === ON) ++numOn;
    }
  }
  if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return numOn;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = fractalPixelArt;
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
`../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 2,
  DEBUG: true,
};
expected = 12;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 5,
};
expected = 188;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 18,
};
expected = 2758764;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);