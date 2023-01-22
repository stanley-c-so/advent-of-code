/*

--- Day 19: A Series of Tubes ---

Somehow, a network packet got lost and ended up here. It's trying to follow a routing diagram (your puzzle input), but it's confused about where to go.

Its starting point is just off the top of the diagram. Lines (drawn with |, -, and +) show the path it needs to take, starting by going down onto the only line connected to the top of the diagram. It needs to follow this path until it reaches the end (located somewhere within the diagram) and stop there.

Sometimes, the lines cross over each other; in these cases, it needs to continue going the same direction, and only turn left or right when there's no other option. In addition, someone has left letters on the line; these also don't change its direction, but it can use them to keep track of where it's been. For example:

     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ 

Given this diagram, the packet needs to take the following path:

Starting at the only line touching the top of the diagram, it must go down, pass through A, and continue onward to the first +.
Travel right, up, and right, passing through B in the process.
Continue down (collecting C), right, and up (collecting D).
Finally, go all the way left through E and stopping at F.

Following the path to the end, the letters it sees on its path are ABCDEF.

The little packet looks up at you, hoping you can help it find the way. What letters will it see (in the order it would see them) if it follows the path? (The routing diagram is very wide; make sure you view it without line wrapping.)


--- Part Two ---

The packet is curious how many steps it needs to go.

For example, using the same routing diagram from the example above...

     |          
     |  +--+    
     A  |  C    
 F---|--|-E---+ 
     |  |  |  D 
     +B-+  +--+ 

...the packet would go:

6 steps down (including the first line at the top of the diagram).
3 steps right.
4 steps up.
3 steps right.
4 steps down.
3 steps right.
2 steps up.
13 steps left (including the F it stops on).

This would result in a total of 38 steps.

How many steps does the packet need to go?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function traverseLinesInDiagram (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const DELTAS = {
    'U': [ -1, 0 ],
    'D': [ +1, 0 ],
    'L': [ 0, -1 ],
    'R': [ 0, +1 ],
  };
  const OPPOSITE_DIR = {
    'U': 'D',
    'D': 'U',
    'L': 'R',
    'R': 'L',
  };
  const H = inputArr.length;
  const W = inputArr[0].length;

  // DATA STRUCTURE
  const GRID = [];
  for (const line of inputArr) {
    GRID.push(line.split(''));
  }

  // GRID CONSTANTS
  const PIPE = '|';
  const DASH = '-';
  const PLUS = '+';
  const SPACE = ' ';
  const NON_LETTERS = new Set([ PIPE, DASH, PLUS, SPACE ]);

  // INIT
  let dir = 'D';
  let y = 0;
  let x = GRID[0].indexOf(PIPE);
  let letters = '';
  let numSteps = 0;

  // ANALYZE
  while (GRID[y][x] !== SPACE) {                              // while you are not on a space...

    // update output variables where appropriate
    const c = GRID[y][x];
    if (!NON_LETTERS.has(c)) {                                // PART 1: pick up letters along the way
      letters += c;
      if (DISPLAY_EXTRA_INFO) {
        console.log(`picked up ${c} at (y,x): (${y},${x})`);
      }
    }
    ++numSteps;                                               // PART 2: count the number of steps

    // change directions
    if (c === PLUS) {                                         // if plus, need to change directions!
                                                              // we validly assume there is only 1 correct direction to change to,
                                                              // and that the other 2 directions would lead to a space.
      for (const newDir in DELTAS) {
        if (newDir !== OPPOSITE_DIR[dir]) {                   // ...disregard opposite of current direction
          const [ dy, dx ] = DELTAS[newDir];
          if (0 <= y + dy && y + dy < H
              && 0 <= x + dx && x + dx < W
              && GRID[y + dy][x + dx] !== SPACE) {            // if going in that direction would lead to a non-space...
            dir = newDir;                                     // ...then this is the new direction
            break;
          }
        }
      }
    }
    
    // update new location
    const [ dy, dx ] = DELTAS[dir];
    y += dy;
    x += dx;
  }

  return part === 1 ? letters                                 // PART 1: RETURN STRING OF LETTERS COLLECTED
                    : numSteps;                               // PART 2: RETURN NUMBER OF STEPS TAKEN
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = traverseLinesInDiagram;
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
`     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ `
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'ABCDEF';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 'UICRNSDOK';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 38;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 16064;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);