/*

--- Day 7: Recursive Circus ---

Wandering further through the circuits of the computer, you come upon a tower of programs that have gotten themselves into a bit of trouble. A recursive algorithm has gotten out of hand, and now they're balanced precariously in a large tower.

One program at the bottom supports the entire tower. It's holding a large disc, and on the disc are balanced several more sub-towers. At the bottom of these sub-towers, standing on the bottom disc, are other programs, each holding their own disc, and so on. At the very tops of these sub-sub-sub-...-towers, many programs stand simply keeping the disc below them balanced but with no disc of their own.

You offer to help, but first you need to understand the structure of these towers. You ask each program to yell out their name, their weight, and (if they're holding a disc) the names of the programs immediately above them balancing on that disc. You write this information down (your puzzle input). Unfortunately, in their panic, they don't do this in an orderly fashion; by the time you're done, you're not sure which program gave which information.

For example, if your list is the following:

pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)

...then you would be able to recreate the structure of the towers that looks like this:

                gyxo
              /     
         ugml - ebii
       /      \     
      |         jptl
      |        
      |         pbga
     /        /
tknk --- padx - havc
     \        \
      |         qoyq
      |             
      |         ktlj
       \      /     
         fwft - cntj
              \     
                xhth

In this example, tknk is at the bottom of the tower (the bottom program), and is holding up ugml, padx, and fwft. Those programs are, in turn, holding up other programs; in this example, none of those programs are holding up any other programs, and are all the tops of their own towers. (The actual tower balancing in front of you is much larger.)

Before you're ready to help them, you need to make sure your information is correct. What is the name of the bottom program?


--- Part Two ---

The programs explain the situation: they can't get down. Rather, they could get down, if they weren't expending all of their energy trying to keep the tower balanced. Apparently, one program has the wrong weight, and until it's fixed, they're stuck here.

For any program holding a disc, each program standing on that disc forms a sub-tower. Each of those sub-towers are supposed to be the same weight, or the disc itself isn't balanced. The weight of a tower is the sum of the weights of the programs in that tower.

In the example above, this means that for ugml's disc to be balanced, gyxo, ebii, and jptl must all have the same weight, and they do: 61.

However, for tknk to be balanced, each of the programs standing on its disc and all programs above it must each match. This means that the following sums must all be the same:

ugml + (gyxo + ebii + jptl) = 68 + (61 + 61 + 61) = 251
padx + (pbga + havc + qoyq) = 45 + (66 + 66 + 66) = 243
fwft + (ktlj + cntj + xhth) = 72 + (57 + 57 + 57) = 243

As you can see, tknk's disc is unbalanced: ugml's stack is heavier than the other two. Even though the nodes above ugml are balanced, ugml itself is too heavy: it needs to be 8 units lighter for its stack to weigh 243 and keep the towers balanced. If this change were made, its weight would be 60.

Given that exactly one program is the wrong weight, what would its weight need to be to balance the entire tower?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function balanceNodeWeightInTree (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const REF = {};
  const PARENT_OF = {};
  const TOTAL_WEIGHT = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ LS, RS ] = line.split(' -> ');
    const [ node, weightInParens ] = LS.split(' ');
    const children = RS ? RS.split(', ') : [];

    REF[node] = {
      weight: +weightInParens.slice(1, -1),
      children,
    };

    for (const child of children) PARENT_OF[child] = node;
  }

  // CONTINUE PARSING WITH RECURSIVE FUNCTION + MEMOIZATION TO POPULATE DATA STRUCTURE
  function getTotalWeight(node) {
    if (!(node in TOTAL_WEIGHT)) {
      TOTAL_WEIGHT[node] = REF[node].weight;                                                // init total weight as node's own weight...

      if (REF[node].children.length) {                                                      // ...then, if any children, add all of their total weights
        TOTAL_WEIGHT[node] += REF[node].children.reduce((total, child) =>
                                total + getTotalWeight(child), 0);
      }
    }
    return TOTAL_WEIGHT[node];
  }
  for (const node in REF) getTotalWeight(node);                                             // kick-start recursive function on all nodes

  // GET ROOT OF TREE
  let ROOT = null;                                                                          // to do this in O(h) time, just start with any node...
  for (const node in REF) {                                                                 // ...just grab any node in O(1) time...
    ROOT = node;
    break;
  }
  while (ROOT in PARENT_OF) ROOT = PARENT_OF[ROOT];                                         // ...and then move up its ancestral line to the root

  // ANALYZE
  if (part === 1) {                                                                         // PART 1: RETURN ROOT OF TREE

    return ROOT;
  
  } else {                                                                                  // PART 2: FIND ORIGINAL UNBALANCED NODE, AND CALCULATE
                                                                                            // WHAT ITS INDIVIDUAL WEIGHT SHOULD BE TO BALANCE ITS
                                                                                            // PARENT (AND THE REST OF THE TREE - ALTHOUGH NOTE THAT
                                                                                            // THE ORIGINAL UNBALANCED NODE WILL REMAIN UNBALANCED!
                                                                                            // THIS IS BECAUSE WE ONLY MODIFY THAT NODE'S OWN
                                                                                            // INDIVIDUAL WEIGHT, WHICH AFFECTS THE BALANCE OF ITS
                                                                                            // ANCESTORS, BUT NOT ITS OWN BALANCE!)

    // HELPER FUNCTION - DETERMINE WHETHER A GIVEN NODE IS BALANCED
    function isBalanced(node) {
      const children = REF[node].children;
      if (!children.length) return true;
      const firstChildWeight = TOTAL_WEIGHT[children[0]];
      return children.every(child => TOTAL_WEIGHT[child] === firstChildWeight);
    }

    // RECURSIVE FUNCTION - GIVEN ANY KNOWN UNBALANCED NODE, TRAVERSE DOWNWARD TO GET ORIGINAL UNBALANCED NODE
    function getOriginalUnbalancedNode(unbalanced) {

      // GET CORRECT TARGET TOTAL WEIGHT IN O(1) TIME
      let targetTotalWeight = null;
      const seen = new Set();                                                               // for finding the repeated weight
      for (const child of REF[unbalanced].children) {
        if (seen.has(TOTAL_WEIGHT[child])) {                                                // it takes max 3 iterations to find the repeated weight
          targetTotalWeight = TOTAL_WEIGHT[child];
          break;
        }
        seen.add(TOTAL_WEIGHT[child]);
      }
      if (targetTotalWeight === null) throw 'ERROR: DID NOT FIND TARGET WEIGHT';

      // GET CHILD WHOSE TOTAL WEIGHT DOES NOT MATCH THE REST OF THE CHILDREN
      const childrenWithIncorrectWeight = REF[unbalanced]
                                            .children
                                            .filter(child =>
                                              TOTAL_WEIGHT[child] !== targetTotalWeight);

      if (childrenWithIncorrectWeight.length !== 1) {
        throw `ERROR: NUMBER OF CHILDREN WITH INCORRECT WEIGHT IS NOT EXACTLY 1: ${         // based on the assumptions above, there should only be 1
          childrenWithIncorrectWeight}`;
      }

      const childWithIncorrectWeight = childrenWithIncorrectWeight[0];

      // IF CHILD IS BALANCED, THEN CURRENT NODE IS THE ORIGINAL UNBALANCED NODE
      if (isBalanced(childWithIncorrectWeight)) {                                           // BASE CASE: problematic child is itself balanced
        return {
          unbalanced,
          targetTotalWeight,
          childWithIncorrectWeight,
        };
      }
      return getOriginalUnbalancedNode(childWithIncorrectWeight);                           // RECURSIVE CASE: recurse on unbalanced child
    }

    const { unbalanced,
            targetTotalWeight,
            childWithIncorrectWeight } = getOriginalUnbalancedNode(ROOT);

    if (DISPLAY_EXTRA_INFO) {
      console.log('original unbalanced node:',
                  unbalanced);
      console.log('total weights of its children:',
                  REF[unbalanced].children
                                  .map(child => `${child}: ${TOTAL_WEIGHT[child]}`));
      console.log('target total weight (weight of all children except 1):',
                  targetTotalWeight);
      console.log('child with incorrect weight:',
                  childWithIncorrectWeight);
      console.log('total weight of problematic child:',
                  TOTAL_WEIGHT[childWithIncorrectWeight]);
      console.log('required change to total weight of problematic child:',
                  targetTotalWeight - TOTAL_WEIGHT[childWithIncorrectWeight]);
      console.log('actual weight of problematic child by itself:',
                  REF[childWithIncorrectWeight].weight);
      console.log('weight problematic child needs to become:',
                  REF[childWithIncorrectWeight].weight
                    + (targetTotalWeight - TOTAL_WEIGHT[childWithIncorrectWeight]));
    }

    return REF[childWithIncorrectWeight].weight                                             // current (old) individual weight or problematic child...
            + (targetTotalWeight - TOTAL_WEIGHT[childWithIncorrectWeight]);                 // ...plus the change that needs to be made to its weight

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = balanceNodeWeightInTree;
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
`pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 'tknk';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 'rqwgj';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 60;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 333;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);