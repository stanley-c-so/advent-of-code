/*

--- Day 20: Infinite Elves and Infinite Houses ---

To keep the Elves busy, Santa has them deliver some presents by hand, door-to-door. He sends them down a street with infinite houses numbered sequentially: 1, 2, 3, 4, 5, and so on.

Each Elf is assigned a number, too, and delivers presents to houses based on that number:

The first Elf (number 1) delivers presents to every house: 1, 2, 3, 4, 5, ....
The second Elf (number 2) delivers presents to every second house: 2, 4, 6, 8, 10, ....
Elf number 3 delivers presents to every third house: 3, 6, 9, 12, 15, ....
There are infinitely many Elves, numbered starting with 1. Each Elf delivers presents equal to ten times his or her number at each house.

So, the first nine houses on the street end up like this:

House 1 got 10 presents.
House 2 got 30 presents.
House 3 got 40 presents.
House 4 got 70 presents.
House 5 got 60 presents.
House 6 got 120 presents.
House 7 got 80 presents.
House 8 got 150 presents.
House 9 got 130 presents.

The first house gets 10 presents: it is visited only by Elf 1, which delivers 1 * 10 = 10 presents. The fourth house gets 70 presents, because it is visited by Elves 1, 2, and 4, for a total of 10 + 20 + 40 = 70 presents.

What is the lowest house number of the house to get at least as many presents as the number in your puzzle input?


--- Part Two ---

The Elves decide they don't want to visit an infinite number of houses. Instead, each Elf will stop after delivering presents to 50 houses. To make up for it, they decide to deliver presents equal to eleven times their number at each house.

With these changes, what is the new lowest house number of the house to get at least as many presents as the number in your puzzle input?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function findLowestNWithCompatiblePrimeFactorization (part, inputStr, DEBUG = false) {

  // CONSTANTS
  const GOAL = +inputStr;
  const PRESENTS_MULTIPLIER = part === 1  ? 10                                          // PART 1: ELF DELIVERS 10x ITS NUMBER
                                          : 11;                                         // PART 2: ELF DELIVERS 11x ITS NUMBER

  const PART2_GIFT_LIMIT = 50;                                                          // PART 2: ELF ONLY DELIVERS TO FIRST 50 COMPATIBLE HOUSES

  // DATA STRUCTURES
  const PRIMES = new Set();                                                             // stores all discovered primes

  // INIT
  let highestNumberAnalyzed = 1;                                                        // prevents repeat work for any number less than this value

  // HELPER FUNCTION - RETURNS WHETHER GIVEN n > 1 IS PRIME
  function isPrime(n) {
    // QUICK RESULT
    if (PRIMES.has(n)) return true;                                                     // prime already known
    if (n <= highestNumberAnalyzed) return false;                                       // already analyzed this number, and not stored in PRIMES

    // ANALYZE
    highestNumberAnalyzed = Math.max(highestNumberAnalyzed, n);
    for (let i = 2; i <= Math.sqrt(n); ++i) {                                           // try all potential factors from 2 to sqrt, inclusive
      if (n % i === 0) return false;                                                    // if a factor is found, n is not prime
    }
    PRIMES.add(n);                                                                      // else, n is prime, so add it to known primes
    return true;
  }

  // HELPER FUNCTION - GIVEN n > 1, MAKE SURE ALL PRIMES UP TO THAT NUMBER HAVE BEEN DISCOVERED
  function discoverPrimesUpTo(n) {
    for (let i = highestNumberAnalyzed + 1; i <= n; ++i) {                              // start AFTER highest num analyzed
      isPrime(i);                                                                       // call isPrime to ensure found primes get saved to PRIMES
    }
  }

  // HELPER FUNCTION - GIVEN n > 1, GET ITS PRIME FACTORIZATION AS A FREQUENCY OBJECT
  const MEMO = {};                                                                      // NOTE: memoization is critical to solving this quickly!
  function getPrimeFactorization(n) {
    if (!(n in MEMO)) {
      discoverPrimesUpTo(n);
      if (isPrime(n)) MEMO[n] = { [n]: 1 };                                             // if n is prime, the prime factorization is straightforward
      else {                                                                            // if n is composite...
        for (const prime of PRIMES) {
          if (n % prime === 0) {                                                        // ...find the first prime that divides it...
            const recursedResult = getPrimeFactorization(n / prime);                    // ...then divide n by that prime and recurse...
            MEMO[n] = {
              ...recursedResult,                                                        // ...then copy that result...
              [prime]: (recursedResult[prime] || 0) + 1                                 // ...and increment current prime. save into memo
            };
            break;                                                                      // break to escape loop
          }
        }
      }
    }
    return MEMO[n];
  }

  // HELPER FUNCTION - GIVEN A HOUSE NUMBER, CALCULATE HOW MANY PRESENTS IT RECEIVED
  function calculatePresents(house) {
    const primeFactorization = getPrimeFactorization(house);
    const primes = Object.keys(primeFactorization);
    let presents = 0;

    // TRY EVERY PERMUTATION OF QUANTITIES OF CONSTITUENT PRIME FACTORS
    const stack = [ [ 0, [] ] ];
    while (stack.length) {
      const [ i, primesUsed ] = stack.pop();
      const prime = primes[i];

      // BASE CASE
      if (i === primes.length) {
        const elf = primesUsed.reduce((total, qty, i) => total * primes[i]**qty, 1);    // multiply prime factors together to get elf number
        if (house % elf === 0                                                           // if house number is divisible by elf number, gifts will be delivered
            && (part === 1                                                              // PART 1: ELF ALWAYS DELIVERS TO COMPATIBLE HOUSE
            || house <= elf * PART2_GIFT_LIMIT)                                         // PART 2: ELF ONLY DELIVERS TO FIRST 50 COMPATIBLE HOUSES
        ) {
          presents += PRESENTS_MULTIPLIER * elf;
        }
      }

      // RECURSIVE CASE
      else {
        for (let count = 0; count <= primeFactorization[prime]; ++count) {
          stack.push([ i + 1, [...primesUsed, count] ]);
        }
      }
    }

    return presents;
  }

  // ANALYZE
  let max = 0;
  const LIMIT = Number.MAX_SAFE_INTEGER;

  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;

  for (let house = 2; house <= LIMIT; ++house) {                                        // start at 2 because 1 won't have a prime factorization

    if (DISPLAY_EXTRA_INFO
      && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
    ) {
      const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
      console.log(`... ${
        MINS_PASSED
      } mins have passed since beginning this run | CURRENTLY PROCESSING: ${house}`);
      NEXT_MIN_TARGET = MINS_PASSED + 1;
    }

    const presents = calculatePresents(house);

    if (DISPLAY_EXTRA_INFO) {
      if (presents > max) {
        console.log(`HOUSE ${house} RECEIVES ${presents} PRESENTS`);
        max = presents;
      }
    }
    if (presents >= GOAL) {
      console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
      return house;
    }
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  throw 'ERROR: NO SOLUTION FOUND';

  
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findLowestNWithCompatiblePrimeFactorization;
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

// const sampleInput = parseSampleInput(
// ``
// );

// Test case 1
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 776160;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 786240;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);