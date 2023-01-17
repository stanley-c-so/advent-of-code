/*

--- Day 18: Like a GIF For Your Yard ---

After the million lights incident, the fire code has gotten stricter: now, at most ten thousand lights are allowed. You arrange them in a 100x100 grid.

Never one to let you down, Santa again mails you instructions on the ideal lighting configuration. With so few lights, he says, you'll have to resort to animation.

Start by setting your lights to the included initial configuration (your puzzle input). A # means "on", and a . means "off".

Then, animate your grid in steps, where each step decides the next configuration based on the current one. Each light's next state (either on or off) depends on its current state and the current states of the eight lights adjacent to it (including diagonals). Lights on the edge of the grid might have fewer than eight neighbors; the missing ones always count as "off".

For example, in a simplified 6x6 grid, the light marked A has the neighbors numbered 1 through 8, and the light marked B, which is on an edge, only has the neighbors marked 1 through 5:

1B5...
234...
......
..123.
..8A4.
..765.

The state a light should have next is based on its current state (on or off) plus the number of neighbors that are on:

A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.
All of the lights update simultaneously; they all consider the same current state before moving to the next.

Here's a few steps from an example configuration of another 6x6 grid:

Initial state:
.#.#.#
...##.
#....#
..#...
#.#..#
####..

After 1 step:
..##..
..##.#
...##.
......
#.....
#.##..

After 2 steps:
..###.
......
..###.
......
.#....
.#....

After 3 steps:
...#..
......
...#..
..##..
......
......

After 4 steps:
......
......
..##..
..##..
......
......

After 4 steps, this example has four lights on.

In your grid of 100x100 lights, given your initial configuration, how many lights are on after 100 steps?


--- Part Two ---

You flip the instructions over; Santa goes on to point out that this is all just an implementation of Conway's Game of Life. At least, it was, until you notice that something's wrong with the grid of lights you bought: four lights, one in each corner, are stuck on and can't be turned off. The example above will actually run like this:

Initial state:
##.#.#
...##.
#....#
..#...
#.#..#
####.#

After 1 step:
#.##.#
####.#
...##.
......
#...#.
#.####

After 2 steps:
#..#.#
#....#
.#.##.
...##.
.#..##
##.###

After 3 steps:
#...##
####.#
..##.#
......
##....
####.#

After 4 steps:
#.####
#....#
...#..
.##...
#.....
#.#..#

After 5 steps:
##.###
.##..#
.##...
.##...
#.#...
##...#

After 5 steps, this example now has 17 lights on.

In your grid of 100x100 lights, given your initial configuration, but with the four corners always in the on state, how many lights are on after 100 steps?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function gameOfLife (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const TURNS = extraParam;
  const [ ON, OFF ] = [ '#', '.' ];
  const H = inputArr.length;
  const W = inputArr[0].length;
  const GRID = [];
  for (const line of inputArr) {
    GRID.push(line.split(''));
  }

  // PART 2: TURN CORNER LIGHTS ON IN THE INITIAL STATE (IMPORTANT!)
  if (part === 2) {
    GRID[0][0] = ON;
    GRID[0][W - 1] = ON;
    GRID[H - 1][0] = ON;
    GRID[H - 1][W - 1] = ON;
  }

  // SIMULATE
  for (let i = 0; i < TURNS; ++i) {
    const NEW_GRID = Array.from({length: H}, () => Array(W).fill(null));

    // iterate through every position
    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {

        if (part === 2                                                          // PART 2: ALWAYS KEEP CORNER LIGHTS ON
            && [ 0, H - 1 ].includes(row)
            && [ 0, W - 1 ].includes(col)
        ) {
          NEW_GRID[row][col] = ON;
        }
        
        else {                                                                  // PART 1: DO REGULAR GAME OF LIFE ANALYSIS

          // count the number of neighbors that are on
          let neighborsOn = 0;
          for (let dy = -1; dy <= 1; ++dy) {
            for (let dx = -1; dx <= 1; ++dx) {
              if (!dy && !dx) continue;
              const [ newRow, newCol ] = [ row + dy, col + dx ];
              if (0 <= newRow && newRow < H && 0 <= newCol && newCol < W        // positions that are out of bounds count as off
                  && GRID[newRow][newCol] === ON
              ) {
                ++neighborsOn;
              }
            }
          }

          // decide on next state
          if (GRID[row][col] === ON) {
            NEW_GRID[row][col] = [ 2, 3 ].includes(neighborsOn) ? ON : OFF;
          } else {
            NEW_GRID[row][col] = neighborsOn === 3 ? ON : OFF;
          }
        }
      }
    }

    // overwrite grid with data from new grid
    for (let row = 0; row < H; ++row) GRID[row] = NEW_GRID[row];

    if (DISPLAY_EXTRA_INFO && DEBUG) {
      console.log(`GRID AFTER TURN ${i + 1}:`)
      for (const row of GRID) {
        console.log(row.join(''));
      }
      console.log('');
    }
  }

  // COUNT THE LIGHTS THAT ARE ON
  let totalOn = 0;
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === ON) ++totalOn;
    }
  }
  return totalOn;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = gameOfLife;
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
`.#.#.#
...##.
#....#
..#...
#.#..#
####..`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 4,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 100,
};
expected = 821;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 5,
  DEBUG: true,
};
expected = 17;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 100,
};
expected = 886;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);