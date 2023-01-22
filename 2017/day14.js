/*

--- Day 14: Disk Defragmentation ---

Suddenly, a scheduled job activates the system's disk defragmenter. Were the situation different, you might sit and watch it for a while, but today, you just don't have that kind of time. It's soaking up valuable system resources that are needed elsewhere, and so the only option is to help it finish its task as soon as possible.

The disk in question consists of a 128x128 grid; each square of the grid is either free or used. On this disk, the state of the grid is tracked by the bits in a sequence of knot hashes.

A total of 128 knot hashes are calculated, each corresponding to a single row in the grid; each hash contains 128 bits which correspond to individual grid squares. Each bit of a hash indicates whether that square is free (0) or used (1).

The hash inputs are a key string (your puzzle input), a dash, and a number from 0 to 127 corresponding to the row. For example, if your key string were flqrgnkx, then the first row would be given by the bits of the knot hash of flqrgnkx-0, the second row from the bits of the knot hash of flqrgnkx-1, and so on until the last row, flqrgnkx-127.

The output of a knot hash is traditionally represented by 32 hexadecimal digits; each of these digits correspond to 4 bits, for a total of 4 * 32 = 128 bits. To convert to bits, turn each hexadecimal digit to its equivalent binary value, high-bit first: 0 becomes 0000, 1 becomes 0001, e becomes 1110, f becomes 1111, and so on; a hash that begins with a0c2017... in hexadecimal would begin with 10100000110000100000000101110000... in binary.

Continuing this process, the first 8 rows and columns for key flqrgnkx appear as follows, using # to denote used squares, and . to denote free ones:

##.#.#..-->
.#.#.#.#   
....#.#.   
#.#.##.#   
.##.#...   
##..#..#   
.#...#..   
##.#.##.-->
|      |   
V      V   

In this example, 8108 squares are used across the entire 128x128 grid.

Given your actual key string, how many squares are used?


--- Part Two ---

Now, all the defragmenter needs to know is the number of regions. A region is a group of used squares that are all adjacent, not including diagonals. Every used square is in exactly one region: lone used squares form their own isolated regions, while several adjacent squares all count as a single region.

In the example above, the following nine regions are visible, each marked with a distinct digit:

11.2.3..-->
.1.2.3.4   
....5.6.   
7.8.55.9   
.88.5...   
88..5..8   
.8...8..   
88.8.88.-->
|      |   
V      V   

Of particular interest is the region marked 8; while it does not appear contiguous in this small view, all of the squares marked 8 are connected when considering the whole 128x128 grid. In total, in this example, 1242 regions are present.

How many regions are present given your key string?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function knotHashToGridAndCountIslands (part, inputStr, DEBUG = false) {
  
  // HELPER FUNCTION - ADAPTED FROM DAY 10
  function getKnotHash(inputStr) {

    // CONSTANTS
    const SKIP_LENGTHS = inputStr.split('')
                                  .map(c => c.charCodeAt(0))
                                  .concat([ 17, 31, 73, 47, 23 ]);                            // these numbers came from day 10 and are required

    const LIST_SIZE = 256;
    const NUM_ROUNDS = 64;
    
    // DATA STRUCTURE
    const LIST = [ ...Array(LIST_SIZE).keys() ];
    
    // UTILITY FUNCTION - GIVEN AN INDEX THAT MAY BE OUT OF BOUNDS, USE MOD TO GET TRUE INDEX
    const getIdx = idx => (LIST_SIZE + idx) % LIST_SIZE;

    // INIT
    let currIdx = 0;
    let skipSize = 0;

    // SIMULATE HASHING PROCEDURE
    for (let i = 0; i < NUM_ROUNDS; ++i) {
      for (const skipLength of SKIP_LENGTHS) {

        let endIdx = getIdx(currIdx + skipLength - 1);                                        // first, find the end of region to be flipped
        for (let offset = 0; offset < (skipLength - 1) / 2; ++offset) {                       // iterate through half the region...
          const leftIdx = getIdx(currIdx + offset);                                           // ...starting at each position in the first half...
          const rightIdx = getIdx(endIdx - offset);                                           // ...finding the corresponding opposite position...
          [ LIST[leftIdx], LIST[rightIdx] ] = [ LIST[rightIdx], LIST[leftIdx] ];              // ...and swap numbers at those two positions
        }

        currIdx = getIdx(currIdx + skipLength + skipSize);
        ++skipSize;
      }
    }

    // GET DENSE HASH
    const BLOCK_SIZE = 16;
    const denseHash = [];
    for (let i = 0; i < LIST.length; i += BLOCK_SIZE) {
      const block = LIST.slice(i, i + BLOCK_SIZE);
      denseHash.push(block.reduce((output, num) => output ^ num));
    }

    // RETURN KNOT HASH (HEXADECIMAL)
    return denseHash.map(block => block.toString(BLOCK_SIZE).padStart(2, '0')).join('');
  }

  // HELPER FUNCTION - GIVEN A HEXADECIMAL STRING, CONVERT IT TO BINARY FORM
  function getBinaryFromHex(hex) {
    let output = '';
    for (const c of hex) {
      output += parseInt(c, 16).toString(2).padStart(4, '0');
    }
    return output;
  }

  // console.log(getBinaryFromHex('a0c2017'));                                                   // description says this should display
  //                                                                                             // 10100000110000100000000101110000
  //                                                                                             // but this appears to be an error:
  //                                                                                             // the last four 0s don't make sense

  // HELPER FUNCTION - GIVEN AN INPUT STRING, GET ITS KNOT HASH, THEN CONVERT THAT HEX INTO BINARY FORM
  function getBinaryFromInputStr(inputStr) {
    const hex = getKnotHash(inputStr);
    return getBinaryFromHex(hex);
  }

  // INPUT DATA
  const KEY_STRING = inputStr;

  // GRID CONSTANTS
  const GRID = [];
  const S = 128;
  const [ USED, UNUSED ] = [ '#', '.' ];
  for (let row = 0; row < S; ++row) {
    const binary = getBinaryFromInputStr(`${KEY_STRING}-${row}`);
    GRID.push(binary.split('').map(c => +c ? USED : UNUSED));
  }

  // if (DISPLAY_EXTRA_INFO) {
  //   for (const row of GRID) {
  //     console.log(row.join(''));
  //   }
  // }

  // ANALYZE
  if (part === 1) {                                                                           // PART 1: COUNT TOTAL USED SPACES

    return GRID.reduce((totalUsed, row) =>
      totalUsed + row.reduce((total, c) => total + (c === USED), 0), 0);

  } else {                                                                                    // PART 2: COUNT NUMBER OF CONTIGUOUS GROUPS

    const DELTAS = [
      [ +1, 0 ],
      [ -1, 0 ],
      [ 0, +1 ],
      [ 0, -1 ],
    ]
    const TEMP = 'x';                                                                         // if we wanted to, we could convert TEMP back to USED

    let numRegions = 0;
    for (let row = 0; row < S; ++row) {
      for (let col = 0; col < S; ++col) {
        if (GRID[row][col] === USED) {
          ++numRegions;
          const stack = [ [ row, col ] ];
          while (stack.length) {
            const [ row, col ] = stack.pop();
            if (row < 0 || row === S || col < 0 || col === S
                || GRID[row][col] !== USED
            ) {
              continue;
            }
            GRID[row][col] = TEMP;
            for (const [ dy, dx ] of DELTAS) {
              const [ newRow, newCol ] = [ row + dy, col + dx ];
              stack.push([ newRow, newCol ]);
            }
          }
        }
      }
    }
    return numRegions;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = knotHashToGridAndCountIslands;
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
`flqrgnkx`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 8108;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 8074;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1242;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1212;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);