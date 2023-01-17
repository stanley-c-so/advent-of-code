/*

--- Day 14: Reindeer Olympics ---

This year is the Reindeer Olympics! Reindeer can fly at high speeds, but must rest occasionally to recover their energy. Santa would like to know which of his reindeer is fastest, and so he has them race.

Reindeer can only either be flying (always at their top speed) or resting (not moving at all), and always spend whole seconds in either state.

For example, suppose you have the following Reindeer:

Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.

After one second, Comet has gone 14 km, while Dancer has gone 16 km. After ten seconds, Comet has gone 140 km, while Dancer has gone 160 km. On the eleventh second, Comet begins resting (staying at 140 km), and Dancer continues on for a total distance of 176 km. On the 12th second, both reindeer are resting. They continue to rest until the 138th second, when Comet flies for another ten seconds. On the 174th second, Dancer flies for another 11 seconds.

In this example, after the 1000th second, both reindeer are resting, and Comet is in the lead at 1120 km (poor Dancer has only gotten 1056 km by that point). So, in this situation, Comet would win (if the race ended at 1000 seconds).

Given the descriptions of each reindeer (in your puzzle input), after exactly 2503 seconds, what distance has the winning reindeer traveled?


--- Part Two ---

Seeing how reindeer move in bursts, Santa decides he's not pleased with the old scoring system.

Instead, at the end of each second, he awards one point to the reindeer currently in the lead. (If there are multiple reindeer tied for the lead, they each get one point.) He keeps the traditional 2503 second time limit, of course, as doing otherwise would be entirely ridiculous.

Given the example reindeer from above, after the first second, Dancer is in the lead and gets one point. He stays in the lead until several seconds into Comet's second burst: after the 140th second, Comet pulls into the lead and gets his first point. Of course, since Dancer had been in the lead for the 139 seconds before that, he has accumulated 139 points by the 140th second.

After the 1000th second, Dancer has accumulated 689 points, while poor Comet, our old champion, only has 312. So, with the new scoring system, Dancer would win (if the race ended at 1000 seconds).

Again given the descriptions of each reindeer (in your puzzle input), after exactly 2503 seconds, how many points does the winning reindeer have?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function reindeerRace (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const SIMULATION_TIME = extraParam;

  // DATA STRUCTURES
  const DATA = {};                                                          // keys are reindeer; values are objects with keys:
                                                                            // - speed
                                                                            // - flyTime
                                                                            // - restTime

  const STATE = {};                                                         // keys are reindeer; values are objects with keys:
                                                                            // - flying
                                                                            // - timeOfNextSwitch
                                                                            // - distance
                                                                            // - score (PART 2)

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const split = line.split(' ');
    const reindeer = split[0];
    const speed = +split[3];
    const flyTime = +split[6];
    const restTime = +split[13];
    DATA[reindeer] = {
      speed,
      flyTime,
      restTime
    };
    STATE[reindeer] = {
      flying: true,                                                         // every reindeer starts off flying
      timeOfNextSwitch: flyTime,                                            // therefore the time of next switch is its flyTime
      distance: 0,                                                          // init distance 0
      score: 0                                                              // init score 0
    };
  }

  // SIMULATE RACE
  for (let t = 1; t <= SIMULATION_TIME; ++t) {

    for (const reindeer in STATE) {
      const [ state, data ] = [ STATE[reindeer], DATA[reindeer] ];          // variables for convenience and ease of reading
      if (state.flying) {                                                   // update distances for all reindeer that are flying
        state.distance += data.speed;
      }
      if (state.timeOfNextSwitch === t) {                                   // update states for all reindeer that need to switch
        state.timeOfNextSwitch += state.flying  ? data.restTime
                                                : data.flyTime;
        state.flying = !state.flying;
      }
    }

    // PART 2: AWARD POINTS TO REINDEERS IN THE LEAD
    const maxDistance = Math.max(
      ...Object.keys(STATE).map(reindeer => STATE[reindeer].distance)
    );
    for (const reindeer in STATE) {
      if (STATE[reindeer].distance === maxDistance) {
        ++STATE[reindeer].score;
      }
    }

  }

  if (DISPLAY_EXTRA_INFO) {
    for (const reindeer in STATE) {
      console.log(`${reindeer}:`, STATE[reindeer].distance);
    }
  }

  // CALCULATE WINNER
  let maxDistance = 0;
  let maxScore = 0;
  for (const reindeer in STATE) {
    maxDistance = Math.max(maxDistance, STATE[reindeer].distance);
    maxScore = Math.max(maxScore, STATE[reindeer].score);
  }

  return part === 1 ? maxDistance                                           // PART 1: WINNER IS REINDEER THAT WENT MAX DISTANCE
                    : maxScore;                                             // PART 2: WINNER IS REINDEER THAT SPENT MOST TIME IN THE LEAD
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = reindeerRace;
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
`Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 1000,
  DEBUG: true,
};
expected = 1120;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 2503,
};
expected = 2660;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 1000,
  DEBUG: true,
};
expected = 689;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 2503,
};
expected = 1256;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);