/*

--- Day 22: Sporifica Virus ---

Diagnostics indicate that the local grid computing cluster has been contaminated with the Sporifica Virus. The grid computing cluster is a seemingly-infinite two-dimensional grid of compute nodes. Each node is either clean or infected by the virus.

To prevent overloading the nodes (which would render them useless to the virus) or detection by system administrators, exactly one virus carrier moves through the network, infecting or cleaning nodes as it moves. The virus carrier is always located on a single node in the network (the current node) and keeps track of the direction it is facing.

To avoid detection, the virus carrier works in bursts; in each burst, it wakes up, does some work, and goes back to sleep. The following steps are all executed in order one time each burst:

If the current node is infected, it turns to its right. Otherwise, it turns to its left. (Turning is done in-place; the current node does not change.)
If the current node is clean, it becomes infected. Otherwise, it becomes cleaned. (This is done after the node is considered for the purposes of changing direction.)
The virus carrier moves forward one node in the direction it is facing.
Diagnostics have also provided a map of the node infection status (your puzzle input). Clean nodes are shown as .; infected nodes are shown as #. This map only shows the center of the grid; there are many more nodes beyond those shown, but none of them are currently infected.

The virus carrier begins in the middle of the map facing up.

For example, suppose you are given a map like this:

..#
#..
...

Then, the middle of the infinite grid looks like this, with the virus carrier's position marked with [ ]:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . # . . .
. . . #[.]. . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

The virus carrier is on a clean node, so it turns left, infects the node, and moves left:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . # . . .
. . .[#]# . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

The virus carrier is on an infected node, so it turns right, cleans the node, and moves up:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . .[.]. # . . .
. . . . # . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

Four times in a row, the virus carrier finds a clean, infects it, turns left, and moves forward, ending in the same place and still facing up:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . #[#]. # . . .
. . # # # . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

Now on the same node as before, it sees an infection, which causes it to turn right, clean the node, and move forward:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . # .[.]# . . .
. . # # # . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

After the above actions, a total of 7 bursts of activity had taken place. Of them, 5 bursts of activity caused an infection.

After a total of 70, the grid looks like this, with the virus carrier facing up:

. . . . . # # . .
. . . . # . . # .
. . . # . . . . #
. . # . #[.]. . #
. . # . # . . # .
. . . . . # # . .
. . . . . . . . .
. . . . . . . . .

By this time, 41 bursts of activity caused an infection (though most of those nodes have since been cleaned).

After a total of 10000 bursts of activity, 5587 bursts will have caused an infection.

Given your actual map, after 10000 bursts of activity, how many bursts cause a node to become infected? (Do not count nodes that begin infected.)


--- Part Two ---

As you go to remove the virus from the infected nodes, it evolves to resist your attempt.

Now, before it infects a clean node, it will weaken it to disable your defenses. If it encounters an infected node, it will instead flag the node to be cleaned in the future. So:

Clean nodes become weakened.
Weakened nodes become infected.
Infected nodes become flagged.
Flagged nodes become clean.

Every node is always in exactly one of the above states.

The virus carrier still functions in a similar way, but now uses the following logic during its bursts of action:

Decide which way to turn based on the current node:
If it is clean, it turns left.
If it is weakened, it does not turn, and will continue moving in the same direction.
If it is infected, it turns right.
If it is flagged, it reverses direction, and will go back the way it came.
Modify the state of the current node, as described above.
The virus carrier moves forward one node in the direction it is facing.

Start with the same map (still using . for clean and # for infected) and still with the virus carrier starting in the middle and facing up.

Using the same initial state as the previous example, and drawing weakened as W and flagged as F, the middle of the infinite grid looks like this, with the virus carrier's position again marked with [ ]:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . # . . .
. . . #[.]. . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

This is the same as before, since no initial nodes are weakened or flagged. The virus carrier is on a clean node, so it still turns left, instead weakens the node, and moves left:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . # . . .
. . .[#]W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

The virus carrier is on an infected node, so it still turns right, instead flags the node, and moves up:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . .[.]. # . . .
. . . F W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

This process repeats three more times, ending on the previously-flagged node and facing right:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . W W . # . . .
. . W[F]W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

Finding a flagged node, it reverses direction and cleans the node:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . W W . # . . .
. .[W]. W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

The weakened node becomes infected, and it continues in the same direction:

. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . W W . # . . .
.[.]# . W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .

Of the first 100 bursts, 26 will result in infection. Unfortunately, another feature of this evolved virus is speed; of the first 10000000 bursts, 2511944 will result in infection.

Given your actual map, after 10000000 bursts of activity, how many bursts cause a node to become infected? (Do not count nodes that begin infected.)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function traverseInfiniteGridWhereCoordsHaveMultipleStates (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  const H = inputArr.length;
  const W = inputArr[0].length;

  const INFECTED = '#';
  const INFECTED_SET = new Set();
  const WEAKENED_SET = new Set();                                                 // for part 2
  const FLAGGED_SET = new Set();                                                  // for part 2

  const NUM_ROUNDS = extraParam;
  const DELTAS = [
    [ -1, 0 ],
    [ 0, +1 ],
    [ +1, 0 ],
    [ 0, -1 ],
  ];

  // PARSE INPUT DATA
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (inputArr[row][col] === INFECTED) {
        const coords = `${row - Math.floor(H/2)},${col - Math.floor(W/2)}`;       // add #s to infected set
        INFECTED_SET.add(coords);
      }
    }
  }


  // INIT
  let [ y, x ] = [ 0, 0 ];
  let dir = 0;
  let roundsCausingInfection = 0;

  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  for (let i = 0; i < NUM_ROUNDS; ++i) {
    const coords = `${y},${x}`;

    if (part === 1) {                                                             // PART 1: ONLY CLEAN AND INFECTED STATES

      if (INFECTED_SET.has(coords)) {
        dir = (dir + 1) % 4;                                                      // turn right
        INFECTED_SET.delete(coords);                                              // infected --> clean
      } else {
        dir = (dir + 4 - 1) % 4;                                                  // turn left
        INFECTED_SET.add(coords);                                                 // clean --> infected
        ++roundsCausingInfection;                                                 // infection is caused from a clean state
      }

    } else {                                                                      // PART 2: ALSO WEAKENED AND FLAGGED STATES

      if (INFECTED_SET.has(coords)) {
        dir = (dir + 1) % 4;                                                      // turn right
        INFECTED_SET.delete(coords);
        FLAGGED_SET.add(coords);                                                  // infected --> flagged
      } else if (FLAGGED_SET.has(coords)) {
        dir = (dir + 2) % 4;                                                      // turn around
        FLAGGED_SET.delete(coords);                                               // flagged --> clean
      } else if (WEAKENED_SET.has(coords)) {
        WEAKENED_SET.delete(coords);
        INFECTED_SET.add(coords);                                                 // weakened --> infected
        ++roundsCausingInfection;                                                 // infection is caused from a weakened state
      } else {
        dir = (dir + 4 - 1) % 4;                                                  // turn left
        WEAKENED_SET.add(coords);                                                 // clean --> weakened
      }

    }

    const [ dy, dx ] = DELTAS[dir];
    y += dy;
    x += dx;
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return roundsCausingInfection;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = traverseInfiniteGridWhereCoordsHaveMultipleStates;
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
`..#
#..
...`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 7,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 70,
  DEBUG: true,
};
expected = 41;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 10000,
  DEBUG: true,
};
expected = 5587;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 10000,
};
expected = 5261;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 100,
  DEBUG: true,
};
expected = 26;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 10000000,
  DEBUG: true,
};
expected = 2511944;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 10000000,
};
expected = 2511927;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);