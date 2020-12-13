// --- Day 13: Shuttle Search ---

// Your ferry can make it safely to a nearby port, but it won't get much further. When you call to book another ship, you discover that no ships embark from that port to your vacation island. You'll need to get from the port to the nearest airport.

// Fortunately, a shuttle bus service is available to bring you from the sea port to the airport! Each bus has an ID number that also indicates how often the bus leaves for the airport.

// Bus schedules are defined based on a timestamp that measures the number of minutes since some fixed reference point in the past. At timestamp 0, every bus simultaneously departed from the sea port. After that, each bus travels to the airport, then various other locations, and finally returns to the sea port to repeat its journey forever.

// The time this loop takes a particular bus is also its ID number: the bus with ID 5 departs from the sea port at timestamps 0, 5, 10, 15, and so on. The bus with ID 11 departs at 0, 11, 22, 33, and so on. If you are there when the bus departs, you can ride that bus to the airport!

// Your notes (your puzzle input) consist of two lines. The first line is your estimate of the earliest timestamp you could depart on a bus. The second line lists the bus IDs that are in service according to the shuttle company; entries that show x must be out of service, so you decide to ignore them.

// To save time once you arrive, your goal is to figure out the earliest bus you can take to the airport. (There will be exactly one such bus.)

// For example, suppose you have the following notes:

// 939
// 7,13,x,x,59,x,31,19

// Here, the earliest timestamp you could depart is 939, and the bus IDs in service are 7, 13, 59, 31, and 19. Near timestamp 939, these bus IDs depart at the times marked D:

// time   bus 7   bus 13  bus 59  bus 31  bus 19
// 929      .       .       .       .       .
// 930      .       .       .       D       .
// 931      D       .       .       .       D
// 932      .       .       .       .       .
// 933      .       .       .       .       .
// 934      .       .       .       .       .
// 935      .       .       .       .       .
// 936      .       D       .       .       .
// 937      .       .       .       .       .
// 938      D       .       .       .       .
// 939      .       .       .       .       .
// 940      .       .       .       .       .
// 941      .       .       .       .       .
// 942      .       .       .       .       .
// 943      .       .       .       .       .
// 944      .       .       D       .       .
// 945      D       .       .       .       .
// 946      .       .       .       .       .
// 947      .       .       .       .       .
// 948      .       .       .       .       .
// 949      .       D       .       .       .

// The earliest bus you could take is bus ID 59. It doesn't depart until timestamp 944, so you would need to wait 944 - 939 = 5 minutes before it departs. Multiplying the bus ID by the number of minutes you'd need to wait gives 295.

// What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?

// --- Part Two ---

// The shuttle company is running a contest: one gold coin for anyone that can find the earliest timestamp such that the first bus ID departs at that time and each subsequent listed bus ID departs at that subsequent minute. (The first line in your input is no longer relevant.)

// For example, suppose you have the same list of bus IDs as above:

// 7,13,x,x,59,x,31,19

// An x in the schedule means there are no constraints on what bus IDs must depart at that time.

// This means you are looking for the earliest timestamp (called t) such that:

// Bus ID 7 departs at timestamp t.
// Bus ID 13 departs one minute after timestamp t.
// There are no requirements or restrictions on departures at two or three minutes after timestamp t.
// Bus ID 59 departs four minutes after timestamp t.
// There are no requirements or restrictions on departures at five minutes after timestamp t.
// Bus ID 31 departs six minutes after timestamp t.
// Bus ID 19 departs seven minutes after timestamp t.
// The only bus departures that matter are the listed bus IDs at their specific offsets from t. Those bus IDs can depart at other times, and other bus IDs can depart at those times. For example, in the list above, because bus ID 19 must depart seven minutes after the timestamp at which bus ID 7 departs, bus ID 7 will always also be departing with bus ID 19 at seven minutes after timestamp t.

// In this example, the earliest timestamp at which this occurs is 1068781:

// time     bus 7   bus 13  bus 59  bus 31  bus 19
// 1068773    .       .       .       .       .
// 1068774    D       .       .       .       .
// 1068775    .       .       .       .       .
// 1068776    .       .       .       .       .
// 1068777    .       .       .       .       .
// 1068778    .       .       .       .       .
// 1068779    .       .       .       .       .
// 1068780    .       .       .       .       .
// 1068781    D       .       .       .       .
// 1068782    .       D       .       .       .
// 1068783    .       .       .       .       .
// 1068784    .       .       .       .       .
// 1068785    .       .       D       .       .
// 1068786    .       .       .       .       .
// 1068787    .       .       .       D       .
// 1068788    D       .       .       .       D
// 1068789    .       .       .       .       .
// 1068790    .       .       .       .       .
// 1068791    .       .       .       .       .
// 1068792    .       .       .       .       .
// 1068793    .       .       .       .       .
// 1068794    .       .       .       .       .
// 1068795    D       D       .       .       .
// 1068796    .       .       .       .       .
// 1068797    .       .       .       .       .

// In the above example, bus ID 7 departs at timestamp 1068788 (seven minutes after t). This is fine; the only requirement on that minute is that bus ID 19 departs then, and it does.

// Here are some other examples:

// The earliest timestamp that matches the list 17,x,13,19 is 3417.
// 67,7,59,61 first occurs at timestamp 754018.
// 67,x,7,59,61 first occurs at timestamp 779210.
// 67,7,x,59,61 first occurs at timestamp 1261476.
// 1789,37,47,1889 first occurs at timestamp 1202161486.

// However, with so many bus IDs in your list, surely the actual earliest timestamp will be larger than 100000000000000!

// What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?

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
    const filteredBusTimes = busTimes.filter(e => !isNaN(e));                         // now we can filter out NaN from our data
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
      currentTime = A;                                                                // reset currentTime back down to the first time we satisfied all offsets
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
expected = 783685719679632;
test(func, input, expected, testNum, lowestTest, highestTest);