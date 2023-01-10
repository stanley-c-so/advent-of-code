/*

--- Day 8: Two-Factor Authentication ---

You come across a door implementing what you can only assume is an implementation of two-factor authentication after a long game of requirements telephone.

To get past the door, you first swipe a keycard (no problem; there was one on a nearby desk). Then, it displays a code on a little screen, and you type that code on a keypad. Then, presumably, the door unlocks.

Unfortunately, the screen has been smashed. After a few minutes, you've taken everything apart and figured out how it works. Now you just have to work out what the screen would have displayed.

The magnetic strip on the card you swiped encodes a series of instructions for the screen; these instructions are your puzzle input. The screen is 50 pixels wide and 6 pixels tall, all of which start off, and is capable of three somewhat peculiar operations:

rect AxB turns on all of the pixels in a rectangle at the top-left of the screen which is A wide and B tall.
rotate row y=A by B shifts all of the pixels in row A (0 is the top row) right by B pixels. Pixels that would fall off the right end appear at the left end of the row.
rotate column x=A by B shifts all of the pixels in column A (0 is the left column) down by B pixels. Pixels that would fall off the bottom appear at the top of the column.

For example, here is a simple sequence on a smaller screen:

rect 3x2 creates a small rectangle in the top-left corner:

###....
###....
.......

rotate column x=1 by 1 rotates the second column down by one pixel:

#.#....
###....
.#.....

rotate row y=0 by 4 rotates the top row right by four pixels:

....#.#
###....
.#.....

rotate column x=1 by 1 again rotates the second column down by one pixel, causing the bottom pixel to wrap back to the top:

.#..#.#
#.#....
.#.....

As you can see, this display technology is extremely powerful, and will soon dominate the tiny-code-displaying-screen market. That's what the advertisement on the back of the display tries to convince you, anyway.

There seems to be an intermediate check of the voltage used by the display: after you swipe your card, if the screen did work, how many pixels should be lit?


--- Part Two ---

You notice that the screen is only capable of displaying capital letters; in the font it uses, each letter is 5 pixels wide and 6 tall.

After you swipe your card, what code is the screen trying to display?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function manipulateGrid (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // INIT
  const H = 6;
  const W = 50;
  const GRID = Array.from({length: H}, () => Array(W).fill('.'));

  // ANALYZE
  for (const line of inputArr) {
    const words = line.split(' ');
    if (words[0] === 'rect') {
      const [w, h] = words[1].split('x').map(n => +n);
      for (let row = 0; row < h; ++row) {
        for (let col = 0; col < w; ++col) {
          GRID[row][col] = '#';
        }
      }
    }
    
    else if (words[0] === 'rotate' && words[1] === 'row') {
      const [_, row] = words[2].split('=').map(n => +n);
      const n = +words[4] % W;
      
      const oldRow = GRID[row].join('');
      const newRow = (oldRow + oldRow).slice(oldRow.length - n, 2 * oldRow.length - n);
      GRID[row] = newRow.split('');
    }
    
    else if (words[0] === 'rotate' && words[1] === 'column') {
      const [_, col] = words[2].split('=').map(n => +n);
      const n = +words[4] % H;

      const oldCol = GRID.map(row => row[col]).join('');
      const newCol = (oldCol + oldCol).slice(oldCol.length - n, 2 * oldCol.length - n);
      for (let i = 0; i < newCol.length; ++i) GRID[i][col] = newCol[i];
    }
    
    else throw `ERROR: INVALID INSTRUCTION ${line}`;
  }

  if (DISPLAY_EXTRA_INFO && part === 2) {
    console.log(
      GRID.map(row => row.map(c => c === '.' ? ' ' : c).join(' '))
          .join('\n')
    );
  }

  return part === 1 ? GRID.reduce((totalOn, row) => totalOn + row.reduce((on, light) => on + (light === '#'), 0), 0)
                    : GRID.map(row => row.join('')).join('\n');

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = manipulateGrid;
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
`rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 116;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected =
`....#.#...........................................
#.#...............................................
.#................................................
.#................................................
..................................................
..................................................`;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected =
`#..#.###...##....##.####.#....###...##..####.####.
#..#.#..#.#..#....#.#....#....#..#.#..#.#.......#.
#..#.#..#.#..#....#.###..#....###..#....###....#..
#..#.###..#..#....#.#....#....#..#.#....#.....#...
#..#.#....#..#.#..#.#....#....#..#.#..#.#....#....
.##..#.....##...##..#....####.###...##..####.####.`;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);