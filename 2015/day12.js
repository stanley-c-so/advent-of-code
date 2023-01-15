/*

--- Day 12: JSAbacusFramework.io ---

Santa's Accounting-Elves need help balancing the books after a recent order. Unfortunately, their accounting software uses a peculiar storage format. That's where you come in.

They have a JSON document which contains a variety of things: arrays ([1,2,3]), objects ({"a":1, "b":2}), numbers, and strings. Your first job is to simply find all of the numbers throughout the document and add them together.

For example:

[1,2,3] and {"a":2,"b":4} both have a sum of 6.
[[[3]]] and {"a":{"b":4},"c":-1} both have a sum of 3.
{"a":[-1,1]} and [-1,{"a":1}] both have a sum of 0.
[] and {} both have a sum of 0.

You will not encounter any strings containing numbers.

What is the sum of all numbers in the document?


--- Part Two ---

Uh oh - the Accounting-Elves have realized that they double-counted everything red.

Ignore any object (and all of its children) which has any property with the value "red". Do this only for objects ({...}), not arrays ([...]).

[1,2,3] still has a sum of 6.
[1,{"c":"red","b":2},3] now has a sum of 4, because the middle object is ignored.
{"d":"red","e":[1,2,3,4],"f":5} now has a sum of 0, because the entire structure is ignored.
[1,"red",5] has a sum of 6, because "red" in an array has no effect.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function parseJSON (part, inputStr, DEBUG = false) {
  
  // HELPER FUNCTION
  function parse(inputStr) {

    // EDGE CASES
    if (!inputStr) return '';                                                                 // empty input
    if (![ '[', '{' ].includes(inputStr[0])) return isNaN(inputStr) ? inputStr : +inputStr;   // feed in string/number primitive

    // STATE VARIABLES
    const containerStack = [];                                                                // tracks nested arrays/objects
    const keyStack = [];                                                                      // tracks keys for object entries with nested values
    let currNum = '';
    let currStr = '';
    let currKey = '';
    let poppedContainer = null;                                                               // keep reference to most recently processed container
    let inStr = false;                                                                        // for when we are between quotation marks

    // UTILITY FUNCTION: REACHED COMMA OR END OF CONTAINER, SO PROCESS THE MOST RECENT PARSED ELEMENT
    function processElement() {

      // sanity check
      if (!containerStack.length) {
        throw 'ERROR: CONTAINER STACK SHOULD NOT BE EMPTY WHEN HITTING CONTAINER-CLOSING CHARACTER';
      }

      // add element to container if it is not null
      const container = containerStack.at(-1);
      const element = currNum !== '' ? +currNum :
                      currStr ? currStr :
                      poppedContainer;
      if (element !== null) {
        if (Array.isArray(container)) container.push(element);
        else container[currKey || keyStack.pop()] = element;
      }

      // reset state
      currKey = '';
      currNum = '';
      currStr = '';
      poppedContainer = null;
    }

    // PARSE INPUT STRING
    for (const c of inputStr) {

      // OPEN NEW CONTAINER
      if ([ '[', '{' ].includes(c)) {
        if (currKey) {                                                                        // if there is a key...
          keyStack.push(currKey);                                                             // ...push it to the key stack...
          currKey = '';                                                                       // ...and reset currKey
        }
        if (c === '[') containerStack.push([]);                                               // push appropriate container type into container stack
        if (c === '{') containerStack.push({});
      }

      // PROCESS ELEMENT AND CLOSE CONTAINER
      else if ([ ']', '}' ].includes(c)) {
        processElement();
        if (containerStack.length === 1) return containerStack.at(-1);                        // outermost container is done, so return it
        poppedContainer = containerStack.pop();
      }

      // QUESTION MARK: TOGGLE inStr
      else if (c === '"') {
        inStr = !inStr;
      }

      // COLON: SAVE currKey (AND RESET currStr)
      else if (c === ':') {
        currKey = currStr;
        currStr = '';
      }

      // COMMA: PROCESS ELEMENT
      else if (c === ',' && !inStr) {
        processElement();
      }

      // PARSE NUMBER OR LETTER
      else {
        if (inStr) currStr += c;
        else currNum += c;
      }

    }
  }

  // CONVERT INPUT JSON INTO ACTUAL OBJECT
  const OBJ = parse(inputStr);

  // HELPER FUNCTION: ITERATE THROUGH OBJECT AND ADD UP NUMBERS
  function count(obj) {
    if (typeof obj === 'object') {
      let total = 0;
      if (Array.isArray(obj)) {                                                               // CASE: ARRAY
        for (const el of obj) total += count(el);
      }
      else {                                                                                  // CASE: OBJECT
        if (part === 2                                                                        // PART 2: DISREGARD ANY OBJECTS WITH VALUE 'red' AND THEIR CHILDREN
            && !Object.values(obj).every(val => val !== 'red')
        ) {
          return 0;
        }
        for (const key in obj) {
          total += count(obj[key]);
        }
      }
      return total;
    }
    else if (!isNaN(obj)) return obj;                                                         // CASE: NUMBER
    else return 0;                                                                            // CASE: STRING
  }

  return count(OBJ);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = parseJSON;
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
`[1,2,3]`
);

const sampleInput2 = parseSampleInput(
`{"a":2,"b":4}`
);

const sampleInput3 = parseSampleInput(
`[[[3]]]`
);

const sampleInput4 = parseSampleInput(
`{"a":{"b":4},"c":-1}`
);

const sampleInput5 = parseSampleInput(
`{"a":[-1,1]}`
);

const sampleInput6 = parseSampleInput(
`[-1,{"a":1}]`
);

const sampleInput7 = parseSampleInput(
`[]`
);

const sampleInput8 = parseSampleInput(
`{}`
);

const sampleInput9 = parseSampleInput(
`[1,{"c":"red","b":2},3]`
);

const sampleInput10 = parseSampleInput(
`{"d":"red","e":[1,2,3,4],"f":5}`
);

const sampleInput11 = parseSampleInput(
`[1,"red",5]`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 6;
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
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: sampleInput7,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 1,
  inputStr: sampleInput8,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 191164;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput9,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInput10,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: sampleInput11,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 14
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 87842;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);