/*

--- Day 24: It Hangs in the Balance ---

It's Christmas Eve, and Santa is loading up the sleigh for this year's deliveries. However, there's one small problem: he can't get the sleigh to balance. If it isn't balanced, he can't defy physics, and nobody gets presents this year.

No pressure.

Santa has provided you a list of the weights of every package he needs to fit on the sleigh. The packages need to be split into three groups of exactly the same weight, and every package has to fit. The first group goes in the passenger compartment of the sleigh, and the second and third go in containers on either side. Only when all three groups weigh exactly the same amount will the sleigh be able to fly. Defying physics has rules, you know!

Of course, that's not the only problem. The first group - the one going in the passenger compartment - needs as few packages as possible so that Santa has some legroom left over. It doesn't matter how many packages are in either of the other two groups, so long as all of the groups weigh the same.

Furthermore, Santa tells you, if there are multiple ways to arrange the packages such that the fewest possible are in the first group, you need to choose the way where the first group has the smallest quantum entanglement to reduce the chance of any "complications". The quantum entanglement of a group of packages is the product of their weights, that is, the value you get when you multiply their weights together. Only consider quantum entanglement if the first group has the fewest possible number of packages in it and all groups weigh the same amount.

For example, suppose you have ten packages with weights 1 through 5 and 7 through 11. For this situation, some of the unique first groups, their quantum entanglements, and a way to divide the remaining packages are as follows:

Group 1;             Group 2; Group 3
11 9       (QE= 99); 10 8 2;  7 5 4 3 1
10 9 1     (QE= 90); 11 7 2;  8 5 4 3
10 8 2     (QE=160); 11 9;    7 5 4 3 1
10 7 3     (QE=210); 11 9;    8 5 4 2 1
10 5 4 1   (QE=200); 11 9;    8 7 3 2
10 5 3 2   (QE=300); 11 9;    8 7 4 1
10 4 3 2 1 (QE=240); 11 9;    8 7 5
9 8 3      (QE=216); 11 7 2;  10 5 4 1
9 7 4      (QE=252); 11 8 1;  10 5 3 2
9 5 4 2    (QE=360); 11 8 1;  10 7 3
8 7 5      (QE=280); 11 9;    10 4 3 2 1
8 5 4 3    (QE=480); 11 9;    10 7 2 1
7 5 4 3 1  (QE=420); 11 9;    10 8 2

Of these, although 10 9 1 has the smallest quantum entanglement (90), the configuration with only two packages, 11 9, in the passenger compartment gives Santa the most legroom and wins. In this situation, the quantum entanglement for the ideal configuration is therefore 99. Had there been two configurations with only two packages in the first group, the one with the smaller quantum entanglement would be chosen.

What is the quantum entanglement of the first group of packages in the ideal configuration?


--- Part Two ---

That's weird... the sleigh still isn't balancing.

"Ho ho ho", Santa muses to himself. "I forgot the trunk".

Balance the sleigh again, but this time, separate the packages into four groups instead of three. The other constraints still apply.

Given the example packages above, this would be some of the new unique first groups, their quantum entanglements, and one way to divide the remaining packages:


11 4    (QE=44); 10 5;   9 3 2 1; 8 7
10 5    (QE=50); 11 4;   9 3 2 1; 8 7
9 5 1   (QE=45); 11 4;   10 3 2;  8 7
9 4 2   (QE=72); 11 3 1; 10 5;    8 7
9 3 2 1 (QE=54); 11 4;   10 5;    8 7
8 7     (QE=56); 11 4;   10 5;    9 3 2 1

Of these, there are three arrangements that put the minimum (two) number of packages in the first group: 11 4, 10 5, and 8 7. Of these, 11 4 has the lowest quantum entanglement, and so it is selected.

Now, what is the quantum entanglement of the first group of packages in the ideal configuration?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function divideGroupsIntoNWithEqualSum (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // HELPER FUNCTION - GIVEN A SET OF NUMBERS, SEE IF IT CAN BE DIVIDED INTO N GROUPS WITH EQUAL SUMS
  const MEMO = {};
  function makeNGroupsEqualAmount(numbers, N) {
    const serial = numbers.join(',');
    if (!(N in MEMO)) MEMO[N] = {};
    if (!(serial in MEMO[N])) {
      const total = numbers.reduce((sum, num) => sum + num);
      if (total % N) return false;
      const goal = total / N;
      const visited = new Set();
      let sum = 0;

      function backtrack(i) {

        if (DISPLAY_EXTRA_INFO
          && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
        ) {
          const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
          console.log(`... ${
            MINS_PASSED
          } mins have passed since beginning this run`);
          NEXT_MIN_TARGET = MINS_PASSED + 1;
        }

        // BASE CASE FAIL: TOO MANY NUMBERS IN SMALLEST GROUP
        if (i === Math.floor(total.length / N)) {
          return false;
        }

        // BASE CASE SUCCESS: FOUND A WAY TO MAKE ONE GROUP WITH CORRECT SUM
        else if (sum === goal) {
          if (N === 2) return true;                                                         // recursing would make N be 1, and this would always be true
          const notPicked = numbers.filter(num => !visited.has(num));
          return makeNGroupsEqualAmount(notPicked, N - 1);
        }

        // RECURSIVE CASE
        else {
          let res = false;
          for (let idx = i; idx < numbers.length; ++idx) {
            const num = numbers[idx];
            if (!visited.has(num)) {
              visited.add(num);
              sum += num;
              if (backtrack(i + 1)) {
                res = true;
                break;
              }
              visited.delete(num);
              sum -= num;
            }
          }
          return res;
        }
      }
      MEMO[N][serial] = backtrack(0);
    }
    else if (DISPLAY_EXTRA_INFO) console.log(`MEMO[${N}] CACHE HIT:`, serial);
    return MEMO[N][serial];
  }

  // CONSTANTS
  const NUMBERS = inputArr.map(n => +n).sort((a, b) => b - a);                              // starting with large numbers tends to
                                                                                            // lead to finding the smallest solutions
                                                                                            // first, which cuts down on minFreq

  const NUMBERS_REVERSED = [ ...NUMBERS ].reverse();                                        // but for the helper function, where you
                                                                                            // just need to find any solution quickly,
                                                                                            // it helps to go in increasing order

  const TOTAL = NUMBERS.reduce((sum, num) => sum + num);
  const NUM_GROUPS = part === 1 ? 3                                                         // PART 1: SPLIT INTO 3 GROUPS
                                : 4;                                                        // PART 2: SPLIT INTO 4 GROUPS
  if (TOTAL % NUM_GROUPS) throw `ERROR: TOTAL ${TOTAL} IS NOT DIVISIBLE BY ${NUM_GROUPS}`;
  const GOAL = TOTAL / NUM_GROUPS;

  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;

  // BACKTRACKING - FIND ALL WAYS OF SPLITTING GIFTS INTO REQUIRED NUMBER OF GROUPS WITH EQUAL SUMS
  const RESULTS = {};
  const visited = new Set();
  let sum = 0;
  let minFreq = Math.floor(NUMBERS.length / NUM_GROUPS);                                    // optimization: find smallest group possible. never need to
                                                                                            // exceed minFreq (and update minFreq is smaller is found)
  let product = 1;
  let minFreqQE = Infinity;

  function backtrack(i, idxLastUsed) {

    if (DISPLAY_EXTRA_INFO
      && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
    ) {
      const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
      console.log(`... ${
        MINS_PASSED
      } mins have passed since beginning this run`);
      NEXT_MIN_TARGET = MINS_PASSED + 1;
    }

    // BASE CASE FAIL: TOO MANY NUMBERS FOR THE SMALLEST GROUP
    if (i > minFreq) return;                                                                // optimization: stop if using more numbers
    // than that of an earlier solution

    // BASE CASE FAIL: CURRENT SUM ALREADY TOO HIGH
    else if (sum > GOAL) return;                                                            // optimization: stop if sum already too large

    // BASE CASE POSSIBLE SUCCESS
    else if (sum === GOAL) {

      // BASE CASE FAIL: CURRENT PRODUCT ALREADY TOO HIGH
      if (visited.size === minFreq && product > minFreqQE) return;                          // optimization: stop if product already too large

      const notPicked = NUMBERS_REVERSED.filter(num => !visited.has(num));                  // optimization: using increasing order tends
                                                                                            // to lead to faster results for purposes of
                                                                                            // the helper function

      const canFormGroupsWithRest = part === 1  ? makeNGroupsEqualAmount(notPicked, 2)      // PART 1: MAKE 2 GROUPS WITH THE REST
                                                : makeNGroupsEqualAmount(notPicked, 3);     // PART 2: MAKE 3 GROUPS WITH THE REST
      if (canFormGroupsWithRest) {

        // if (DISPLAY_EXTRA_INFO && !DEBUG) {
        //   console.log(`FOUND SOLUTION OF SIZE ${visited.size}:`, [ ...visited ]);
        // }

        if (!(visited.size in RESULTS)) RESULTS[visited.size] = [];
        RESULTS[visited.size].push([ ...visited ]);

        if (visited.size <= minFreq) {
          if (visited.size < minFreq || product < minFreqQE) minFreqQE = product;           // update minFreqQE if new minFreq or better QE
          minFreq = Math.min(minFreq, visited.size);                                        // update minFreq for optimization
        }
      }
    }

    // BASE CASE: ONE NUMBER LEFT
    else if (i === minFreq - 1) {                                                           // optimization: if correct number unused, recurse
                                                                                            // one more time, else fail fast
      const remainder = GOAL - sum;
      const idxOfRemainder = NUMBERS.indexOf(remainder);
      if (!visited.has(remainder) && idxOfRemainder !== -1) {
        visited.add(remainder);
        sum += remainder;
        product *= remainder;
        backtrack(i + 1, idxOfRemainder);
        visited.delete(remainder);
        sum -= remainder;
        product /= remainder;
      }
      else return;
    }

    // RECURSIVE CASE
    else {
      for (let idx = idxLastUsed + 1; idx < NUMBERS.length; ++idx) {                      // optimization: don't consider numbers BEFORE idxLastUsed
        const num = NUMBERS[idx];
        if (!visited.has(num)) {
          visited.add(num);
          sum += num;
          product *= num;
          backtrack(i + 1, idx);
          visited.delete(num);
          sum -= num;
          product /= num;
        }
      }
    }
  }
  backtrack(0, -1);                                                                       // kick-start backtracking (idxLastUsed is -1 for none used)

  // ANALYZE BACKTRACKING RESULTS
  if (DISPLAY_EXTRA_INFO) {
    const frequencies = Object.keys(RESULTS).sort((a, b) => a - b);                       // sort to get smallest group
    if (!frequencies.length) throw 'ERROR: NO SOLUTIONS FOUND';
    const OPTIMAL_RESULTS = RESULTS[frequencies[0]];                                      // these results are in the smallest group

    let minQuantumEntanglement = Infinity;                                                // now get the result with the smallest QE
    let bestResult = null;
    for (const result of OPTIMAL_RESULTS) {
      const QE = result.reduce((product, num) => product * num);
      if (QE < minQuantumEntanglement) {
        minQuantumEntanglement = QE;
        bestResult = result;
      }
    }
    bestResult.sort((a, b) => a - b);

    console.log('BEST RESULT:', bestResult,
                '| QE:', bestResult.reduce((product, num) => product * num));
  }

  if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return minFreqQE;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = divideGroupsIntoNWithEqualSum;
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
`1
2
3
4
5
7
8
9
10
11`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 99;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 11846773891;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 44;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 80393059;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);