/*

--- Day 18: Settlers of The North Pole ---

On the outskirts of the North Pole base construction project, many Elves are collecting lumber.

The lumber collection area is 50 acres by 50 acres; each acre can be either open ground (.), trees (|), or a lumberyard (#). You take a scan of the area (your puzzle input).

Strange magic is at work here: each minute, the landscape looks entirely different. In exactly one minute, an open acre can fill with trees, a wooded acre can be converted to a lumberyard, or a lumberyard can be cleared to open ground (the lumber having been sent to other projects).

The change to each acre is based entirely on the contents of that acre as well as the number of open, wooded, or lumberyard acres adjacent to it at the start of each minute. Here, "adjacent" means any of the eight acres surrounding that acre. (Acres on the edges of the lumber collection area might have fewer than eight adjacent acres; the missing acres aren't counted.)

In particular:

An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.
An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards. Otherwise, nothing happens.
An acre containing a lumberyard will remain a lumberyard if it was adjacent to at least one other lumberyard and at least one acre containing trees. Otherwise, it becomes open.

These changes happen across all acres simultaneously, each of them using the state of all acres at the beginning of the minute and changing to their new form by the end of that same minute. Changes that happen during the minute don't affect each other.

For example, suppose the lumber collection area is instead only 10 by 10 acres with this initial configuration:

Initial state:
.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.

After 1 minute:
.......##.
......|###
.|..|...#.
..|#||...#
..##||.|#|
...#||||..
||...|||..
|||||.||.|
||||||||||
....||..|.

After 2 minutes:
.......#..
......|#..
.|.|||....
..##|||..#
..###|||#|
...#|||||.
|||||||||.
||||||||||
||||||||||
.|||||||||

After 3 minutes:
.......#..
....|||#..
.|.||||...
..###|||.#
...##|||#|
.||##|||||
||||||||||
||||||||||
||||||||||
||||||||||

After 4 minutes:
.....|.#..
...||||#..
.|.#||||..
..###||||#
...###||#|
|||##|||||
||||||||||
||||||||||
||||||||||
||||||||||

After 5 minutes:
....|||#..
...||||#..
.|.##||||.
..####|||#
.|.###||#|
|||###||||
||||||||||
||||||||||
||||||||||
||||||||||

After 6 minutes:
...||||#..
...||||#..
.|.###|||.
..#.##|||#
|||#.##|#|
|||###||||
||||#|||||
||||||||||
||||||||||
||||||||||

After 7 minutes:
...||||#..
..||#|##..
.|.####||.
||#..##||#
||##.##|#|
|||####|||
|||###||||
||||||||||
||||||||||
||||||||||

After 8 minutes:
..||||##..
..|#####..
|||#####|.
||#...##|#
||##..###|
||##.###||
|||####|||
||||#|||||
||||||||||
||||||||||

After 9 minutes:
..||###...
.||#####..
||##...##.
||#....###
|##....##|
||##..###|
||######||
|||###||||
||||||||||
||||||||||

After 10 minutes:
.||##.....
||###.....
||##......
|##.....##
|##.....##
|##....##|
||##.####|
||#####|||
||||#|||||
||||||||||

After 10 minutes, there are 37 wooded acres and 31 lumberyards. Multiplying the number of wooded acres by the number of lumberyards gives the total resource value after ten minutes: 37 * 31 = 1147.

What will the total resource value of the lumber collection area be after 10 minutes?


--- Part Two ---

This important natural resource will need to last for at least thousands of years. Are the Elves collecting this lumber sustainably?

What will the total resource value of the lumber collection area be after 1000000000 minutes?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  let GRID = [];                                                              // use let for easy reassignment

  // PARSE INPUT DATA
  for (const line of inputArr) GRID.push(line.split(''));

  // GRID CONSTANTS
  const H = GRID.length;
  const W = GRID[0].length;
  const [ OPEN, WOODED, LUMBER ] = [ '.', '|', '#' ];

  // PART CYCLE DETECTION
  const serializeState = () => GRID.map(row => row.join('')).join('');
  const SEEN = { [serializeState()]: 0 };
  let foundCycle = false;

  // ANALYZE
  const NUM_ROUNDS = part === 1 ? 10
                                : 1000000000;

  for (let t = 1; t <= NUM_ROUNDS; ) {
    const NEW_GRID = Array.from({length: H}, () => Array(W).fill(null));

    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {

        let adjacentOpen = 0;
        let adjacentWooded = 0;
        let adjacentLumber = 0;

        for (let dy = -1; dy <= 1; ++dy) {
          for (let dx = -1 ; dx <= 1; ++dx) {
            if ((dx || dy)
                && 0 <= (row + dy) && (row + dy) < H
                && 0 <= (col + dx) && (col + dx) < W
            ) {
              switch (GRID[row + dy][col + dx]) {
                case OPEN:
                  ++adjacentOpen;
                  break;
                  case WOODED:
                  ++adjacentWooded;
                  break;
                  case LUMBER:
                  ++adjacentLumber;
                  break;
                default:
                  throw `ERROR: UNRECOGNIZED TYPE ${GRID[row + dy][col + dx]}`;
              }
            }
          }
        }

        if (GRID[row][col] === OPEN) {
          NEW_GRID[row][col] = adjacentWooded >= 3 ? WOODED : OPEN;
        }
        if (GRID[row][col] === WOODED) {
          NEW_GRID[row][col] = adjacentLumber >= 3 ? LUMBER : WOODED;
        }
        if (GRID[row][col] === LUMBER) {
          NEW_GRID[row][col] = adjacentLumber >= 1 && adjacentWooded >= 1 ? LUMBER : OPEN;
        }

      }
    }

    GRID = NEW_GRID;
    
    if (!foundCycle) {
      const serializedState = serializeState();
      if (serializedState in SEEN) {
        foundCycle = true;
        const period = t - SEEN[serializedState];
        const remainingTime = NUM_ROUNDS - t;
        console.log(`ON ROUND ${t}, WE FOUND A REPEAT OF A STATE FROM ${SEEN[serializedState]}`);
        t = (NUM_ROUNDS - (remainingTime % period) + 1) - period;             // subtract period ONLY to display a full period at the end
        console.log(`CYCLE PERIOD: ${period}`);
        console.log(`FAST FORWARDING TO t = ${t}`);
        continue;
      }
      SEEN[serializedState] = t;
    }
    else {
      if (DISPLAY_EXTRA_INFO) {
        console.log(`ON t = ${t}:`);
        for (const row of GRID) console.log(row.join(''));
        console.log('');
      }
    }

    ++t;
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log('FINAL STATE:');
    for (const row of GRID) console.log(row.join(''));
  }

  // CALCULATE RESOURCE VALUE
  let totalWooded = 0;
  let totalLumber = 0;
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === WOODED) ++totalWooded;
      if (GRID[row][col] === LUMBER) ++totalLumber;
    }
  }
  return totalWooded * totalLumber;
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
`.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1147;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 519478;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 210824;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);