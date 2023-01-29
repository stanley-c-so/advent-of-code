/*

--- Day 16: Chronal Classification ---

As you see the Elves defend their hot chocolate successfully, you go back to falling through time. This is going to become a problem.

If you're ever going to return to your own time, you need to understand how this device on your wrist works. You have a little while before you reach your next destination, and with a bit of trial and error, you manage to pull up a programming manual on the device's tiny screen.

According to the manual, the device has four registers (numbered 0 through 3) that can be manipulated by instructions containing one of 16 opcodes. The registers start with the value 0.

Every instruction consists of four values: an opcode, two inputs (named A and B), and an output (named C), in that order. The opcode specifies the behavior of the instruction and how the inputs are interpreted. The output, C, is always treated as a register.

In the opcode descriptions below, if something says "value A", it means to take the number given as A literally. (This is also called an "immediate" value.) If something says "register A", it means to use the number given as A to read from (or write to) the register with that number. So, if the opcode addi adds register A and value B, storing the result in register C, and the instruction addi 0 7 3 is encountered, it would add 7 to the value contained by register 0 and store the sum in register 3, never modifying registers 0, 1, or 2 in the process.

Many opcodes are similar except for how they interpret their arguments. The opcodes fall into seven general categories:

Addition:

addr (add register) stores into register C the result of adding register A and register B.
addi (add immediate) stores into register C the result of adding register A and value B.

Multiplication:

mulr (multiply register) stores into register C the result of multiplying register A and register B.
muli (multiply immediate) stores into register C the result of multiplying register A and value B.

Bitwise AND:

banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.

Bitwise OR:

borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.

Assignment:

setr (set register) copies the contents of register A into register C. (Input B is ignored.)
seti (set immediate) stores value A into register C. (Input B is ignored.)

Greater-than testing:

gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.

Equality testing:

eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.

Unfortunately, while the manual gives the name of each opcode, it doesn't seem to indicate the number. However, you can monitor the CPU to see the contents of the registers before and after instructions are executed to try to work them out. Each opcode has a number from 0 through 15, but the manual doesn't say which is which. For example, suppose you capture the following sample:

Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]

This sample shows the effect of the instruction 9 2 1 2 on the registers. Before the instruction is executed, register 0 has value 3, register 1 has value 2, and registers 2 and 3 have value 1. After the instruction is executed, register 2's value becomes 2.

The instruction itself, 9 2 1 2, means that opcode 9 was executed with A=2, B=1, and C=2. Opcode 9 could be any of the 16 opcodes listed above, but only three of them behave in a way that would cause the result shown in the sample:

Opcode 9 could be mulr: register 2 (which has a value of 1) times register 1 (which has a value of 2) produces 2, which matches the value stored in the output register, register 2.
Opcode 9 could be addi: register 2 (which has a value of 1) plus value 1 produces 2, which matches the value stored in the output register, register 2.
Opcode 9 could be seti: value 2 matches the value stored in the output register, register 2; the number given for B is irrelevant.

None of the other opcodes produce the result captured in the sample. Because of this, the sample above behaves like three opcodes.

You collect many of these samples (the first section of your puzzle input). The manual also includes a small test program (the second section of your puzzle input) - you can ignore it for now.

Ignoring the opcode numbers, how many samples in your puzzle input behave like three or more opcodes?


--- Part Two ---

Using the samples you collected, work out the number of each opcode and execute the test program (the second section of your puzzle input).

What value is contained in register 0 after executing the test program?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function logicallyConnectNumCodesToOpCodes (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n\r\n\r\n\r\n');
  
  // PARSE INPUT DATA
  const SAMPLES = inputArr[0].split('\r\n\r\n');
  const TEST_PROGRAM = inputArr[1];

  // CONSTANTS
  const [ ADDR, ADDI, MULR, MULI, BANR, BANI, BORR, BORI, SETR, SETI, GTIR, GTRI, GTRR, EQIR, EQRI, EQRR ] =
    [ 'addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr' ];
  const OP_CODES = [ ADDR, ADDI, MULR, MULI, BANR, BANI, BORR, BORI, SETR, SETI, GTIR, GTRI, GTRR, EQIR, EQRI, EQRR ];
  if (OP_CODES.length !== 16) throw `ERROR: MISSING AN INSTRUCTION - ONLY HAVE ${OP_CODES.length}`;

  // DATA STRUCTURES
  const POSSIBILITIES_BY_OP_CODE = {};
  for (const opCode of OP_CODES) POSSIBILITIES_BY_OP_CODE[opCode] = new Set(Array(16).keys());
  const POSSIBILITIES_BY_NUM_CODE = Array.from({length: 16}, () => new Set(OP_CODES));
  const DEDUCED = new Set();

  // HELPER FUNCTION - GIVEN A SET OF REGISTERS, A SPECIFIC OP CODE, AND 3 ARGUMENTS, RUN THE INSTRUCTION
  function runOpCode(REGISTERS, opCode, A, B, C) {
    if (opCode === ADDR) {
      REGISTERS[C] = REGISTERS[A] + REGISTERS[B];
    }
    else if (opCode === ADDI) {
      REGISTERS[C] = REGISTERS[A] + B;
    }
    else if (opCode === MULR) {
      REGISTERS[C] = REGISTERS[A] * REGISTERS[B];
    }
    else if (opCode === MULI) {
      REGISTERS[C] = REGISTERS[A] * B;
    }
    else if (opCode === BANR) {
      REGISTERS[C] = REGISTERS[A] & REGISTERS[B];
    }
    else if (opCode === BANI) {
      REGISTERS[C] = REGISTERS[A] & B;
    }
    else if (opCode === BORR) {
      REGISTERS[C] = REGISTERS[A] | REGISTERS[B];
    }
    else if (opCode === BORI) {
      REGISTERS[C] = REGISTERS[A] | B;
    }
    else if (opCode === SETR) {
      REGISTERS[C] = REGISTERS[A];
    }
    else if (opCode === SETI) {
      REGISTERS[C] = A;
    }
    else if (opCode === GTIR) {
      REGISTERS[C] = A > REGISTERS[B] ? 1 : 0;
    }
    else if (opCode === GTRI) {
      REGISTERS[C] = REGISTERS[A] > B ? 1 : 0;
    }
    else if (opCode === GTRR) {
      REGISTERS[C] = REGISTERS[A] > REGISTERS[B] ? 1 : 0;
    }
    else if (opCode === EQIR) {
      REGISTERS[C] = A === REGISTERS[B] ? 1 : 0;
    }
    else if (opCode === EQRI) {
      REGISTERS[C] = REGISTERS[A] === B ? 1 : 0;
    }
    else if (opCode === EQRR) {
      REGISTERS[C] = REGISTERS[A] === REGISTERS[B] ? 1 : 0;
    }
    else throw `ERROR: UNRECOGNIZED OP CODE ${opCode}`;
    return REGISTERS;
  }

  // HELPER FUNCTION - RUN A SAMPLE INSTRUCTION ON A SAMPLE REGISTER, AND RETURN A SET OF OP CODES THAT MATCH
  function runInstructionWithAllOpCodes(REGISTERS, INSTRUCTION, REGISTERS_TARGET) {

    // INIT
    const MATCHES = new Set();
    const [ _, A, B, C ] = INSTRUCTION;

    // TRY RUNNING ALL 16 OP CODES ON THE INPUT TO SEE WHAT THE STATE WOULD BE, TO CHECK FOR MATCHES
    for (const opCode of OP_CODES) {
      const REGISTERS_COPY = runOpCode([ ...REGISTERS ], opCode, A, B, C);
      if (REGISTERS_COPY.join(', ') === REGISTERS_TARGET) {
        MATCHES.add(opCode)
      }
    }

    return MATCHES;
  }

  // ANALYZE
  if (part === 1) {                                                                     // PART 1: COUNT THE SAMPLES WITH MATCHES
                                                                                        // OF AT LEAST SIZE 3, CONSIDERED
                                                                                        // INDEPENDENTLY

    let samplesWithThreeOrMore = 0;
    for (const sample of SAMPLES) {
      const lines = sample.split('\r\n')
      const REGISTERS = lines[0].slice(lines[0].indexOf('[') + 1).slice(0, -1).split(', ').map(n => +n);
      const REGISTERS_TARGET = lines[2].slice(lines[0].indexOf('[') + 1).slice(0, -1);
      const INSTRUCTION = lines[1].split(' ').map(n => +n);
      if (runInstructionWithAllOpCodes(REGISTERS, INSTRUCTION, REGISTERS_TARGET).size >= 3) {
        ++samplesWithThreeOrMore;
      }
    }
    return samplesWithThreeOrMore;

  } else {                                                                              // PART 2: USE THE MATCH INFORMATION FROM
                                                                                        // THE SAMPLES IN CONJUNCTION TO DEDUCE
                                                                                        // WHICH NUM CODE MAPS TO WHICH OP CODE,
                                                                                        // THEN RUN THE SAMPLE PROGRAM AND GET
                                                                                        // THE RESULT IN REGISTER 0

    for (const sample of SAMPLES) {
      const lines = sample.split('\r\n')
      const REGISTERS = lines[0].slice(lines[0].indexOf('[') + 1).slice(0, -1).split(', ').map(n => +n);
      const REGISTERS_TARGET = lines[2].slice(lines[0].indexOf('[') + 1).slice(0, -1);
      const INSTRUCTION = lines[1].split(' ').map(n => +n);
      const numCode = INSTRUCTION[0];
      const MATCHES = runInstructionWithAllOpCodes(REGISTERS, INSTRUCTION, REGISTERS_TARGET);

      // DELETE ALL MATCHES THAT ARE NOT IN THE NUM CODE'S POSSIBILITY OBJECT
      for (const code of MATCHES) {
        if (!POSSIBILITIES_BY_NUM_CODE[numCode].has(code)) {
          MATCHES.delete(code);
        }
      }

      // IF THERE IS ONLY ONE MATCH, KICK-START A DEDUCTION DFS
      if (MATCHES.size === 1) {
        const stack = [ [ [ ...MATCHES ][0], numCode] ];
        while (stack.length) {
          const [ a, b ] = stack.pop();                                                 // a could be code and b num, or vice versa

          if (DEDUCED.has(a)) continue;
          DEDUCED.add(a);

          const [ num, code ] = isNaN(a) ? [ b, a ] : [ a, b ];
          
          // set the only possibility for code to num
          POSSIBILITIES_BY_OP_CODE[code].clear();
          POSSIBILITIES_BY_OP_CODE[code].add(num);

          // set the only possibility for num to code
          POSSIBILITIES_BY_NUM_CODE[num].clear();
          POSSIBILITIES_BY_NUM_CODE[num].add(code);

          // delete num as a possibility from all other codes
          for (const key in POSSIBILITIES_BY_OP_CODE) {
            if (key !== code) {
              POSSIBILITIES_BY_OP_CODE[key].delete(num);
              if (POSSIBILITIES_BY_OP_CODE[key].size === 1) {                           // if a code only has 1 possibility now...
                stack.push([ key, [ ...POSSIBILITIES_BY_OP_CODE[key] ][0] ]);           // ...push it to the stack
              }
            }
          }

          // delete code as a possibility from all other nums
          POSSIBILITIES_BY_NUM_CODE.forEach((pos, i) => {
            if (i !== num) {
              pos.delete(code);
              if (pos.size === 1) {                                                     // if a num only has 1 possibility now...
                stack.push([ i, [ ...pos ][0] ]);                                       // ...push it to the stack
              }
            }
          });
          
        }
      }

    }

    const OP_CODES_BY_NUM_CODE = POSSIBILITIES_BY_NUM_CODE.map(set => [ ...set ][0]);

    const REGISTERS = [ 0, 0, 0, 0 ];
    for (const line of TEST_PROGRAM.split('\r\n')) {
      const [ numCode, A, B, C ] = line.split(' ').map(n => +n);
      runOpCode(REGISTERS, OP_CODES_BY_NUM_CODE[numCode], A, B, C);
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log('OP CODES IN ORDER OF NUM CODE:', OP_CODES_BY_NUM_CODE.join(' '));
      console.log('FINAL STATE OF REGISTERS:', REGISTERS);
    }
    return REGISTERS[0];
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = logicallyConnectNumCodesToOpCodes;
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
`Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`
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
  inputStr: actualInput,
};
expected = 605;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 653;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);