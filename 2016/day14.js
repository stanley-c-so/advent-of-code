/*

--- Day 14: One-Time Pad ---

In order to communicate securely with Santa while you're on this mission, you've been using a one-time pad that you generate using a pre-agreed algorithm. Unfortunately, you've run out of keys in your one-time pad, and so you need to generate some more.

To generate keys, you first get a stream of random data by taking the MD5 of a pre-arranged salt (your puzzle input) and an increasing integer index (starting with 0, and represented in decimal); the resulting MD5 hash should be represented as a string of lowercase hexadecimal digits.

However, not all of these MD5 hashes are keys, and you need 64 new keys for your one-time pad. A hash is a key only if:

It contains three of the same character in a row, like 777. Only consider the first such triplet in a hash.
One of the next 1000 hashes in the stream contains that same character five times in a row, like 77777.

Considering future hashes for five-of-a-kind sequences does not cause those hashes to be skipped; instead, regardless of whether the current hash is a key, always resume testing for keys starting with the very next hash.

For example, if the pre-arranged salt is abc:

The first index which produces a triple is 18, because the MD5 hash of abc18 contains ...cc38887a5.... However, index 18 does not count as a key for your one-time pad, because none of the next thousand hashes (index 19 through index 1018) contain 88888.
The next index which produces a triple is 39; the hash of abc39 contains eee. It is also the first key: one of the next thousand hashes (the one at index 816) contains eeeee.
None of the next six triples are keys, but the one after that, at index 92, is: it contains 999 and index 200 contains 99999.
Eventually, index 22728 meets all of the criteria to generate the 64th key.

So, using our example salt of abc, index 22728 produces the 64th key.

Given the actual salt in your puzzle input, what index produces your 64th one-time pad key?


--- Part Two ---

Of course, in order to make this process even more secure, you've also implemented key stretching.

Key stretching forces attackers to spend more time generating hashes. Unfortunately, it forces everyone else to spend more time, too.

To implement key stretching, whenever you generate a hash, before you use it, you first find the MD5 hash of that hash, then the MD5 hash of that hash, and so on, a total of 2016 additional hashings. Always use lowercase hexadecimal representations of hashes.

For example, to find the stretched hash for index 0 and salt abc:

Find the MD5 hash of abc0: 577571be4de9dcce85a041ba0410f29f.
Then, find the MD5 hash of that hash: eec80a0c92dc8a0777c619d9bb51e910.
Then, find the MD5 hash of that hash: 16062ce768787384c81fe17a7a60c7e3.
...repeat many times...
Then, find the MD5 hash of that hash: a107ff634856bb300138cac6568c0f24.

So, the stretched hash for index 0 in this situation is a107ff.... In the end, you find the original hash (one use of MD5), then find the hash-of-the-previous-hash 2016 times, for a total of 2017 uses of MD5.

The rest of the process remains the same, but now the keys are entirely different. Again for salt abc:

The first triple (222, at index 5) has no matching 22222 in the next thousand hashes.
The second triple (eee, at index 10) hash a matching eeeee at index 89, and so it is the first key.
Eventually, index 22551 produces the 64th key (triple fff with matching fffff at index 22859.

Given the actual salt in your puzzle input and using 2016 extra MD5 calls of key stretching, what index now produces your 64th one-time pad key?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function MD5andOTP (part, inputStr, DEBUG = false) {
  
  // REFERENCE
  // https://en.wikipedia.org/wiki/MD5
  // https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript
  // https://www.geeksforgeeks.org/node-js-crypto-createhash-method/

  // CONSTANTS
  const CRYPTO = require('crypto');
  const SALT = inputStr;
  const NUM_TIMES_TO_HASH = part === 1  ? 1                                                 // PART 1: ONLY HASH ONCE
                                        : 1 + 2016;                                         // PART 2: HASH ONCE, THEN HASH ANOTHER 2016 TIMES (2017 TOTAL)
  const FINAL_KEY = 64;
  const LIMIT = Number.MAX_SAFE_INTEGER;                                                    // this shouldn't happen but it's safer than an infinite loop

  // DATA STRUCTURES
  const hashesWithRepeat3 = {};
  const hashesWithRepeat5 = {};
  const OTPs = [];

  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  for (let num = 0; num < LIMIT; ++num) {
    let hash = SALT + num;
    for (let i = 0; i < NUM_TIMES_TO_HASH; ++i) {
      hash = CRYPTO.createHash('md5')                                                       // get hash based on 'md5' encryption and key; return as hex
                    .update(hash)                                                           // construct key from salt concatenated with decimal
                    .digest('hex');
    }

    // CHECK IF THERE ARE ANY REPEAT 3s IN THIS HASH; SAVE THE FIRST ONE ONLY
    for (let i = 0; i < hash.length - 2; ++i) {
      if (hash.slice(i, i + 3) === hash[i].repeat(3)) {
        hashesWithRepeat3[num] = hash[i];
        break;                                                                              // NOTE: ONLY CONSIDER THE FIRST SUCH TRIPLET
      }
    }

    // CHECK IF THERE ARE ANY REPEAT 5s IN THIS HASH; SAVE ALL
    for (let i = 0; i < hash.length - 4; ++i) {
      if (hash.slice(i, i + 5) === hash[i].repeat(5)) {
        if (!(num in hashesWithRepeat5)) hashesWithRepeat5[num] = new Set();
        hashesWithRepeat5[num].add(hash[i]);
      }
    }

    // IF num > 1000 WE CAN START LOOKING BACKWARD BY 1000 TO SEARCH FOR VALID KEYS
    if (num > 1000 && num - 1000 in hashesWithRepeat3) {

      const next1000HashesWithRepeat5 = Object.keys(hashesWithRepeat5)
                                              .filter(n => num - 1000 < +n && +n <= num);

      for (const n of next1000HashesWithRepeat5) {                                          // check for match between eligible hashes with repeat 5...
        const digit = hashesWithRepeat3[num - 1000];                                        // ...and digit repeated 3x
        if (hashesWithRepeat5[n].has(digit)) {
          OTPs.push(num - 1000);
          if (OTPs.length === FINAL_KEY) {
            console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
            return num - 1000;
          }
          break;                                                                            // NOTE: break to avoid potential repeats of num - 1000
        }
      }
    }
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  throw `ERROR: REACHED LIMIT ${LIMIT}`;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = MD5andOTP;
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
`abc`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 22728;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 18626;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 22551;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 20092;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);