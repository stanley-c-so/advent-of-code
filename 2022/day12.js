/*

--- Day 12: Hill Climbing Algorithm ---

You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above broken into a GRID; the elevation of each square of the GRID is given by a single lowercase letter, where a is the lowest elevation, b is the next-lowest, and so on up to the highest elevation, z.

Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower than the elevation of your current square.)

For example:

Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi

Here, you start in the top-left corner; your goal is near the middle. You could start by moving down or right, but eventually you'll need to head toward the e at the bottom. From there, you can spiral around to the goal:

v..v<<<<
>v.vv<<^
.>vv>E^^
..v>>>^^
..>>>>>^

In the above diagram, the symbols indicate whether the path exits each square moving up (^), down (v), left (<), or right (>). The location that should get the best signal is still E, and . marks unvisited squares.

This path reaches the goal in 31 steps, the fewest possible.

What is the fewest steps required to move from your current position to the location that should get the best signal?


--- Part Two ---

As you walk up the hill, you suspect that the Elves will want to turn this into a hiking trail. The beginning isn't very scenic, though; perhaps you can find a better starting point.

To maximize exercise while hiking, the trail should start as low as possible: elevation a. The goal is still the square marked E. However, the trail should still be direct, taking the fewest steps to reach its goal. So, you'll need to find the shortest path from any square at elevation a to the square marked E.

Again consider the example from above:

Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi

Now, there are six choices for starting position (five marked a, plus the square marked S that counts as being at elevation a). If you start at the bottom-left square, you can reach the goal most quickly:

...v<<<<
...vv<<^
...v>E^^
.>v>>>^^
>^>>>>>^

This path reaches the goal in only 29 steps, the fewest possible.

What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?
*/

function elevationBFS (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // INIT

  // grid and grid traversal
  const GRID = inputArr.map(str => str.split(''));
  const H = GRID.length;
  const W = GRID[0].length;
  const DIRS = [ [0, +1], [0, -1], [+1, 0], [-1, 0] ];
  const possibleStarts = [];                                                        // will be filled in during input parsing

  // elevation map
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const HEIGHTS = { 'S': 0, 'E': 25 };
  for (let i = 0; i < 26; ++i) HEIGHTS[ALPHABET[i]] = i;

  // PARSE INPUT
  let inputStartRow, inputStartCol;                                                 // will be discovered during input parsing
  let endRow, endCol;                                                               // will be discovered during input parsing
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === 'S') [inputStartRow, inputStartCol] = [row, col];      // PART 1: discover input start
      if (GRID[row][col] === 'E') [endRow, endCol] = [row, col];                    // discover end
      if (HEIGHTS[GRID[row][col]] === 0) possibleStarts.push([row, col]);           // PART 2: discover input start OR 'a'
    }
  }
  if ([ inputStartRow, inputStartCol ].includes(undefined)) {                       // sanity check to make sure input start was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF INPUT START';
  }
  if ([ endRow, endCol ].includes(undefined)) {                                     // sanity check to make sure end was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF END';
  }

  // HELPER
  function getBestPathStartingAt(startRow, startCol) {

    // init
    const Q = [ [startRow, startCol, 0] ];                                          // pseudo queue with moving pointer
    let qPtr = 0;
    const visited = new Set();

    // BFS
    while (Q.length > qPtr) {
      const [r, c, moves] = Q[qPtr++];                                              // dequeue

      if (r === endRow && c === endCol) return moves;                               // END CONDITION: REACHED END

      const serial = `${r},${c}`;                                                   // check against visited coords to prevent cycles
      if (visited.has(serial)) continue;
      visited.add(serial);

      const height = HEIGHTS[GRID[r][c]];                                           // get height of current position

      for (const [dy, dx] of DIRS) {                                                // attempt to visit 4 neighbors
        const newY = r + dy;
        const newX = c + dx;
        if (
          0 <= newY && newY < H && 0 <= newX && newX < W                            // target destination must be in bounds...
          && HEIGHTS[GRID[newY][newX]] <= height + 1                                // ...and not more than 1 elevation higher
        ) {
          Q.push([newY, newX, moves + 1]);
        }
      }
    }

    if (part === 1) throw 'ERROR: DID NOT FIND PATH';                               // PART 1: sanity check to make sure a path exists
    else return Infinity;                                                           // PART 2: some starts may not have a valid path!
  }

  if (part === 1) {                                                                 // PART 1: GET BEST PATH STARTING AT INPUT START

    return getBestPathStartingAt(inputStartRow, inputStartCol);

  } else {                                                                          // PART 2: GET BEST PATH AMONG ALL POSSIBLE STARTS

    let best = Infinity;
    for (const [row, col] of possibleStarts) {
      best = Math.min(best, getBestPathStartingAt(row, col));                       // if start has no path, function returns Infinity
    }
    return best;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = elevationBFS;
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
`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 31;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 456;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 29;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 454;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);