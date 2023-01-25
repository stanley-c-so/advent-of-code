/*

--- Day 8: Memory Maneuver ---

The sleigh is much easier to pull than you'd expect for something its weight. Unfortunately, neither you nor the Elves know which way the North Pole is from here.

You check your wrist device for anything that might help. It seems to have some kind of navigation system! Activating the navigation system produces more bad news: "Failed to start navigation system. Could not read software license file."

The navigation system's license file consists of a list of numbers (your puzzle input). The numbers define a data structure which, when processed, produces some kind of tree that can be used to calculate the license number.

The tree is made up of nodes; a single, outermost node forms the tree's root, and it contains all other nodes in the tree (or contains nodes that contain nodes, and so on).

Specifically, a node consists of:

A header, which is always exactly two numbers:
The quantity of child nodes.
The quantity of metadata entries.
Zero or more child nodes (as specified in the header).
One or more metadata entries (as specified in the header).

Each child node is itself a node that has its own header, child nodes, and metadata. For example:

2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
A----------------------------------
    B----------- C-----------
                     D-----

In this example, each node of the tree is also marked with an underline starting with a letter for easier identification. In it, there are four nodes:

A, which has 2 child nodes (B, C) and 3 metadata entries (1, 1, 2).
B, which has 0 child nodes and 3 metadata entries (10, 11, 12).
C, which has 1 child node (D) and 1 metadata entry (2).
D, which has 0 child nodes and 1 metadata entry (99).

The first check done on the license file is to simply add up all of the metadata entries. In this example, that sum is 1+1+2+10+11+12+2+99=138.

What is the sum of all metadata entries?


--- Part Two ---

The second check is slightly more complicated: you need to find the value of the root node (A in the example above).

The value of a node depends on whether it has child nodes.

If a node has no child nodes, its value is the sum of its metadata entries. So, the value of node B is 10+11+12=33, and the value of node D is 99.

However, if a node does have child nodes, the metadata entries become indexes which refer to those child nodes. A metadata entry of 1 refers to the first child node, 2 to the second, 3 to the third, and so on. The value of this node is the sum of the values of the child nodes referenced by the metadata entries. If a referenced child node does not exist, that reference is skipped. A child node can be referenced multiple time and counts each time it is referenced. A metadata entry of 0 does not refer to any child node.

For example, again using the above nodes:

Node C has one metadata entry, 2. Because node C has only one child node, 2 references a child node which does not exist, and so the value of node C is 0.
Node A has three metadata entries: 1, 1, and 2. The 1 references node A's first child node, B, and the 2 references node A's second child node, C. Because node B has a value of 33 and node C has a value of 0, the value of node A is 33+33+0=66.
So, in this example, the value of the root node is 66.

What is the value of the root node?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function backtrackToFindTreeStructure (part, inputStr, DEBUG = false) {
  
  // PARSE INPUT DATA
  const NUMBERS = inputStr.split(' ').map(n => +n);

  // INIT
  let pointer = 0;
  let part1MetadataTotal = 0;                                                                     // for part 1

  // HELPER FUNCTION - READ METADATA AND ADVANCE GLOBAL POINTER
  function processMetadata(metadataCount, node) {
    for (let metadata = 0; metadata < metadataCount; ++metadata) {
      const num = NUMBERS[pointer++];
      part1MetadataTotal += num;
      node.metadata.push(num);
    }
  }

  // HELPER FUNCTION - PART 2 ONLY - GET VALUE OF A NODE
  function getValueOfNode(node) {
    if (node.children.length) {                                                                   // if node has children...
      return node.metadata.reduce((sum, idx) => sum + (idx > 0 && idx <= node.children.length
                                                        ? getValueOfNode(node.children[idx - 1])  // ...get value of in-bounds 1-indexed child nodes
                                                        : 0)
                                  , 0);
    } else {                                                                                      // else if node has no children...
      return node.metadata.reduce((sum, num) => sum + num, 0);                                    // ...sum up its metadata to get its value
    }
  }

  // ANALYZE BACKTRACKING
  function backtrack() {

    // DATA STRUCTURE
    const node = { children: [], metadata: [] };

    // READ HEADER INFORMATION, ADVANCING GLOBAL POINTER IN THE PROCESS
    const numChildren = NUMBERS[pointer++];
    const metadataCount = NUMBERS[pointer++];

    // ONLY RECURSIVE CASE HAS CHILDREN
    for (let child = 0; child < numChildren; ++child) {
      node.children.push(backtrack());
    }

    // BOTH BASE AND RECURSIVE CASES NEED TO PROCESS METADATA
    processMetadata(metadataCount, node);

    return node;
  }
  
  const ROOT = backtrack();

  return part === 1 ? part1MetadataTotal                                                          // PART 1: GET GLOBAL METADATA TOTAL
                    : getValueOfNode(ROOT);                                                       // PART 2: GET VALUE OF ROOT NODE
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = backtrackToFindTreeStructure;
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
`2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 138;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 40984;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 66;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 37067;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);