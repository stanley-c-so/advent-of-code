// --- Day XX: DESCRIPTION ---

// PART 1:

//

// PART 2:

//

function NAME_OF_ALGO_HERE (part, INPUT_HERE) {

  // PART 1 VS PART 2
  // if (part === 1) {


    
  // } else {

  

  // }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = 'FUNCTION_NAME_HERE';
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `ACTUAL_INPUT_HERE`;

// Test case 1
input = {
  part: 1,
  ARG_1: `INPUT_HERE`,
};
expected = 'EXPECTED_HERE';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  ARG_1: `INPUT_HERE`,
};
expected = 'EXPECTED_HERE';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  ARG_1: 'INPUT_HERE',
};
expected = `EXPECTED_HERE`;
test(func, input, expected, testNum, lowestTest, highestTest);