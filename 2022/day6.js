/*

--- Day 6: Tuning Trouble ---

The preparations are finally complete; you and the Elves leave camp on foot and begin to make your way toward the star fruit grove.

As you move through the dense undergrowth, one of the Elves gives you a handheld device. He says that it has many fancy features, but the most important one to set up right now is the communication system.

However, because he's heard you have significant experience dealing with signal-based systems, he convinced the other Elves that it would be okay to give you their one malfunctioning device - surely you'll have no problem fixing it.

As if inspired by comedic timing, the device emits a few colorful sparks.

To be able to communicate with the Elves, the device needs to lock on to their signal. The signal is a series of seemingly-random characters that the device receives one at a time.

To fix the communication system, you need to add a subroutine to the device that detects a start-of-packet marker in the datastream. In the protocol being used by the Elves, the start of a packet is indicated by a sequence of four characters that are all different.

The device will send your subroutine a datastream buffer (your puzzle input); your subroutine needs to identify the first position where the four most recently received characters were all different. Specifically, it needs to report the number of characters from the beginning of the buffer to the end of the first such four-character marker.

For example, suppose you receive the following datastream buffer:

mjqjpqmgbljsphdztnvjfqwrcgsmlb

After the first three characters (mjq) have been received, there haven't been enough characters received yet to find the marker. The first time a marker could occur is after the fourth character is received, making the most recent four characters mjqj. Because j is repeated, this isn't a marker.

The first time a marker appears is after the seventh character arrives. Once it does, the last four characters received are jpqm, which are all different. In this case, your subroutine should report the value 7, because the first start-of-packet marker is complete after 7 characters have been processed.

Here are a few more examples:

bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 5
nppdvjthqldpwncqszvftbrmjlhg: first marker after character 6
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 10
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 11

How many characters need to be processed before the first start-of-packet marker is detected?


--- Part Two ---

Your device's communication system is correctly detecting packets, but still isn't working. It looks like it also needs to look for messages.

A start-of-message marker is just like a start-of-packet marker, except it consists of 14 distinct characters rather than 4.

Here are the first positions of start-of-message markers for all of the above examples:

mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 23
nppdvjthqldpwncqszvftbrmjlhg: first marker after character 23
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 29
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 26

How many characters need to be processed before the first start-of-message marker is detected?

*/

function findSubstringWithUniqueChars (part, inputStr, DEBUG = false) {
  // if (DEBUG) {
  //   console.log(inputStr);
  // }

  const N = part === 1 ? 4                                                      // PART 1: NEED SUBSTRING OF LENGTH 4
                       : 14;                                                    // PART 2: NEED SUBSTRING OF LENGTH 14

  // // ===== SOLUTION 1: TAKE SLICES BASED ON INDEX POSITION, INSERT INTO A SET, AND MEASURE SET SIZE
  // for (let i = N - 1; i < inputStr.length; ++i) {
  //   if (new Set(inputStr.slice(i - (N - 1), i + 1)).size === N) return i + 1;
  // }
  // throw `ERROR: DID NOT FIND SUBSTRING OF LENGTH ${N} WITH UNIQUE CHARACTERS`;

  // ===== SOLUTION 2 (BETTER TIME COMPLEXITY): USE A HASH TABLE AND TRACK UNIQUE CHARS
  const freq = {};
  let numUniqueChars = 0;

  for (let i = 0; i < inputStr.length; ++i) {
    if (i >= N) {                                                               // evict leftmost character from sliding window
      --freq[inputStr[i - N]];
      if (freq[inputStr[i - N]] === 0) {
        delete freq[inputStr[i - N]];
        --numUniqueChars;
      }
    }
    
    if (!(inputStr[i] in freq)) {                                               // add incoming rightmost character to sliding window
      freq[inputStr[i]] = 0;
      ++numUniqueChars;
    }
    ++freq[inputStr[i]];

    if (numUniqueChars === N) return i + 1;                                     // return i + 1 because the answer is 1-indexed
  }
  throw `ERROR: DID NOT FIND SUBSTRING OF LENGTH ${N} WITH UNIQUE CHARACTERS`;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findSubstringWithUniqueChars;
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
`mjqjpqmgbljsphdztnvjfqwrcgsmlb`
);

const sampleInput2 = parseSampleInput(
`bvwbjplbgvbhsrlpgdmjqwftvncz`
);

const sampleInput3 = parseSampleInput(
`nppdvjthqldpwncqszvftbrmjlhg`
);

const sampleInput4 = parseSampleInput(
`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`
);

const sampleInput5 = parseSampleInput(
`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 7;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 11;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1287;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 19;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 23;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 23;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 29;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 26;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3716;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);