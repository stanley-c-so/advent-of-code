/*

--- Day 2: Dive! ---

Now, you need to figure out how to pilot this thing.

It seems like the submarine can take a series of commands like forward 1, down 2, or up 3:

forward X increases the horizontal position by X units.
down X increases the depth by X units.
up X decreases the depth by X units.
Note that since you're on a submarine, down and up affect your depth, and so they have the opposite result of what you might expect.

The submarine seems to already have a planned course (your puzzle input). You should probably figure out where it's going. For example:

forward 5
down 5
forward 8
up 3
down 8
forward 2
Your horizontal position and depth both start at 0. The steps above would then modify them as follows:

forward 5 adds 5 to your horizontal position, a total of 5.
down 5 adds 5 to your depth, resulting in a value of 5.
forward 8 adds 8 to your horizontal position, a total of 13.
up 3 decreases your depth by 3, resulting in a value of 2.
down 8 adds 8 to your depth, resulting in a value of 10.
forward 2 adds 2 to your horizontal position, a total of 15.
After following these instructions, you would have a horizontal position of 15 and a depth of 10. (Multiplying these together produces 150.)

Calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?

==========

--- Part Two ---

Based on your calculations, the planned course doesn't seem to make any sense. You find the submarine manual and discover that the process is actually slightly more complicated.

In addition to horizontal position and depth, you'll also need to track a third value, aim, which also starts at 0. The commands also mean something entirely different than you first thought:

down X increases your aim by X units.
up X decreases your aim by X units.
forward X does two things:
It increases your horizontal position by X units.
It increases your depth by your aim multiplied by X.
Again note that since you're on a submarine, down and up do the opposite of what you might expect: "down" means aiming in the positive direction.

Now, the above example does something different:

forward 5 adds 5 to your horizontal position, a total of 5. Because your aim is 0, your depth does not change.
down 5 adds 5 to your aim, resulting in a value of 5.
forward 8 adds 8 to your horizontal position, a total of 13. Because your aim is 5, your depth increases by 8*5=40.
up 3 decreases your aim by 3, resulting in a value of 2.
down 8 adds 8 to your aim, resulting in a value of 10.
forward 2 adds 2 to your horizontal position, a total of 15. Because your aim is 10, your depth increases by 2*10=20 to a total of 60.
After following these new instructions, you would have a horizontal position of 15 and a depth of 60. (Multiplying these produces 900.)

Using this new interpretation of the commands, calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?

*/

function submarineInstructions (part, inputStr) {
  const inputArr = inputStr.split('\n').map(instruction => {
    const split = instruction.split(' ');
    return [split[0], +split[1]];
  });

  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  for (const [instruction, n] of inputArr) {
    if (instruction === 'forward') {
      if (part === 1) {
        horizontal += n;
      } else {
        horizontal += n;
        depth += (aim * n)
      }
    }
    else if (instruction === 'down') {
      if (part === 1) depth += n;
      else aim += n;
    }
    else if (instruction === 'up') {
      if (part === 1) depth -= n;
      aim -= n;
    }
    else throw 'INVALID INSTRUCTION';
  }
  return horizontal * depth;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = submarineInstructions;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

const actualInput = `forward 4
down 8
down 3
down 1
forward 8
up 6
down 4
forward 2
down 4
down 6
down 7
forward 1
down 4
down 6
forward 7
down 2
up 8
up 3
forward 1
forward 2
down 3
down 8
forward 6
forward 5
down 4
down 1
up 5
down 5
down 2
up 6
forward 4
forward 3
down 8
down 9
up 2
forward 1
forward 2
down 1
forward 3
down 7
up 6
down 1
down 7
down 5
forward 8
down 5
down 1
down 7
up 9
forward 6
up 8
down 3
down 9
down 3
forward 2
forward 1
forward 4
down 7
up 8
down 1
up 1
forward 4
down 7
forward 5
forward 2
forward 1
up 8
down 2
up 6
down 7
down 4
up 6
forward 2
forward 8
down 8
down 2
forward 2
forward 9
down 1
forward 5
down 4
forward 4
down 2
down 1
forward 7
down 1
down 5
down 5
up 5
forward 7
forward 6
forward 3
forward 9
forward 3
forward 5
down 8
down 9
forward 7
up 5
up 7
down 5
up 9
forward 9
up 8
up 2
forward 5
down 2
forward 2
down 4
up 4
down 2
up 3
up 8
down 3
down 4
down 7
forward 3
forward 9
down 1
down 2
down 5
down 1
forward 2
forward 2
up 8
down 4
forward 7
up 6
down 9
down 6
up 1
down 2
forward 6
down 4
up 1
forward 3
down 4
down 1
up 8
forward 3
down 5
up 2
down 8
down 4
up 2
down 2
forward 6
up 4
up 2
down 2
forward 7
down 5
forward 2
forward 8
up 3
forward 5
up 6
down 4
down 1
down 8
down 2
forward 8
up 2
down 5
up 8
down 1
down 1
down 5
up 4
down 1
down 3
down 8
forward 6
down 9
forward 6
up 2
forward 1
forward 9
down 9
down 3
down 9
down 6
down 4
down 8
forward 1
down 1
forward 2
up 2
forward 8
down 1
up 6
down 4
down 3
forward 8
up 7
down 6
down 1
down 2
forward 1
up 5
up 7
down 6
down 4
down 5
forward 9
down 7
down 9
down 5
forward 9
forward 7
forward 9
forward 8
up 4
forward 5
down 7
forward 8
up 1
forward 3
forward 2
forward 2
down 7
forward 9
down 7
down 9
forward 6
forward 8
up 5
up 8
up 7
up 6
forward 7
down 6
down 5
down 3
forward 7
down 7
forward 6
down 4
down 2
down 9
down 2
up 8
down 8
down 3
down 4
forward 3
up 6
down 9
forward 1
down 3
forward 9
down 6
forward 9
forward 8
forward 5
up 2
forward 5
up 7
down 6
forward 6
down 8
forward 2
down 7
down 8
up 1
forward 3
forward 5
down 3
forward 8
up 7
forward 9
forward 6
forward 1
forward 7
down 5
forward 3
down 5
down 6
down 7
down 3
down 8
up 5
forward 2
forward 5
up 7
up 4
forward 1
forward 1
down 1
down 7
forward 4
up 8
forward 5
down 9
up 7
forward 8
down 4
forward 4
forward 6
down 8
forward 7
down 1
forward 9
down 9
up 1
down 6
forward 6
down 7
down 4
forward 6
forward 3
down 5
up 5
up 7
up 5
down 6
forward 7
up 3
down 2
forward 6
down 8
down 7
up 9
forward 3
forward 1
down 8
forward 6
forward 4
up 9
forward 3
down 1
forward 4
forward 9
forward 2
forward 8
forward 1
forward 2
forward 7
down 6
forward 6
up 2
forward 5
up 8
down 9
up 8
down 5
down 1
down 6
up 4
down 4
down 5
up 6
down 8
down 8
forward 9
forward 8
forward 2
down 2
up 3
forward 2
down 8
down 8
forward 3
forward 5
down 9
down 2
forward 6
forward 7
down 7
forward 4
forward 2
down 1
down 6
up 5
down 2
forward 3
forward 9
down 9
down 3
forward 3
forward 6
down 2
forward 5
forward 7
down 6
forward 4
down 6
forward 6
forward 3
forward 3
forward 8
down 4
up 4
down 6
down 4
down 9
forward 7
forward 4
forward 7
down 3
forward 1
down 7
down 3
forward 1
down 7
down 5
forward 6
up 7
down 7
forward 5
forward 5
up 9
down 7
forward 1
forward 2
down 4
down 8
down 7
forward 4
forward 4
forward 3
down 8
down 7
down 8
forward 2
down 2
forward 2
forward 4
up 6
down 4
up 3
forward 7
down 9
down 3
forward 3
down 2
down 2
up 5
down 4
forward 3
forward 3
up 7
forward 8
forward 6
down 3
forward 2
down 6
up 1
down 7
down 7
forward 8
up 1
up 8
up 4
up 1
forward 4
forward 9
down 9
down 5
down 3
forward 8
down 3
forward 4
down 6
down 9
down 3
forward 6
up 1
up 4
forward 9
down 3
up 1
forward 4
up 1
forward 8
down 9
up 1
forward 3
down 7
down 7
down 3
forward 7
forward 5
down 8
up 8
down 6
down 4
forward 9
down 9
up 5
forward 6
down 8
up 8
down 2
forward 1
down 8
down 2
forward 7
forward 2
down 2
forward 5
up 2
down 6
down 1
down 6
down 3
up 4
forward 4
forward 8
down 3
forward 9
forward 6
down 2
up 2
down 2
up 4
down 8
forward 5
down 4
forward 3
down 4
forward 6
down 8
down 2
up 7
down 3
down 6
up 1
forward 8
up 5
down 1
forward 3
down 2
down 5
up 5
up 2
down 2
down 2
down 4
forward 3
up 7
forward 8
forward 4
down 3
forward 8
down 4
down 9
down 7
up 3
up 4
down 4
forward 3
down 3
up 5
down 1
forward 4
forward 9
forward 3
forward 3
up 6
down 3
forward 3
up 7
down 3
up 7
up 2
up 2
down 9
forward 4
forward 7
forward 7
down 7
forward 2
forward 1
down 9
forward 2
down 2
down 4
up 3
forward 8
up 3
down 7
forward 9
down 7
forward 2
down 1
up 9
forward 7
forward 9
up 4
forward 3
forward 1
down 5
down 6
forward 9
down 9
forward 2
forward 8
forward 4
forward 9
down 5
down 9
down 3
down 7
up 2
up 7
forward 6
down 3
down 2
up 1
forward 4
down 1
up 4
up 8
down 9
down 5
down 7
forward 4
down 1
forward 8
down 5
forward 7
down 3
up 2
forward 4
down 1
forward 4
up 5
forward 9
down 1
forward 7
up 3
up 9
forward 4
up 5
down 6
forward 2
down 1
forward 1
down 9
forward 5
down 2
up 3
down 5
up 4
down 5
down 8
down 8
down 3
forward 9
forward 2
down 3
down 3
down 6
down 8
forward 9
down 4
down 1
forward 4
down 9
forward 1
down 9
up 6
up 7
up 8
forward 5
down 3
up 5
up 1
down 8
forward 1
forward 7
up 9
down 7
forward 4
down 5
forward 2
down 6
up 8
down 1
down 6
down 9
down 8
forward 8
down 4
up 2
down 2
forward 9
up 6
down 3
forward 5
forward 9
up 2
up 5
down 5
forward 2
forward 3
forward 2
up 2
down 2
forward 9
up 4
down 4
up 1
down 1
down 6
down 6
forward 2
up 6
up 9
forward 7
forward 4
down 6
down 5
down 5
down 9
forward 7
down 1
up 5
forward 4
up 8
up 8
down 4
down 7
forward 1
forward 8
down 3
up 3
up 3
up 4
down 1
down 8
up 6
up 8
forward 2
down 2
down 3
forward 4
forward 3
forward 6
down 1
up 6
forward 2
forward 6
forward 2
forward 5
down 1
up 4
forward 7
down 6
forward 8
up 9
down 5
up 3
forward 8
forward 1
forward 9
up 9
forward 4
forward 5
down 1
up 9
down 5
down 7
forward 8
down 1
forward 3
forward 2
down 9
down 1
forward 5
up 6
down 7
forward 4
down 6
forward 1
forward 8
up 4
forward 5
down 8
forward 6
up 2
forward 3
forward 5
up 6
up 8
up 4
forward 6
down 2
down 6
down 5
up 2
down 3
down 7
up 6
forward 2
forward 3
up 6
forward 3
up 8
forward 6
down 8
down 7
down 1
down 6
up 8
up 9
down 4
forward 2
forward 7
down 8
up 6
up 8
up 8
down 4
forward 9
down 5
forward 5
forward 3
down 1
forward 1
up 9
down 1
down 6
up 6
forward 7
forward 1
down 5
down 2
forward 5
down 3
down 4
forward 6
up 6
down 9
up 3
forward 1
up 3
down 5
up 4
down 4
forward 9
up 5
down 1
forward 4
down 8
up 1
forward 9
forward 8
up 4
up 3
up 5
forward 5
up 7
forward 5
forward 4
forward 6
forward 9
down 6
down 3
up 5
forward 2
up 9
down 4
down 2
forward 5
up 6
forward 1
up 5
up 3
down 4
forward 3
forward 6
up 4
up 6
down 3
down 2
up 3
down 9
up 7
forward 6
up 4
forward 7
down 4
up 6
down 6
forward 9
forward 4
up 2
forward 7
up 5
forward 2
forward 2
down 4
down 4
forward 3
down 4
up 3
forward 9
down 5
forward 6
forward 9
forward 9
up 6
down 9
forward 8
up 7
up 5
down 6
forward 6
forward 1
down 6
forward 5
down 2
down 1
forward 6
down 6
down 9
down 5
forward 1
down 7
down 7
down 4
forward 7
up 5
up 1
up 2
up 5
down 3
forward 9
forward 2
forward 8
up 4
forward 7
forward 6
forward 9
down 2
down 6
forward 4
down 9
down 9
up 3
forward 2
forward 1
down 5
up 9
down 6
forward 6
down 8
forward 3
forward 5
forward 3
forward 2
down 7
down 2
up 8
forward 9
down 8
up 7
down 4
up 3
forward 6
down 3
up 3
down 6
down 3
up 2
down 4
down 4
up 2
down 6
down 5
down 9
down 1
down 7
up 9
down 4
up 6
down 6
forward 9
forward 2
down 8
down 3
forward 4
forward 4
forward 5
down 2
down 8
down 1
up 4
forward 9
up 7
forward 5
down 5
up 9
down 2
down 2
forward 4
forward 4
forward 8`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 150;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1648020;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 900;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1759818555;
test(func, input, expected, testNum, lowestTest, highestTest);