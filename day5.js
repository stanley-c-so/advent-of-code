// --- Day 5: Sunny with a Chance of Asteroids ---

// PART 1:

// You're starting to sweat as the ship makes its way toward Mercury. The Elves suggest that you get the air conditioner working by upgrading your ship computer to support the Thermal Environment Supervision Terminal.

// The Thermal Environment Supervision Terminal (TEST) starts by running a diagnostic program (your puzzle input). The TEST diagnostic program will run on your existing Intcode computer after a few modifications:

// First, you'll need to add two new instructions:

// Opcode 3 takes a single integer as input and saves it to the position given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
// Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.
// Programs that use these instructions will come with documentation that explains what should be connected to the input and output. The program 3,0,4,0,99 outputs whatever it gets as input, then halts.

// Second, you'll need to add support for parameter modes:

// Each parameter of an instruction is handled based on its parameter mode. Right now, your ship computer already understands parameter mode 0, position mode, which causes the parameter to be interpreted as a position - if the parameter is 50, its value is the value stored at address 50 in memory. Until now, all parameters have been in position mode.

// Now, your ship computer will also need to handle parameters in mode 1, immediate mode. In immediate mode, a parameter is interpreted as a value - if the parameter is 50, its value is simply 50.

// Parameter modes are stored in the same value as the instruction's opcode. The opcode is a two-digit number based only on the ones and tens digit of the value, that is, the opcode is the rightmost two digits of the first value in an instruction. Parameter modes are single digits, one per parameter, read right-to-left from the opcode: the first parameter's mode is in the hundreds digit, the second parameter's mode is in the thousands digit, the third parameter's mode is in the ten-thousands digit, and so on. Any missing modes are 0.

// For example, consider the program 1002,4,3,4,33.

// The first instruction, 1002,4,3,4, is a multiply instruction - the rightmost two digits of the first value, 02, indicate opcode 2, multiplication. Then, going right to left, the parameter modes are 0 (hundreds digit), 1 (thousands digit), and 0 (ten-thousands digit, not present and therefore zero):

// ABCDE
//  1002

// DE - two-digit opcode,      02 == opcode 2
//  C - mode of 1st parameter,  0 == position mode
//  B - mode of 2nd parameter,  1 == immediate mode
//  A - mode of 3rd parameter,  0 == position mode,
//                                   omitted due to being a leading zero
// This instruction multiplies its first two parameters. The first parameter, 4 in position mode, works like it did before - its value is the value stored at address 4 (33). The second parameter, 3 in immediate mode, simply has value 3. The result of this operation, 33 * 3 = 99, is written according to the third parameter, 4 in position mode, which also works like it did before - 99 is written to address 4.

// Parameters that an instruction writes to will never be in immediate mode.

// Finally, some notes:

// It is important to remember that the instruction pointer should increase by the number of values in the instruction after the instruction finishes. Because of the new instructions, this amount is no longer always 4.
// Integers can be negative: 1101,100,-1,4,0 is a valid program (find 100 + -1, store the result in position 4).
// The TEST diagnostic program will start by requesting from the user the ID of the system to test by running an input instruction - provide it 1, the ID for the ship's air conditioner unit.

// It will then perform a series of diagnostic tests confirming that various parts of the Intcode computer, like parameter modes, function correctly. For each test, it will run an output instruction indicating how far the result of the test was from the expected value, where 0 means the test was successful. Non-zero outputs mean that a function is not working correctly; check the instructions that were run before the output instruction to see which one failed.

// Finally, the program will output a diagnostic code and immediately halt. This final output isn't an error; an output followed immediately by a halt means the program finished. If all outputs were zero except the diagnostic code, the diagnostic program ran successfully.

// After providing 1 to the only input instruction and passing all the tests, what diagnostic code does the program produce?

// PART 2:

// The air conditioner comes online! Its cold air feels good for a while, but then the TEST alarms start to go off. Since the air conditioner can't vent its heat anywhere but back into the spacecraft, it's actually making the air inside the ship warmer.

// Instead, you'll need to use the TEST to extend the thermal radiators. Fortunately, the diagnostic program (your puzzle input) is already equipped for this. Unfortunately, your Intcode computer is not.

// Your computer is only missing a few opcodes:

// Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
// Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
// Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
// Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
// Like all instructions, these instructions need to support parameter modes as described above.

// Normally, after an instruction is finished, the instruction pointer increases by the number of values in that instruction. However, if the instruction modifies the instruction pointer, that value is used and the instruction pointer is not automatically increased.

// For example, here are several programs that take one input, compare it to the value 8, and then produce one output:

// 3,9,8,9,10,9,4,9,99,-1,8 - Using position mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
// 3,9,7,9,10,9,4,9,99,-1,8 - Using position mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
// 3,3,1108,-1,8,3,4,3,99 - Using immediate mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
// 3,3,1107,-1,8,3,4,3,99 - Using immediate mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
// Here are some jump tests that take an input, then output 0 if the input was zero or 1 if the input was non-zero:

// 3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9 (using position mode)
// 3,3,1105,-1,9,1101,0,0,12,4,12,99,1 (using immediate mode)
// Here's a larger example:

// 3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
// 1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
// 999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
// The above example program uses an input instruction to ask for a single number. The program will then output 999 if the input value is below 8, output 1000 if the input value is equal to 8, or output 1001 if the input value is greater than 8.

// This time, when the TEST diagnostic program runs its input instruction to get the ID of the system to test, provide it 5, the ID for the ship's thermal radiator controller. This diagnostic test suite only outputs one number, the diagnostic code.

// What is the diagnostic code for system ID 5?

// SWITCHING BETWEEN SOLUTIONS:
const diagnostic = solution_1;

function solution_1 (part, codeStr, input) {

  // UTILITY FUNCTION: takes a str (or num) and standardizes its format so that the number portion is 4 digits and it keeps its negative sign if applicable
  const numParser = str => {
    if (typeof str === 'number') str = str.toString();
    const negative = str[0] === '-';
    let rtn = negative ? str.slice(1) : str;
    rtn = rtn.length < 4 ? '0'.repeat(4 - rtn.length) + rtn : rtn;
    if (negative) rtn = '-' + rtn;
    return rtn;
  }

  // INGEST DATA
  const code = codeStr.split(',').map(str => numParser(str));

  // HELPER FUNCTION ALLOWS CUSTOM INPUT CODE
  function helper (input) {
    const clone = [...code];
    const output = [];

    let i = 0;
    while (i < clone.length) {                                                            // we use a while loop because the increment varies depending on a lot of things
      const opcode = clone[i].slice(-2);
      const operand1 = +clone[i].substr(-3, 1) ? +clone[i + 1] : +clone[+clone[i + 1]];   // make sure to handle for both position and immediate modes
      const operand2 = +clone[i].substr(-4, 1) ? +clone[i + 2] : +clone[+clone[i + 2]];   // make sure to handle for both position and immediate modes
      const operand3 = +clone[i + 3];                                                     // for every case in which there is an operand3, immediate mode is never used

      if (opcode === '99') {
        break;
      } else if (opcode === '01') {
        clone[operand3] = numParser(operand1 + operand2);
        i += 4;
      } else if (opcode === '02') {
        clone[operand3] = numParser(operand1 * operand2);
        i += 4;
      } else if (opcode === '03') {
        clone[+clone[i + 1]] = numParser(input);              // when opcode === '03', the next number is ALWAYS in position mode, so we can derive that directly without operand1
        i += 2;
      } else if (opcode === '04') {
        output.push(operand1);
        i += 2;
      } else if (opcode === '05') {
        i = operand1 ? operand2 : i + 3;
      } else if (opcode === '06') {
        i = operand1 ? i + 3 : operand2;
      } else if (opcode === '07') {
        clone[operand3] = operand1 < operand2 ? numParser(1) : numParser(0);
        i += 4;
      } else if (opcode === '08') {
        clone[operand3] = operand1 === operand2 ? numParser(1) : numParser(0);
        i += 4;
      } else {
        throw 'ERROR!';   // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    if (!(output.slice(0, output.length - 1).every(num => num === 0))) throw 'ERROR!';    // this makes sure every number except the last is 0. this error should never happen
    return output[output.length - 1];
  }

  return helper(input);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = diagnostic;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `3,225,1,225,6,6,1100,1,238,225,104,0,1102,67,92,225,1101,14,84,225,1002,217,69,224,101,-5175,224,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,1,214,95,224,101,-127,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,1101,8,41,225,2,17,91,224,1001,224,-518,224,4,224,1002,223,8,223,101,2,224,224,1,223,224,223,1101,37,27,225,1101,61,11,225,101,44,66,224,101,-85,224,224,4,224,1002,223,8,223,101,6,224,224,1,224,223,223,1102,7,32,224,101,-224,224,224,4,224,102,8,223,223,1001,224,6,224,1,224,223,223,1001,14,82,224,101,-174,224,224,4,224,102,8,223,223,101,7,224,224,1,223,224,223,102,65,210,224,101,-5525,224,224,4,224,102,8,223,223,101,3,224,224,1,224,223,223,1101,81,9,224,101,-90,224,224,4,224,102,8,223,223,1001,224,3,224,1,224,223,223,1101,71,85,225,1102,61,66,225,1102,75,53,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,8,226,226,224,102,2,223,223,1005,224,329,1001,223,1,223,1108,677,677,224,1002,223,2,223,1006,224,344,101,1,223,223,1007,226,677,224,102,2,223,223,1005,224,359,101,1,223,223,1007,677,677,224,1002,223,2,223,1006,224,374,101,1,223,223,1108,677,226,224,1002,223,2,223,1005,224,389,1001,223,1,223,108,226,677,224,102,2,223,223,1006,224,404,101,1,223,223,1108,226,677,224,102,2,223,223,1005,224,419,101,1,223,223,1008,677,677,224,102,2,223,223,1005,224,434,101,1,223,223,7,677,226,224,1002,223,2,223,1005,224,449,101,1,223,223,1008,226,226,224,102,2,223,223,1005,224,464,1001,223,1,223,107,226,677,224,1002,223,2,223,1006,224,479,1001,223,1,223,107,677,677,224,102,2,223,223,1005,224,494,1001,223,1,223,1008,226,677,224,102,2,223,223,1006,224,509,1001,223,1,223,1107,677,226,224,102,2,223,223,1005,224,524,101,1,223,223,1007,226,226,224,1002,223,2,223,1006,224,539,1001,223,1,223,107,226,226,224,102,2,223,223,1006,224,554,101,1,223,223,108,677,677,224,1002,223,2,223,1006,224,569,1001,223,1,223,7,226,677,224,102,2,223,223,1006,224,584,1001,223,1,223,8,677,226,224,102,2,223,223,1005,224,599,101,1,223,223,1107,677,677,224,1002,223,2,223,1005,224,614,101,1,223,223,8,226,677,224,102,2,223,223,1005,224,629,1001,223,1,223,7,226,226,224,1002,223,2,223,1006,224,644,1001,223,1,223,108,226,226,224,1002,223,2,223,1006,224,659,101,1,223,223,1107,226,677,224,1002,223,2,223,1006,224,674,101,1,223,223,4,223,99,226`;

// Test case 1
input = {
  part: 1,
  codeStr: actualInput,
  input: 1,
};
expected = 5074395;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  codeStr: `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`,
  input: 7,
};
expected = 999;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  codeStr: `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`,
  input: 8,
};
expected = 1000;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  codeStr: `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`,
  input: 9,
};
expected = 1001;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  codeStr: actualInput,
  input: 5,
};
expected = 8346937;
test(func, input, expected, testNum, lowestTest, highestTest);