// --- Day 1: The Tyranny of the Rocket Equation ---

// PART 1:

// Santa has become stranded at the edge of the Solar System while delivering presents to other planets! To accurately calculate his position in space, safely align his warp drive, and return to Earth in time to save Christmas, he needs you to bring him measurements from fifty stars.

// Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

// The Elves quickly load you into a spacecraft and prepare to launch.

// At the first Go / No Go poll, every Elf is Go until the Fuel Counter-Upper. They haven't determined the amount of fuel required yet.

// Fuel required to launch a given module is based on its mass. Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.

// For example:

// For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
// For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
// For a mass of 1969, the fuel required is 654.
// For a mass of 100756, the fuel required is 33583.
// The Fuel Counter-Upper needs to know the total fuel requirement. To find it, individually calculate the fuel needed for the mass of each module (your puzzle input), then add together all the fuel values.

// What is the sum of the fuel requirements for all of the modules on your spacecraft?

// PART 2:

// During the second Go / No Go poll, the Elf in charge of the Rocket Equation Double-Checker stops the launch sequence. Apparently, you forgot to include additional fuel for the fuel you just added.

// Fuel itself requires fuel just like a module - take its mass, divide by three, round down, and subtract 2. However, that fuel also requires fuel, and that fuel requires fuel, and so on. Any mass that would require negative fuel should instead be treated as if it requires zero fuel; the remaining mass, if any, is instead handled by wishing really hard, which has no mass and is outside the scope of this calculation.

// So, for each module mass, calculate its fuel and add it to the total. Then, treat the fuel amount you just calculated as the input mass and repeat the process, continuing until a fuel requirement is zero or negative. For example:

// A module of mass 14 requires 2 fuel. This fuel requires no further fuel (2 divided by 3 and rounded down is 0, which would call for a negative fuel), so the total fuel required is still just 2.
// At first, a module of mass 1969 requires 654 fuel. Then, this fuel requires 216 more fuel (654 / 3 - 2). 216 then requires 70 more fuel, which requires 21 fuel, which requires 5 fuel, which requires no further fuel. So, the total fuel required for a module of mass 1969 is 654 + 216 + 70 + 21 + 5 = 966.
// The fuel required by a module of mass 100756 and its fuel is: 33583 + 11192 + 3728 + 1240 + 411 + 135 + 43 + 12 + 2 = 50346.
// What is the sum of the fuel requirements for all of the modules on your spacecraft when also taking into account the mass of the added fuel? (Calculate the fuel requirements for each module separately, then add them all up at the end.)

// SWITCHING BETWEEN SOLUTIONS:
const totalFuel = solution_1;

function solution_1 (part, modulesStr) {
  const modules = modulesStr.split('\n').map(element => Number(element));
  
  if (part === 1) {
    return modules.reduce((total, curModule) => total + Math.max(0, Math.floor(curModule / 3) - 2), 0);
  } else {
    let total = 0;
    for (const curModule of modules) {
      let fuel = curModule;
      while (fuel > 0) {
        fuel = Math.max(0, Math.floor(fuel / 3) - 2);
        total += fuel;
      }
    }
    return total;
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = totalFuel;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `123835
  66973
  63652
  99256
  56009
  58012
  130669
  109933
  52958
  131656
  144786
  50437
  134194
  80230
  50326
  118204
  102780
  135520
  142248
  80341
  51071
  71346
  134081
  142321
  136230
  55934
  79697
  90116
  107825
  133052
  130259
  99566
  83066
  90923
  58475
  134697
  91830
  105838
  109003
  125258
  108679
  87310
  79813
  109814
  65616
  69275
  118405
  105178
  93140
  79535
  138051
  55728
  71875
  121207
  52011
  81209
  129059
  135782
  62791
  72135
  77765
  109498
  73862
  134825
  148898
  81633
  53277
  109858
  91672
  115105
  132871
  138334
  135049
  73083
  79234
  129281
  86062
  88448
  99612
  52138
  149290
  120562
  118975
  92896
  51162
  122410
  75479
  137800
  142149
  123518
  67806
  89937
  85963
  104764
  56710
  51314
  67275
  61135
  77580
  74726`;

// Test case 1
input = {
  part: 1,
  modulesStr: `12`,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  modulesStr: `14`,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  modulesStr: `1969`,
};
expected = 654;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  modulesStr: `100756`,
};
expected = 33583;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  modulesStr: actualInput,
};
expected = 3226822;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  modulesStr: `14`,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  modulesStr: `1969`,
};
expected = 966;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  modulesStr: `100756`,
};
expected = 50346;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  modulesStr: actualInput,
};
expected = 4837367;
test(func, input, expected, testNum, lowestTest, highestTest);