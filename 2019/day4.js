/*

--- Day 4: Secure Container ---

You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).

Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).

How many different passwords within the range given in your puzzle input meet these criteria?


--- Part Two ---

An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).

How many different passwords within the range given in your puzzle input meet all of the criteria?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function passwordRequirements (part, inputStr, DEBUG = false) {
  
  // PARSE INPUT DATA
  const [ LOWER_LIMIT, UPPER_LIMIT ] = inputStr.split('-').map(n => +n);

  // HELPER FUNCTION - RETURNS WHETHER A STRING, s, REPRESENTING A NUMBER, MEETS THE PASSWORD REQUIREMENTS
  function meetsCriteria(s) {

    // RULE: It is a six-digit number.
    if (s.length !== 6) return false;

    let foundPair = false;                                                // for part 1
    const freq = {};                                                      // for part 2

    for (let i = 0; i < s.length; ++i) {

      if (i < s.length - 1 && s[i] === s[i + 1]) foundPair = true;        // PART 1 RULE: Two adjacent digits are the same (like 22 in 122345).
      if (i < s.length - 1 && +s[i] > +s[i + 1]) return false;            // RULE: Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).

      freq[s[i]] = (freq[s[i]] || 0) + 1;                                 // PART 2 RULE: The two adjacent matching digits are not part of a larger group of matching digits.
    }

    return part === 1 ? foundPair                                         // PART 1: JUST NEED TO FIND A PAIR SOMEWHERE
                      : Object.values(freq).includes(2);                  // PART 2: ONE PAIR MUST NOT BE PART OF A LARGER GROUP OF THE SAME DIGIT
  }

  // ANALYZE
  const goodPasswords = [];
  for (let n = LOWER_LIMIT; n <= UPPER_LIMIT; ++n) {
    if (meetsCriteria(String(n))) {
      goodPasswords.push(n);
    }
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log('GOOD PASSWORDS:', goodPasswords);
  }

  return goodPasswords.length;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = passwordRequirements;
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

// const sampleInput = parseSampleInput(
// ``
// );

// Test case 1
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2050;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1390;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);