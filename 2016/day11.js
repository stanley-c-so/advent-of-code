/*

--- Day 11: Radioisotope Thermoelectric Generators ---

You come upon a column of four floors that have been entirely sealed off from the rest of the building except for a small dedicated lobby. There are some radiation warnings and a big sign which reads "Radioisotope Testing Facility".

According to the project status board, this facility is currently being used to experiment with Radioisotope Thermoelectric Generators (RTGs, or simply "generators") that are designed to be paired with specially-constructed microchips. Basically, an RTG is a highly radioactive rock that generates electricity through heat.

The experimental RTGs have poor radiation containment, so they're dangerously radioactive. The chips are prototypes and don't have normal radiation shielding, but they do have the ability to generate an electromagnetic radiation shield when powered. Unfortunately, they can only be powered by their corresponding RTG. An RTG powering a microchip is still dangerous to other microchips.

In other words, if a chip is ever left in the same area as another RTG, and it's not connected to its own RTG, the chip will be fried. Therefore, it is assumed that you will follow procedure and keep chips connected to their corresponding RTG when they're in the same room, and away from other RTGs otherwise.

These microchips sound very interesting and useful to your current activities, and you'd like to try to retrieve them. The fourth floor of the facility has an assembling machine which can make a self-contained, shielded computer for you to take with you - that is, if you can bring it all of the RTGs and microchips.

Within the radiation-shielded part of the facility (in which it's safe to have these pre-assembly RTGs), there is an elevator that can move between the four floors. Its capacity rating means it can carry at most yourself and two RTGs or microchips in any combination. (They're rigged to some heavy diagnostic equipment - the assembling machine will detach it for you.) As a security measure, the elevator will only function if it contains at least one RTG or microchip. The elevator always stops on each floor to recharge, and this takes long enough that the items within it and the items on that floor can irradiate each other. (You can prevent this if a Microchip and its Generator end up on the same floor in this way, as they can be connected while the elevator is recharging.)

You make some notes of the locations of each component of interest (your puzzle input). Before you don a hazmat suit and start moving things around, you'd like to have an idea of what you need to do.

When you enter the containment area, you and the elevator will start on the first floor.

For example, suppose the isolated area has the following arrangement:

The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.
As a diagram (F# for a Floor number, E for Elevator, H for Hydrogen, L for Lithium, M for Microchip, and G for Generator), the initial state looks like this:

F4 .  .  .  .  .  
F3 .  .  .  LG .  
F2 .  HG .  .  .  
F1 E  .  HM .  LM 

Then, to get everything up to the assembling machine on the fourth floor, the following steps could be taken:

Bring the Hydrogen-compatible Microchip to the second floor, which is safe because it can get power from the Hydrogen Generator:

F4 .  .  .  .  .  
F3 .  .  .  LG .  
F2 E  HG HM .  .  
F1 .  .  .  .  LM 

Bring both Hydrogen-related items to the third floor, which is safe because the Hydrogen-compatible microchip is getting power from its generator:

F4 .  .  .  .  .  
F3 E  HG HM LG .  
F2 .  .  .  .  .  
F1 .  .  .  .  LM 

Leave the Hydrogen Generator on floor three, but bring the Hydrogen-compatible Microchip back down with you so you can still use the elevator:

F4 .  .  .  .  .  
F3 .  HG .  LG .  
F2 E  .  HM .  .  
F1 .  .  .  .  LM 

At the first floor, grab the Lithium-compatible Microchip, which is safe because Microchips don't affect each other:

F4 .  .  .  .  .  
F3 .  HG .  LG .  
F2 .  .  .  .  .  
F1 E  .  HM .  LM 

Bring both Microchips up one floor, where there is nothing to fry them:

F4 .  .  .  .  .  
F3 .  HG .  LG .  
F2 E  .  HM .  LM 
F1 .  .  .  .  .  

Bring both Microchips up again to floor three, where they can be temporarily connected to their corresponding generators while the elevator recharges, preventing either of them from being fried:

F4 .  .  .  .  .  
F3 E  HG HM LG LM 
F2 .  .  .  .  .  
F1 .  .  .  .  .  

Bring both Microchips to the fourth floor:

F4 E  .  HM .  LM 
F3 .  HG .  LG .  
F2 .  .  .  .  .  
F1 .  .  .  .  .  

Leave the Lithium-compatible microchip on the fourth floor, but bring the Hydrogen-compatible one so you can still use the elevator; this is safe because although the Lithium Generator is on the destination floor, you can connect Hydrogen-compatible microchip to the Hydrogen Generator there:

F4 .  .  .  .  LM 
F3 E  HG HM LG .  
F2 .  .  .  .  .  
F1 .  .  .  .  .  

Bring both Generators up to the fourth floor, which is safe because you can connect the Lithium-compatible Microchip to the Lithium Generator upon arrival:

F4 E  HG .  LG LM 
F3 .  .  HM .  .  
F2 .  .  .  .  .  
F1 .  .  .  .  .  

Bring the Lithium Microchip with you to the third floor so you can use the elevator:

F4 .  HG .  LG .  
F3 E  .  HM .  LM 
F2 .  .  .  .  .  
F1 .  .  .  .  .  

Bring both Microchips to the fourth floor:

F4 E  HG HM LG LM 
F3 .  .  .  .  .  
F2 .  .  .  .  .  
F1 .  .  .  .  .  

In this arrangement, it takes 11 steps to collect all of the objects at the fourth floor for assembly. (Each elevator stop counts as one step, even if nothing is added to or removed from it.)

In your situation, what is the minimum number of steps required to bring all of the objects to the fourth floor?


--- Part Two ---

You step into the cleanroom separating the lobby from the isolated area and put on the hazmat suit.

Upon entering the isolated containment area, however, you notice some extra parts on the first floor that weren't listed on the record outside:

An elerium generator.
An elerium-compatible microchip.
A dilithium generator.
A dilithium-compatible microchip.

These work just like the other generators and microchips. You'll have to get them up to assembly as well.

What is the minimum number of steps required to bring all of the objects, including these four new ones, to the fourth floor?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function moveStuffToTopFloorWithBFS (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const REF = {
    'H': 'H',
    'L': 'L',
    'polonium': 'Po',
    'thulium': 'Tm',
    'promethium': 'Pm',
    'ruthenium': 'Ru',
    'cobalt': 'Co',
    'elerium': 'El',
    'dilithium': 'Dl',
  };

  const ELEVATOR = 'E';

  // UTILITY FUNCTION: GIVEN A STATE ARRAY, SORT ALL ITEMS WITHIN EACH FLOOR, AND STRINGIFY SO THAT IT CAN BE COMPARED WITH VISITED SET AND WINNING STATE
  function serialize(state) {
    return state.map(floor => floor.sort()).join('|');
  }

  // UTILITY FUNCTION: GIVEN A FLOOR CONFIGURATION, MAKE SURE THERE ARE NO UNPAIRED MICROCHIPS IN THE PRESENCE OF INCOMPATIBLE GENERATORS
  function verifyFloor(floor) {
    const microchipsOnFloor = floor.filter(item => item.at(-1) === 'M');
    const generatorsOnFloor = floor.filter(item => item.at(-1) === 'G');
    for (const microchip of microchipsOnFloor) {
      const type = microchip.slice(0, microchip.length - 1);
      const generator = type + 'G';
      if (generatorsOnFloor.length && !floor.includes(generator)) return false;                                   // FALSE if there ARE generators, but not the compatible one for the current microchip
    }
    return true;                                                                                                  // TRUE if no problems with any microchips
  }

  // PARSE INPUT DATA, GENERATE INITIAL STATE
  const initialState = [];
  const generators = [];                                                                                          // track all generators to create winning state
  const microchips = [];                                                                                          // track all microchips to create winning state
  for (const line of inputArr) {
    const floor = [];
    const split = line.split(' ');
    for (let i = 0; i < split.length; ++i) {
      if (split[i].slice(0, 9) === 'generator') {                                                                 // NOTE: slice required to handle period at end of sentence
        const generator = REF[split[i - 1]] + 'G';
        generators.push(generator);
        floor.push(generator);
      }
      if (split[i].slice(0, 9) === 'microchip') {
        const microchip = REF[split[i - 1].split('-')[0]] + 'M';
        microchips.push(microchip);
        floor.push(microchip);
      }
    }
    initialState.push(floor);                                                                                     // NOTE: assume input data provides information about the floors in order from first to fourth
  }
  if (part === 2) {                                                                                               // PART 2: ADD 4 NEW ITEMS
    const eleriumGenerator = REF['elerium'] + 'G';
    const eleriumMicrochip = REF['elerium'] + 'M';
    const dilithiumGenerator = REF['dilithium'] + 'G';
    const dilithiumMicrochip = REF['dilithium'] + 'M';

    generators.push(eleriumGenerator);
    generators.push(dilithiumGenerator);
    microchips.push(eleriumMicrochip);
    microchips.push(dilithiumMicrochip);

    initialState[0].push(eleriumGenerator);
    initialState[0].push(eleriumMicrochip);
    initialState[0].push(dilithiumGenerator);
    initialState[0].push(dilithiumMicrochip);
  }
  initialState[0].push(ELEVATOR);                                                                                 // NOTE: don't forget to include elevator

  const winState = serialize([ [], [], [], [ ELEVATOR, ...generators, ...microchips ] ]);                         // win state has everything on 4th floor

  // INIT BFS
  const Q = new Queue([ initialState, 0 ]);
  const visited = new Set();

  // ANALYZE BFS
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;
  while (!Q.isEmpty()) {

    if (DISPLAY_EXTRA_INFO
      && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) === NEXT_MIN_TARGET)
    {
      console.log(`... ${
        Math.floor((Date.now() - TIME_AT_START)/(1000*60))
      } mins have passed since beginning this run`);
      ++NEXT_MIN_TARGET;
    }

    // dequeue and serialize state
    const [ state, moves ] = Q.dequeue().val;
    const serial = serialize(state);

    // skip visited states
    if (visited.has(serial)) continue;
    visited.add(serial);

    // check if win condition
    if (serial === winState) {
      if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
      return moves;
    }

    // find all possible neighboring states from here
    let elevatorFloor;
    for (let i = 0; i < 4; ++i) {
      if (state[i].includes(ELEVATOR)) {
        elevatorFloor = i;
        break;
      }
    }
    const neighboringFloors = [elevatorFloor - 1, elevatorFloor + 1].filter(floor => 0 <= floor && floor < 4);    // check above and below (if floor in bounds)

    const itemsOnThisFloor = state[elevatorFloor].filter(item => item !== ELEVATOR);                              // do not include elevator for movable items
    
    // case A: take one thing only
    for (const takenItem of itemsOnThisFloor) {

      const takenItems = [ ELEVATOR, takenItem ];                                                                 // NOTE: add back the elevator itself as an 'item', since it moves, for purposes of the new state

      if (verifyFloor(itemsOnThisFloor.filter(item => !takenItems.includes(item)))) {                             // first, verify no issues with this floor if items taken away
        for (const neighboringFloor of neighboringFloors) {
          if (verifyFloor([ ...state[neighboringFloor], ...takenItems ])) {                                       // then, verify no issues if items brought to candidate floor
            Q.enqueue([                                                                                           // if all checks work out, enqueue this possibility
              state.map((_, floor) => {                                                                           // NOTE: must DEEP CLONE the state
                if (floor === elevatorFloor) return state[floor].filter(item => !takenItems.includes(item));      // remove taken items from current floor
                if (floor === neighboringFloor) return [ ...state[floor], ...takenItems ];                        // add taken items to destination floor
                return [ ...state[floor] ];                                                                       // leave all other floors the same
              }),
              moves + 1,                                                                                          // increment moves
            ]);
          }
        }
      }
    }

    // case B: take two things
    for (let i = 0; i < itemsOnThisFloor.length - 1; ++i) {
      for (let j = i + 1; j < itemsOnThisFloor.length; ++j) {

        const takenItems = [ ELEVATOR, itemsOnThisFloor[i], itemsOnThisFloor[j] ];

        if (verifyFloor(itemsOnThisFloor.filter(item => !takenItems.includes(item)))) {
          for (const neighboringFloor of neighboringFloors) {
            if (verifyFloor([ ...state[neighboringFloor], ...takenItems ])) {
              Q.enqueue([
                state.map((_, floor) => {
                  if (floor === elevatorFloor) return state[floor].filter(item => !takenItems.includes(item));
                  if (floor === neighboringFloor) return [ ...state[floor], ...takenItems ];
                  return [ ...state[floor] ];
                }),
                moves + 1,
              ]);
            }
          }
        }
      }
    }
  }

  if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  throw 'ERROR: DID NOT FIND SOLUTION';
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = moveStuffToTopFloorWithBFS;
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
`The first floor contains a H-compatible microchip and a L-compatible microchip.
The second floor contains a H generator.
The third floor contains a L generator.
The fourth floor contains nothing relevant.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 11;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 47;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 71;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);