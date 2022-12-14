/*

--- Day 14: Regolith Reservoir ---

The distress signal leads you to a giant waterfall! Actually, hang on - the signal seems like it's coming from the waterfall itself, and that doesn't make any sense. However, you do notice a little path that leads behind the waterfall.

Correction: the distress signal leads you behind a giant waterfall! There seems to be a large cave system here, and the signal definitely leads further inside.

As you begin to make your way deeper underground, you feel the ground rumble for a moment. Sand begins pouring into the cave! If you don't quickly figure out where the sand is going, you could quickly become trapped!

Fortunately, your familiarity with analyzing the path of falling material will come in handy here. You scan a two-dimensional vertical slice of the cave above you (your puzzle input) and discover that it is mostly air with structures made of rock.

Your scan traces the path of each solid rock structure and reports the x,y coordinates that form the shape of the path, where x represents distance to the right and y represents distance down. Each path appears as a single line of text in your scan. After the first point of each path, each point indicates the end of a straight horizontal or vertical line to be drawn from the previous point. For example:

498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9

This scan means that there are two paths of rock; the first path consists of two straight lines, and the second path consists of three straight lines. (Specifically, the first path consists of a line of rock from 498,4 through 498,6 and another line of rock from 498,6 through 496,6.)

The sand is pouring into the cave from point 500,0.

Drawing rock as #, air as ., and the source of the sand as +, this becomes:


  4     5  5
  9     0  0
  4     0  3
0 ......+...
1 ..........
2 ..........
3 ..........
4 ....#...##
5 ....#...#.
6 ..###...#.
7 ........#.
8 ........#.
9 #########.

Sand is produced one unit at a time, and the next unit of sand is not produced until the previous unit of sand comes to rest. A unit of sand is large enough to fill one tile of air in your scan.

A unit of sand always falls down one step if possible. If the tile immediately below is blocked (by rock or sand), the unit of sand attempts to instead move diagonally one step down and to the left. If that tile is blocked, the unit of sand attempts to instead move diagonally one step down and to the right. Sand keeps moving as long as it is able to do so, at each step trying to move down, then down-left, then down-right. If all three possible destinations are blocked, the unit of sand comes to rest and no longer moves, at which point the next unit of sand is created back at the source.

So, drawing sand that has come to rest as o, the first unit of sand simply falls straight down and then stops:

......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
......o.#.
#########.

The second unit of sand then falls straight down, lands on the first one, and then comes to rest to its left:

......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
.....oo.#.
#########.

After a total of five units of sand have come to rest, they form this pattern:

......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
......o.#.
....oooo#.
#########.

After a total of 22 units of sand:

......+...
..........
......o...
.....ooo..
....#ooo##
....#ooo#.
..###ooo#.
....oooo#.
...ooooo#.
#########.

Finally, only two more units of sand can possibly come to rest:

......+...
..........
......o...
.....ooo..
....#ooo##
...o#ooo#.
..###ooo#.
....oooo#.
.o.ooooo#.
#########.

Once all 24 units of sand shown above have come to rest, all further sand flows out the bottom, falling into the endless void. Just for fun, the path any new sand takes before falling forever is shown here with ~:

.......+...
.......~...
......~o...
.....~ooo..
....~#ooo##
...~o#ooo#.
..~###ooo#.
..~..oooo#.
.~o.ooooo#.
~#########.
~..........
~..........
~..........

Using your scan, simulate the falling sand. How many units of sand come to rest before sand starts flowing into the abyss below?


--- Part Two ---

You realize you misread the scan. There isn't an endless void at the bottom of the scan - there's floor, and you're standing on it!

You don't have time to scan the floor, so assume the floor is an infinite horizontal line with a y coordinate equal to two plus the highest y coordinate of any point in your scan.

In the example above, the highest y coordinate of any point is 9, and so the floor is at y=11. (This is as if your scan contained one extra rock path like -infinity,11 -> infinity,11.) With the added floor, the example above now looks like this:

        ...........+........
        ....................
        ....................
        ....................
        .........#...##.....
        .........#...#......
        .......###...#......
        .............#......
        .............#......
        .....#########......
        ....................
<-- etc #################### etc -->

To find somewhere safe to stand, you'll need to simulate falling sand until a unit of sand comes to rest at 500,0, blocking the source entirely and stopping the flow of sand into the cave. In the example above, the situation finally looks like this after 93 units of sand come to rest:

............o............
...........ooo...........
..........ooooo..........
.........ooooooo.........
........oo#ooo##o........
.......ooo#ooo#ooo.......
......oo###ooo#oooo......
.....oooo.oooo#ooooo.....
....oooooooooo#oooooo....
...ooo#########ooooooo...
..ooooo.......ooooooooo..
#########################

Using your scan, simulate the falling sand until the source of the sand becomes blocked. How many units of sand come to rest?

*/

function fillWithSand (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // OPTIONAL VARIABLES
  const OPTIMIZE_GRID = true;                                                                   // adjust minX, minY to make grid smaller
  const DRAW = true;                                                                            // for sample data, draw state on sand rest or at end
  const DRAW_EVERY = 10;                                                                        // draw only on the resolution of every N grains of sand

  // INIT
  const SAND_ENTRY_X = 500;
  const SAND_ENTRY_Y = 0;
  const DISTANCE_BETWEEN_MAXY_AND_FLOOR = 2;

  // PARSE DATA: GET WALLS, maxY, FLOOR, AND maxX
  const WALLS = [];
  let maxY = 0;
  let minX = 0;
  if (OPTIMIZE_GRID) minX = Infinity;                                                           // (OPTIONAL OPTIMIZATION)
  for (const line of inputArr) {
    const currentWall = [];
    for (const [x, y] of line.split(' -> ').map(coord => coord.split(',').map(n => +n))) {
      currentWall.push([x, y]);
      maxY = Math.max(maxY, y);
      if (OPTIMIZE_GRID) minX = Math.min(minX, x);                                              // (OPTIONAL OPTIMIZATION)
    }
    WALLS.push(currentWall);
  }
  const FLOOR = maxY + DISTANCE_BETWEEN_MAXY_AND_FLOOR;
  const maxX = SAND_ENTRY_X + FLOOR - SAND_ENTRY_Y;                                             // maxX: if a grain of sand starts at entry point and keeps falling right
  const minY = OPTIMIZE_GRID ? SAND_ENTRY_Y : 0;                                                // not really needed here, but supports non-0 SAND_ENTRY_Y
  if (OPTIMIZE_GRID) minX = Math.min(minX, SAND_ENTRY_X - FLOOR - SAND_ENTRY_Y);                // (OPTIONAL OPTIMIZATION)

  // BUILD GRID BASED ON maxX, maxY
  const GRID = Array.from({length: maxY + DISTANCE_BETWEEN_MAXY_AND_FLOOR + 1},                 // maxX, maxY are 0-indexed
                          () => Array(maxX - minX + 1).fill('.'));

  // DRAW WALLS INTO GRID
  for (const wall of WALLS) {
    for (let i = 0; i < wall.length - 1; ++i) {                                                 // iterate through wall endpoints (excluding last one because of fencepost)
      const [x1, y1] = wall[i];
      const [x2, y2] = wall[i + 1];

      if (x1 !== x2 && y1 !== y2) {                                                             // sanity check to make sure endpoints are orthogonally aligned
        throw 'ERROR: WALL ENDPOINT COORDINATES ARE NOT ORTHOGONALLY ALIGNED';
      }

      // init coords at first endpoint
      let [x, y] = [x1, y1];

      if (y2 > y1) {                                                                            // going up
        while (y <= y2) {
          GRID[y - minY][x - minX] = '#';
          ++y;
        }
      }

      else if (y2 < y1) {                                                                       // going down
        while (y >= y2) {
          GRID[y - minY][x - minX] = '#';
          --y;
        }
      }

      else if (x2 > x1) {                                                                       // going right
        while (x <= x2) {
          GRID[y - minY][x - minX] = '#';
          ++x;
        }
      }

      else if (x2 < x1) {                                                                       // going left
        while (x >= x2) {
          GRID[y - minY][x - minX] = '#';
          --x;
        }
      }
    }
  }

  // MARK SAND ENTRY POINT WITH '+'
  GRID[0][SAND_ENTRY_X - minX] = '+';                                                           // row: SAND_ENTRY_Y - minY, but minY === SAND_ENTRY_Y

  // DRAW FLOOR INTO GRID
  for (let x = 0; x <= maxX; ++x) GRID[FLOOR - minY][x - minX] = '#';

  // INIT SAND POSITION AND COUNT
  let sandX = SAND_ENTRY_X;
  let sandY = SAND_ENTRY_Y;
  let count = 0;

  const endCondition = () => part === 1 ? sandY === maxY                                        // PART 1: if a grain of sand reaches lowest wall (and thus will continue to fall)
                                        : GRID[0][SAND_ENTRY_X - minX] === 'o';                 // PART 2: sand entry point fills up with sand

  function optionalDraw() {
    if (DEBUG && DRAW) {
      console.log(`${count} GRAINS OF SAND AT REST:`);
      for (const row of GRID) console.log(row.map(c => c === '.' ? ' ' : c).join(' '));
      console.log('');
    }
  }

  // SIMULATE
  while (true) {
    if (endCondition()) {                                                                       // end simulation
      optionalDraw();
      break;
    }
    else if (GRID[sandY + 1 - minY][sandX - minX] === '.') {                                    // check down for air
      ++sandY;
    }
    else if (GRID[sandY + 1 - minY][sandX - 1 - minX] === '.') {                                // check down-left for air
      ++sandY;
      --sandX;
    }
    else if (GRID[sandY + 1 - minY][sandX + 1 - minX] === '.') {                                // check down-right for air
      ++sandY;
      ++sandX;
    }
    else {                                                                                      // sand comes to rest at current position
      GRID[sandY - minY][sandX - minX] = 'o';
      ++count;
      sandX = SAND_ENTRY_X;
      sandY = SAND_ENTRY_Y;
      if (count % DRAW_EVERY === 0) optionalDraw();
    }
  }

  return count;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = fillWithSand;
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
`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 24;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1001;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 93;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 27976;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);