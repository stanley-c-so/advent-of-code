// --- Day 4: Secure Container ---

// PART 1:

// You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

// However, they do remember a few key facts about the password:

// It is a six-digit number.
// The value is within the range given in your puzzle input.
// Two adjacent digits are the same (like 22 in 122345).
// Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
// Other than the range rule, the following are true:

// 111111 meets these criteria (double 11, never decreases).
// 223450 does not meet these criteria (decreasing pair of digits 50).
// 123789 does not meet these criteria (no double).
// How many different passwords within the range given in your puzzle input meet these criteria?

// PART 2:

// An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

// Given this additional criterion, but still ignoring the range rule, the following are now true:

// 112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
// 123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
// 111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
// How many different passwords within the range given in your puzzle input meet all of the criteria?

// SWITCHING BETWEEN SOLUTIONS:
const validSolutions = solution_1;

function solution_1 (part, terminals) {

  const [start, end] = terminals;
  
  let count = 0;
  for (let i = start; i <= end; i++) {
    let double = false;
    let increasing = true;
    const str = i.toString();
    const freq = {};                                    // part 2 logic
    for (let j = 0; j < str.length; j++) {
      freq[str[j]] = (freq[str[j]] || 0) + 1;           // part 2 logic
      if (str[j] === str[j + 1]) double = true;
      if (+str[j] > +str[j + 1]) increasing = false;
    }
    if (double && increasing && (part === 1 || Object.values(freq).includes(2))) count++;   // part 2 logic added here
  }

  return count;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = validSolutions;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = [128392, 643281];

// Test case 1
input = {
  part: 1,
  terminals: actualInput,
};
expected = 2050;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  terminals: actualInput,
};
expected = 1390;
test(func, input, expected, testNum, lowestTest, highestTest);