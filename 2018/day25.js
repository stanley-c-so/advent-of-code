/*

--- Day 25: Four-Dimensional Adventure ---

The reindeer's symptoms are getting worse, and neither you nor the white-bearded man have a solution. At least the reindeer has a warm place to rest: a small bed near where you're sitting.

As you reach down, the reindeer looks up at you, accidentally bumping a button on your wrist-mounted device with its nose in the process - a button labeled "help".

"Hello, and welcome to the Time Travel Support Hotline! If you are lost in time and space, press 1. If you are trapped in a time paradox, press 2. If you need help caring for a sick reindeer, press 3. If you--"

Beep.

A few seconds later, you hear a new voice. "Hello; please state the nature of your reindeer." You try to describe the situation.

"Just a moment, I think I can remotely run a diagnostic scan." A beam of light projects from the device and sweeps over the reindeer a few times.

"Okay, it looks like your reindeer is very low on magical energy; it should fully recover if we can fix that. Let me check your timeline for a source.... Got one. There's actually a powerful source of magical energy about 1000 years forward from you, and at roughly your position, too! It looks like... hot chocolate? Anyway, you should be able to travel there to pick some up; just don't forget a mug! Is there anything else I can help you with today?"

You explain that your device isn't capable of going forward in time. "I... see. That's tricky. Well, according to this information, your device should have the necessary hardware to open a small portal and send some hot chocolate back to you. You'll need a list of fixed points in spacetime; I'm transmitting it to you now."

"You just need to align your device to the constellations of fixed points so that it can lock on to the destination and open the portal. Let me look up how much hot chocolate that breed of reindeer needs."

"It says here that your particular reindeer is-- this can't be right, it says there's only one like that in the universe! But THAT means that you're--" You disconnect the call.

The list of fixed points in spacetime (your puzzle input) is a set of four-dimensional coordinates. To align your device, acquire the hot chocolate, and save the reindeer, you just need to find the number of constellations of points in the list.

Two points are in the same constellation if their manhattan distance apart is no more than 3 or if they can form a chain of points, each a manhattan distance no more than 3 from the last, between the two of them. (That is, if a point is close enough to a constellation, it "joins" that constellation.) For example:

 0,0,0,0
 3,0,0,0
 0,3,0,0
 0,0,3,0
 0,0,0,3
 0,0,0,6
 9,0,0,0
12,0,0,0

In the above list, the first six points form a single constellation: 0,0,0,0 is exactly distance 3 from the next four, and the point at 0,0,0,6 is connected to the others by being 3 away from 0,0,0,3, which is already in the constellation. The bottom two points, 9,0,0,0 and 12,0,0,0 are in a separate constellation because no point is close enough to connect them to the first constellation. So, in the above list, the number of constellations is 2. (If a point at 6,0,0,0 were present, it would connect 3,0,0,0 and 9,0,0,0, merging all of the points into a single giant constellation instead.)

In this example, the number of constellations is 4:

-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0

In this one, it's 3:

1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2

Finally, in this one, it's 8:

1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2

The portly man nervously strokes his white beard. It's time to get that hot chocolate.

How many constellations are formed by the fixed points in spacetime?


--- Part Two ---

A small glowing portal opens above the mug you prepared and just enough hot chocolate streams in to fill it. You suspect the reindeer has never encountered hot chocolate before, but seems to enjoy it anyway. You hope it works.

It's time to start worrying about that integer underflow in time itself you set up a few days ago. You check the status of the device: "Insufficient chronal energy for activation. Energy required: 50 stars."

The reindeer bumps the device with its nose.

"Energy required: 49 stars."

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // PARSE INPUT DATA
  const POINTS = [];
  for (const line of inputArr) {
    POINTS.push(line.split(',').map(n => +n));
  }

  // UTILITY FUNCTION: GET MANHATTAN DISTANCE BETWEEN TWO POINTS
  const getManhattanDistance = (x1, y1, z1, t1, x2, y2, z2, t2) => Math.abs(x1 - x2)
                                                                    + Math.abs(y1 - y2)
                                                                    + Math.abs(z1 - z2)
                                                                    + Math.abs(t1 - t2);

  // PRE-PROCESSING: FIND CONNECTIONS
  const CONNECTIONS = Array.from({length: POINTS.length}, () => new Set());
  for (let i = 0; i < POINTS.length - 1; ++i) {
    for (let j = i + 1; j < POINTS.length; ++j) {
      // const [ [x1, y1, z1, t1], [x2, y2, z2, t2] ] = [ POINTS[i], POINTS[j] ];
      // if (getManhattanDistance(x1, y1, z1, t1, x2, y2, t2, z2) <= 3) {
      if (getManhattanDistance( ...POINTS[i], ...POINTS[j] ) <= 3) {
        CONNECTIONS[i].add(j);
        CONNECTIONS[j].add(i);
      }
    }
  }

  // INIT
  const visited = new Set();
  let numConstellations = 0;

  // RECURSIVE HELPER FUNCTION - FULLY EXPLORE CONSTELLATION
  function DFS(i) {
    if (visited.has(i)) return;
    visited.add(i);
    for (const neighbor of CONNECTIONS[i]) DFS(neighbor);
  }

  // ANALYZE - KICKSTART DFS FOR EVERY NEW CONSTELLATION
  for (let i = 0; i < POINTS.length; ++i) {
    if (!visited.has(i)) {
      ++numConstellations;
      DFS(i);
    }
  }

  return numConstellations;
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
`0,0,0,0
3,0,0,0
0,3,0,0
0,0,3,0
0,0,0,3
0,0,0,6
9,0,0,0
12,0,0,0`
);

const sampleInput2 = parseSampleInput(
`0,0,0,0
3,0,0,0
0,3,0,0
0,0,3,0
0,0,0,3
0,0,0,6
9,0,0,0
12,0,0,0
6,0,0,0`
);

const sampleInput3 = parseSampleInput(
`-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0`
);

const sampleInput4 = parseSampleInput(
`1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2`
);

const sampleInput5 = parseSampleInput(
`1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 4;
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
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 8;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 375;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);