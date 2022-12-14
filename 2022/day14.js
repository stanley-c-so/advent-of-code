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

  // PARSE DATA

  // parse data first pass: get maxY, FLOOR, and maxX from parsing data
  let maxY = 0;
  for (const line of inputArr) {
    for (const [x, y] of line.split(' -> ').map(coord => coord.split(',').map(n => +n))) {
      maxY = Math.max(maxY, y);
    }
  }
  const FLOOR = maxY + 2;
  const maxX = 500 + FLOOR;                                                                     // maxX: if a grain of sand starts at (500,0) and keeps falling right

  // build grid based on maxY
  const GRID = Array.from({length: maxY + 3}, () => Array(maxX + 1).fill('.'));                 // need to give 2 additional rows for part 2

  // parse data second pass: draw walls into grid
  for (const line of inputArr) {
    const coords = line.split(' -> ').map(coord => coord.split(',').map(n => +n));
    for (let i = 0; i < coords.length - 1; ++i) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[i + 1];
      let [x, y] = [x1, y1];

      if (x1 !== x2 && y1 !== y2) throw 'ERROR: COORDINATES ARE NOT ORTHOGONALLY ALIGNED';

      // going up
      if (y2 > y1) {
        while (y <= y2) {
          GRID[y][x] = '#';
          ++y;
        }
      }

      // going down
      else if (y2 < y1) {
        while (y >= y2) {
          GRID[y][x] = '#';
          --y;
        }
      }

      // going right
      else if (x2 > x1) {
        while (x <= x2) {
          GRID[y][x] = '#';
          ++x;
        }
      }

      // going left
      else if (x2 < x1) {
        while (x >= x2) {
          GRID[y][x] = '#';
          --x;
        }
      }
    }
  }

  // draw floor into grid
  for (let x = 0; x <= maxX; ++x) GRID[FLOOR][x] = '#';

  // INIT SAND POSITION AND COUNT
  const [ SAND_ENTRY_X, SAND_ENTRY_Y ] = [ 500, 0 ];
  let sandX = SAND_ENTRY_X;
  let sandY = SAND_ENTRY_Y;
  let count = 0;

  const endCondition = () => part === 1 ? sandY === maxY                                      // PART 1: if a grain of sand reaches lowest wall (and thus will continue to fall)
                                        : GRID[SAND_ENTRY_Y][SAND_ENTRY_X] === 'o';           // PART 2: sand entry point fills up with sand

  while (true) {
    if (endCondition()) {                                                                     // end simulation
      break;
    }
    else if (GRID[sandY + 1][sandX] === '.') {                                                // check down
      ++sandY;
    }
    else if (GRID[sandY + 1][sandX - 1] === '.') {                                            // check down-left
      ++sandY;
      --sandX;
    }
    else if (GRID[sandY + 1][sandX + 1] === '.') {                                            // check down-right
      ++sandY;
      ++sandX;
    }
    else {                                                                                    // sand comes to rest at current position
      GRID[sandY][sandX] = 'o';
      ++count;
      sandX = 500;
      sandY = 0;
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