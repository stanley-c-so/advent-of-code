/*

--- Day 9: Stream Processing ---

A large stream blocks your path. According to the locals, it's not safe to cross the stream at the moment because it's full of garbage. You look down at the stream; rather than water, you discover that it's a stream of characters.

You sit for a while and record part of the stream (your puzzle input). The characters represent groups - sequences that begin with { and end with }. Within a group, there are zero or more other things, separated by commas: either another group or garbage. Since groups can contain other groups, a } only closes the most-recently-opened unclosed group - that is, they are nestable. Your puzzle input represents a single, large group which itself contains many smaller ones.

Sometimes, instead of a group, you will find garbage. Garbage begins with < and ends with >. Between those angle brackets, almost any character can appear, including { and }. Within garbage, < has no special meaning.

In a futile attempt to clean up the garbage, some program has canceled some of the characters within it using !: inside garbage, any character that comes after ! should be ignored, including <, >, and even another !.

You don't see any characters that deviate from these rules. Outside garbage, you only find well-formed groups, and garbage always terminates according to the rules above.

Here are some self-contained pieces of garbage:

<>, empty garbage.
<random characters>, garbage containing random characters.
<<<<>, because the extra < are ignored.
<{!>}>, because the first > is canceled.
<!!>, because the second ! is canceled, allowing the > to terminate the garbage.
<!!!>>, because the second ! and the first > are canceled.
<{o"i!a,<{i<a>, which ends at the first >.

Here are some examples of whole streams and the number of groups they contain:

{}, 1 group.
{{{}}}, 3 groups.
{{},{}}, also 3 groups.
{{{},{},{{}}}}, 6 groups.
{<{},{},{{}}>}, 1 group (which itself contains garbage).
{<a>,<a>,<a>,<a>}, 1 group.
{{<a>},{<a>},{<a>},{<a>}}, 5 groups.
{{<!>},{<!>},{<!>},{<a>}}, 2 groups (since all but the last > are canceled).

Your goal is to find the total score for all groups in your input. Each group is assigned a score which is one more than the score of the group that immediately contains it. (The outermost group gets a score of 1.)

{}, score of 1.
{{{}}}, score of 1 + 2 + 3 = 6.
{{},{}}, score of 1 + 2 + 2 = 5.
{{{},{},{{}}}}, score of 1 + 2 + 3 + 3 + 3 + 4 = 16.
{<a>,<a>,<a>,<a>}, score of 1.
{{<ab>},{<ab>},{<ab>},{<ab>}}, score of 1 + 2 + 2 + 2 + 2 = 9.
{{<!!>},{<!!>},{<!!>},{<!!>}}, score of 1 + 2 + 2 + 2 + 2 = 9.
{{<a!>},{<a!>},{<a!>},{<ab>}}, score of 1 + 2 = 3.

What is the total score for all groups in your input?


--- Part Two ---

Now, you're ready to remove the garbage.

To prove you've removed it, you need to count all of the characters within the garbage. The leading and trailing < and > don't count, nor do any canceled characters or the ! doing the canceling.

<>, 0 characters.
<random characters>, 17 characters.
<<<<>, 3 characters.
<{!>}>, 2 characters.
<!!>, 0 characters.
<!!!>>, 0 characters.
<{o"i!a,<{i<a>, 10 characters.

How many non-canceled characters are within the garbage in your puzzle input?

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
    score += points;                                                                        // add point value of this group to total score
    for (const el of group) {
      if (Array.isArray(el)) {
        recurse(el, points + 1);                                                            // recurse on this group with 1 more point
      } else {
        garbageSize += el.length;                                                           // add length of this garbage string to total garbage size
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