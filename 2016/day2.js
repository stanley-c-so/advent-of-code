/*

--- Day 2: Bathroom Security ---

You arrive at Easter Bunny Headquarters under cover of darkness. However, you left in such a rush that you forgot to use the bathroom! Fancy office buildings like this one usually have keypad locks on their bathrooms, so you search the front desk for the code.

"In order to improve security," the document you find says, "bathroom codes will no longer be written down. Instead, please memorize and follow the procedure below to access the bathrooms."

The document goes on to explain that each button to be pressed can be found by starting on the previous button and moving to adjacent buttons on the keypad: U moves up, D moves down, L moves left, and R moves right. Each line of instructions corresponds to one button, starting at the previous button (or, for the first line, the "5" button); press whatever button you're on at the end of each line. If a move doesn't lead to a button, ignore it.

You can't hold it much longer, so you decide to figure out the code as you walk to the bathroom. You picture a keypad like this:

1 2 3
4 5 6
7 8 9

Suppose your instructions are:

ULL
RRDDD
LURDL
UUUUD

You start at "5" and move up (to "2"), left (to "1"), and left (you can't, and stay on "1"), so the first button is 1.
Starting from the previous button ("1"), you move right twice (to "3") and then down three times (stopping at "9" after two moves and ignoring the third), ending up with 9.
Continuing from "9", you move left, up, right, down, and left, ending with 8.
Finally, you move up four times (stopping at "2"), then down once, ending with 5.

So, in this example, the bathroom code is 1985.

Your puzzle input is the instructions from the document you found at the front desk. What is the bathroom code?


--- Part Two ---

You finally arrive at the bathroom (it's a several minute walk from the lobby so visitors can behold the many fancy conference rooms and water coolers on this floor) and go to punch in the code. Much to your bladder's dismay, the keypad is not at all like you imagined it. Instead, you are confronted with the result of hundreds of man-hours of bathroom-keypad-design meetings:

    1
  2 3 4
5 6 7 8 9
  A B C
    D

You still start at "5" and stop when you're at an edge, but given the same instructions as above, the outcome is very different:

You start at "5" and don't move at all (up and left are both edges), ending at 5.
Continuing from "5", you move right twice and down three times (through "6", "7", "B", "D", "D"), ending at D.
Then, from "D", you move five more times (through "D", "B", "C", "C", "B"), ending at B.
Finally, after five more moves, you end at 3.

So, given the actual keypad layout, the code would be 5DB3.

Using the same instructions in your puzzle input, what is the correct bathroom code?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function navigateNumpad (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const GRID1 = [                                                       // NOTE: surround keys with null to handle out of bounds
    [null, null, null, null, null],
    [null, 1,    2,    3,    null],
    [null, 4,    5,    6,    null],
    [null, 7,    8,    9,    null],
    [null, null, null, null, null],
  ];

  const GRID2 = [
    [null, null, null, null, null, null, null],
    [null, null, null, 1,    null, null, null],
    [null, null, 2,    3,    4,    null, null],
    [null, 5,    6,    7,    8,    9,    null],
    [null, null, 'A',  'B',  'C',  null, null],
    [null, null, null, 'D',  null, null, null],
    [null, null, null, null, null, null, null],
  ];

  const DELTAS = {
    'U': [-1, 0],
    'D': [+1, 0],
    'R': [0, +1],
    'L': [0, -1],
  };

  // INIT
  let code = '';
  const GRID = part === 1 ? GRID1                                       // PART 1: USE STANDARD NUMPAD
                          : GRID2;                                      // PART 2: USE WEIRD DIAMOND SHAPED NUMPAD

  let [ row, col ] = part === 1 ? [ 2, 2 ]                              // PART 1: START ON THE 5 IN THE MIDDLE
                                : [ 3, 1 ];                             // PART 2: START ON THE 5 AT THE LEFT

  // ANALYZE
  for (const line of inputArr) {
    for (const c of line) {
      if (!(c in DELTAS)) throw `ERROR: UNRECOGNIZED CHARACTER ${c}`;
      const [ dy, dx ] = DELTAS[c];
      const [ newRow, newCol ] = [ row + dy, col + dx ];
      if (GRID[newRow][newCol] !== null) {
        row = newRow;
        col = newCol;
      }
    }
    code += GRID[row][col];
  }

  return code;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = navigateNumpad;
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
`ULL
RRDDD
LURDL
UUUUD`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '1985';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = '44558';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '5DB3';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = '6BBAD';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);