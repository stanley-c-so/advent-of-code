/*

--- Day 5: Doesn't He Have Intern-Elves For This? ---

Santa needs help figuring out which strings in his text file are naughty or nice.

A nice string is one with all of the following properties:

It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.

For example:

ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
jchzalrnumimnmhp is naughty because it has no double letter.
haegwjzuvuyypxyu is naughty because it contains the string xy.
dvszwmarrgswjxmb is naughty because it contains only one vowel.

How many strings are nice?


--- Part Two ---

Realizing the error of his ways, Santa has switched to a better model of determining whether a string is naughty or nice. None of the old rules apply, as they are all clearly ridiculous.

Now, a nice string is one with all of the following properties:

It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.

For example:

qjhvhtzxzqqjkmpb is nice because is has a pair that appears twice (qj) and a letter that repeats with exactly one letter between them (zxz).
xxyxx is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
uurcxstgmygtbstg is naughty because it has a pair (tg) but no repeat with a single letter between them.
ieodomkazucvgmuy is naughty because it has a repeating letter with one between (odo), but no pair that appears twice.

How many strings are nice under these new rules?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function naughtyOrNiceStrings (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const VOWELS = new Set('aeiou'.split(''));
  const PROHIBITED = new Set([ 'ab', 'cd', 'pq', 'xy' ]);

  // INIT
  let nice = 0;

  // ANALYZE
  if (part === 1) {                                                                 // PART 1: 3 REQUIREMENTS (SEE PROBLEM DESCRIPTION)

    for (const line of inputArr) {

      let vowels = 0;
      let doubleLetter = false;
      let prohibited = false;

      for (let i = 0; i < line.length; ++i) {
        const c = line[i];
        if (VOWELS.has(c)) ++vowels;                                                // check for vowel
        if (i < line.length - 1) {
          if (c === line[i + 1]) doubleLetter = true;                               // check for double letter
          if (PROHIBITED.has(c + line[i + 1])) {                                    // check for prohibited pair
            prohibited = true;
            break;
          }
        }
      }
  
      if (vowels >= 3 && doubleLetter && !prohibited) ++nice;
    }

  } else {                                                                          // PART 2: 2 REQUIREMENTS (SEE PROBLEM DESCRIPTION)


    for (const line of inputArr) {

      const idxOfFirstAppearanceOfPair = {};                                        // save index of first appearance to enforce no overlap
      let repeatedPair = false
      let AXA = false;                                                              // i.e. repeated char with exactly 1 char in between

      for (let i = 0; i < line.length; ++i) {
        const c = line[i];
        if (i < line.length - 1) {
          const pair = c + line[i + 1];
          if (pair in idxOfFirstAppearanceOfPair) {
            if (i > idxOfFirstAppearanceOfPair[pair] + 1) repeatedPair = true;      // check for repeated pair (no overlap)
          } else {
            idxOfFirstAppearanceOfPair[pair] = i;
          }
        }
        if (i < line.length - 2 && c === line[i + 2]) AXA = true;                   // check for repeated char with exactly 1 char in between
      }
  
      if (repeatedPair && AXA) ++nice;
    }

  }

  return nice;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = naughtyOrNiceStrings;
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
`ugknbfddgicrmopn
aaa
jchzalrnumimnmhp
haegwjzuvuyypxyu
dvszwmarrgswjxmb`
);

const sampleInput2 = parseSampleInput(
`qjhvhtzxzqqjkmpb
xxyxx
uurcxstgmygtbstg
ieodomkazucvgmuy`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 255;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 55;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);