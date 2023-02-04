/*

--- Day 22: Mode Maze ---

This is it, your final stop: the year -483. It's snowing and dark outside; the only light you can see is coming from a small cottage in the distance. You make your way there and knock on the door.

A portly man with a large, white beard answers the door and invites you inside. For someone living near the North Pole in -483, he must not get many visitors, but he doesn't act surprised to see you. Instead, he offers you some milk and cookies.

After talking for a while, he asks a favor of you. His friend hasn't come back in a few hours, and he's not sure where he is. Scanning the region briefly, you discover one life signal in a cave system nearby; his friend must have taken shelter there. The man asks if you can go there to retrieve his friend.

The cave is divided into square regions which are either dominantly rocky, narrow, or wet (called its type). Each region occupies exactly one coordinate in X,Y format where X and Y are integers and zero or greater. (Adjacent regions can be the same type.)

The scan (your puzzle input) is not very detailed: it only reveals the depth of the cave system and the coordinates of the target. However, it does not reveal the type of each region. The mouth of the cave is at 0,0.

The man explains that due to the unusual geology in the area, there is a method to determine any region's type based on its erosion level. The erosion level of a region can be determined from its geologic index. The geologic index can be determined using the first rule that applies from the list below:

The region at 0,0 (the mouth of the cave) has a geologic index of 0.
The region at the coordinates of the target has a geologic index of 0.
If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
Otherwise, the region's geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.

A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183. Then:

If the erosion level modulo 3 is 0, the region's type is rocky.
If the erosion level modulo 3 is 1, the region's type is wet.
If the erosion level modulo 3 is 2, the region's type is narrow.

For example, suppose the cave system's depth is 510 and the target's coordinates are 10,10. Using % to represent the modulo operator, the cavern would look as follows:

At 0,0, the geologic index is 0. The erosion level is (0 + 510) % 20183 = 510. The type is 510 % 3 = 0, rocky.
At 1,0, because the Y coordinate is 0, the geologic index is 1 * 16807 = 16807. The erosion level is (16807 + 510) % 20183 = 17317. The type is 17317 % 3 = 1, wet.
At 0,1, because the X coordinate is 0, the geologic index is 1 * 48271 = 48271. The erosion level is (48271 + 510) % 20183 = 8415. The type is 8415 % 3 = 0, rocky.
At 1,1, neither coordinate is 0 and it is not the coordinate of the target, so the geologic index is the erosion level of 0,1 (8415) times the erosion level of 1,0 (17317), 8415 * 17317 = 145722555. The erosion level is (145722555 + 510) % 20183 = 1805. The type is 1805 % 3 = 2, narrow.
At 10,10, because they are the target's coordinates, the geologic index is 0. The erosion level is (0 + 510) % 20183 = 510. The type is 510 % 3 = 0, rocky.

Drawing this same cave system with rocky as ., wet as =, narrow as |, the mouth as M, the target as T, with 0,0 in the top-left corner, X increasing to the right, and Y increasing downward, the top-left corner of the map looks like this:

M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Before you go in, you should determine the risk level of the area. For the rectangle that has a top-left corner of region 0,0 and a bottom-right corner of the region containing the target, add up the risk level of each individual region: 0 for rocky regions, 1 for wet regions, and 2 for narrow regions.

In the cave system above, because the mouth is at 0,0 and the target is at 10,10, adding up the risk level of all regions with an X coordinate from 0 to 10 and a Y coordinate from 0 to 10, this total is 114.

What is the total risk level for the smallest rectangle that includes 0,0 and the target's coordinates?


--- Part Two ---

Okay, it's time to go rescue the man's friend.

As you leave, he hands you some tools: a torch and some climbing gear. You can't equip both tools at once, but you can choose to use neither.

Tools can only be used in certain regions:

In rocky regions, you can use the climbing gear or the torch. You cannot use neither (you'll likely slip and fall).
In wet regions, you can use the climbing gear or neither tool. You cannot use the torch (if it gets wet, you won't have a light source).
In narrow regions, you can use the torch or neither tool. You cannot use the climbing gear (it's too bulky to fit).

You start at 0,0 (the mouth of the cave) with the torch equipped and must reach the target coordinates as quickly as possible. The regions with negative X or Y are solid rock and cannot be traversed. The fastest route might involve entering regions beyond the X or Y coordinate of the target.

You can move to an adjacent region (up, down, left, or right; never diagonally) if your currently equipped tool allows you to enter that region. Moving to an adjacent region takes one minute. (For example, if you have the torch equipped, you can move between rocky and narrow regions, but cannot enter wet regions.)

You can change your currently equipped tool or put both away if your new equipment would be valid for your current region. Switching to using the climbing gear, torch, or neither always takes seven minutes, regardless of which tools you start with. (For example, if you are in a rocky region, you can switch from the torch to the climbing gear, but you cannot switch to neither.)

Finally, once you reach the target, you need the torch equipped before you can find him in the dark. The target is always in a rocky region, so if you arrive there with climbing gear equipped, you will need to spend seven minutes switching to your torch.

For example, using the same cave system as above, starting in the top left corner (0,0) and moving to the bottom right corner (the target, 10,10) as quickly as possible, one possible route is as follows, with your current position marked X:

Initially:
X=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Down:
M=.|=.|.|=.|=|=.
X|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Right:
M=.|=.|.|=.|=|=.
.X=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Switch from using the torch to neither tool:
M=.|=.|.|=.|=|=.
.X=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Right 3:
M=.|=.|.|=.|=|=.
.|=|X|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Switch from using neither tool to the climbing gear:
M=.|=.|.|=.|=|=.
.|=|X|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Down 7:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..X==..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Right:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..=X=..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Down 3:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||.X.|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Right:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||..X|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Down:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.X..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Right 4:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=X||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Up 2:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===X===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

Switch from using the climbing gear to the torch:
M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===X===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||

This is tied with other routes as the fastest way to reach the target: 45 minutes. In it, 21 minutes are spent switching tools (three times, seven minutes each) and the remaining 24 minutes are spent moving.

What is the fewest number of minutes you can take to reach the target?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function terrainTypeBFS (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // PARSE INPUT DATA, AND CONSTANTS
  const DEPTH = +inputArr[0].split(' ')[1];
  const [ TARGET_X, TARGET_Y ] = inputArr[1].split(' ')[1].split(',').map(n => +n);
  const TOP_EDGE_MULTIPLIER = 16807;
  const LEFT_EDGE_MULTIPLIER = 48271;
  const EROSION_LEVEL_MOD_CONSTANT = 20183;

  // START TIMING THE PROGRAM BEFORE THE CREATION OF ALL THE GRIDS, SINCE THAT TAKES THE LONGEST
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;

  // DATA STRUCTURES AND GRID CONSTANTS
  const GEOLOGIC_INDEX_GRID = Array.from({length: DEPTH}, () => Array(DEPTH).fill(null));
  const EROSION_LEVEL_GRID = Array.from({length: DEPTH}, () => Array(DEPTH).fill(null));
  const TYPE_GRID = Array.from({length: DEPTH}, () => Array(DEPTH).fill(null));
  const [ ROCKY, WET, NARROW ] = [ '.', '=', '|' ];
  const TYPE = [ ROCKY, WET, NARROW ];

  // APPLY RULE 1
  GEOLOGIC_INDEX_GRID[0][0] = 0;
  EROSION_LEVEL_GRID[0][0] = (GEOLOGIC_INDEX_GRID[0][0] + DEPTH) % EROSION_LEVEL_MOD_CONSTANT;
  TYPE_GRID[0][0] = TYPE[ EROSION_LEVEL_GRID[0][0] % 3 ];

  // APPLY RULE 2
  GEOLOGIC_INDEX_GRID[TARGET_Y][TARGET_X] = 0;
  EROSION_LEVEL_GRID[TARGET_Y][TARGET_X] = (GEOLOGIC_INDEX_GRID[TARGET_Y][TARGET_X] + DEPTH) % EROSION_LEVEL_MOD_CONSTANT;
  TYPE_GRID[TARGET_Y][TARGET_X] = TYPE[ EROSION_LEVEL_GRID[TARGET_Y][TARGET_X] % 3 ];

  // APPLY RULE 3
  for (let col = 1; col < DEPTH; ++col) {
    GEOLOGIC_INDEX_GRID[0][col] = col * TOP_EDGE_MULTIPLIER;
    EROSION_LEVEL_GRID[0][col] = (GEOLOGIC_INDEX_GRID[0][col] + DEPTH) % EROSION_LEVEL_MOD_CONSTANT;
    TYPE_GRID[0][col] = TYPE[ EROSION_LEVEL_GRID[0][col] % 3 ];
  }

  // APPLY RULE 4
  for (let row = 1; row < DEPTH; ++row) {
    GEOLOGIC_INDEX_GRID[row][0] = row * LEFT_EDGE_MULTIPLIER;
    EROSION_LEVEL_GRID[row][0] = (GEOLOGIC_INDEX_GRID[row][0] + DEPTH) % EROSION_LEVEL_MOD_CONSTANT;
    TYPE_GRID[row][0] = TYPE[ EROSION_LEVEL_GRID[row][0] % 3 ];
  }

  // APPLY RULE 5 (WITHOUT OVERWRITING RULE 2)
  for (let row = 1; row < DEPTH; ++row) {
    for (let col = 1; col < DEPTH; ++col) {
      if (!(row === TARGET_Y && col === TARGET_X)) {
        GEOLOGIC_INDEX_GRID[row][col] = EROSION_LEVEL_GRID[row][col - 1] * EROSION_LEVEL_GRID[row - 1][col];
        EROSION_LEVEL_GRID[row][col] = (GEOLOGIC_INDEX_GRID[row][col] + DEPTH) % EROSION_LEVEL_MOD_CONSTANT;
        TYPE_GRID[row][col] = TYPE[ EROSION_LEVEL_GRID[row][col] % 3 ];
      }
    }
  }
  
  // ANALYZE
  if (part === 1) {                                                                           // PART 1: CALCULATE TOTAL RISK LEVEL

    const RISK_LEVELS = { [ROCKY]: 0, [WET]: 1, [NARROW]: 2 };

    let totalRiskLevel = 0;
    for (let row = 0; row <= TARGET_Y; ++row) {
      for (let col = 0; col <= TARGET_X; ++col) {
        totalRiskLevel += RISK_LEVELS[ TYPE_GRID[row][col] ];
      }
    }

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return totalRiskLevel;

  } else {                                                                                    // PART 2: BFS TO REACH TARGET IN MIN *TIME* (NOT MOVES)

    // BFS CONSTANTS
    const DELTAS = [
      [ +1, 0 ],
      [ -1, 0 ],
      [ 0, +1 ],
      [ 0, -1 ],
    ];
    const [ TORCH, GEAR, NEITHER ] = [ 0, 1, 2 ];
    const SWITCH_TIME = 7;

    // INIT
    const Q = new Queue([ 0, 0, TORCH, 0, 0 ]);
    const visited = {};
    let lowestMoves = null;
    let upperBoundMoves = null;
    let lowestTime = Infinity;
    let movesForLowestTimeSolution = null;                                                    // for extra info only

    // BFS
    while (!Q.isEmpty()) {

      if (DISPLAY_EXTRA_INFO
        && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
      ) {
        const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
        console.log(`... ${
          MINS_PASSED
        } mins have passed since beginning this run`);
        console.log('Q SIZE:', Q.length)
        NEXT_MIN_TARGET = MINS_PASSED + 1;
      }

      const [ row, col, equipped, time, moves ] = Q.dequeue().val;

      // END BFS
      if (lowestMoves !== null && moves >= upperBoundMoves) break;                            // once you know lowestMoves, you get an upper bound for
                                                                                              // the number of moves for the time-optimal solution

      // TIME TOO HIGH
      if (time >= lowestTime) continue;                                                       // optimization

      // REPEATED INFERIOR STATE
      const serial = `${row},${col},${equipped}`;
      if (serial in visited && time >= visited[serial]) continue;                             // optimization (i confirmed it IS possible to revisit
                                                                                              // the same coord with the same equipment with higher time)
      visited[serial] = time;

      // FOUND TARGET
      if (row === TARGET_Y && col === TARGET_X) {
        if (lowestMoves === null) {
          lowestMoves = moves;
          upperBoundMoves = ((lowestMoves + 1) * SWITCH_TIME);                                // in extreme case, lowestMoves method may have involved
                                                                                              // switching with every move. perhaps there is another
                                                                                              // path that takes more moves but never involves switching.
                                                                                              // then find the number of moves that would take the same
                                                                                              // amount of time as the solution with the lowest moves,
                                                                                              // and this represents an upper bound.
          console.log(`FIRST SOLUTION FOUND AFTER ${moves} MOVES!`);
          console.log(`EXPECTING UPPER BOUND FOR MOVES TO BE ${lowestMoves * SWITCH_TIME}`);
        }
        const currentTime = time + (equipped === TORCH ? 0 : SWITCH_TIME);                    // don't forget to equip torch at the end if necessary
        if (currentTime < lowestTime) movesForLowestTimeSolution = moves;                     // for extra info only
        lowestTime = Math.min(lowestTime, currentTime);
      }

      // CONTINUE
      else {
        const currentType = TYPE_GRID[row][col];
        for (const [ dy, dx ] of DELTAS) {
          const [ newRow, newCol ] = [ row + dy, col + dx ];
          if (0 <= newRow && newRow < DEPTH && 0 <= newCol && newCol < DEPTH) {

            if (TYPE_GRID[newRow][newCol] === ROCKY) {

              // GEAR (CURRENTLY ROCKY OR WET)
              if ([ ROCKY, WET ].includes(currentType)) {
                Q.enqueue([ newRow, newCol, GEAR, time + 1 + (equipped === GEAR ? 0 : SWITCH_TIME), moves + 1 ]);
              }

              // TORCH (CURRENTLY ROCKY OR NARROW)
              if ([ ROCKY, NARROW ].includes(currentType)) {
                Q.enqueue([ newRow, newCol, TORCH, time + 1 + (equipped === TORCH ? 0 : SWITCH_TIME), moves + 1 ]);
              }
            }

            else if (TYPE_GRID[newRow][newCol] === WET) {

              // GEAR (CURRENTLY ROCKY OR WET)
              if ([ ROCKY, WET ].includes(currentType)) {
                Q.enqueue([ newRow, newCol, GEAR, time + 1 + (equipped === GEAR ? 0 : SWITCH_TIME), moves + 1 ]);
              }

              // NEITHER (CURRENTLY WET OR NARROW)
              if ([ WET, NARROW ].includes(currentType)) {
                Q.enqueue([ newRow, newCol, NEITHER, time + 1 + (equipped === NEITHER ? 0 : SWITCH_TIME), moves + 1 ]);
              }
            }

            else if (TYPE_GRID[newRow][newCol] === NARROW) {

              // TORCH (CURRENTLY ROCKY OR NARROW)
              if ([ ROCKY, NARROW ].includes(currentType)) {
                Q.enqueue([ newRow, newCol, TORCH, time + 1 + (equipped === TORCH ? 0 : SWITCH_TIME), moves + 1 ]);
              }

              // NEITHER (CURRENTLY WET OR NARROW)
              if ([ WET, NARROW ].includes(currentType)) {
                Q.enqueue([ newRow, newCol, NEITHER, time + 1 + (equipped === NEITHER ? 0 : SWITCH_TIME), moves + 1 ]);
              }
            }

            else throw `ERROR: UNRECOGNIZED TYPE ${TYPE_GRID[newRow][newCol]} AT ROW ${newRow}, COL ${newCol}`;

          }
        }
      }
    }

    if (DISPLAY_EXTRA_INFO) console.log(`LOWEST TIME SOLUTION TOOK ${movesForLowestTimeSolution} MOVES`);

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return lowestTime;
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = terrainTypeBFS;
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
`depth: 510
target: 10,10`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 114;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 7901;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 45;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1087;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);