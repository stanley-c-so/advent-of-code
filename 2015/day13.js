/*

--- Day 13: Knights of the Dinner Table ---

In years past, the holiday feast with your family hasn't gone so well. Not everyone gets along! This year, you resolve, will be different. You're going to find the optimal seating arrangement and avoid all those awkward conversations.

You start by writing up a list of everyone invited and the amount their happiness would increase or decrease if they were to find themselves sitting next to each other person. You have a circular table that will be just big enough to fit everyone comfortably, and so each person will have exactly two neighbors.

For example, suppose you have only four attendees planned, and you calculate their potential happiness as follows:

Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.

Then, if you seat Alice next to David, Alice would lose 2 happiness units (because David talks so much), but David would gain 46 happiness units (because Alice is such a good listener), for a total change of 44.

If you continue around the table, you could then seat Bob next to Alice (Bob gains 83, Alice gains 54). Finally, seat Carol, who sits next to Bob (Carol gains 60, Bob loses 7) and David (Carol gains 55, David gains 41). The arrangement looks like this:

     +41 +46
+55   David    -2
Carol       Alice
+60    Bob    +54
     -7  +83

After trying every other seating arrangement in this hypothetical scenario, you find that this one is the most optimal, with a total change in happiness of 330.

What is the total change in happiness for the optimal seating arrangement of the actual guest list?


--- Part Two ---

In all the commotion, you realize that you forgot to seat yourself. At this point, you're pretty apathetic toward the whole thing, and your happiness wouldn't really go up or down regardless of who you sit next to. You assume everyone else would be just as ambivalent about sitting next to you, too.

So, add yourself to the list, and give all happiness relationships that involve you a score of 0.

What is the total change in happiness for the optimal seating arrangement that actually includes yourself?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function circularSeatingArrangement (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const HAPPINESS = {};
  const PEOPLE = new Set();

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const split = line.split(' ');
    const A = split[0];
    const happiness = +split[3] * (split[2] === 'gain' ? +1 : -1);
    const B = split[10].slice(0, -1);
    PEOPLE.add(A);
    
    if (!(A in HAPPINESS)) HAPPINESS[A] = {};
    HAPPINESS[A][B] = happiness;
  }

  // ADD YOURSELF FOR PART 2
  if (part === 2) {                                                                     // PART 2: YOU HAVE TO BE IN THE CIRCLE
    const YOU = 'You';
    HAPPINESS[YOU] = {};
    for (const person of PEOPLE) {
      HAPPINESS[person][YOU] = 0;                                                       // you don't care who sits next to you
      HAPPINESS[YOU][person] = 0;                                                       // nobody cares about you sitting next to them
    }
    PEOPLE.add(YOU);
  }

  // ANALYZE: BACKTRACKING
  let maxHappiness = -Infinity;
  const ARRANGEMENT = [ Object.keys(HAPPINESS)[0] ];                                    // init ARRANGEMENT with first person always in it
                                                                                        // (can be anyone)
  const visited = new Set(ARRANGEMENT);                                                 // add the person already seated to visited set
  function backtrack() {

    // BASE CASE
    if (visited.size === PEOPLE.size) {
      let happiness = 0;
      for (let i = 0; i < ARRANGEMENT.length; ++i) {
        const person = ARRANGEMENT[i];
        const rightNeighbor = ARRANGEMENT[(PEOPLE.size + i - 1) % PEOPLE.size];
        const leftNeighbor = ARRANGEMENT[(i + 1) % PEOPLE.size];
        happiness += HAPPINESS[person][rightNeighbor];
        happiness += HAPPINESS[person][leftNeighbor];
      }
      maxHappiness = Math.max(maxHappiness, happiness);
    }

    // RECURSIVE CASE
    else {
      for (const next of PEOPLE) {
        if (!visited.has(next)) {
          ARRANGEMENT.push(next);
          visited.add(next);
          backtrack();
          ARRANGEMENT.pop();
          visited.delete(next);
        }
      }
    }
  }
  
  backtrack();
  return maxHappiness;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = circularSeatingArrangement;
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
`Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 330;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 733;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 725;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);