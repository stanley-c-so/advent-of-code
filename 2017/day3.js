/*

--- Day 3: Spiral Memory ---

You come across an experimental new kind of memory stored on an infinite two-dimensional grid.

Each square on the grid is allocated in a spiral pattern starting at a location marked 1 and then counting up while spiraling outward. For example, the first few squares are allocated like this:

17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...

While this is very space-efficient (no squares are skipped), requested data must be carried back to square 1 (the location of the only access port for this memory system) by programs that can only move up, down, left, or right. They always take the shortest path: the Manhattan Distance between the location of the data and square 1.

For example:

Data from square 1 is carried 0 steps, since it's at the access port.
Data from square 12 is carried 3 steps, such as: down, left, left.
Data from square 23 is carried only 2 steps: up twice.
Data from square 1024 must be carried 31 steps.

How many steps are required to carry the data from the square identified in your puzzle input all the way to the access port?


--- Part Two ---

As a stress test on the system, the programs here clear the grid and then store the value 1 in square 1. Then, in the same allocation order as shown above, they store the sum of the values in all adjacent squares, including diagonals.

So, the first few squares' values are chosen as follows:

Square 1 starts with the value 1.
Square 2 has only one adjacent filled square (with value 1), so it also stores 1.
Square 3 has both of the above squares as neighbors and stores the sum of their values, 2.
Square 4 has all three of the aforementioned squares as neighbors and stores the sum of their values, 4.
Square 5 only has the first and fourth squares as neighbors, so it gets the value 5.
Once a square is written, its value does not change. Therefore, the first few squares would receive the following values:

147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...

What is the first value written that is larger than your puzzle input?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function infiniteGridSpiralTraversal (part, inputStr, DEBUG = false) {
  const GOAL = +inputStr;

  const DIRS = [
    [ 0, +1 ],
    [ -1, 0 ],
    [ 0, -1 ],
    [ +1, 0 ],
  ];

  const MEMO = {};

  let n = 1;
  
  // INFINITE GRID TRAVERSAL STATE VARIABLES
  let [ row, col ] = [ 0, 0 ];
  let dir = 0;
  let distanceToNextTurningPoint = 1;
  let sideLen = 1;
  let alternator = true;
  
  const serialize = (row, col) => `${row},${col}`;

  const LIMIT = part === 1  ? GOAL                                    // PART 1: STOP TRAVERSING WHEN YOU HIT GOAL
                            : Infinity;                               // PART 2: DON'T STOP TRAVERSING (UNTIL CONDITION BREAKS OUT OF LOOP)
  while (n < LIMIT) {

    // UPDATE MEMO
    const serial = serialize(row, col);
    if (n === 1) MEMO[serial] = 1;
    else {
      let sum = 0;
      for (let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx) {
          if (dy || dx) {                                             // i.e. dy and dx are not both 0
            const neighborSerial = serialize(row + dy, col + dx);
            sum += MEMO[neighborSerial] || 0;
          }
        }
      }
      if (part === 2 && sum > GOAL) {
        if (DISPLAY_EXTRA_INFO) {
          console.log(`REACHED TERMINATE CONDITION AT ROW ${
            row}, COL ${col}`);
        }
        return sum;                                                   // PART 2: return the first sum greater than input
      }
      MEMO[serial] = sum;
    }

    // UPDATE n AND OTHER STATE VARIABLES
    ++n;
    const [ dy, dx ] = DIRS[dir];
    [ row, col ] = [ row + dy, col + dx ];
    --distanceToNextTurningPoint;
    if (distanceToNextTurningPoint === 0) {
      dir = (dir + 1) % 4;
      distanceToNextTurningPoint = sideLen;
      alternator = !alternator;
      if (!alternator) ++sideLen;
    }
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log(`POSITION ${GOAL} AT ROW ${row}, COL ${col}`);
  }
  return Math.abs(row) + Math.abs(col);                               // PART 1: return manhattan distance after reaching goal
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = infiniteGridSpiralTraversal;
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
`1`
);

const sampleInput2 = parseSampleInput(
`12`
);

const sampleInput3 = parseSampleInput(
`23`
);

const sampleInput4 = parseSampleInput(
`1024`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
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
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 31;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 438;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 266330;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);