/*

--- Day 25: The Halting Problem ---

Following the twisty passageways deeper and deeper into the CPU, you finally reach the core of the computer. Here, in the expansive central chamber, you find a grand apparatus that fills the entire room, suspended nanometers above your head.

You had always imagined CPUs to be noisy, chaotic places, bustling with activity. Instead, the room is quiet, motionless, and dark.

Suddenly, you and the CPU's garbage collector startle each other. "It's not often we get many visitors here!", he says. You inquire about the stopped machinery.

"It stopped milliseconds ago; not sure why. I'm a garbage collector, not a doctor." You ask what the machine is for.

"Programs these days, don't know their origins. That's the Turing machine! It's what makes the whole computer work." You try to explain that Turing machines are merely models of computation, but he cuts you off. "No, see, that's just what they want you to think. Ultimately, inside every CPU, there's a Turing machine driving the whole thing! Too bad this one's broken. We're doomed!"

You ask how you can help. "Well, unfortunately, the only way to get the computer running again would be to create a whole new Turing machine from scratch, but there's no way you can-" He notices the look on your face, gives you a curious glance, shrugs, and goes back to sweeping the floor.

You find the Turing machine blueprints (your puzzle input) on a tablet in a nearby pile of debris. Looking back up at the broken Turing machine above, you can start to identify its parts:

A tape which contains 0 repeated infinitely to the left and right.
A cursor, which can move left or right along the tape and read or write values at its current position.
A set of states, each containing rules about what to do based on the current value under the cursor.
Each slot on the tape has two possible values: 0 (the starting value for all slots) and 1. Based on whether the cursor is pointing at a 0 or a 1, the current state says what value to write at the current position of the cursor, whether to move the cursor left or right one slot, and which state to use next.

For example, suppose you found the following blueprint:

Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.

Running it until the number of steps required to take the listed diagnostic checksum would result in the following tape configurations (with the cursor marked in square brackets):

... 0  0  0 [0] 0  0 ... (before any steps; about to run state A)
... 0  0  0  1 [0] 0 ... (after 1 step;     about to run state B)
... 0  0  0 [1] 1  0 ... (after 2 steps;    about to run state A)
... 0  0 [0] 0  1  0 ... (after 3 steps;    about to run state B)
... 0 [0] 1  0  1  0 ... (after 4 steps;    about to run state A)
... 0  1 [1] 0  1  0 ... (after 5 steps;    about to run state B)
... 0  1  1 [0] 1  0 ... (after 6 steps;    about to run state A)

The CPU can confirm that the Turing machine is working by taking a diagnostic checksum after a specific number of steps (given in the blueprint). Once the specified number of steps have been executed, the Turing machine should pause; once it does, count the number of times 1 appears on the tape. In the above example, the diagnostic checksum is 3.

Recreate the Turing machine and save the computer! What is the diagnostic checksum it produces once it's working again?


--- Part Two ---

The Turing machine, and soon the entire computer, springs back to life. A console glows dimly nearby, awaiting your command.

> reboot printer
Error: That command requires priority 50. You currently have priority 0.
You must deposit 50 stars to increase your priority to the required level.
The console flickers for a moment, and then prints another message:

Star accepted.
You must deposit 49 stars to increase your priority to the required level.
The garbage collector winks at you, then continues sweeping.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function turingMachine (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n\r\n');
  
  // DATA STRUCTURES
  const INSTRUCTIONS = {};
  const ONE = new Set();                                                                            // holds cursor positions with value 1

  // VARIABLES DISCOVERED ON PARSING INPUT DATA
  let state;
  let NUM_STEPS;

  // PARSE INPUT DATA
  for (let group = 0; group < inputArr.length; ++group) {
    const lines = inputArr[group].split('\r\n');
    if (group === 0) {
      state = lines[0].at(-2);
      NUM_STEPS = +lines[1].split(' ').at(-2);
    } else {
      const stateLabel = lines[0].at(-2);
      const data = [];
      for (let i = 0; i < 2; ++i) {
        const writeValue = +lines[i * 4 + 2].at(-2);
        const moveDelta = lines[i * 4 + 3].split(' ').at(-1).slice(0, -1) === 'right' ? 1 : -1;
        const nextState = lines[i * 4 + 4].at(-2);
        data.push( { writeValue, moveDelta, nextState } );
      }
      INSTRUCTIONS[stateLabel] = data;
    }
  }

  // INIT
  let cursor = 0;

  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  for (let i = 0; i < NUM_STEPS; ++i) {
    const read = ONE.has(cursor) ? 1 : 0;
    const { writeValue, moveDelta, nextState } = INSTRUCTIONS[state][read];
    
    if (writeValue) ONE.add(cursor);
    else ONE.delete(cursor);

    cursor += moveDelta;

    state = nextState;
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return ONE.size;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = turingMachine;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([ 3, 4 ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 4230;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);