/*

--- Day 12: Digital Plumber ---

Walking along the memory banks of the stream, you find a small village that is experiencing a little confusion: some programs can't communicate with each other.

Programs in this village communicate using a fixed system of pipes. Messages are passed between programs using these pipes, but most programs aren't connected to each other directly. Instead, programs pass messages between each other until the message reaches the intended recipient.

For some reason, though, some of these messages aren't ever reaching their intended recipient, and the programs suspect that some pipes are missing. They would like you to investigate.

You walk through the village and record the ID of each program and the IDs with which it can communicate directly (your puzzle input). Each program has one or more programs with which it can communicate, and these pipes are bidirectional; if 8 says it can communicate with 11, then 11 will say it can communicate with 8.

You need to figure out how many programs are in the group that contains program ID 0.

For example, suppose you go door-to-door like a travelling salesman and record the following list:

0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5

In this example, the following programs are in the group that contains program ID 0:

Program 0 by definition.
Program 2, directly connected to program 0.
Program 3 via program 2.
Program 4 via program 2.
Program 5 via programs 6, then 4, then 2.
Program 6 via programs 4, then 2.

Therefore, a total of 6 programs are in this group; all but program 1, which has a pipe that connects it to itself.

How many programs are in the group that contains program ID 0?


--- Part Two ---

There are more programs than just the ones in the group containing program ID 0. The rest of them have no way of reaching that group, and still might have no way of reaching each other.

A group is a collection of programs that can all communicate via pipes either directly or indirectly. The programs you identified just a moment ago are all part of the same group. Now, they would like you to determine the total number of groups.

In the example above, there were 2 groups: one consisting of programs 0,2,3,4,5,6, and the other consisting solely of program 1.

How many groups are there in total?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function graphTraversal (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const NODES = {};
  const visited = new Set();                                    // keep this global for purposes of part 2
  

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ nodeA, nodeBList ] = line.split(' <-> ');
    if (!(nodeA in NODES)) NODES[nodeA] = new Set();
    for (const nodeB of nodeBList.split(', ')) {
      if (!(nodeB in NODES)) NODES[nodeB] = new Set();
      NODES[nodeA].add(nodeB);
      NODES[nodeB].add(nodeA);
    }
  }
  
  // HELPER FUNCTION - RECURSIVELY EXPLORE GROUP BEGINNING AT ENTRY POINT startNode
  function visitAndReturnGroup(startNode) {
    const group = new Set();
    const stack = [ startNode ];
    while (stack.length) {
      const node = stack.pop();
      if (visited.has(node)) continue;
      visited.add(node);
      group.add(node);
      for (const neighbor of NODES[node]) {
        stack.push(neighbor);
      }
    }
    return group;
  }

  // ANALYZE
  if (part === 1) {                                             // PART 1: GET NUMBER OF NODES IN NODE 0's GROUP

    const groupZero = visitAndReturnGroup('0');                 // since we deal a lot with the labels of the NODES
                                                                // object, it's easier to keep all node representations
                                                                // in string form for purposes of this problem, hence '0'

    if (DISPLAY_EXTRA_INFO && DEBUG) {
      console.log(groupZero);
    }
    return groupZero.size;

  } else {                                                      // PART 2: GET TOTAL NUMBER OF GROUPS

    let numGroups = 0;
    for (const node in NODES) {
      if (!visited.has(node)) {
        const group = visitAndReturnGroup(node);
        ++numGroups;

        if (DISPLAY_EXTRA_INFO && DEBUG) {
          console.log(group);
        }
      }
    }
    return numGroups;
    
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = graphTraversal;
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
`0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`
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
expected = 288;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 211;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);