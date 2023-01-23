/*

--- Day 20: Particle Swarm ---

Suddenly, the GPU contacts you, asking for help. Someone has asked it to simulate too many particles, and it won't be able to finish them all in time to render the next frame at this rate.

It transmits to you a buffer (your puzzle input) listing each particle in order (starting with particle 0, then particle 1, particle 2, and so on). For each particle, it provides the X, Y, and Z coordinates for the particle's position (p), velocity (v), and acceleration (a), each in the format <X,Y,Z>.

Each tick, all particles are updated simultaneously. A particle's properties are updated in the following order:

Increase the X velocity by the X acceleration.
Increase the Y velocity by the Y acceleration.
Increase the Z velocity by the Z acceleration.
Increase the X position by the X velocity.
Increase the Y position by the Y velocity.
Increase the Z position by the Z velocity.

Because of seemingly tenuous rationale involving z-buffering, the GPU would like to know which particle will stay closest to position <0,0,0> in the long term. Measure this using the Manhattan distance, which in this situation is simply the sum of the absolute values of a particle's X, Y, and Z position.

For example, suppose you are only given two particles, both of which stay entirely on the X-axis (for simplicity). Drawing the current states of particles 0 and 1 (in that order) with an adjacent a number line and diagram of current X positions (marked in parentheses), the following would take place:

p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>                         (0)(1)

p=< 4,0,0>, v=< 1,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
p=< 2,0,0>, v=<-2,0,0>, a=<-2,0,0>                      (1)   (0)

p=< 4,0,0>, v=< 0,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
p=<-2,0,0>, v=<-4,0,0>, a=<-2,0,0>          (1)               (0)

p=< 3,0,0>, v=<-1,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
p=<-8,0,0>, v=<-6,0,0>, a=<-2,0,0>                         (0)   

At this point, particle 1 will never be closer to <0,0,0> than particle 0, and so, in the long run, particle 0 will stay closest.

Which particle will stay closest to position <0,0,0> in the long term?


--- Part Two ---

To simplify the problem further, the GPU would like to remove any particles that collide. Particles collide if their positions ever exactly match. Because particles are updated simultaneously, more than two particles can collide at the same time and place. Once particles collide, they are removed and cannot collide with anything else after that tick.

For example:

p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>    
p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>    -6 -5 -4 -3 -2 -1  0  1  2  3
p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>    (0)   (1)   (2)            (3)
p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>

p=<-3,0,0>, v=< 3,0,0>, a=< 0,0,0>    
p=<-2,0,0>, v=< 2,0,0>, a=< 0,0,0>    -6 -5 -4 -3 -2 -1  0  1  2  3
p=<-1,0,0>, v=< 1,0,0>, a=< 0,0,0>             (0)(1)(2)      (3)   
p=< 2,0,0>, v=<-1,0,0>, a=< 0,0,0>

p=< 0,0,0>, v=< 3,0,0>, a=< 0,0,0>    
p=< 0,0,0>, v=< 2,0,0>, a=< 0,0,0>    -6 -5 -4 -3 -2 -1  0  1  2  3
p=< 0,0,0>, v=< 1,0,0>, a=< 0,0,0>                       X (3)      
p=< 1,0,0>, v=<-1,0,0>, a=< 0,0,0>

------destroyed by collision------    
------destroyed by collision------    -6 -5 -4 -3 -2 -1  0  1  2  3
------destroyed by collision------                      (3)         
p=< 0,0,0>, v=<-1,0,0>, a=< 0,0,0>

In this example, particles 0, 1, and 2 are simultaneously destroyed at the time and place marked X. On the next tick, particle 3 passes through unharmed.

How many particles are left after all collisions are resolved?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function particlePhysics (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const DATA = [];

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const split = line.split(', ');
    DATA.push({
      position: split[0].slice(3, -1).split(',').map(n => +n),
      velocity: split[1].slice(3, -1).split(',').map(n => +n),
      acceleration: split[2].slice(3, -1).split(',').map(n => +n),
      lastDistanceFromOrigin: null,                                                                       // important for part 1 to know when to terminate
      movingAwayFromOrigin: false,                                                                        // important for part 1 to know when to terminate
    });
  }

  // UTILITY FUNCTION
  const getDistanceFromOrigin = p => DATA[p].position.reduce((distance, axis) => distance + axis**2, 0);

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;

  // HELPER FUNCTION - GETS RELATIVE ORDER OF ALL EXISTING PARTICLES BY POSITION AND AXIS (TIES ARE ARBITRARILY BROKEN BY PARTICLE #)
  function getPositionOrderByAxis() {
    return [
      [ ...PARTICLES ].sort((a, b) => DATA[a].position[0] - DATA[b].position[0] || a - b),
      [ ...PARTICLES ].sort((a, b) => DATA[a].position[1] - DATA[b].position[1] || a - b),
      [ ...PARTICLES ].sort((a, b) => DATA[a].position[2] - DATA[b].position[2] || a - b),
    ];
  }

  // HELPER FUNCTION - GETS RELATIVE ORDER OF ALL EXISTING PARTICLES BY VELOCITY AND AXIS (TIES ARE BROKEN BY ORIGINAL POSITION ORDER)
  function getVelocityOrderByAxis() {
    return [
      [ ...PARTICLES ].sort((a, b) => DATA[a].velocity[0] - DATA[b].velocity[0]
                                    || LOOKUP_ORIGINAL_POSITION_ORDER[a][0] - LOOKUP_ORIGINAL_POSITION_ORDER[b][0]),
      [ ...PARTICLES ].sort((a, b) => DATA[a].velocity[1] - DATA[b].velocity[1]
                                    || LOOKUP_ORIGINAL_POSITION_ORDER[a][1] - LOOKUP_ORIGINAL_POSITION_ORDER[b][1]),
      [ ...PARTICLES ].sort((a, b) => DATA[a].velocity[2] - DATA[b].velocity[2]
                                    || LOOKUP_ORIGINAL_POSITION_ORDER[a][2] - LOOKUP_ORIGINAL_POSITION_ORDER[b][2]),
    ];
  }

  // HELPER FUNCTION - GETS RELATIVE ORDER OF ALL EXISTING PARTICLES BY ACCELERATION AND AXIS (TIES ARE BROKEN BY ORIGINAL VELOCITY ORDER)
  function getAccelerationOrderByAxis() {
    return [
      [ ...PARTICLES ].sort((a, b) => DATA[a].acceleration[0] - DATA[b].acceleration[0]
                                    || LOOKUP_ORIGINAL_VELOCITY_ORDER[a][0] - LOOKUP_ORIGINAL_VELOCITY_ORDER[b][0]),
      [ ...PARTICLES ].sort((a, b) => DATA[a].acceleration[1] - DATA[b].acceleration[1]
                                    || LOOKUP_ORIGINAL_VELOCITY_ORDER[a][1] - LOOKUP_ORIGINAL_VELOCITY_ORDER[b][1]),
      [ ...PARTICLES ].sort((a, b) => DATA[a].acceleration[2] - DATA[b].acceleration[2]
                                    || LOOKUP_ORIGINAL_VELOCITY_ORDER[a][2] - LOOKUP_ORIGINAL_VELOCITY_ORDER[b][2]),
    ];
  }

  // CONSTANTS
  const LIMIT = Number.MAX_SAFE_INTEGER;
  const PARTICLES = new Set( [ ...Array(DATA.length).keys() ] );

  // PRE-PROCESSING - GET ORIGINAL POSITION ORDER
  const ORIGINAL_POSITION_ORDER_BY_AXIS = getPositionOrderByAxis();
  const LOOKUP_ORIGINAL_POSITION_ORDER = {};
  for (let i = 0; i < PARTICLES.size; ++i) {
    for (let axis = 0; axis < 3; ++axis) {
      const particle = ORIGINAL_POSITION_ORDER_BY_AXIS[axis][i];
      if (!(particle in LOOKUP_ORIGINAL_POSITION_ORDER)) {
        LOOKUP_ORIGINAL_POSITION_ORDER[particle] = Array(3).fill(null);
      }
      LOOKUP_ORIGINAL_POSITION_ORDER[particle][axis] = i;
    }
  }

  // PRE-PROCESSING - GET ORIGINAL VELOCITY ORDER (NOTE, THIS HAS TO COME AFTER ORIGINAL POSITION ORDER, BECAUSE THE HELPER FUNCTION
  // IT CALLS RELIES ON ORIGINAL POSITION ORDER HAVING BEEN CALCULATED ALREADY)
  const ORIGINAL_VELOCITY_ORDER_BY_AXIS = getVelocityOrderByAxis();
  const LOOKUP_ORIGINAL_VELOCITY_ORDER = {};
  for (let i = 0; i < PARTICLES.size; ++i) {
    for (let axis = 0; axis < 3; ++axis) {
      const particle = ORIGINAL_VELOCITY_ORDER_BY_AXIS[axis][i];
      if (!(particle in LOOKUP_ORIGINAL_VELOCITY_ORDER)) {
        LOOKUP_ORIGINAL_VELOCITY_ORDER[particle] = Array(3).fill(null);
      }
      LOOKUP_ORIGINAL_VELOCITY_ORDER[particle][axis] = i;
    }
  }

  // ANALYZE
  for (let i = 0; i <= LIMIT; ++i) {

    // TRACK NEW POSITIONS FOR EVERY REMAINING PARTICLE
    const POSITIONS = {};
    for (const particle of PARTICLES) {
      const data = DATA[particle];
      for (let axis = 0; axis < 3; ++axis) {
        data.velocity[axis] += data.acceleration[axis];
        data.position[axis] += data.velocity[axis];
      }
      const position = data.position.join(',');
      if (!(position in POSITIONS)) POSITIONS[position] = [];
      POSITIONS[position].push(particle);
    }
    
    // PART 2: DELETE PARTICLES THAT HAVE COLLIDED
    if (part === 2) {
      let deleteCount = 0;
      for (const position in POSITIONS) {
        if (POSITIONS[position].length > 1) {
          deleteCount += POSITIONS[position].length;
          for (const particle of POSITIONS[position]) {
            PARTICLES.delete(particle);
          }
        }
      }
      if (DISPLAY_EXTRA_INFO && deleteCount) {
        console.log(`ON i = ${i}, DELETED ${deleteCount} PARTICLES | ${PARTICLES.size} PARTICLES REMAIN`);
      }
    }

    // UPDATE WHICH PARTICLES ARE MOVING AWAY FROM ORIGIN
    // (THIS IS NECESSARY FOR TEST CASE 1, WHICH CAN TERMINATE TOO EARLY IF WE DO NOT WAIT FOR ALL PARTICLES TO BE MOVING AWAY FROM ORIGIN,
    // BECAUSE IT WILL END IMMEDIATELY WHEN ALL PARTICLES BEGIN MOVING AWAY FROM EACH OTHER AFTER i === 0, BUT BOTH PARTICLES ARE STILL MOVING
    // TOWARD THE ORIGIN, GIVING A WRONG RESULT)
    for (const particle of PARTICLES) {
      const distanceFromOrigin = getDistanceFromOrigin(particle);
      if (!DATA[particle].movingAwayFromOrigin) {
        if (DATA[particle].lastDistanceFromOrigin !== null
            && distanceFromOrigin > DATA[particle].lastDistanceFromOrigin
        ) {
          DATA[particle].movingAwayFromOrigin = true;
        }
      }
      DATA[particle].lastDistanceFromOrigin = distanceFromOrigin;
    }

    // CHECK FOR TERMINATION CONDITION: GET RELATIVE ORDER OF POSITION, VELOCITY, AND ACCELERATION, FOR ALL 3 AXES
    const positionOrderByAxis = getPositionOrderByAxis().map(axisArr => axisArr.join(''));                // join into string for === comparison
    const velocityOrderByAxis = getVelocityOrderByAxis().map(axisArr => axisArr.join(''));
    const accelerationOrderByAxis = getAccelerationOrderByAxis().map(axisArr => axisArr.join(''));

    if (accelerationOrderByAxis.every((order, i) => {                                                     // if for every axis...
          return order === positionOrderByAxis[i]                                                             // ...acceleration matches position...
                  && order === velocityOrderByAxis[i];                                                        // ...and it also matches velocity...
        })
        && (part === 2 || [ ...PARTICLES ].every(particle => DATA[particle].movingAwayFromOrigin))
    ) {

      if (DISPLAY_EXTRA_INFO) console.log(`TERMINATING ON i: ${i}`);
      break;                                                                                              // ...then terminate (no more collisions)
    }

    if (DISPLAY_EXTRA_INFO
      && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
    ) {
      const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
      console.log(`... ${
        MINS_PASSED
      } mins have passed since beginning this run`);
      NEXT_MIN_TARGET = MINS_PASSED + 1;
    }
  }

  if (part === 1) {                                                                                       // PART 1: FIND PARTICLE THAT WILL REMAIN
                                                                                                          // CLOSEST TO ORIGIN IN THE LONG RUN
                                                                                                          // (i.e. AFTER THE RELATIVE ORDERING IN TERMS
                                                                                                          // OF DISTANCE FROM ORIGIN WILL NO LONGER
                                                                                                          // CHANGE)

    let minDistance = Infinity;
    let particleMinDistance = null;
    for (const particle of PARTICLES) {
      const distance = DATA[particle].lastDistanceFromOrigin;
      if (distance < minDistance) {
        minDistance = distance;
        particleMinDistance = particle;
      }
    }

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return particleMinDistance;

  } else {                                                                                                // PART 2: FIND # PARTICLES REMAINING AFTER
                                                                                                          // ALL COLLISIONS HAVE HAPPENED

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return PARTICLES.size;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = particlePhysics;
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
`p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>
p=<4,0,0>, v=<0,0,0>, a=<-2,0,0>`
);

const sampleInput2 = parseSampleInput(
`p=<-6,0,0>, v=<3,0,0>, a=<0,0,0>
p=<-4,0,0>, v=<2,0,0>, a=<0,0,0>
p=<-2,0,0>, v=<1,0,0>, a=<0,0,0>
p=<3,0,0>, v=<-1,0,0>, a=<0,0,0>`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 364;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 420;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);