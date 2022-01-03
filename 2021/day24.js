/*

--- Day 24: Arithmetic Logic Unit ---

Magic smoke starts leaking from the submarine's arithmetic logic unit (ALU). Without the ability to perform basic arithmetic and logic functions, the submarine can't produce cool patterns with its Christmas lights!

It also can't navigate. Or run the oxygen system.

Don't worry, though - you probably have enough oxygen left to give you enough time to build a new ALU.

The ALU is a four-dimensional processing unit: it has integer variables w, x, y, and z. These variables all start with the value 0. The ALU also supports six instructions:

inp a - Read an input value and write it to variable a.
add a b - Add the value of a to the value of b, then store the result in variable a.
mul a b - Multiply the value of a by the value of b, then store the result in variable a.
div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.

In all of these instructions, a and b are placeholders; a will always be the variable where the result of the operation is stored (one of w, x, y, or z), while b can be either a variable or a number. Numbers can be positive or negative, but will always be integers.

The ALU has no jump instructions; in an ALU program, every instruction is run exactly once in order from top to bottom. The program halts after the last instruction has finished executing.

(Program authors should be especially cautious; attempting to execute div with b=0 or attempting to execute mod with a<0 or b<=0 will cause the program to crash and might even damage the ALU. These operations are never intended in any serious ALU program.)

For example, here is an ALU program which takes an input number, negates it, and stores it in x:

inp x
mul x -1

Here is an ALU program which takes two input numbers, then sets z to 1 if the second input number is three times larger than the first input number, or sets z to 0 otherwise:

inp z
inp x
mul z 3
eql z x

Here is an ALU program which takes a non-negative integer as input, converts it into binary, and stores the lowest (1's) bit in z, the second-lowest (2's) bit in y, the third-lowest (4's) bit in x, and the fourth-lowest (8's) bit in w:

inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2

Once you have built a replacement ALU, you can install it in the submarine, which will immediately resume what it was doing when the ALU failed: validating the submarine's model number. To do this, the ALU will run the MOdel Number Automatic Detector program (MONAD, your puzzle input).

Submarine model numbers are always fourteen-digit numbers consisting only of digits 1 through 9. The digit 0 cannot appear in a model number.

When MONAD checks a hypothetical fourteen-digit model number, it uses fourteen separate inp instructions, each expecting a single digit of the model number in order of most to least significant. (So, to check the model number 13579246899999, you would give 1 to the first inp instruction, 3 to the second inp instruction, 5 to the third inp instruction, and so on.) This means that when operating MONAD, each input instruction should only ever be given an integer value of at least 1 and at most 9.

Then, after MONAD has finished running all of its instructions, it will indicate that the model number was valid by leaving a 0 in variable z. However, if the model number was invalid, it will leave some other non-zero value in z.

MONAD imposes additional, mysterious restrictions on model numbers, and legend says the last copy of the MONAD documentation was eaten by a tanuki. You'll need to figure out what MONAD does some other way.

To enable as many submarine features as possible, find the largest valid fourteen-digit model number that contains no 0 digits. What is the largest model number accepted by MONAD?


--- Part Two ---

As the submarine starts booting up things like the Retro Encabulator, you realize that maybe you don't need all these submarine features after all.

What is the smallest model number accepted by MONAD?

*/

function ALU_computer (part, inputStr) {

  // PARSE DATA
  const inputArr = inputStr.split('\n').map(str => str.split(' '));

  // DEBUGGING
  const TESTING = inputArr.length < 20;                                             // distinguish between test cases and real case

  // HELPER FUNCTION - RUN THE INPUT SERIAL NUMBER
  function execute(num) {
    const numStr = String(num);
    if (!TESTING && (numStr.length !== 14 || numStr.includes('0'))) return null;
    
    let readIdx = 0;

    const data = {
      w: 0,
      x: 0,
      y: 0,
      z: 0 
    };

    for (const line of inputArr) {
      const operation = line[0];
      const operand1 = line[1];
      const operand2 = line[2] in data ? line[2] : +line[2];
      switch (operation) {
        case 'inp':
          data[operand1] = +(numStr[readIdx++]);
          break;
        case 'add':
          data[operand1] += (operand2 in data ? data[operand2] : operand2);
          break;
        case 'mul':
          data[operand1] *= (operand2 in data ? data[operand2] : operand2);
          break;
        case 'div':
          data[operand1] = Math.floor(data[operand1] / (operand2 in data ? data[operand2] : operand2));
          break;
        case 'mod':
          data[operand1] %= (operand2 in data ? data[operand2] : operand2);
          break;
        case 'eql':
          data[operand1] = (data[operand1] === (operand2 in data ? data[operand2] : operand2) ? 1 : 0);
          break;
      }
    }

    return data;
  }

  // IF TESTING: THE TEST INPUTS HAVE THE DESIRED inp INPUT ADDED TO THE FIRST LINE, SO SPLICE IT OUT AND RUN execute 
  if (TESTING) {
    const num = +(inputArr.splice(0, 1)[0]);
    return execute(num);
  }

  /*

    THIS PROBLEM WAS UNUSUAL IN THAT YOU HAD TO ANALYZE MANUALLY WHAT THE PROGRAM GIVEN BY THE INPUT IS DOING.

    MY WORK CAN BE FOUND HERE:
    https://docs.google.com/spreadsheets/d/1_roJRTZuZ1LDI-84AvCCQGahi4iJP_deIi1D5oLnIiQ/edit?usp=sharing

    in short, the instructions can be broken into approximately 14 different sections. within each section, there is an input command
    (which grabs the next digit from the input serial number). even a cursory glance should reveal that w stores the next available digit,
    and z stores some kind of accumulator. meanwhile, x and y largely get wiped at least once during each of the 14 sections.
    
    within each section, the code basically adds the current digit to some constant that was given in the previous block. furthermore,
    it adds another constant to it. from there, this digit + constant combo is stored in x and compared to the next digit which is already
    loaded into w. **this is the key determinant of what happens next.** but first, a quick note...
    
    we can also see that these two constants are thus two places, out of three, where the instructions for each block differ from one another.
    the third is whether the z value is divided by 1 (a no-op), or 26. the significance of this will become clear shortly.
    
    if and only if the next digit is equal to the first digit plus the constant, the resulting binary has the critical downstream effect of
    determining whether the accumulator in z gets approximately blown up by a factor of 26, or remains at the same order of 26. note that in
    7 of the 14 blocks, the constant paired with the first digit is large enough that the next digit could never equal their sum; it is precisely
    in these 7 cases where the accumulator's multiplication by 26 is inevitable that the accumulator's divisor is 1. however, in the other
    7 cases where the constant paired with the first digit is sufficiently small such that the next digit COULD actually equal their sum, the
    divisor is 26 instead of 1, and thus the ultimate value of z depends on whether the next digit actually has that precise relationship to the
    first digit: if so, then the accumulator does NOT multiply by 26, but DOES divide by 26; in all other cases, the accumulator will remain
    at the same order of 26.

    since valid MONAD numbers must have the accumulator, z, ultimately end up at 0, we cannot let the order of 26 blow up out of control. given
    that 7 of the 14 sections inevitably multiply the accumulator by 26, it is imperative that the other 7, the accumulator must divide by 26.
    therefore, the "special relationship" between the digits within each section MUST be true. out of the 2^7 = 128 possibilities, only the ones
    where all 7 special relationships hold true will ultimately result in z being 0.

    in the case of my input, from the spreadsheet, i derived the 7 equations as follows:
    (1) n5 = n4
    (2) n7 = n6 + 1
    (3) n9 = n8 + 2
    (4) n10 = n3 + 7
    (5) n12 = n11 - 1
    (6) n13 = n2 + 4
    (7) n14 = n1 - 2

    from there, using pen and paper, i concluded that the digits form 1-14 must have the following values:
    1. 3, ..., 9 (relates to n14)
    2. 1, ..., 5 (relates to n13)
    3. 1, 2 (relates to n10)
    4. any (must match n5)
    5. any (must match n4)
    6. 1, ..., 8 (relates to n7)
    7. 2, ..., 9 (relates to n6)
    8. 1, ..., 7 (relates to n9)
    9. 3, ..., 9 (relates to n8)
    10. 8, 9 (relates to n3)
    11. 2, ..., 9 (relates to n12)
    12. 1, ..., 8 (relates to n11)
    13. 5, ..., 9 (relates to n2)
    14. 1, ..., 7 (relates to n1)

    thus it is obvious that the highest valid number is 95299897999897 and the lowest valid number is 31111121382151.

  */

  // ONCE THE MAX / MIN NUMBERS WERE FOUND I USED THIS CODE TO TEST THEM
  // console.log(execute(95299897999897))
  // console.log(execute(31111121382151))
  // throw ""

  return part === 1 ? 95299897999897 : 31111121382151 ;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = ALU_computer;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput1 = `5
inp x
mul x -1`;

const sampleInput2 = `13
inp z
inp x
mul z 3
eql z x`;

const sampleInput3 = `12
inp z
inp x
mul z 3
eql z x`;

const sampleInput4 = `7
inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`;

const actualInput = `inp w
mul x 0
add x z
mod x 26
div z 1
add x 11
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 7
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 14
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 10
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 16
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 14
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -8
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 3
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 14
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 12
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -11
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 1
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 10
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -6
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -9
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 14
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 12
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 4
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -5
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 14
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -4
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 15
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -9
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 6
mul y x
add z y`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput1,
};
expected = { w: 0, x: -5, y: 0, z: 0 };
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
};
expected = { w: 0, x: 3, y: 0, z: 1 };
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
};
expected = { w: 0, x: 2, y: 0, z: 0 };
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
};
expected = { w: 0, x: 1, y: 1, z: 1 };
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 95299897999897;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 31111121382151;
test(func, input, expected, testNum, lowestTest, highestTest);