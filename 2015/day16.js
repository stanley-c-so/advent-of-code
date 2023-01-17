/*

--- Day 16: Aunt Sue ---

Your Aunt Sue has given you a wonderful gift, and you'd like to send her a thank you card. However, there's a small problem: she signed it "From, Aunt Sue".

You have 500 Aunts named "Sue".

So, to avoid sending the card to the wrong person, you need to figure out which Aunt Sue (which you conveniently number 1 to 500, for sanity) gave you the gift. You open the present and, as luck would have it, good ol' Aunt Sue got you a My First Crime Scene Analysis Machine! Just what you wanted. Or needed, as the case may be.

The My First Crime Scene Analysis Machine (MFCSAM for short) can detect a few specific compounds in a given sample, as well as how many distinct kinds of those compounds there are. According to the instructions, these are what the MFCSAM can detect:

children, by human DNA age analysis.
cats. It doesn't differentiate individual breeds.
Several seemingly random breeds of dog: samoyeds, pomeranians, akitas, and vizslas.
goldfish. No other kinds of fish.
trees, all in one group.
cars, presumably by exhaust or gasoline or something.
perfumes, which is handy, since many of your Aunts Sue wear a few kinds.

In fact, many of your Aunts Sue have many of these. You put the wrapping from the gift into the MFCSAM. It beeps inquisitively at you a few times and then prints out a message on ticker tape:

children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1

You make a list of the things you can remember about each Aunt Sue. Things missing from your list aren't zero - you simply don't remember the value.

What is the number of the Sue that got you the gift?


--- Part Two ---

As you're about to send the thank you note, something in the MFCSAM's instructions catches your eye. Apparently, it has an outdated retroencabulator, and so the output from the machine isn't exact values - some of them indicate ranges.

In particular, the cats and trees readings indicates that there are greater than that many (due to the unpredictable nuclear decay of cat dander and tree pollen), while the pomeranians and goldfish readings indicate that there are fewer than that many (due to the modial interaction of magnetoreluctance).

What is the number of the real Aunt Sue?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function guessWho (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const REF = [];
  const SCANNER = {};

  // PARSE INPUT DATA TO PRE-PROCESS REF
  for (const line of inputArr) {
    const compoundsDict = {};
    const compounds = line.slice( line.indexOf(':') + 2 );
    const compoundsList = compounds.split(', ');
    for (const entry of compoundsList) {
      const [ compound, qty ] = entry.split(': ');
      compoundsDict[compound] = +qty;
    }
    REF.push(compoundsDict);
  }

  // PARSE EXTRA PARAM FOR SCANNER DATA TO PRE-PROCESS SCANNER
  const SCANNER_DATA = extraParam.split('\r\n');
  for (const line of SCANNER_DATA) {
    const [ compound, qty ] = line.split(': ');
    SCANNER[compound] = +qty;
  }

  // ANALYZE
  for (let i = 0; i < REF.length; ++i) {
    if (Object.keys(REF[i]).every(compound => {
      if (part === 2 && [ 'cats', 'trees' ].includes(compound)) {                       // PART 2: AUNT NEEDS *MORE* CATS/TREES THAN SCANNER DATA
        return REF[i][compound] > SCANNER[compound];
      }
      else if (part === 2 && [ 'pomeranians', 'goldfish' ].includes(compound)) {        // PART 2: AUNT NEEDS *FEWER* POMERANIANS/GOLDFISH THAN SCANNER DATA
        return REF[i][compound] < SCANNER[compound];
      }
      else {                                                                            // PART 1: AUNT NEEDS TO MATCH SCANNER DATA
        return REF[i][compound] === SCANNER[compound];
      }
    })) {
      if (DISPLAY_EXTRA_INFO) console.log(`Sue ${i + 1}:`, REF[i]);
      return i + 1;                                                                     // aunts are 1-indexed
    }
  }
  throw 'ERROR: NO SOLUTION FOUND';
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = guessWho;
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
  extraParam: parseSampleInput(
`children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1`
  ),
};
expected = 213;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: parseSampleInput(
`children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1`
  ),
};
expected = 323;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);