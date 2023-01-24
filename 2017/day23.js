/*

--- Day 23: Coprocessor Conflagration ---

You decide to head directly to the CPU and fix the printer from there. As you get close, you find an experimental coprocessor doing so much work that the local programs are afraid it will halt and catch fire. This would cause serious issues for the rest of the computer, so you head in and see what you can do.

The code it's running seems to be a variant of the kind you saw recently on that tablet. The general functionality seems very similar, but some of the instructions are different:

set X Y sets register X to the value of Y.
sub X Y decreases register X by the value of Y.
mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
jnz X Y jumps with an offset of the value of Y, but only if the value of X is not zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
Only the instructions listed above are used. The eight registers here, named a through h, all start at 0.

The coprocessor is currently set to some kind of debug mode, which allows for testing, but prevents it from doing any meaningful work.

If you run the program (your puzzle input), how many times is the mul instruction invoked?


--- Part Two ---

Now, it's time to fix the problem.

The debug mode switch is wired directly to register a. You flip the switch, which makes register a now start at 1 when the program is executed.

Immediately, the coprocessor begins to overheat. Whoever wrote this program obviously didn't choose a very efficient implementation. You'll need to optimize the program if it has any hope of completing before Santa needs that printer working.

The coprocessor's ultimate goal is to determine the final value left in register h once the program completes. Technically, if it had that... it wouldn't even need to run the program.

After setting register a to 1, if the program were to run to completion, what value would be left in register h?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeAndInterpretOptimization (part, inputStr, DEBUG = false) {

  if (part === 1) {                                                                           // PART 1: SIMULATE THE EXERCISE, COUNT
                                                                                              // NUMBER OF TIMES mul WAS INVOKED

    // PARSE INPUT DATA
    const inputArr = inputStr.split('\r\n');
    const SPLIT = inputArr.map(line => line.split(' '));                                      // so we don't have to keep splitting

    // DATA STRUCTURES
    const REGISTERS = {};
    for (const c of 'abcdefgh') REGISTERS[c] = 0;
    if (part === 2) REGISTERS['a'] = 1;

    // INIT
    let numTimesMulCalled = 0;

    // ANALYZE
    const TIME_AT_START = Date.now();
    if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
    let NEXT_MIN_TARGET = 1;
    for (let i = 0; 0 <= i && i < SPLIT.length; ) {

      if (DISPLAY_EXTRA_INFO
        && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
      ) {
        const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
        console.log(`... ${
          MINS_PASSED
        } mins have passed since beginning this run`);
        NEXT_MIN_TARGET = MINS_PASSED + 1;
      }

      const split = SPLIT[i];
      const instruction = split[0];
      const arg1 = isNaN(split[1])  ? (REGISTERS[split[1]] || 0)                              // if arg1 is a register
                                    : +split[1];                                              // if arg1 is a literal
      const arg2 = split.lenghth < 3 ? null : isNaN(split[2]) ? (REGISTERS[split[2]] || 0)    // if arg2 is a register
                                                              : +split[2];                    // if arg2 is a literal

      if (instruction === 'set') {                                                            // SET
        const register = split[1];
        REGISTERS[register] = arg2;
      }
      else if (instruction === 'sub') {                                                       // SUB
        const register = split[1];
        REGISTERS[register] -= arg2;

        if (i === 7) {
          console.log('c:', REGISTERS['c'])
        }
        if (i === 30) {
          console.log('b:', REGISTERS['b'])
          console.log('h:', REGISTERS['h'])
        }
      }
      else if (instruction === 'mul') {                                                       // MUL
        const register = split[1];
        REGISTERS[register] *= arg2;
        ++numTimesMulCalled;
      }
      else if (instruction === 'jnz') {                                                       // JNZ
        if (arg1 !== 0) {                                                                     // note: without this, we would jump 0
                                                                                              // forever and be stuck
          i += arg2;
          continue;
        }
      }

      ++i;
    }

    if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return numTimesMulCalled;

  } else {                                                                                    // PART 2: ANALYZE AND INTERPRET OPTIMIZATION

    // HERE IS MY BREAKDOWN OF WHAT MY INPUT IS REALLY DOING:
    //
    // IN PART 2, a IS SET TO 1 INSTEAD OF 0, SO WE RUN THROUGH LINES (1-INDEXED) 5-8, WHICH SET b TO 106700 AND c TO 123700 (i.e. b + 17000).
    // NOTE THAT c WILL NEVER CHANGE, WHEREAS b WILL INCREASE BY 17 EACH TIME WE REACH LINE 31.
    //
    // EVERY TIME WE ENCOUNTER jnz g X, WE ARE USUALLY TRYING TO COMPARE CERTAIN OTHER VALUES, WHICH ARE USING g AS A TEMPORARY STORE. THESE
    // LINES ARE LIKE "WALLS" THAT WE CANNOT GET PAST AND WILL KEEP LOOPING, UNTIL WE GET g TO EQUAL 0 (i.e. MATCH SOME OTHER VALUE IN THE
    // PREVIOUS LINE). SO, EFFECTIVELY, THERE ARE LOOPS FROM LINES 12-20, 11-24, AND 9-32. WE WILL DISCUSS THESE ONE AT A TIME.
    //
    // LINES 12-20 ARE BASICALLY TRYING TO ENFORCE THAT e MATCHES b. RECALL THAT b WILL BE 106700 PLUS SOME MULTIPLE OF 17. LINE 17 SLOWLY
    // INCREMENTS e UNTIL EVENTUALLY IT WILL MATCH b. HOWEVER, CRITICALLY, NOTE THAT THE FIRST TIME WE ENTERED THIS LOOP, WE CAME FROM
    // LINE 9 WHICH SET f TO 1. WE HAVE AN OPPORTUNITY TO SET f TO 0 ON LINE 16, BUT ONLY IF d TIMES e MATCHES b (SEE NEXT LOOP).
    //
    // LINES 11-20 RUNS THROUGH THE PREVIOUS LOOP UNTIL e MATCHES b. THEN d (WHICH STARTED AT 2 THE FIRST TIME) WILL SLOWLY INCREMENT. WE
    // CANNOT GET PAST THE NEXT WALL UNTIL d MATCHES b (WHICH IS LARGE). SO WE WILL LOOP BACK TO LINE 11, WHERE WE SOON TEST IF d TIMES e
    // (AND e RESETS TO 2 AT LINE 11) MATCHES b. SINCE e WILL COVER EVERY NUMBER FROM 2 TO b - 1 (ACTUALLY e DOES REACH b TO BREAK THROUGH THE
    // WALL AT LINE 20, BUT BY THE TIME e REACHES b ON LINE 17, WE DO NOT HAVE AN OPPORTUNITY TO TEST d TIMES e MATCHING b ON LINE 14, SO
    // FOR PURPOSES OF THIS TEST WE WILL SAY THAT e RANGES FROM 2 TO b - 1), AND d ALSO COVERS EVERY NUMBER FROM 2 TO b - 1, AND IF AT ANY
    // POINT SOME COMBINATION OF d AND e MULTIPLY TO MAKE b THEN f GETS SET TO 0, BUT OTHERWISE IT STAYS AT 1, THEN WE KNOW THAT WHAT f IS
    // REALLY MEASURING IS WHETHER b IS A PRIME, BECAUSE IF b IS A PRIME, THEN NO COMBINATION OF d OR e (EACH RANGING FROM 2 TO b - 1) CAN
    // DIVIDE IT EVENLY, SINCE PRIMES ARE ONLY DIVISIBLE BY 1 AND THEMSELVES. SO, IF b IS A PRIME, f WILL BE 1, ELSE IT WILL BE 0.
    //
    // THEN WE EXAMINE LINES 25-26. IF f, BEING CARRIED THROUGH THE PREVIOUS TWO LOOPS, EVER HIT 0, THEN THAT MEANS b IS COMPOSITE (AGAIN,
    // BECAUSE SOME COMBINATION OF d AND e, BEING NUMBERS BETWEEN 2 TO b - 1, EVENLY DIVIDED b), AND THEREFORE LINE 26 WILL RUN, AND h WILL
    // INCREMENT. ELSE, IF f STAYED AT 1 THE WHOLE TIME, THEN b IS PRIME, SO h WILL NOT INCREMENT. ON LINES 27-30, WE SEE IF b MATCHES c,
    // AND IF SO, WE EXIT THE PROGRAM. SINCE c NEVER CHANGES, AND c IS 123700, AND SINCE b STARTS AT 106700 AND ON LINE 31 IT INCREASES BY 17,
    // THEREFORE THE OUTERMOST LOOP (9-32) SHOULD RUN (123700 - 106700) / 17 + 1 = 1001 TIMES (ONCE FOR EVERY VALUE OF b FROM 106700 TO
    // 123700, INCLUSIVE).
    //
    // THUS, WHAT THIS PROBLEM REALLY BOILS DOWN TO IS: FOR EVERY VALUE, STARTING AT 106700, AND INCREASING BY 17 UNTIL WE REACH 123700,
    // INCLUSIVE, HOW MANY OF THESE ARE COMPOSITE (NOT PRIME)? THAT WILL BE THE VALUE OF h AT THE END OF THE SIMULATION.


    // DATA STRUCTURES
    const PRIMES = new Set();                                                                 // stores all discovered primes

    // INIT
    let highestNumberAnalyzed = 1;                                                            // prevents repeat work for any number less than this value

    // HELPER FUNCTION - RETURNS WHETHER GIVEN n > 1 IS PRIME
    function isPrime(n) {
      // QUICK RESULT
      if (PRIMES.has(n)) return true;                                                         // prime already known
      if (n <= highestNumberAnalyzed) return false;                                           // already analyzed this number, and not stored in PRIMES

      // ANALYZE
      highestNumberAnalyzed = Math.max(highestNumberAnalyzed, n);
      for (let i = 2; i <= Math.sqrt(n); ++i) {                                               // try all potential factors from 2 to sqrt, inclusive
        if (n % i === 0) return false;                                                        // if a factor is found, n is not prime
      }
      PRIMES.add(n);                                                                          // else, n is prime, so add it to known primes
      return true;
    }

    // HELPER FUNCTION - GIVEN n > 1, MAKE SURE ALL PRIMES UP TO THAT NUMBER HAVE BEEN DISCOVERED
    function discoverPrimesUpTo(n) {
      for (let i = highestNumberAnalyzed + 1; i <= n; ++i) {                                  // start AFTER highest num analyzed
        isPrime(i);                                                                           // call isPrime to ensure found primes get saved to PRIMES
      }
    }

    // CONSTANTS DERIVED FROM PEN AND PAPER ANALYSIS OF INPUT
    const INITIAL_C = 123700;                                                                 // note: c never changes
    const INITIAL_B = 106700;
    const INTERVAL = 17;

    let numComposite = 1001;
    for (let b = INITIAL_B; b <= INITIAL_C; b += INTERVAL) {
      discoverPrimesUpTo(b);
      if (isPrime(b)) --numComposite;
    }
    return numComposite;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeAndInterpretOptimization;
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
expected = 4225;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 905;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);