/*

--- Day 10: The Stars Align ---

It's no use; your navigation system simply isn't capable of providing walking directions in the arctic circle, and certainly not in 1018.

The Elves suggest an alternative. In times like these, North Pole rescue operations will arrange points of light in the sky to guide missing Elves back to base. Unfortunately, the message is easy to miss: the points move slowly enough that it takes hours to align them, but have so much momentum that they only stay aligned for a second. If you blink at the wrong time, it might be hours before another message appears.

You can see these points of light floating in the distance, and record their position in the sky and their velocity, the relative change in position per second (your puzzle input). The coordinates are all given from your perspective; given enough time, those positions and velocities will move the points into a cohesive message!

Rather than wait, you decide to fast-forward the process and calculate what the points will eventually spell.

For example, suppose you note the following points:

position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>

Each line represents one point. Positions are given as <X, Y> pairs: X represents how far left (negative) or right (positive) the point appears, while Y represents how far up (negative) or down (positive) the point appears.

At 0 seconds, each point has the position given. Each second, each point's velocity is added to its position. So, a point with velocity <1, -2> is moving to the right, but is moving upward twice as quickly. If this point's initial position were <3, 9>, after 3 seconds, its position would become <6, 3>.

Over time, the points listed above would move like this:

Initially:
........#.............
................#.....
.........#.#..#.......
......................
#..........#.#.......#
...............#......
....#.................
..#.#....#............
.......#..............
......#...............
...#...#.#...#........
....#..#..#.........#.
.......#..............
...........#..#.......
#...........#.........
...#.......#..........

After 1 second:
......................
......................
..........#....#......
........#.....#.......
..#.........#......#..
......................
......#...............
....##.........#......
......#.#.............
.....##.##..#.........
........#.#...........
........#...#.....#...
..#...........#.......
....#.....#.#.........
......................
......................

After 2 seconds:
......................
......................
......................
..............#.......
....#..#...####..#....
......................
........#....#........
......#.#.............
.......#...#..........
.......#..#..#.#......
....#....#.#..........
.....#...#...##.#.....
........#.............
......................
......................
......................

After 3 seconds:
......................
......................
......................
......................
......#...#..###......
......#...#...#.......
......#...#...#.......
......#####...#.......
......#...#...#.......
......#...#...#.......
......#...#...#.......
......#...#..###......
......................
......................
......................
......................

After 4 seconds:
......................
......................
......................
............#.........
........##...#.#......
......#.....#..#......
.....#..##.##.#.......
.......##.#....#......
...........#....#.....
..............#.......
....#......#...#......
.....#.....##.........
...............#......
...............#......
......................
......................

After 3 seconds, the message appeared briefly: HI. Of course, your message will be much longer and will take many more seconds to appear.

What message will eventually appear in the sky?


--- Part Two ---

Good thing you didn't have to wait, because that would have taken a long time - much longer than the 3 seconds in the example above.

Impressed by your sub-hour communication capabilities, the Elves are curious: exactly how many seconds would they have needed to wait for that message to appear?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // EXAMINE FIRST LINE TO DISCOVER INDEX VALUES TO ASSIST WITH PARSING INPUT DATA
  const indicesOfOpenPointyBrackets = [];
  const indicesOfClosePointyBrackets = [];
  for (let i = 0; i < inputArr[0].length; ++i) {
    if (inputArr[0][i] === '<') indicesOfOpenPointyBrackets.push(i);
    if (inputArr[0][i] === '>') indicesOfClosePointyBrackets.push(i);
  }
  
  // DATA STRUCTURES
  const POINTS = [];

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const position = line.slice(indicesOfOpenPointyBrackets[0] + 1, indicesOfClosePointyBrackets[0]);
    const velocity = line.slice(indicesOfOpenPointyBrackets[1] + 1, indicesOfClosePointyBrackets[1]);
    const [ posX, posY ] = position.split(',').map(n => +n);
    const [ velX, velY ] = velocity.split(',').map(n => +n);
    POINTS.push({ posX, posY, velX, velY });
  }

  // CONSTANTS
  const LIMIT = Number.MAX_SAFE_INTEGER;

  // INIT
  let minSpreadY = Infinity;
  let minSpreadYTime = null;
  let minSpreadX = Infinity;                                                // track X for sanity check
  let minSpreadXTime = null;                                                // track X for sanity check

  let dataAtMinSpreadYTime = null;                                          // it happens that time of min spread must match for Y and X
                                                                            // so we only need to track this for Y, not both

  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  for (let t = 1; t <= LIMIT; ++t) {

    // INIT
    let maxY = -Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let minX = Infinity;

    // MOVE POINTS
    for (const point of POINTS) {
      point.posY += point.velY;
      point.posX += point.velX;
      maxY = Math.max(maxY, point.posY);
      minY = Math.min(minY, point.posY);
      maxX = Math.max(maxX, point.posX);
      minX = Math.min(minX, point.posX);
    }

    // CALCULATE SPREAD, OFFSET
    const spreadY = maxY - minY + 1;
    const spreadX = maxX - minX + 1;
    const offsetY = -minY;
    const offsetX = -minX;

    // TERMINATE SIMULATION ONCE POINTS BEGIN TO SPREAD OUT AGAIN
    if (spreadY >= minSpreadY && spreadX >= minSpreadX) {
      if (DISPLAY_EXTRA_INFO) {
        console.log(`TERMINATING SIMULATION AT t = ${t}`);
      }
      break;
    }

    // CHECK SPREAD Y TO DETERMINE IF POINTS ARE STILL CONVERGING OR DIVERGING
    if (spreadY < minSpreadY) {
      minSpreadY = spreadY;
      minSpreadYTime = t;
      dataAtMinSpreadYTime = {                                              // save current data in case this is convergence point
        data: POINTS.map(point => [ point.posY, point.posX ]),
        H: spreadY,
        W: spreadX,
        offsetY,
        offsetX,
      };
    }

    // CHECK SPREAD X FOR SANITY CHECK
    if (spreadX < minSpreadX) {
      minSpreadX = spreadX;
      minSpreadXTime = t;
    }

  }

  // SANITY CHECK: MAKE SURE BOTH DIMENSIONS CONVERGE AT THE SAME TIME
  if (minSpreadYTime !== minSpreadXTime) {
    throw `ERROR: MINIMUM SPREAD TIME FOR Y ${
      minSpreadYTime} DOES NOT MATCH THAT OF X ${minSpreadXTime}`;
  }

  // PART 1: DRAW GRID (WITH OFFSET) OF POINTS AT CONVERGENCE TIME TO MANUALLY DETERMINE MESSAGE
  if (part === 1) {

    const { data, H, W, offsetY, offsetX } = dataAtMinSpreadYTime;
    const [ POINT, BLANK ] = [ '#', '.' ]
    const GRID = Array.from({length: H}, () => Array(W).fill(BLANK));
    for (const point of data) {
      GRID[point[0] + offsetY][point[1] + offsetX] = POINT;
    }
    console.log(`GRID AT t = ${minSpreadYTime}:`);
    console.log('');
    for (const row of GRID) {
      console.log(row.join(' '));
    }
    console.log('');

  }

  // FOR PURPOSES OF MY TEST SUITE, RETURN TIME OF CONVERGENCE
  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  
  return part === 1 ? minSpreadYTime                                        // PART 1: NO WAY TO RETURN THE MESSAGE PROGRAMMATICALLY, SO I
                                                                            // JUST MADE IT RETURN THE TIME OF CONVERGENCE FOR MY TEST SUITE.
                    : minSpreadYTime;                                       // PART 2: COINCIDENTALLY, PART 2 ASKS US TO RETURN THE TIME OF
                                                                            // CONVERGENCE, SO MY TEST SUITE WILL EXPECT THE SAME OUTPUT FOR
                                                                            // BOTH PARTS.

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
`position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
// (after t === 3, the message is 'HI', but we have no feasible way of returning this programmatically)
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 10407;
// (after t === 10407, the message is 'PHLGRNFK', but we have no feasible way of returning this programmatically)
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 10407;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);