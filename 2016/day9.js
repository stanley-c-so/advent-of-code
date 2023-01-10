/*

--- Day 9: Explosives in Cyberspace ---

Wandering around a secure area, you come across a datalink port to a new part of the network. After briefly scanning it for interesting files, you find one file in particular that catches your attention. It's compressed with an experimental format, but fortunately, the documentation for the format is nearby.

The format compresses a sequence of characters. Whitespace is ignored. To indicate that some sequence should be repeated, a marker is added to the file, like (10x2). To decompress this marker, take the subsequent 10 characters and repeat them 2 times. Then, continue reading the file after the repeated data. The marker itself is not included in the decompressed output.

If parentheses or other characters appear within the data referenced by a marker, that's okay - treat it like normal data, not a marker, and then resume looking for markers after the decompressed section.

For example:

ADVENT contains no markers and decompresses to itself with no changes, resulting in a decompressed length of 6.
A(1x5)BC repeats only the B a total of 5 times, becoming ABBBBBC for a decompressed length of 7.
(3x3)XYZ becomes XYZXYZXYZ for a decompressed length of 9.
A(2x2)BCD(2x2)EFG doubles the BC and EF, becoming ABCBCDEFEFG for a decompressed length of 11.
(6x1)(1x3)A simply becomes (1x3)A - the (1x3) looks like a marker, but because it's within a data section of another marker, it is not treated any differently from the A that comes after it. It has a decompressed length of 6.
X(8x2)(3x3)ABCY becomes X(3x3)ABC(3x3)ABCY (for a decompressed length of 18), because the decompressed data from the (8x2) marker (the (3x3)ABC) is skipped and not processed further.

What is the decompressed length of the file (your puzzle input)? Don't count whitespace.


--- Part Two ---

Apparently, the file actually uses version two of the format.

In version two, the only difference is that markers within decompressed data are decompressed. This, the documentation explains, provides much more substantial compression capabilities, allowing many-gigabyte files to be stored in only a few kilobytes.

For example:

(3x3)XYZ still becomes XYZXYZXYZ, as the decompressed section contains no markers.
X(8x2)(3x3)ABCY becomes XABCABCABCABCABCABCY, because the decompressed data from the (8x2) marker is then further decompressed, thus triggering the (3x3) marker twice for a total of six ABC sequences.
(27x12)(20x12)(13x14)(7x10)(1x12)A decompresses into a string of A repeated 241920 times.
(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN becomes 445 characters long.

Unfortunately, the computer you brought probably doesn't have enough memory to actually decompress the file; you'll have to come up with another way to get its decompressed length.

What is the decompressed length of the file using this improved format?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function parseString (part, inputStr, DEBUG = false) {

  // RECURSIVE HELPER FUNCTION: TAKES IN STRING, OUTPUTS ITS DECOMPRESSED LENGTH (REQUIRED IN PART 2)
  function helper(inputStr) {

    // INIT
    let decompressedLen = 0;
    let marker = '';
    let readingMarker = false;

    // ANALYZE
    for (let i = 0; i < inputStr.length; ++i) {
      const c = inputStr[i];

      if (readingMarker) {

        if (c === ')') {
          const [ markerLen, repeatTimes ] = marker.split('x').map(n => +n);

          decompressedLen += repeatTimes * (part === 1  ? markerLen                                           // PART 1: TREAT MARKERS REFERENCED BY OTHER MARKERS AS NORMAL TEXT
                                                        : helper(inputStr.slice(i + 1, i + 1 + markerLen)));  // PART 2: PARSE INNER MARKERS REFERENCED BY OTHER MARKERS

          i += markerLen;                                                                                     // move i up to last character of marker's reference slice
          marker = '';                                                                                        // reset marker
          readingMarker = false;
        } else {
          marker += c;
        }

      } else {

        if (c === '(') {
          readingMarker = true;
        } else {
          ++decompressedLen;
        }

      }

    }

    return decompressedLen;
  }

  return helper(inputStr);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = parseString;
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
`ADVENT`
);

const sampleInput2 = parseSampleInput(
`A(1x5)BC`
);

const sampleInput3 = parseSampleInput(
`(3x3)XYZ`
);

const sampleInput4 = parseSampleInput(
`A(2x2)BCD(2x2)EFG`
);

const sampleInput5 = parseSampleInput(
`(6x1)(1x3)A`
);

const sampleInput6 = parseSampleInput(
`X(8x2)(3x3)ABCY`
);

const sampleInput7 = parseSampleInput(
`(27x12)(20x12)(13x14)(7x10)(1x12)A`
);

const sampleInput8 = parseSampleInput(
`(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN`
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
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 7;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 9;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 11;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 18;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 152851;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 'XYZXYZXYZ'.length;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 'XABCABCABCABCABCABCY'.length;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput7,
  DEBUG: true,
};
expected = 241920;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput8,
  DEBUG: true,
};
expected = 445;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 11797310782;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);