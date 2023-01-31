/*

--- Day 19: Go With The Flow ---

With the Elves well on their way constructing the North Pole base, you turn your attention back to understanding the inner workings of programming the device.

You can't help but notice that the device's opcodes don't contain any flow control like jump instructions. The device's manual goes on to explain:

"In programs where flow control is required, the instruction pointer can be bound to a register so that it can be manipulated directly. This way, setr/seti can function as absolute jumps, addr/addi can function as relative jumps, and other opcodes can cause truly fascinating effects."

This mechanism is achieved through a declaration like #ip 1, which would modify register 1 so that accesses to it let the program indirectly access the instruction pointer itself. To compensate for this kind of binding, there are now six registers (numbered 0 through 5); the five not bound to the instruction pointer behave as normal. Otherwise, the same rules apply as the last time you worked with this device.

When the instruction pointer is bound to a register, its value is written to that register just before each instruction is executed, and the value of that register is written back to the instruction pointer immediately after each instruction finishes execution. Afterward, move to the next instruction by adding one to the instruction pointer, even if the value in the instruction pointer was just updated by an instruction. (Because of this, instructions must effectively set the instruction pointer to the instruction before the one they want executed next.)

The instruction pointer is 0 during the first instruction, 1 during the second, and so on. If the instruction pointer ever causes the device to attempt to load an instruction outside the instructions defined in the program, the program instead immediately halts. The instruction pointer starts at 0.

It turns out that this new information is already proving useful: the CPU in the device is not very powerful, and a background process is occupying most of its time. You dump the background process' declarations and instructions to a file (your puzzle input), making sure to use the names of the opcodes rather than the numbers.

For example, suppose you have the following program:

#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5

When executed, the following instructions are executed. Each line contains the value of the instruction pointer at the time the instruction started, the values of the six registers before executing the instructions (in square brackets), the instruction itself, and the values of the six registers after executing the instruction (also in square brackets).

ip=0 [0, 0, 0, 0, 0, 0] seti 5 0 1 [0, 5, 0, 0, 0, 0]
ip=1 [1, 5, 0, 0, 0, 0] seti 6 0 2 [1, 5, 6, 0, 0, 0]
ip=2 [2, 5, 6, 0, 0, 0] addi 0 1 0 [3, 5, 6, 0, 0, 0]
ip=4 [4, 5, 6, 0, 0, 0] setr 1 0 0 [5, 5, 6, 0, 0, 0]
ip=6 [6, 5, 6, 0, 0, 0] seti 9 0 5 [6, 5, 6, 0, 0, 9]

In detail, when running this program, the following events occur:

The first line (#ip 0) indicates that the instruction pointer should be bound to register 0 in this program. This is not an instruction, and so the value of the instruction pointer does not change during the processing of this line.
The instruction pointer contains 0, and so the first instruction is executed (seti 5 0 1). It updates register 0 to the current instruction pointer value (0), sets register 1 to 5, sets the instruction pointer to the value of register 0 (which has no effect, as the instruction did not modify register 0), and then adds one to the instruction pointer.
The instruction pointer contains 1, and so the second instruction, seti 6 0 2, is executed. This is very similar to the instruction before it: 6 is stored in register 2, and the instruction pointer is left with the value 2.
The instruction pointer is 2, which points at the instruction addi 0 1 0. This is like a relative jump: the value of the instruction pointer, 2, is loaded into register 0. Then, addi finds the result of adding the value in register 0 and the value 1, storing the result, 3, back in register 0. Register 0 is then copied back to the instruction pointer, which will cause it to end up 1 larger than it would have otherwise and skip the next instruction (addr 1 2 3) entirely. Finally, 1 is added to the instruction pointer.
The instruction pointer is 4, so the instruction setr 1 0 0 is run. This is like an absolute jump: it copies the value contained in register 1, 5, into register 0, which causes it to end up in the instruction pointer. The instruction pointer is then incremented, leaving it at 6.
The instruction pointer is 6, so the instruction seti 9 0 5 stores 9 into register 5. The instruction pointer is incremented, causing it to point outside the program, and so the program ends.

What value is left in register 0 when the background process halts?


--- Part Two ---

A new background process immediately spins up in its place. It appears identical, but on closer inspection, you notice that this time, register 0 started with the value 1.

What value is left in register 0 when this new background process halts?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function peepholeOptimizationVM (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const [ ADDR, ADDI, MULR, MULI, BANR, BANI, BORR, BORI, SETR, SETI, GTIR, GTRI, GTRR, EQIR, EQRI, EQRR, IP ] =
    [ 'addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr', '#ip' ];

  // DATA STRUCTURES
  const INSTRUCTIONS = [];
  const REGISTERS = [ part === 1  ? 0                                                     // PART 1: REGISTER 0 STARTS AS 0
                                  : 1,                                                    // PART 2: REGISTER 0 STARTS AS 1
                      0,
                      0,
                      0,
                      0,
                      0 ];

  // INIT
  // let IP_BINDING = null;
  const IP_BINDING = +inputArr[0].split(' ')[1];
  let IP_VALUE = 0;

  // PARSE INPUT DATA
  for (let i = 1; i < inputArr.length; ++i) {                                             // skip first line
    const line = inputArr[i];
    const split = line.split(' ');
    const opCode = split[0];
    if (opCode === IP) {
      IP_BINDING = +split[1];
    } else {
      const A = +split[1];
      const B = +split[2];
      const C = +split[3];
      INSTRUCTIONS.push([ opCode, A, B, C ]);
    }
  }
  // console.log(INSTRUCTIONS)

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
    // return REGISTERS;
  }

  // WRAP PROGRAM IN A HELPER FUNCTION SO WE DON'T HAVE TO CALL IT IN PART 2 IF WE DON'T WANT TO
  function RUN_ACTUAL_PROGRAM(withPeepholeOptimization) {

    while (0 <= IP_VALUE && IP_VALUE < INSTRUCTIONS.length) {

      if (DISPLAY_EXTRA_INFO
        && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
      ) {
        const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
        console.log(`... ${
          MINS_PASSED
        } mins have passed since beginning this run`);
        console.log(`(currently on instruction ${IP_VALUE})`);
        console.log(`STATE OF REGISTERS:`, REGISTERS);
        NEXT_MIN_TARGET = MINS_PASSED + 1;
      }

      const [ opCode, A, B, C ] = INSTRUCTIONS[IP_VALUE];
      REGISTERS[IP_BINDING] = IP_VALUE;

      if (withPeepholeOptimization && REGISTERS[IP_BINDING] === 2) {

        if (REGISTERS[5] % REGISTERS[2] === 0) {
          REGISTERS[0] += REGISTERS[2];
        }
        REGISTERS[IP_BINDING] = 12 - 1;                                                   // go to 12 - 1, to naturally progress to 12

      }
      else runOpCode(REGISTERS, opCode, A, B, C);

      IP_VALUE = REGISTERS[IP_BINDING];
      ++IP_VALUE;
    }

  }

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;

  if (part === 1) {

    RUN_ACTUAL_PROGRAM(false);
    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return REGISTERS[0];
    
  } else {
    
    // WE CAN EITHER TRY INJECTING PEEPHOLE OPTIMIZATIONS AND RUNNING THE CODE...
    RUN_ACTUAL_PROGRAM(true);
    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return REGISTERS[0];

    // ...OR WE CAN RUN OUR TRANSLATED VERSION OF IT
    let R0 = 0;                                                                           // instruction 34 sets register 0 back to 0 (from 1)
    let R4 = 0;
    let R5 = 0;

    R5 = 11 * 19 * (R5 + 2)**2                                                            // in part 2, R5 gets inflated to a very large number
                    + (16 + (22 * (R4 + 2)))
                    + (32 * (14 * (30 * (29 + (28 * 27)))));                              // should be 10551296 which is 2^16 * 7 * 23

    // for (let R2 = 1; R2 <= R5; ++R2) {
    //   // for (let R3 = 1; R3 <= R5; ++R3) {
    //   //   if (R2 * R3 === R5) {
    //   //     R0 += R2;
    //   //     break;                                                                          // optimization (no higher R3 will work for this R2)
    //   //   }
    //   // }
    //   if (R5 % R2 === 0) {                                                                // further optimization (code is checking for factors)
    //     R0 += R2;
    //   }
    // }

    for (let R2 = 1; R2 <= Math.sqrt(R5); ++R2) {                                         // add factors as pairs as we find them, so search only up to sqrt
      if (R5 % R2 === 0) {
        R0 += R2;                                                                         // always add R2
        if (R2 !== R5 / R2) {                                                             // and as long as R5 is not a perfect square and R2 is its root...
          R0 += R5 / R2;                                                                  // ...we also add the factor corresponding to R2
        }
      }
    }

    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return R0;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = peepholeOptimizationVM;
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
`#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`
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
  inputStr: actualInput,
};
expected = 2040;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 25165632;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);