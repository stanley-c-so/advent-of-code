/*

--- Day 21: Monkey Math ---

The monkeys are back! You're worried they're going to try to steal your stuff again, but it seems like they're just holding their ground and making various monkey noises at you.

Eventually, one of the elephants realizes you don't speak monkey and comes over to interpret. As it turns out, they overheard you talking about trying to find the grove; they can show you a shortcut if you answer their riddle.

Each monkey is given a job: either to yell a specific number or to yell the result of a math operation. All of the number-yelling monkeys know their number from the start; however, the math operation monkeys need to wait for two other monkeys to yell a number, and those two other monkeys might also be waiting on other monkeys.

Your job is to work out the number the monkey named root will yell before the monkeys figure it out themselves.

For example:

root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32

Each line contains the name of a monkey, a colon, and then the job of that monkey:

A lone number means the monkey's job is simply to yell that number.
A job like aaaa + bbbb means the monkey waits for monkeys aaaa and bbbb to yell each of their numbers; the monkey then yells the sum of those two numbers.
aaaa - bbbb means the monkey yells aaaa's number minus bbbb's number.
Job aaaa * bbbb will yell aaaa's number multiplied by bbbb's number.
Job aaaa / bbbb will yell aaaa's number divided by bbbb's number.

So, in the above example, monkey drzm has to wait for monkeys hmdt and zczc to yell their numbers. Fortunately, both hmdt and zczc have jobs that involve simply yelling a single number, so they do this immediately: 32 and 2. Monkey drzm can then yell its number by finding 32 minus 2: 30.

Then, monkey sjmn has one of its numbers (30, from monkey drzm), and already has its other number, 5, from dbpl. This allows it to yell its own number by finding 30 multiplied by 5: 150.

This process continues until root yells a number: 152.

However, your actual situation involves considerably more monkeys. What number will the monkey named root yell?


--- Part Two ---

Due to some kind of monkey-elephant-human mistranslation, you seem to have misunderstood a few key details about the riddle.

First, you got the wrong job for the monkey named root; specifically, you got the wrong math operation. The correct operation for monkey root should be =, which means that it still listens for two numbers (from the same two monkeys as before), but now checks that the two numbers match.

Second, you got the wrong monkey for the job starting with humn:. It isn't a monkey - it's you. Actually, you got the job wrong, too: you need to figure out what number you need to yell so that root's equality check passes. (The number that appears after humn: in your input is now irrelevant.)

In the above example, the number you need to yell to pass root's equality test is 301. (This causes root to get the same number, 150, from both of its monkeys.)

What number do you yell to pass root's equality test?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function dependencyChain (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const MEMO = {};
  const REF = {};
  const MONKEY_DEPENDENT_ON = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ monkey, expression ] = line.split(': ');
    const split = expression.split(' ');

    if (split.length === 1) {
      MEMO[monkey] = +split[0];
    } else {

      // PART 1: save a reference to this monkey's expression
      REF[monkey] = split;

      // PART 2: save dependency information to form dependency chain
      const [A, operator, B] = split;

      // NOTE: i initially had the values inside MONKEY_DEPENDENT_ON as a set, in case there were multiple monkeys dependent on the same given monkey. however,
      // after inspecting the example and the real data, it became clear that the dependencies were always linear chains (i.e. there was at most one monkey
      // dependent on any given monkey). this allowed me to simplify my data structure and code, and add a sanity check after the fact.

      if (A in MONKEY_DEPENDENT_ON) {
        throw `ERROR: KEY ${A} SHOULD NOT BE IN DEPENDENCY OBJECT YET, AS THERE SHOULD BE NO DUPLICATES`;
      }
      if (B in MONKEY_DEPENDENT_ON) {
        throw `ERROR: KEY ${B} SHOULD NOT BE IN DEPENDENCY OBJECT YET, AS THERE SHOULD BE NO DUPLICATES`;
      }
      MONKEY_DEPENDENT_ON[A] = monkey;
      MONKEY_DEPENDENT_ON[B] = monkey;
    }
  }

  // PART 2: CREATE DEPENDENCY CHAIN TO HELP WORK OUT THE ORDER TO SOLVE THE ALGEBRAIC EXPRESSION
  const DEPENDENCY_CHAIN = [ ];
  const stack = [ 'humn' ];
  while (stack.length) {
    const monkey = stack.pop();
    const dependent = MONKEY_DEPENDENT_ON[monkey];
    if (dependent !== 'root') {
      DEPENDENCY_CHAIN.push(dependent);
      stack.push(dependent);
    }
  }

  // HELPER FUNCTION: RETURNS VALUE CALLED OUT BY THE GIVEN MONKEY
  function go(MONKEY, part) {

    // PART 2 OVERRIDES: original 'humn' value is replaced with 'X', and original 'root' expression's operator gets replaced with `===`
    if (part === 2) {
      if (MONKEY === 'humn') {
        MEMO['humn'] = 'X';
      }
      if (MONKEY === 'root') {
        const [ A, operator, B ] = REF[MONKEY];
        MEMO['root'] = `${go(A, 2)} === ${go(B, 2)}`;
      }
    }

    // CACHE MISS
    if (!(MONKEY in MEMO)) {                                                    // NOTE: any monkey associated with a literal number from input data will not be a cache miss

      const [ A, operator, B ] = REF[MONKEY];    
      const LS = go(A, part);
      const RS = go(B, part);

      if (part === 2 && [typeof LS, typeof RS].includes('string')) {            // PART 2: any expression involving X (value of humn) should be saved as a string expression

        const ls = typeof LS === 'string' ? `(${LS})` : LS;                     // add parentheses around string expressions
        const rs = typeof RS === 'string' ? `(${RS})` : RS;                     // note that with our data having a linear dependency chain, monkeys will only have at most one side as a string

        switch (operator) {                                                     // build out new string expression
          case '+':
            MEMO[MONKEY] = `${ls} + ${rs}`;
            break;
          case '-':
            MEMO[MONKEY] = `${ls} - ${rs}`;
            break;
          case '*':
            MEMO[MONKEY] = `${ls} * ${rs}`;
            break;
          case '/':
            MEMO[MONKEY] = `${ls} / ${rs}`;
            break;
          default:
            throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
        }

      } else {                                                                  // PART 1, or PART 2 values not connected to X

        switch (operator) {
          case '+':
            MEMO[MONKEY] = LS + RS;
            break;
          case '-':
            MEMO[MONKEY] = LS - RS;
            break;
          case '*':
            MEMO[MONKEY] = LS * RS;
            break;
          case '/':
            if (LS % RS !== 0) {                                                // sanity check: any expressions involving division will always be evenly divisible
              throw `${go(A, part)} not divisible by ${go(B, part)}`;
            }
            MEMO[MONKEY] = LS / RS;
            break;
          default:
            throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
        }

      }
    }

    return MEMO[MONKEY];
  }

  // ANALYZE
  if (part === 1) {                                                             // PART 1: RETURN THE VALUE ASSOCIATED WITH MONKEY 'root'

    return go('root', part);                                                    // invoke helper function to ultimately return value associated with monkey 'root'

  } else {                                                                      // PART 2: IGNORE 'humn' VALUE. INSTEAD, FIND WHAT IT NEEDS TO BE IN ORDER FOR 'root' MATCH EXPRESSION TO WORK

    // separate the literal and string expression parts of root expression
    const [LS, RS] = go('root', part)                                           // invoke helper function to fill out MEMO data structure and get ` === ` expression belonging to monkey 'root'
                      .split(' === ')
                      .map(n => +n);                                            // cast both sides to numbers (string expressions will become NaN)

    if (isNaN(LS) && isNaN(RS)) {
      throw 'ERROR: BOTH SIDES OF ROOT EXPRESSION ARE NOT LITERAL NUMBERS';
    }

    let LITERAL_VALUE = isNaN(LS) ? RS : LS;

    // now traverse the dependency chain, algebraically 'undoing' the literal portion of the string expression, and applying the same transformation to the literal value.
    // eventually the evolving string expression will become '(X)', and the evolving literal value will be what X equals, which solves PART 2.
    while (DEPENDENCY_CHAIN.length) {
      
      const expression = MEMO[ DEPENDENCY_CHAIN.pop() ];
      const split = expression.split(' ');

      let LITERAL_NUM_IS_ON_LEFT,                                               // every expression itself should have one half be a literal number, and the other half another expression wrapped in parens
          number,
          operator;

      if (split[0][0] === '(') {                                                // expression is in the form of: ( ...something involving X ) o N, where o is operator, N is literal number
        LITERAL_NUM_IS_ON_LEFT = false;
        number = +split.at(-1);                                                 // literal number is at the far right...
        operator = split.at(-2);                                                // ...and operator is to its left
      }
      else if (split.at(-1).at(-1) === ')') {                                   // expression is in the form of: N o ( ...something involving X ), where o is operator, N is literal number
        LITERAL_NUM_IS_ON_LEFT = true;
        number = +split[0];                                                     // literal number is at the far left...
        operator = split[1];                                                    // ...and operator is to its right
      }
      else throw `ERROR: EXPRESSION DOES NOT ITSELF HAVE A PORTION CONSISTING OF A PARENTHESES-WRAPPED EXPRESSION: ${expression}`;

      switch (operator) {                                                       // transform old LITERAL_VALUE into new LITERAL_VALUE, which is what expression equals
        case '+':
          LITERAL_VALUE -= number;                                              // N + expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE - N
          break;
        case '-':
          LITERAL_VALUE = LITERAL_NUM_IS_ON_LEFT  ? number - LITERAL_VALUE      // N - expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = N - LITERAL_VALUE
                                                  : LITERAL_VALUE + number;     // expression - N = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE + N
          break;
        case '*':
          LITERAL_VALUE /= number;                                              // N * expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE / N
          break;
        case '/':
          LITERAL_VALUE = LITERAL_NUM_IS_ON_LEFT  ? number / LITERAL_VALUE      // N / expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = N / LITERAL_VALUE
                                                  : LITERAL_VALUE * number;     // expression / N = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE * N
          break;
        default:
          throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
      }
    }

    return LITERAL_VALUE;
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = dependencyChain;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const { fail } = require('assert');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 152;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 158731561459602;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 301;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3769668716709;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);