/*

--- Day 20: Firewall Rules ---

You'd like to set up a small hidden computer here so you can use it to get back into the network later. However, the corporate firewall only allows communication with certain external IP addresses.

You've retrieved the list of blocked IPs from the firewall, but the list seems to be messy and poorly maintained, and it's not clear which IPs are allowed. Also, rather than being written in dot-decimal notation, they are written as plain 32-bit integers, which can have any value from 0 through 4294967295, inclusive.

For example, suppose only the values 0 through 9 were valid, and that you retrieved the following blacklist:

5-8
0-2
4-7

The blacklist specifies ranges of IPs (inclusive of both the start and end value) that are not allowed. Then, the only IPs that this firewall allows are 3 and 9, since those are the only numbers not in any range.

Given the list of blocked IPs you retrieved from the firewall (your puzzle input), what is the lowest-valued IP that is not blocked?


--- Part Two ---

How many IPs are allowed by the blacklist?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function mergeIntervals (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const MAX = 4294967295;
  const MIN = 0;

  // INIT
  const blacklist = [];

  // PARSE INPUT DATA
  for (const line of inputArr) {
    blacklist.push(line.split('-').map(n => +n));
  }

  // SORT INTERVALS (BY START OF INTERVAL) AND MERGE
  blacklist.sort((a, b) => a[0] - b[0]);
  const mergedBlacklist = [ blacklist[0] ];
  for (let i = 1; i < blacklist.length; ++i) {
    if (blacklist[i][0] <= mergedBlacklist.at(-1)[1] + 1) {               // overlap if next start of interval <= end of last interval + 1
      mergedBlacklist.at(-1)[1] = Math.max( mergedBlacklist.at(-1)[1],    // end of last interval reassigned to whichever end is greater
                                            blacklist[i][1] );
    } else {                                                              // if no overlap...
      mergedBlacklist.push(blacklist[i]);                                 // ...simply push current interval to end of merged array
    }
  }

  if (part === 1) {                                                       // PART 1: FIND LOWEST NON-BLACKLISTED IP

    return mergedBlacklist[0][0] > MIN  ? MIN                             // edge case (if MIN were not blacklisted) - though it doesn't happen here
                                        : mergedBlacklist[0][1] + 1;

  } else {                                                                // PART 2: COUNT TOTAL NON-BLACKLISTED IPs

    const totalIPs = MAX - MIN + 1;                                       // start with total IPs...

    let totalBlacklistedIPs = 0;                                          // ...calculate number of blacklisted IPs...
    for (const [a, b] of mergedBlacklist) {
      totalBlacklistedIPs += (b - a + 1);
    }

    return totalIPs - totalBlacklistedIPs;                                // ...and the difference is the number of allowed IPs

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = mergeIntervals;
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
`5-8
0-2
4-7`
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
  inputStr: actualInput,
};
expected = 32259706;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 113;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);