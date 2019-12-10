// --- Day 7: Amplification Circuit ---

// PART 1:

// Based on the navigational maps, you're going to need to send more power to your ship's thrusters to reach Santa in time. To do this, you'll need to configure a series of amplifiers already installed on the ship.

// There are five amplifiers connected in series; each one receives an input signal and produces an output signal. They are connected such that the first amplifier's output leads to the second amplifier's input, the second amplifier's output leads to the third amplifier's input, and so on. The first amplifier's input value is 0, and the last amplifier's output leads to your ship's thrusters.

//     O-------O  O-------O  O-------O  O-------O  O-------O
// 0 ->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-> (to thrusters)
//     O-------O  O-------O  O-------O  O-------O  O-------O

// The Elves have sent you some Amplifier Controller Software (your puzzle input), a program that should run on your existing Intcode computer. Each amplifier will need to run a copy of the program.

// When a copy of the program starts running on an amplifier, it will first use an input instruction to ask the amplifier for its current phase setting (an integer from 0 to 4). Each phase setting is used exactly once, but the Elves can't remember which amplifier needs which phase setting.

// The program will then call another input instruction to get the amplifier's input signal, compute the correct output signal, and supply it back to the amplifier with an output instruction. (If the amplifier has not yet received an input signal, it waits until one arrives.)

// Your job is to find the largest output signal that can be sent to the thrusters by trying every possible combination of phase settings on the amplifiers. Make sure that memory is not shared or reused between copies of the program.

// For example, suppose you want to try the phase setting sequence 3,1,2,4,0, which would mean setting amplifier A to phase setting 3, amplifier B to setting 1, C to 2, D to 4, and E to 0. Then, you could determine the output signal that gets sent from amplifier E to the thrusters with the following steps:

// Start the copy of the amplifier controller software that will run on amplifier A. At its first input instruction, provide it the amplifier's phase setting, 3. At its second input instruction, provide it the input signal, 0. After some calculations, it will use an output instruction to indicate the amplifier's output signal.
// Start the software for amplifier B. Provide it the phase setting (1) and then whatever output signal was produced from amplifier A. It will then produce a new output signal destined for amplifier C.
// Start the software for amplifier C, provide the phase setting (2) and the value from amplifier B, then collect its output signal.
// Run amplifier D's software, provide the phase setting (4) and input value, and collect its output signal.
// Run amplifier E's software, provide the phase setting (0) and input value, and collect its output signal.
// The final output signal from amplifier E would be sent to the thrusters. However, this phase setting sequence may not have been the best one; another sequence might have sent a higher signal to the thrusters.

// Here are some example programs:

// Max thruster signal 43210 (from phase setting sequence 4,3,2,1,0):

// 3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0
// Max thruster signal 54321 (from phase setting sequence 0,1,2,3,4):

// 3,23,3,24,1002,24,10,24,1002,23,-1,23,
// 101,5,23,23,1,24,23,23,4,23,99,0,0
// Max thruster signal 65210 (from phase setting sequence 1,0,4,3,2):

// 3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
// 1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
// Try every combination of phase settings on the amplifiers. What is the highest signal that can be sent to the thrusters?

// PART 2:

// It's no good - in this configuration, the amplifiers can't generate a large enough output signal to produce the thrust you'll need. The Elves quickly talk you through rewiring the amplifiers into a feedback loop:

//       O-------O  O-------O  O-------O  O-------O  O-------O
// 0 -+->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-.
//    |  O-------O  O-------O  O-------O  O-------O  O-------O |
//    |                                                        |
//    '--------------------------------------------------------+
//                                                             |
//                                                             v
//                                                      (to thrusters)
// Most of the amplifiers are connected as they were before; amplifier A's output is connected to amplifier B's input, and so on. However, the output from amplifier E is now connected into amplifier A's input. This creates the feedback loop: the signal will be sent through the amplifiers many times.

// In feedback loop mode, the amplifiers need totally different phase settings: integers from 5 to 9, again each used exactly once. These settings will cause the Amplifier Controller Software to repeatedly take input and produce output many times before halting. Provide each amplifier its phase setting at its first input instruction; all further input/output instructions are for signals.

// Don't restart the Amplifier Controller Software on any amplifier during this process. Each one should continue receiving and sending signals until it halts.

// All signals sent or received in this process will be between pairs of amplifiers except the very first signal and the very last signal. To start the process, a 0 signal is sent to amplifier A's input exactly once.

// Eventually, the software on the amplifiers will halt after they have processed the final loop. When this happens, the last output signal from amplifier E is sent to the thrusters. Your job is to find the largest output signal that can be sent to the thrusters using the new phase settings and feedback loop arrangement.

// Here are some example programs:

// Max thruster signal 139629729 (from phase setting sequence 9,8,7,6,5):

// 3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
// 27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
// Max thruster signal 18216 (from phase setting sequence 9,7,8,5,6):

// 3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
// -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
// 53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
// Try every combination of the new phase settings on the amplifier feedback loop. What is the highest signal that can be sent to the thrusters?

function findMaxOutput (part, codeStr) {

  // UTILITY FUNCTION: takes a str (or num) and standardizes its format so that the number portion is 4 digits and it keeps its negative sign if applicable
  const numParser = str => {
    if (typeof str === 'number') str = str.toString();
    const negative = str[0] === '-';
    let rtn = negative ? str.slice(1) : str;
    rtn = rtn.length < 4 ? '0'.repeat(4 - rtn.length) + rtn : rtn;
    if (negative) rtn = '-' + rtn;
    return rtn;
  }

  // UTILITY FUNCTIONS: FIND ALL POSSIBLE PERMUTATIONS OF SEQUENCES FROM start...start + n
  function permutationsStr (n, start = 0) {                                                 // builds the permutations as strings
    if (!n) return [];                                                                      // edge case
    if (n === 1) return [start.toString()];                                                 // base case
    const prevSolution = permutationsStr(n - 1, start);                                     // build solution based off of previous solution
    const output = Array.from(
      {length: prevSolution.length * n},                                                    // next solution will be n times the length of the previous
      (_, i) => prevSolution[Math.floor(i / n)].slice(0, i % n) + (start + n - 1) + prevSolution[Math.floor(i / n)].slice(i % n)    // insert current number into every place within previous number block
    );
    return output;
  }

  function permutationsArr (n, start = 0) {
    return permutationsStr(n, start).map(str => str.split('').map(digit => +digit));        // uses string results of permutationsStr and converts them to subarrays of numbers (e.g. '123' to [1, 2, 3])
  }
  
  // HELPER FUNCTION SIMULATES AN AMPLIFIER RUNNING THE PROGRAM BASED ON CODE, PHASE SETTING AND INPUT SIGNAL, AND, OPTIONALLY, STARTING INDEX AND WHETHER PHASE INPUT WAS PREVIOUSLY RECEIVED
  function simulateAmp (code, phase, input, startIdx = 0, phaseInputReceived = false) {     // startIdx and phaseInputReceived optional parameters are useful for part 2
    const clone = [...code];                                                                // we will be working off of a clone of the code, which should not change between different amps
    const output = [];                                                                      // multiple opcode '04' outputs are supported, but in this day's problem, this never exceeds length 1

    let i = startIdx;
    while (i < clone.length) {                                                              // we use a while loop because the increment varies depending on a lot of things
      const opcode = clone[i].slice(-2);
      const operand1 = +clone[i].substr(-3, 1) ? +clone[i + 1] : +clone[+clone[i + 1]];     // make sure to handle for both position and immediate modes
      const operand2 = +clone[i].substr(-4, 1) ? +clone[i + 2] : +clone[+clone[i + 2]];     // make sure to handle for both position and immediate modes
      const operand3 = +clone[i + 3];                                                       // for every case in which there is an operand3, immediate mode is never used

      if (opcode === '99') {
        return {
          newState: clone,
          finalOutput: part === 1 ? output[output.length - 1] : input,    // in part 1, we want the last thing written to output array by opcode '04'. in part 2, we want input (previous amp's output)
          code99: true,
          i,
          phaseInputReceived,
        };
      } else if (opcode === '01') {
        clone[operand3] = numParser(operand1 + operand2);
        i += 4;
      } else if (opcode === '02') {
        clone[operand3] = numParser(operand1 * operand2);
        i += 4;
      } else if (opcode === '03') {
        clone[+clone[i + 1]] = numParser( phaseInputReceived ? input : phase );   // the first time opcode '03' is reached, input is phase; after that, it is always input
        phaseInputReceived = true;                                                // it is safe always to set phaseInputReceived to true
        i += 2;
      } else if (opcode === '04') {
        output.push(operand1);
        i += 2;
        if (part === 2) {                                   // in part 2, opcode '04' should return an object allowing the code to continue to the next amp
          return {
            newState: clone,
            finalOutput: output[output.length - 1],
            code99: false,
            i,
            phaseInputReceived,
          };
        }
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
        throw 'ERROR! unrecognized opcode';   // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';        // if the while loop terminates prematurely (apart from opcode 99 or 04). this error should never happen
  }

  // PART 1 HELPER FUNCTION: TAKES A SEQUENCE OF n PHASES, SIMULATES THE n AMPS, AND RETURNS THE OUTPUT
  function simulateNAmps (phases) {
    let result = 0;                                         // first amp runs with initial input of 0
    for (let i = 0; i < phases.length; i++) {
      result = simulateAmp(code, phases[i], result).finalOutput;  // new result is calculated based in part on previous result
    }
    return result;
  }

  // PART 2 HELPER FUNCTION: TAKES A SEQUENCE OF n PHASES, SIMULATES THE n AMPS, AND KEEPS LOOPING UNTIL IT RETURNS THE OUTPUT
  function simulateNAmpsLoop (phases) {
      
    // STORE AND MAINTAIN INSTANCES OF CODE FOR EACH AMP
    const memory = [];
    for (let i = 0; i < phases.length; i++) {
      memory.push({
        code: [...code],
        i: 0,
        phaseInputReceived: false,
      });
    }

    let iterations = 0;                                               // this variable % the number of amps will determine which amp is currently active
    let result = 0;                                                   // first amp runs with initial input of 0
    while (true) {
      const currentAmp = iterations % phases.length;
      const [newState, finalOutput, code99, i, phaseInputReceived] = Object.values(simulateAmp(
        memory[currentAmp].code,
        phases[currentAmp],
        result,
        memory[currentAmp].i,
        memory[currentAmp].phaseInputReceived
      ));
      if (code99) return finalOutput;                                 // if opcode '99' was reached, we are done - return finalOutput
      memory[currentAmp].code = newState;                             // otherwise, transfer all information returned from calling simulateAmp and update memory
      memory[currentAmp].i = i;
      memory[currentAmp].phaseInputReceived = phaseInputReceived;
      result = finalOutput;                                           // whatever was output from simulateAmp becomes `result` which will be the input in the next iteration
      iterations++;
    }
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  // RECORD KEEPING VARIABLES
  let bestOutput = -Infinity;
  let bestSequence;

  // FOR ALL PERMUTATIONS OF 5 PHASES, RUN THE APPROPRIATE SIMULATION, AND KEEP TRACK OF BEST RESULT
  for (const sequence of permutationsArr(5, part === 1 ? 0 : 5)) {                                    // part 1: second argument is 0; part 2: second argument is 5
    const output = part === 1 ? simulateNAmps(sequence) : simulateNAmpsLoop(sequence);                // part 1: run simulateNAmps; part 2: run simulateNAmpsLoop
    if (output > bestOutput) {
      bestOutput = output;
      bestSequence = sequence;
    }
  }

  return [bestOutput, bestSequence];
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findMaxOutput;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `3,8,1001,8,10,8,105,1,0,0,21,42,63,76,101,114,195,276,357,438,99999,3,9,101,2,9,9,102,5,9,9,1001,9,3,9,1002,9,5,9,4,9,99,3,9,101,4,9,9,102,5,9,9,1001,9,5,9,102,2,9,9,4,9,99,3,9,1001,9,3,9,1002,9,5,9,4,9,99,3,9,1002,9,2,9,101,5,9,9,102,3,9,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,101,3,9,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,99`;

// Test case 1
input = {
  part: 1,
  codeStr: `3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`,
};
expected = [43210, [4, 3, 2, 1, 0]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  codeStr: `3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`,
};
expected = [54321, [0, 1, 2, 3, 4]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  codeStr: `3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`,
};
expected = [65210, [1, 0, 4, 3, 2]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  codeStr: actualInput,
};
expected = [255590, [4, 1, 2, 3, 0]];                             // the first element is confirmed correct because it is the answer
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  codeStr: `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`,
};
expected = [139629729, [9, 8, 7, 6, 5]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  codeStr: `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`,
};
expected = [18216, [9, 7, 8, 5, 6]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  codeStr: actualInput,
};
expected = [58285150, [8, 5, 6, 9, 7]];                           // the first element is confirmed correct because it is the answer
test(func, input, expected, testNum, lowestTest, highestTest);