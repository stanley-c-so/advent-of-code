/*

--- Day 13: A Maze of Twisty Little Cubicles ---

You arrive at the first floor of this new building to discover a much less welcoming environment than the shiny atrium of the last one. Instead, you are in a maze of twisty little cubicles, all alike.

Every location in this area is addressed by a pair of non-negative integers (x,y). Each such coordinate is either a wall or an open space. You can't move diagonally. The cube maze starts at 0,0 and seems to extend infinitely toward positive x and y; negative values are invalid, as they represent a location outside the building. You are in a small waiting area at 1,1.

While it seems chaotic, a nearby morale-boosting poster explains, the layout is actually quite logical. You can determine whether a given x,y coordinate will be a wall or an open space using a simple system:

Find x*x + 3*x + 2*x*y + y + y*y.
Add the office designer's favorite number (your puzzle input).
Find the binary representation of that sum; count the number of bits that are 1.
If the number of bits that are 1 is even, it's an open space.
If the number of bits that are 1 is odd, it's a wall.
For example, if the office designer's favorite number were 10, drawing walls as # and open spaces as ., the corner of the building containing 0,0 would look like this:

  0123456789
0 .#.####.##
1 ..#..#...#
2 #....##...
3 ###.#.###.
4 .##..#..#.
5 ..##....#.
6 #...##.###

Now, suppose you wanted to reach 7,4. The shortest route you could take is marked as O:

  0123456789
0 .#.####.##
1 .O#..#...#
2 #OOO.##...
3 ###O#.###.
4 .##OO#OO#.
5 ..##OOO.#.
6 #...##.###

Thus, reaching 7,4 would take a minimum of 11 steps (starting from your current location, 1,1).

What is the fewest number of steps required for you to reach 31,39?


--- Part Two ---

How many locations (distinct x,y coordinates, including your starting location) can you reach in at most 50 steps?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function gridBFS (part, inputStr, extraParam, DEBUG = false) {

  // CONSTANTS
  const FAV_NUM = +inputStr;
  const DELTAS = [
    [ +1, 0 ],
    [ -1, 0 ],
    [ 0, +1 ],
    [ 0, -1 ],
  ];

  // HELPER FUNCTION WITH MEMOIZATION TO GET THE TYPE OF A COORD
  // NOTE: IT TURNS OUT MEMOIZATION DOESN'T REALLY MAKE THIS GO ANY FASTER - THE FUNCTION IS QUITE FAST
  const MEMO = {};
  function getType(y, x) {
    const serial = `${y},${x}`;
    if (!(serial in MEMO)) {
      const sum = (x*x + 3*x + 2*x*y + y + y*y) + FAV_NUM;
      const binary = sum.toString(2);
      let numOnes = 0;
      for (const c of binary) {
        if (+c) ++numOnes;
      }
      MEMO[serial] = numOnes % 2  ? '#'
                                  : '.';
    }
    return MEMO[serial];
  }

  // ANALYZE BFS
  const Q = new Queue([ 1, 1, 0 ]);                                   // NOTE: start at (1, 1)
  const visited = new Set();
  while (!Q.isEmpty()) {
    const [ y, x, moves ] = Q.dequeue().val;
    const serial = `${y},${x}`;

    if (part === 2 && moves === 51) return visited.size;              // PART 2: GET SIZE OF VISITED SET AFTER 50 MOVES

    if (visited.has(serial)) continue;
    visited.add(serial);

    if (y === extraParam[0] && x === extraParam[1]) return moves;     // PART 1: GET MIN MOVES TO REACH TARGET COORD

    for (const [ dy, dx ] of DELTAS) {
      if (y + dy >= 0 && x + dx >= 0
          && getType(y + dy, x + dx) === '.'
      ) {
        Q.enqueue([ y + dy, x + dx, moves + 1 ]);
      }
    }
  }
  throw 'ERROR: NO SOLUTION FOUND';
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = gridBFS;
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
`10`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: [4, 7],       // NOTE: represent as [y, x]
  DEBUG: true,
};
expected = 11;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: [39, 31],     // NOTE: represent as [y, x]
};
expected = 96;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: [],
};
expected = 141;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);