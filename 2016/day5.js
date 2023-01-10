/*

--- Day 5: How About a Nice Game of Chess? ---

You are faced with a security door designed by Easter Bunny engineers that seem to have acquired most of their security knowledge by watching hacking movies.

The eight-character password for the door is generated one character at a time by finding the MD5 hash of some Door ID (your puzzle input) and an increasing integer index (starting with 0).

A hash indicates the next character in the password if its hexadecimal representation starts with five zeroes. If it does, the sixth character in the hash is the next character of the password.

For example, if the Door ID is abc:

The first index which produces a hash that starts with five zeroes is 3231929, which we find by hashing abc3231929; the sixth character of the hash, and thus the first character of the password, is 1.
5017308 produces the next interesting hash, which starts with 000008f82..., so the second character of the password is 8.
The third time a hash starts with five zeroes is for abc5278568, discovering the character f.

In this example, after continuing this search a total of eight times, the password is 18f47a30.

Given the actual Door ID, what is the password?


--- Part Two ---

As the door slides open, you are presented with a second door that uses a slightly more inspired security mechanism. Clearly unimpressed by the last version (in what movie is the password decrypted in order?!), the Easter Bunny engineers have worked out a better solution.

Instead of simply filling in the password from left to right, the hash now also indicates the position within the password to fill. You still look for hashes that begin with five zeroes; however, now, the sixth character represents the position (0-7), and the seventh character is the character to put in that position.

A hash result of 000001f means that f is the second character in the password. Use only the first result for each position, and ignore invalid positions.

For example, if the Door ID is abc:

The first interesting hash is from abc3231929, which produces 0000015...; so, 5 goes in position 1: _5______.
In the previous method, 5017308 produced an interesting hash; however, it is ignored, because it specifies an invalid position (8).
The second interesting hash is at index 5357525, which produces 000004e...; so, e goes in position 4: _5__e___.

You almost choke on your popcorn as the final character falls into place, producing the password 05ace8e3.

Given the actual Door ID and this new method, what is the password? Be extra proud of your solution if it uses a cinematic "decrypting" animation.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function solveMD5Hash (part, inputStr, DEBUG = false) {

  // REFERENCE
  // https://en.wikipedia.org/wiki/MD5
  // https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript
  // https://www.geeksforgeeks.org/node-js-crypto-createhash-method/

  // CONSTANTS
  const CRYPTO = require('crypto');
  const SECRET_KEY = inputStr;
  const NUM_ZEROES = 5;
  const LIMIT = Number.MAX_SAFE_INTEGER;                                                    // this shouldn't happen but it's safer than an infinite loop
                                
  // INIT
  const password = part === 1 ? []
                              : Array(8).fill(null);
  
  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  for (let num = 0; num < LIMIT; ++num) {
    const hash = CRYPTO.createHash('md5')                                                   // get hash based on 'md5' encryption and key; return as hex
                        .update(SECRET_KEY + num)                                           // construct key from secret key concatenated with decimal
                        .digest('hex');

    if (hash.slice(0, NUM_ZEROES) === '0'.repeat(NUM_ZEROES)) {                             // check if hash begins with required number of leading zeroes
      
      if (part === 1) {                                                                     // PART 1: THE CHAR AFTER LEADING ZEROES IS THE NEXT CHAR
        password.push(hash[NUM_ZEROES]);
      } else if (hash[NUM_ZEROES] < 8 && password[hash[NUM_ZEROES]] === null) {             // PART 2: THE CHAR AFTER LEADING ZEROES IS THE INDEX; THE ONE AFTER IS THE CHAR THAT GOES THERE. USE ONLY THE FIRST ANSWER.
        password[hash[NUM_ZEROES]] = hash[NUM_ZEROES + 1];
      } else {
        continue;
      }

      if (DISPLAY_EXTRA_INFO) {
        console.log(`PASSWORD SO FAR: ${
          password.map(c => c === null ? '_' : c).join('')
        }`);
      }

      if (password.length === 8 && !password.includes(null)) {
        console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
        return password.join('');
      }
    }
  }

  throw `ERROR: REACHED LIMIT ${LIMIT}`;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = solveMD5Hash;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([ 1, 2, 3 ]);
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
expected = '18f47a30';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = '2414bc77';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '05ace8e3';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = '437e60fc';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);