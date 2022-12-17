/*

--- Day 17: Pyroclastic Flow ---

Your handheld device has located an alternative exit from the cave for you and the elephants. The ground is rumbling almost continuously now, but the strange valves bought you some time. It's definitely getting warmer in here, though.

The tunnels eventually open into a very tall, narrow chamber. Large, oddly-shaped rocks are falling into the chamber from above, presumably due to all the rumbling. If you can't work out where the rocks will fall next, you might be crushed!

The five types of rocks have the following peculiar shapes, where # is rock and . is empty space:

####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##

The rocks fall in the order shown above: first the - shape, then the + shape, and so on. Once the end of the list is reached, the same order repeats: the - shape falls first, sixth, 11th, 16th, etc.

The rocks don't spin, but they do get pushed around by jets of hot gas coming out of the walls themselves. A quick scan reveals the effect the jets of hot gas will have on the rocks as they fall (your puzzle input).

For example, suppose this was the jet pattern in your cave:

>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>

In jet patterns, < means a push to the left, while > means a push to the right. The pattern above means that the jets will push a falling rock right, then right, then right, then left, then left, then right, and so on. If the end of the list is reached, it repeats.

The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).

After a rock appears, it alternates between being pushed by a jet of hot gas one unit (in the direction indicated by the next symbol in the jet pattern) and then falling one unit down. If any movement would cause any part of the rock to move into the walls, floor, or a stopped rock, the movement instead does not occur. If a downward movement would have caused a falling rock to move into the floor or an already-fallen rock, the falling rock stops where it is (having landed on something) and a new rock immediately begins falling.

Drawing falling rocks with @ and stopped rocks with #, the jet pattern in the example above manifests as follows:

The first rock begins falling:
|..@@@@.|
|.......|
|.......|
|.......|
+-------+

Jet of gas pushes rock right:
|...@@@@|
|.......|
|.......|
|.......|
+-------+

Rock falls 1 unit:
|...@@@@|
|.......|
|.......|
+-------+

Jet of gas pushes rock right, but nothing happens:
|...@@@@|
|.......|
|.......|
+-------+

Rock falls 1 unit:
|...@@@@|
|.......|
+-------+

Jet of gas pushes rock right, but nothing happens:
|...@@@@|
|.......|
+-------+

Rock falls 1 unit:
|...@@@@|
+-------+

Jet of gas pushes rock left:
|..@@@@.|
+-------+

Rock falls 1 unit, causing it to come to rest:
|..####.|
+-------+

A new rock begins falling:
|...@...|
|..@@@..|
|...@...|
|.......|
|.......|
|.......|
|..####.|
+-------+

Jet of gas pushes rock left:
|..@....|
|.@@@...|
|..@....|
|.......|
|.......|
|.......|
|..####.|
+-------+

Rock falls 1 unit:
|..@....|
|.@@@...|
|..@....|
|.......|
|.......|
|..####.|
+-------+

Jet of gas pushes rock right:
|...@...|
|..@@@..|
|...@...|
|.......|
|.......|
|..####.|
+-------+

Rock falls 1 unit:
|...@...|
|..@@@..|
|...@...|
|.......|
|..####.|
+-------+

Jet of gas pushes rock left:
|..@....|
|.@@@...|
|..@....|
|.......|
|..####.|
+-------+

Rock falls 1 unit:
|..@....|
|.@@@...|
|..@....|
|..####.|
+-------+

Jet of gas pushes rock right:
|...@...|
|..@@@..|
|...@...|
|..####.|
+-------+

Rock falls 1 unit, causing it to come to rest:
|...#...|
|..###..|
|...#...|
|..####.|
+-------+

A new rock begins falling:
|....@..|
|....@..|
|..@@@..|
|.......|
|.......|
|.......|
|...#...|
|..###..|
|...#...|
|..####.|
+-------+
The moment each of the next few rocks begins falling, you would see this:

|..@....|
|..@....|
|..@....|
|..@....|
|.......|
|.......|
|.......|
|..#....|
|..#....|
|####...|
|..###..|
|...#...|
|..####.|
+-------+

|..@@...|
|..@@...|
|.......|
|.......|
|.......|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

|..@@@@.|
|.......|
|.......|
|.......|
|....##.|
|....##.|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

|...@...|
|..@@@..|
|...@...|
|.......|
|.......|
|.......|
|.####..|
|....##.|
|....##.|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

|....@..|
|....@..|
|..@@@..|
|.......|
|.......|
|.......|
|..#....|
|.###...|
|..#....|
|.####..|
|....##.|
|....##.|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

|..@....|
|..@....|
|..@....|
|..@....|
|.......|
|.......|
|.......|
|.....#.|
|.....#.|
|..####.|
|.###...|
|..#....|
|.####..|
|....##.|
|....##.|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

|..@@...|
|..@@...|
|.......|
|.......|
|.......|
|....#..|
|....#..|
|....##.|
|....##.|
|..####.|
|.###...|
|..#....|
|.####..|
|....##.|
|....##.|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

|..@@@@.|
|.......|
|.......|
|.......|
|....#..|
|....#..|
|....##.|
|##..##.|
|######.|
|.###...|
|..#....|
|.####..|
|....##.|
|....##.|
|....#..|
|..#.#..|
|..#.#..|
|#####..|
|..###..|
|...#...|
|..####.|
+-------+

To prove to the elephants your simulation is accurate, they want to know how tall the tower will get after 2022 rocks have stopped (but before the 2023rd rock begins falling). In this example, the tower of rocks will be 3068 units tall.

How many units tall will the tower of rocks be after 2022 rocks have stopped falling?


--- Part Two ---

The elephants are not impressed by your simulation. They demand to know how tall the tower will be after 1000000000000 rocks have stopped! Only then will they feel confident enough to proceed through the cave.

In the example above, the tower would be 1514285714288 units tall!

How tall will the tower be after 1000000000000 rocks have stopped?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function getRockHeight (part, inputStr, DEBUG = false) {

  // INIT CONSTANTS
  const LEN_DATA = inputStr.length;
  
  // NOTE: I REPRESENT THIS SIMULATION UPSIDE-DOWN, BECAUSE AS I BUILD UP THIS GRID TO ACCOMMODATE A HIGHER AND HIGHER PILE,
  // I WANTED TO PUSH ROWS INTO THE GRID (RATHER THAN UNSHIFTING). THEREFORE, IMAGINE ROTATING THE IMAGE 180 DEGREES, AND MY GRID
  // LOOKS LIKE THAT. THE GOOD NEWS IS THAT A HIGHER VALUE OF y ALSO TRANSLATES TO A HIGHER VALUE OF ROW IN MY UPSIDE-DOWN GRID.
  // THE BAD NEWS IS THAT x VALUES ARE REVERSED, AND THE LEFT/RIGHT DIRECTIONAL INPUT FROM THE DATA ALSO NEEDS TO BE TREATED IN
  // REVERSE.

  // const ROCKS = [
  //   [['#', '#', '#', '#']],

  //   [['.', '#', '.'],
  //    ['#', '#', '#'],
  //    ['.', '#', '.']],

  //   [['#', '#', '#'],                                                               // NOTE: this rock is NOT identical when flipped upside down!
  //    ['#', '.', '.'],
  //    ['#', '.', '.']],

  //   [['#'],
  //    ['#'],
  //    ['#'],
  //    ['#']],

  //   [['#', '#'],
  //    ['#', '#']],
  // ];

  const ROCK_STRS =
`####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;
  
  const ROCKS = ROCK_STRS.split('\n\n')
                          .map(rockStr => rockStr.split('\n')
                                                  .reverse()
                                                  .map(str => str.split('')
                                                                  .reverse()));
  
  // INIT GRID
  let currRockType = 0;
  let currTopRow = -1;                                                              // floor is at -1, as row 0 is empty space
  const GRID_WIDTH = 7;
  const SPAWN_DISTANCE_X = 2;                                                       // the problem says the 'anchor' spawns 2 from left wall
  const SPAWN_DISTANCE_Y = 4;                                                       // the problem says the 'anchor' spawns 3 above floor...
                                                                                    // ...but their diagram indicates otherwise. i think when...
                                                                                    // ...they say 'floor' they mean the row of available space...
                                                                                    // ...whereas i think of it as the row that's blocked off
  const HIGHEST_ROCK_HEIGHT = Math.max(...ROCKS.map(r => r.length));
  const GRID = Array.from({length:  currTopRow
                                    + 1
                                    + SPAWN_DISTANCE_Y
                                    + HIGHEST_ROCK_HEIGHT},
                          () => Array(GRID_WIDTH).fill('.'));

  // HELPER: IF THE 'ANCHOR' OF A ROCK IS AT GIVEN (x, y), SEE IF THAT WOULD COLLIDE WITH ANYTHING IN GRID, OR BE OUT OF BOUNDS
  function checkAnchor(x, y) {
    const H = ROCKS[currRockType].length;
    const W = ROCKS[currRockType][0].length;

    // out of bounds check
    if (
      y < 0 || y + H - 1 >= GRID.length                                             // check top and bottom edges of shape
      || x - (W - 1) < 0 || x >= GRID[0].length                                     // check left and right edges of shape
    ) {
      return false;
    }

    // collision check
    for (let row = 0; row < H; ++row) {                                             // for every point along the shape...
      for (let col = W - 1; col >= 0; --col) {
        if (ROCKS[currRockType][row][col] === '.') continue;                        // ...that is not air...
        if (GRID[y + row][x - (W - 1) + col] !== '.') return false;                 // ...make sure the corresponding location in grid is empty
      }
    }
    return true;                                                                    // return true if no collisions
  }

  // HELPER: IF THE 'ANCHOR' OF A ROCK IS AT GIVEN (x, y), SETTLE THE ROCK IN THAT POSITION BY DRAWING '#' INTO THE GRID
  function settleRock(x, y) {
    const H = ROCKS[currRockType].length;
    const W = ROCKS[currRockType][0].length;

    for (let row = 0; row < H; ++row) {
      for (let col = W - 1; col >= 0; --col) {
        if (ROCKS[currRockType][row][col] === '.') continue;
        GRID[y + row][x - (W - 1) + col] = '#';
      }
    }
  }

  // INIT SIMULATION VARIABLES
  let jetIdx = 0;
  const TOTAL_NUM_ROCKS = part === 1 ? 2022 : 1000000000000;                        // PART 1: 2022 ROCKS; PART 2: 1 TRILLION ROCKS

  // INIT PATTERN-DETECTION VARIABLES
  const REPEATING_SERIAL_COUNTS = {};
  const KEY_ROCKS = [];
  let foundRepeatingDelta = false;
  let highestRepeatSerialCount = 0;
  let lastKeyRock = 0;                                                              // init at 0 because 'rock 0' has serial with frequency 0
  let KEY_ROCK_DELTA = null;                                                        // we will discover this later
  let HEIGHT_AT_FINAL_KEY_ROCK = null;                                              // we will discover this later
  let NUM_ROCKS = TOTAL_NUM_ROCKS;                                                  // init as TOTAL_NUM_ROCKS, but potentially decrease if pattern found

  // ANALYZE
  for (let rock = 1; rock <= NUM_ROCKS; ++rock) {                                   // NOTE: in part 2, NUM_ROCKS is prohibitively large. this will be
                                                                                    // changed by the code once the repeating pattern is found.

    // NOTE: HOW CAN WE SHORTCUT THE SIMULATION PROCESS INSTEAD OF ACTUALLY DROPPING EVERY ROCK? WE WANT TO LOOK FOR REPEATS TO SEE IF THERE IS
    // A POINT AT WHICH THE HEIGHT WILL ALWAYS INREASE BY THE SAME REPEATING HEIGHT, AFTER A CERTAIN NUMBER OF REPEATING ROCKS.
    //
    // THE FIRST CLUE TO DOING THIS IS TO REALIZE THAT SINCE THE BEHAVIOR OF A ROCK IS GOVERNED BY ITS SHAPE AND THE CURRENT STATE OF THE JETS OF GAS,
    // IF WE ARE TO FIND A REPEATING PATTERN, WE SHOULD LOOK FOR A PATTERN IN THE COMBINATION OF THE CURRENT ROCK SHAPE AND THE CURRENT JET INDEX.
    // AT THE TOP OF EVERY ITERATION OF THE SIMULATOR, WE CAN SERIALIZE THE CURRENT ROCK TYPE COMBINED WITH THE CURRENT JET INDEX, AND TRACK HOW MANY
    // TIMES THIS SERIAL HAS APPEARED.
    //
    // AT SOME POINT, WE WILL GET OUR FIRST REPEAT. THEN FOR SEVERAL ROCKS AFTER THAT, EVERY ROCK WILL ALSO START REPEATING ON DIFFERENT SERIALS. FOR A
    // WHILE, THESE REPEATING SERIALS WILL ALL HAVE A FREQUENCY OF 1.
    //
    // THEN AT SOME POINT, WE WILL START GETTING REPEAT SERIALS AT A FREQUENCY OF 2. AGAIN, FOR A WHILE, THESE REPEATING SERIALS WILL ALL HAVE A FREQUENCY
    // OF 2.
    //
    // EVENTUALLY, A PATTERN WILL BEGIN TO EMERGE. FOR EXAMPLE. IN MY SAMPLE DATA, THE FIRST TIME WE GET ANY SERIAL DATA IS AT ROCK 1. THEN, THE FIRST TIME
    // WE START SEEING SERIAL FREQUENCY 2 IS ON ROCK 51. THEN, THE FIRST TIME WE START SEEING SERIAL FREQUENCY 3 IS ON ROCK 86. THEN, THE FIRST TIME WE
    // START SEEING SERIAL FREQUENCY 4 IS ON ROCK 121.
    //
    // 51 - 1 = 50, BUT THEN 86 - 51 = 35, AND 121 - 86 = 35 ALSO. I BELIEVE THE DIFFERENCE BETWEEN 'KEY ROCKS' (AT WHICH THE SERIAL FREQUENCIES INCREMENT)
    // IS ALWAYS THE SAME AFTER 'KEY ROCK' 2. THIS MAKES SENSE, BECAUSE WHEN YOU LOOK AT THE ACTUAL GRID ITSELF, THE FIRST BATCH OF ROWS WILL VERY LIKELY
    // NOT BE PART OF A REPEATING PATTERN... IT WILL GO ON FOR SOME TIME BEFORE A PATTERN BEGINS TO ESTABLISH ITSELF. SO, KEY_ROCKS SHOULD HAVE LENGTH 4.
    //
    // WE CAN LOOK AT THE HEIGHT DIFFERENCES BETWEEN KEY ROCK 2 AND KEY ROCK 3, AND COMPARE THAT TO KEY ROCK 3 AND KEY ROCK 4. IN MY SAMPLE DATA, THE
    // FORMER IS 131 - 78 = 53, AND THE LATTER IS 184 - 131 = 53. SINCE WE NOW KNOW THAT THE PERIOD OF 'KEY ROCKS' IS 35, AND THE PERIOD OF 'KEY HEIGHTS' IS
    // 53, WE CAN EXTRAPOLATE ALL THE WAY TO 1,000,000,000,000 TO GET THE HEIGHT WITH A LITTLE BITH OF MATH.
    //
    // CONTINUING ALONG WITH THIS PATTERN, WE CAN CALCULATE THE HEIGHT ALL THE WAY UP TO FINAL KEY ROCK BEFORE OUR LIMIT. THE ROCK OFFSET IS THE NUMBER OF
    // REMAINING ROCKS. FROM OUR CURRENT ROCK POSITION, WE CAN CONTINUE THE SIMULATION BY THAT OFFSET NUMBER OF ROCKS, TAKE THAT HEIGHT DIFFERENCE, AND ADD
    // THAT HEIGHT DIFFERENCE TO THE HEIGHT AT THE FINAL KEY ROCK.

    const SERIAL = `${currRockType},${jetIdx}`;                                     // serialize based on rock type and jet index...
    if (!(SERIAL in REPEATING_SERIAL_COUNTS)) REPEATING_SERIAL_COUNTS[SERIAL] = 1;  // ...and update frequency of this serial
    ++REPEATING_SERIAL_COUNTS[SERIAL];

    if (REPEATING_SERIAL_COUNTS[SERIAL] > highestRepeatSerialCount) {               // we have encountered a key rock
      const newRockDelta = rock - lastKeyRock;                                      // difference between this rock and last key rock is new rock delta
      lastKeyRock = rock;
      highestRepeatSerialCount = REPEATING_SERIAL_COUNTS[SERIAL];

      KEY_ROCKS.push( { rock, height: currTopRow + 1 });

      if (!foundRepeatingDelta && newRockDelta === KEY_ROCK_DELTA) {                // if the new rock delta matches the previous, we've found repeating delta

        foundRepeatingDelta = true;                                                 // setting this to true prevents us from looking at this block again
        
        if (DISPLAY_EXTRA_INFO) console.log('KEY ROCKS:', KEY_ROCKS);

        if (KEY_ROCKS.length !== 4) {                                               // sanity check: KEY_ROCKS should have length 4, because...
          throw `ERROR: KEY_ROCKS SHOULD HAVE LENGTH 4, BUT HAS ${                  // ...the difference between key rocks 3 and 4 will confirm...
            KEY_ROCKS.length                                                        // ...the first repeat of the difference between key rocks 2 and 3
          }`;
        }

        const HEIGHT_DELTA = KEY_ROCKS.at(-1).height - KEY_ROCKS.at(-2).height;     // we have now discovered HEIGHT_DELTA
        HEIGHT_AT_FINAL_KEY_ROCK = KEY_ROCKS.at(-1).height;                         // we have now discovered HEIGHT_AT_FINAL_KEY_ROCK

        const FINAL_ROCK_OFFSET = (NUM_ROCKS - rock) % KEY_ROCK_DELTA;
        HEIGHT_AT_FINAL_KEY_ROCK += ( HEIGHT_DELTA *
                                      Math.floor((NUM_ROCKS - rock) / KEY_ROCK_DELTA));

        NUM_ROCKS = rock + FINAL_ROCK_OFFSET;                                       // NOTE: part 1 real data will never enter this block because...
                                                                                    // 2022 blocks is too small for the real data to find the repeating delta
      }

      KEY_ROCK_DELTA = newRockDelta;
    }

    // init 'anchor': this is what the problem describes as the bottom left of the shape.
    // NOTE: since we represent this problem upside down, then the anchor is now the top right edge of shape.
    let anchorX = GRID_WIDTH - SPAWN_DISTANCE_X - 1;
    let anchorY = currTopRow + SPAWN_DISTANCE_Y;

    // simulate the falling of the rock
    while (true) {

      // STEP 1: rock gets blown sideways by jet
      const DIR = inputStr[jetIdx];
      jetIdx = (jetIdx + 1) % LEN_DATA;
      if (DIR === '>') {                                                            // GO LEFT (our representation is upside down)
        if (checkAnchor(anchorX - 1, anchorY)) --anchorX;                           // move rock to the left if no collision and in bounds
      }
      else if (DIR === '<') {                                                       // GO RIGHT (our representation is upside down)
        if (checkAnchor(anchorX + 1, anchorY)) ++anchorX;                           // move rock to the right if no collision and in bounds
      }
      else throw `ERROR: INVALID INPUT ${DIR}`;
      
      // STEP 2: rock attempts to fall
      if (checkAnchor(anchorX, anchorY - 1)) --anchorY;                             // move rock down if no collision
      else {                                                                        // rock cannot move down...
        settleRock(anchorX, anchorY);                                               // ...so it settles
        break;                                                                      // NOTE: DON'T FORGET TO BREAK OUT OF while (true) LOOP!
      }
    }

    // expand the grid if necessary
    const ceilFromThisRock = anchorY + ROCKS[currRockType].length - 1;
    if (ceilFromThisRock > currTopRow) {
      for (let i = 0; i < ceilFromThisRock - currTopRow; ++i) {
        GRID.push(Array(GRID_WIDTH).fill('.'));
      }
      currTopRow = ceilFromThisRock;
    }

    currRockType = (currRockType + 1) % ROCKS.length;                               // change to next rock type
  }

  // RETURN REQUIRED OUTPUT AFTER SIMULATION
  if (part === 1                                                                    // PART 1: GET HEIGHT AFTER 2022 ROCKS
      && !foundRepeatingDelta                                                       // this line allows the sample data in part 1 to use part 2 shortcut
  ) {

    return currTopRow + 1;                                                          // currTopRow is 0-indexed, so height is 1 greater
    
  } else {                                                                          // PART 2: GET HEIGHT AFTER 1,000,000,000,000 ROCKS
    
    if (HEIGHT_AT_FINAL_KEY_ROCK === null) {                                        // sanity check: make sure a pattern was actually found
      throw 'ERROR: DID NOT FIND REPEATING PATTERN';
    }

    return (currTopRow + 1)                                                         // current height (currTopRow is 0-indexed)
            - KEY_ROCKS.at(-1).height                                               // minus the height at the last simulated key rock
            + HEIGHT_AT_FINAL_KEY_ROCK;                                             // plus the height at the extrapolated final key rock

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = getRockHeight;
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
`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3068;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 3067;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1514285714288;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1514369501484;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);