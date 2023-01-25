/*

--- Day 7: The Sum of Its Parts ---

You find yourself standing on a snow-covered coastline; apparently, you landed a little off course. The region is too hilly to see the North Pole from here, but you do spot some Elves that seem to be trying to unpack something that washed ashore. It's quite cold out, so you decide to risk creating a paradox by asking them for directions.

"Oh, are you the search party?" Somehow, you can understand whatever Elves from the year 1018 speak; you assume it's Ancient Nordic Elvish. Could the device on your wrist also be a translator? "Those clothes don't look very warm; take this." They hand you a heavy coat.

"We do need to find our way back to the North Pole, but we have higher priorities at the moment. You see, believe it or not, this box contains something that will solve all of Santa's transportation problems - at least, that's what it looks like from the pictures in the instructions." It doesn't seem like they can read whatever language it's in, but you can: "Sleigh kit. Some assembly required."

"'Sleigh'? What a wonderful name! You must help us assemble this 'sleigh' at once!" They start excitedly pulling more parts out of the box.

The instructions specify a series of steps and requirements about which steps must be finished before others can begin (your puzzle input). Each step is designated by a single letter. For example, suppose you have the following instructions:

Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.

Visually, these requirements look like this:

  -->A--->B--
 /    \      \
C      -->D----->E
 \           /
  ---->F-----

Your first goal is to determine the order in which the steps should be completed. If more than one step is ready, choose the step which is first alphabetically. In this example, the steps would be completed as follows:

Only C is available, and so it is done first.
Next, both A and F are available. A is first alphabetically, so it is done next.
Then, even though F was available earlier, steps B and D are now also available, and B is the first alphabetically of the three.
After that, only D and F are available. E is not available because only some of its prerequisites are complete. Therefore, D is completed next.
F is the only choice, so it is done next.
Finally, E is completed.

So, in this example, the correct order is CABDFE.

In what order should the steps in your instructions be completed?


--- Part Two ---

As you're about to begin construction, four of the Elves offer to help. "The sun will set soon; it'll go faster if we work together." Now, you need to account for multiple people working on steps simultaneously. If multiple steps are available, workers should still begin them in alphabetical order.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on. So, step A takes 60+1=61 seconds, while step Z takes 60+26=86 seconds. No time is required between steps.

To simplify things for the example, however, suppose you only have help from one Elf (a total of two workers) and that each step takes 60 fewer seconds (so that step A takes 1 second and step Z takes 26 seconds). Then, using the same instructions as above, this is how each second would be spent:

Second   Worker 1   Worker 2   Done
   0        C          .        
   1        C          .        
   2        C          .        
   3        A          F       C
   4        B          F       CA
   5        B          F       CA
   6        D          F       CAB
   7        D          F       CAB
   8        D          F       CAB
   9        D          .       CABF
  10        E          .       CABFD
  11        E          .       CABFD
  12        E          .       CABFD
  13        E          .       CABFD
  14        E          .       CABFD
  15        .          .       CABFDE

Each row represents one second of time. The Second column identifies how many seconds have passed as of the beginning of that second. Each worker column shows the step that worker is currently doing (or . if they are idle). The Done column shows completed steps.

Note that the order of the steps has changed; this is because steps now take time to finish and multiple workers can begin multiple steps simultaneously.

In this example, it would take 15 seconds for two workers to complete these steps.

With 5 workers and the 60+ second step durations described above, how long will it take to complete all of the steps?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function taskOrderWithPrerequisitesAndMultipleWorkers (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';                                            // for part 2
  const PREREQUISITES_FOR = {};                                                             // for any task, look up its prequisites
  const SUBSEQUENT_TASKS_FOR = {};                                                          // for any task, look up which tasks require it first
  const AVAILABLE = new Set();                                                              // all tasks that are ready to go

  // PARSE INPUT DATA - FIRST PASS
  for (const line of inputArr) {
    const split = line.split(' ');
    const prerequisite = split[1];
    const subsequent = split[7];
    AVAILABLE.add(prerequisite);
    AVAILABLE.add(subsequent);

    if (!(subsequent in PREREQUISITES_FOR)) PREREQUISITES_FOR[subsequent] = new Set();
    PREREQUISITES_FOR[subsequent].add(prerequisite);

    if (!(prerequisite in SUBSEQUENT_TASKS_FOR)) SUBSEQUENT_TASKS_FOR[prerequisite] = [];
    SUBSEQUENT_TASKS_FOR[prerequisite].push(subsequent);
  }

  // PRE-PROCESSING - DELETE ALL TASKS THAT HAVE PREREQUISITES FROM THE AVAILABLE SET
  for (const task in PREREQUISITES_FOR) AVAILABLE.delete(task);

  // INIT
  let output = '';

  // ANALYZE

  // if (part === 1) {                                                                           // PART 1: GET TASK ORDER IF ONLY ONE WORKER

  //   while (AVAILABLE.size) {
  //     const nextTask = [ ...AVAILABLE ].sort()[0];
  //     output += nextTask;
  //     AVAILABLE.delete(nextTask);
  //     if (nextTask in SUBSEQUENT_TASKS_FOR) {
  //       for (const subsequent of SUBSEQUENT_TASKS_FOR[nextTask]) {
  //         PREREQUISITES_FOR[subsequent].delete(nextTask);
  //         if (PREREQUISITES_FOR[subsequent].size === 0) AVAILABLE.add(subsequent);
  //       }
  //     }
  //   }

  //   return output;

  // }

  // BUT WE CAN ACTUALLY USE PART 2's SOLUTION FOR PART 1. IF YOU WANT TO TRY IT OUT, COMMENT OUT THE PART 1 BLOCK ABOVE.
  
  // PART 2: GET TOTAL WORK TIME IF MULTIPLE WORKERS

  // CONSTANTS
  const NUM_WORKERS = part === 1  ? 1                                                       // PART 1: IF USING THIS METHOD, TREAT AS ONLY 1 WORKER
                                  : extraParam.extraWorkers + 1;                            // PART 2: MULTIPLE WORKERS - INCLUDING YOURSELF

  const BASELINE_TIME = part === 1  ? 0                                                     // PART 1: IF USING THIS METHOD, WE DON'T CARE ABOUT TIME
                                : extraParam.stepTime;                                      // PART 2: THIS IS THE BASELINE TIME EACH TASK TAKES

  // INIT
  const WORKER_STATES = Array(NUM_WORKERS).fill(null);                                      // null means idle, else shape will look like e.g.:
                                                                                            // { task: A, completionTime: 5 } 
  let numIdle = NUM_WORKERS;
  let t = 0;

  // ANALYZE
  while (AVAILABLE.size || numIdle < NUM_WORKERS) {                                         // (use a while loop instead of for loop to reference t
                                                                                            // outside of the loop in the return statement)
    
    if (DISPLAY_EXTRA_INFO && (part === 1 || DEBUG)) {
      console.log('t is now:', t, 'WORKER_STATES AT START:', WORKER_STATES);
    }

    // IF ANY TASKS ARE DONE, MAKE THAT WORKER IDLE
    for (let i = 0; i < NUM_WORKERS; ++i) {
      const state = WORKER_STATES[i];
      if (state && state.completionTime <= t) {                                             // to support part 1, make it <= instead of ===
                                                                                            // (since for part 1 we say tasks take 0 time to complete,
                                                                                            // but the way we've coded this while loop, we can only
                                                                                            // begin at most 1 new task per worker per iteration)
        const completedTask = state.task;
        output += completedTask;
        WORKER_STATES[i] = null;
        ++numIdle;
        if (completedTask in SUBSEQUENT_TASKS_FOR) {
          for (const subsequent of SUBSEQUENT_TASKS_FOR[completedTask]) {
            PREREQUISITES_FOR[subsequent].delete(completedTask);
            if (PREREQUISITES_FOR[subsequent].size === 0) AVAILABLE.add(subsequent);
          }
        }
      }
    }

    // IF ANY WORKER IS IDLE *AND* THERE IS ANOTHER TASK AVAILABLE, START THE WORKER ON THAT TASK.
    // REPEAT UNTIL ALL WORKERS ARE BUSY OR NO TASKS ARE AVAILABLE
    while (numIdle && AVAILABLE.size) {
      const nextTask = [ ...AVAILABLE ].sort()[0];
      AVAILABLE.delete(nextTask);
      const idxOfWorker = WORKER_STATES.indexOf(null);
      const newState = {
        task: nextTask,
        completionTime: part === 1  ? 0
                                    : t + BASELINE_TIME
                                        + ALPHABET.indexOf(nextTask)
                                        + 1
      };
      WORKER_STATES[idxOfWorker] = newState;
      --numIdle;
    }

    if (DISPLAY_EXTRA_INFO && (part === 1 || DEBUG)) {
      console.log('t is now:', t, 'WORKER_STATES AT END:', WORKER_STATES);
    }

    ++t;
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log(`SEQUENCE OF TASKS COMPLETED: ${output}`);
  }

  return part === 1 ? output
                    : t - 1;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = taskOrderWithPrerequisitesAndMultipleWorkers;
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
`Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: null,
  DEBUG: true,
};
expected = 'CABDFE';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: null,
};
expected = 'MNOUBYITKXZFHQRJDASGCPEVWL';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: {
    extraWorkers: 1,
    stepTime: 0,
  },
  DEBUG: true,
};
expected = 15;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: {
    extraWorkers: 4,
    stepTime: 60,
  },
};
expected = 893;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);