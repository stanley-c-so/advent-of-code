// --- Day 15: Rambunctious Recitation ---

// You catch the airport shuttle and try to book a new flight to your vacation island. Due to the storm, all direct flights have been cancelled, but a route is available to get around the storm. You take it.

// While you wait for your flight, you decide to check in with the Elves back at the North Pole. They're playing a memory game and are ever so excited to explain the rules!

// In this game, the players take turns saying numbers. They begin by taking turns reading from a list of starting numbers (your puzzle input). Then, each turn consists of considering the most recently spoken number:

// If that was the first time the number has been spoken, the current player says 0.
// Otherwise, the number had been spoken before; the current player announces how many turns apart the number is from when it was previously spoken.
// So, after the starting numbers, each turn results in that player speaking aloud either 0 (if the last number is new) or an age (if the last number is a repeat).

// For example, suppose the starting numbers are 0,3,6:

// Turn 1: The 1st number spoken is a starting number, 0.
// Turn 2: The 2nd number spoken is a starting number, 3.
// Turn 3: The 3rd number spoken is a starting number, 6.
// Turn 4: Now, consider the last number spoken, 6. Since that was the first time the number had been spoken, the 4th number spoken is 0.
// Turn 5: Next, again consider the last number spoken, 0. Since it had been spoken before, the next number to speak is the difference between the turn number when it was last spoken (the previous turn, 4) and the turn number of the time it was most recently spoken before then (turn 1). Thus, the 5th number spoken is 4 - 1, 3.
// Turn 6: The last number spoken, 3 had also been spoken before, most recently on turns 5 and 2. So, the 6th number spoken is 5 - 2, 3.
// Turn 7: Since 3 was just spoken twice in a row, and the last two turns are 1 turn apart, the 7th number spoken is 1.
// Turn 8: Since 1 is new, the 8th number spoken is 0.
// Turn 9: 0 was last spoken on turns 8 and 4, so the 9th number spoken is the difference between them, 4.
// Turn 10: 4 is new, so the 10th number spoken is 0.

// (The game ends when the Elves get sick of playing or dinner is ready, whichever comes first.)

// Their question for you is: what will be the 2020th number spoken? In the example above, the 2020th number spoken will be 436.

// Here are a few more examples:

// Given the starting numbers 1,3,2, the 2020th number spoken is 1.
// Given the starting numbers 2,1,3, the 2020th number spoken is 10.
// Given the starting numbers 1,2,3, the 2020th number spoken is 27.
// Given the starting numbers 2,3,1, the 2020th number spoken is 78.
// Given the starting numbers 3,2,1, the 2020th number spoken is 438.
// Given the starting numbers 3,1,2, the 2020th number spoken is 1836.

// Given your starting numbers, what will be the 2020th number spoken?

// --- Part Two ---

// Impressed, the Elves issue you a challenge: determine the 30000000th number spoken. For example, given the same starting numbers as above:

// Given 0,3,6, the 30000000th number spoken is 175594.
// Given 1,3,2, the 30000000th number spoken is 2578.
// Given 2,1,3, the 30000000th number spoken is 3544142.
// Given 1,2,3, the 30000000th number spoken is 261214.
// Given 2,3,1, the 30000000th number spoken is 6895259.
// Given 3,2,1, the 30000000th number spoken is 18.
// Given 3,1,2, the 30000000th number spoken is 362.

// Given your starting numbers, what will be the 30000000th number spoken?


// NOTE: I HAVE NOT YET FIGURED OUT THE INTENDED EFFICIENT SOLUTION FOR PART 2.
// I have added optional code to print out the progress of the index number of the for loop at every million, as well as the time elapsed since the function ran (in seconds).
// It appears that reaching the 30 million mark can take approximately 10+ minutes. Thus my solution to part 1, crudely applied to part 2, still works as long as you sit through the whole thing.
// I believe an efficient solution might involve somehow detecting a repeated pattern of numbers, deriving the period of the repeat, and using that to find the number after 30 million. However,
// I have no reason to believe that such a pattern must exist, or that even if it does exist, it necessarily begins right from the start of the input. In other words, I cannot find a way to
// rule out that there is some initial ramp up before we reach a repeated pattern. Notably, I tracked index values in which a 0 appeaars (indicating that the previous number is new). The
// 0s seem to pop up quite regularly, suggesting that new numbers regularly appear, and thus there likely is not a repeated pattern.

function memoryGame (part, inputStr) {
  const inputArr = inputStr.split(',').map(n => +n);

  const startTime = Date.now();                                                               // NOT PART OF SOLUTION. used to track elapsed time.

  const memory = {};
  let recent = null;
  const stop = part === 1 ? 2020 : 30000000;                                                  // PART 1: PLAY UNTIL 2,020. PART 2: PLAY UNTIL 30,000,000.
  for (let i = 0; i < stop; ++i) {
    const num = i < inputArr.length ? inputArr[i]                                             // while iterating through initial starting numbers, simply grab the number
      : memory[recent].length === 1 ? 0                                                       // else, check if the most recent number has only ever been seen once - if so, num is 0
      : memory[recent][1] - memory[recent][0];                                                // if recent number is not new, num is the distance between the two most recent times it was seen
    if (!(num in memory)) memory[num] = [];
    memory[num].push(i);
    if (memory[num].length > 2) memory[num].shift();                                          // we only need to track the 2 most recent times a number was seen, so shift if appropriate
    recent = num;

    if (i && i % 1000000 === 0) {                                                             // NOT PART OF SOLUTION. used to track elapsed time.
      console.log(`JUST REACHED ${i} AFTER ${(Date.now() - startTime) / 1000} seconds - ${(S = (i / stop * 100).toString()) && S.slice(0, S.indexOf(".") + 3)}% complete`);
    }
  }

  console.log(`JUST REACHED ${stop} AFTER ${(Date.now() - startTime) / 1000} seconds - 100% complete`);       // NOT PART OF SOLUTION. used to track elapsed time.
  return recent;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = memoryGame;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInputA = `0,3,6`;

const sampleInputB = `1,3,2`;

const sampleInputC = `2,1,3`;

const sampleInputD = `1,2,3`;

const sampleInputE = `2,3,1`;

const sampleInputF = `3,2,1`;

const sampleInputG = `3,1,2`;

const actualInput = `6,4,12,1,20,0,16`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInputA,
};
expected = 436;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInputB,
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInputC,
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInputD,
};
expected = 27;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInputE,
};
expected = 78;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInputF,
};
expected = 438;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: sampleInputG,
};
expected = 1836;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 475;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInputA,
};
expected = 175594;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInputB,
};
expected = 2578;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInputC,
};
expected = 3544142;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInputD,
};
expected = 261214;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: sampleInputE,
};
expected = 6895259;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 14
input = {
  part: 2,
  inputStr: sampleInputF,
};
expected = 18;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 15
input = {
  part: 2,
  inputStr: sampleInputG,
};
expected = 362;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 16
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 11261;
test(func, input, expected, testNum, lowestTest, highestTest);