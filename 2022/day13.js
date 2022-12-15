/*

--- Day 13: Distress Signal ---

You climb the hill and again try contacting the Elves. However, you instead receive a signal you weren't expecting: a distress signal.

Your handheld device must still not be working properly; the packets from the distress signal got decoded out of order. You'll need to re-order the list of received packets (your puzzle input) to decode the message.

Your list consists of pairs of packets; pairs are separated by a blank line. You need to identify how many pairs of packets are in the right order.

For example:

[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]

Packet data consists of lists and integers. Each list starts with [, ends with ], and contains zero or more comma-separated values (either integers or other lists). Each packet is always a list and appears on its own line.

When comparing two values, the first value is called left and the second value is called right. Then:

If both values are integers, the lower integer should come first. If the left integer is lower than the right integer, the inputs are in the right order. If the left integer is higher than the right integer, the inputs are not in the right order. Otherwise, the inputs are the same integer; continue checking the next part of the input.
If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order. If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison. For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2); the result is then found by instead comparing [0,0,0] and [2].
Using these rules, you can determine which of the pairs in the example are in the right order:

== Pair 1 ==
- Compare [1,1,3,1,1] vs [1,1,5,1,1]
  - Compare 1 vs 1
  - Compare 1 vs 1
  - Compare 3 vs 5
    - Left side is smaller, so inputs are in the right order

== Pair 2 ==
- Compare [[1],[2,3,4]] vs [[1],4]
  - Compare [1] vs [1]
    - Compare 1 vs 1
  - Compare [2,3,4] vs 4
    - Mixed types; convert right to [4] and retry comparison
    - Compare [2,3,4] vs [4]
      - Compare 2 vs 4
        - Left side is smaller, so inputs are in the right order

== Pair 3 ==
- Compare [9] vs [[8,7,6]]
  - Compare 9 vs [8,7,6]
    - Mixed types; convert left to [9] and retry comparison
    - Compare [9] vs [8,7,6]
      - Compare 9 vs 8
        - Right side is smaller, so inputs are not in the right order

== Pair 4 ==
- Compare [[4,4],4,4] vs [[4,4],4,4,4]
  - Compare [4,4] vs [4,4]
    - Compare 4 vs 4
    - Compare 4 vs 4
  - Compare 4 vs 4
  - Compare 4 vs 4
  - Left side ran out of items, so inputs are in the right order

== Pair 5 ==
- Compare [7,7,7,7] vs [7,7,7]
  - Compare 7 vs 7
  - Compare 7 vs 7
  - Compare 7 vs 7
  - Right side ran out of items, so inputs are not in the right order

== Pair 6 ==
- Compare [] vs [3]
  - Left side ran out of items, so inputs are in the right order

== Pair 7 ==
- Compare [[[]]] vs [[]]
  - Compare [[]] vs []
    - Right side ran out of items, so inputs are not in the right order

== Pair 8 ==
- Compare [1,[2,[3,[4,[5,6,7]]]],8,9] vs [1,[2,[3,[4,[5,6,0]]]],8,9]
  - Compare 1 vs 1
  - Compare [2,[3,[4,[5,6,7]]]] vs [2,[3,[4,[5,6,0]]]]
    - Compare 2 vs 2
    - Compare [3,[4,[5,6,7]]] vs [3,[4,[5,6,0]]]
      - Compare 3 vs 3
      - Compare [4,[5,6,7]] vs [4,[5,6,0]]
        - Compare 4 vs 4
        - Compare [5,6,7] vs [5,6,0]
          - Compare 5 vs 5
          - Compare 6 vs 6
          - Compare 7 vs 0
            - Right side is smaller, so inputs are not in the right order

What are the indices of the pairs that are already in the right order? (The first pair has index 1, the second pair has index 2, and so on.) In the above example, the pairs in the right order are 1, 2, 4, and 6; the sum of these indices is 13.

Determine which pairs of packets are already in the right order. What is the sum of the indices of those pairs?


--- Part Two ---

Now, you just need to put all of the packets in the right order. Disregard the blank lines in your list of received packets.

The distress signal protocol also requires that you include two additional divider packets:

[[2]]
[[6]]

Using the same rules as before, organize all packets - the ones in your list of received packets as well as the two divider packets - into the correct order.

For the example above, the result of putting the packets in the correct order is:

[]
[[]]
[[[]]]
[1,1,3,1,1]
[1,1,5,1,1]
[[1],[2,3,4]]
[1,[2,[3,[4,[5,6,0]]]],8,9]
[1,[2,[3,[4,[5,6,7]]]],8,9]
[[1],4]
[[2]]
[3]
[[4,4],4,4]
[[4,4],4,4,4]
[[6]]
[7,7,7]
[7,7,7,7]
[[8,7,6]]
[9]

Afterward, locate the divider packets. To find the decoder key for this distress signal, you need to determine the indices of the two divider packets and multiply them together. (The first packet is at index 1, the second packet is at index 2, and so on.) In this example, the divider packets are 10th and 14th, and so the decoder key is 140.

Organize all of the packets into the correct order. What is the decoder key for the distress signal?

*/

// ========== SOLUTION 1: USES JAVASCRIPT'S BUILT-IN eval AND JSON.stringify FUNCTIONS

function readPackets (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // HELPER COMPARE FUNCTION
  function compare(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {                                             // either a and b are both numbers...
      if (a < b) return 1;
      if (b < a) return -1;
      return 0;
    } else {                                                                                          // ...or at least one is an array...
      if (typeof a === 'number') a = [a];                                                             // ...so make sure for each one...
      else if (typeof b === 'number') b = [b];                                                        // ...if it is a number, it gets converted to array

      for (let i = 0; i < Math.min(a.length, b.length); ++i) {                                        // run through both arrays...
        const res = compare(a[i], b[i]);                                                              // ...recursing compare on corresponding elements...
        if (res) return res;                                                                          // ...and immediately returning if result is not 0
      }

      if (a.length < b.length) return 1;                                                              // if one array runs out before the other...
      if (b.length < a.length) return -1;                                                             // ...return 1 or -1 based on which is shorter...
      return 0;                                                                                       // ...or 0 if same length
    }
  }

  if (part === 1) {                                                                                   // PART 1: CHECK IF PAIRS ARE IN SORTED ORDER

    const indicesOfSortedPairs = [];
    for (let i = 0; i < inputArr.length; ++i) {
      const [left, right] = inputArr[i].split('\r\n').map(str => eval(str));
      if (compare(left, right) === 1) indicesOfSortedPairs.push(i + 1);                               // NOTE: indices are 1-indexed
    }
    return indicesOfSortedPairs.reduce((sum, num) => sum + num);

  } else {                                                                                            // PART 2: ADD 2 ELS, SORT, FIND POSITIONS

    // create new data (merge pairs together, add two new special elements)
    const DIVIDER1 = [[2]];
    const DIVIDER2 = [[6]];
    const PACKET_LIST = [ DIVIDER1, DIVIDER2 ];
    for (const pair of inputArr) PACKET_LIST.push(...pair.split('\r\n').map(str => eval(str)));

    // sort data on the basis of compare function
    PACKET_LIST.sort((a, b) => compare(b, a));

    // look for the indices of the two special divider packets
    let idx1 = null, idx2 = null;
    for (let i = 0; i < PACKET_LIST.length; ++i) {
      if (JSON.stringify(PACKET_LIST[i]) === JSON.stringify(DIVIDER1)) idx1 = i + 1;                  // NOTE: indices are 1-indexed
      if (JSON.stringify(PACKET_LIST[i]) === JSON.stringify(DIVIDER2)) idx2 = i + 1;                  // NOTE: indices are 1-indexed
    }
    if ([idx1, idx2].includes(null)) throw 'ERROR: DID NOT FIND ONE OR MORE OF THE SPECIAL PACKETS';
    return idx1 * idx2;

  }
}


// ========== SOLUTION 2: USES MY OWN 'EVAL' AND 'STRINGIFY' FUNCTIONS

function readPackets2 (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // HELPER EVAL FUNCTION
  function EVAL(str) {

    // edge case: input is number only
    if (str[0] !== '[') return Number(str);

    // init
    const stack = [];
    let currNumberAsStr = '';

    // utility
    const endCurrNumberAsStr = () => {
      if (currNumberAsStr) {
        stack.at(-1).push(+currNumberAsStr);
        currNumberAsStr = '';
      }
    };

    // analyze string
    for (const c of str) {
      if (c === '[') {
        stack.push([]);
      } else if (c === ']') {
        endCurrNumberAsStr();
        const doneArray = stack.pop();
        if (stack.length) stack.at(-1).push(doneArray);
        else return doneArray;
      } else if (c === ',') {
        endCurrNumberAsStr();
      } else {
        currNumberAsStr += c;
      }
    }

    throw 'ERROR: UNEXPECTED END OF STRING';
  }

  // HELPER STRINGIFY FUNCTION
  function STRINGIFY(input) {
    return typeof input === 'number'  ? String(input)
                                      : '[' + input.map(el => STRINGIFY(el)).join(',') + ']';
  }

  // HELPER COMPARE FUNCTION
  function compare(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {                                             // either a and b are both numbers...
      if (a < b) return 1;
      if (b < a) return -1;
      return 0;
    } else {                                                                                          // ...or at least one is an array...
      if (typeof a === 'number') a = [a];                                                             // ...so make sure for each one...
      else if (typeof b === 'number') b = [b];                                                        // ...if it is a number, it gets converted to array

      for (let i = 0; i < Math.min(a.length, b.length); ++i) {                                        // run through both arrays...
        const res = compare(a[i], b[i]);                                                              // ...recursing compare on corresponding elements...
        if (res) return res;                                                                          // ...and immediately returning if result is not 0
      }

      if (a.length < b.length) return 1;                                                              // if one array runs out before the other...
      if (b.length < a.length) return -1;                                                             // ...return 1 or -1 based on which is shorter...
      return 0;                                                                                       // ...or 0 if same length
    }
  }

  if (part === 1) {                                                                                   // PART 1: CHECK IF PAIRS ARE IN SORTED ORDER

    const indicesOfSortedPairs = [];
    for (let i = 0; i < inputArr.length; ++i) {
      const [left, right] = inputArr[i].split('\r\n').map(str => EVAL(str));
      if (compare(left, right) === 1) indicesOfSortedPairs.push(i + 1);                               // NOTE: indices are 1-indexed
    }
    return indicesOfSortedPairs.reduce((sum, num) => sum + num);

  } else {                                                                                            // PART 2: ADD 2 ELS, SORT, FIND POSITIONS

    // create new data (merge pairs together, add two new special elements)
    const DIVIDER1 = [[2]];
    const DIVIDER2 = [[6]];
    const PACKET_LIST = [ DIVIDER1, DIVIDER2 ];
    for (const pair of inputArr) PACKET_LIST.push(...pair.split('\r\n').map(str => eval(str)));

    // sort data on the basis of compare function
    PACKET_LIST.sort((a, b) => compare(b, a));

    // look for the indices of the two special divider packets
    let idx1 = null, idx2 = null;
    for (let i = 0; i < PACKET_LIST.length; ++i) {
      const stringifiedPacket = STRINGIFY(PACKET_LIST[i]);
      if (stringifiedPacket === STRINGIFY(DIVIDER1)) idx1 = i + 1;                                    // NOTE: indices are 1-indexed
      if (stringifiedPacket === STRINGIFY(DIVIDER2)) idx2 = i + 1;                                    // NOTE: indices are 1-indexed
    }
    if ([idx1, idx2].includes(null)) throw 'ERROR: DID NOT FIND ONE OR MORE OF THE SPECIAL PACKETS';
    return idx1 * idx2;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = readPackets;
const func = readPackets2;
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
`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 13;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 6395;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 140;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 24921;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);