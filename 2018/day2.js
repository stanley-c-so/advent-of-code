/*

--- Day 2: Inventory Management System ---

You stop falling through time, catch your breath, and check the screen on the device. "Destination reached. Current Year: 1518. Current Location: North Pole Utility Closet 83N10." You made it! Now, to find those anomalies.

Outside the utility closet, you hear footsteps and a voice. "...I'm not sure either. But now that so many people have chimneys, maybe he could sneak in that way?" Another voice responds, "Actually, we've been working on a new kind of suit that would let him fit through tight spaces like that. But, I heard that a few days ago, they lost the prototype fabric, the design plans, everything! Nobody on the team can even seem to remember important details of the project!"

"Wouldn't they have had enough fabric to fill several boxes in the warehouse? They'd be stored together, so the box IDs should be similar. Too bad it would take forever to search the warehouse for two similar box IDs..." They walk too far away to hear any more.

Late at night, you sneak to the warehouse - who knows what kinds of paradoxes you could cause if you were discovered - and use your fancy wrist device to quickly scan every box and produce a list of the likely candidates (your puzzle input).

To make sure you didn't miss any, you scan the likely candidate boxes again, counting the number that have an ID containing exactly two of any letter and then separately counting those with exactly three of any letter. You can multiply those two counts together to get a rudimentary checksum and compare it to what your device predicts.

For example, if you see the following box IDs:

abcdef contains no letters that appear exactly two or three times.
bababc contains two a and three b, so it counts for both.
abbcde contains two b, but no letter appears exactly three times.
abcccd contains three c, but no letter appears exactly two times.
aabcdd contains two a and two d, but it only counts once.
abcdee contains two e.
ababab contains three a and three b, but it only counts once.

Of these box IDs, four of them contain a letter which appears exactly twice, and three of them contain a letter which appears exactly three times. Multiplying these together produces a checksum of 4 * 3 = 12.

What is the checksum for your list of box IDs?


--- Part Two ---

Confident that your list of box IDs is complete, you're ready to find the boxes full of prototype fabric.

The boxes will have IDs which differ by exactly one character at the same position in both strings. For example, given the following box IDs:

abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz

The IDs abcde and axcye are close, but they differ by two characters (the second and fourth). However, the IDs fghij and fguij differ by exactly one character, the third (h and u). Those must be the correct boxes.

What letters are common between the two correct box IDs? (In the example above, this is found by removing the differing character from either ID, producing fgij.)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // ANALYZE
  if (part === 1) {                                                 // PART 1: MULTIPLY NUM WORDS WITH A PAIR AND NUM WORDS WITH A TRIPLE

    let wordsWithAPair = 0;
    let wordsWithATriple = 0;

    for (const line of inputArr) {
      const freq = {};
      for (const c of line) freq[c] = (freq[c] || 0) + 1;
      const freqSet = new Set(Object.values(freq));
      if (freqSet.has(2)) ++wordsWithAPair;
      if (freqSet.has(3)) ++wordsWithATriple;
    }
  
    return wordsWithAPair * wordsWithATriple;
    
  } else {                                                          // PART 2: FIND COMMON PORTION OF TWO STRINGS THAT DIFFER BY 1 CHARACTER

    const LEN = inputArr[0].length;

    for (let i = 0; i < inputArr.length - 1; ++i) {
      for (let j = i + 1; j < inputArr.length; ++j) {

        const [ wordA, wordB ] = [ inputArr[i], inputArr[j] ];

        let output = '';

        for (let idx = 0; idx < LEN; ++idx) {
          if (wordA[idx] === wordB[idx]) output += wordA[idx];
        }

        if (output.length === LEN - 1) {
          console.log(`i = ${i}: ${inputArr[i]}`);
          console.log(`j = ${j}: ${inputArr[j]}`);
          return output;
        }

      }
    }

    throw 'ERROR: NO SOLUTION FOUND';

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
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
`abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab`
);

const sampleInput2 = parseSampleInput(
`abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`
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
expected = 9139;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 'fgij';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 'uqcidadzwtnhsljvxyobmkfyr';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);