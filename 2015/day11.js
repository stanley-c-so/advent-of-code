/*

--- Day 11: Corporate Policy ---

Santa's previous password expired, and he needs help choosing a new one.

To help him remember his new password after the old one expires, Santa has devised a method of coming up with a password based on the previous one. Corporate policy dictates that passwords must be exactly eight lowercase letters (for security reasons), so he finds his new password by incrementing his old password string repeatedly until it is valid.

Incrementing is just like counting with numbers: xx, xy, xz, ya, yb, and so on. Increase the rightmost letter one step; if it was z, it wraps around to a, and repeat with the next letter to the left until one doesn't wrap around.

Unfortunately for Santa, a new Security-Elf recently started, and he has imposed some additional password requirements:

Passwords must include one increasing straight of at least three letters, like abc, bcd, cde, and so on, up to xyz. They cannot skip letters; abd doesn't count.
Passwords may not contain the letters i, o, or l, as these letters can be mistaken for other characters and are therefore confusing.
Passwords must contain at least two different, non-overlapping pairs of letters, like aa, bb, or zz.

For example:

hijklmmn meets the first requirement (because it contains the straight hij) but fails the second requirement requirement (because it contains i and l).
abbceffg meets the third requirement (because it repeats bb and ff) but fails the first requirement.
abbcegjk fails the third requirement, because it only has one double letter (bb).
The next password after abcdefgh is abcdffaa.
The next password after ghijklmn is ghjaabcc, because you eventually skip all the passwords that start with ghi..., since i is not allowed.

Given Santa's current password (your puzzle input), what should his next password be?


--- Part Two ---

Santa's password expired again. What's the next one?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  
  // CONSTANTS
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const FORBIDDEN_CHAR = new Set([ 'i', 'o', 'l' ]);
  const NUM_PAIRS_NEEDED = 2;
  const INDEX = {};
  for (let i = 0; i < ALPHABET.length; ++i) INDEX[ALPHABET[i]] = i;

  // UTILITY FUNCTION: GIVEN A PASSWORD ARRAY, TRANSFORM IT INTO ITS NEXT PASSWORD AFTER INCREMENTING
  function increment(password) {
    for (let i = password.length - 1; i >= 0; --i) {
      if (password[i] === 'z') {
        if (i === 0) throw `ERROR: CANNOT INCREMENT FROM ${password.join('')}`;
        password[i] = 'a';
      } else {
        password[i] = ALPHABET[ INDEX[password[i]] + 1 ];
        break;
      }
    }
  }

  // UTILITY FUNCTION: GIVEN A PASSWORD ARRAY, VERIFY THAT IT CONTAINS A STRAIGHT OF AT LEAST LENGTH 3
  function validateStraight(password) {
    for (let i = 0; i < password.length - 2; ++i) {
      const idx = INDEX[password[i]];
      if (INDEX[password[i + 1]] === idx + 1
          && INDEX[password[i + 2]] === idx + 2
      ) {
        return true;
      }
    }
    return false;
  }

  // UTILITY FUNCTION: GIVEN A PASSWORD ARRAY, VERIFY THAT IS DOES NOT CONTAIN ANY OF THE FORBIDDEN LETTERS GIVEN IN CONSTANTS
  function validateForbiddenChar(password) {
    for (const c of password) {
      if (FORBIDDEN_CHAR.has(c)) return false;
    }
    return true;
  }

  // UTILITY FUNCTION: GIVEN A PASSWORD ARRAY, VERIFY THAT IT HAS AT LEAST THE NUMBER OF DISTINCT PAIRS GIVEN IN CONSTANTS
  function validatePairs(password) {
    const pairs = new Set();
    for (let i = 0; i < password.length - 1; ++i) {
      if (password[i] === password[i + 1]) {
        const pair = password[i].repeat(2);
        pairs.add(pair)
        if (pairs.size === NUM_PAIRS_NEEDED) return true;
      }
    }
    return false;
  }

  // UTILITY FUNCTION: RUN THE OTHER VALIDATION FUNCTIONS
  function validate(password) {
    return validateStraight(password)
            && validateForbiddenChar(password)
            && validatePairs(password);
  }

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  const password = inputStr.split('');
  increment(password);                                                                  // edge case: in case input is already compatible
  while (!validate(password)) increment(password);

  if (part === 1) {                                                                     // PART 1: IMMEDIATELY RETURN NEXT PASSWORD

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return password.join('');

  } else {                                                                              // PART 2: INCREMENT AGAIN, THEN RETURN NEXT PASSWORD

    increment(password);
    while (!validate(password)) increment(password);
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return password.join('');

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
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
`abcdefgh`
);

const sampleInput2 = parseSampleInput(
`ghijklmn`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'abcdffaa';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 'ghjaabcc';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 'hepxxyzz';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 'heqaabcc';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);