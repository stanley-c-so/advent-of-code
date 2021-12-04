/*

--- Day 3: Binary Diagnostic ---

The submarine has been making some odd creaking noises, so you ask it to produce a diagnostic report just in case.

The diagnostic report (your puzzle input) consists of a list of binary numbers which, when decoded properly, can tell you many useful things about the conditions of the submarine. The first parameter to check is the power consumption.

You need to use the binary numbers in the diagnostic report to generate two new binary numbers (called the gamma rate and the epsilon rate). The power consumption can then be found by multiplying the gamma rate by the epsilon rate.

Each bit in the gamma rate can be determined by finding the most common bit in the corresponding position of all numbers in the diagnostic report. For example, given the following diagnostic report:

00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
Considering only the first bit of each number, there are five 0 bits and seven 1 bits. Since the most common bit is 1, the first bit of the gamma rate is 1.

The most common second bit of the numbers in the diagnostic report is 0, so the second bit of the gamma rate is 0.

The most common value of the third, fourth, and fifth bits are 1, 1, and 0, respectively, and so the final three bits of the gamma rate are 110.

So, the gamma rate is the binary number 10110, or 22 in decimal.

The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used. So, the epsilon rate is 01001, or 9 in decimal. Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, 198.

Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)

==========

--- Part Two ---

Next, you should verify the life support rating, which can be determined by multiplying the oxygen generator rating by the CO2 scrubber rating.

Both the oxygen generator rating and the CO2 scrubber rating are values that can be found in your diagnostic report - finding them is the tricky part. Both values are located using a similar process that involves filtering out values until only one remains. Before searching for either rating value, start with the full list of binary numbers from your diagnostic report and consider just the first bit of those numbers. Then:

Keep only numbers selected by the bit criteria for the type of rating value for which you are searching. Discard numbers which do not match the bit criteria.
If you only have one number left, stop; this is the rating value for which you are searching.
Otherwise, repeat the process, considering the next bit to the right.
The bit criteria depends on which type of rating value you want to find:

To find oxygen generator rating, determine the most common value (0 or 1) in the current bit position, and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 1 in the position being considered.
To find CO2 scrubber rating, determine the least common value (0 or 1) in the current bit position, and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 0 in the position being considered.
For example, to determine the oxygen generator rating value using the same example diagnostic report from above:

Start with all 12 numbers and consider only the first bit of each number. There are more 1 bits (7) than 0 bits (5), so keep only the 7 numbers with a 1 in the first position: 11110, 10110, 10111, 10101, 11100, 10000, and 11001.
Then, consider the second bit of the 7 remaining numbers: there are more 0 bits (4) than 1 bits (3), so keep only the 4 numbers with a 0 in the second position: 10110, 10111, 10101, and 10000.
In the third position, three of the four numbers have a 1, so keep those three: 10110, 10111, and 10101.
In the fourth position, two of the three numbers have a 1, so keep those two: 10110 and 10111.
In the fifth position, there are an equal number of 0 bits and 1 bits (one each). So, to find the oxygen generator rating, keep the number with a 1 in that position: 10111.
As there is only one number left, stop; the oxygen generator rating is 10111, or 23 in decimal.
Then, to determine the CO2 scrubber rating value from the same example above:

Start again with all 12 numbers and consider only the first bit of each number. There are fewer 0 bits (5) than 1 bits (7), so keep only the 5 numbers with a 0 in the first position: 00100, 01111, 00111, 00010, and 01010.
Then, consider the second bit of the 5 remaining numbers: there are fewer 1 bits (2) than 0 bits (3), so keep only the 2 numbers with a 1 in the second position: 01111 and 01010.
In the third position, there are an equal number of 0 bits and 1 bits (one each). So, to find the CO2 scrubber rating, keep the number with a 0 in that position: 01010.
As there is only one number left, stop; the CO2 scrubber rating is 01010, or 10 in decimal.
Finally, to find the life support rating, multiply the oxygen generator rating (23) by the CO2 scrubber rating (10) to get 230.

Use the binary numbers in your diagnostic report to calculate the oxygen generator rating and CO2 scrubber rating, then multiply them together. What is the life support rating of the submarine? (Be sure to represent your answer in decimal, not binary.)

*/

function runDiagnostic (part, inputStr) {
  const inputArr = inputStr.split('\n');

  const lineLength = inputArr[0].length;
  const gammaArr = [];
  for (let i = 0; i < lineLength; ++i) {
    let countZero = 0;
    let countOne = 0;
    for (const line of inputArr) {
      if (line[i] === '0') ++countZero;
      else ++countOne;
    }
    gammaArr.push(countZero > countOne ? '0' : '1');
  }
  const gammaRate = parseInt(gammaArr.join(''), 2);
  
  if (part === 1) {

    const epsilonRate = 2**lineLength - 1 - gammaRate;  // epsilonRate is the complement of gammaRate such that their sum is equal to the binary num of all 1s
    return gammaRate * epsilonRate;

  } else {

    const OXYGEN = 'OXYGEN';
    const CO2 = 'CO2';

    function applyRule(rule, digit, numZero, numOne) {
      switch (rule) {
        case OXYGEN:
          return digit === (numZero > numOne ? '0' : '1');
        case CO2:
          return digit === (numZero > numOne ? '1' : '0');
      }
    }

    function getRating(rule) {
      let candidates = [...inputArr];
      let i = 0;
      while (candidates.length > 1) {
        if (i === lineLength) throw 'EXCEEDED LINE LENGTH';
        let countZero = 0;
        let countOne = 0;
        for (const candidate of candidates) {
          if (candidate[i] === '0') ++countZero;
          else ++countOne;
        }
        candidates = candidates.filter(line => applyRule(rule, line[i], countZero, countOne));
        ++i;
      }
      return candidates[0];
    }

    const oxygenRating = parseInt(getRating(OXYGEN), 2);
    const carbonDioxideRating = parseInt(getRating(CO2), 2);
    return oxygenRating * carbonDioxideRating;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = runDiagnostic;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const actualInput = `100101001000
011101110101
000001010101
001001010001
001101011110
010101001100
110110011111
100100110101
101010110110
001100001001
010100000001
011001010010
001011000011
001001100111
000000100011
100101101111
000100011011
110011000101
111101100100
001110000111
010110001010
110100011111
110011010000
010100100111
100011111101
111101000110
011000111111
001111001101
100100010000
111111110111
101111110110
110000011000
010101011011
001000100000
100011101100
001111001111
101000101010
110110000000
001101101001
000000001010
010101010111
010101110010
010000110101
001110001101
011110011010
011011100100
000111110110
100110101100
100001101111
100000010111
111100001111
110000101110
011000111011
001101000011
111110010001
101000111000
110111100110
101101011010
101111110010
110101111110
001011011001
001101010000
111001100110
100111001000
011110100101
011111000110
010010010101
001001001001
011111011101
100010000101
101111111010
000110100001
011001000110
101001010000
101001000001
100110111101
110011001011
010010100001
110001100010
111010000001
100011011110
101010011000
001000100100
100011001110
111110100010
101110001000
001100110001
010010101011
001011101111
101111011101
011100110000
101010011011
000011011010
101010111100
011101010001
111111101000
110110010000
100101000111
111010010011
010100111001
010110100101
100000010101
111110011000
011111011100
010001101110
110011110000
100101001100
100000000101
000011111101
001011100111
001111100110
000100111100
101110100101
010000111000
011001011111
011100100100
000011000100
111110111010
011111110000
110011000100
010010001111
001100111101
111101001001
100000110010
101110110011
100111010010
010001001001
010000001011
100001000001
010010010100
000000111101
001100010010
000111001110
000101010010
000010011000
001111011011
110001100000
011110101010
011000100110
110111011101
001001100010
110101000011
000011110100
100000011110
111100101001
111111101001
111110000101
110101100011
100101110100
001001011000
011000110100
110000001000
100100111011
110111001111
000110000111
011011110110
011100001011
111111111000
111001101000
011101010111
110011001100
001000000111
101011001001
000100101111
111110100111
100000011010
101100100100
110001000110
101100011110
110010011001
101000100110
001111110111
010011111100
000111101101
011010011110
101010010011
101000110011
011111001000
000001111000
111001110110
111110011101
101110101000
010010010110
011011110100
110100100011
000101000111
000110000000
001101010100
100101101000
101101001011
110101011010
010111100111
101100010111
111110001000
010101101000
100010001001
110100010000
100110000000
101101001100
100010111001
001101010001
000101000101
001110111000
011111011000
011001101100
111101101110
101000101011
000100111001
011101000111
100001111100
111000101101
011000001111
100101000010
010101100011
011111110001
010110100110
001101001100
100010101010
000110100111
000101100000
110001010101
110000110001
101000010001
010110011101
001011111000
010001000010
010010001101
010100100101
011100001111
111101101111
111100101100
010011100110
100001101110
111110110110
011100100101
010000010000
001011100000
011110010001
001000110001
111011100111
111101011011
100111010001
101100010110
100010101101
101111011111
000100111000
000111100011
111100001101
111101010100
111011111101
001101001011
100100100111
111011011101
111110011001
100110110001
011110111011
110010000011
001110000010
010100111111
001000001011
000101001000
111110000001
101110110000
111110101001
110110111110
011010110011
010011000100
110110111101
111101001000
011000010100
101010010010
111000001111
100110111111
100011100110
101001000111
101000000011
101100011011
001111010101
110100010001
111001001010
101110110010
000011001110
101000000110
010010011001
000111101100
000010010111
001100101010
001010110000
010100011000
010000010101
111100010111
011010010110
111111110001
001111000100
010001100111
010011111010
101101101101
110100100001
011101001110
000010001111
011000110101
010011100100
011111000101
111011110010
101100101011
001001000010
101011111110
110111011010
100111100100
010101011110
100111010011
100100011101
001101000111
101001010100
001000101100
100101101101
101111011100
011011111001
001100111011
100100000110
111111001110
011111000011
100000101010
001110111101
010110111100
010000010001
101010100000
011001100001
100000010100
100111001110
010011110100
001010010000
000110011100
111001110100
010110001110
101110101011
010010111101
111111100001
110100101000
111010100100
001001101010
011011011111
011001111001
110110001100
101000001100
000101010001
100010010111
101110000111
111010101001
100100111010
111100101010
101111010100
111000011001
001100101001
101000000000
110110011110
111011110001
110000110000
011001100011
101100111101
101010101110
011011101011
101001011101
110000110100
010010101100
001110111010
011111001010
001100100110
001111101001
000001111110
110000111001
000111001111
100001111010
111011101111
101001110001
101010101001
011001011000
001001010011
100100111000
011101011010
110001101010
100000100011
001000101001
001110011100
001001111100
001001110110
001010100011
011010101100
011101110100
110100111000
101100000111
010001100010
100011000111
010010000010
011110110100
110000000110
010100100110
101000001111
011110001101
100111011100
100000100111
101110000001
000111110100
001011001101
011110101001
110011011111
100011011011
100100111001
110010100001
000000010110
011011100011
001000111100
100000100110
001000100110
111011000101
011010000110
001000000010
010100101001
011110101110
111111100111
000010001110
101100010101
011101110001
001011110101
000100001010
000101011010
011111110110
101100001000
010101010000
001101111111
010011110101
001101111101
100100100011
111111011101
101101100110
011100001110
011101010110
001110001100
000111100100
111110011111
100010001011
011001100100
110000101000
000001010110
111110110101
111101101101
001001101111
101010111010
011010110100
010100110000
010100100011
010011011010
111111001101
101000100010
000001010100
100011010001
001100000100
111101011010
000100000111
100011100000
000100110101
100111001011
011111100001
110011011010
111011000100
000101111000
000010001010
000110111001
100011011101
101011010000
011100111011
000011100110
001111100101
001001111110
001000110011
110111011100
101000100111
100010100000
111000000100
101010011100
101110111110
000000110110
110111011111
101011110000
111000100110
000011111111
010101100001
001110011001
011011011110
110111111110
000111001010
100000110100
001001111000
011010111010
111100000000
000110010111
100001010100
000010001100
001001011111
100000011011
111011110011
101101110001
100101011010
111110101010
000000111001
010100101110
011110000001
001001010110
110110111010
011101000010
011111010100
000101101100
010101111101
110011111100
000010010101
000010100000
101100100000
010010010000
111001110011
101100111001
000010110000
000100010111
011101111110
110000011011
011100011011
110000010101
010010110101
111101110100
010010000101
110010000010
110101010000
010101000101
110101010001
101010100111
010100110111
110011010110
010001011011
011111001101
001100100011
110000010111
110000010110
110111011000
111000000110
000101000010
000101110011
111010100011
000111011111
001110000110
110010011111
100001111000
110110011010
100000111110
110000100001
111101000001
001101001110
000000111000
000010100100
101001011110
010110101010
001010010111
011011100101
001100010100
010011100010
001000010011
010111101000
011000011000
000101100100
010101100101
010111110001
001000100010
001010110100
111011000001
011110001111
010111100001
111010010100
000000100101
111110000111
010010101010
010011000001
111011010000
100101011001
011000000011
100101100101
100101011011
001000100011
101111001000
100110001001
001011001011
000000000001
111011110100
100101001001
111100100110
011010010011
011000000001
100111001100
101001100000
100000011101
000110100000
010110011100
010000010100
101111110011
001101101100
111010111000
000000101110
101001111101
101000110111
101111101001
010101110001
100011010010
111110001100
111111000000
000101111001
100111101101
001111110000
001010101101
111001101110
000011000010
011000010000
101101010000
010001101100
000011010111
000010101010
101001101001
110011001110
000101110100
100001110000
001100011110
101100110001
011010011000
000010111010
001001100100
010111001110
111101010001
111000001001
101100101110
001011101011
001100010001
100110101110
011000001001
111001111101
101110100100
010111011011
010110111010
000011101100
010001011100
011100101011
100001000100
000111000101
001110100010
111100000101
011101101000
110011110110
110110100110
110010001111
101111111011
101111011110
010011100101
010101101010
000001100010
101101001101
111001010010
100110110011
111000111010
100000110000
011100101100
011000110111
101101100011
001000010000
000101101010
010100101111
011010111111
010111011100
100010001100
111011001011
011000000111
011101100101
011001100101
101111010010
100011011001
100111110010
000010010100
000010000001
111011010001
101111001010
001110000100
111100100001
011100000110
000000110111
101100001100
100111110001
010011010111
111111010101
101110101001
010011111101
101011101110
000011000110
111001001111
111101101000
001111101100
011000011111
101100000010
011100110110
001110110001
011111100000
010001010010
111001111110
010100010110
101010100101
111001101010
110110101011
110010011010
110111101011
111101110000
001010100101
001101001000
110101101001
101100010011
011001011001
000110010000
000011000001
000011000101
100100100001
001101101101
000100001111
111100110111
010000111110
111110011010
001101110111
100101111000
000110110100
111110010100
010011001100
101100010100
110011101110
011001101110
110001001011
010000000101
100110101101
000011011111
001101110011
111001001101
011000010110
001010101110
001010010110
101000000101
111101111111
110001001000
001100010110
110001000101
111010001011
011001001011
001011011011
111100001001
101101110101
111010111011
100000111101
100111000000
001110111110
100110010000
101110000000
011101101010
001010011011
001100101100
101011101001
110001000011
011100010111
100001010111
101001110111
000100000001
000100101101
101110101100
000111011001
101011111010
100101010101
010100010111
010000100101
110011000010
001110001111
000010110001
010000100010
111111001000
111000110111
001100010101
000110111100
001100101111
110011111101
001100011010
110000100011
101001101111
111101100101
110100010101
100110001010
001000000000
110111100000
110001001001
001000011101
100000101101
010111001010
000001101000
111000001110
011001010100
000110000001
110110010100
101001001111
101010100010
111010110000
010000001110
111011001101
111111101101
001001100011
110001101111
110111111101
000100010001
101000010100
011011001110
101101101010
011010000100
110000110111
110100010100
100010010001
100111110111
011001111101
010001111100
000110111111
001011100100
110011101100
001101100011
101001100001
110011111111
111000011110
000110101110
101100001101
010010010111
000000101111
010010110110
111111010100
010101101001
110011100110
000101001001
111001111010
111101111110
011011101001
101010010111
101111001111
100101111011
001101110100
011111110101
000101010111
000101000011
010001101010
010101110110
010010100011
011100100010
001101000101
101010001111
000111111010
111010110011
110010100000
011111111111
111001010001
111010000100
000010100001
001100011011
010010000000
100111101000
011010101010
101011101011
010001100101
001011100010
111111110100
001011011010
100111101111
000001110111
110101010101
100111011110
101011100011
001110010011
100101000000
000100001110
001000111000
100011111100
011000010101
100000000111
100011001010
010100110010
011100010101
110001100101
000011100100
111100111001
001100111100
001011101001
101011001101
001001001111
100010110000
010000001111
001101101000
111100101111
111100100100
000001000101
100010000010
110101010110
111111100010
000010110111
000111110011
000010101000
111000001100
101110001011
100000010001
010010110111
011101110111
100001000110
011111101101
111101110010
110100001000
100010111000
000001011010
110010100011
001001011100
111011100010
110110001111
011111110011
011011010100
100000110101
100110000001
100111101100
010101001110
101101111011
001000110100
010110111000
110000100110
100001000101
101000001101
110001011110
110000010100
111111011110
000000010000
001110100100
100100000000
111000011010
000010111100
000101100001
100000011100
111101100011
000011000000
001100001100
100001101011
010100010010
111010101111
101100001011
010110111111
010110110010
000111111111
010100001001
101110011101
011000101101
000100001011
000000101011
100011000101
011010101000
010110000000
001011111010
010011011011
011111100100
000110011101
010001000100
111010110010
111101110101
101001110010
010101001111
001000010010
001101001001
011011000010
010110100111
001000111101
101011001011
110110110101
011110011111
111000111101
100011001011
001111111011
011111010010
000101100011
000010111001
011011010010
010100011010
111111001111
010001110100
110001111011
100011000100
101101000100
001110100111
000101101011
000100001001
110101110110
100000101011
010000000000
011010100000
110011001111
010110110111
100000001001`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 198;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2648450;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 230;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2845944;
test(func, input, expected, testNum, lowestTest, highestTest);