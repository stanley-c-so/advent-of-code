/*

--- Day 17: Reservoir Research ---

You arrive in the year 18. If it weren't for the coat you got in 1018, you would be very cold: the North Pole base hasn't even been constructed.

Rather, it hasn't been constructed yet. The Elves are making a little progress, but there's not a lot of liquid water in this climate, so they're getting very dehydrated. Maybe there's more underground?

You scan a two-dimensional vertical slice of the ground nearby and discover that it is mostly sand with veins of clay. The scan only provides data with a granularity of square meters, but it should be good enough to determine how much water is trapped there. In the scan, x represents the distance to the right, and y represents the distance down. There is also a spring of water near the surface at x=500, y=0. The scan identifies which square meters are clay (your puzzle input).

For example, suppose your scan shows the following veins of clay:

x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504
Rendering clay as #, sand as ., and the water spring as +, and with x increasing to the right and y increasing downward, this becomes:

   44444455555555
   99999900000000
   45678901234567
 0 ......+.......
 1 ............#.
 2 .#..#.......#.
 3 .#..#..#......
 4 .#..#..#......
 5 .#.....#......
 6 .#.....#......
 7 .#######......
 8 ..............
 9 ..............
10 ....#.....#...
11 ....#.....#...
12 ....#.....#...
13 ....#######...

The spring of water will produce water forever. Water can move through sand, but is blocked by clay. Water always moves down when possible, and spreads to the left and right otherwise, filling space that has clay on both sides and falling out otherwise.

For example, if five squares of water are created, they will flow downward until they reach the clay and settle there. Water that has come to rest is shown here as ~, while sand through which water has passed (but which is now dry again) is shown as |:

......+.......
......|.....#.
.#..#.|.....#.
.#..#.|#......
.#..#.|#......
.#....|#......
.#~~~~~#......
.#######......
..............
..............
....#.....#...
....#.....#...
....#.....#...
....#######...

Two squares of water can't occupy the same location. If another five squares of water are created, they will settle on the first five, filling the clay reservoir a little more:

......+.......
......|.....#.
.#..#.|.....#.
.#..#.|#......
.#..#.|#......
.#~~~~~#......
.#~~~~~#......
.#######......
..............
..............
....#.....#...
....#.....#...
....#.....#...
....#######...

Water pressure does not apply in this scenario. If another four squares of water are created, they will stay on the right side of the barrier, and no water will reach the left side:

......+.......
......|.....#.
.#..#.|.....#.
.#..#~~#......
.#..#~~#......
.#~~~~~#......
.#~~~~~#......
.#######......
..............
..............
....#.....#...
....#.....#...
....#.....#...
....#######...

At this point, the top reservoir overflows. While water can reach the tiles above the surface of the water, it cannot settle there, and so the next five squares of water settle like this:

......+.......
......|.....#.
.#..#||||...#.
.#..#~~#|.....
.#..#~~#|.....
.#~~~~~#|.....
.#~~~~~#|.....
.#######|.....
........|.....
........|.....
....#...|.#...
....#...|.#...
....#~~~~~#...
....#######...

Note especially the leftmost |: the new squares of water can reach this tile, but cannot stop there. Instead, eventually, they all fall to the right and settle in the reservoir below.

After 10 more squares of water, the bottom reservoir is also full:

......+.......
......|.....#.
.#..#||||...#.
.#..#~~#|.....
.#..#~~#|.....
.#~~~~~#|.....
.#~~~~~#|.....
.#######|.....
........|.....
........|.....
....#~~~~~#...
....#~~~~~#...
....#~~~~~#...
....#######...

Finally, while there is nowhere left for the water to settle, it can reach a few more tiles before overflowing beyond the bottom of the scanned data:

......+.......    (line not counted: above minimum y value)
......|.....#.
.#..#||||...#.
.#..#~~#|.....
.#..#~~#|.....
.#~~~~~#|.....
.#~~~~~#|.....
.#######|.....
........|.....
...|||||||||..
...|#~~~~~#|..
...|#~~~~~#|..
...|#~~~~~#|..
...|#######|..
...|.......|..    (line not counted: below maximum y value)
...|.......|..    (line not counted: below maximum y value)
...|.......|..    (line not counted: below maximum y value)

How many tiles can be reached by the water? To prevent counting forever, ignore tiles with a y coordinate smaller than the smallest y coordinate in your scan data or larger than the largest one. Any x coordinate is valid. In this example, the lowest y coordinate given is 1, and the highest is 13, causing the water spring (in row 0) and the water falling off the bottom of the render (in rows 14 through infinity) to be ignored.

So, in the example above, counting both water at rest (~) and other sand tiles the water can hypothetically reach (|), the total number of tiles the water can reach is 57.

How many tiles can the water reach within the range of y values in your scan?


--- Part Two ---

After a very long time, the water spring will run dry. How much water will be retained?

In the example above, water that won't eventually drain out is shown as ~, a total of 29 tiles.

How many water tiles are left after the water spring stops producing water and all remaining water not at rest has drained?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function fillGridWithWater (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DIMENSION VARIABLES TO BE DISCOVERED
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // PARSE INPUT DATA - FIRST PASS (GET DIMENSIONS)
  for (const line of inputArr) {
    const [ LS, RS ] = line.split(', ');
    const [ axisLS, num ] = LS.split('=');
    const [ axisRS, range ] = RS.split('=');
    const [ rangeStart, rangeEnd ] = range.split('..');

    if (axisLS === 'x') {
      minX = Math.min(minX, +num);
      maxX = Math.max(maxX, +num);
    } else if (axisLS === 'y') {
      minY = Math.min(minY, +num);
      maxY = Math.max(maxY, +num);
    }
    else throw `ERROR: INVALID AXIS ${axisLS}`;

    if (+rangeStart >= +rangeEnd) throw `ERROR: RANGE IS BACKWARD ${range}`;
    
    if (axisRS === 'x') {
      minX = Math.min(minX, +rangeStart);
      maxX = Math.max(maxX, +rangeEnd);
    } else if (axisRS === 'y') {
      minY = Math.min(minY, +rangeStart);
      maxY = Math.max(maxY, +rangeEnd);
    }
    else throw `ERROR: INVALID AXIS ${axisRS}`;
  }
  if (DISPLAY_EXTRA_INFO) {
    console.log('minX, maxX:', minX, maxX)
  }

  // GRID CONSTANTS
  const BUFFER = 1;                                                                       // VERY IMPORTANT, AS THERE ARE WALLS ON THE SIDES WITH SPILLOVER
  const [ offsetX, offsetY ] = [ -minX + BUFFER, -minY ];
  const [ SAND, CLAY, WATERFALL, WATER ] = [ '.', '#', '|', '~' ];
  const GRID = Array.from({length: maxY - minY + 1},
                          () => Array(maxX - minX + 1 + BUFFER*2).fill(SAND));

  // PARSE INPUT DATA - SECOND PASS (INIT GRID)
  for (const line of inputArr) {
    const [ LS, RS ] = line.split(', ');
    const [ axisLS, num ] = LS.split('=');
    const [ axisRS, range ] = RS.split('=');
    const [ rangeStart, rangeEnd ] = range.split('..');

    if (axisRS === 'x') {
      for (let col = +rangeStart; col <= +rangeEnd; ++col) {
        GRID[+num + offsetY][col + offsetX] = CLAY;
      }
    }
    else if (axisRS === 'y') {
      for (let row = +rangeStart; row <= +rangeEnd; ++row) {
        GRID[row + offsetY][+num + offsetX] = CLAY;
      }
    }
    else throw `ERROR: INVALID AXIS ${axisRS}`;
  }
  
  // ANALYZE DFS
  const SPRING_X = 500;
  const STACK = [ [ minY, SPRING_X ] ];
  while (STACK.length) {

    const [ row, col ] = STACK.pop();

    // SET THE COORD AS A WATERFALL
    GRID[row + offsetY][col + offsetX] = WATERFALL;

    // MOVE ON IF REACHING BOTTOM, OR FALLING INTO MOVING WATER
    if (row === maxY || GRID[row + offsetY + 1][col + offsetX] === WATERFALL) continue;

    // IF SAND, YOU CAN PUSH NEXT COORD INTO STACK
    else if (GRID[row + offsetY + 1][col + offsetX] === SAND) {
      STACK.push([ row + 1, col ]);
    }

    // ELSE, IF FALLING INTO STILL WATER OR CLAY, WE HAVE TO SPREAD WATER SIDEWAYS
    else if ([ WATER, CLAY ].includes(GRID[row + offsetY + 1][col + offsetX])) {

      let fillUpWithWater = true;
      let leftmost = null;
      let rightmost = null;

      // scan left
      let scanCol = col;
      while (true) {
        GRID[row + offsetY][scanCol + offsetX] = WATERFALL;
        if ([ SAND, WATERFALL ].includes(GRID[row + offsetY + 1][scanCol + offsetX])) {   // check for fall at new position
          if (GRID[row + offsetY + 1][scanCol + offsetX] === SAND) {                      // if the new position has sand below it...
            STACK.push([ row + 1, scanCol ]);                                             // ...push new position into stack
          }
          fillUpWithWater = false;                                                        // at any rate, we cannot fill this row with water
          break;
        }
        if (GRID[row + offsetY][scanCol + offsetX - 1] === CLAY) {                        // if no fall at new position, check if its left is a clay wall
          leftmost = scanCol;                                                             // if so, mark position as leftmost position
          break;
        }
        --scanCol;                                                                        // if neither, keep going left
      }

      // scan right
      scanCol = col;                                                                      // IMPORTANT: don't forget to reset scanCol to original col!
      while (true) {
        GRID[row + offsetY][scanCol + offsetX] = WATERFALL;
        if ([ SAND, WATERFALL ].includes(GRID[row + offsetY + 1][scanCol + offsetX])) {
          if (GRID[row + offsetY + 1][scanCol + offsetX] === SAND) {
            STACK.push([ row + 1, scanCol ]);
          }
          fillUpWithWater = false;
          break;
        }
        if (GRID[row + offsetY][scanCol + offsetX + 1] === CLAY) {
          rightmost = scanCol;
          break;
        }
        ++scanCol;
      }

      // fill row with water if appropriate
      if (fillUpWithWater) {
        for (let c = leftmost; c <= rightmost; ++c) {
          GRID[row + offsetY][c + offsetX] = WATER;
        }
        STACK.push([ row - 1, col ]);                                                      // push origin point into stack because that row spreads next
      }
    }
    else throw `ERROR: UNRECOGNIZED TERRAIN AT ROW, COL ${row}, ${col} - ${
      GRID[row + offsetY + 1][col + offsetX]}`;
  }

  if (DISPLAY_EXTRA_INFO && DEBUG) {
    console.log('FINAL GRID:');
    for (const row of GRID) console.log(row.join(''));
  }

  // ANALYZE RESULTS
  let count = 0;
  for (let row = 0; row < GRID.length; ++row) {
    for (let col = 0; col < GRID[0].length; ++col) {
      if (part === 1 && [ WATER, WATERFALL ].includes(GRID[row][col])                     // PART 1: COUNT STILL WATER AND MOVING WATER
          || part === 2 && GRID[row][col] === WATER                                       // PART 2: COUNT STILL WATER ONLY
      ) {
        ++count;
      }
    }
  }
  return count;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = fillGridWithWater;
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
`x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 57;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 29741;
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
expected = 24198;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);