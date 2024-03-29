/*

--- Day 15: Beacon Exclusion Zone ---

You feel the ground rumble again as the distress signal leads you to a large network of subterranean tunnels. You don't have time to search them all, but you don't need to: your pack contains a set of deployable sensors that you imagine were originally built to locate lost Elves.

The sensors aren't very powerful, but that's okay; your handheld device indicates that you're close enough to the source of the distress signal to use them. You pull the emergency sensor system out of your pack, hit the big button on top, and the sensors zoom off down the tunnels.

Once a sensor finds a spot it thinks will give it a good reading, it attaches itself to a hard surface and begins monitoring for the nearest signal source beacon. Sensors and beacons always exist at integer coordinates. Each sensor knows its own position and can determine the position of a beacon precisely; however, sensors can only lock on to the one beacon closest to the sensor as measured by the Manhattan distance. (There is never a tie where two beacons are the same distance to a sensor.)

It doesn't take long for the sensors to report back their positions and closest beacons (your puzzle input). For example:

Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3

So, consider the sensor at 2,18; the closest beacon to it is at -2,15. For the sensor at 9,16, the closest beacon to it is at 10,16.

Drawing sensors as S and beacons as B, the above arrangement of sensors and beacons looks like this:

               1    1    2    2
     0    5    0    5    0    5
 0 ....S.......................
 1 ......................S.....
 2 ...............S............
 3 ................SB..........
 4 ............................
 5 ............................
 6 ............................
 7 ..........S.......S.........
 8 ............................
 9 ............................
10 ....B.......................
11 ..S.........................
12 ............................
13 ............................
14 ..............S.......S.....
15 B...........................
16 ...........SB...............
17 ................S..........B
18 ....S.......................
19 ............................
20 ............S......S........
21 ............................
22 .......................B....

This isn't necessarily a comprehensive map of all beacons in the area, though. Because each sensor only identifies its closest beacon, if a sensor detects a beacon, you know there are no other beacons that close or closer to that sensor. There could still be beacons that just happen to not be the closest beacon to any sensor. Consider the sensor at 8,7:

               1    1    2    2
     0    5    0    5    0    5
-2 ..........#.................
-1 .........###................
 0 ....S...#####...............
 1 .......#######........S.....
 2 ......#########S............
 3 .....###########SB..........
 4 ....#############...........
 5 ...###############..........
 6 ..#################.........
 7 .#########S#######S#........
 8 ..#################.........
 9 ...###############..........
10 ....B############...........
11 ..S..###########............
12 ......#########.............
13 .......#######..............
14 ........#####.S.......S.....
15 B........###................
16 ..........#SB...............
17 ................S..........B
18 ....S.......................
19 ............................
20 ............S......S........
21 ............................
22 .......................B....

This sensor's closest beacon is at 2,10, and so you know there are no beacons that close or closer (in any positions marked #).

None of the detected beacons seem to be producing the distress signal, so you'll need to work out where the distress beacon is by working out where it isn't. For now, keep things simple by counting the positions where a beacon cannot possibly be along just a single row.

So, suppose you have an arrangement of beacons and sensors like in the example above and, just in the row where y=10, you'd like to count the number of positions a beacon cannot possibly exist. The coverage from all sensors near that row looks like this:

                 1    1    2    2
       0    5    0    5    0    5
 9 ...#########################...
10 ..####B######################..
11 .###S#############.###########.

In this example, in the row where y=10, there are 26 positions where a beacon cannot be present.

Consult the report from the sensors you just deployed. In the row where y=2000000, how many positions cannot contain a beacon?


--- Part Two ---

Your handheld device indicates that the distress signal is coming from a beacon nearby. The distress beacon is not detected by any sensor, but the distress beacon must have x and y coordinates each no lower than 0 and no larger than 4000000.

To isolate the distress beacon's signal, you need to determine its tuning frequency, which can be found by multiplying its x coordinate by 4000000 and then adding its y coordinate.

In the example above, the search space is smaller: instead, the x and y coordinates can each be at most 20. With this reduced search area, there is only a single position that could have a beacon: x=14, y=11. The tuning frequency for this distress beacon is 56000011.

Find the only possible position for the distress beacon. What is its tuning frequency?
*/

// OPTIONAL VARIABLES
const EXPLORE_MIN_MAX = false;
const SEE_AREA_BEING_SKIPPED = false;


// ========== SOLUTION 1: CREATE A FUNCTION THAT FINDS ALL ELIMINATED x VALUES FOR A GIVEN ROW y. (EXPECT LARGE INPUTS IN PART 2; RETURN AS LIST OF
// INTERVALS.) IN PART 1, USE THIS FUNCTION TO COUNT (MINUS ANY KNOWN BEACONS) TO FIND NUMBER OF ELIMINATED x VALUES. IN PART 2, USE THIS FUNCTION IN
// EVERY ROW y WITHIN SEARCH RANGE TO FIND THE ONE PLACE THAT HAS A SINGLE UNELIMINATED x POSITION.

function analyzeSensorCoverage (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // UTILITY
  const getManhattanDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
  const mergeOverlappingRanges = ranges => {
    ranges.sort((a, b) => a[0] - b[0]);
    const mergedRanges = [ ranges[0] ];
    for (const range of ranges) {
      if (range[0] > mergedRanges.at(-1)[1] + 1) mergedRanges.push(range);                  // no overlap
      else mergedRanges.at(-1)[1] = Math.max(mergedRanges.at(-1)[1], range[1]);             // overlap (even if start of interval is 1 more than end of prev)
    }
    return mergedRanges;
  }

  // OPTIONAL INIT
  let minSensorX = Infinity;
  let maxSensorX = -Infinity;
  let minSensorY = Infinity;
  let maxSensorY = -Infinity;
  let minBeaconX = Infinity;
  let maxBeaconX = -Infinity;
  let minBeaconY = Infinity;
  let maxBeaconY = -Infinity;

  // INIT DATA STRUCTURE
  const SENSOR_DATA = {};
  
  // PARSE DATA
  for (const line of inputArr) {

    // ingest from input
    const [LS, RS] = line.split(': closest beacon is at ');
    const [SENSOR_X_DATA, SENSOR_Y_DATA] = LS.split(', ');
    const sensorX = +SENSOR_X_DATA.split('=')[1];
    const sensorY = +SENSOR_Y_DATA.split('=')[1];
    const [BEACON_X_DATA, BEACON_Y_DATA] = RS.split(', ');
    const beaconX = +BEACON_X_DATA.split('=')[1];
    const beaconY = +BEACON_Y_DATA.split('=')[1];

    // save critical information to data structure
    const sensor = `${sensorX},${sensorY}`;
    const beacon = [beaconX, beaconY];
    const manhattanDistance = getManhattanDistance(beaconX, beaconY, sensorX, sensorY)
    SENSOR_DATA[sensor] = { beacon, manhattanDistance };

    // OPTIONAL
    if (EXPLORE_MIN_MAX) {
      minSensorX = Math.min(minSensorX, sensorX);
      maxSensorX = Math.max(maxSensorX, sensorX);
      minSensorY = Math.min(minSensorY, sensorY);
      maxSensorY = Math.max(maxSensorY, sensorY);
      minBeaconX = Math.min(minBeaconX, beaconX);
      maxBeaconX = Math.max(maxBeaconX, beaconX);
      minBeaconY = Math.min(minBeaconY, beaconY);
      maxBeaconY = Math.max(maxBeaconY, beaconY);
    }
  }

  if (EXPLORE_MIN_MAX) {
    console.log(`(sensorX: from ${minSensorX} to ${maxSensorX})`);
    console.log(`(sensorY: from ${minSensorY} to ${maxSensorY})`);
    console.log(`(beaconX: from ${minBeaconX} to ${maxBeaconX})`);
    console.log(`(beaconY: from ${minBeaconY} to ${maxBeaconY})`);
  }

  // HELPER FUNCTION
  function getRangesOfEliminatedXValues(row) {

    // init
    const ranges = [];

    // iterate through sensor data
    for (const sensor in SENSOR_DATA) {                                                     // check every sensor to see if you can make eliminations in row
      const [sensorX, sensorY] = sensor.split(',').map(n => +n);
      const vertDistanceToRow = Math.abs(row - sensorY);
      if (vertDistanceToRow > SENSOR_DATA[sensor].manhattanDistance) continue;              // this sensor's eliminated area does not reach row; skip it
      const horizDistance = SENSOR_DATA[sensor].manhattanDistance - vertDistanceToRow;
      ranges.push([sensorX - horizDistance, sensorX + horizDistance]);
    }

    // merge overlapping intervals to get true range of eliminated x values
    return mergeOverlappingRanges(ranges);
  }

  // ANALYZE
  if (part === 1) {                                                                         // PART 1: FIND # OF ELIMINATED x VALUES IN GIVEN ROW y

    // find intervals of eliminated x values in given row y
    const ROW_TO_CHECK = extraParam;
    const ranges = getRangesOfEliminatedXValues(ROW_TO_CHECK);

    // NOTE: it turns out that ranges above will only have 1 range with our data. in other words, our data would have it such that all ranges of
    // eliminated x values for given row y from the various sensors will overlap. however, going forward, i will NOT make that assumption, and for
    // purposes of part 1 i will account for the possibility of gaps in between the ranges of eliminated x values for given row y.

    // find intervals of gaps
    const gaps = [];
    for (let i = 0; i < ranges.length - 1; ++i) {
      gaps.push([ ranges[i][1] + 1, ranges[i + 1][0] - 1 ]);
    }
    
    // look for beacons in given row y and include them in gaps
    const beaconsInRow = new Set();
    for (const sensor in SENSOR_DATA) {
      const [x, y] = SENSOR_DATA[sensor].beacon;
      if (y === ROW_TO_CHECK) beaconsInRow.add(x);
    }
    for (const beacon of beaconsInRow) gaps.push([beacon, beacon]);
    const gapsWithBeacons = mergeOverlappingRanges(gaps);

    // calculate number of eliminated x values
    const spreadOfEliminatedXValues = ranges.at(-1)[1] - ranges[0][0] + 1;
    const gapCount = gapsWithBeacons.reduce((count, [s, e]) => count += e - s + 1, 0);
    return spreadOfEliminatedXValues - gapCount;

  } else {                                                                                  // PART 2: FIND COORDS OF UNKNOWN DISTRESS BEACON

    const LIMIT_OF_SEARCH_AREA = extraParam;
    const TUNING_FREQUENCY_X_MULTIPLER = 4000000;
    
    const TIME_AT_START = Date.now();
    if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

    for (let y = 0; y <= LIMIT_OF_SEARCH_AREA; ++y) {
    // for (let y = DEBUG ? 0 : 1000000; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at 1000000
    // for (let y = DEBUG ? 0 : 2000000; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at 2000000
    // for (let y = DEBUG ? 0 : 3000000; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at 3000000
    // for (let y = DEBUG ? 0 : 3017867; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at correct answer
    
      const ranges = getRangesOfEliminatedXValues(y);

      // CHECK IF THIS ROW HAS A SINGLE VALUE OF x NOT ELIMINATED:

      // 1) the non-eliminated x is in the middle of the row somewhere
      if (ranges.length > 1) {
        
        if (ranges.length !== 2) {                                                          // sanity check to make sure only 1 gap of possible x values
          throw 'ERROR: TOO MANY GAPS BETWEEN ELIMINATED VALUES OF x';
        }
        const sizeOfGap = ranges[1][0] - ranges[0][1] - 1;
        if (sizeOfGap !== 1) {                                                              // sanity check to make sure only 1 value of x is not eliminated
          throw `ERROR: TOO MANY NON-ELIMINATED VALUES OF x: ${sizeOfGap}`;
        }
        
        if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);

        const x = ranges[0][1] + 1;                                                         // found x; y is given by index in for loop
        return x * TUNING_FREQUENCY_X_MULTIPLER + y;
      }

      // NOTE: THE BELOW ARE POSSIBILITIES THAT ARE HIGHLY IMPROBABLE AND DON'T ACTUALLY HAPPEN WITH THIS DATA

      // 2) the non-eliminated x is at the left edge of search area
      else if (ranges[0][0] > 0) {
        if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
        return y;                                                                           // x is 0
      }

      // 3) the non-eliminated x is at the right edge of search area
      else if (ranges[0][1] < LIMIT_OF_SEARCH_AREA) {
        if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
        return LIMIT_OF_SEARCH_AREA * TUNING_FREQUENCY_X_MULTIPLER + y;                     // x is LIMIT_OF_SEARCH_AREA
      }

    }

    throw 'ERROR: DID NOT FIND LOCATION OF UNKNOWN DISTRESS BEACON';

  }
}


// ========== SOLUTION 2: SIMILAR TO SOLUTION 1 - IN PART 2, CHECK EVERY POSSIBLE ROW y. RUN ACROSS THAT ROW. IF CURRENT POSITION IS IN AN ELIMINATED REGION,
// SKIP TO THE END OF THAT ELIMINATED REGION.

function analyzeSensorCoverage2 (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // UTILITY
  const getManhattanDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
  const mergeOverlappingRanges = ranges => {
    ranges.sort((a, b) => a[0] - b[0]);
    const mergedRanges = [ ranges[0] ];
    for (const range of ranges) {
      if (range[0] > mergedRanges.at(-1)[1] + 1) mergedRanges.push(range);                  // no overlap
      else mergedRanges.at(-1)[1] = Math.max(mergedRanges.at(-1)[1], range[1]);             // overlap (even if start of interval is 1 more than end of prev)
    }
    return mergedRanges;
  }

  // OPTIONAL INIT
  let minSensorX = Infinity;
  let maxSensorX = -Infinity;
  let minSensorY = Infinity;
  let maxSensorY = -Infinity;
  let minBeaconX = Infinity;
  let maxBeaconX = -Infinity;
  let minBeaconY = Infinity;
  let maxBeaconY = -Infinity;

  // INIT DATA STRUCTURE
  const SENSOR_DATA = {};
  
  // PARSE DATA
  for (const line of inputArr) {

    // ingest from input
    const [LS, RS] = line.split(': closest beacon is at ');
    const [SENSOR_X_DATA, SENSOR_Y_DATA] = LS.split(', ');
    const sensorX = +SENSOR_X_DATA.split('=')[1];
    const sensorY = +SENSOR_Y_DATA.split('=')[1];
    const [BEACON_X_DATA, BEACON_Y_DATA] = RS.split(', ');
    const beaconX = +BEACON_X_DATA.split('=')[1];
    const beaconY = +BEACON_Y_DATA.split('=')[1];

    // save critical information to data structure
    const sensor = `${sensorX},${sensorY}`;
    const beacon = [beaconX, beaconY];
    const manhattanDistance = getManhattanDistance(beaconX, beaconY, sensorX, sensorY)
    SENSOR_DATA[sensor] = { beacon, manhattanDistance };

    // OPTIONAL
    if (EXPLORE_MIN_MAX) {
      minSensorX = Math.min(minSensorX, sensorX);
      maxSensorX = Math.max(maxSensorX, sensorX);
      minSensorY = Math.min(minSensorY, sensorY);
      maxSensorY = Math.max(maxSensorY, sensorY);
      minBeaconX = Math.min(minBeaconX, beaconX);
      maxBeaconX = Math.max(maxBeaconX, beaconX);
      minBeaconY = Math.min(minBeaconY, beaconY);
      maxBeaconY = Math.max(maxBeaconY, beaconY);
    }
  }

  if (EXPLORE_MIN_MAX) {
    console.log(`(sensorX: from ${minSensorX} to ${maxSensorX})`);
    console.log(`(sensorY: from ${minSensorY} to ${maxSensorY})`);
    console.log(`(beaconX: from ${minBeaconX} to ${maxBeaconX})`);
    console.log(`(beaconY: from ${minBeaconY} to ${maxBeaconY})`);
  }

  // HELPER FUNCTION
  function getRangesOfEliminatedXValues(row) {

    // init
    const ranges = [];

    // iterate through sensor data
    for (const sensor in SENSOR_DATA) {                                                     // check every sensor to see if you can make eliminations in row
      const [sensorX, sensorY] = sensor.split(',').map(n => +n);
      const vertDistanceToRow = Math.abs(row - sensorY);
      if (vertDistanceToRow > SENSOR_DATA[sensor].manhattanDistance) continue;              // this sensor's eliminated area does not reach row; skip it
      const horizDistance = SENSOR_DATA[sensor].manhattanDistance - vertDistanceToRow;
      ranges.push([sensorX - horizDistance, sensorX + horizDistance]);
    }

    // merge overlapping intervals to get true range of eliminated x values
    return mergeOverlappingRanges(ranges);
  }

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (part === 1) {                                                                         // PART 1: FIND # OF ELIMINATED x VALUES IN GIVEN ROW y

    // find intervals of eliminated x values in given row y
    const ROW_TO_CHECK = extraParam;
    const ranges = getRangesOfEliminatedXValues(ROW_TO_CHECK);

    // NOTE: it turns out that ranges above will only have 1 range with our data. in other words, our data would have it such that all ranges of
    // eliminated x values for given row y from the various sensors will overlap. however, going forward, i will NOT make that assumption, and for
    // purposes of part 1 i will account for the possibility of gaps in between the ranges of eliminated x values for given row y.

    // find intervals of gaps
    const gaps = [];
    for (let i = 0; i < ranges.length - 1; ++i) {
      gaps.push([ ranges[i][1] + 1, ranges[i + 1][0] - 1 ]);
    }
    
    // look for beacons in given row y and include them in gaps
    const beaconsInRow = new Set();
    for (const sensor in SENSOR_DATA) {
      const [x, y] = SENSOR_DATA[sensor].beacon;
      if (y === ROW_TO_CHECK) beaconsInRow.add(x);
    }
    for (const beacon of beaconsInRow) gaps.push([beacon, beacon]);
    const gapsWithBeacons = mergeOverlappingRanges(gaps);

    // calculate number of eliminated x values
    const spreadOfEliminatedXValues = ranges.at(-1)[1] - ranges[0][0] + 1;
    const gapCount = gapsWithBeacons.reduce((count, [s, e]) => count += e - s + 1, 0);
    return spreadOfEliminatedXValues - gapCount;

  } else {                                                                                  // PART 2: FIND COORDS OF UNKNOWN DISTRESS BEACON

    // HELPER FUNCTION: CHECK IF GIVEN x IS INVALID (ELIMINATED) FOR BEING WITHIN RANGE OF A SENSOR
    function checkIfInSensor(x, y) {
      for (const sensor in SENSOR_DATA) {
        const [sensorX, sensorY] = sensor.split(',').map(n => +n);
        const { manhattanDistance } = SENSOR_DATA[sensor];
        const offsetY = Math.abs(sensorY - y);
        if (offsetY > manhattanDistance) continue;
        const offsetX = manhattanDistance - offsetY;
        if (Math.abs(sensorX - x) <= offsetX) {
          return { inSensor: true, rightmostX: sensorX + offsetX };
        }
      }
      return { inSensor: false, rightmostX: null };
    }

    const LIMIT_OF_SEARCH_AREA = extraParam;
    const TUNING_FREQUENCY_X_MULTIPLER = 4000000;
    
    if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

    for (let y = 0; y <= LIMIT_OF_SEARCH_AREA; ++y) {
    // for (let y = DEBUG ? 0 : 1000000; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at 1000000
    // for (let y = DEBUG ? 0 : 2000000; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at 2000000
    // for (let y = DEBUG ? 0 : 3000000; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at 3000000
    // for (let y = DEBUG ? 0 : 3017867; y <= LIMIT_OF_SEARCH_AREA; ++y) {                     // speeds up test 4 by starting at correct answer
    
      for (let x = 0; x <= LIMIT_OF_SEARCH_AREA; ++x) {
        const { inSensor, rightmostX } = checkIfInSensor(x, y);
        if (inSensor) {
          if (SEE_AREA_BEING_SKIPPED) {
            console.log(`(y: ${y} | SKIPPING RANGE OF LENGTH: ${rightmostX - x})`);
          }
          x = rightmostX;
        } else {
          if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
          return x * TUNING_FREQUENCY_X_MULTIPLER + y;
        }
      }

    }

    throw 'ERROR: DID NOT FIND LOCATION OF UNKNOWN DISTRESS BEACON';

  }
}


// ========== SOLUTION 3: IN PART 2, THINK IN TERMS OF RECTANGULAR SEARCH REGIONS - IF REGION IS FULLY COVERED WITHIN THE SEARCH RANGE OF ANY SENSOR,
// THEN WE CAN IMMEDIATELY ELIMINATE THIS REGION. OTHERWISE, SPLIT REGION UP INTO FOUR QUADRANTS (2D BINARY SEARCH) AND RECURSE.

function analyzeSensorCoverage3 (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // UTILITY
  const getManhattanDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
  const mergeOverlappingRanges = ranges => {
    ranges.sort((a, b) => a[0] - b[0]);
    const mergedRanges = [ ranges[0] ];
    for (const range of ranges) {
      if (range[0] > mergedRanges.at(-1)[1] + 1) mergedRanges.push(range);                  // no overlap
      else mergedRanges.at(-1)[1] = Math.max(mergedRanges.at(-1)[1], range[1]);             // overlap (even if start of interval is 1 more than end of prev)
    }
    return mergedRanges;
  }

  // OPTIONAL INIT
  let minSensorX = Infinity;
  let maxSensorX = -Infinity;
  let minSensorY = Infinity;
  let maxSensorY = -Infinity;
  let minBeaconX = Infinity;
  let maxBeaconX = -Infinity;
  let minBeaconY = Infinity;
  let maxBeaconY = -Infinity;
  
  // INIT DATA STRUCTURE
  const SENSOR_DATA = {};
  
  // PARSE DATA
  for (const line of inputArr) {

    // ingest from input
    const [LS, RS] = line.split(': closest beacon is at ');
    const [SENSOR_X_DATA, SENSOR_Y_DATA] = LS.split(', ');
    const sensorX = +SENSOR_X_DATA.split('=')[1];
    const sensorY = +SENSOR_Y_DATA.split('=')[1];
    const [BEACON_X_DATA, BEACON_Y_DATA] = RS.split(', ');
    const beaconX = +BEACON_X_DATA.split('=')[1];
    const beaconY = +BEACON_Y_DATA.split('=')[1];

    // save critical information to data structure
    const sensor = `${sensorX},${sensorY}`;
    const beacon = [beaconX, beaconY];
    const manhattanDistance = getManhattanDistance(beaconX, beaconY, sensorX, sensorY)
    SENSOR_DATA[sensor] = { beacon, manhattanDistance };

    // OPTIONAL
    if (EXPLORE_MIN_MAX) {
      minSensorX = Math.min(minSensorX, sensorX);
      maxSensorX = Math.max(maxSensorX, sensorX);
      minSensorY = Math.min(minSensorY, sensorY);
      maxSensorY = Math.max(maxSensorY, sensorY);
      minBeaconX = Math.min(minBeaconX, beaconX);
      maxBeaconX = Math.max(maxBeaconX, beaconX);
      minBeaconY = Math.min(minBeaconY, beaconY);
      maxBeaconY = Math.max(maxBeaconY, beaconY);
    }
  }

  if (EXPLORE_MIN_MAX) {
    console.log(`(sensorX: from ${minSensorX} to ${maxSensorX})`);
    console.log(`(sensorY: from ${minSensorY} to ${maxSensorY})`);
    console.log(`(beaconX: from ${minBeaconX} to ${maxBeaconX})`);
    console.log(`(beaconY: from ${minBeaconY} to ${maxBeaconY})`);
  }

  // HELPER FUNCTION
  function getRangesOfEliminatedXValues(row) {
    const MEMO = {};
    function helper(row) {
      if (!(row in MEMO)) {
        // init
        const ranges = [];

        // iterate through sensor data
        for (const sensor in SENSOR_DATA) {                                                 // check every sensor to see if you can make eliminations in row
          const [sensorX, sensorY] = sensor.split(',').map(n => +n);
          const vertDistanceToRow = Math.abs(row - sensorY);
          if (vertDistanceToRow > SENSOR_DATA[sensor].manhattanDistance) continue;          // this sensor's eliminated area does not reach row; skip it
          const horizDistance = SENSOR_DATA[sensor].manhattanDistance - vertDistanceToRow;
          ranges.push([sensorX - horizDistance, sensorX + horizDistance]);
        }

        // merge overlapping intervals to get true range of eliminated x values
        MEMO[row] = mergeOverlappingRanges(ranges);
      }
      return MEMO[row];
    }
    return helper(row);
  }

  // ANALYZE
  if (part === 1) {                                                                         // PART 1: FIND # OF ELIMINATED x VALUES IN GIVEN ROW y

    // find intervals of eliminated x values in given row y
    const ROW_TO_CHECK = extraParam;
    const ranges = getRangesOfEliminatedXValues(ROW_TO_CHECK);

    // NOTE: it turns out that ranges above will only have 1 range with our data. in other words, our data would have it such that all ranges of
    // eliminated x values for given row y from the various sensors will overlap. however, going forward, i will NOT make that assumption, and for
    // purposes of part 1 i will account for the possibility of gaps in between the ranges of eliminated x values for given row y.

    // find intervals of gaps
    const gaps = [];
    for (let i = 0; i < ranges.length - 1; ++i) {
      gaps.push([ ranges[i][1] + 1, ranges[i + 1][0] - 1 ]);
    }
    
    // look for beacons in given row y and include them in gaps
    const beaconsInRow = new Set();
    for (const sensor in SENSOR_DATA) {
      const [x, y] = SENSOR_DATA[sensor].beacon;
      if (y === ROW_TO_CHECK) beaconsInRow.add(x);
    }
    for (const beacon of beaconsInRow) gaps.push([beacon, beacon]);
    const gapsWithBeacons = mergeOverlappingRanges(gaps);

    // calculate number of eliminated x values
    const spreadOfEliminatedXValues = ranges.at(-1)[1] - ranges[0][0] + 1;
    const gapCount = gapsWithBeacons.reduce((count, [s, e]) => count += e - s + 1, 0);
    return spreadOfEliminatedXValues - gapCount;

  } else {                                                                                  // PART 2: FIND COORDS OF UNKNOWN DISTRESS BEACON

    // HELPER FUNCTION: GIVEN 4 CORNERS, RETURN WHETHER RECTANGULAR AREA IS FULLY COVERED A SENSOR (AND THUS DOES NOT NEED TO BE CHECKED)
    function areaCoveredBySensor(topLeftX, topLeftY, botRightX, botRightY) {
      const AREA_CORNERS = [
        [topLeftX, topLeftY],
        [topLeftX, botRightY],
        [botRightX, topLeftY],
        [botRightX, botRightY]
      ];
      for (const sensor in SENSOR_DATA) {
        const [sensorX, sensorY] = sensor.split(',').map(n => +n);
        if (AREA_CORNERS.every(corner => {
          const [cornerX, cornerY] = corner;
          return getManhattanDistance(cornerX, cornerY, sensorX, sensorY)
                  <= SENSOR_DATA[sensor].manhattanDistance;
        })) {
          if (SEE_AREA_BEING_SKIPPED) {
            console.log(`(SKIPPING REGION WITH AREA: ${
                        (botRightX - topLeftX + 1) * (topLeftY - botRightY + 1)})`);
          }
          return true;
        }
      }
      return false;
    }

    // HELPER FUNCTION: SEARCH A RECTANGULAR AREA BOUNDED BY GIVEN COORDINATES FOR THE COORDS REPRESENTING THE ANSWER TO PART 2. RETURNS null IF NO ANSWER
    const ALREADY_CHECKED_ROWS = new Set();
    function binarySearchArea(topLeftX, topLeftY, botRightX, botRightY) {

      const H = topLeftY - botRightY + 1;
      const W = botRightX - topLeftX + 1;
      if (H < 1 || W < 1) return null;                                                      // not analyzing real area

      // BASE CASE: search area has been narrowed down to 1 row
      if (H === 1) {

        // get eliminated x values for this row
        const y = topLeftY;
        if (ALREADY_CHECKED_ROWS.has(y)) return null;
        ALREADY_CHECKED_ROWS.add(y);
        const ranges = getRangesOfEliminatedXValues(y);

        // CHECK IF THIS ROW HAS A SINGLE VALUE OF x NOT ELIMINATED:

        // 1) the non-eliminated x is in the middle of the row somewhere
        if (ranges.length > 1) {
          
          if (ranges.length !== 2) {                                                        // sanity check to make sure only 1 gap of possible x values
            throw 'ERROR: TOO MANY GAPS BETWEEN ELIMINATED VALUES OF x';
          }
          const sizeOfGap = ranges[1][0] - ranges[0][1] - 1;
          if (sizeOfGap !== 1) {                                                            // sanity check to make sure only 1 value of x is not eliminated
            throw `ERROR: TOO MANY NON-ELIMINATED VALUES OF x: ${sizeOfGap}`;
          }

          if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);

          const x = ranges[0][1] + 1;                                                       // found x; y is given by index in for loop
          return x * TUNING_FREQUENCY_X_MULTIPLER + y;
        }

        // NOTE: THE BELOW ARE POSSIBILITIES THAT ARE HIGHLY IMPROBABLE AND DON'T ACTUALLY HAPPEN WITH THIS DATA

        // 2) the non-eliminated x is at the left edge of search area
        else if (ranges[0][0] > 0) {
          if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
          return y;                                                                         // x is 0
        }

        // 3) the non-eliminated x is at the right edge of search area
        else if (ranges[0][1] < LIMIT_OF_SEARCH_AREA) {
          if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
          return LIMIT_OF_SEARCH_AREA * TUNING_FREQUENCY_X_MULTIPLER + y;                   // x is LIMIT_OF_SEARCH_AREA
        }

        return null;
      }

      // RECURSIVE CASE: CHECK IF FULL REGION IS ALREADY ELIMINATED BY SENSOR. IF NOT, SPLIT INTO 4 SMALLER REGIONS AND RECURSE
      else {

        if (areaCoveredBySensor(topLeftX, topLeftY, botRightX, botRightY)) return null;     // OPTIMIZATION: check if region is already eliminated by any one sensor's data

        const midX = topLeftX + Math.floor((botRightX - topLeftX) / 2);
        const midY = botRightY + Math.floor((topLeftY - botRightY) / 2);

        const recurseTL = binarySearchArea(topLeftX, topLeftY, midX - 1, midY + 1);         // recurse top left (do not include midX, midY)
        if (recurseTL !== null) return recurseTL;

        const recurseBL = binarySearchArea(topLeftX, midY, midX - 1, botRightY);            // recurse bottom left (do not include midX)
        if (recurseBL !== null) return recurseBL;

        const recurseTR = binarySearchArea(midX, topLeftY, botRightX, midY + 1);            // recurse top right (do not include midY)
        if (recurseTR !== null) return recurseTR;
        
        const recurseBR = binarySearchArea(midX, midY, botRightX, botRightY);               // recurse bottom right
        if (recurseBR !== null) return recurseBR;
        return null;
      }
    }

    // INIT
    const LIMIT_OF_SEARCH_AREA = extraParam;
    const TUNING_FREQUENCY_X_MULTIPLER = 4000000;
    
    const TIME_AT_START = Date.now();
    if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

    // ANALYZE
    const res = binarySearchArea(0, LIMIT_OF_SEARCH_AREA, LIMIT_OF_SEARCH_AREA, 0);
    if (res !== null) return res;
    throw 'ERROR: DID NOT FIND LOCATION OF UNKNOWN DISTRESS BEACON';

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = analyzeSensorCoverage;
// const func = analyzeSensorCoverage2;
const func = analyzeSensorCoverage3;
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
`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 10,
  DEBUG: true,
};
expected = 26;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 2000000,
};
expected = 4961647;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: 20,
  DEBUG: true,
};
expected = 56000011;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 4000000,
};
expected = 12274327017867;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);