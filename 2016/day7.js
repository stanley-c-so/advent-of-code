/*

--- Day 7: Internet Protocol Version 7 ---

While snooping around the local network of EBHQ, you compile a list of IP addresses (they're IPv7, of course; IPv6 is much too limited). You'd like to figure out which IPs support TLS (transport-layer snooping).

An IP supports TLS if it has an Autonomous Bridge Bypass Annotation, or ABBA. An ABBA is any four-character sequence which consists of a pair of two different characters followed by the reverse of that pair, such as xyyx or abba. However, the IP also must not have an ABBA within any hypernet sequences, which are contained by square brackets.

For example:

abba[mnop]qrst supports TLS (abba outside square brackets).
abcd[bddb]xyyx does not support TLS (bddb is within square brackets, even though xyyx is outside square brackets).
aaaa[qwer]tyui does not support TLS (aaaa is invalid; the interior characters must be different).
ioxxoj[asdfgh]zxcvbn supports TLS (oxxo is outside square brackets, even though it's within a larger string).

How many IPs in your puzzle input support TLS?


--- Part Two ---

You would also like to know which IPs support SSL (super-secret listening).

An IP supports SSL if it has an Area-Broadcast Accessor, or ABA, anywhere in the supernet sequences (outside any square bracketed sections), and a corresponding Byte Allocation Block, or BAB, anywhere in the hypernet sequences. An ABA is any three-character sequence which consists of the same character twice with a different character between them, such as xyx or aba. A corresponding BAB is the same characters but in reversed positions: yxy and bab, respectively.

For example:

aba[bab]xyz supports SSL (aba outside square brackets with corresponding bab within square brackets).
xyx[xyx]xyx does not support SSL (xyx, but no corresponding yxy).
aaa[kek]eke supports SSL (eke in supernet with corresponding kek in hypernet; the aaa sequence is not related, because the interior character must be different).
zazbz[bzb]cdb supports SSL (zaz has no corresponding aza, but zbz has a corresponding bzb, even though zaz and zbz overlap).

How many IPs in your puzzle input support SSL?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeStrForPattern (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // UTILITY FUNCTIONS
  function containsABBA(str) {
    for (let i = 0; i < str.length - 3; ++i) {
      if (str[i] === str[i + 3]
          && str[i + 1] === str[i + 2]
          && str[i] !== str[i + 1]
      ) {
        return true;      
      }
    }
    return false;
  }

  function containsABA(str) {
    let res = false;
    const sequences = [];

    for (let i = 0; i < str.length - 2; ++i) {
      if (str[i] === str[i + 2]
          && str[i] !== str[i + 1]
      ) {
        res = true;
        sequences.push(str.slice(i, i + 3));
      }
    }
    return { res, sequences };
  }

  // INIT
  let supportedIPs = 0;

  // ANALYZE
  for (const line of inputArr) {

    // part 1
    let regularSequencesContainsABBA = false;
    let hypernetSequencesContainsABBA = false;

    // part 2
    const ABA = new Set();
    const BAB = new Set();

    let currentSequence = '';

    for (const c of line + ' ') {
      if ('[] '.includes(c)) {
        if (c === ']') {                                                      // end of hypernet sequence

          if (part === 1 && containsABBA(currentSequence)) {                  // PART 1: look for any occurrence of ABBA
            hypernetSequencesContainsABBA = true;
            break;                                                            // as soon as any is found, we can break immediately
          }

          if (part === 2) {                                                   // PART 2: look for all occurrences of BAB
            const { res, sequences } = containsABA(currentSequence);
            if (res) {
              for (const sequence of sequences) {
                BAB.add(sequence);
              }
            }
          }

        } else {                                                              // end of regular sequence

          if (part === 1 && containsABBA(currentSequence)) {                  // PART 1: look for any occurrence of ABBA
            regularSequencesContainsABBA = true;
          }

          if (part === 2) {                                                   // PART 2: look for all occurrences of ABA
            const { res, sequences } = containsABA(currentSequence);
            if (res) {
              for (const sequence of sequences) {
                ABA.add(sequence);
              }
            }
          }

        }

        currentSequence = '';
      }
      else currentSequence += c;
    }

    if (part === 1) {                                                           // PART 1: ANALYZE FOR ABBA

      if (regularSequencesContainsABBA && !hypernetSequencesContainsABBA) {
        ++supportedIPs;
      }

    } else {                                                                    // PART 2: ANALYZE FOR ABA AND BAB COMPLEMENT
  
      for (const sequence of ABA) {
        const complement = `${sequence[1]}${sequence[0]}${sequence[1]}`;
        if (BAB.has(complement)) {
          ++supportedIPs;
          break;
        }
      }
  
    }
  }

  return supportedIPs;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeStrForPattern;
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
`abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`
);

const sampleInput2 = parseSampleInput(
`aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb`
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
expected = 115;
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