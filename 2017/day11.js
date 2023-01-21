/*

--- Day 11: Hex Ed ---

Crossing the bridge, you've barely reached the other side of the stream when a program comes up to you, clearly in distress. "It's my child process," she says, "he's gotten lost in an infinite grid!"

Fortunately for her, you have plenty of experience with infinite grids.

Unfortunately for you, it's a hex grid.

The hexagons ("hexes") in this grid are aligned such that adjacent hexes can be found to the north, northeast, southeast, south, southwest, and northwest:

  \ n  /
nw +--+ ne
  /    \
-+      +-
  \    /
sw +--+ se
  / s  \

You have the path the child process took. Starting where he started, you need to determine the fewest number of steps required to reach him. (A "step" means to move from the hex you are in to any adjacent hex.)

For example:

ne,ne,ne is 3 steps away.
ne,ne,sw,sw is 0 steps away (back where you started).
ne,ne,s,s is 2 steps away (se,se).
se,sw,se,sw,sw is 3 steps away (s,s,sw).


--- Part Two ---

How many steps away is the farthest he ever got from his starting position?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function hexGridTraversal (part, inputStr, DEBUG = false) {
  
  // UTILITY FUNCTION - GET HEX DISTANCE FROM ORIGIN
  function getDistanceFromOrigin(y, x) {
    const diagonalMoves = Math.abs(x);                                          // first, see how many diagonal moves are required
                                                                                // (as these are the only way to make up for delta x)

    const newDeltaY = Math.max( Math.abs(y) - Math.abs(x),                      // CASE 1: diagonal moves closed the x gap; y gap remains
                                0 );                                            // CASE 2: diagonal moves closed the y gap; then you went
                                                                                // up/down repeatedly while closing the x gap

    const verticalMoves = newDeltaY / 2;                                        // then, if there is still a y gap, make vertical moves
    
    return diagonalMoves + verticalMoves;
  }

  const MOVES = inputStr.split(',');
  
  let [ y, x ] = [ 0, 0 ];
  let [ farthestY, farthestX ] = [ 0, 0 ];
  let farthestDistance = 0;
  let currentDistance = 0;

  for (const move of MOVES) {
    if (move === 'n') {
      y += 2;
    }
    else if (move === 's') {
      y -= 2;
    }
    else if (move === 'ne') {
      ++y;
      ++x;
    }
    else if (move === 'se') {
      --y;
      ++x;
    }
    else if (move === 'nw') {
      ++y;
      --x;
    }
    else if (move === 'sw') {
      --y;
      --x;
    }

    currentDistance = getDistanceFromOrigin(y, x);
    if (currentDistance > farthestDistance) {
      farthestDistance = currentDistance;
      [ farthestY, farthestX ] = [ y, x ];
      if (DISPLAY_EXTRA_INFO && DEBUG) {
        console.log(`NEW FARTHEST POSITION (y, x): (${y},${x}) | DISTANCE: ${currentDistance}`);
      }
    }
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log(`FINAL POSITION (y, x): (${y},${x}) | DISTANCE: ${currentDistance}`);
    console.log(`FARTHEST POSITION (y, x): (${farthestY},${farthestX}) | DISTANCE: ${farthestDistance}`);
  }

  return part === 1 ? currentDistance
                    : farthestDistance;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = hexGridTraversal;
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
`ne,ne,ne`
);

const sampleInput2 = parseSampleInput(
`ne,ne,sw,sw`
);

const sampleInput3 = parseSampleInput(
`ne,ne,s,s`
);

const sampleInput4 = parseSampleInput(
`se,sw,se,sw,sw`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 682;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1406;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);