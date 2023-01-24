/*

--- Day 1: Chronal Calibration ---

"We've detected some temporal anomalies," one of Santa's Elves at the Temporal Anomaly Research and Detection Instrument Station tells you. She sounded pretty worried when she called you down here. "At 500-year intervals into the past, someone has been changing Santa's history!"

"The good news is that the changes won't propagate to our time stream for another 25 days, and we have a device" - she attaches something to your wrist - "that will let you fix the changes with no such propagation delay. It's configured to send you 500 years further into the past every few days; that was the best we could do on such short notice."

"The bad news is that we are detecting roughly fifty anomalies throughout time; the device will indicate fixed anomalies with stars. The other bad news is that we only have one device and you're the best person for the job! Good lu--" She taps a button on the device and you suddenly feel like you're falling. To save Christmas, you need to get all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

After feeling like you've been falling for a few minutes, you look at the device's tiny screen. "Error: Device must be calibrated before first use. Frequency drift detected. Cannot maintain destination lock." Below the message, the device shows a sequence of changes in frequency (your puzzle input). A value like +6 means the current frequency increases by 6; a value like -3 means the current frequency decreases by 3.

For example, if the device displays frequency changes of +1, -2, +3, +1, then starting from a frequency of zero, the following changes would occur:

Current frequency  0, change of +1; resulting frequency  1.
Current frequency  1, change of -2; resulting frequency -1.
Current frequency -1, change of +3; resulting frequency  2.
Current frequency  2, change of +1; resulting frequency  3.

In this example, the resulting frequency is 3.

Here are other example situations:

+1, +1, +1 results in  3
+1, +1, -2 results in  0
-1, -2, -3 results in -6

Starting with a frequency of zero, what is the resulting frequency after all of the changes in frequency have been applied?


--- Part Two ---

You notice that the device repeats the same frequency change list over and over. To calibrate the device, you need to find the first frequency it reaches twice.

For example, using the same list of changes above, the device would loop as follows:

Current frequency  0, change of +1; resulting frequency  1.
Current frequency  1, change of -2; resulting frequency -1.
Current frequency -1, change of +3; resulting frequency  2.
Current frequency  2, change of +1; resulting frequency  3.
(At this point, the device continues from the start of the list.)
Current frequency  3, change of +1; resulting frequency  4.
Current frequency  4, change of -2; resulting frequency  2, which has already been seen.

In this example, the first frequency reached twice is 2. Note that your device might need to repeat its list of frequency changes many times before a duplicate frequency is found, and that duplicates might be found while in the middle of processing the list.

Here are other examples:

+1, -1 first reaches 0 twice.
+3, +3, +4, -2, -4 first reaches 10 twice.
-6, +3, +8, +5, -6 first reaches 5 twice.
+7, +7, -2, -7, -4 first reaches 14 twice.

What is the first frequency your device reaches twice?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function increaseAndDecreaseFrequency (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const NUM_ROUNDS = part === 1 ? 1                 // PART 1: RUN THROUGH INSTRUCTIONS ONCE
                                : Infinity;         // PART 2: RUN THROUGH INSTRUCTIONS INDEFINITELY, UNTIL WE FIND A SOLUTION

  // DATA STRUCTURES
  const seen = new Set();
  seen.add(0);                                      // important to count 0 as seen

  // INIT
  let frequency = 0;

  // ANALYZE
  for (let i = 0; i < NUM_ROUNDS; ++i) {
    for (const line of inputArr) {
      frequency += +line;
      if (seen.has(frequency)) return frequency;
      seen.add(frequency);
    }
  }
  
  return frequency;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = increaseAndDecreaseFrequency;
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
`+1
-2
+3
+1`
);

const sampleInput2 = parseSampleInput(
`+1
+1
+1`
);

const sampleInput3 = parseSampleInput(
`+1
+1
-2`
);

const sampleInput4 = parseSampleInput(
`-1
-2
-3`
);

const sampleInput5 = parseSampleInput(
`+1
-1`
);

const sampleInput6 = parseSampleInput(
`+3
+3
+4
-2
-4`
);

const sampleInput7 = parseSampleInput(
`-6
+3
+8
+5
-6`
);

const sampleInput8 = parseSampleInput(
`+7
+7
-2
-7
-4`
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
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = -6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 592;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInput7,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput8,
  DEBUG: true,
};
expected = 14;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 241;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);