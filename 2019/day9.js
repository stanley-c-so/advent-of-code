/*

--- Day 9: Sensor Boost ---

You've just said goodbye to the rebooted rover and left Mars when you receive a faint distress signal coming from the asteroid belt. It must be the Ceres monitoring station!

In order to lock on to the signal, you'll need to boost your sensors. The Elves send up the latest BOOST program - Basic Operation Of System Test.

While BOOST (your puzzle input) is capable of boosting your sensors, for tenuous safety reasons, it refuses to do so until the computer it runs on passes some checks to demonstrate it is a complete Intcode computer.

Your existing Intcode computer is missing one key feature: it needs support for parameters in relative mode.

Parameters in mode 2, relative mode, behave very similarly to parameters in position mode: the parameter is interpreted as a position. Like position mode, parameters in relative mode can be read from or written to.

The important difference is that relative mode parameters don't count from address 0. Instead, they count from a value called the relative base. The relative base starts at 0.

The address a relative mode parameter refers to is itself plus the current relative base. When the relative base is 0, relative mode parameters and position mode parameters with the same value refer to the same address.

For example, given a relative base of 50, a relative mode parameter of -7 refers to memory address 50 + -7 = 43.

The relative base is modified with the relative base offset instruction:

Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the value is negative) by the value of the parameter.

For example, if the relative base is 2000, then after the instruction 109,19, the relative base would be 2019. If the next instruction were 204,-34, then the value at address 1985 would be output.

Your Intcode computer will also need a few other capabilities:

The computer's available memory should be much larger than the initial program. Memory beyond the initial program starts with the value 0 and can be read or written like any other memory. (It is invalid to try to access memory at a negative address, though.)
The computer should have support for large numbers. Some instructions near the beginning of the BOOST program will verify this capability.

Here are some example programs that use these features:

109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99 takes no input and produces a copy of itself as output.
1102,34915192,34915192,7,4,7,99,0 should output a 16-digit number.
104,1125899906842624,99 should output the large number in the middle.

The BOOST program will ask for a single input; run it in test mode by providing it the value 1. It will perform a series of checks on each opcode, output any opcodes (and the associated parameter modes) that seem to be functioning incorrectly, and finally output a BOOST keycode.

Once your Intcode computer is fully functional, the BOOST program should report no malfunctioning opcodes when run in test mode; it should only output a single value, the BOOST keycode. What BOOST keycode does it produce?


--- Part Two ---

You now have a complete Intcode computer.

Finally, you can lock on to the Ceres distress signal! You just need to boost your sensors using the BOOST program.

The program runs in sensor boost mode by providing the input instruction the value 2. Once run, it will boost the sensors automatically, but it might take a few seconds to complete the operation on slower hardware. In sensor boost mode, the program will output a single value: the coordinates of the distress signal.

Run the BOOST program in sensor boost mode. What are the coordinates of the distress signal?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function intcode4 (part, inputStr, DEBUG = false) {
  
  const PROGRAM = inputStr.split(',').map(n => +n);

  function runIntcode() {

    // UTILITY FUNCTION THAT TAKES A NUM AND STANDARDIZES ITS FORMAT BY PADDING ITS START AND KEEPING ITS NEGATIVE SIGN
    function numParser(num) {
      const str = String(num);
      const negative = str[0] === '-';
      const paddedNum = (negative ? str.slice(1) : str).padStart(OPCODE_LEN, '0');
      return (negative ? '-' : '') + paddedNum;
    }

    // UTILITY FUNCTION THAT FIGURES OUT THE VALUE OF THE OPERANDS FOLLOWING AN OPCODE
    function calculateOperands(i, opcodeData, opcode) {

      const operands = [];

      for (let n = 1; n <= numArgsByOpcode[opcode]; ++n) {
        if (i + n >= REGISTERS.length) {
          operands.push(null);
          continue;
        }

        const mode = +opcodeData[OPCODE_LEN - 2 - n];

        if (mode === 1) {
          operands.push(REGISTERS[i + n]);
        } else {
          const offset = mode === 0 ? 0 : relativeBase;
          const searchIdx = REGISTERS[i + n] + offset;
          operands.push(n === 3 || opcode === '03'  ? searchIdx                         // opcode '03' operand1, and operand3 generally, always
                                                                                        // refer to the write location, so we only need that index
                                                    : readFromRegisters(searchIdx));
        }
      }

      return operands;
    }

    // UTILITY FUNCTION FOR READING VALUES FROM REGISTERS WHILE HANDLING FOR OUT-OF-BOUNDS INDICES BY EXTENDING REGISTERS
    function readFromRegisters(readIdx) {
      if (readIdx < 0) throw `ERROR: NEGATIVE readIdx ${readIdx}`;
      const currentLen = REGISTERS.length;
      if (readIdx >= currentLen) {
        REGISTERS.length = readIdx + 1;
        for (let idx = currentLen; idx <= readIdx; ++idx) {
          REGISTERS[idx] = 0;
        }
      }
      return REGISTERS[readIdx];
    }

    // UTILITY FUNCTION FOR WRITING VALUES INTO REGISTERS WHILE HANDLING FOR OUT-OF-BOUNDS INDICES BY EXTENDING REGISTERS
    function writeToRegisters(writeIdx, value) {
      if (writeIdx < 0) throw `ERROR: NEGATIVE writeIdx ${writeIdx}`;
      const currentLen = REGISTERS.length;
      if (writeIdx >= currentLen) {
        REGISTERS.length = writeIdx + 1;
        for (let idx = currentLen; idx <= writeIdx; ++idx) {
          REGISTERS[idx] = 0;
        }
      }
      REGISTERS[writeIdx] = value;
    }

    // CONSTANTS
    const OPCODE_LEN = 5;
    const numArgsByOpcode = {
      '01': 3,
      '02': 3,
      '03': 1,
      '04': 1,
      '05': 2,
      '06': 2,
      '07': 3,
      '08': 3,
      '09': 1,
      '99': 0,
    };
    
    // DATA STRUCTURES
    const REGISTERS = [ ...PROGRAM ];
    const OUTPUT = [];

    // INIT
    let i = 0;
    let relativeBase = 0;

    while (i < REGISTERS.length) {

      const opcodeData = numParser(REGISTERS[i]);
      const opcode = opcodeData.slice(-2);
      
      const [ arg1, arg2, arg3 ] = calculateOperands(i, opcodeData, opcode);

      if (opcode === '01') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        const sum = operandA + operandB;

        writeToRegisters(writeIdx, sum);
        i += 4;
      }

      else if (opcode === '02') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        const product = operandA * operandB;

        writeToRegisters(writeIdx, product);
        i += 4;
      }

      else if (opcode === '03') {
        
        const writeIdx = arg1;

        if (writeIdx === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${writeIdx}`;
        }

        // INPUT IS CONTEXTUAL!
        // in this problem, we are told to provide 1 to the only input instruction for part 1, or 2 for part 2.
        const input = part === 1  ? 1
                                  : 2;

        writeToRegisters(writeIdx, input);
        
        i += 2;
      }

      else if (opcode === '04') {

        const readValue = arg1;

        if (readValue === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${readValue}`;
        }

        OUTPUT.push(readValue);

        i += 2;
      }

      else if (opcode === '05') {

        const [ operandA, operandB ] = [ arg1, arg2 ];

        if ([ operandA, operandB ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}`;
        }

        if (operandA) i = operandB;
        else i += 3;

      }

      else if (opcode === '06') {

        const [ operandA, operandB ] = [ arg1, arg2 ];

        if ([ operandA, operandB ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}`;
        }

        if (!operandA) i = operandB;
        else i += 3;

      }

      else if (opcode === '07') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        writeToRegisters(writeIdx, +(operandA < operandB));
        i += 4;
      }

      else if (opcode === '08') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        writeToRegisters(writeIdx, +(operandA === operandB));
        i += 4;
      }

      else if (opcode === '09') {

        const relativeBaseOffset = arg1;

        if (relativeBaseOffset === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${relativeBaseOffset}`;
        }

        relativeBase += relativeBaseOffset;

        i += 2;
      }

      else if (opcode === '99') {
        break;
      }

      else {
        console.log('STATE OF REGISTERS:', REGISTERS);
        throw `ERROR AT INDEX ${i}: UNRECOGNIZED OPCODE ${opcode}`;
      }

    }

    // SANITY CHECKS
    if (!DEBUG && OUTPUT.length !== 1) throw `ERROR: OUTPUT SHOULD HAVE LENGTH 1: ${OUTPUT}`;

    if (DISPLAY_EXTRA_INFO) {
      // console.log('FINAL STATE OF REGISTERS:', REGISTERS);
      console.log('OUTPUT:', OUTPUT);
    }

    // RETURN VALUE IS CONTEXTUAL!
    // in this problem, we want to return the entire output array
    return OUTPUT;

  }

  return runIntcode();
  
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = intcode4;
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
`109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`
);

const sampleInput2 = parseSampleInput(
`1102,34915192,34915192,7,4,7,99,0`
);

const sampleInput3 = parseSampleInput(
`104,1125899906842624,99`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = [ 109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99 ];
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = [ 1219070632396864 ];
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = [ 1125899906842624 ];
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = [ 3512778005 ];
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: actualInput,
};
expected = [ 35920 ];
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);