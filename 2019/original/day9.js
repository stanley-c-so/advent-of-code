// --- Day 9: Sensor Boost ---

// PART 1:

// You've just said goodbye to the rebooted rover and left Mars when you receive a faint distress signal coming from the asteroid belt. It must be the Ceres monitoring station!

// In order to lock on to the signal, you'll need to boost your sensors. The Elves send up the latest BOOST program - Basic Operation Of System Test.

// While BOOST (your puzzle input) is capable of boosting your sensors, for tenuous safety reasons, it refuses to do so until the computer it runs on passes some checks to demonstrate it is a complete Intcode computer.

// Your existing Intcode computer is missing one key feature: it needs support for parameters in relative mode.

// Parameters in mode 2, relative mode, behave very similarly to parameters in position mode: the parameter is interpreted as a position. Like position mode, parameters in relative mode can be read from or written to.

// The important difference is that relative mode parameters don't count from address 0. Instead, they count from a value called the relative base. The relative base starts at 0.

// The address a relative mode parameter refers to is itself plus the current relative base. When the relative base is 0, relative mode parameters and position mode parameters with the same value refer to the same address.

// For example, given a relative base of 50, a relative mode parameter of -7 refers to memory address 50 + -7 = 43.

// The relative base is modified with the relative base offset instruction:

// Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the value is negative) by the value of the parameter.
// For example, if the relative base is 2000, then after the instruction 109,19, the relative base would be 2019. If the next instruction were 204,-34, then the value at address 1985 would be output.

// Your Intcode computer will also need a few other capabilities:

// The computer's available memory should be much larger than the initial program. Memory beyond the initial program starts with the value 0 and can be read or written like any other memory. (It is invalid to try to access memory at a negative address, though.)
// The computer should have support for large numbers. Some instructions near the beginning of the BOOST program will verify this capability.
// Here are some example programs that use these features:

// 109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99 takes no input and produces a copy of itself as output.
// 1102,34915192,34915192,7,4,7,99,0 should output a 16-digit number.
// 104,1125899906842624,99 should output the large number in the middle.
// The BOOST program will ask for a single input; run it in test mode by providing it the value 1. It will perform a series of checks on each opcode, output any opcodes (and the associated parameter modes) that seem to be functioning incorrectly, and finally output a BOOST keycode.

// Once your Intcode computer is fully functional, the BOOST program should report no malfunctioning opcodes when run in test mode; it should only output a single value, the BOOST keycode. What BOOST keycode does it produce?

// PART 2:

// You now have a complete Intcode computer.

// Finally, you can lock on to the Ceres distress signal! You just need to boost your sensors using the BOOST program.

// The program runs in sensor boost mode by providing the input instruction the value 2. Once run, it will boost the sensors automatically, but it might take a few seconds to complete the operation on slower hardware. In sensor boost mode, the program will output a single value: the coordinates of the distress signal.

// Run the BOOST program in sensor boost mode. What are the coordinates of the distress signal?

function boost (part, codeStr, input) {

  // UTILITY FUNCTION: takes a str (or num) and standardizes its format so that the number portion is n digits (default 5) and it keeps its negative sign if applicable
  const numParser = (str, n = 5) => {
    if (typeof str === 'number') str = str.toString();
    const negative = str[0] === '-';
    let rtn = negative ? str.slice(1) : str;
    rtn = rtn.length < n ? '0'.repeat(n - rtn.length) + rtn : rtn;
    if (negative) rtn = '-' + rtn;
    return rtn;
  }

  // HELPER FUNCTION: RUNS THROUGH INPUT INTCODE AND RETURNS ENTIRE OUTPUT
  function runIntcode (code, input) {

    function calculateOperand (n, mode) {                                       // use this helper function to calculate operand based on operand # and mode #
      if (mode === 1) return +clone[i + n];
      const offset = mode === 0 ? 0 : relativeBase;
      const searchIdx = +clone[i + n] + offset;
      if (n === 3) return searchIdx;                                            // operand3 always refers to the write location, so we only need to return that index
      if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);      // if the search index is out of bounds of current clone state, first set that value to 0
      return +clone[searchIdx];
    }

    const clone = [...code];
    const output = [];

    let i = 0;
    let relativeBase = 0;
    while (i < clone.length) {                                                  // we use a while loop because the increment varies depending on a lot of things

      console.log(i, +clone[1000])

      const opcode = clone[i].slice(-2);
      const mode1 = +clone[i].substr(-3, 1);
      const mode2 = +clone[i].substr(-4, 1);
      const mode3 = +clone[i].substr(-5, 1);
      const operand1 = calculateOperand(1, mode1);
      const operand2 = calculateOperand(2, mode2);
      const operand3 = calculateOperand(3, mode3);                              // NOTE: unlike operands 1-2 which could be either an index or absolute value, 3 is ALWAYS an index

      if (opcode === '01') {
        clone[operand3] = numParser(operand1 + operand2);
        console.log(`opcode 01 res: ${numParser(operand1 + operand2)}, operand1: ${operand1}, operand2: ${operand2}`)
        i += 4;
      } else if (opcode === '02') {
        clone[operand3] = numParser(operand1 * operand2);
        i += 4;
      } else if (opcode === '03') {
        const offset = mode1 === 0 ? 0 : relativeBase;
        const searchIdx = +clone[i + 1] + offset;
        if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);    // if the search index is out of bounds of current clone state, first set that value to 0
        clone[searchIdx] = numParser(input);
        i += 2;
      } else if (opcode === '04') {
        console.log(i)
        output.push(operand1);
        i += 2;
      } else if (opcode === '05') {
        if (i === 31) {
          console.log(`clone[63]: ${clone[63]}`)
          throw 'check 31'
        }
        i = operand1 ? operand2 : i + 3;
      } else if (opcode === '06') {
        i = operand1 ? i + 3 : operand2;
      } else if (opcode === '07') {
        clone[operand3] = operand1 < operand2 ? numParser(1) : numParser(0);
        i += 4;
      } else if (opcode === '08') {
        console.log(`opcode 08 res: ${(operand1 === operand2)}, operand1: ${operand1}, operand2: ${operand2}`)
        clone[operand3] = operand1 === operand2 ? numParser(1) : numParser(0);
        i += 4;
      } else if (opcode === '09') {
        relativeBase += operand1;
        i += 2;
      } else if (opcode === '99') {
        if (input === 1 && output.length !== 1) throw 'ERROR!';                 // in this problem specifically, there should only be 1 output. this error should never happen
        return output;
      } else {
        throw 'ERROR! unrecognized opcode';   // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';        // if the while loop terminates prematurely (apart from opcode 99 or 04). this error should never happen
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  return runIntcode(code, input);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = boost;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 4 || 0;
const highestTest = 4 || Infinity;

const actualInput = `1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1101,0,3,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1101,29,0,1010,1102,1,1,1021,1101,0,36,1002,1101,573,0,1026,1101,0,33,1012,1102,1,25,1004,1102,1,38,1000,1102,31,1,1003,1102,23,1,1006,1102,777,1,1028,1102,20,1,1011,1101,0,566,1027,1101,0,27,1009,1101,26,0,1005,1101,0,0,1020,1102,1,37,1014,1101,32,0,1001,1101,0,24,1007,1101,0,35,1018,1101,30,0,1017,1101,0,22,1008,1102,460,1,1023,1101,0,768,1029,1102,1,487,1024,1102,1,34,1013,1102,1,28,1015,1101,0,39,1019,1101,478,0,1025,1101,0,463,1022,1101,21,0,1016,109,9,1208,0,30,63,1005,63,201,1001,64,1,64,1105,1,203,4,187,1002,64,2,64,109,3,1201,-8,0,63,1008,63,24,63,1005,63,227,1001,64,1,64,1106,0,229,4,209,1002,64,2,64,109,-1,2108,32,-8,63,1005,63,245,1106,0,251,4,235,1001,64,1,64,1002,64,2,64,109,-11,2101,0,2,63,1008,63,35,63,1005,63,275,1001,64,1,64,1105,1,277,4,257,1002,64,2,64,109,3,2101,0,-1,63,1008,63,36,63,1005,63,303,4,283,1001,64,1,64,1106,0,303,1002,64,2,64,109,16,21108,40,40,-6,1005,1013,325,4,309,1001,64,1,64,1106,0,325,1002,64,2,64,109,-4,21102,41,1,-4,1008,1011,41,63,1005,63,351,4,331,1001,64,1,64,1105,1,351,1002,64,2,64,109,-15,2102,1,4,63,1008,63,24,63,1005,63,375,1001,64,1,64,1106,0,377,4,357,1002,64,2,64,109,6,1201,-2,0,63,1008,63,25,63,1005,63,403,4,383,1001,64,1,64,1106,0,403,1002,64,2,64,109,8,2102,1,-6,63,1008,63,22,63,1005,63,425,4,409,1106,0,429,1001,64,1,64,1002,64,2,64,109,-1,2108,27,-4,63,1005,63,447,4,435,1106,0,451,1001,64,1,64,1002,64,2,64,109,8,2105,1,2,1105,1,469,4,457,1001,64,1,64,1002,64,2,64,109,5,2105,1,-2,4,475,1001,64,1,64,1106,0,487,1002,64,2,64,109,-33,1202,7,1,63,1008,63,37,63,1005,63,507,1105,1,513,4,493,1001,64,1,64,1002,64,2,64,109,2,2107,25,10,63,1005,63,535,4,519,1001,64,1,64,1106,0,535,1002,64,2,64,109,30,21107,42,41,-9,1005,1016,551,1106,0,557,4,541,1001,64,1,64,1002,64,2,64,109,2,2106,0,0,1001,64,1,64,1105,1,575,4,563,1002,64,2,64,109,-19,1202,-7,1,63,1008,63,32,63,1005,63,601,4,581,1001,64,1,64,1105,1,601,1002,64,2,64,109,-2,1207,-1,27,63,1005,63,619,4,607,1106,0,623,1001,64,1,64,1002,64,2,64,109,2,21101,43,0,6,1008,1014,45,63,1005,63,647,1001,64,1,64,1106,0,649,4,629,1002,64,2,64,109,17,1205,-4,663,4,655,1106,0,667,1001,64,1,64,1002,64,2,64,109,4,1205,-9,683,1001,64,1,64,1106,0,685,4,673,1002,64,2,64,109,-17,21101,44,0,-2,1008,1010,44,63,1005,63,711,4,691,1001,64,1,64,1105,1,711,1002,64,2,64,109,1,21102,45,1,3,1008,1016,42,63,1005,63,735,1001,64,1,64,1105,1,737,4,717,1002,64,2,64,109,-9,1207,1,25,63,1005,63,753,1105,1,759,4,743,1001,64,1,64,1002,64,2,64,109,23,2106,0,1,4,765,1001,64,1,64,1106,0,777,1002,64,2,64,109,-3,1206,-3,789,1105,1,795,4,783,1001,64,1,64,1002,64,2,64,109,-13,2107,25,-4,63,1005,63,815,1001,64,1,64,1105,1,817,4,801,1002,64,2,64,109,-9,21108,46,44,10,1005,1012,833,1105,1,839,4,823,1001,64,1,64,1002,64,2,64,109,-4,1208,10,22,63,1005,63,857,4,845,1105,1,861,1001,64,1,64,1002,64,2,64,109,28,1206,-6,879,4,867,1001,64,1,64,1105,1,879,1002,64,2,64,109,-4,21107,47,48,-3,1005,1019,897,4,885,1105,1,901,1001,64,1,64,4,64,99,21102,27,1,1,21101,915,0,0,1106,0,922,21201,1,14615,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21102,1,942,0,1106,0,922,22101,0,1,-1,21201,-2,-3,1,21101,957,0,0,1105,1,922,22201,1,-1,-2,1106,0,968,22101,0,-2,-2,109,-3,2105,1,0`;

// Test case 1
input = {
  part: 1,
  codeStr: `109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`,
  input: null,
};
expected = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  codeStr: `1102,34915192,34915192,7,4,7,99,0`,
  input: null,
};
expected = [1219070632396864];                                            // the problem only states that this should output a 16-digit number. this is the result i got.
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  codeStr: `104,1125899906842624,99`,
  input: null,
};
expected = [1125899906842624];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  codeStr: actualInput,
  input: 1,
};
expected = [3512778005];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  codeStr: actualInput,
  input: 2,
};
expected = [35920];
test(func, input, expected, testNum, lowestTest, highestTest);