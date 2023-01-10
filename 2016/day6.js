/*

--- Day 6: Signals and Noise ---

Something is jamming your communications with Santa. Fortunately, your signal is only partially jammed, and protocol in situations like this is to switch to a simple repetition code to get the message through.

In this model, the same message is sent repeatedly. You've recorded the repeating message signal (your puzzle input), but the data seems quite corrupted - almost too badly to recover. Almost.

All you need to do is figure out which character is most frequent for each position. For example, suppose you had recorded the following messages:

eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar

The most common character in the first column is e; in the second, a; in the third, s, and so on. Combining these characters returns the error-corrected message, easter.

Given the recording in your puzzle input, what is the error-corrected version of the message being sent?


--- Part Two ---

Of course, that would be the message - if you hadn't agreed to use a modified repetition code instead.

In this modified code, the sender instead transmits what looks like random data, but for each character, the character they actually want to send is slightly less likely than the others. Even after signal-jamming noise, you can look at the letter distributions in each column and choose the least common letter to reconstruct the original message.

In the above example, the least common character in the first column is a; in the second, d, and so on. Repeating this process for the remaining characters produces the original message, advent.

Given the recording in your puzzle input and this new decoding methodology, what is the original message that Santa is trying to send?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeFrequencyOfCharacters (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  const LEN = inputArr[0].length;

  const dictionaries = Array.from({length: LEN}, () => ({}));

  for (const line of inputArr) {
    if (line.length !== LEN) {
      throw 'ERROR: LINE LENGTH IS '
              + line.length
              + ' WHICH DOES NOT EQUAL INITIAL LINE LENGTH '
              + LEN;
    }
    for (let i = 0; i < line.length; ++i) {
      const dictionary = dictionaries[i];
      const c = line[i];
      dictionary[c] = (dictionary[c] || 0) + 1;
    }
  }

  return dictionaries.map(dictionary => {
    let maxChar;
    let maxFreq = 0;
    let minChar;
    let minFreq = Infinity;
    for (const key in dictionary) {
      if (dictionary[key] > maxFreq) {
        maxFreq = dictionary[key];
        maxChar = key;
      }
      if (dictionary[key] < minFreq) {
        minFreq = dictionary[key];
        minChar = key;
      }
    }
    return part === 1 ? maxChar
                      : minChar;
  }).join('');
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeFrequencyOfCharacters;
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
`eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'easter';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 'qtbjqiuq';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'advent';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 'akothqli';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);