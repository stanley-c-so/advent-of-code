// --- Day 18: Operation Order ---

// As you look out the window and notice a heavily-forested continent slowly appear over the horizon, you are interrupted by the child sitting next to you. They're curious if you could help them with their math homework.

// Unfortunately, it seems like this "math" follows different rules than you remember.

// The homework (your puzzle input) consists of a series of expressions that consist of addition (+), multiplication (*), and parentheses ((...)). Just like normal math, parentheses indicate that the expression inside must be evaluated before it can be used by the surrounding expression. Addition still finds the sum of the numbers on both sides of the operator, and multiplication still finds the product.

// However, the rules of operator precedence have changed. Rather than evaluating multiplication before addition, the operators have the same precedence, and are evaluated left-to-right regardless of the order in which they appear.

// For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are as follows:

// 1 + 2 * 3 + 4 * 5 + 6
//   3   * 3 + 4 * 5 + 6
//       9   + 4 * 5 + 6
//          13   * 5 + 6
//              65   + 6
//                  71

// Parentheses can override this order; for example, here is what happens if parentheses are added to form 1 + (2 * 3) + (4 * (5 + 6)):

// 1 + (2 * 3) + (4 * (5 + 6))
// 1 +    6    + (4 * (5 + 6))
//      7      + (4 * (5 + 6))
//      7      + (4 *   11   )
//      7      +     44
//             51

// Here are a few more examples:

// 2 * 3 + (4 * 5) becomes 26.
// 5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 437.
// 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 12240.
// ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 13632.

// Before you can help with the homework, you need to understand it yourself. Evaluate the expression on each line of the homework; what is the sum of the resulting values?

// --- Part Two ---

// You manage to answer the child's questions and they finish part 1 of their homework, but get stuck when they reach the next section: advanced math.

// Now, addition and multiplication have different precedence levels, but they're not the ones you're familiar with. Instead, addition is evaluated before multiplication.

// For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are now as follows:

// 1 + 2 * 3 + 4 * 5 + 6
//   3   * 3 + 4 * 5 + 6
//   3   *   7   * 5 + 6
//   3   *   7   *  11
//      21       *  11
//          231

// Here are the other examples from above:

// 1 + (2 * 3) + (4 * (5 + 6)) still becomes 51.
// 2 * 3 + (4 * 5) becomes 46.
// 5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 1445.
// 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 669060.
// ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 23340.

// What do you get if you add up the results of evaluating the homework problems using these new rules?

function addAllExpressions (part, inputStr) {
  const inputArr = inputStr.split('\n');

  // DEFINE calculate UTILITY FUNCTION WHICH EVALUATES A STRING EXPRESSION
  function calculate(expression) {

    // WITHIN IT, DEFINE calculateSimple UTILITY FUNCTION WHICH EVALUATES A STRING EXPRESSION **THAT MUST NOT CONTAIN PARENTHESES**
    function calculateSimple(simpleExpression) {

      if (part === 1) {                                                             // PART 1: + AND * OPERATIONS HAVE EQUAL PRECEDENCE

        let runningTotal = null;                                                    // this stores the running total before the current operand
        let operator = null;                                                        // this stores the most recent operator before the current one
        let numStr = "";                                                            // this stores the current operand in string form (gets built up as input is read)

        for (let i = 0; i <= simpleExpression.length; ++i) {                        // iterate through the string, and also include final iteration when i is out of bounds
          const char = i < simpleExpression.length ? simpleExpression[i] : null;
          if (char && "0" <= char && char <= "9") {                                 // if i is in bounds and char is a digit...
            numStr += char;                                                         // ...concatenate it to the current numStr
          } else {                                                                  // else, char is an operator, or i is out of bounds
            const currentOperand = +numStr;                                         // it's time to typecast numStr and do something with this number
            switch (operator) {                                                     // apply the most recent operation between the most recent operand and the current one:
              case "+":
                runningTotal += currentOperand;                                     // add currentOperand to the running total
                break;
              case "*":
                runningTotal *= currentOperand;                                     // multiply the running total by currentOperand
                break;
              default:                                                              // if operator is null (we reached first operator, so there is no previous one)...
                runningTotal = currentOperand;                                      // ...initialize running total to value of currentOperand
            }
            operator = char;                                                        // update operator to current char
            numStr = "";                                                            // reset numStr
          }
        }

        return runningTotal;                                                        // return running total after for loop exits

      } else {                                                                      // PART 2: + TAKES PRECEDENCE OVER *

        return simpleExpression
          .split("*")                                                               // since we calculate multiplication last, we can split along the * operator
          .map(expression => expression                                             // now we have addition-only expressions, and we can evaluate those in turn:
            .split("+")                                                               // split along + operator to isolate individual addends
            .map(n => +n)                                                             // typecast the addends to number form
            .reduce((sum, addend) => sum + addend))                                   // add them all up
          .reduce((product, factor) => product * factor);                           // multiply together the results of the addition-only expressions

      }

    }

    expression = expression.split(" ").join("");                                    // first, strip away all whitespace from the expression
    const stack = [];                                                               // initialize a stack to defer parts of an incomplete expression outside of parentheses
    let currentExpression = "";                                                     // this stores the current expression as the input is read, at the current "level" of parentheses
    for (const char of expression) {
      if (char === "(") {                                                           // if an open parens is found...
        stack.push(currentExpression);                                              // ...push the current expression into the stack - it will be completed later...
        currentExpression = "";                                                     // ...and reset currentExpression
      } else if (char === ")") {                                                    // if a close parens is found...
        if (!stack.length) throw "INVALID: NO SOLUTION";                            // sanity check: if the stack is empty, the parentheses are not balanced
        currentExpression = stack.pop() + calculateSimple(currentExpression);       // grab the current expression at the next outermost level, and concatenate the value of the inner expression
      } else {                                                                      // if char is not an open or close parens...
        currentExpression += char;                                                  // ...simply concatenate char to the current expression
      }
    }
    return calculateSimple(currentExpression);                                      // after parsing the entire expression (converting it into a simple one), evaluate it and return

  }

  // MAIN FUNCTION: REDUCE THE INPUT TO THE RUNNING TOTAL OF ADDING THE CALCULATED VALUE OF EACH EXPRESSION
  return inputArr.reduce((total, expression) => total + calculate(expression), 0);

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = addAllExpressions;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInputA = `1 + 2 * 3 + 4 * 5 + 6`;

const sampleInputB = `1 + (2 * 3) + (4 * (5 + 6))`;

const sampleInputC = `2 * 3 + (4 * 5)`;

const sampleInputD = `5 + (8 * 3 + 9 + 3 * 4 * 3)`;

const sampleInputE = `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`;

const sampleInputF = `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;

const actualInput = `5 + (9 + (7 + 5 + 3 * 8 + 4 * 6) + 9 * 8 * 7)
(6 + 9 + 2 * 7) + ((6 + 3 + 9) + 5) + (6 * 7 * 7 + (2 * 4 + 2 * 8 * 5 + 3) * (3 + 3 + 6) + 9)
3 + 8 * 4 * 4 * (3 + 4 * 5 + 7 + (4 * 4 + 4))
(7 + (2 + 2) * (9 * 8 + 6)) + 2
(5 + (8 + 9 + 2) * 2 + 8 + 2 * 8) + 4
5 * 9 * (7 + 8 + 6 * 2 + (2 + 4 * 2) * 5) * 9 + 4
4 * (9 * 3) * (2 + 5 + 4 * 7 * 9 * 4) + 6 + (3 + 9)
8 + 9 * (7 + (5 + 8 + 2 * 4 * 4 + 9) + 3 + 4)
(3 + (9 + 6) * 8) + 3 * 8
6 * 7 + (8 + 7 + 7)
2 * 3 * 4 + (3 * 2 * (3 * 6) + 5 * 4 * 4) + 5 * 5
4 * ((5 + 9) + 4 + 6 * 3 + 7 + 6) + 7 + (8 * 7 * 8 * 2 * 6) + 7
((6 * 9 + 3 * 2 * 9) * 4 * 2 * (7 * 6 * 3 * 6 * 4 * 4) * (9 * 5 * 3 * 6 * 4 + 2) + 8) + 9 + 9 + 9 + 9
(2 + 4 * 3 * 6) + (5 + 8 + 3) * 2 + (2 * 8 + 2 + 9)
5 * (4 * 2 + 3) + 5 * 3 + 3
6 * 8 + 5 * ((8 * 9 + 3 * 4 + 4) * 7 * (3 + 6)) * (7 + (8 * 6 * 5 + 3 * 9) * 8 * 7 + 5 * 5) + 6
(7 + 9 * 5 * 5) * 6 + 9 + 8 + (8 + 6 * 6) * 8
(8 + (2 * 7) * 3 * 8) * 6
3 * ((2 + 7 * 3 + 5 * 3) + 9 * 5 + 2) + 2
((4 + 4 + 4 + 4 * 5 + 4) * (2 * 9) * 6 + 5) + ((6 + 3 * 6) + 6 * (3 * 5 + 7) + 9) + 2 + 8 * 4 * (6 + 2 * 5 + 8)
7 * 9 * 7 + (4 * 3 + 5 * 6 + 2) * 5
5 + ((6 + 4 + 4) + 5)
9 * 4 + 3 * 5 + 6 * (4 + 5 + (3 + 8 * 6 * 9 + 4) * 5)
2 + 9 + 9 + (2 * 6) * (8 * 8 * 2)
(6 * 2 * 3 + 4 * 8 * (3 + 8 + 2 * 5 * 5 * 2)) * 4 + 8 * 7 * 8
(8 + (7 * 3 * 6) * 4 + 8 * 2 + 6) * ((5 + 5 + 9) + 9 * 4 * 2 + (5 + 9 + 9) * 9) + 2 * 9 * 5
(6 * 3 + 7 + 8 + 6) * 3
7 + 3 + (3 * 8 + 2 + 3 + 7) * 7 + 4
((4 * 2 + 7 + 4) * (7 + 4 + 9 + 5)) * 9
9 + 4 * (5 * (6 + 9 * 2)) + 2 * 4 + (8 * 9 * 5 + (3 * 6 * 9 + 8 + 9 + 2) + 8 * 4)
8 * 2 + 3 * 5 * 7
((4 + 2 + 8 + 7) + 5) * 7
6 + 7 + ((9 * 3 + 7 + 2 * 2) + 3 + (2 * 5 + 3 * 3 * 3 + 3) + 5)
(7 + 6 + 4 * 4) + 7 * 6 + 3
8 + 8 * 2 + (8 + (9 + 2 + 5))
6 + 7 * 6 * 6 * ((5 + 6 + 5 + 6 * 6 + 2) + (6 * 4) * 7 * 4) + 3
((8 + 2 + 6) + 7 + 6 * 7 + 5 * 5) + 5 * 4
2 * ((2 * 8 + 8 + 5 + 8) + 6 + (7 * 8 + 8 + 2)) + (7 * (5 * 4 + 5 + 5 + 7 + 8) * (9 * 9 + 5 + 2) + 8 + (8 + 3 + 7 * 5 + 2 * 8)) + 2
4 + 6 * ((3 * 6 + 2 * 5 * 9 + 4) * 7) * 6 + 4
2 + 2 * 3 + 3 + 6 * (5 * 8 * 7 * (7 * 4 * 9) * 7)
8 * 5 + 9 + (8 + 6 * 5 * (7 + 7)) * 2 + 5
4 * 7 * 7 + (5 * 8 * (6 * 7 + 9) * 7 * 8 + 4) * 9 * 9
8 * 7 + 2 + 9 * 6 + (4 + (2 * 8 + 7) * 2)
7 + (7 * (5 * 8 + 7 + 5 * 6 + 5))
7 + (7 * 2 + (3 + 8 + 7 + 9 * 6 + 6)) + 3
((4 * 2 * 3) + 5 + 2 + 9 * 6) * (8 * 8 * 6)
(3 * (4 * 8 + 3 + 5 * 7) * 9 + (6 * 4 * 4 + 9 * 5 * 7) + 3 * 3) + 6 * 6 + 4 + (2 * 8 + 6 * 9 + 8 + 3) * 7
4 * 2 + 6 * 6
6 * 4 + (6 + 3 * 3 + (6 * 6) * (2 + 9 + 5 * 2)) * 9
2 + 3 + 6 + 9 + 6 + 4
7 + 5 + 3 + (8 * 5 * (8 * 2 + 7 * 5 + 5 * 8) * 8 + 3 * (4 * 7)) * 5 + 6
6 * 2 * 2 * 7 + (7 * 4 + 9 + 6)
4 + 3 + 8 * 6 * 7
4 * ((7 + 4 + 7 * 2 * 4 * 5) + (7 + 4 + 7 + 7 * 7 + 4) + 4 + 3 + (2 * 8 * 4 * 9 + 5) + 7) + 8 * 6 + (2 + 3 * 3 * 2 * 4) + (9 * 7 + 8 * 4)
(3 + 8) + 4
(5 * 3 * (4 + 7 + 7 * 4) * 4 * (5 + 4) + 6) + (4 * 7 + 2 + 3) + 7 * 6
(7 * 2 * 3 * (8 * 2 + 8 * 4 * 9)) * 7 + 8 * 4
9 + 2
6 + 4 + (4 + 7 * 9 + 6 * (2 * 2 + 9 * 6 * 2) * (3 + 7 + 6 + 6 * 9))
9 + ((5 * 9 * 4 + 3 + 2 * 6) + 9 * (7 + 4 * 7 * 6 * 3 * 8) * 4 + 4 + (5 * 8)) + (7 * 3 + (2 + 6 * 9 + 9 + 3 + 4) * 5) + ((4 * 4 + 5) * (7 * 3 + 5 * 7) * 6 + 9 * (3 * 2 * 5 * 2 + 3))
3 * 9 + 8 * ((4 + 2 + 5 * 2) * 7) * (5 * 7 * 9 * 8 + 2 * 6)
6 + 7 * (2 + 7 + (8 + 6 + 3) + (9 * 8 * 6)) + 3
(3 + 7 + 3 + 7 * 3 + 8) * 3
5 * 9 + 3 + 3 + 4 * 9
7 + (2 * 4 + (9 + 7)) * 4
(6 + 5) + 6 * 6 + 7
(6 * 7 * 9 * 7 + 4 + 6) * (6 * 4 * 7) + (2 + 5) + (7 + 5)
4 + 6 * 9 + 4 * (5 * (3 + 7 + 8) + 5)
6 * 3 * (3 * 3 + (6 * 3 + 3 + 4 + 5)) + (4 * 3 * 9) * 4 * 5
((9 + 6 + 2 * 8 * 9) + (9 + 5 * 3 + 4 * 4 + 9) * 4 + 8 * 7) * 4 + 4
5 + 5
4 + 6 * 4
3 * 7
4 + ((3 * 4 * 7 + 2 + 6 * 7) + 9) * 3 * 9
7 + 8 * (9 * 2) + 3 + 5
(7 + (3 * 6 * 5 + 9 + 4) + 8 * 9 * 4) + 6 * 5 * ((7 + 9 + 7 * 2 + 4) + 4)
6 * (8 * 5 + 8) + 6 * (7 + 6 * 5)
(9 * 7) + 7 * 6 + 2 * (7 * (9 + 9 * 6 + 5 * 6) + (7 + 2 + 4 + 7))
(6 * 9 * 5 * 9) + 2 * 9 * (3 + (5 + 4 * 2) * 8 * 9) * 3
(3 + 2 * (4 * 9 * 2 * 8 * 3 * 9) * (9 * 4 + 9) * 5) * (5 * (8 * 7 + 2 * 4 * 3 + 3)) + 6
4 * 9 * (2 + 5 * 9 * (7 * 5) + 9 * 5) + 5 * 4
(7 * (9 + 3 * 7 + 9)) * 5 * 7
(7 + 9) * 3 + 7 * 6 + 7 * (7 + 7 * (7 + 5 + 8 + 8 + 9 + 4) + 9 + 9 + 8)
7 * 7 + 3 + ((9 * 2 + 7) * (7 * 2 * 3 + 6 + 7) * 7 * 8) * 9
(4 + (5 + 2) * 3 * 4) * 6 * 8 * 2 * (3 * (3 + 7 + 2 + 2 * 4 + 3))
6 + (7 * 3) * 9 * ((4 * 8 * 8) * 9 + 5 + 5)
4 * ((8 * 9 * 2 * 7 + 4) * 8) * 3 * 5
8 * (8 + 2 * (9 + 6 * 9 * 4) * 2) * (4 * 8) + 2
6 + 9 + 5 * 7 * (3 + (9 * 9) + 2 * 9 + (6 * 4) + (7 * 6 * 3 + 3 * 5))
((3 * 3 + 3 + 4) + 9 * 7) * 3
5 * 7 + ((5 + 3 + 9) + 2 * 9) * 5 * (6 * (6 + 5 * 3 * 4 * 9) + (2 * 2 + 3 + 4 + 5 + 4)) * (2 * 3)
((8 * 2) + 7 * 2 * 6 * 7) + (6 + 2 + 6 * 5) + (5 * 7 + 6 * 9) * 9 + 3 * ((8 + 7) * 3 * 8 * 2)
(3 * (3 * 8) + (7 + 3 + 8 * 7 * 9 * 9) * 8 + 2) * 9 * 8
7 + (6 + (9 * 6) + 8 + 9)
7 + (6 + 7 + 2 + 9 * (9 + 4 + 8) + 9) * 2 * 5 + (5 * 9 + 6 * 8) + 5
(8 * (7 * 9) * (4 * 6 * 7) * 5 + 9 * 5) * 8 + 5 * 4 * 6
5 + (5 + 6 + 9 * 7 + 3) * 3 * 5 * 8
6 + (6 + 9 + 4 * 6) * 8 + 6
4 * 8 * 6 + 2 + 9 + ((2 * 8 + 7) * 8 * (3 * 9 * 8 + 4 * 8 + 5) * 9 + 8)
8 + 9 + 4 + 8 + (3 * (9 + 6) + 9 * 9 * 5) * 2
6 + (4 + 7) * 5 * 2 * 8 * 3
4 + ((4 + 7 * 9) + (2 + 9 + 9 * 6) * 2 + 9)
6 + ((4 + 6) + 8 + 8 + 4 * 7) * (8 + 7 * 2 * 3 + 2) + 6 + (4 + 3)
6 + ((6 * 6 * 6 * 3 + 4) * (5 + 3 + 9 * 2 * 7 + 9) * (4 * 3 + 3 + 9 + 7) * 9 + (9 * 8 + 3 * 6 * 9 * 7)) + 3 + 2 + 2 * 8
8 * 5 + 2 * 7 * (9 * 6 + 2 * (2 + 5 + 3 + 3 * 2 * 3) + 7) * 6
(8 + 9 * 9 + (6 * 6)) * 3 * 8 + 5 + 7
2 + (4 + (2 + 2 + 5 + 2))
(4 * 4 + (6 * 6 * 7 + 7 * 9)) + 3
8 + 6 * 6 + ((8 * 8 * 8 + 3 * 5 * 8) + 8 * 9) + 3
2 + ((7 + 9 + 8 * 3) + 5 * 4 * 8 * 4 + 5) + 7 + 3
6 + 7 * 3 + 3 + 9 * (2 * 4)
5 + (6 * 7 + 5 + 7 + 5) * 5 * 5 * (7 + 3 + 2 * 9 * 9 + 4) * (2 * 3 + 2 + (9 + 2 + 2 * 5))
7 + 7 + (7 * 6 * 6 + 6 + 5)
7 * 2 + (2 * (2 * 8) * (8 * 7 + 9 + 5) + 5 + 4 * 8) * (2 + 9) * 3 * 6
(7 + 6) * 8 + (2 + 2) + 9 * 6 + (9 + 6 * 2)
9 * 4 * (6 + 8 + 3 * 6 + 3) * 2 + (2 + (4 + 7) + (8 + 4 * 2 * 2 * 7 + 2) + (6 + 6 * 9 + 3 + 6) * 3 + 2) + 2
9 + ((9 + 9 * 3 + 2) + 2 * 5 + 7 + 2 * 3)
8 + 5 + 4 * ((8 * 5) * 7 + (8 + 5) * 4 + 8 + 3) * 9
3 + 5 + 7 * 8
4 * 9 * 4 * 8 + (9 * 3)
(9 + 4 * 3 * 9 + 9) + 5 + 8 + (6 + 9 + 9 * 2 * (5 + 4 + 3 * 6 * 4))
5 + (9 * 6 * (2 + 9 * 7) * 9 * (7 + 5) * 6) * 7 + 6 + 5
(4 * 8) * (4 + 6 * 3 * 5) * 4 + 4
4 * 5 + (8 * (6 + 9 + 2 + 7 + 7 * 5) * 5) + 5 * 7 * 4
4 + (3 + (5 + 5 * 8 * 7 * 2) + 4 + 7) + (7 + 8 + (9 + 4 * 3 * 3)) + (6 + 2 * (6 + 8) * 7 * 8) * 7
6 * 6 * (4 + 5 + 2 * (7 + 8 + 2 * 8 * 3) * 3 * 2) + 2 + (5 + (5 + 9) * 7 + 9) + 6
5 * 9 + 3 + (6 + 7 + 6 * 2 * (9 * 8 + 3)) + 6 + (3 + 9 * 3 + 7)
5 * 4 + 9 * 2 * (4 * 3 + (7 * 5) * 4)
4 * 4 + (7 + 2 * 8 + 5 * 5 * 2) + 5
5 * 9 * 9 + 7 + ((4 * 5 * 6 * 9 * 3) * 3 * 7 * (3 + 3 + 3 + 9)) * (4 * 9)
3 + 7 + 6 * (5 + 3 * (4 * 6) * 8 * (2 + 3 + 7 * 9) * 8) + 2 + (7 * 9)
7 + 3 * (6 * (7 * 7)) + 5
6 + ((7 + 9 + 4 * 8) * 5 * 2 * 8 * 5) + 5
9 + (4 + 4) + 8 * 3
2 + (2 + 9 * 2 * 4 * (7 * 6 * 2 * 8) * 8) * 2 * 5 + 4
9 * ((2 + 4 + 9) * 8 + 8 * 9)
(6 + 4 + 7 + 5 + (8 + 2 * 2)) * 8 + 3 * 5 * 7
(4 * 8 * 6 + 4) + 5
6 * 9 + 4 * 6 + (6 + 3 + 4 * 9 * 9 + 5) * 2
4 + (7 * 7 * 3) + 7 + 9 + 8 * (8 * (9 + 6) * 9 + 3 + 5)
6 * 6 + 2 * 4 + 2
9 + (4 + 7 * 2 + 9 * 6) + 4 + ((9 * 7 + 4 + 8 + 3) * (4 * 6 + 5) * (6 * 8 * 2)) + 8
5 * 4 + (5 + (8 * 2 * 5 * 7 * 6) * 5 * 7 * (4 * 7 + 7 + 5 + 6 + 5) + 4) + 3
5 * 6 + (5 + (5 * 7 + 3 + 9 + 3)) + ((6 + 9 + 4 * 4) + 5 + 4) * 8 * (5 + (9 + 9 + 7))
2 * 4 + (7 + (8 * 3 + 4 + 6) + 8 * (5 + 4 + 2)) * 6 + (2 * 7 + 2 + 9)
7 + 3 + 7 + (3 + 9)
4 * 7 + 9 + ((7 * 3) * 6 * 4) + 7 * (3 + 9)
3 + 6 + (8 + 2) + 9
(9 + 7 + (2 + 9 * 5)) + 2
2 + (8 + (5 * 6 + 5 + 2 * 3 * 7) * 4 * (8 * 8 * 7 * 2 * 4 + 8) * 5 + 6) * ((3 + 4 + 8 + 6 * 7) * 7 * 9 * 8)
4 + (3 + (6 * 4 * 5 * 4) * (6 + 4 * 4 + 3)) + 9
3 * (2 * 4 + 3) + ((4 * 2 + 9 + 9) * 4 * 9 + 4) + 7 + (8 * 7 + 2 * 6 + 8 + 6) + 4
7 * (5 * 4 * 8 + 4)
(2 * 9 + (7 * 3 * 2 + 3 * 6) + (5 + 6 * 5 * 6 * 4 * 7) * (7 + 6 * 9 + 3 * 5)) * 2
(7 * (3 + 7 * 9 + 5 * 7) * 2 * 9 * 5) * 8 * (2 + 2 * 5 + 8 * 4 * 2) + 5
(4 + (9 * 5 + 8 + 8) + 7 * 4 * 6 * 4) + 4 + 5
7 + 9 * (4 + 2 * 2) + (8 + 7 + 9)
4 * 5 * (8 + 6 + 9) + 5
(7 + 7 + 4 + 7 * (6 * 6 * 9 * 2 + 2 + 8) * 3) * 4 * 5 * 9 + 3
8 * 7 + 2 * (8 * 7 * (9 * 8 * 2 * 5 + 5) * 2 * 5) + 3
(4 * 7) + (9 + 5) * 4
5 + 9 * 6 + 2 * 7 * 2
4 * 8 + 6 * ((4 + 6 + 2 + 9 * 4 * 7) + 9 * 8 + (4 + 6 * 9 * 8 * 3) + 2 + 5)
3 + (4 * 2 + 7 + 2) * 4 * 2 * 8
6 * 9 + ((3 * 3 + 2 * 2 + 4 + 9) * 6 + 5) + 2
8 + 2 + ((6 * 8 * 5 * 6 * 6) * 3 * 5 * 8)
8 + (5 * 4 + (7 + 7 * 6 + 3) * 8) * 3 * 8 + 2 + 8
((6 + 9 + 7 * 7) * 4 + 5 + (8 + 9 + 5)) * 4 * 5 + 2 + 5 * 5
(3 * 2 * 9 + 4 * 5 * (5 + 9 * 8 + 2)) + 8 + 7 + 7
((6 * 6 * 4 + 2) * (3 * 3 * 5 + 4 * 6) * 3) + 6 * 4 + 6 * 6
5 + 9 * (4 * 7)
5 + 3 + 2
((9 * 3 * 9 + 6) + 5) * 5 * 4 + 8 + 9 * 3
(9 + (4 + 5 * 9 + 4) + 4) + (5 * 2 + 2 * 5 * 8 * 9) * 8 + 8
((8 * 3 + 7) + 6 + 7 * 9 + 2) * 9 * 8 * 9 * (5 + 8 + 3 + 4 * 4 * 5) + 8
(5 + 8 + 4 + 5 + 7) + 8 + (5 * (9 * 8) + 6 * 9) * 8 * 3 + 2
(2 * 8 + 2) + 4
(4 + 5 + 2 + 3 + 9 + 5) + 6 + (6 + 9 + (4 * 8) + 2 + 2) * (4 + 7 + 5 + 5 * 8 + 8) + 8
9 * 2 + 3 * (3 + 3 * 3 * 7) * 5 * 8
(7 * 6 * (2 * 9 * 8) * 6 + 2 + (2 + 2 + 7 * 5 * 4)) * 6 * 7 + 2
5 * 2 * 5 + (7 + 4 * 7 * 2 + 7) * (8 * 6 * 2 * 9 * 4)
7 + 9 + (4 + 6) + ((5 * 3 + 8 + 7 * 6 * 9) + 2 + 5 + 3) * 9 + (9 * 6 * (4 + 5 * 8))
((2 * 7 * 6 + 2 * 5) + (5 + 4 + 3 * 5 + 5) + 5 * 9) + 2 * 3 + 8 * 2 * 9
9 * 4 + 7 * (8 + 7) + 2 + 5
6 * ((9 * 4 + 3 * 2 * 9) + 9 + 3 * (2 + 3) * 6) + 7 + 9
5 + 5 + 6 + (3 + 3 + 9 * 3) * 8
9 * ((9 + 8 + 9 * 3 + 3) * 6 + (8 + 3 + 3)) * (8 * 2)
(2 + 4 + 3 + (8 + 5 + 6 * 7 * 2) * 4) + 8
9 * (4 + 7 + (6 * 6 + 2 * 7) + 2 * 4) * 5
2 + 8 * 4 * 6 + 6
((9 + 3 + 9 * 3 * 9) * 7) * 7 + 6 + ((6 * 4 * 2 * 7 * 6 * 7) * 2 * 5 * 4) * 3 + (4 * 9 * 5 * (7 + 5 * 9 * 3))
5 * (3 * (8 + 8 * 4 + 8)) + 6 + 4 * 3 * (6 + 7)
4 + ((8 * 6 + 5) * 6 + 9 * 7 * 6) * 8 + (3 * 9 * 5 * (2 * 3 + 8 + 4 * 8 + 6) * 2) * 3
2 * 2 + ((7 + 2 * 9 * 6 + 6 * 5) + (8 + 3 * 4 + 2 * 3) * 3) + 3 * 9
3 + 5 * 6 + (9 * (8 * 8 + 4 + 3) * 5) + 2
2 + 7 * (3 + 8) + (4 + 9 + 5) + 7
3 * 7 * (3 * 4 + 5 * 5 + 9) + (7 * (5 * 6 * 6 + 5 * 5) * (2 * 5) + (8 + 9) + 8) + ((3 + 6 * 2 * 3 + 7 * 3) + (8 * 6 * 6 * 3))
8 + 9 + ((5 * 3) + 3 + 9 + 3 + 4 * 3)
4 * 8 * (5 * (7 + 6 * 9 * 3) * 4 * 2 * 7) * 2 + 6 * 3
9 * 4 + (4 + 6 + 6 + 7) * 4
(7 * 3 + (6 * 2 * 6) + 5 + 2) * 9 + 2
4 + (8 * 7 * 3 + 4) + 8
8 * (6 * 3 + 5 * 7 * 3 * 5) * 4 + (2 * 4 * 8 + (7 + 9 + 6 + 2 + 5) * 2 * 8) * 3
6 + 3 * 5 * 4 * (7 * 4 * 6 * 5 * 3) * 2
(4 + 8 * 4 + 9 * 8) + (3 + 7 * 4 + 4 + 4 * (3 * 3 * 4 + 9 * 7)) + 3
8 * 9 + (2 + 6 + 7 * 6 * 6) + (9 + 6 + 6) * 4 * (7 * 2 + 2 + 7 + 4 + 3)
(3 * 8 + 2 + 5 * 5) * (8 * 4 * (2 + 9) * 5 + (8 * 8 * 4) * 6)
(6 * (9 + 8) * (6 + 7 + 2 * 8 * 8) + 2 + 8) * 7
7 + (4 + 6 + 7 + (7 * 7) * 5) * 6 * 4 * 2
3 * ((5 * 7 * 4 + 3 * 7 * 5) * 2 * 8 * 2 + 8) * 4 + 4 * 3 * (3 + 7)
7 + ((6 * 5 + 6) + 5 * (5 * 7 + 6 * 3 * 9) * (3 * 4 + 7 * 9) + 5 + 5) + 9 * 8 * (2 * 8 + 6)
(9 + 8 + 8) + 3 + 2 * 9
(2 * 5 * 4 + 9 + 9) * 5 * (2 * 9 + 2 * 4 + (4 * 8 * 9 + 8) + 3) + 3 + 2
(6 + 5 + 3) * 9 + 6 * ((2 * 6 * 3) * 4 * 6)
8 + 8 + 6 * (5 + 5) + 4
3 * 5 * ((9 + 7 * 4 * 6 + 7 + 5) * 3 * 2 * (3 * 8 + 4 * 3 + 7) + 4 * 4)
9 + 6 * 5 + 7 * (4 * 6 * 8)
((5 * 4 + 2 + 7 * 4 * 2) * 2 * 5) * 4 * (2 + 9 * 9 + 9 + 7 + 9) * 4 * 9 + 5
7 * ((6 + 7) + 5 + (3 * 4 + 5) + (3 + 8) * (5 * 2 * 4 + 8))
((8 + 8 + 3) * (5 + 9 + 9) * 4 + 2) * 6 + 8 + 2 * (5 * 8 + 3 + (8 + 5 + 7 + 9 + 4 * 6)) + 6
(6 + 2 * 2) + 8 * 9
2 * 6 * 7 * 2 + 8 * 8
8 + 3 + (6 * (2 + 2 * 8 * 4 * 6 + 2) + (7 + 4 * 8 * 3)) + 9
6 * 8 + (4 * 8 * (8 * 5 + 6 * 7 + 2 + 4) + 3 * 7 + (5 * 9)) + ((8 + 7 * 6 + 3) + 5) * ((3 + 6 * 9) * 8 + 7 + (6 + 3 * 2)) * 8
((2 + 4 * 7 * 4 * 6 + 8) * (6 * 5) + 3 * 3 + 9) * 4 * 6 * 4 + (7 + 4) * 4
(3 + 7 * (8 + 4)) * 9 * 9
(8 * 9 * 3 + 5 + (6 * 7 + 3)) + (6 * 2 * 3 + 7) * 8 + 2 * 8
(9 * 7 * (5 + 5)) + 3 + 3 * (2 + 3 * 2 + 3)
4 + (4 * (4 + 6 + 3 * 3) * 5)
(9 * 4 * 7 + 2) * (6 + 3 + 5) + 6 + 3 + 3 + 6
7 * 5 * 9 + (6 + (4 + 3 + 6 + 7) + 4) * 8 * 6
2 * 2 + 5 + ((5 * 3 * 9 + 2) + (3 + 7 * 9 + 7 * 6 + 2))
8 * ((7 + 3) * 4) * 3 + 2
(5 * 8 * 8 * (2 + 9)) + ((8 * 6 + 4 * 8 * 3) + 3 + 3 * 4 + 4) * 7
(3 + 6 * 7) * 8 * (3 + (9 * 6 + 8 + 9 * 8 + 7) + (5 * 4)) * 5
9 + 8 * 8 + 4 + 4 + 3
5 + 9 * 7 + (4 + 2) + ((9 + 5 * 8 + 2 * 7) + 4 * 9 * 3 * 4)
4 + 5 + 4 + ((5 + 9 + 8 + 2) * 8 + 3 * (9 + 9 * 3 + 9 * 3 * 4) + (2 * 9 + 6 * 5 * 8) * 3)
5 * (4 * 9 * 4 * 4 + 4) * 4 + 9
7 + 6 * 6 + (8 * 9 * 4) * (4 + 8 * 5 * 7) + 4
2 * (2 + 9)
9 + 4 * ((4 + 6 + 9 + 4 * 9) * 3 + 9 + (4 + 8 * 8) + 8) + 4
2 + 6 + (3 * 9 + 4) + 9 * (6 * 8 + 9 + (2 + 6 + 5 * 2 * 5) + 2) * 2
(2 + 2 * 9 + 9 * 8 + (9 * 8)) * 4 + 4 + 7 * (5 + 3) * (4 * (5 + 9 + 8 + 2 + 8) * 4 + 3)
(5 * 7 * 6 * 3 + 7) + 8 * 3
(9 + 9 * 2 * (7 * 3 * 4)) + 2 * 2 * (6 * 5 + (7 * 4 * 2 * 3 + 6 * 5) * 4 * (3 + 8 * 2))
6 + (8 * 4 + 5) * 9
9 + 5 * (4 * 9 + 3 * (3 + 4 * 5 + 7 * 7)) * 6
9 * (7 + 7 + 9 * 5 * 5 * 2) * 2 + 4
7 + 6 + 9 + 5
9 + 3 + 8 + (8 + 6 * (5 + 7 * 2) + 7 + (2 + 7 * 3 * 4 * 4 + 4) + 9) + (6 + (4 + 8 + 8 * 6 * 4) + 4 + 6) + 3
(3 + (4 * 5 * 5 * 9)) * (3 + (8 * 9 + 7 * 6) * 7 + (9 + 4 * 5 + 6) + 3) * 5 + 4
5 * 4 * (5 * 3) * 8 + 4 + 5
7 * (8 + 3 + 7 * (3 * 8 + 2 + 6 * 9 + 6)) + 5 * 8 + 6 + 4
6 * (9 + 2 + 2 + 7 + 6) * 7 + 8 * 6 + 8
8 * (9 * (7 + 2 * 7 + 5 * 6) + (2 * 4 * 3 * 4) + 2) * (6 * 4 * 2 + 5 + 3 + 5) + 6
(7 * 4 + 8) + 8 + 2 * (8 * 3 * 7) + 5
4 + 8 + 8 + 6 * (3 * 6 * (3 + 7 + 9 * 8 + 4) + (6 + 3 * 8 + 7 + 8 * 9)) * 7
(9 * 8 * (2 + 8) * 8 + 4 * 4) + (6 * 4 * 9 * 6) * (4 * 9 * 7 + 4) + 6 * 4
9 + 5 * 3 + (6 + 4 * 9 + (8 * 4 * 5 + 2) + 9) + (3 + 9 * 6 + 5 * (5 * 3 + 5))
4 + (9 + 9 * 6 + 8 * 2)
8 + 8 * 6 + 7 * 9 * (8 + (9 * 5 + 7 + 5))
(9 * 6 + 4 + 8 + 7) * 9 * 2 + (3 * 7 * 8 * 5 * 2)
((8 * 7 * 6 + 5 * 2) * 6 + 3) * (7 + 7 * 8)
4 + 5 + 6 * (6 * 5 + 5 * 3)
(5 * (8 + 3) * 9 * 2 * 3 * 5) + 4 + 8 + 7 * 3
(2 * (9 * 2 * 5 + 7) + 2) * (7 * 8 + (9 + 9 * 8) * 8) * 9
(7 * 8) * 5 + 9 * 4 + (8 + 6 + 9 * 3 + 5)
8 * 7 * 7 + ((8 * 7 * 2 * 4 + 4) * 5 * 8) + 9
4 * 8 * (6 + 9 * 5 + 9 + 4 * 9)
5 * 5 + (4 + 7 + (3 + 6 * 8 * 2 + 6 * 5)) + 2 + (8 * (6 * 3) + 3 * 6 * (5 + 8 * 9 * 9) + 8) + 3
4 + (5 * 9 * 3 + 9 + 9 + 8) + 5 + 4 * 3 * 4
9 + (4 + 3 * 2 * (7 + 8 * 8) * (2 * 9 * 7 * 5 * 4) + (3 + 9 + 7 * 9 * 4 + 6)) * 2 * 3 * ((5 + 6) * 5 * 5 * 2)
6 + ((9 * 9 + 9 + 9 * 5) * 4 * 2 * 8) * 5 * 4 * 9
9 * ((8 + 6 + 7 + 6 + 8) * 2) + 6 + 5 + (3 * 5) + (2 + (9 + 3) + 9)
5 * 5 * 7 + 7 * 6
(4 + 7 * 4 * (6 + 7) + 7) * 4 * 4 * 6 * 7
2 + 2 * ((5 * 4 + 5 * 9) * (9 * 2 + 4 * 7)) * 3 + 2
(3 + 2 * (5 * 4 + 9 + 3 * 7)) + 9 + 4
8 + ((4 + 3 * 9) * 2) + 6
3 * ((7 * 8 + 5 * 7) + 6) * 4 + 8 + 3
(4 * 6 + 6 + (8 + 5 + 9 * 2)) + 9 * 4 * 3 * 9
(8 + (9 + 6 + 7 + 4 * 3) * 7 + 6) + 4 * 2 + 5
8 + 9 + (5 + 4 + (7 + 5 + 9 * 5 * 4 * 4) + (2 + 5 + 9 + 4 * 2))
(3 * (6 * 5 + 8 + 7 * 7 * 3) + (5 * 2)) * (5 + (6 + 5 + 8) * 2)
(7 + (7 * 7 * 4 + 2 + 4 * 5) + 7 + 9 + 7 + 7) + 6 + 6 + ((7 + 6 + 2 * 2) + 7 * 5) + 9 + 5
8 + ((3 + 9 + 3) + 7 + 8 + 2 * 6 * (7 + 2)) + 7 * 4
((3 + 2 * 4) + 6 * 2) * 4
4 * 9 + (8 + (4 + 8 + 6 + 9)) * 8 * ((9 + 8 + 2) + 8 + 8)
(5 + 5 + 8 + 2 * 5 * 8) * 4 + (5 + 2 * 5 + 4 + 9 + 2) + 5 + (9 * 5 * 9 + 6 + 4 * 4)
6 * 3 * 5
(6 + 9 + 8) + (6 + (7 * 6 + 6 + 5 * 9 + 7) * (4 + 6 + 3 + 9 + 2)) * (6 * (3 * 6) + 3 + 3)
2 * 3 + 2
9 + 4
9 * 2 * 5 + (6 * 5 * 7) * 6 * 4
9 + 4 * (5 + 6 * 4) * 8 + 7
6 + 2 * 2 + (7 * 6 * 3 + 6 * 9)
2 + (6 * 4) * (5 + 2 + 6 * 3 + (7 * 2 + 5 + 7 * 5) + 7) * 9 * 5
(3 * 4) + 3 + 9
2 + 4 + ((3 + 6 + 9) + 8 * 2 * (4 + 5 * 3 + 3 * 3 * 3) + 9 * 3) + 3
6 + 9 + 5 + (4 * 6 * 3)
3 * 9 + (5 * 3 + 2 * (4 + 2 * 9 + 2 * 8) * (7 * 5 * 9)) + 2 + 9 + ((4 * 9 + 5 + 6) * (3 + 5 + 5 * 4 + 7) + 3 * 7 + 3 + (3 + 3 + 2))
(3 + (5 + 3 + 7 + 4) * 3 * 8 + 4 + 7) + 3 * ((2 * 9 * 4 * 7) + (5 + 8)) + 3
9 * 2 * 6 * 7 + ((7 * 7 * 9 * 9 + 8) + 7 * 2)
9 * 7 * 5 * (6 + 3 + 3 * 3 * 9) * 2 + 5
8 * 2 + 2 + (2 + 3 * 9 * 9 + 4 + 9) + 4 * 5
5 + 5 + (8 + 7 * 6 + 8) + 3 + (2 + 6 * 2 * 2 * 6)
6 * (5 + 6 + 5) * (9 * 5 + 3) + 7
5 + 9 * (9 + 4 + 5 * 5 * 7 * 8) + 8 + (8 * 3)
8 * 4 + 8 + 9 + (2 + 6 * (6 + 7 * 4 * 3 * 4 + 7) * (3 * 2 * 4) * 9)
(9 * (4 * 8 + 4 * 3) + 7) * 8 * ((8 + 3 + 8 + 5 + 3) + 5 * 7 * 6 * 7)
8 + (6 + 7 + 9) * (5 + (7 + 8 + 9) + 9 * 7) + 8 + (9 + 7) + (2 + 8 * 5)
(5 + 6) * 2 + 2 + 9 + 3 + 5
7 + 6 * (3 * 2 * (6 * 7 * 3 * 9 + 3 + 2) * 6 + 7 + (7 * 5 * 7 * 2 * 9))
((3 + 8 * 6 + 3 * 7) * 9) * 8 * (2 + 8 * 2 + 7) + (7 * 4 + 7 + 6 * 6 * 6)
4 + ((4 + 6 * 2 * 2 + 5 + 8) + (7 + 7) + 5 * 7) + 7
8 * (7 * 7 + 8) + 6 * ((5 * 8 + 5 + 8 + 8) + (9 + 7 + 3) + (7 * 5 * 6 * 3 + 2 + 9) * 4 * (4 + 8 + 6 * 6 * 9)) + 7 * (9 * (2 * 2 * 6 + 7 * 9 * 4))
5 * 6 + 8 * 4
3 + (2 * 9 + 3) + 4 + 4 * 7 * 6
(3 * 5 * 6 * 4) + 5 * 2 * ((5 * 9) * 8)
(6 + 9 * 8 * 9 + 5 * 4) * 2 + 6
(9 + 8 * 3 + 9 + 7) + 3 * 4 + (8 + 6 * 3) * 7 + 8
(6 * (2 + 9)) * 2 * 6 * ((8 + 2 * 6 + 8) + 9)
(8 + 8 * 8 * 9 * (9 * 7 + 3 + 3)) + 2 + 8
((3 * 2 + 5 + 9 * 4) + 9 * (4 * 5 + 4) + (7 + 9 + 6 + 4 + 8) * (3 * 9 * 3 * 5) * 4) + 8 + 2 + (7 + 5 * (2 * 5 + 6) + 5 * 7) + 8
6 + 7 * 3 + 7 + ((3 + 3 * 8 * 7 + 2 * 8) * 6 + 2 + (5 * 2 + 6) + 6)
7 * 4
(5 + 8 + 7 + 7 + 8 * 2) + ((3 + 3 * 4) * 8 + 3 + 9) + 3
8 * (7 * 9 * 5) * 4 + 5
3 + 4 + 8 + ((5 * 2 + 5 + 3 * 9 * 2) * 2 * 2 + 2 * 8) * (9 + 6 + (8 * 7 + 5 + 5) * (5 * 8 * 7 + 5 + 4 + 8)) * 3
((7 * 4) + 3 + 7 + 9 + (9 + 6 * 5 + 5) + 4) * 7 + 2 + 5 * (4 + 9 + 2 + 8 + 6 + (5 * 4 * 6 + 6 * 9)) + 4
(8 * 2 * 9 + 6 * (6 + 6 * 4 * 9 + 5 * 5) * 9) * 8 * 7 + 2
(6 + (4 + 4) + 3) + (6 + 5 + (6 + 9 * 3 + 6 * 4) * 3 * 7) + 2 + 2 + 8
9 * 5 + 6 + 3 + (6 + 3 + 3) + ((5 * 3 * 2) + 7 * (6 * 7 + 6 * 8 * 2) * 9 + 5 * (5 + 4 * 8 + 2 + 3 * 4))
5 * ((4 * 9 * 9) * (8 + 4) * 2 * 6) + (2 * 7 * 7 + (5 + 7 * 9 * 4)) * 4
8 * 3 * ((6 * 8) * 4 * (3 * 6 * 3 * 4)) + 4 + (5 + 9 + 5 + 3 * (2 + 9) * (7 + 4 + 9 * 8 + 9))
8 + (6 * 9 * (7 * 2 + 7 * 2 * 5 * 7) * 3 + 4) + 6
2 + (7 + (2 * 3)) + (4 + 8 + 6 + 5 * 9)
7 + 6 + ((3 + 2 * 4 + 9 * 8) + 3 * 6 + (7 + 3) + 3 * 2) + 4 + 4
2 * 2 * (3 + 3 + 6 * 6 * 7 + 6) * ((4 + 6 + 5 + 9 * 3) * 8)
(9 * 8 * 9 * 3) + 9 + 4 + 8 * 7
3 + ((8 * 6 + 4) * (5 * 6 * 5) * 4 * 5) * 8 + 6 * 4 * 9
((4 + 7 + 4) * (5 + 6) + 8 + 8 * 9) + (2 + 2 + 3) * 9 + 9
(5 + 9 + 8 + 9 + 9 + 8) + 7 * 8 + 4 * 2 + 2
(8 * (8 * 2 + 3 + 8) + 6 * 9) * (4 * 6 * 5 + (4 * 2 * 7) + (8 * 7)) * 4 * (4 + 3 * 2) * 7 + 3
5 + 5 * (6 * 9 + 8 + 6) + 2 * 9
(2 * 7 * 5 + (8 * 2 * 3 + 9)) * 7 + 2 + (4 * 3 + 9 + 3 + 3) * 2 * 5
4 + (3 * 7 * 9 * (5 * 2 * 4)) + (7 * (7 + 5) + 3 + (3 * 9 * 5 + 2 * 6 * 3) + (4 + 9 * 8 * 8 * 5 + 9) * 5) + 4 * 7 + 8
9 * 8 + ((8 * 8 * 2 + 2 * 5 * 8) + (5 * 5 * 8) * (7 + 7 * 2 + 9)) + ((5 + 6 + 6 + 6 * 6 + 2) * 3 * 4 * 3 * 5 * 4) + 7
8 + 4 + 7 + 4 * 9 + (6 + 6 * 2 + 8 * 2 + (6 * 2 * 4))
((5 * 9 + 3 * 4 * 3) * 2) + 7 + (2 * (8 * 4 * 8 * 8 * 8 + 2) * 2)
4 * 2 * 8 * 3 * (5 + (6 * 3 * 7 * 2) * (2 + 5 + 6 + 9 * 5))
7 + 3 + (5 * (9 * 2 + 9) + 4)
9 + 6 + 2 + 4 * ((6 + 7 * 3 + 5 * 9) * 2 * 7 * 6 + 3 + 7) * 6
(9 * 5 * 6 + 3) * 5 + 3
9 * 9 + 3
6 + 7 + 7 * 5 * 9 * (7 * 8 + (7 + 2 * 8 * 6 + 5 + 4))
8 + 5 * 5 + 3
9 * ((4 * 7 * 6 + 3 + 4) * 5 + (6 + 3 + 7) + 7) * 9
3 + (5 + 3 + 4 + (7 + 3 + 5) * 8) * 5 * ((3 + 6 * 8) + 3 * (4 * 6 + 4) + 5 + 5)
3 * 3 * (7 * 2 + 7 * 6 * 9 + 5) * 2 + 6
4 + 5 * 7 + 3 * (2 + 5 * 6 + 7) + (8 + 2 + 6)
3 + 7 * 7 * 2 * (7 + 6 * 7 * 7 + (6 * 5))
7 + 2 + (3 + (3 + 7 + 2 * 6 * 8 + 4)) + (2 + 8)
(9 * (5 * 6 * 3 + 9)) * (7 + 4 * 5 * 3 + 3) * (2 * 3 + 8 + 3)
(8 + 8 * 7 * 3 * 8 * (2 * 9 * 9)) + 3
2 + (3 + (5 * 6 * 2 * 4) * 3 + 7 * 4 + 9) * (2 + 7 + (4 * 5 + 8 * 5 + 9) * 9 + (3 + 4 * 8 * 2 + 8 + 4) * 6) + (3 + 3 + 9 + 4) + (6 + 4 * (6 + 7)) + 4
4 * 8 + 2 + (8 + (9 * 3 * 8) + (3 * 8) * 2 + 8) + 2 * 3
2 + ((2 * 5 + 4 + 8 + 3 * 7) + 3 + 3 + 6 * 3)
9 + (2 * (5 + 3 + 2 + 9 + 2 + 3) * 7 * 4 + (8 * 2 + 7))`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInputA,
};
expected = 71;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInputB,
};
expected = 51;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInputC,
};
expected = 26;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInputD,
};
expected = 437;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInputE,
};
expected = 12240;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInputF,
};
expected = 13632;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 18213007238947;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInputA,
};
expected = 231;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInputB,
};
expected = 51;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInputC,
};
expected = 46;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInputD,
};
expected = 1445;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInputE,
};
expected = 669060;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: sampleInputF,
};
expected = 23340;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 14
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 388966573054664;
test(func, input, expected, testNum, lowestTest, highestTest);