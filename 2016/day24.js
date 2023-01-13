/*

--- Day 24: Air Duct Spelunking ---

You've finally met your match; the doors that provide access to the roof are locked tight, and all of the controls and related electronics are inaccessible. You simply can't reach them.

The robot that cleans the air ducts, however, can.

It's not a very fast little robot, but you reconfigure it to be able to interface with some of the exposed wires that have been routed through the HVAC system. If you can direct it to each of those locations, you should be able to bypass the security controls.

You extract the duct layout for this area from some blueprints you acquired and create a map with the relevant locations marked (your puzzle input). 0 is your current location, from which the cleaning robot embarks; the other numbers are (in no particular order) the locations the robot needs to visit at least once each. Walls are marked as #, and open passages are marked as .. Numbers behave like open passages.

For example, suppose you have a map like the following:

###########
#0.1.....2#
#.#######.#
#4.......3#
###########

To reach all of the points of interest as quickly as possible, you would have the robot take the following path:

0 to 4 (2 steps)
4 to 1 (4 steps; it can't move diagonally)
1 to 2 (6 steps)
2 to 3 (2 steps)

Since the robot isn't very fast, you need to find it the shortest route. This path is the fewest steps (in the above example, a total of 14) required to start at 0 and then visit every other location at least once.

Given your actual map, and starting from location 0, what is the fewest number of steps required to visit every non-0 number marked on the map at least once?


--- Part Two ---

Of course, if you leave the cleaning robot somewhere weird, someone is bound to notice.

What is the fewest number of steps required to start at 0, visit every non-0 number marked on the map at least once, and then return to 0?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function travelingSalesman (part, inputStr, DEBUG = false) {

  // CONSTANTS
  const DIRS = [
    [ +1, 0 ],
    [ -1, 0 ],
    [ 0, +1 ],
    [ 0, -1 ],
  ];
  const WALL = '#';
  const FLOOR = '.';

  // DATA STRUCTURES
  const checkpointsDict = {};

  // PARSE INPUT DATA, BUILD GRID, DISCOVER CHECKPOINT VALUES
  const inputArr = inputStr.split('\r\n');
  const H = inputArr.length;
  const W = inputArr[0].length;
  const GRID = Array.from({length: H}, () => Array(W));
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      const symbol = inputArr[row][col]
      GRID[row][col] = symbol;
      if (![WALL, FLOOR].includes(symbol)) {
        checkpointsDict[symbol] = [ row, col ];
      }
    }
  }

  // DISCOVERED CONSTANTS
  const NUM_CHECKPOINTS = Object.keys(checkpointsDict).length;

  // PRE-PROCESSING: RUN BFS FROM ALL CHECKPOINTS TO FIND SHORTEST DISTANCES BETWEEN INDIVIDUAL CHECKPOINTS
  const shortestDistanceBetween = {};
  function BFS(start) {
    const shortestDistanceTo = {};
    const startSerial = checkpointsDict[start].join(',');
    const Q = new Queue([ ...checkpointsDict[start], 0 ]);
    const visited = new Set();
    let destinationsFound = 1;
    while (!Q.isEmpty()) {
      const [ row, col, moves ] = Q.dequeue().val;
      const serial = `${row},${col}`;

      if (visited.has(serial)) continue;
      visited.add(serial);

      if (!isNaN(GRID[row][col]) && serial !== startSerial) {
        ++destinationsFound;
        shortestDistanceTo[GRID[row][col]] = moves;
        if (destinationsFound === NUM_CHECKPOINTS) {
          return shortestDistanceTo;
        }
      }

      for (const [ dy, dx ] of DIRS) {
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        if (0 <= newRow && newRow < H && 0 <= newCol && newCol < W
            && GRID[newRow][newCol] !== WALL
        ) {
          Q.enqueue([ newRow, newCol, moves + 1 ]);
        }
      }
    }
    throw 'ERROR: UNEXPECTED TERMINATION OF BFS';
  }
  for (let checkpoint = 0; checkpoint < NUM_CHECKPOINTS; ++checkpoint) {
    shortestDistanceBetween[checkpoint] = BFS(checkpoint);
  }
  
  // ANALYZE: FOR EVERY POSSIBLE CHECKPOINT PERMUTATION (ALWAYS BEGIN WITH 0), FIND PATH LENGTH; GET MIN LENGTH
  let shortestPathLength = Infinity;
  const path = [ 0 ];                                                         // path always starts with 0
  const visited = new Set(path);

  function backtrack() {

    // BASE CASE
    if (path.length === NUM_CHECKPOINTS) {

      // calculate length of path from start to last element
      let pathLength = 0;
      for (let i = 0; i < path.length - 1; ++i) {                             // skip last element
        pathLength += shortestDistanceBetween[ path[i] ][ path[i + 1] ];
      }

      // PART 2: add trip back to start
      pathLength += part === 1  ? 0                                           // PART 1: BOT STOPS AFTER REACHING FINAL CHECKPOINT
                                : shortestDistanceBetween[path.at(-1)][0];    // PART 2: BOT HAS TO RETURN TO CHECKPOINT 0

      shortestPathLength = Math.min(shortestPathLength, pathLength);          // update best variable
    }
    
    // RECURSIVE CASE
    else {
      for (let next = 1; next < NUM_CHECKPOINTS; ++next) {                    // try every other checkpoint
        if (!visited.has(next)) {
          visited.add(next);
          path.push(next);
          backtrack();
          visited.delete(next);
          path.pop();
        }
      }
    }
  }

  backtrack();                                                                // kick-start backtrack
  return shortestPathLength;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = travelingSalesman;
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
`###########
#0.1.....2#
#.#######.#
#4.......3#
###########`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 14;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 500;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 20;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 748;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);