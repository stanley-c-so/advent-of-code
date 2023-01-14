/*

--- Day 8: Matchsticks ---

Space on the sleigh is limited this year, and so Santa will be bringing his list as a digital copy. He needs to know how much space it will take up when stored.

It is common in many programming languages to provide a way to escape special characters in strings. For example, C, JavaScript, Perl, Python, and even PHP handle special characters in very similar ways.

However, it is important to realize the difference between the number of characters in the code representation of the string literal and the number of characters in the in-memory string itself.

For example:

"" is 2 characters of code (the two double quotes), but the string contains zero characters.
"abc" is 5 characters of code, but 3 characters in the string data.
"aaa\"aaa" is 10 characters of code, but the string itself contains six "a" characters and a single, escaped quote character, for a total of 7 characters in the string data.
"\x27" is 6 characters of code, but the string itself contains just one - an apostrophe ('), escaped using hexadecimal notation.

Santa's list is a file that contains many double-quoted string literals, one on each line. The only escape sequences used are \\ (which represents a single backslash), \" (which represents a lone double-quote character), and \x plus two hexadecimal characters (which represents a single character with that ASCII code).

Disregarding the whitespace in the file, what is the number of characters of code for string literals minus the number of characters in memory for the values of the strings in total for the entire file?

For example, given the four strings above, the total number of characters of string code (2 + 5 + 10 + 6 = 23) minus the total number of characters in memory for string values (0 + 3 + 7 + 1 = 11) is 23 - 11 = 12.


--- Part Two ---

Now, let's go the other way. In addition to finding the number of characters of code, you should now encode each code representation as a new string and find the number of characters of the new encoded representation, including the surrounding double quotes.

For example:

"" encodes to "\"\"", an increase from 2 characters to 6.
"abc" encodes to "\"abc\"", an increase from 5 characters to 9.
"aaa\"aaa" encodes to "\"aaa\\\"aaa\"", an increase from 10 characters to 16.
"\x27" encodes to "\"\\x27\"", an increase from 6 characters to 11.

Your task is to find the total number of characters to represent the newly encoded strings minus the number of characters of code in each original string literal. For example, for the strings above, the total encoded length (6 + 9 + 16 + 11 = 42) minus the characters in the original code representation (23, just like in the first part of this puzzle) is 42 - 23 = 19.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function handleEscapeCharacters (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURE (not strictly needed, but helps for debugging)
  const DATA = [];

  if (part === 1) {                                                       // PART 1: INTERESTED IN IN-MEMORY LENGTH

    for (const line of inputArr) {
      let inMemoryLength = 0;
      for (let i = 0; i < line.length; ++i) {
        if (0 < i && i < line.length - 1) ++inMemoryLength;               // only count characters between the " bookends
        if (line[i] === '\\') {                                           // if current character is an escape \...
          if (i < line.length - 1 && line[i + 1] === '\\')      i += 1;     // ...if next character is also \, skip next character
          else if (i < line.length - 1 && line[i + 1] === '"')  i += 1;     // ...if next character is ", skip next character
          else if (i < line.length - 3 && line[i + 1] === 'x')  i += 3;     // ...if next character is x, skip next 3 characters
        }
      }
      DATA.push({
        representationLength: line.length,
        inMemoryLength,
      });
    }
    const totalRepresentationLength = DATA.reduce((total, str) => str.representationLength + total, 0);
    const totalInMemoryLength = DATA.reduce((total, str) => str.inMemoryLength + total, 0);
    return totalRepresentationLength - totalInMemoryLength;

  } else {                                                                // PART 2: INTERESTED IN NEW ENCODING LENGTH

    for (const line of inputArr) {
      let newEncodingLength = 2;                                          // new encoding must be bookended with "s, so add 2
      for (let i = 0; i < line.length; ++i) {
        ++newEncodingLength;
        if ([ '\\', '"' ].includes(line[i])) ++newEncodingLength;         // if \ or ", then increment again to include the escape \
      }
      DATA.push({
        representationLength: line.length,
        newEncodingLength,
      });
    }
    const totalRepresentationLength = DATA.reduce((total, str) => str.representationLength + total, 0);
    const totalNewEncodingLength = DATA.reduce((total, str) => str.newEncodingLength + total, 0);
    return totalNewEncodingLength - totalRepresentationLength;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = handleEscapeCharacters;
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

const sampleInput = parseSampleInput(       // NOTE: MANUALLY ADDED IN EXTRA '\' FOR ESCAPE CHARACTERS
`""
"abc"
"aaa\\"aaa"
"\\x27"`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 12;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1333;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 19;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2046;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);