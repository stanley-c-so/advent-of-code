/*

--- Day 12: Subterranean Sustainability ---

The year 518 is significantly more underground than your history books implied. Either that, or you've arrived in a vast cavern network under the North Pole.

After exploring a little, you discover a long tunnel that contains a row of small pots as far as you can see to your left and right. A few of them contain plants - someone is trying to grow things in these geothermally-heated caves.

The pots are numbered, with 0 in front of you. To the left, the pots are numbered -1, -2, -3, and so on; to the right, 1, 2, 3.... Your puzzle input contains a list of pots from 0 to the right and whether they do (#) or do not (.) currently contain a plant, the initial state. (No other pots currently contain plants.) For example, an initial state of #..##.... indicates that pots 0, 3, and 4 currently contain plants.

Your puzzle input also contains some notes you find on a nearby table: someone has been trying to figure out how these plants spread to nearby pots. Based on the notes, for each generation of plants, a given pot has or does not have a plant based on whether that pot (and the two pots on either side of it) had a plant in the last generation. These are written as LLCRR => N, where L are pots to the left, C is the current pot being considered, R are the pots to the right, and N is whether the current pot will have a plant in the next generation. For example:

A note like ..#.. => . means that a pot that contains a plant but with no plants within two pots of it will not have a plant in it during the next generation.
A note like ##.## => . means that an empty pot with two plants on each side of it will remain empty in the next generation.
A note like .##.# => # means that a pot has a plant in a given generation if, in the previous generation, there were plants in that pot, the one immediately to the left, and the one two pots to the right, but not in the ones immediately to the right and two to the left.

It's not clear what these plants are for, but you're sure it's important, so you'd like to make sure the current configuration of plants is sustainable by determining what will happen after 20 generations.

For example, given the following input:

initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #

For brevity, in this example, only the combinations which do produce a plant are listed. (Your input includes all possible combinations.) Then, the next 20 generations will look like this:

                 1         2         3     
       0         0         0         0     
 0: ...#..#.#..##......###...###...........
 1: ...#...#....#.....#..#..#..#...........
 2: ...##..##...##....#..#..#..##..........
 3: ..#.#...#..#.#....#..#..#...#..........
 4: ...#.#..#...#.#...#..#..##..##.........
 5: ....#...##...#.#..#..#...#...#.........
 6: ....##.#.#....#...#..##..##..##........
 7: ...#..###.#...##..#...#...#...#........
 8: ...#....##.#.#.#..##..##..##..##.......
 9: ...##..#..#####....#...#...#...#.......
10: ..#.#..#...#.##....##..##..##..##......
11: ...#...##...#.#...#.#...#...#...#......
12: ...##.#.#....#.#...#.#..##..##..##.....
13: ..#..###.#....#.#...#....#...#...#.....
14: ..#....##.#....#.#..##...##..##..##....
15: ..##..#..#.#....#....#..#.#...#...#....
16: .#.#..#...#.#...##...#...#.#..##..##...
17: ..#...##...#.#.#.#...##...#....#...#...
18: ..##.#.#....#####.#.#.#...##...##..##..
19: .#..###.#..#.#.#######.#.#.#..#.#...#..
20: .#....##....#####...#######....#.#..##.

The generation is shown along the left, where 0 is the initial state. The pot numbers are shown along the top, where 0 labels the center pot, negative-numbered pots extend to the left, and positive pots extend toward the right. Remember, the initial state begins at pot 0, which is not the leftmost pot used in this example.

After one generation, only seven plants remain. The one in pot 0 matched the rule looking for ..#.., the one in pot 4 matched the rule looking for .#.#., pot 9 matched .##.., and so on.

In this example, after 20 generations, the pots shown as # contain plants, the furthest left of which is pot -2, and the furthest right of which is pot 34. Adding up all the numbers of plant-containing pots after the 20th generation produces 325.

After 20 generations, what is the sum of the numbers of all pots which contain a plant?


--- Part Two ---

You realize that 20 generations aren't enough. After all, these plants will need to last another 1500 years to even reach your timeline, not to mention your future.

After fifty billion (50000000000) generations, what is the sum of the numbers of all pots which contain a plant?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function oneDimensionalGameOfLife (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const [ PLANT, EMPTY ] = [ '#', '.' ];
  const NUM_GENERATIONS = part === 1  ? 20                                                  // PART 1: RUN 20 GENERATIONS
                                      : 50000000000;                                        // PART 2: RUN 50 BIL GENERATIONS

  // DATA STRUCTURES
  let PLANTS = new Set();                                                                   // use let for easy reassignment
  const RULES = new Set();
  const SEEN = {};

  // INIT
  let leftmostPlantIdx = null;
  let rightmostPlantIdx = null;

  // PART 2 VALUES TO BE DISCOVERED LATER
  let foundCycle = false;
  let PERIOD = null;
  let SHIFT = null;

  // HELPER FUNCTION - PRODUCE THE ARRANGEMENT FROM LEFTMOST TO RIGHTMOST POT WITH PLANT
  function getArrangementData() {
    let sumOfPotNumsWithPlants = 0;
    let arrangement = '';
    for (let i = leftmostPlantIdx; i <= rightmostPlantIdx; ++i) {
      sumOfPotNumsWithPlants += PLANTS.has(i) ? i : 0;
      arrangement += PLANTS.has(i) ? PLANT : EMPTY;
    }
    return {
      sumOfPotNumsWithPlants,
      arrangement,
    };
  }

  // PARSE INPUT DATA
  for (let i = 0; i < inputArr.length; ++i) {
    const line = inputArr[i];
    if (i === 0) {
      const initialState = line.split('initial state: ')[1];
      for (let idx = 0; idx < initialState.length; ++idx) {
        if (initialState[idx] === PLANT) {
          PLANTS.add(idx);
          if (leftmostPlantIdx === null || idx < leftmostPlantIdx) {
            leftmostPlantIdx = idx;
          }
          if (rightmostPlantIdx === null || idx > rightmostPlantIdx) {
            rightmostPlantIdx = idx;
          }
        }
      }
    }
    else if (i > 1) {
      const [ pattern, result ] = line.split(' => ');
      if (result === PLANT) RULES.add(pattern);
    }
  }

  // INIT SEEN DICTIONARY FOR INITIAL ARRANGEMENT
  const initialArrangement = getArrangementData();
  SEEN[initialArrangement.arrangement] = {
    generation: 0,
    leftmostPlantIdx: 0,
    sum: initialArrangement.sumOfPotNumsWithPlants,
  };

  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;

  for (let generation = 1; generation <= NUM_GENERATIONS; ) {

    if (DISPLAY_EXTRA_INFO
      && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
    ) {
      const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
      console.log(`... ${
        MINS_PASSED
      } mins have passed since beginning this run`);
      console.log(`(currently on generation ${generation})`);
      NEXT_MIN_TARGET = MINS_PASSED + 1;
    }

    if (leftmostPlantIdx === null) break;                                                   // hypothetical, but break if no more plants

    // BUILD NEW STATE
    const NEW_PLANTS = new Set();
    let newLeftmostPlantIdx = null;
    let newRightmostPlantIdx = null;

    // ITERATE THROUGH APPROPRIATE WINDOW BASED ON CURRENT EXTREMA
    for (let i = leftmostPlantIdx - 2; i <= rightmostPlantIdx + 2; ++i) {
      let sequence = '';
      for (let j = i - 2; j <= i + 2; ++j) {
        sequence += PLANTS.has(j) ? PLANT : EMPTY;
      }
      if (RULES.has(sequence)) {
        NEW_PLANTS.add(i);
        if (newLeftmostPlantIdx === null || i < newLeftmostPlantIdx) {
          newLeftmostPlantIdx = i;
        }
        if (newRightmostPlantIdx === null || i > newRightmostPlantIdx) {
          newRightmostPlantIdx = i;
        }
      }
    }

    // COPY OVER NEW STATE
    PLANTS = NEW_PLANTS;
    leftmostPlantIdx = newLeftmostPlantIdx;
    rightmostPlantIdx = newRightmostPlantIdx;

    // PART 2: WE MUST CHECK FOR A CYCLE OR ELSE IT WILL TAKE FOREVER TO DO 50 BIL GENERATIONS
    const { arrangement, sumOfPotNumsWithPlants } = getArrangementData();
    if (arrangement in SEEN && !foundCycle) {
      foundCycle = true;
      SHIFT = leftmostPlantIdx - SEEN[arrangement].leftmostPlantIdx;
      PERIOD = generation - SEEN[arrangement].generation;
      if (DISPLAY_EXTRA_INFO) {
        console.log(`ARRANGEMENT FIRST SEEN IN GENERATION ${
          SEEN[arrangement].generation} REPEATED IN GENERATION ${generation}`);
        console.log(`arrangement: ${arrangement}`);
        console.log(`leftmost index then: ${SEEN[arrangement].leftmostPlantIdx}`);
        console.log(`leftmost index now: ${leftmostPlantIdx}`);
        console.log(`shift: ${SHIFT}`);

        console.log(`sum then: ${SEEN[arrangement].sum}`);
        console.log(`sum now: ${sumOfPotNumsWithPlants}`);
        console.log(`difference in sum: ${
          sumOfPotNumsWithPlants - SEEN[arrangement].sum}`);
      }

      // FAST FORWARD THE APPROPRIATE NUMBER OF GENERATIONS
      const remainingGenerations = NUM_GENERATIONS - generation;
      const numCyclesToGo = Math.floor(remainingGenerations / PERIOD);
      generation = NUM_GENERATIONS - (remainingGenerations % PERIOD) + 1;                   // fast forward the generation

      // THE RELATIVE ARRANGEMENT OF THE PLANTS IS THE SAME, BUT THE STARTING INDEX MAY HAVE SHIFTED, SO SHIFT ACCORDINGLY
      const SHIFTED_PLANTS = new Set();
      for (const num of PLANTS) SHIFTED_PLANTS.add(num + numCyclesToGo * SHIFT);
      PLANTS = SHIFTED_PLANTS;
      leftmostPlantIdx += numCyclesToGo * SHIFT;
      rightmostPlantIdx += numCyclesToGo * SHIFT;

      continue;                                                                             // i.e. don't increment generation
    }
    else SEEN[arrangement] = {
      generation,
      leftmostPlantIdx,
      sum: getArrangementData().sumOfPotNumsWithPlants,
    };

    ++generation;                                                                           // unless we just found a cycle, increment generation
  }

  const { sumOfPotNumsWithPlants, arrangement } = getArrangementData();

  if (DISPLAY_EXTRA_INFO) {
    console.log(`RESULT FROM POT ${
      leftmostPlantIdx} TO POT ${rightmostPlantIdx}:`);
    console.log(arrangement);
  }

  if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return sumOfPotNumsWithPlants;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = oneDimensionalGameOfLife;
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
`initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 325;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1733;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1000000000508;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);