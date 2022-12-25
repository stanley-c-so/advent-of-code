/*

--- Day 24: Blizzard Basin ---

With everything replanted for next year (and with elephants and monkeys to tend the grove), you and the Elves leave for the extraction point.

Partway up the mountain that shields the grove is a flat, open area that serves as the extraction point. It's a bit of a climb, but nothing the expedition can't handle.

At least, that would normally be true; now that the mountain is covered in snow, things have become more difficult than the Elves are used to.

As the expedition reaches a valley that must be traversed to reach the extraction site, you find that strong, turbulent winds are pushing small blizzards of snow and sharp ice around the valley. It's a good thing everyone packed warm clothes! To make it across safely, you'll need to find a way to avoid them.

Fortunately, it's easy to see all of this from the entrance to the valley, so you make a map of the valley and the blizzards (your puzzle input). For example:

#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#

The walls of the valley are drawn as #; everything else is ground. Clear ground - where there is currently no blizzard - is drawn as .. Otherwise, blizzards are drawn with an arrow indicating their direction of motion: up (^), down (v), left (<), or right (>).

The above map includes two blizzards, one moving right (>) and one moving down (v). In one minute, each blizzard moves one position in the direction it is pointing:

#.#####
#.....#
#.>...#
#.....#
#.....#
#...v.#
#####.#

Due to conservation of blizzard energy, as a blizzard reaches the wall of the valley, a new blizzard forms on the opposite side of the valley moving in the same direction. After another minute, the bottom downward-moving blizzard has been replaced with a new downward-moving blizzard at the top of the valley instead:

#.#####
#...v.#
#..>..#
#.....#
#.....#
#.....#
#####.#

Because blizzards are made of tiny snowflakes, they pass right through each other. After another minute, both blizzards temporarily occupy the same position, marked 2:

#.#####
#.....#
#...2.#
#.....#
#.....#
#.....#
#####.#

After another minute, the situation resolves itself, giving each blizzard back its personal space:

#.#####
#.....#
#....>#
#...v.#
#.....#
#.....#
#####.#

Finally, after yet another minute, the rightward-facing blizzard on the right is replaced with a new one on the left facing the same direction:

#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#

This process repeats at least as long as you are observing it, but probably forever.

Here is a more complex example:

#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#

Your expedition begins in the only non-wall position in the top row and needs to reach the only non-wall position in the bottom row. On each minute, you can move up, down, left, or right, or you can wait in place. You and the blizzards act simultaneously, and you cannot share a position with a blizzard.

In the above example, the fastest way to reach your goal requires 18 steps. Drawing the position of the expedition as E, one way to achieve this is:

Initial state:
#E######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#

Minute 1, move down:
#.######
#E>3.<.#
#<..<<.#
#>2.22.#
#>v..^<#
######.#

Minute 2, move down:
#.######
#.2>2..#
#E^22^<#
#.>2.^>#
#.>..<.#
######.#

Minute 3, wait:
#.######
#<^<22.#
#E2<.2.#
#><2>..#
#..><..#
######.#

Minute 4, move up:
#.######
#E<..22#
#<<.<..#
#<2.>>.#
#.^22^.#
######.#

Minute 5, move right:
#.######
#2Ev.<>#
#<.<..<#
#.^>^22#
#.2..2.#
######.#

Minute 6, move right:
#.######
#>2E<.<#
#.2v^2<#
#>..>2>#
#<....>#
######.#

Minute 7, move down:
#.######
#.22^2.#
#<vE<2.#
#>>v<>.#
#>....<#
######.#

Minute 8, move left:
#.######
#.<>2^.#
#.E<<.<#
#.22..>#
#.2v^2.#
######.#

Minute 9, move up:
#.######
#<E2>>.#
#.<<.<.#
#>2>2^.#
#.v><^.#
######.#

Minute 10, move right:
#.######
#.2E.>2#
#<2v2^.#
#<>.>2.#
#..<>..#
######.#

Minute 11, wait:
#.######
#2^E^2>#
#<v<.^<#
#..2.>2#
#.<..>.#
######.#

Minute 12, move down:
#.######
#>>.<^<#
#.<E.<<#
#>v.><>#
#<^v^^>#
######.#

Minute 13, move down:
#.######
#.>3.<.#
#<..<<.#
#>2E22.#
#>v..^<#
######.#

Minute 14, move right:
#.######
#.2>2..#
#.^22^<#
#.>2E^>#
#.>..<.#
######.#

Minute 15, move right:
#.######
#<^<22.#
#.2<.2.#
#><2>E.#
#..><..#
######.#

Minute 16, move right:
#.######
#.<..22#
#<<.<..#
#<2.>>E#
#.^22^.#
######.#

Minute 17, move down:
#.######
#2.v.<>#
#<.<..<#
#.^>^22#
#.2..2E#
######.#

Minute 18, move down:
#.######
#>2.<.<#
#.2v^2<#
#>..>2>#
#<....>#
######E#

What is the fewest number of minutes required to avoid the blizzards and reach the goal?


--- Part Two ---

As the expedition reaches the far side of the valley, one of the Elves looks especially dismayed:

He forgot his snacks at the entrance to the valley!

Since you're so good at dodging blizzards, the Elves humbly request that you go back for his snacks. From the same initial conditions, how quickly can you make it from the start to the goal, then back to the start, then back to the goal?

In the above example, the first trip to the goal takes 18 minutes, the trip back to the start takes 23 minutes, and the trip back to the goal again takes 13 minutes, for a total time of 54 minutes.

What is the fewest number of minutes required to reach the goal, go back to the start, then reach the goal again?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function movingObstaclesBFS (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const H = inputArr.length;
  const W = inputArr[0].length;

  const DIRS = [                                                                          // for you: [ dy, dx, actuallyMoved ]
    [-1, 0, true],
    [0, +1, true],
    [+1, 0, true],
    [0, -1, true],
    [0, 0, false],
  ];

  const BLIZZARD_DIR_STRINGS = '^>v<';

  const BLIZZARD_DIRS = [                                                                 // for the blizzards: [ dy, dx ]
    [-1, 0],
    [0, +1],
    [+1, 0],
    [0, -1],
  ];

  // SPACE OPTIMIZATION: FUNCTIONS TO STOP UPDATING BLIZZARD LOCATIONS AFTER REACHING LCM OF H - 2 AND W - 2, BECAUSE THEY REPEAT
  function GCD (num, denom) {                                                             // uses Euclidean algorithm (https://en.wikipedia.org/wiki/Euclidean_algorithm)
    num = Math.abs(num);
    denom = Math.abs(denom);
    return denom ? GCD(denom, num % denom) : num;                                         // credit to Phrogz (https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction)
  }
  function LCM (num1, num2) {
    return (!num1 || !num2) ? 0 : Math.abs((num1 * num2)) / GCD(num1, num2);              // credit to w3resource (https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php)
  }
  const LCMofGridInteriorDimensions = LCM(H - 2, W - 2);

  // DATA STRUCTURE
  const BLIZZARD_LOCATIONS = [ {} ];                                                      // BLIZZARD_LOCATIONS[i] is an object with keys that
                                                                                          // are serials of coords, and values that are arrays
                                                                                          // containing directional symbols (^>v<) meaning those
                                                                                          // blizzards occupy that location on move i

  // PARSE INPUT DATA TO INIT DATA STRUCTURE AND STARTING STATE
  for (let row = 0; row < H; ++row) {                                                     // init data structure for move 0...
    for (let col = 0; col < W; ++col) {
      if (BLIZZARD_DIR_STRINGS.includes(inputArr[row][col])) {
        const serial = `${row},${col}`;
        BLIZZARD_LOCATIONS[0][serial] = [ inputArr[row][col] ];                           // ...there will be no overlapping blizzards on move 0
      }
    }
  }
  const [ startRow, startCol ] = [ 0, inputArr[0].indexOf('.') ];
  const [ endRow, endCol ] = [ H - 1, inputArr[H - 1].indexOf('.') ];

  // SANITY CHECK TO MAKE SURE THERE ARE NO UP/DOWN BLIZZARDS IN THE START COLUMN OR END COLUMN
  // (OTHERWISE IT IS NOT CLEAR HOW THE RULES WOULD WORK WHERE A BLIZZARD THAT REACHES THE END OF ITS PATH GETS WARPED BACK TO THE START)
  if (!inputArr.map(row => row[startCol]).every(c => !'^v'.includes(c))
      || !inputArr.map(row => row[endCol]).every(c => !'^v'.includes(c))
  ) {
    throw `ERROR: THERE IS AT LEAST ONE ^ OR v BLIZZARD IN COLUMN ${startCol} OR COLUMN ${endCol}`;
  }

  // UTILITY FUNCTION: CALCULATE THE STATE OF THE BLIZZARDS ON THE NEXT MOVE AFTER THE MOST RECENTLY CALCULATED ONE
  function updateBlizzardLocations() {
    const OLD_LOCATIONS = BLIZZARD_LOCATIONS.at(-1);
    const NEW_LOCATIONS = {};

    for (const location in OLD_LOCATIONS) {
      const [ row, col ] = location.split(',').map(n => +n);
      for (const blizzard of OLD_LOCATIONS[location]) {
        const [ dy, dx ] = BLIZZARD_DIRS[ BLIZZARD_DIR_STRINGS.indexOf(blizzard) ];
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        const translatedNewRow = newRow === H - 1 ? 1 : newRow === 0 ? H - 2 : newRow;    // translate newRow if upper/lower boundary is reached
        const translatedNewCol = newCol === W - 1 ? 1 : newCol === 0 ? W - 2 : newCol;    // tanslate newCol if left/right boundary is reached
        const newSerial = `${translatedNewRow},${translatedNewCol}`;
        if (!(newSerial in NEW_LOCATIONS)) NEW_LOCATIONS[newSerial] = [];
        NEW_LOCATIONS[newSerial].push(blizzard);                                          // add blizzard to new location
      }
    }

    if (DISPLAY_EXTRA_INFO && DEBUG) {
      PRINT_BLIZZARD_STATE(NEW_LOCATIONS, BLIZZARD_LOCATIONS.length);
    }

    BLIZZARD_LOCATIONS.push(NEW_LOCATIONS);
  }

  // UTILITY FUNCTION FOR DEBUGGING: PRINT OUT ALL CALCULATED BLIZZARD STATES AFTER EVERY MOVE
  function PRINT_BLIZZARD_STATE(data, move) {

    // init empty grid
    const GRID = Array.from({length: H}, () => Array(W).fill('.'));
    for (let col = 0; col < W; ++col) {
      GRID[0][col] = '#';
      GRID[H - 1][col] = '#';
    }
    for (let row = 0; row < H; ++row) {
      GRID[row][0] = '#';
      GRID[row][W - 1] = '#';
    }
    GRID[startRow][startCol] = '.';
    GRID[endRow][endCol] = '.';

    // write blizzard data
    for (const serial in data) {
      const [ y, x ] = serial.split(',').map(n => +n);
      GRID[y][x] = data[serial].length === 1 ? data[serial][0] : data[serial].length;
    }

    // print grid
    console.log(`MOVE ${move}:`);
    for (const row of GRID) console.log(row.join(''));
    console.log('');
  }

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS ON ACTUAL DATA (PLEASE WAIT)...');

  let GLOBAL_REACHED_END_ONCE = false;                                                    // becomes true the first time BFS reaches end
  let GLOBAL_REACHED_START_AGAIN = false;                                                 // becomes true the first time BFS reaches start after reaching end

  const visited = new Set();
  const Q = new Queue([                                                                   // init Q with:
                        startRow,                                                         // y
                        startCol,                                                         // x
                        0,                                                                // moves
                        false,                                                            // REACHED_END_ONCE
                        false,                                                            // REACHED_START_AGAIN
                        false                                                             // actuallyMoved (needed for slight optimization)
                      ]);

  // BFS
  while (!Q.isEmpty()) {

    let [                                                                                 // use `let` to allow reassignment of 'checkpoint' variables
      y,
      x,
      moves,
      REACHED_END_ONCE,
      REACHED_START_AGAIN,
      actuallyMoved
    ] = Q.dequeue().val;

    const state = `${y},${x},${moves},${REACHED_END_ONCE},${REACHED_START_AGAIN},${actuallyMoved}`;
    if (visited.has(state)) continue;
    visited.add(state);

    // key checkpoint: reached the end
    if (y === endRow && x === endCol) {

      if (REACHED_END_ONCE && !REACHED_START_AGAIN && actuallyMoved) {
        throw 'ERROR: SHOULD NOT BE RE-ENTERING THE END WITHOUT REACHING THE START AGAIN';
      }

      REACHED_END_ONCE = true;

      if (part === 1                                                                      // PART 1: END WHEN REACHING THE END
          || REACHED_START_AGAIN                                                          // PART 2: END WHEN REACHING THE END, AFTER REACHING THE START AGAIN
      ) {
        if (!DEBUG) {
          console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
        }
        return moves;                                                                     // return moves to break out of simulation
      }
      
      if (!GLOBAL_REACHED_END_ONCE) {                                                     // slight optimization: the first time we reach the end once...
        while (!Q.isEmpty()) Q.dequeue();                                                 // ...clear out the queue and start fresh
        GLOBAL_REACHED_END_ONCE = true;
      }
    }

    // key checkpoint: reached the start AFTER reaching the end
    if (REACHED_END_ONCE && y === startRow && x === startCol) {

      if (REACHED_START_AGAIN && actuallyMoved) {
        throw 'ERROR: SHOULD NOT BE RE-ENTERING THE START ONCE IT HAS BEEN REACHED AGAIN';
      }

      REACHED_START_AGAIN = true;

      if (!GLOBAL_REACHED_START_AGAIN) {                                                  // slight optimization: the first time we reach the start again...
        while (!Q.isEmpty()) Q.dequeue();                                                 // ...clear out the queue and start fresh
        GLOBAL_REACHED_START_AGAIN = true;
      }
    }

    // if (moves + 1 === BLIZZARD_LOCATIONS.length) updateBlizzardLocations();               // NOTE: UPDATE BLIZZARD LOCATIONS IF NEXT MOVE UNCALCULATED
    if (moves + 1 === BLIZZARD_LOCATIONS.length
        && (moves + 1) < LCMofGridInteriorDimensions
    ) {
      updateBlizzardLocations();               // NOTE: UPDATE BLIZZARD LOCATIONS IF NEXT MOVE UNCALCULATED
    }

    // search neighbors if we have not reached triggered the end condition at the end.
    // we will need to know the blizzard locations for the next move, which is why we ran updateBlizzardLocations()

    for (const [dy, dx, involvesActualMove] of DIRS) {
      const newY = y + dy;
      const newX = x + dx;
      const newSerial = `${newY},${newX}`;
      if (
          (newY === startRow && newX === startCol                                         // scenario A: neighbor is start location
            && (!involvesActualMove || (REACHED_END_ONCE && !REACHED_START_AGAIN)))       // SLIGHT OPTIMIZATION: prohibit useless re-entry

          || (newY === endRow && newX === endCol                                          // scenario B: neighbor is end location
            && (!involvesActualMove || !(REACHED_END_ONCE && !REACHED_START_AGAIN)))      // SLIGHT OPTIMIZATION: prohibit useless re-enty

          || (0 < newY && newY < H - 1                                                    // scenaio C: neighbor is anywhere else, such that...
              && 0 < newX && newX < W - 1                                                 // ...neighbor is not in the walls, and...
              // && (!(newSerial in BLIZZARD_LOCATIONS[moves + 1])))                         // ...no blizzard exists there on the next turn
              && (!(newSerial in BLIZZARD_LOCATIONS[(moves + 1) % LCMofGridInteriorDimensions])))                         // ...no blizzard exists there on the next turn
      ) {
        Q.enqueue([
          newY,
          newX,
          moves + 1,
          REACHED_END_ONCE,
          REACHED_START_AGAIN,
          involvesActualMove
        ]);
      }
    }
  }

  throw `ERROR: QUEUE EMPTY WITH NO RETURN`;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = movingObstaclesBFS;
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
`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 18;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 247;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 54;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 728;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);