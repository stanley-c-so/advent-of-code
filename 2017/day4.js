/*

--- Day 4: High-Entropy Passphrases ---

A new system policy has been put in place that requires all accounts to use a passphrase instead of simply a password. A passphrase consists of a series of words (lowercase letters) separated by spaces.

To ensure security, a valid passphrase must contain no duplicate words.

For example:

aa bb cc dd ee is valid.
aa bb cc dd aa is not valid - the word aa appears more than once.
aa bb cc dd aaa is valid - aa and aaa count as different words.

The system's full passphrase list is available as your puzzle input. How many passphrases are valid?


--- Part Two ---

For added security, yet another system policy has been put in place. Now, a valid passphrase must contain no two words that are anagrams of each other - that is, a passphrase is invalid if any word's letters can be rearranged to form any other word in the passphrase.

For example:

abcde fghij is a valid passphrase.
abcde xyz ecdab is not valid - the letters from the third word can be rearranged to form the first word.
a ab abc abd abf abj is a valid passphrase, because all letters need to be used when forming another word.
iiii oiii ooii oooi oooo is valid.
oiii ioii iioi iiio is not valid - any of these words can be rearranged to form any other word.

Under this new system policy, how many passphrases are valid?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function validPassphraseBasedOnRepeats (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  let validCount = 0;

  for (const line of inputArr) {
    const split = line.split(' ');
    const seen = new Set();
    let valid = true;
    for (const word of split) {
      const wordToCompare = part === 1  ? word                              // PART 1: NO REPEATED WORDS
                                        : word.split('').sort().join('');   // PART 2: NO ANAGRAMS (i.e. NO REPEATED SORTED WORDS)
      if (seen.has(wordToCompare)) {
        valid = false;
        break;
      }
      seen.add(wordToCompare);
    }
    if (valid) ++validCount;
  }

  return validCount;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = validPassphraseBasedOnRepeats;
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
`aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`
);

const sampleInput2 = parseSampleInput(
`abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio`
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
expected = 337;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 231;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);