/*

--- Day 23: Unstable analyzeDiffusion ---

You enter a large crater of gray dirt where the grove is supposed to be. All around you, plants you imagine were expected to be full of fruit are instead withered and broken. A large group of Elves has formed in the middle of the grove.

"...but this volcano has been dormant for months. Without ash, the fruit can't grow!"

You look up to see a massive, snow-capped mountain towering above you.

"It's not like there are other active volcanoes here; we've looked everywhere."

"But our scanners show active magma flows; clearly it's going somewhere."

They finally notice you at the edge of the grove, your pack almost overflowing from the random star fruit you've been collecting. Behind you, elephants and monkeys explore the grove, looking concerned. Then, the Elves recognize the ash cloud slowly spreading above your recent detour.

"Why do you--" "How is--" "Did you just--"

Before any of them can form a complete question, another Elf speaks up: "Okay, new plan. We have almost enough fruit already, and ash from the plume should spread here eventually. If we quickly plant new seedlings now, we can still make it to the extraction point. Spread out!"

The Elves each reach into their pack and pull out a tiny plant. The plants rely on important nutrients from the ash, so they can't be planted too close together.

There isn't enough time to let the Elves figure out where to plant the seedlings themselves; you quickly scan the grove (your puzzle input) and note their positions.

For example:

....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..

The scan shows Elves # and empty ground .; outside your scan, more empty ground extends a long way in every direction. The scan is oriented so that north is up; orthogonal directions are written N (north), S (south), W (west), and E (east), while diagonal directions are written NE, NW, SE, SW.

The Elves follow a time-consuming process to figure out where they should each go; you can speed up this process considerably. The process consists of some number of rounds during which Elves alternate between considering where to move and actually moving.

During the first half of each round, each Elf considers the eight positions adjacent to themself. If no other Elves are in one of those eight positions, the Elf does not do anything during this round. Otherwise, the Elf looks in each of four directions in the following order and proposes moving one step in the first valid direction:

If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.

After each Elf has had a chance to propose a move, the second half of the round can begin. Simultaneously, each Elf moves to their proposed destination tile if they were the only Elf to propose moving to that position. If two or more Elves propose moving to the same position, none of those Elves move.

Finally, at the end of the round, the first direction the Elves considered is moved to the end of the list of directions. For example, during the second round, the Elves would try proposing a move to the south first, then west, then east, then north. On the third round, the Elves would first consider west, then east, then north, then south.

As a smaller example, consider just these five Elves:

.....
..##.
..#..
.....
..##.
.....

The northernmost two Elves and southernmost two Elves all propose moving north, while the middle Elf cannot move north and proposes moving south. The middle Elf proposes the same destination as the southwest Elf, so neither of them move, but the other three do:

..##.
.....
..#..
...#.
..#..
.....

Next, the northernmost two Elves and the southernmost Elf all propose moving south. Of the remaining middle two Elves, the west one cannot move south and proposes moving west, while the east one cannot move south or west and proposes moving east. All five Elves succeed in moving to their proposed positions:

.....
..##.
.#...
....#
.....
..#..

Finally, the southernmost two Elves choose not to move at all. Of the remaining three Elves, the west one proposes moving west, the east one proposes moving east, and the middle one proposes moving north; all three succeed in moving:

..#..
....#
#....
....#
.....
..#..

At this point, no Elves need to move, and so the process ends.

The larger example above proceeds as follows:

== Initial State ==
..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............

== End of Round 1 ==
..............
.......#......
.....#...#....
...#..#.#.....
.......#..#...
....#.#.##....
..#..#.#......
..#.#.#.##....
..............
....#..#......
..............
..............

== End of Round 2 ==
..............
.......#......
....#.....#...
...#..#.#.....
.......#...#..
...#..#.#.....
.#...#.#.#....
..............
..#.#.#.##....
....#..#......
..............
..............

== End of Round 3 ==
..............
.......#......
.....#....#...
..#..#...#....
.......#...#..
...#..#.#.....
.#..#.....#...
.......##.....
..##.#....#...
...#..........
.......#......
..............

== End of Round 4 ==
..............
.......#......
......#....#..
..#...##......
...#.....#.#..
.........#....
.#...###..#...
..#......#....
....##....#...
....#.........
.......#......
..............

== End of Round 5 ==
.......#......
..............
..#..#.....#..
.........#....
......##...#..
.#.#.####.....
...........#..
....##..#.....
..#...........
..........#...
....#..#......
..............
After a few more rounds...

== End of Round 10 ==
.......#......
...........#..
..#.#..#......
......#.......
...#.....#..#.
.#......##....
.....##.......
..#........#..
....#.#..#....
..............
....#..#..#...
..............

To make sure they're on the right track, the Elves like to check after round 10 that they're making good progress toward covering enough ground. To do this, count the number of empty ground tiles contained by the smallest rectangle that contains every Elf. (The edges of the rectangle should be aligned to the N/S/E/W directions; the Elves do not have the patience to calculate arbitrary rectangles.) In the above example, that rectangle is:

......#.....
..........#.
.#.#..#.....
.....#......
..#.....#..#
#......##...
....##......
.#........#.
...#.#..#...
............
...#..#..#..

In this region, the number of empty ground tiles is 110.

Simulate the Elves' process and find the smallest rectangle that contains the Elves after 10 rounds. How many empty ground tiles does that rectangle contain?


--- Part Two ---

It seems you're on the right track. Finish simulating the process and figure out where the Elves need to go. How many rounds did you save them?

In the example above, the first round where no Elf moved was round 20:

.......#......
....#......#..
..#.....#.....
......#.......
...#....#.#..#
#.............
....#.....#...
..#.....#.....
....#.#....#..
.........#....
....#......#..
.......#......

Figure out where the Elves need to go. What is the number of the first round where no Elf moves?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeDiffusion (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const SURROUNDINGS = [                                                                                      // i.e. [dy, dx] for each of the 8 surrounding locations
    [-1, -1], [-1, 0], [-1, +1],                                                                              // NW, N, NE
    [0, -1], [0, +1],                                                                                         // W,     E
    [+1, -1], [+1, 0], [+1, +1],                                                                              // SW, S, SE
  ];
  const DIRS = [                                                                                              // i.e. [dy, dx] for each of 3 sub-directions, for each of 4 directions
    [ [-1, -1], [-1, 0], [-1, +1] ],                                                                          // NW, N, NE
    [ [+1, -1], [+1, 0], [+1, +1] ],                                                                          // Sw, S, SE
    [ [-1, -1], [0, -1], [+1, -1] ],                                                                          // NW, W, SW
    [ [-1, +1], [0, +1], [+1, +1] ],                                                                          // NE, E, SE
  ]

  // DATA STRUCTURES - SINCE THE ELVES CAN MOVE IN ANY DIRECTION ALONG AN INFINITE XY PLANE, INSTEAD OF MAINTAINING A GRID TO TRACK THEIR MOVEMENTS,
  // WE CAN USE TWO THINGS IN COMBINATION: 1) AN ARRAY WITH WHICH WE CAN LOOK UP THE CURRENT POSITION OF ANY ELF, AND 2) A DICTIONARY WITH WHICH WE CAN
  // LOOK UP THE CURRENT OCCUPANT OF ANY OCCUPIED POSITION.
  let ELVES = [];                                                                                             // elves can be identified by index, although we don't need to do this
  let LOCATIONS = {};

  // PARSE INPUT DATA
  for (let row = 0; row < inputArr.length; ++row) {
    for (let col = 0; col < inputArr[0].length; ++col) {
      if (inputArr[row][col] === '#') {
        const serial = `${row},${col}`;
        ELVES.push(serial);
        LOCATIONS[serial] = ELVES.length - 1;                                                                 // i.e. the index of the latest elf
      }
    }
  }

  // INIT STATE
  let dir = 0;                                                                                                // the 'base direction' from which elves begin their proposal process

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (part === 2 && !DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  for (
    let round = 1;
    part === 1  ? round <= 10                                                                                 // PART 1: RUN SIMULATION FOR 10 ROUNDS
                : true;                                                                                       // PART 2: RUN SIMULATION INDEFINITELY UNTIL ALL ELVES STOP MOVING
    ++round
  ) {

    // init new data structures for next round
    const PROPOSALS = {};                                                                                     // track locations that elves are proposing to move to
    const NEW_ELVES = [];                                                                                     // track new state for ELVES after this round
    const NEW_LOCATIONS = {};                                                                                 // track new state for LOCATIONS after this round

    // init state
    let nobodyMoved = true;                                                                                   // assume nobody moved for this round, but set to false on elf's move

    // for each elf, analyze its move proposals, if any
    for (let i = 0; i < ELVES.length; ++i) {

      const currPositionSerial = ELVES[i];
      const [row, col] = currPositionSerial.split(',').map(n => +n);

      const surroundingsToCheck = SURROUNDINGS.map(dYdX => `${row + dYdX[0]},${col + dYdX[1]}`);              // ...first, check all 8 surrounding coordinates.

      if (surroundingsToCheck.every(serial => !(serial in LOCATIONS))) {                                      // if no neighboring elves, elf doesn't move, and so...

        NEW_ELVES[i] = currPositionSerial;                                                                    // ...its new position will be its current position...
        if (currPositionSerial in NEW_LOCATIONS) {
          throw `ERROR: ${currPositionSerial} WILL ALREADY BE OCCUPIED BY ANOTHER ELF`;
        }
        NEW_LOCATIONS[currPositionSerial] = i;                                                                // ...and it will occupy its current position in the next round
        
      } else {                                                                                                // if it does have a neighboing elf, consider proposing a movement...

        let elfMadeValidProposal = false;
        for (let elfDir = 0; elfDir < 4; ++elfDir) {                                                          // ...by starting from current 'base direction'...
          const locationsToCheck = DIRS[(dir + elfDir) % 4].map(dYdX => `${row + dYdX[0]},${col + dYdX[1]}`); // ...and checking the relevant locations in that direction
          if (locationsToCheck.every(serial => !(serial in LOCATIONS))) {                                     // if the 3 key locations are currently unoccupied...
            const proposal = locationsToCheck[1];                                                             // ...then the elf proposes the cardinal direction (middle location)...
            if (!(proposal in PROPOSALS)) PROPOSALS[proposal] = [];
            PROPOSALS[proposal].push(i);                                                                      // ...and we add this proposal to the list of proposals this round
            elfMadeValidProposal = true;
            break;
          }
        }
        if (!elfMadeValidProposal) {                                                                          // if all 4 directions are invalid, then this elf doesn't move...
          NEW_ELVES[i] = currPositionSerial;                                                                  // ...its new position will be its current position...
          if (currPositionSerial in NEW_LOCATIONS) {
            throw `ERROR: ${currPositionSerial} WILL ALREADY BE OCCUPIED BY ANOTHER ELF`;
          }
          NEW_LOCATIONS[currPositionSerial] = i;                                                              // ...and it will occupy its current position in the next round
        }

      }
    }

    // then, analyze each valid proposal
    for (const proposal in PROPOSALS) {
      if (PROPOSALS[proposal].length === 1) {                                                                 // only one elf proposed this location - move is valid...

        const elfIdx = PROPOSALS[proposal][0];
        NEW_ELVES[elfIdx] = proposal;                                                                         // ...so update the data structures with this elf's new position...
        if (proposal in NEW_LOCATIONS) {
          throw `ERROR: ${currPositionSerial} WILL ALREADY BE OCCUPIED BY ANOTHER ELF`;
        }
        NEW_LOCATIONS[proposal] = elfIdx;
        nobodyMoved = false;                                                                                  // ...and flag this round as having an elf that moved

      } else {                                                                                                // multiple elves proposed this location - moves are not valid...

        for (const elfIdx of PROPOSALS[proposal]) {                                                           // ...so each proposing elf will stay in its current location
          NEW_ELVES[elfIdx] = ELVES[elfIdx];
          if (ELVES[elfIdx] in NEW_LOCATIONS) {
            throw `ERROR: ${currPositionSerial} WILL ALREADY BE OCCUPIED BY ANOTHER ELF`;
          }
          NEW_LOCATIONS[ELVES[elfIdx]] = elfIdx;
        }

      }
    }

    // update state
    ELVES = NEW_ELVES;                                                                                        // copy over elf information for next round
    LOCATIONS = NEW_LOCATIONS;                                                                                // copy over location information for next round
    dir = (dir + 1) % 4;                                                                                      // switch to the next 'base direction'

    // OPTIONAL: display grid after every round
    if (DEBUG && DISPLAY_EXTRA_INFO) DRAW();

    // break simulation if no elves moved this round
    if (nobodyMoved) {                                                                                        // this doesn't happen in PART 1, but theoretically it could.
                                                                                                              // if it did, then we might as well break out of the loop.

      if (part === 2) {                                                                                       // PART 2: ONCE ELVES STOP MOVING, RETURN THE ROUND NUMBER
        if (DEBUG || DISPLAY_EXTRA_INFO) {
          console.log('FINAL GRID:');
          console.log('');
          DRAW();
        }
        if (!DEBUG) {
          console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
        }
        return round;
      }

      break;
    }
  }

  function DRAW() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const location in LOCATIONS) {
      const [row, col] = location.split(',').map(n => +n);
      minX = Math.min(minX, col);
      maxX = Math.max(maxX, col);
      minY = Math.min(minY, row);
      maxY = Math.max(maxY, row);
    }
    const PADDING = 2;
    const GRID = Array.from({length: maxY - minY + 1 + (2 * PADDING)},
                            () => Array(maxX - minX + 1 + (2 * PADDING)).fill('.'));
    for (const location in LOCATIONS) {
      const [row, col] = location.split(',').map(n => +n);
      GRID[row - minY + PADDING][col - minX + PADDING] = '#';
    }
    for (const row of GRID) console.log(row.join(''));
    console.log('');
  }

                                                                                                              // PART 1: AFTER 10 ROUNDS, ANALYZE SPREAD OF ELVES

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const location in LOCATIONS) {
    const [row, col] = location.split(',').map(n => +n);
    minX = Math.min(minX, col);
    maxX = Math.max(maxX, col);
    minY = Math.min(minY, row);
    maxY = Math.max(maxY, row);
  }

  if (DEBUG || DISPLAY_EXTRA_INFO) {
    console.log('FINAL GRID:');
    console.log('');
    DRAW();
  }

  return (maxX - minX + 1) * (maxY - minY + 1) - ELVES.length;                                                // # empty spaces is the area of the rectangle, minus # of elves
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeDiffusion;
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
`....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 110;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 3864;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 20;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 946;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);