/*

--- Day 4: The Ideal Stocking Stuffer ---

Santa needs help mining some AdventCoins (very similar to bitcoins) to use as gifts for all the economically forward-thinking little girls and boys.

To do this, he needs to find MD5 hashes which, in hexadecimal, start with at least five zeroes. The input to the MD5 hash is some secret key (your puzzle input, given below) followed by a number in decimal. To mine AdventCoins, you must find Santa the lowest positive number (no leading zeroes: 1, 2, 3, ...) that produces such a hash.

For example:

If your secret key is abcdef, the answer is 609043, because the MD5 hash of abcdef609043 starts with five zeroes (000001dbbfa...), and it is the lowest such number to do so.
If your secret key is pqrstuv, the lowest number it combines with to make an MD5 hash starting with five zeroes is 1048970; that is, the MD5 hash of pqrstuv1048970 looks like 000006136ef....


--- Part Two ---

Now find one that starts with six zeroes.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function getMD5Hash (part, inputStr, DEBUG = false) {

  // REFERENCE
  // https://en.wikipedia.org/wiki/MD5
  // https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript
  // https://www.geeksforgeeks.org/node-js-crypto-createhash-method/

  // CONSTANTS
  const CRYPTO = require('crypto');
  const SECRET_KEY = inputStr;
  const NUM_ZEROES = part === 1 ? 5                                                         // PART 1: FIND A HASH WITH 5 LEADING ZEROES
                                : 6;                                                        // PART 2: FIND A HASH WITH 6 LEADING ZEROES
  const LIMIT = Number.MAX_SAFE_INTEGER;                                                    // this shouldn't happen but it's safer than an infinite loop
                                
  const TIME_AT_START = Date.now();
  if (DISPLAY_EXTRA_INFO) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  // ANALYZE
  for (let num = 1; num < LIMIT; ++num) {
    const hash = CRYPTO.createHash('md5')                                                   // get hash based on 'md5' encryption and key; return as hex
                        .update(SECRET_KEY + num)                                           // construct key from secret key concatenated with decimal
                        .digest('hex');

    if (hash.slice(0, NUM_ZEROES) === '0'.repeat(NUM_ZEROES)) {                             // check if hash begins with required number of leading zeroes
      if (DISPLAY_EXTRA_INFO) {
        console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
      }
      return num;
    }
  }

  throw `ERROR: REACHED LIMIT ${LIMIT}`;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = getMD5Hash;
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
`abcdef`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 609043;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 254575;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1038736;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);