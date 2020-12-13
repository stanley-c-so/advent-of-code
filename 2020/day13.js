// COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)

// COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

function analyzeBusSchedule (part, inputStr) {
  const inputArr = inputStr.split('\n');

  const busTimes = inputArr[1].split(",").map(n => +n);         // these represent the number of mins in the period of each bus

  if (part === 1) {                                             // PART 1: FIND FIRST BUS TO LEAVE ON OR AFTER EARLIEST TIME

    const earliestTime = +inputArr[0];
    let lowest = Infinity;
    let busNum = null;
    for (const busTime of busTimes) {
      if (isNaN(busTime)) continue;                             // skip "x" data (which turned into NaN after casting each element to a number)
      if (earliestTime % busTime === 0) return 0;               // if a bus arrives exactly at earliestTime, you wait 0 mins! (won't happen)
      const timeToWait = busTime - (earliestTime % busTime);    // previous bus comes (e % b) mins before e, and next one comes b mins later
      if (timeToWait < lowest) {                                // update lowest if timeToWait is lower
        lowest = timeToWait;
        busNum = busTime;                                       // since the bus number is the same as how often it comes
      }
    }
    return busNum * lowest;

  } else {                                                                            // PART 2: FIND THE FIRST TIME THAT SATISFIES ALL BUS OFFSETS

    const offset = {};
    for (let i = 0; i < busTimes.length; ++i) {                                       // we couldn't filter data earlier because we need index values for offset
      if (!isNaN(busTimes[i])) offset[busTimes[i]] = i;                               // skip "x" data (which turned into NaN after casting each element to a number)
    }
    const filteredBusTimes = busTimes.filter(e => !isNaN(e)).sort((a, b) => a - b);   // now we can filter out NaN from our data, and sort in increasing order
    let currentTime = filteredBusTimes[0] - offset[filteredBusTimes[0]];              // simulate time starting with the earliest time that satisfies the first offset
    let delta = filteredBusTimes[0];                                                  // delta is the amount we can increment by while satisfying all offsets so far
    for (let i = 1; i < filteredBusTimes.length; ++i) {
      const busTime = filteredBusTimes[i];
      while ((currentTime + offset[busTime]) % busTime) currentTime += delta;         // keep increasing currentTime by delta until we satisfy busTime's offset
      if (i === filteredBusTimes.length - 1) break;                                   // if this is the final number, we are done - break and return currentTime
      const A = currentTime;                                                          // A is the first time we satisfied all offsets so far
      currentTime += delta;                                                           // increase by delta once so currentTime is no longer A
      while ((currentTime + offset[busTime]) % busTime) currentTime += delta;         // keep increasing currentTime by delta until we satisfy busTime's offset again
      const B = currentTime;                                                          // B is the second time we satisfied all offsets so far
      delta = B - A;                                                                  // we can now increase delta to B - A to speed up our simulation
    }
    return currentTime;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeBusSchedule;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInputA = `939
7,13,x,x,59,x,31,19`;

const sampleInputB = `null
17,x,13,19`;

const sampleInputC = `null
67,7,59,61`;

const sampleInputD = `null
67,x,7,59,61`;

const sampleInputE = `null
67,7,x,59,61`;

const sampleInputF = `null
1789,37,47,1889`;

const actualInput = `1000390
23,x,x,x,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,383,x,x,x,x,x,x,x,x,x,x,x,x,13,17,x,x,x,x,19,x,x,x,x,x,x,x,x,x,29,x,503,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,37`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInputA,
};
expected = 295;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2298;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInputA,
};
expected = 1068781;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: sampleInputB,
};
expected = 3417;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInputC,
};
expected = 754018;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInputD,
};
expected = 779210;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInputE,
};
expected = 1261476;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInputF,
};
expected = 1202161486;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 783685719679632 ;
test(func, input, expected, testNum, lowestTest, highestTest);