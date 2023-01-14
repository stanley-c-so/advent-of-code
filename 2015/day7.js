/*

--- Day 7: Some Assembly Required ---

This year, Santa brought little Bobby Tables a set of wires and bitwise logic gates! Unfortunately, little Bobby is a little under the recommended age range, and he needs help assembling the circuit.

Each wire has an identifier (some lowercase letters) and can carry a 16-bit signal (a number from 0 to 65535). A signal is provided to each wire by a gate, another wire, or some specific value. Each wire can only get a signal from one source, but can provide its signal to multiple destinations. A gate provides no signal until all of its inputs have a signal.

The included instructions booklet describes how to connect the parts together: x AND y -> z means to connect wires x and y to an AND gate, and then connect its output to wire z.

For example:

123 -> x means that the signal 123 is provided to wire x.
x AND y -> z means that the bitwise AND of wire x and wire y is provided to wire z.
p LSHIFT 2 -> q means that the value from wire p is left-shifted by 2 and then provided to wire q.
NOT e -> f means that the bitwise complement of the value from wire e is provided to wire f.

Other possible gates include OR (bitwise OR) and RSHIFT (right-shift). If, for some reason, you'd like to emulate the circuit instead, almost all programming languages (for example, C, JavaScript, or Python) provide operators for these gates.

For example, here is a simple circuit:

123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i

After it is run, these are the signals on the wires:

d: 72
e: 507
f: 492
g: 114
h: 65412
i: 65079
x: 123
y: 456

In little Bobby's kit's instructions booklet (provided as your puzzle input), what signal is ultimately provided to wire a?


--- Part Two ---

Now, take the signal you got on wire a, override wire b to that signal, and reset the other wires (including wire a). What new signal is ultimately provided to wire a?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function bitwiseWires (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // PRE-PROCESS INPUT DATA
  const INSTRUCTIONS = {};
  for (const line of inputArr) {
    const [ instruction, wire ] = line.split(' -> ');
    INSTRUCTIONS[wire] = instruction;
  }

  // HELPER FUNCTION
  function getSignal(wire, MEMO) {
    if (!isNaN(wire)) return +wire;                                               // edge case: wire is actually a number
    if (!(wire in MEMO)) {
      const instruction = INSTRUCTIONS[wire];
      const components = instruction.split(' ');

      if (components.length === 1) {                                              // X (number literal, or wire) -> Y
        MEMO[wire] = getSignal(components[0], MEMO);
      }

      else if (components[0] === 'NOT') {                                         // 'NOT'
        const operand = getSignal(components[1], MEMO)
                          .toString(2)
                          .padStart(16, '0');
        let res = '';
        for (const c of operand) res += +(!(+c));
        MEMO[wire] = parseInt(res, 2);
      }

      else {                                                                      // AND, OR, LSHIFT, RSHIFT
        const operandA = getSignal(components[0], MEMO);
        const operandB = getSignal(components[2], MEMO);

        if (components[1] === 'AND')          MEMO[wire] = operandA & operandB;
        else if (components[1] === 'OR')      MEMO[wire] = operandA | operandB;
        else if (components[1] === 'LSHIFT')  MEMO[wire] = operandA << operandB;
        else if (components[1] === 'RSHIFT')  MEMO[wire] = operandA >> operandB;
        else throw `ERROR: UNRECOGNIZED OPERATOR: ${components[1]}`;
      }
    }
    return MEMO[wire];
  }

  // CONSTANTS
  const [ PART1_WIRE, PART2_WIRE ] = extraParam;

  // DATA STRUCTURES
  const PART1_MEMO = {};
  const PART2_MEMO = {};

  // ANALYZE
  for (const wire in INSTRUCTIONS) getSignal(wire, PART1_MEMO);
  
  if (part === 1) {                                                               // PART 1: RUN 1x, RETURN RESULT FOR 'a'
    
    return getSignal(PART1_WIRE, PART1_MEMO);                                     // return result for part 1 memo

  } else {                                                                        // PART 2: RUN, OVERRIDE 'b' WITH RESULT FOR 'a',
                                                                                  // THEN RERUN AND GET NEW RESULT FOR 'a'

    PART2_MEMO[PART2_WIRE] = getSignal(PART1_WIRE, PART1_MEMO);                   // start by overriding wire with part 1 result

    for (const wire in INSTRUCTIONS) getSignal(wire, PART2_MEMO);                 // recalculate all wires with new memo

    return getSignal(PART1_WIRE, PART2_MEMO);                                     // return result for part 2 memo

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = bitwiseWires;
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
`123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: [ 'h', null ],            // arbitrary selection based on sample input
  DEBUG: true,
};
expected = 65412;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: [ 'a', null ],
};
expected = 3176;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: [ 'a', 'b' ],
};
expected = 14710;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);