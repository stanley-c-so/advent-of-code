/*

--- Day 11: Chronal Charge ---

You watch the Elves and their sleigh fade into the distance as they head toward the North Pole.

Actually, you're the one fading. The falling sensation returns.

The low fuel warning light is illuminated on your wrist-mounted device. Tapping it once causes it to project a hologram of the situation: a 300x300 grid of fuel cells and their current power levels, some negative. You're not sure what negative power means in the context of time travel, but it can't be good.

Each fuel cell has a coordinate ranging from 1 to 300 in both the X (horizontal) and Y (vertical) direction. In X,Y notation, the top-left cell is 1,1, and the top-right cell is 300,1.

The interface lets you select any 3x3 square of fuel cells. To increase your chances of getting to your destination, you decide to choose the 3x3 square with the largest total power.

The power level in a given fuel cell can be found through the following process:

Find the fuel cell's rack ID, which is its X coordinate plus 10.
Begin with a power level of the rack ID times the Y coordinate.
Increase the power level by the value of the grid serial number (your puzzle input).
Set the power level to itself multiplied by the rack ID.
Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
Subtract 5 from the power level.

For example, to find the power level of the fuel cell at 3,5 in a grid with serial number 8:

The rack ID is 3 + 10 = 13.
The power level starts at 13 * 5 = 65.
Adding the serial number produces 65 + 8 = 73.
Multiplying by the rack ID produces 73 * 13 = 949.
The hundreds digit of 949 is 9.
Subtracting 5 produces 9 - 5 = 4.

So, the power level of this fuel cell is 4.

Here are some more example power levels:

Fuel cell at  122,79, grid serial number 57: power level -5.
Fuel cell at 217,196, grid serial number 39: power level  0.
Fuel cell at 101,153, grid serial number 71: power level  4.

Your goal is to find the 3x3 square which has the largest total power. The square must be entirely within the 300x300 grid. Identify this square using the X,Y coordinate of its top-left fuel cell. For example:

For grid serial number 18, the largest total 3x3 square has a top-left corner of 33,45 (with a total power of 29); these fuel cells appear in the middle of this 5x5 region:

-2  -4   4   4   4
-4   4   4   4  -5
 4   3   3   4  -4
 1   1   2   4  -3
-1   0   2  -5  -2

For grid serial number 42, the largest 3x3 square's top-left is 21,61 (with a total power of 30); they are in the middle of this region:

-3   4   2   2   2
-4   4   3   3   4
-5   3   3   4  -4
 4   3   3   4  -3
 3   3   3  -5  -1

What is the X,Y coordinate of the top-left fuel cell of the 3x3 square with the largest total power?


--- Part Two ---

You discover a dial on the side of the device; it seems to let you select a square of any size, not just 3x3. Sizes from 1x1 to 300x300 are supported.

Realizing this, you now must find the square of any size with the largest total power. Identify this square by including its size as a third parameter after the top-left coordinate: a 9x9 square with a top-left corner of 3,5 is identified as 3,5,9.

For example:

For grid serial number 18, the largest total square (with a total power of 113) is 16x16 and has a top-left corner of 90,269, so its identifier is 90,269,16.
For grid serial number 42, the largest total square (with a total power of 119) is 12x12 and has a top-left corner of 232,251, so its identifier is 232,251,12.

What is the X,Y,size identifier of the square with the largest total power?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function findSumOfValuesInBestSearchRegion (part, inputStr, DEBUG = false) {
  
  // GRID CONSTANTS
  const GRID_SERIAL_NUMBER = +inputStr;
  const GRID_SIDE = 300;

  // CREATE GRID OF POWER LEVELS
  const GRID = Array.from({length: GRID_SIDE}, () => Array(GRID_SIDE).fill(null));
  for (let row = 0; row < GRID_SIDE; ++row) {
    for (let col = 0; col < GRID_SIDE; ++col) {
      const rackID = (col + 1) + 10;
      const powerLevel = Math.floor((rackID * (row + 1) + GRID_SERIAL_NUMBER)
                                      * rackID
                                      / 100) % 10 - 5;
      GRID[row][col] = powerLevel;
    }
  }

  // PART 2: CREATE GRID OF CUMULATIVE POWER LEVELS
  const CUMULATIVE_GRID = Array.from({length: GRID_SIDE}, () => Array(GRID_SIDE).fill(null));
  for (let row = 0; row < GRID_SIDE; ++row) {
    for (let col = 0; col < GRID_SIDE; ++col) {
      CUMULATIVE_GRID[row][col] = GRID[row][col];      
      if (col) CUMULATIVE_GRID[row][col] += CUMULATIVE_GRID[row][col - 1];
    }
  }
  for (let row = 1; row < GRID_SIDE; ++row) {
    for (let col = 0; col < GRID_SIDE; ++col) {
      CUMULATIVE_GRID[row][col] += CUMULATIVE_GRID[row - 1][col];
    }
  }

  // HELPER FUNCTION - RETURNS THE SUM OF POWER LEVELS IN THE RECTANGLE BOUNDED BY THE GIVEN OPPOSITE CORNERS
  function getSumOfRectangle(row1, col1, row2, col2) {
    const A = CUMULATIVE_GRID[row2][col2];
    const B = row1 > 0 ? CUMULATIVE_GRID[row1 - 1][col2] : 0;
    const C = col1 > 0 ? CUMULATIVE_GRID[row2][col1 - 1] : 0;
    const D = row1 > 0 && col1 > 0 ? CUMULATIVE_GRID[row1 - 1][col1 - 1] : 0;
    return A - B - C + D;
  }

  // HELPER FUNCTION - RETURNS TOP LEFT CORNER AND POWER INFORMATION FOR THE BEST REGION OF GIVEN DIMENSION
  function getBestRegion(SEARCH_SIDE) {

    let maxPower = -Infinity;
    let [ bestRow, bestCol ] = [ null, null ];
    for (let row = 0; row <= GRID_SIDE - SEARCH_SIDE; ++row) {
      for (let col = 0; col <= GRID_SIDE - SEARCH_SIDE; ++col) {

        const totalPower = getSumOfRectangle(row,
                                             col, 
                                             row + SEARCH_SIDE - 1,
                                             col + SEARCH_SIDE - 1);

        if (totalPower > maxPower){
          maxPower = totalPower;
          [ bestRow, bestCol ] = [ row, col ];
        }

      }
    }

    if (DISPLAY_EXTRA_INFO && part === 1) {
      const DRAW_GRID = Array.from({length: SEARCH_SIDE},
                                   () => Array(SEARCH_SIDE).fill(null));
      for (let r = 0; r < SEARCH_SIDE; ++r) {
        for (let c = 0; c < SEARCH_SIDE; ++c) {
          DRAW_GRID[r][c] = GRID[r + bestRow][c + bestCol];
        }
      }
      for (const row of DRAW_GRID) console.log(row.join(' '));
    }

    return {
      bestCol,
      bestRow,
      maxPower,
    }
  }

  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  // ANALYZE
  if (part === 1) {                                                                           // PART 1: SEARCH FOR BEST 3x3 REGION

    const { bestCol, bestRow } = getBestRegion(3);

    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return `${bestCol + 1},${bestRow + 1}`;                                                   // return in X,Y format, 1-indexed

  } else {                                                                                    // PART 2: SEARCH FOR BEST SQUARE REGION OF ANY SIZE

    let overallMaxPower = -Infinity;
    let [ overallBestCol, overallBestRow, overallBestSearchSide ] = [ null, null, null ];

    for (let SEARCH_SIDE = 1; SEARCH_SIDE <= 300; ++SEARCH_SIDE) {
      const { bestCol, bestRow, maxPower } = getBestRegion(SEARCH_SIDE);
      if (maxPower > overallMaxPower) {
        overallMaxPower = maxPower;
        overallBestCol = bestCol;
        overallBestRow = bestRow;
        overallBestSearchSide = SEARCH_SIDE;
      }
    }

    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return `${overallBestCol + 1},${overallBestRow + 1},${overallBestSearchSide}`;            // return in X,Y,side format, 1-indexed

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findSumOfValuesInBestSearchRegion;
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
`18`
);

const sampleInput2 = parseSampleInput(
`42`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '33,45';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = '21,61';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
};
expected = '44,37';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '90,269,16';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = '232,251,12';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = '235,87,13';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);