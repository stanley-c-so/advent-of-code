/*

--- Day 16: Dragon Checksum ---

You're done scanning this part of the network, but you've left traces of your presence. You need to overwrite some disks with random-looking data to cover your tracks and update the local security system with a new checksum for those disks.

For the data to not be suspicious, it needs to have certain properties; purely random data will be detected as tampering. To generate appropriate random data, you'll need to use a modified dragon curve.

Start with an appropriate initial state (your puzzle input). Then, so long as you don't have enough data yet to fill the disk, repeat the following steps:

Call the data you have at this point "a".
Make a copy of "a"; call this copy "b".
Reverse the order of the characters in "b".
In "b", replace all instances of 0 with 1 and all 1s with 0.
The resulting data is "a", then a single 0, then "b".

For example, after a single step of this process,

1 becomes 100.
0 becomes 001.
11111 becomes 11111000000.
111100001010 becomes 1111000010100101011110000.

Repeat these steps until you have enough data to fill the desired disk.

Once the data has been generated, you also need to create a checksum of that data. Calculate the checksum only for the data that fits on the disk, even if you generated more data than that in the previous step.

The checksum for some given data is created by considering each non-overlapping pair of characters in the input data. If the two characters match (00 or 11), the next checksum character is a 1. If the characters do not match (01 or 10), the next checksum character is a 0. This should produce a new string which is exactly half as long as the original. If the length of the checksum is even, repeat the process until you end up with a checksum with an odd length.

For example, suppose we want to fill a disk of length 12, and when we finally generate a string of at least length 12, the first 12 characters are 110010110100. To generate its checksum:

Consider each pair: 11, 00, 10, 11, 01, 00.
These are same, same, different, same, different, same, producing 110101.
The resulting string has length 6, which is even, so we repeat the process.
The pairs are 11 (same), 01 (different), 01 (different).
This produces the checksum 100, which has an odd length, so we stop.

Therefore, the checksum for 110010110100 is 100.

Combining all of these steps together, suppose you want to fill a disk of length 20 using an initial state of 10000:

Because 10000 is too short, we first use the modified dragon curve to make it longer.
After one round, it becomes 10000011110 (11 characters), still too short.
After two rounds, it becomes 10000011110010000111110 (23 characters), which is enough.
Since we only need 20, but we have 23, we get rid of all but the first 20 characters: 10000011110010000111.
Next, we start calculating the checksum; after one round, we have 0111110101, which 10 characters long (even), so we continue.
After two rounds, we have 01100, which is 5 characters long (odd), so we are done.

In this example, the correct checksum would therefore be 01100.

The first disk you have to fill has length 272. Using the initial state in your puzzle input, what is the correct checksum?


--- Part Two ---

The second disk you have to fill has length 35651584. Again using the initial state in your puzzle input, what is the correct checksum for this disk?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function dragonChecksum (part, inputStr, extraParam, DEBUG = false) {

  // UTILITY FUNCTION: TAKES IN AN ARRAY, FLIPS ITS DIGITS, OUTPUTS AN ARRAY
  function flipDigits(arr) {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] === '1') arr[i] = '0';
      else if (arr[i] === '0') arr[i] = '1';
      else throw `ERROR: UNRECOGNIZED DIGIT: ${arr[i]}`;
    }
    return arr;
  }

  function combineAB() {
    a = combined;
    b = flipDigits(a.split('').reverse()).join('');
    combined = a + '0' + b;
  }

  // CONSTANTS
  const diskLength = extraParam;

  // INIT
  let a, b;
  let combined = inputStr;                                                                  // on combineAB(), a takes value of combined.
                                                                                            // initially, a should be inputStr, so init combined as inputStr
  combineAB();

  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

  // STEP 1: COMBINE `a` AND `b` UNTIL DATA MEETS OR EXCEEDS DISK LENGTH
  while (combined.length < diskLength) {
    combineAB();
  }

  // STEP 2: GENERATE CHECKSUM
  let checksum = combined.slice(0, diskLength);
  while (checksum.length % 2 === 0) {
    let newChecksum = '';
    for (let i = 0; i < checksum.length; i += 2) {
      newChecksum += checksum[i] === checksum[i + 1] ? '1' : '0';
    }
    checksum = newChecksum;
  }

  if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return checksum;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = dragonChecksum;
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
`10000`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 20,
  DEBUG: true,
};
expected = '01100';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 272,
};
expected = '10010101010011101';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 35651584,
};
expected = '01100111101101111';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);