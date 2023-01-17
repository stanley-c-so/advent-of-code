/*

--- Day 15: Science for Hungry People ---

Today, you set out on the task of perfecting your milk-dunking cookie recipe. All you have to do is find the right balance of ingredients.

Your recipe leaves room for exactly 100 teaspoons of ingredients. You make a list of the remaining ingredients you could use to finish the recipe (your puzzle input) and their properties per teaspoon:

capacity (how well it helps the cookie absorb milk)
durability (how well it keeps the cookie intact when full of milk)
flavor (how tasty it makes the cookie)
texture (how it improves the feel of the cookie)
calories (how many calories it adds to the cookie)

You can only measure ingredients in whole-teaspoon amounts accurately, and you have to be accurate so you can reproduce your results in the future. The total score of a cookie can be found by adding up each of the properties (negative totals become 0) and then multiplying together everything except calories.

For instance, suppose you have these two ingredients:

Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3

Then, choosing to use 44 teaspoons of butterscotch and 56 teaspoons of cinnamon (because the amounts of each ingredient must add up to 100) would result in a cookie with the following properties:

A capacity of 44*-1 + 56*2 = 68
A durability of 44*-2 + 56*3 = 80
A flavor of 44*6 + 56*-2 = 152
A texture of 44*3 + 56*-1 = 76

Multiplying these together (68 * 80 * 152 * 76, ignoring calories for now) results in a total score of 62842880, which happens to be the best score possible given these ingredients. If any properties had produced a negative total, it would have instead become zero, causing the whole score to multiply to zero.

Given the ingredients in your kitchen and their properties, what is the total score of the highest-scoring cookie you can make?


--- Part Two ---

Your cookie recipe becomes wildly popular! Someone asks if you can make another recipe that has exactly 500 calories per cookie (so they can use it as a meal replacement). Keep the rest of your award-winning process the same (100 teaspoons, same ingredients, same scoring system).

For example, given the ingredients above, if you had instead selected 40 teaspoons of butterscotch and 60 teaspoons of cinnamon (which still adds to 100), the total calorie count would be 40*8 + 60*3 = 500. The total score would go down, though: only 57600000, the best you can do in such trying circumstances.

Given the ingredients in your kitchen and their properties, what is the total score of the highest-scoring cookie you can make with a calorie total of 500?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function findQuantitiesOfIngredients (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const CALORIE_TARGET = 500;
  const PROPERTIES = [ 'capacity', 'durability', 'flavor', 'texture' ];

  // DATA STRUCTURES
  const DATA = {};
  for (const line of inputArr) {
    const split = line.split(' ');
    const ingredient = split[0].slice(0, -1);
    const capacity = +(split[2].slice(0, -1));
    const durability = +(split[4].slice(0, -1));
    const flavor = +(split[6].slice(0, -1));
    const texture = +(split[8].slice(0, -1));
    const calories = +split[10];

    DATA[ingredient] = { capacity, durability, flavor, texture, calories };
  }
  const INGREDIENTS = Object.keys(DATA);

  // HELPER FUNCTION - GIVEN AN ARRANGEMENT OF INGREDIENT QUANTITIES, CALCULATE RESULTING SCORE
  function calculateScore(ingredients) {
    const factors = [];
    for (const property of PROPERTIES) {
      let sum = 0;
      for (let i = 0; i < ingredients.length; ++i) {
        sum += ingredients[i] * DATA[INGREDIENTS[i]][property];
      }
      factors.push(Math.max(sum, 0));                                           // negative sums become 0 instead
    }
    return factors.reduce((product, num) => product * num, 1);
  }

  // HELPER FUNCTION - GIVEN AN ARRANGEMENT OF INGREDIENT QUANTITIES, CALCULATE TOTAL CALORIE COUNT
  function calculateCalories(ingredients) {
    let sum = 0;
    for (let i = 0; i < ingredients.length; ++i) {
      sum += ingredients[i] * DATA[INGREDIENTS[i]].calories;
    }
    return sum;
  }

  // ANALYZE - BACKTRACKING
  let bestScore = 0;
  const ARRANGEMENT = [];
  let teaspoonsAvailable = 100;

  function backtrack(i) {

    // BASE CASE
    if (i === INGREDIENTS.length) {
      if (part === 1                                                            // PART 1: CONSIDER EVERY ARRANGEMENT
          || calculateCalories(ARRANGEMENT) === CALORIE_TARGET                  // PART 2: ONLY CONSIDER ARRANGEMENTS WITH CALORIE TOTAL MATCHING TARGET
      ) {
        bestScore = Math.max(bestScore, calculateScore(ARRANGEMENT));
      }
    }

    // SPECIAL CASE: LAST INGREDIENT
    else if (i === INGREDIENTS.length - 1) {
      ARRANGEMENT.push(teaspoonsAvailable);                                     // for the last ingredient, always use remaining amount of tsp available
      backtrack(i + 1);
      ARRANGEMENT.pop();
    }

    // RECURSIVE CASE
    else {
      for (let t = 0; t <= teaspoonsAvailable; ++t) {                           // for all other ingredients, try every possible quantity of tsp
        ARRANGEMENT.push(t);
        teaspoonsAvailable -= t;
        backtrack(i + 1);
        ARRANGEMENT.pop();
        teaspoonsAvailable += t;
      }
    }
  }

  backtrack(0);
  return bestScore;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findQuantitiesOfIngredients;
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
`Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 62842880;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 222870;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 57600000;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 117936;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);