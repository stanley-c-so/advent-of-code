/*

--- Day 7: Amplification Circuit ---

Based on the navigational maps, you're going to need to send more power to your ship's thrusters to reach Santa in time. To do this, you'll need to configure a series of amplifiers already installed on the ship.

There are five amplifiers connected in series; each one receives an input signal and produces an output signal. They are connected such that the first amplifier's output leads to the second amplifier's input, the second amplifier's output leads to the third amplifier's input, and so on. The first amplifier's input value is 0, and the last amplifier's output leads to your ship's thrusters.

    O-------O  O-------O  O-------O  O-------O  O-------O
0 ->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-> (to thrusters)
    O-------O  O-------O  O-------O  O-------O  O-------O

The Elves have sent you some Amplifier Controller Software (your puzzle input), a program that should run on your existing Intcode computer. Each amplifier will need to run a copy of the program.

When a copy of the program starts running on an amplifier, it will first use an input instruction to ask the amplifier for its current phase setting (an integer from 0 to 4). Each phase setting is used exactly once, but the Elves can't remember which amplifier needs which phase setting.

The program will then call another input instruction to get the amplifier's input signal, compute the correct output signal, and supply it back to the amplifier with an output instruction. (If the amplifier has not yet received an input signal, it waits until one arrives.)

Your job is to find the largest output signal that can be sent to the thrusters by trying every possible combination of phase settings on the amplifiers. Make sure that memory is not shared or reused between copies of the program.

For example, suppose you want to try the phase setting sequence 3,1,2,4,0, which would mean setting amplifier A to phase setting 3, amplifier B to setting 1, C to 2, D to 4, and E to 0. Then, you could determine the output signal that gets sent from amplifier E to the thrusters with the following steps:

Start the copy of the amplifier controller software that will run on amplifier A. At its first input instruction, provide it the amplifier's phase setting, 3. At its second input instruction, provide it the input signal, 0. After some calculations, it will use an output instruction to indicate the amplifier's output signal.
Start the software for amplifier B. Provide it the phase setting (1) and then whatever output signal was produced from amplifier A. It will then produce a new output signal destined for amplifier C.
Start the software for amplifier C, provide the phase setting (2) and the value from amplifier B, then collect its output signal.
Run amplifier D's software, provide the phase setting (4) and input value, and collect its output signal.
Run amplifier E's software, provide the phase setting (0) and input value, and collect its output signal.

The final output signal from amplifier E would be sent to the thrusters. However, this phase setting sequence may not have been the best one; another sequence might have sent a higher signal to the thrusters.

Here are some example programs:

Max thruster signal 43210 (from phase setting sequence 4,3,2,1,0):

3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0

Max thruster signal 54321 (from phase setting sequence 0,1,2,3,4):

3,23,3,24,1002,24,10,24,1002,23,-1,23,
101,5,23,23,1,24,23,23,4,23,99,0,0

Max thruster signal 65210 (from phase setting sequence 1,0,4,3,2):

3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0

Try every combination of phase settings on the amplifiers. What is the highest signal that can be sent to the thrusters?


--- Part Two ---

It's no good - in this configuration, the amplifiers can't generate a large enough output signal to produce the thrust you'll need. The Elves quickly talk you through rewiring the amplifiers into a feedback loop:

      O-------O  O-------O  O-------O  O-------O  O-------O
0 -+->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-.
   |  O-------O  O-------O  O-------O  O-------O  O-------O |
   |                                                        |
   '--------------------------------------------------------+
                                                            |
                                                            v
                                                     (to thrusters)

Most of the amplifiers are connected as they were before; amplifier A's output is connected to amplifier B's input, and so on. However, the output from amplifier E is now connected into amplifier A's input. This creates the feedback loop: the signal will be sent through the amplifiers many times.

In feedback loop mode, the amplifiers need totally different phase settings: integers from 5 to 9, again each used exactly once. These settings will cause the Amplifier Controller Software to repeatedly take input and produce output many times before halting. Provide each amplifier its phase setting at its first input instruction; all further input/output instructions are for signals.

Don't restart the Amplifier Controller Software on any amplifier during this process. Each one should continue receiving and sending signals until it halts.

All signals sent or received in this process will be between pairs of amplifiers except the very first signal and the very last signal. To start the process, a 0 signal is sent to amplifier A's input exactly once.

Eventually, the software on the amplifiers will halt after they have processed the final loop. When this happens, the last output signal from amplifier E is sent to the thrusters. Your job is to find the largest output signal that can be sent to the thrusters using the new phase settings and feedback loop arrangement.

Here are some example programs:

Max thruster signal 139629729 (from phase setting sequence 9,8,7,6,5):

3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5

Max thruster signal 18216 (from phase setting sequence 9,7,8,5,6):

3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10

Try every combination of the new phase settings on the amplifier feedback loop. What is the highest signal that can be sent to the thrusters?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function intcode3 (part, inputStr, DEBUG = false) {
  
  // PARSE INPUT DATA
  const PROGRAM = inputStr.split(',').map(n => +n);

  // DATA STRUCTURES
  const COMPUTER_REGISTERS = Array.from({length: 5}, () => ({ REGISTERS: [ ...PROGRAM ], i: 0, runInputBefore: false }));

  // HELPER FUNCTION - RUNS INTCODE ON A PARTICULAR MACHINE (ampNum) WITH A SPECIFIED INPUT SIGNAL
  function runIntcode(ampNum, inputSignal) {

    const REGISTERS = COMPUTER_REGISTERS[ampNum].REGISTERS;                                                     // supports multiple machine states

    const OPCODE_LEN = 5;

    // INIT
    let i = COMPUTER_REGISTERS[ampNum].i;                                                                       // PART 2: restore i to where it left off
    let lastOpcode = null;                                                                                      // value to be discovered
    let outputSignal = null;                                                                                    // value to be discovered

    while (true) {
      
      const opcodeData = String(REGISTERS[i]).padStart(OPCODE_LEN, '0');
      const opcode = opcodeData.slice(-2);
      lastOpcode = opcode;                                                                                      // store last opcode (for distinguishing
                                                                                                                // between opcode 04 exit and 99 exit)

      const arg1 = i < REGISTERS.length - 1 ? REGISTERS[i + 1] : null;
      const arg2 = i < REGISTERS.length - 2 ? REGISTERS[i + 2] : null;
      const arg3 = i < REGISTERS.length - 3 ? REGISTERS[i + 3] : null;

      if (opcode === '01') {
        const operandA = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];
        const operandB = arg2 === null ? null : opcodeData[OPCODE_LEN - 4] === '1' ? arg2 : REGISTERS[arg2];
        const writeIdx = arg3;

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        const sum = operandA + operandB;
        REGISTERS[writeIdx] = sum;
        i += 4;
      }

      else if (opcode === '02') {
        const operandA = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];
        const operandB = arg2 === null ? null : opcodeData[OPCODE_LEN - 4] === '1' ? arg2 : REGISTERS[arg2];
        const writeIdx = arg3;

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        const product = operandA * operandB;
        REGISTERS[writeIdx] = product;
        i += 4;
      }

      else if (opcode === '03') {
        
        const writeIdx = arg1 === null ? null : arg1;
        
        if (writeIdx === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${writeIdx}`;
        }

        // INPUT IS CONTEXTUAL!
        // in this problem, the first time we run opcode 03, we grab the PHASE_SETTINGS of the current ampNum. the second time, we grab the inputSignal.
        const input = COMPUTER_REGISTERS[ampNum].runInputBefore ? inputSignal                                   // every subsequent time it will be inputSignal
                                                                : PHASE_SETTINGS[ampNum];                       // but the first time it will be phase setting

        COMPUTER_REGISTERS[ampNum].runInputBefore = true;

        REGISTERS[writeIdx] = input;
        
        i += 2;
      }

      else if (opcode === '04') {

        const readValue = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];

        if (readValue === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${readValue}`;
        }

        // OUTPUT IS CONTEXTUAL!
        // in this problem, we are told to treat use the output as the output signal of the amp

        outputSignal = readValue;

        if (part === 1 && ampNum === 4) {                                                                       // PART 1: on ampNum 4, this is the final output
          if (outputSignal > highestSignal) {                                                                   // so check if you have a new highestSignal
            highestSignal = outputSignal;
            bestPhaseSetting = PHASE_SETTINGS.join(',');
          }
        } else {
          COMPUTER_REGISTERS[ampNum].i = i + 2;                                                                 // adjust to start at i + 2 when returning to this amp
          break;
        }
        
        i += 2;
      }

      else if (opcode === '05') {

        const operandA = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];
        const operandB = arg2 === null ? null : opcodeData[OPCODE_LEN - 4] === '1' ? arg2 : REGISTERS[arg2];

        if ([ operandA, operandB ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}`;
        }

        if (operandA) i = operandB;
        else i += 3;

      }

      else if (opcode === '06') {

        const operandA = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];
        const operandB = arg2 === null ? null : opcodeData[OPCODE_LEN - 4] === '1' ? arg2 : REGISTERS[arg2];

        if ([ operandA, operandB ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}`;
        }

        if (!operandA) i = operandB;
        else i += 3;

      }

      else if (opcode === '07') {
        const operandA = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];
        const operandB = arg2 === null ? null : opcodeData[OPCODE_LEN - 4] === '1' ? arg2 : REGISTERS[arg2];
        const writeIdx = arg3;

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        REGISTERS[writeIdx] = +(operandA < operandB);
        i += 4;
      }

      else if (opcode === '08') {
        const operandA = arg1 === null ? null : opcodeData[OPCODE_LEN - 3] === '1' ? arg1 : REGISTERS[arg1];
        const operandB = arg2 === null ? null : opcodeData[OPCODE_LEN - 4] === '1' ? arg2 : REGISTERS[arg2];
        const writeIdx = arg3;

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        REGISTERS[writeIdx] = +(operandA === operandB);
        i += 4;
      }

      else if (opcode === '99') {

        if (part === 2 && inputSignal > highestSignal) {                                                        // if opcode 99, then the final output is
                                                                                                                // from the previous machine (which would
                                                                                                                // be the inputSignal for this machine)
          highestSignal = inputSignal;
          bestPhaseSetting = PHASE_SETTINGS.join(',');
        }

        break;
      }

      else throw `ERROR AT INDEX ${i}: UNRECOGNIZED OPCODE ${opcode}`;

    }

    return {
      opcode99: lastOpcode === '99',                                                                            // can only reach here via opcode 04 or 99
      outputSignal,                                                                                             // outputSignal only relevant if NOT opcode 99
    };

  }

  // INIT
  let highestSignal = -Infinity;
  let bestPhaseSetting = null;

  // INIT BACKTRACKING
  const PHASE_SETTINGS = [];
  const used = new Set();

  // BACKTRACK TO TRY EVERY POSSIBLE PERMUTATION OF PHASE SETTINGS
  function backtrack(i) {

    // BASE CASE
    if (i === 5) {

      COMPUTER_REGISTERS.forEach(computer => {
        computer.REGISTERS = [ ...PROGRAM ];
        computer.i = 0;
        computer.runInputBefore = false;
      });

      let inputSignal = 0;                                                                                      // first inputSignal is always 0

      if (part === 1) {                                                                                         // PART 1: RUN 5 AMPS IN SEQUENCE ONCE

        for (let ampNum = 0; ampNum < 5; ++ampNum) {
          inputSignal = runIntcode(ampNum, inputSignal).outputSignal;
        }

      } else {                                                                                                  // PART 2: RUN 5 AMPS CONTINUOUSLY UNTIL
                                                                                                                // OPCODE 99

        let ampNum = 0;
        while (true) {
          const { opcode99, outputSignal } = runIntcode(ampNum, inputSignal);
          if (opcode99) break;
          ampNum = (ampNum + 1) % 5;
          inputSignal = outputSignal;
        }
        
      }

    }

    // RECURSIVE CASE
    else {
      for ( let ps = part === 1 ? 0
                                : 5;
            part === 1 ?  ps < 5
                       :  ps < 10;
            ++ps
      ) {
        if (!(used.has(ps))) {
          PHASE_SETTINGS.push(ps);
          used.add(ps);
          backtrack(i + 1);
          PHASE_SETTINGS.pop();
          used.delete(ps);
        }
      }
    }

  }
  backtrack(0);

  if (DISPLAY_EXTRA_INFO) {
    console.log(`BEST PHASE SETTING: ${bestPhaseSetting}`);
  }

  return highestSignal;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = intcode3;
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
`3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`
);

const sampleInput2 = parseSampleInput(
`3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`
);

const sampleInput3 = parseSampleInput(
`3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`
);

const sampleInput4 = parseSampleInput(
`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`
);

const sampleInput5 = parseSampleInput(
`3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 43210;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 54321;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 65210;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 255590;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 139629729;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 18216;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 58285150;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);