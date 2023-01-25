/*

--- Day 6: Chronal Coordinates ---

The device on your wrist beeps several times, and once again you feel like you're falling.

"Situation critical," the device announces. "Destination indeterminate. Chronal interference detected. Please specify new target coordinates."

The device then produces a list of coordinates (your puzzle input). Are they places it thinks are safe or dangerous? It recommends you check manual page 729. The Elves did not give you a manual.

If they're dangerous, maybe you can minimize the danger by finding the coordinate that gives the largest distance from the other points.

Using only the Manhattan distance, determine the area around each coordinate by counting the number of integer X,Y locations that are closest to that coordinate (and aren't tied in distance to any other coordinate).

Your goal is to find the size of the largest area that isn't infinite. For example, consider the following list of coordinates:

1, 1
1, 6
8, 3
3, 4
5, 5
8, 9

If we name these coordinates A through F, we can draw them on a grid, putting 0,0 at the top left:

..........
.A........
..........
........C.
...D......
.....E....
.B........
..........
..........
........F.

This view is partial - the actual grid extends infinitely in all directions. Using the Manhattan distance, each location's closest coordinate can be determined, shown here in lowercase:

aaaaa.cccc
aAaaa.cccc
aaaddecccc
aadddeccCc
..dDdeeccc
bb.deEeecc
bBb.eeee..
bbb.eeefff
bbb.eeffff
bbb.ffffFf

Locations shown as . are equally far from two or more coordinates, and so they don't count as being closest to any.

In this example, the areas of coordinates A, B, C, and F are infinite - while not shown here, their areas extend forever outside the visible grid. However, the areas of coordinates D and E are finite: D is closest to 9 locations, and E is closest to 17 (both including the coordinate's location itself). Therefore, in this example, the size of the largest area is 17.

What is the size of the largest area that isn't infinite?


--- Part Two ---

On the other hand, if the coordinates are safe, maybe the best you can do is try to find a region near as many coordinates as possible.

For example, suppose you want the sum of the Manhattan distance to all of the coordinates to be less than 32. For each location, add up the distances to all of the given coordinates; if the total of those distances is less than 32, that location is within the desired region. Using the same coordinates as above, the resulting region looks like this:

..........
.A........
..........
...###..C.
..#D###...
..###E#...
.B.###....
..........
..........
........F.

In particular, consider the highlighted location 4,3 located at the top middle of the region. Its calculation is as follows, where abs() is the absolute value function:

Distance to coordinate A: abs(4-1) + abs(3-1) =  5
Distance to coordinate B: abs(4-1) + abs(3-6) =  6
Distance to coordinate C: abs(4-8) + abs(3-3) =  4
Distance to coordinate D: abs(4-3) + abs(3-4) =  2
Distance to coordinate E: abs(4-5) + abs(3-5) =  3
Distance to coordinate F: abs(4-8) + abs(3-9) = 10
Total distance: 5 + 6 + 4 + 2 + 3 + 10 = 30

Because the total distance to all coordinates (30) is less than 32, the location is within the region.

This region, which also includes coordinates D and E, has a total size of 16.

Your actual region will need to be much larger than this example, though, instead including all locations with a total distance of less than 10000.

What is the size of the region containing all locations which have a total distance to all given coordinates of less than 10000?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function areasOfPointsRelativeToKeyCoords (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // UTILITY FUNCTION
  function getManhattanDistance(row1, col1, row2, col2) {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  }

  // DATA STRUCTURES
  const COORDS = {};

  // VALUES DISCOVERED ON DATA PARSING
  let maxRow = 0;
  let maxCol = 0;

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ col, row ] = line.split(', ').map(n => +n);
    COORDS[`${row},${col}`] = [ row, col ];
    maxRow = Math.max(maxRow, row);
    maxCol = Math.max(maxCol, col);
  }

  // GRID CONSTANTS
  const BUFFER = 1;
  const GRID = Array.from({length: maxRow + 1 + (2 * BUFFER)},
                          () => Array(maxCol + 1 + (2 * BUFFER)).fill(null));
  const [ H, W ] = [ GRID.length, GRID[0].length ];

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  if (part === 1) {                                                                     // PART 1: GET LARGEST NON-INFINITE AREA DOMINATED
                                                                                        // BY A SINGLE KEY COORDINATE

    // FOR EACH COORDINATE IN GRID, DETERMINE WHICH KEY COORDINATE DOMINATES IT
    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {
        const actualRow = row - BUFFER;
        const actualCol = col - BUFFER;
  
        const DISTANCES = {};                                                           // need dictionary to account for possibility of ties
  
        for (const coord in COORDS) {
          const [ r, c ] = COORDS[coord];
          const distance = getManhattanDistance(actualRow, actualCol, r, c);
          if (!(distance in DISTANCES)) DISTANCES[distance] = [];
          DISTANCES[distance].push(coord);
        }
  
        const shortestDistance = Object.keys(DISTANCES)
                                  .map(n => +n)
                                  .sort((a, b) => a - b)[0];
  
        if (DISTANCES[shortestDistance].length === 1) {                                 // coord is only dominated if there are no ties
          GRID[row][col] = DISTANCES[shortestDistance][0];
        }
      }
    }
  
    // ELIMINATE KEY COORDINATES THAT DOMINATE LOCATIONS AT THE EDGE OF THE GRID, BECAUSE THOSE REGIONS WILL BE INFINITE
    const AREAS_BY_COORDS = { ...COORDS };
    for (let row = 0; row < H; ++row) {                                                 // eliminate the left and right edges of the grid
      if (GRID[row][0] !== null) delete AREAS_BY_COORDS[GRID[row][0]];
      if (GRID[row][W - 1] !== null) delete AREAS_BY_COORDS[GRID[row][W - 1]];
    }
    for (let col = 1; col < W - 1; ++col) {                                             // eliminate the top and bottom edges of the grid
      if (GRID[0][col] !== null) delete AREAS_BY_COORDS[GRID[0][col]];
      if (GRID[H - 1][col] !== null) delete AREAS_BY_COORDS[GRID[H - 1][col]];
    }
  
    for (const coord in AREAS_BY_COORDS) AREAS_BY_COORDS[coord] = 0;                    // (since we copied COORDS, set values to 0)
  
    for (let row = 1; row < H - 1; ++row) {                                             // make another pass through the grid...
      for (let col = 1; col < W - 1; ++col) {
        if (GRID[row][col] in AREAS_BY_COORDS) {                                        // ...if location is dominated by a valid key coord...
          ++AREAS_BY_COORDS[GRID[row][col]];                                            // ...increment the area for that key coord
        }
      }
    }
  
    // AMONG THE KEY COORDINATES THAT DOMINATE NON-INFINITE AREAS, FIND THE ONE THAT DOMINATES THE LARGEST AREA
    let mostArea = 0;
    let coordWithMostArea = null;
    for (const coord in AREAS_BY_COORDS) {
      if (AREAS_BY_COORDS[coord] > mostArea) {
        mostArea = AREAS_BY_COORDS[coord];
        coordWithMostArea = coord;
      }
    }
  
    if (DISPLAY_EXTRA_INFO) {
      console.log('COORDINATES WITH MOST NON-INFINITE AREA:',
                  coordWithMostArea.split(',').map(n => +n));
      console.log(`AREA: ${mostArea}`);
    }
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return mostArea;

  } else {                                                                              // PART 2: GET AREA OF REGION THAT IS SUFFICIENTLY
                                                                                        // CLOSE TO ALL KEY COORDINATES

    const SAFE_REGION_DISTANCE_LIMIT = extraParam;

    let areaSafeRegion = 0;

    // ITERATE THROUGH GRID, DETERMINING IF EACH LOCATION IS WITHIN THE SAFE REGION
    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {
        const actualRow = row - BUFFER;
        const actualCol = col - BUFFER;

        GRID[row][col] = `${actualRow},${actualCol}` in COORDS ? 'C' : '.';             // (for displaying the grid at the end)
  
        let totalDistance = 0;
  
        for (const coord in COORDS) {
          const [ r, c ] = COORDS[coord];
          totalDistance += getManhattanDistance(actualRow, actualCol, r, c);
        }

        if (totalDistance < SAFE_REGION_DISTANCE_LIMIT) {                               // determine if location is in safe region
          ++areaSafeRegion;
          if (GRID[row][col] === '.') GRID[row][col] = '#';                             // (for displaying the grid at the end)
        }
      }
    }

    if (DISPLAY_EXTRA_INFO && DEBUG) {
      for (const row of GRID) {
        console.log(row.join(''));
      }
    }

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return areaSafeRegion;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = areasOfPointsRelativeToKeyCoords;
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
`1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 17;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 4171;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 32,
  DEBUG: true,
};
expected = 16;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 10000,
};
expected = 39545;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);