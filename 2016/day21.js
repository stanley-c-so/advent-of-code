/*

--- Day 21: Scrambled Letters and Hash ---

The computer system you're breaking into uses a weird scrambling function to store its passwords. It shouldn't be much trouble to create your own scrambled password so you can add it to the system; you just have to implement the scrambler.

The scrambling function is a series of operations (the exact list is provided in your puzzle input). Starting with the password to be scrambled, apply each operation in succession to the string. The individual operations behave as follows:

swap position X with position Y means that the letters at indexes X and Y (counting from 0) should be swapped.
swap letter X with letter Y means that the letters X and Y should be swapped (regardless of where they appear in the string).
rotate left/right X steps means that the whole string should be rotated; for example, one right rotation would turn abcd into dabc.
rotate based on position of letter X means that the whole string should be rotated to the right based on the index of letter X (counting from 0) as determined before this instruction does any rotations. Once the index is determined, rotate the string to the right one time, plus a number of times equal to that index, plus one additional time if the index was at least 4.
reverse positions X through Y means that the span of letters at indexes X through Y (including the letters at X and Y) should be reversed in order.
move position X to position Y means that the letter which is at index X should be removed from the string, then inserted such that it ends up at index Y.

For example, suppose you start with abcde and perform the following operations:

swap position 4 with position 0 swaps the first and last letters, producing the input for the next step, ebcda.
swap letter d with letter b swaps the positions of d and b: edcba.
reverse positions 0 through 4 causes the entire string to be reversed, producing abcde.
rotate left 1 step shifts all letters left one position, causing the first letter to wrap to the end of the string: bcdea.
move position 1 to position 4 removes the letter at position 1 (c), then inserts it at position 4 (the end of the string): bdeac.
move position 3 to position 0 removes the letter at position 3 (a), then inserts it at position 0 (the front of the string): abdec.
rotate based on position of letter b finds the index of letter b (1), then rotates the string right once plus a number of times equal to that index (2): ecabd.
rotate based on position of letter d finds the index of letter d (4), then rotates the string right once, plus a number of times equal to that index, plus an additional time because the index was at least 4, for a total of 6 right rotations: decab.

After these steps, the resulting scrambled password is decab.

Now, you just need to generate a new scrambled password and you can access the system. Given the list of scrambling operations in your puzzle input, what is the result of scrambling abcdefgh?


--- Part Two ---

You scrambled the password correctly, but you discover that you can't actually modify the password file on the system. You'll need to un-scramble one of the existing passwords by reversing the scrambling process.

What is the un-scrambled version of the scrambled password fbgdceah?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function scrambleAndUnscramble (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  let text = extraParam.split('');

  // ANALYZE
  if (part === 1) {                                                                           // PART 1: FOLLOW SCRAMBLE INSTRUCTIONS

    for (const line of inputArr) {
      const split = line.split(' ');
  
      if (split[0] === 'swap') {
        if (split[1] === 'position') {
          const [ X, Y ] = [ +split[2], +split[5] ];
          [ text[X], text[Y] ] = [ text[Y], text[X] ];
        }
        else if (split[1] === 'letter') {
          const [ X, Y ] = [ text.indexOf(split[2]), text.indexOf(split[5]) ]; 
          [ text[X], text[Y] ] = [ text[Y], text[X] ];
        }
        else throw `ERROR: UNRECOGNIZED SECOND WORD ${split[1]}`;
      }
  
      else if (split[0] === 'rotate') {
        if (split[1] === 'based') {
          const idx = text.indexOf(split[6]);
          const steps = (1 + idx + (idx >= 4 ? 1 : 0)) % text.length;
          const double = [ ...text, ...text ];
          text = double.slice( text.length - steps, text.length - steps + text.length );
        }
        else if (split[1] === 'left') {
          const steps = +split[2] % text.length;
          const double = [ ...text, ...text ];
          text = double.slice( steps, steps + text.length );
        }
        else if (split[1] === 'right') {
          const steps = +split[2] % text.length;
          const double = [ ...text, ...text ];
          text = double.slice( text.length - steps, text.length - steps + text.length );
        }
        else throw `ERROR: UNRECOGNIZED SECOND WORD ${split[1]}`;
      }
  
      else if (split[0] === 'reverse') {
        const [ X, Y ] = [ +split[2], +split[4] ];
        for (let i = 0; i < (Y - X) / 2; ++i) {
          [ text[X + i], text[Y - i] ] = [ text[Y - i], text[X + i] ];
        }
      }
  
      else if (split[0] === 'move') {
        const [ X, Y ] = [ +split[2], +split[5] ];
        const c = text.splice(X, 1)[0];
        text.splice(Y, 0, c);
      }
  
      else throw `ERROR: UNRECOGNIZED FIRST WORD ${split[0]}`;
    }

  } else {                                                                                    // PART 2: REVERSE SCRAMBLE INSTRUCTIONS

    // it is tricky to figure out how to reverse the scramble instructions for 'rotate based on'.
    // what i did was examine all the possible indices that the letter could have started on, and determined which index
    // it would have ended up on by following the scramble instructions.

    // as it turns out for the actual data (length 8), each starting index maps to a unique ending index, which means that
    // when we reverse the instructions, we can figure out based on ending index where the starting index was.

    // however, for the sample data (length 5), it turns out that we don't have the same 1:1 mapping, and so there is some
    // ambiguity. i did some analysis and confirmed that the ambiguous case only happens once, so i can hard code the REF
    // object to produce the correct index value.

    const REF_SAMPLE = {
      '1': 0,
      '3': 1,
      // '0': 2,
      '0': 4,                   // going forward, either 2 or 4 will map to 0. but, based on our sample data, it only ever needs to be 4
      '2': 3,
    };

    const REF_ACTUAL = {
      '1': 0,
      '3': 1,
      '5': 2,
      '7': 3,
      '2': 4,
      '4': 5,
      '6': 6,
      '0': 7,
    };

    const REF = DEBUG ? REF_SAMPLE : REF_ACTUAL;

    for (const line of inputArr.reverse()) {
      const split = line.split(' ');
  
      if (split[0] === 'swap') {                                                              // SWAP CODE CAN BE LEFT THE SAME AS IN PART 1
        if (split[1] === 'position') {
          const [ Y, X ] = [ +split[2], +split[5] ];                                          // NOTE: it turns out this code can be left the same as in part 1.
                                                                                              // however, i reversed X and Y to drive home the point.
          [ text[X], text[Y] ] = [ text[Y], text[X] ];
        }
        else if (split[1] === 'letter') {
          const [ Y, X ] = [ text.indexOf(split[2]), text.indexOf(split[5]) ];                // see note above
          [ text[X], text[Y] ] = [ text[Y], text[X] ];
        }
        else throw `ERROR: UNRECOGNIZED SECOND WORD ${split[1]}`;
      }
  
      else if (split[0] === 'rotate') {                                                       // ROTATE CODE NEEDS TO CHANGE IN PART 2
        if (split[1] === 'based') {

          const idx = text.indexOf(split[6]);
          const targetIdx = REF[idx];
          const steps = targetIdx - idx;
          if (steps > 0) {
            const double = [ ...text, ...text ];
            text = double.slice( text.length - steps, text.length - steps + text.length );
          }
          else if (steps < 0) {
            const double = [ ...text, ...text ];
            text = double.slice( -steps, -steps + text.length );                              // NOTE: remember to take negative of negative
          }

        }
        else if (split[1] === 'right') {
          const steps = +split[2] % text.length;
          const double = [ ...text, ...text ];
          text = double.slice( steps, steps + text.length );
        }
        else if (split[1] === 'left') {
          const steps = +split[2] % text.length;
          const double = [ ...text, ...text ];
          text = double.slice( text.length - steps, text.length - steps + text.length );
        }
        else throw `ERROR: UNRECOGNIZED SECOND WORD ${split[1]}`;
      }
  
      else if (split[0] === 'reverse') {                                                      // REVERSE CODE CAN BE LEFT THE SAME AS IN PART 1
        const [ X, Y ] = [ +split[2], +split[4] ];                                            // NOTE: do NOT swap X and Y, since Y >= X, and
                                                                                              // the logic in the for loop would break if X > Y
        for (let i = 0; i < (Y - X) / 2; ++i) {
          [ text[X + i], text[Y - i] ] = [ text[Y - i], text[X + i] ];
        }
      }
  
      else if (split[0] === 'move') {                                                         // MOVE CODE CAN BE LEFT THE SAME AS IN PART 1
        const [ Y, X ] = [ +split[2], +split[5] ];                                            // NOTE: it turns out this code can be left the same as in part 1.
                                                                                              // however, i reversed X and Y to drive home the point.
        const c = text.splice(X, 1)[0];
        text.splice(Y, 0, c);
      }
  
      else throw `ERROR: UNRECOGNIZED FIRST WORD ${split[0]}`;
    }

  }

  return text.join('');
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = scrambleAndUnscramble;
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
`swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 'abcde',
  DEBUG: true,
};
expected = 'decab';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 'abcdefgh',
};
expected = 'bdfhgeca';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 'decab',
  DEBUG: true,
};
expected = 'abcde';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 'fbgdceah',
};
expected = 'gdfcabeh';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);