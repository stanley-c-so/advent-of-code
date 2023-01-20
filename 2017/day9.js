/*

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function parseNestedObjectsAndGarbage (part, inputStr, DEBUG = false) {
  
  // STATE VARIABLES
  const containerStack = [  ];
  let currentContainer = null;
  let inGarbage = false;
  let currentGarbageStr = '';

  // PARSE INPUT DATA TO GET OBJECT REPRESENTATION
  for (let i = 0; i < inputStr.length; ++i) {

    const c = inputStr[i];

    if (c === '{') {                                                                        // GROUP OPENING TAG
      if (!inGarbage) {
        const newContainer = [];
        if (currentContainer) currentContainer.push(newContainer);
        containerStack.push(newContainer);
        currentContainer = newContainer;
      }
      else currentGarbageStr += c;
    }

    else if (c === '}') {                                                                   // GROUP CLOSING TAG
      if (!inGarbage) {
        const poppedContainer = containerStack.pop();
        currentContainer = containerStack.length  ? containerStack.at(-1)                   // RECURSIVE CASE: focus on container of poppedContainer
                                                  : poppedContainer;                        // BASE CASE: focus on poppedContainer itself
      }
      else currentGarbageStr += c;
    }

    else if (c === '<') {                                                                   // GARBAGE OPENING TAG
      if (!inGarbage) inGarbage = true;                                                     // if not in garbage, start new garbage string
      else currentGarbageStr += c;                                                          // else, add < to garbage string
    }
    
    else if (c === '>') {                                                                   // GARBAGE CLOSING TAG
      if (!inGarbage) throw `ERROR: SHOULD NOT GET CHARACTER ${c} IF NOT IN GARBAGE`;
      inGarbage = false;
      currentContainer.push(currentGarbageStr);
      currentGarbageStr = '';
    }

    else if (c === '!') {                                                                   // EXCLAMATION MARK
      if (!inGarbage) throw `ERROR: SHOULD NOT GET CHARACTER ${c} IF NOT IN GARBAGE`;
      ++i;                                                                                  // skip next character
    }

    else if (c === ',') {                                                                   // COMMA
      if (inGarbage) currentGarbageStr += c;                                                // if in garbage, add , to garbage string
                                                                                            // else, no-op
    }

    else {                                                                                  // ANY OTHER CHARACTER
      if (!inGarbage) throw `ERROR: SHOULD NOT GET CHARACTER ${c} IF NOT IN GARBAGE`;
      currentGarbageStr += c;
    }
  }

  if (containerStack.length) {
    console.log(containerStack);
    throw `ERROR: CONTAINER STACK LENGTH SHOULD BE 0 INSTEAD OF ${containerStack.length}`;
  }

  if (DISPLAY_EXTRA_INFO && DEBUG) {
    console.log(currentContainer);
  }

  // RECURSIVELY ANALYZE OBJECT REPRESENTATION OF INPUT
  let score = 0;
  let garbageSize = 0;
  function recurse(group, points) {
    score += points;
    for (const el of group) {
      if (Array.isArray(el)) {
        recurse(el, points + 1);
      } else {
        garbageSize += el.length;
      }
    }
  }
  recurse(currentContainer, 1);

  return part === 1 ? score                                                                 // PART 1: RETURN SCORE FROM CONTAINERS
                    : garbageSize;                                                          // PART 2: RETURN SIZE OF GARBAGE STRINGS
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = parseNestedObjectsAndGarbage;
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
`{}`
);

const sampleInput2 = parseSampleInput(
`{{{}}}`
);

const sampleInput3 = parseSampleInput(
`{{},{}}`
);

const sampleInput4 = parseSampleInput(
`{{{},{},{{}}}}`
);

const sampleInput5 = parseSampleInput(
`{<a>,<a>,<a>,<a>}`
);

const sampleInput6 = parseSampleInput(
`{{<ab>},{<ab>},{<ab>},{<ab>}}`
);

const sampleInput7 = parseSampleInput(
`{{<!!>},{<!!>},{<!!>},{<!!>}}`
);

const sampleInput8 = parseSampleInput(
`{{<a!>},{<a!>},{<a!>},{<ab>}}`
);

const sampleInput9 = parseSampleInput(
`{<>}`
);

const sampleInput10 = parseSampleInput(
`{<random characters>}`
);

const sampleInput11 = parseSampleInput(
`{<<<<>}`
);

const sampleInput12 = parseSampleInput(
`{<{!>}>}`
);

const sampleInput13 = parseSampleInput(
`{<!!>}`
);

const sampleInput14 = parseSampleInput(
`{<!!!>>}`
);

const sampleInput15 = parseSampleInput(
`{<{o"i!a,<{i<a>}`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 16;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 9;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: sampleInput7,
  DEBUG: true,
};
expected = 9;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 1,
  inputStr: sampleInput8,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 14190;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput9,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput10,
  DEBUG: true,
};
expected = 17;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInput11,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: sampleInput12,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 14
input = {
  part: 2,
  inputStr: sampleInput13,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 15
input = {
  part: 2,
  inputStr: sampleInput14,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 16
input = {
  part: 2,
  inputStr: sampleInput15,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 17
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 7053;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);