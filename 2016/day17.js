/*

--- Day 17: Two Steps Forward ---

You're trying to access a secure vault protected by a 4x4 grid of small rooms connected by doors. You start in the top-left room (marked S), and you can access the vault (marked V) once you reach the bottom-right room:

#########
#S| | | #
#-#-#-#-#
# | | | #
#-#-#-#-#
# | | | #
#-#-#-#-#
# | | |  
####### V

Fixed walls are marked with #, and doors are marked with - or |.

The doors in your current room are either open or closed (and locked) based on the hexadecimal MD5 hash of a passcode (your puzzle input) followed by a sequence of uppercase characters representing the path you have taken so far (U for up, D for down, L for left, and R for right).

Only the first four characters of the hash are used; they represent, respectively, the doors up, down, left, and right from your current position. Any b, c, d, e, or f means that the corresponding door is open; any other character (any number or a) means that the corresponding door is closed and locked.

To access the vault, all you need to do is reach the bottom-right room; reaching this room opens the vault and all doors in the maze.

For example, suppose the passcode is hijkl. Initially, you have taken no steps, and so your path is empty: you simply find the MD5 hash of hijkl alone. The first four characters of this hash are ced9, which indicate that up is open (c), down is open (e), left is open (d), and right is closed and locked (9). Because you start in the top-left corner, there are no "up" or "left" doors to be open, so your only choice is down.

Next, having gone only one step (down, or D), you find the hash of hijklD. This produces f2bc, which indicates that you can go back up, left (but that's a wall), or right. Going right means hashing hijklDR to get 5745 - all doors closed and locked. However, going up instead is worthwhile: even though it returns you to the room you started in, your path would then be DU, opening a different set of doors.

After going DU (and then hashing hijklDU to get 528e), only the right door is open; after going DUR, all doors lock. (Fortunately, your actual passcode is not hijkl).

Passcodes actually used by Easter Bunny Vault Security do allow access to the vault if you know the right path. For example:

If your passcode were ihgpwlah, the shortest path would be DDRRRD.
With kglvqrro, the shortest path would be DDUDRLRRUDRD.
With ulqzkmiv, the shortest would be DRURDRUDDLLDLUURRDULRLDUUDDDRR.

Given your vault's passcode, what is the shortest path (the actual path, not just the length) to reach the vault?


--- Part Two ---

You're curious how robust this security solution really is, and so you decide to find longer and longer paths which still provide access to the vault. You remember that paths always end the first time they reach the bottom-right room (that is, they can never pass through it, only end in it).

For example:

If your passcode were ihgpwlah, the longest path would take 370 steps.
With kglvqrro, the longest path would be 492 steps long.
With ulqzkmiv, the longest path would be 830 steps long.
What is the length of the longest path that reaches the vault?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function MD5_BFS_MAZE (part, inputStr, DEBUG = false) {
  
  // REFERENCE
  // https://en.wikipedia.org/wiki/MD5
  // https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript
  // https://www.geeksforgeeks.org/node-js-crypto-createhash-method/

  // CONSTANTS
  const CRYPTO = require('crypto');
  const PASSCODE = inputStr;
  const DELTAS = [
    [ -1, 0 ],
    [ +1, 0 ],
    [ 0, -1 ],
    [ 0, +1 ],
  ];
  const DIRS = [ 'U', 'D', 'L', 'R' ];

  // INIT
  let longestPathLength = 0;                                                // PART 2: keep track of length of longest path

  // BFS
  const Q = new Queue([ 0, 0, '' ]);
  while (!Q.isEmpty()) {
    const [ row, col, path ] = Q.dequeue().val;

    if (row === 3 && col === 3) {
      if (part === 1) return path;                                          // PART 1: IMMEDIATELY RETURN SHORTEST PATH
      longestPathLength = Math.max(longestPathLength, path.length);         // PART 2: NOTE ALL PATHS; KEEP LENGTH OF LONGEST PATH
      continue;                                                             // IMPORTANT: don't forget to terminate upon reaching end
    }

    const hash = CRYPTO.createHash('md5')                                   // get hash based on 'md5' encryption and key; return as hex
                        .update(PASSCODE + path)                            // construct key from passcode concatenated with path
                        .digest('hex')
                        .slice(0, 4);                                       // we only need first four digits

    for (let i = 0; i < 4; ++i) {
      if ('bcdef'.includes(hash[i])) {
        const [ dy, dx ] = DELTAS[i];
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        if (0 <= newRow && newRow < 4 && 0 <= newCol && newCol < 4) {
          Q.enqueue([ newRow, newCol, path + DIRS[i] ]);
        }
      }
    }
  }

  if (part === 1) {                                                         // PART 1: THROW ERROR IF EXHAUSTING QUEUE WITH NO SOLUTION
    
    throw 'ERROR: NO SOLUTION FOUND';

  } else {                                                                  // PART 2: RETURN LENGTH OF LONGEST PATH AFTER EXHAUSTING QUEUE

    return longestPathLength;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = MD5_BFS_MAZE;
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
`ihgpwlah`
);

const sampleInput2 = parseSampleInput(
`kglvqrro`
);

const sampleInput3 = parseSampleInput(
`ulqzkmiv`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'DDRRRD';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 'DDUDRLRRUDRD';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 'DRURDRUDDLLDLUURRDULRLDUUDDDRR';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 'RDRDUDLRDR';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 370;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 492;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 830;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 386;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);