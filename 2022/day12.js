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

// ========== SOLUTION 1: BECAUSE JAVASCRIPT HAS NO BUILT-IN QUEUE CLASS, USE AN ARRAY WITH POINTER FOR O(1) DEQUEUE, AT COST OF SPACE

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
  const possibleStarts = [];                                                          // will be filled in during input parsing

  // elevation map
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const HEIGHTS = { 'S': 0, 'E': 25 };
  for (let i = 0; i < 26; ++i) HEIGHTS[ALPHABET[i]] = i;

  // PARSE INPUT
  let inputStartRow = null, inputStartCol = null;                                     // will be discovered during input parsing
  let endRow = null, endCol = null;                                                   // will be discovered during input parsing
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === 'S') [inputStartRow, inputStartCol] = [row, col];        // PART 1: discover input start
      if (GRID[row][col] === 'E') [endRow, endCol] = [row, col];                      // discover end
      if (HEIGHTS[GRID[row][col]] === 0) possibleStarts.push([row, col]);             // PART 2: discover input start OR 'a'
    }
  }
  if ([ inputStartRow, inputStartCol ].includes(null)) {                              // sanity check to make sure input start was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF INPUT START';
  }
  if ([ endRow, endCol ].includes(null)) {                                            // sanity check to make sure end was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF END';
  }

  // HELPER
  function getBestPathStartingAt(startRow, startCol) {

    // init
    const Q = [ [startRow, startCol, 0] ];                                            // pseudo queue with moving pointer
    let qPtr = 0;
    const visited = new Set();

    // BFS
    while (Q.length > qPtr) {
      const [row, col, moves] = Q[qPtr++];                                            // dequeue

      if (row === endRow && col === endCol) return moves;                             // END CONDITION: REACHED END

      const serial = `${row},${col}`;                                                 // check against visited coords to prevent cycles
      if (visited.has(serial)) continue;
      visited.add(serial);

      const height = HEIGHTS[GRID[row][col]];                                         // get height of current position

      for (const [dy, dx] of DIRS) {                                                  // attempt to visit 4 neighbors
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        if (
          0 <= newRow && newRow < H && 0 <= newCol && newCol < W                      // target destination must be in bounds...
          && HEIGHTS[GRID[newRow][newCol]] <= height + 1                              // ...and not more than 1 elevation higher
        ) {
          Q.push([newRow, newCol, moves + 1]);
        }
      }
    }

    return Infinity;                                                                  // Infinity indicates that no path exists
  }

  if (part === 1) {                                                                   // PART 1: GET BEST PATH STARTING AT INPUT START

    const best = getBestPathStartingAt(inputStartRow, inputStartCol);
    if (best === Infinity) throw 'ERROR: DID NOT FIND PATH';                          // sanity check to make sure a path exists
    return best;

  } else {                                                                            // PART 2: GET BEST PATH AMONG ALL POSSIBLE STARTS

    let best = Infinity;
    for (const [row, col] of possibleStarts) {
      best = Math.min(best, getBestPathStartingAt(row, col));                         // NOTE: some starts may not have a valid path!
    }
    return best;

  }
}


// ========== CLASSES USED IN SUBSEQUENT SOLUTIONS

class Node {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class Queue {
  constructor(val) {
    this.head = null;
    this.tail = null;
    this.length = 0;
    if (val) this.enqueue(val);
  }
  enqueue(val) {
    const node = new Node(val);
    if (this.isEmpty()) this.head = node;
    else this.tail.next = node;
    this.tail = node;
    ++this.length;
  }
  dequeue() {
    if (this.isEmpty()) return null;
    const node = this.head;
    this.head = this.head.next;
    --this.length;
    if (this.isEmpty()) this.tail = null;
    return node;
  }
  isEmpty() {
    return this.length === 0;
  }
}

// ========== SOLUTION 2: SAME SOLUTION, BUT BUILD A LEGITIMATE QUEUE CLASS TO IMPROVE SPACE COMPLEXITY

function elevationBFS2 (part, inputStr, DEBUG = false) {
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
  const possibleStarts = [];                                                          // will be filled in during input parsing

  // elevation map
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const HEIGHTS = { 'S': 0, 'E': 25 };
  for (let i = 0; i < 26; ++i) HEIGHTS[ALPHABET[i]] = i;

  // PARSE INPUT
  let inputStartRow = null, inputStartCol = null;                                     // will be discovered during input parsing
  let endRow = null, endCol = null;                                                   // will be discovered during input parsing
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === 'S') [inputStartRow, inputStartCol] = [row, col];        // PART 1: discover input start
      if (GRID[row][col] === 'E') [endRow, endCol] = [row, col];                      // discover end
      if (HEIGHTS[GRID[row][col]] === 0) possibleStarts.push([row, col]);             // PART 2: discover input start OR 'a'
    }
  }
  if ([ inputStartRow, inputStartCol ].includes(null)) {                              // sanity check to make sure input start was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF INPUT START';
  }
  if ([ endRow, endCol ].includes(null)) {                                            // sanity check to make sure end was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF END';
  }

  // HELPER
  function getBestPathStartingAt(startRow, startCol) {

    // init
    const Q = new Queue([startRow, startCol, 0]);
    const visited = new Set();

    // BFS
    while (!Q.isEmpty()) {
      const node = Q.dequeue();                                                       // dequeue
      const [row, col, moves] = node.val;                                             // extract data from node

      if (row === endRow && col === endCol) return moves;                             // END CONDITION: REACHED END

      const serial = `${row},${col}`;                                                 // check against visited coords to prevent cycles
      if (visited.has(serial)) continue;
      visited.add(serial);

      const height = HEIGHTS[GRID[row][col]];                                         // get height of current position

      for (const [dy, dx] of DIRS) {                                                  // attempt to visit 4 neighbors
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        if (
          0 <= newRow && newRow < H && 0 <= newCol && newCol < W                      // target destination must be in bounds...
          && HEIGHTS[GRID[newRow][newCol]] <= height + 1                              // ...and not more than 1 elevation higher
        ) {
          Q.enqueue([newRow, newCol, moves + 1]);
        }
      }
    }

    return Infinity;                                                                  // Infinity indicates that no path exists
  }

  if (part === 1) {                                                                   // PART 1: GET BEST PATH STARTING AT INPUT START

    const best = getBestPathStartingAt(inputStartRow, inputStartCol);
    if (best === Infinity) throw 'ERROR: DID NOT FIND PATH';                          // sanity check to make sure a path exists
    return best;

  } else {                                                                            // PART 2: GET BEST PATH AMONG ALL POSSIBLE STARTS

    let best = Infinity;
    for (const [row, col] of possibleStarts) {
      best = Math.min(best, getBestPathStartingAt(row, col));                         // NOTE: some starts may not have a valid path!
    }
    return best;

  }
}


// ========== SOLUTION 3: SAME SOLUTION FOR PART 1; IN PART 2, START AT THE END, AND END ON ANY COORD WITH ELEVATION 0

function elevationBFS3 (part, inputStr, DEBUG = false) {
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

  // elevation map
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const HEIGHTS = { 'S': 0, 'E': 25 };
  for (let i = 0; i < 26; ++i) HEIGHTS[ALPHABET[i]] = i;

  // PARSE INPUT
  let inputStartRow = null, inputStartCol = null;                                     // will be discovered during input parsing
  let endRow = null, endCol = null;                                                   // will be discovered during input parsing
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (GRID[row][col] === 'S') [inputStartRow, inputStartCol] = [row, col];        // PART 1: discover input start
      if (GRID[row][col] === 'E') [endRow, endCol] = [row, col];                      // discover end
    }
  }
  if ([ inputStartRow, inputStartCol ].includes(null)) {                              // sanity check to make sure input start was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF INPUT START';
  }
  if ([ endRow, endCol ].includes(null)) {                                            // sanity check to make sure end was found
    throw 'ERROR: DID NOT DISCOVER COORDS OF END';
  }

  // HELPER
  function getBestPathStartingAt(startRow, startCol, traversalCB, terminationCB) {

    // init
    const Q = new Queue([startRow, startCol, 0]);
    const visited = new Set();

    // BFS
    while (!Q.isEmpty()) {
      const node = Q.dequeue();                                                       // dequeue
      const [row, col, moves] = node.val;                                             // extract data from node

      if (terminationCB(row, col)) return moves;                                      // END CONDITION: BASED ON TERMINATION CALLBACK

      const serial = `${row},${col}`;                                                 // check against visited coords to prevent cycles
      if (visited.has(serial)) continue;
      visited.add(serial);

      const height = HEIGHTS[GRID[row][col]];                                         // get height of current position

      for (const [dy, dx] of DIRS) {                                                  // attempt to visit 4 neighbors
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        if (
          0 <= newRow && newRow < H && 0 <= newCol && newCol < W                      // target destination must be in bounds...
          && traversalCB(newRow, newCol, height)                                      // ...and destination is accessible based on traversal logic
        ) {
          Q.enqueue([newRow, newCol, moves + 1]);
        }
      }
    }

    return Infinity;                                                                  // Infinity indicates that no path exists
  }

  if (part === 1) {                                                                   // PART 1: GET BEST PATH STARTING AT INPUT START

    const traversalCB = (row, col, h) => HEIGHTS[GRID[row][col]] <= h + 1;            // PART 1: target must be at most 1 elevation higher
    const terminationCB = (row, col) => row === endRow && col === endCol;             // PART 1: callback checks if coord matches end coords
    
    const best = getBestPathStartingAt( inputStartRow,
                                        inputStartCol,
                                        traversalCB,
                                        terminationCB);
    if (best === Infinity) throw 'ERROR: DID NOT FIND PATH';                          // sanity check to make sure a path exists
    return best;
    
  } else {                                                                            // PART 2: GET BEST PATH AMONG ALL POSSIBLE STARTS
    
    // clever trick: work backward! start at the end, and terminate when landing on any coords with elevation 0.

    const traversalCB = (row, col, h) => HEIGHTS[GRID[row][col]] >= h - 1;            // PART 2: target must be at least 1 elevation lower
    const terminationCB = (row, col) => HEIGHTS[GRID[row][col]] === 0;                // PART 2: callback checks if coord matches and 0 elevation

    return getBestPathStartingAt( endRow,                                             // no need for sanity check since some path must exist from part 1
                                  endCol,
                                  traversalCB,
                                  terminationCB);

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = elevationBFS;
// const func = elevationBFS2;
const func = elevationBFS3;
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