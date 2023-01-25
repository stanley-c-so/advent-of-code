/*

--- Day 5: Alchemical Reduction ---

You've managed to sneak in to the prototype suit manufacturing lab. The Elves are making decent progress, but are still struggling with the suit's size reduction capabilities.

While the very latest in 1518 alchemical technology might have solved their problem eventually, you can do better. You scan the chemical composition of the suit's material and discover that it is formed by extremely long polymers (one of which is available as your puzzle input).

The polymer is formed by smaller units which, when triggered, react with each other such that two adjacent units of the same type and opposite polarity are destroyed. Units' types are represented by letters; units' polarity is represented by capitalization. For instance, r and R are units with the same type but opposite polarity, whereas r and s are entirely different types and do not react.

For example:

In aA, a and A react, leaving nothing behind.
In abBA, bB destroys itself, leaving aA. As above, this then destroys itself, leaving nothing.
In abAB, no two adjacent units are of the same type, and so nothing happens.
In aabAAB, even though aa and AA are of the same type, their polarities match, and so nothing happens.

Now, consider a larger example, dabAcCaCBAcCcaDA:

dabAcCaCBAcCcaDA  The first 'cC' is removed.
dabAaCBAcCcaDA    This creates 'Aa', which is removed.
dabCBAcCcaDA      Either 'cC' or 'Cc' are removed (the result is the same).
dabCBAcaDA        No further actions can be taken.

After all possible reactions, the resulting polymer contains 10 units.

How many units remain after fully reacting the polymer you scanned? (Note: in this puzzle and others, the input is large; if you copy/paste your input, make sure you get the whole thing.)


--- Part Two ---

Time to improve the polymer.

One of the unit types is causing problems; it's preventing the polymer from collapsing as much as it should. Your goal is to figure out which unit type is causing the most problems, remove all instances of it (regardless of polarity), fully react the remaining polymer, and measure its length.

For example, again using the polymer dabAcCaCBAcCcaDA from above:

Removing all A/a units produces dbcCCBcCcD. Fully reacting this polymer produces dbCBcD, which has length 6.
Removing all B/b units produces daAcCaCAcCcaDA. Fully reacting this polymer produces daCAcaDA, which has length 8.
Removing all C/c units produces dabAaBAaDA. Fully reacting this polymer produces daDA, which has length 4.
Removing all D/d units produces abAcCaCBAcCcaA. Fully reacting this polymer produces abCBAc, which has length 6.

In this example, removing all C/c units was best, producing the answer 4.

What is the length of the shortest polymer you can produce by removing all units of exactly one type and fully reacting the result?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function oneDimensionalCandyCrush (part, inputStr, DEBUG = false) {
  
  // DATA STRUCTURES
  const types = new Set();                                                  // for part 2

  // PARSE INPUT DATA
  for (const c of inputStr) types.add(c.toUpperCase());                     // for part 2
  
  // HELPER FUNCTION - SIMULATES REACTION AND RETURNS LENGTH OF POLYMER
  function react(typeToIgnore) {
    const stack = [];
    for (const c of inputStr) {
      
      if (typeToIgnore
          && c.toUpperCase() === typeToIgnore.toUpperCase()
      ) {
        continue;
      }
      
      else if (stack.length
                  && stack.at(-1) !== c
                  && stack.at(-1).toUpperCase() === c.toUpperCase()
      ) {
        stack.pop();
      }
      
      else {
        stack.push(c);
      }
    }

    return stack.length;
  }

  // ANALYZE
  if (part === 1) {                                                         // PART 1: RUN THE REACTION WITHOUT IGNORING ANY TYPE

    return react(null);

  } else {                                                                  // PART 2: CHOOSE BEST TYPE TO IGNORE TO GET SHORTEST RESULT

    let shortestLength = Infinity;
    let bestTypeToIgnore = null;
    
    for (const c of types) {
      const lengthAfterReaction = react(c);
      if (lengthAfterReaction < shortestLength) {
        shortestLength = lengthAfterReaction;
        bestTypeToIgnore = c;
      }
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log(`BEST TYPE TO IGNORE: ${bestTypeToIgnore}`)
    }
    return shortestLength;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = oneDimensionalCandyCrush;
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
`aA`
);

const sampleInput2 = parseSampleInput(
`abBA`
);

const sampleInput3 = parseSampleInput(
`abAB`
);

const sampleInput4 = parseSampleInput(
`aabAAB`
);

const sampleInput5 = parseSampleInput(
`dabAcCaCBAcCcaDA`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 11298;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 5148;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);