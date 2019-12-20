// --- Day 12: The N-Body Problem ---

// PART 1:

// The space near Jupiter is not a very safe place; you need to be careful of a big distracting red spot, extreme radiation, and a whole lot of moons swirling around. You decide to start by tracking the four largest moons: Io, Europa, Ganymede, and Callisto.

// After a brief scan, you calculate the position of each moon (your puzzle input). You just need to simulate their motion so you can avoid them.

// Each moon has a 3-dimensional position (x, y, and z) and a 3-dimensional velocity. The position of each moon is given in your scan; the x, y, and z velocity of each moon starts at 0.

// Simulate the motion of the moons in time steps. Within each time step, first update the velocity of every moon by applying gravity. Then, once all moons' velocities have been updated, update the position of every moon by applying velocity. Time progresses by one step once all of the positions are updated.

// To apply gravity, consider every pair of moons. On each axis (x, y, and z), the velocity of each moon changes by exactly +1 or -1 to pull the moons together. For example, if Ganymede has an x position of 3, and Callisto has a x position of 5, then Ganymede's x velocity changes by +1 (because 5 > 3) and Callisto's x velocity changes by -1 (because 3 < 5). However, if the positions on a given axis are the same, the velocity on that axis does not change for that pair of moons.

// Once all gravity has been applied, apply velocity: simply add the velocity of each moon to its own position. For example, if Europa has a position of x=1, y=2, z=3 and a velocity of x=-2, y=0,z=3, then its new position would be x=-1, y=2, z=6. This process does not modify the velocity of any moon.

// For example, suppose your scan reveals the following positions:

// <x=-1, y=0, z=2>
// <x=2, y=-10, z=-7>
// <x=4, y=-8, z=8>
// <x=3, y=5, z=-1>

// Simulating the motion of these moons would produce the following:

// After 0 steps:
// pos=<x=-1, y=  0, z= 2>, vel=<x= 0, y= 0, z= 0>
// pos=<x= 2, y=-10, z=-7>, vel=<x= 0, y= 0, z= 0>
// pos=<x= 4, y= -8, z= 8>, vel=<x= 0, y= 0, z= 0>
// pos=<x= 3, y=  5, z=-1>, vel=<x= 0, y= 0, z= 0>

// After 1 step:
// pos=<x= 2, y=-1, z= 1>, vel=<x= 3, y=-1, z=-1>
// pos=<x= 3, y=-7, z=-4>, vel=<x= 1, y= 3, z= 3>
// pos=<x= 1, y=-7, z= 5>, vel=<x=-3, y= 1, z=-3>
// pos=<x= 2, y= 2, z= 0>, vel=<x=-1, y=-3, z= 1>

// After 2 steps:
// pos=<x= 5, y=-3, z=-1>, vel=<x= 3, y=-2, z=-2>
// pos=<x= 1, y=-2, z= 2>, vel=<x=-2, y= 5, z= 6>
// pos=<x= 1, y=-4, z=-1>, vel=<x= 0, y= 3, z=-6>
// pos=<x= 1, y=-4, z= 2>, vel=<x=-1, y=-6, z= 2>

// After 3 steps:
// pos=<x= 5, y=-6, z=-1>, vel=<x= 0, y=-3, z= 0>
// pos=<x= 0, y= 0, z= 6>, vel=<x=-1, y= 2, z= 4>
// pos=<x= 2, y= 1, z=-5>, vel=<x= 1, y= 5, z=-4>
// pos=<x= 1, y=-8, z= 2>, vel=<x= 0, y=-4, z= 0>

// After 4 steps:
// pos=<x= 2, y=-8, z= 0>, vel=<x=-3, y=-2, z= 1>
// pos=<x= 2, y= 1, z= 7>, vel=<x= 2, y= 1, z= 1>
// pos=<x= 2, y= 3, z=-6>, vel=<x= 0, y= 2, z=-1>
// pos=<x= 2, y=-9, z= 1>, vel=<x= 1, y=-1, z=-1>

// After 5 steps:
// pos=<x=-1, y=-9, z= 2>, vel=<x=-3, y=-1, z= 2>
// pos=<x= 4, y= 1, z= 5>, vel=<x= 2, y= 0, z=-2>
// pos=<x= 2, y= 2, z=-4>, vel=<x= 0, y=-1, z= 2>
// pos=<x= 3, y=-7, z=-1>, vel=<x= 1, y= 2, z=-2>

// After 6 steps:
// pos=<x=-1, y=-7, z= 3>, vel=<x= 0, y= 2, z= 1>
// pos=<x= 3, y= 0, z= 0>, vel=<x=-1, y=-1, z=-5>
// pos=<x= 3, y=-2, z= 1>, vel=<x= 1, y=-4, z= 5>
// pos=<x= 3, y=-4, z=-2>, vel=<x= 0, y= 3, z=-1>

// After 7 steps:
// pos=<x= 2, y=-2, z= 1>, vel=<x= 3, y= 5, z=-2>
// pos=<x= 1, y=-4, z=-4>, vel=<x=-2, y=-4, z=-4>
// pos=<x= 3, y=-7, z= 5>, vel=<x= 0, y=-5, z= 4>
// pos=<x= 2, y= 0, z= 0>, vel=<x=-1, y= 4, z= 2>

// After 8 steps:
// pos=<x= 5, y= 2, z=-2>, vel=<x= 3, y= 4, z=-3>
// pos=<x= 2, y=-7, z=-5>, vel=<x= 1, y=-3, z=-1>
// pos=<x= 0, y=-9, z= 6>, vel=<x=-3, y=-2, z= 1>
// pos=<x= 1, y= 1, z= 3>, vel=<x=-1, y= 1, z= 3>

// After 9 steps:
// pos=<x= 5, y= 3, z=-4>, vel=<x= 0, y= 1, z=-2>
// pos=<x= 2, y=-9, z=-3>, vel=<x= 0, y=-2, z= 2>
// pos=<x= 0, y=-8, z= 4>, vel=<x= 0, y= 1, z=-2>
// pos=<x= 1, y= 1, z= 5>, vel=<x= 0, y= 0, z= 2>

// After 10 steps:
// pos=<x= 2, y= 1, z=-3>, vel=<x=-3, y=-2, z= 1>
// pos=<x= 1, y=-8, z= 0>, vel=<x=-1, y= 1, z= 3>
// pos=<x= 3, y=-6, z= 1>, vel=<x= 3, y= 2, z=-3>
// pos=<x= 2, y= 0, z= 4>, vel=<x= 1, y=-1, z=-1>

// Then, it might help to calculate the total energy in the system. The total energy for a single moon is its potential energy multiplied by its kinetic energy. A moon's potential energy is the sum of the absolute values of its x, y, and z position coordinates. A moon's kinetic energy is the sum of the absolute values of its velocity coordinates. Below, each line shows the calculations for a moon's potential energy (pot), kinetic energy (kin), and total energy:

// Energy after 10 steps:
// pot: 2 + 1 + 3 =  6;   kin: 3 + 2 + 1 = 6;   total:  6 * 6 = 36
// pot: 1 + 8 + 0 =  9;   kin: 1 + 1 + 3 = 5;   total:  9 * 5 = 45
// pot: 3 + 6 + 1 = 10;   kin: 3 + 2 + 3 = 8;   total: 10 * 8 = 80
// pot: 2 + 0 + 4 =  6;   kin: 1 + 1 + 1 = 3;   total:  6 * 3 = 18
// Sum of total energy: 36 + 45 + 80 + 18 = 179

// In the above example, adding together the total energy for all moons after 10 steps produces the total energy in the system, 179.

// Here's a second example:

// <x=-8, y=-10, z=0>
// <x=5, y=5, z=10>
// <x=2, y=-7, z=3>
// <x=9, y=-8, z=-3>

// Every ten steps of simulation for 100 steps produces:

// After 0 steps:
// pos=<x= -8, y=-10, z=  0>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  5, y=  5, z= 10>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  2, y= -7, z=  3>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  9, y= -8, z= -3>, vel=<x=  0, y=  0, z=  0>

// After 10 steps:
// pos=<x= -9, y=-10, z=  1>, vel=<x= -2, y= -2, z= -1>
// pos=<x=  4, y= 10, z=  9>, vel=<x= -3, y=  7, z= -2>
// pos=<x=  8, y=-10, z= -3>, vel=<x=  5, y= -1, z= -2>
// pos=<x=  5, y=-10, z=  3>, vel=<x=  0, y= -4, z=  5>

// After 20 steps:
// pos=<x=-10, y=  3, z= -4>, vel=<x= -5, y=  2, z=  0>
// pos=<x=  5, y=-25, z=  6>, vel=<x=  1, y=  1, z= -4>
// pos=<x= 13, y=  1, z=  1>, vel=<x=  5, y= -2, z=  2>
// pos=<x=  0, y=  1, z=  7>, vel=<x= -1, y= -1, z=  2>

// After 30 steps:
// pos=<x= 15, y= -6, z= -9>, vel=<x= -5, y=  4, z=  0>
// pos=<x= -4, y=-11, z=  3>, vel=<x= -3, y=-10, z=  0>
// pos=<x=  0, y= -1, z= 11>, vel=<x=  7, y=  4, z=  3>
// pos=<x= -3, y= -2, z=  5>, vel=<x=  1, y=  2, z= -3>

// After 40 steps:
// pos=<x= 14, y=-12, z= -4>, vel=<x= 11, y=  3, z=  0>
// pos=<x= -1, y= 18, z=  8>, vel=<x= -5, y=  2, z=  3>
// pos=<x= -5, y=-14, z=  8>, vel=<x=  1, y= -2, z=  0>
// pos=<x=  0, y=-12, z= -2>, vel=<x= -7, y= -3, z= -3>

// After 50 steps:
// pos=<x=-23, y=  4, z=  1>, vel=<x= -7, y= -1, z=  2>
// pos=<x= 20, y=-31, z= 13>, vel=<x=  5, y=  3, z=  4>
// pos=<x= -4, y=  6, z=  1>, vel=<x= -1, y=  1, z= -3>
// pos=<x= 15, y=  1, z= -5>, vel=<x=  3, y= -3, z= -3>

// After 60 steps:
// pos=<x= 36, y=-10, z=  6>, vel=<x=  5, y=  0, z=  3>
// pos=<x=-18, y= 10, z=  9>, vel=<x= -3, y= -7, z=  5>
// pos=<x=  8, y=-12, z= -3>, vel=<x= -2, y=  1, z= -7>
// pos=<x=-18, y= -8, z= -2>, vel=<x=  0, y=  6, z= -1>

// After 70 steps:
// pos=<x=-33, y= -6, z=  5>, vel=<x= -5, y= -4, z=  7>
// pos=<x= 13, y= -9, z=  2>, vel=<x= -2, y= 11, z=  3>
// pos=<x= 11, y= -8, z=  2>, vel=<x=  8, y= -6, z= -7>
// pos=<x= 17, y=  3, z=  1>, vel=<x= -1, y= -1, z= -3>

// After 80 steps:
// pos=<x= 30, y= -8, z=  3>, vel=<x=  3, y=  3, z=  0>
// pos=<x= -2, y= -4, z=  0>, vel=<x=  4, y=-13, z=  2>
// pos=<x=-18, y= -7, z= 15>, vel=<x= -8, y=  2, z= -2>
// pos=<x= -2, y= -1, z= -8>, vel=<x=  1, y=  8, z=  0>

// After 90 steps:
// pos=<x=-25, y= -1, z=  4>, vel=<x=  1, y= -3, z=  4>
// pos=<x=  2, y= -9, z=  0>, vel=<x= -3, y= 13, z= -1>
// pos=<x= 32, y= -8, z= 14>, vel=<x=  5, y= -4, z=  6>
// pos=<x= -1, y= -2, z= -8>, vel=<x= -3, y= -6, z= -9>

// After 100 steps:
// pos=<x=  8, y=-12, z= -9>, vel=<x= -7, y=  3, z=  0>
// pos=<x= 13, y= 16, z= -3>, vel=<x=  3, y=-11, z= -5>
// pos=<x=-29, y=-11, z= -1>, vel=<x= -3, y=  7, z=  4>
// pos=<x= 16, y=-13, z= 23>, vel=<x=  7, y=  1, z=  1>

// Energy after 100 steps:
// pot:  8 + 12 +  9 = 29;   kin: 7 +  3 + 0 = 10;   total: 29 * 10 = 290
// pot: 13 + 16 +  3 = 32;   kin: 3 + 11 + 5 = 19;   total: 32 * 19 = 608
// pot: 29 + 11 +  1 = 41;   kin: 3 +  7 + 4 = 14;   total: 41 * 14 = 574
// pot: 16 + 13 + 23 = 52;   kin: 7 +  1 + 1 =  9;   total: 52 *  9 = 468
// Sum of total energy: 290 + 608 + 574 + 468 = 1940

// What is the total energy in the system after simulating the moons given in your scan for 1000 steps?

// PART 2:

// All this drifting around in space makes you wonder about the nature of the universe. Does history really repeat itself? You're curious whether the moons will ever return to a previous state.

// Determine the number of steps that must occur before all of the moons' positions and velocities exactly match a previous point in time.

// For example, the first example above takes 2772 steps before they exactly match a previous point in time; it eventually returns to the initial state:

// After 0 steps:
// pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>

// After 2770 steps:
// pos=<x=  2, y= -1, z=  1>, vel=<x= -3, y=  2, z=  2>
// pos=<x=  3, y= -7, z= -4>, vel=<x=  2, y= -5, z= -6>
// pos=<x=  1, y= -7, z=  5>, vel=<x=  0, y= -3, z=  6>
// pos=<x=  2, y=  2, z=  0>, vel=<x=  1, y=  6, z= -2>

// After 2771 steps:
// pos=<x= -1, y=  0, z=  2>, vel=<x= -3, y=  1, z=  1>
// pos=<x=  2, y=-10, z= -7>, vel=<x= -1, y= -3, z= -3>
// pos=<x=  4, y= -8, z=  8>, vel=<x=  3, y= -1, z=  3>
// pos=<x=  3, y=  5, z= -1>, vel=<x=  1, y=  3, z= -1>

// After 2772 steps:
// pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
// pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>
// Of course, the universe might last for a very long time before repeating. Here's a copy of the second example from above:

// <x=-8, y=-10, z=0>
// <x=5, y=5, z=10>
// <x=2, y=-7, z=3>
// <x=9, y=-8, z=-3>

// This set of initial positions takes 4686774924 steps before it repeats a previous state! Clearly, you might need to find a more efficient way to simulate the universe.

// How many steps does it take to reach the first state that exactly matches a previous state?

function jupiterMoons (part, initialPositions, steps = Infinity) {                    // in part 2, there is no known stopping point, so steps should be set to Infinity

  // REFERENCE CONSTANTS
  const moons = ['A', 'B', 'C', 'D'];                                                 // hard coded for 4 moons. this could probably be generalized by grabbing character codes
  const axes = ['x', 'y', 'z'];

  // HELPER FUNCTIONS TO APPLY GRAVITY AND NEW VELOCITIES
  function applyGravity () {
    for (let moon1 = 0; moon1 < moons.length - 1; moon1++) {                          // double nested for loop needed to compare every moon against every other
      for (let moon2 = moon1 + 1; moon2 < moons.length; moon2++) {
        for (const axis of axes) {                                                    // if axis values of the two moons are different, their velocities increment/decrement toward one another
          if (positions[moons[moon1]][axis] > positions[moons[moon2]][axis]) {
            velocities[moons[moon1]][axis]--;
            velocities[moons[moon2]][axis]++;
          }
          if (positions[moons[moon1]][axis] < positions[moons[moon2]][axis]) {
            velocities[moons[moon1]][axis]++;
            velocities[moons[moon2]][axis]--;
          }
        }
      }
    }
  }

  function applyVelocity () {
    for (const moon of moons) {
      for (const axis of axes) {
        positions[moon][axis] += velocities[moon][axis];
      }
    }
  }

  // PART 2 UTILITY FUNCTIONS
  function GCD (num, denom) {                                                         // uses Euclidean algorithm (https://en.wikipedia.org/wiki/Euclidean_algorithm)
    num = Math.abs(num);
    denom = Math.abs(denom);
    return denom ? GCD(denom, num % denom) : num;                                     // credit to Phrogz (https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction)
  }

  function LCM (num1, num2) {
    return (!num1 || !num2) ? 0 : Math.abs((num1 * num2)) / GCD(num1, num2);          // credit to w3resource (https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php)
  }

  function stringifyState (axis) {                                                    // stringify all positions and velocities data for this axis
    let output = '';
    for (const moon of moons) {
      output += `${positions[moon][axis]},${velocities[moon][axis]}`;                 // the format doesn't matter, as long as unique states lead to unique string results
    }
    return output;
  }

  // INITIALIZATIONS: POSITIONS AND VELOCITIES
  const positions = {};
  for (const moon of moons) positions[moon] = {...initialPositions[moon]};            // IMPORTANT: make deep copy of initialPositions

  const velocities = {};
  for (const moon of moons) velocities[moon] = {x: 0, y: 0, z: 0};                    // the problem provides that the default velocities are 0 in each axis

  // PART 2 INITIALIZATIONS: THE KEY IS THAT STATES BETWEEN AXES NEVER AFFECT ONE ANOTHER. THUS, THE STATE OF EVERY AXIS IS KEPT SEPARATE, UNTIL INDIVIDUAL AXIS PERIODS ARE FOUND. THEN, CALCULATE LCM.
  const initialStates = {};                                                           // each key is an axis, and each value is that axis's initial stringified state
  const periods = {};                                                                 // these begin as undefined and we will stop part 2 once all of these are defined
  for (const axis of axes) {
    initialStates[axis] = stringifyState(axis);                                       // initial states appear at i = 0 (note that the for loop iterates i from 1 .. steps)
    periods[axis] = undefined;
  }

  // SIMULATE UP TO `steps` ITERATIONS
  for (let i = 1; i <= steps; i++) {                                                  // part 2 deals with step numbers, so counting from 1 .. steps is easier than 0 ... steps
    applyGravity();
    applyVelocity();

    if (part === 2) {
      for (const axis of axes) {
        currentState = stringifyState(axis);                                          // calculate the stringified state for each axis
        if (!periods[axis] && currentState === initialStates[axis]) {                 // if the period of this axis has not yet been found, but the current state matches the initial state...
          periods[axis] = i;                                                          // ... then now we know the period is the current step #, i
        }
      }
      if (!(Object.values(periods).includes(undefined))) break;                       // IMPORTANT: once all periods have been found, break!!! otherwise, infinite loop
    }
  }

  // PART 1 VS PART 2
  if (part === 1) {

    const energies = {};
    for (const moon of moons) energies[moon] = {potential: 0, kinetic: 0, total: 0};      // set up initial energies to 0
    let totalEnergy = 0;

    for (const moon of moons) {
      energies[moon].potential = Math.abs(positions[moon].x) + Math.abs(positions[moon].y) + Math.abs(positions[moon].z);
      energies[moon].kinetic = Math.abs(velocities[moon].x) + Math.abs(velocities[moon].y) + Math.abs(velocities[moon].z);
      energies[moon].total = energies[moon].potential * energies[moon].kinetic;
      totalEnergy += energies[moon].total;
    }

    return [totalEnergy, energies];

  } else {

    const periodValues = Object.values(periods);                                          // now we only care about the period values for the three axes
    return [periodValues, LCM(LCM(periodValues[0], periodValues[1]), periodValues[2])];   // get the LCM of all period values (run LCM on the first two values, then run again with the third)

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = jupiterMoons;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = {                                                   // original input was formatted differently, but it was small enough for me to modify the format manually here
  A: {x: 4, y: 1, z: 1},
  B: {x: 11, y: -18, z: -1},
  C: {x: -2, y: -10, z: -4},
  D: {x: -7, y: -2, z: 14},
};

// Test case 1
input = {
  part: 1,
  initialPositions: {                                                   // original input was formatted differently, but it was small enough for me to modify the format manually here
    A: {x: -1, y: 0, z: 2},
    B: {x: 2, y: -10, z: -7},
    C: {x: 4, y: -8, z: 8},
    D: {x: 3, y: 5, z: -1},
  },
  steps: 10,
};
expected = [179,
  {
    A: {potential: 6, kinetic: 6, total: 36},
    B: {potential: 9, kinetic: 5, total: 45},
    C: {potential: 10, kinetic: 8, total: 80},
    D: {potential: 6, kinetic: 3, total: 18},
  }
];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  initialPositions: {                                                   // original input was formatted differently, but it was small enough for me to modify the format manually here
    A: {x: -8, y: -10, z: 0},
    B: {x: 5, y: 5, z: 10},
    C: {x: 2, y: -7, z: 3},
    D: {x: 9, y: -8, z: -3},
  },
  steps: 100,
};
expected = [1940,
  {
    A: {potential: 29, kinetic: 10, total: 290},
    B: {potential: 32, kinetic: 19, total: 608},
    C: {potential: 41, kinetic: 14, total: 574},
    D: {potential: 52, kinetic: 9, total: 468},
  }
];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  initialPositions: actualInput,
  steps: 1000,
};
expected = [9493,
  {
    A: {potential: 100, kinetic: 37, total: 3700},
    B: {potential: 181, kinetic: 19, total: 3439},
    C: {potential: 55, kinetic: 20, total: 1100},
    D: {potential: 33, kinetic: 38, total: 1254},
  }
];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  initialPositions: {                                                   // original input was formatted differently, but it was small enough for me to modify the format manually here
    A: {x: -1, y: 0, z: 2},
    B: {x: 2, y: -10, z: -7},
    C: {x: 4, y: -8, z: 8},
    D: {x: 3, y: 5, z: -1},
  },
};
expected = [
  [18, 28, 44],                                                         // this is the value i calculated
  2772,                                                                 // this value is provided by the prompt
];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  initialPositions: {                                                   // original input was formatted differently, but it was small enough for me to modify the format manually here
    A: {x: -8, y: -10, z: 0},
    B: {x: 5, y: 5, z: 10},
    C: {x: 2, y: -7, z: 3},
    D: {x: 9, y: -8, z: -3},
  },
};
expected = [
  [2028, 5898, 4702],                                                   // this is the value i calculated
  4686774924,                                                           // this value is provided by the prompt
];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  initialPositions: actualInput,
};
expected = [
  [268296, 84032, 231614],                                              // this is the value i calculated
  326365108375488,                                                      // my solution takes a bit over 2 seconds to calculate! be patient!
];
test(func, input, expected, testNum, lowestTest, highestTest);