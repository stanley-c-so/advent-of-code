/*

--- Day 4: Repose Record ---

You've sneaked into another supply closet - this time, it's across from the prototype suit manufacturing lab. You need to sneak inside and fix the issues with the suit, but there's a guard stationed outside the lab, so this is as close as you can safely get.

As you search the closet for anything that might help, you discover that you're not the first person to want to sneak in. Covering the walls, someone has spent an hour starting every midnight for the past few months secretly observing this guard post! They've been writing down the ID of the one guard on duty that night - the Elves seem to have decided that one guard was enough for the overnight shift - as well as when they fall asleep or wake up while at their post (your puzzle input).

For example, consider the following records, which have already been organized into chronological order:

[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up

Timestamps are written using year-month-day hour:minute format. The guard falling asleep or waking up is always the one whose shift most recently started. Because all asleep/awake times are during the midnight hour (00:00 - 00:59), only the minute portion (00 - 59) is relevant for those events.

Visually, these records show that the guards are asleep at these times:

Date   ID   Minute
            000000000011111111112222222222333333333344444444445555555555
            012345678901234567890123456789012345678901234567890123456789
11-01  #10  .....####################.....#########################.....
11-02  #99  ........................................##########..........
11-03  #10  ........................#####...............................
11-04  #99  ....................................##########..............
11-05  #99  .............................................##########.....

The columns are Date, which shows the month-day portion of the relevant day; ID, which shows the guard on duty that day; and Minute, which shows the minutes during which the guard was asleep within the midnight hour. (The Minute column's header shows the minute's ten's digit in the first row and the one's digit in the second row.) Awake is shown as ., and asleep is shown as #.

Note that guards count as asleep on the minute they fall asleep, and they count as awake on the minute they wake up. For example, because Guard #10 wakes up at 00:25 on 1518-11-01, minute 25 is marked as awake.

If you can figure out the guard most likely to be asleep at a specific time, you might be able to trick that guard into working tonight so you can have the best chance of sneaking in. You have two strategies for choosing the best guard/minute combination.

Strategy 1: Find the guard that has the most minutes asleep. What minute does that guard spend asleep the most?

In the example above, Guard #10 spent the most minutes asleep, a total of 50 minutes (20+25+5), while Guard #99 only slept for a total of 30 minutes (10+10+10). Guard #10 was asleep most during minute 24 (on two days, whereas any other minute the guard was asleep was only seen on one day).

While this example listed the entries in chronological order, your entries are in the order you found them. You'll need to organize them before they can be analyzed.

What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)


--- Part Two ---

Strategy 2: Of all guards, which guard is most frequently asleep on the same minute?

In the example above, Guard #99 spent minute 45 asleep more than any other guard or minute - three times in total. (In all other cases, any guard spent any minute asleep at most twice.)

What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 99 * 45 = 4455.)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeSleepSchedule (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const [ BEGIN, WAKE, SLEEP ] = [ 'BEGIN', 'WAKE', 'SLEEP' ];

  // PARSE INPUT DATA
  const DATA = inputArr.map(entry => {
    const split = entry.split('')
                        .filter(c => !'[]'.includes(c))                                 // remove square brackets
                        .join('')
                        .split(' ');

    const [ year, month, day ] = split[0].split('-').map(n => +n);
    const [ hour, minute ] = split[1].split(':').map(n => +n);
    const event = split[2] === 'Guard'  ? BEGIN :
                  split[2] === 'falls'  ? SLEEP :
                  split[2] === 'wakes'  ? WAKE :
                                          null;                                         // split[2] should never be null
    
    if (event === null) throw `ERROR: UNRECOGNIZED EVENT WORD ${split[2]}`;             // sanity check

    const guard = event === BEGIN ? +split[3].slice(1) : null;

    return {
      year,
      month,
      day,
      hour,
      minute,
      guard,
      event,
    };
  });

  // PRE-PROCESS INPUT DATA - SORT IT IN TIMESTAMP ORDER
  DATA.sort((a, b) => a.year - b.year
                      || a.month - b.month
                      || a.day - b.day
                      || a.hour - b.hour
                      || a.minute - b.minute);

  // PRE-PROCESS INPUT DATA - FILL IN GUARD INFORMATION AFTER SORTING
  let currentGuard = null;
  for (const entry of DATA) {
    if (entry.guard === null) entry.guard = currentGuard;
    else currentGuard = entry.guard;
  }

  // DATA STRUCTURES
  const MINS_ASLEEP_BY_GUARD = {};
  const TOTAL_MINS_ASLEEP_BY_GUARD = {};

  // ANALYZE INPUT DATA TO GET SLEEP TIMES
  const currentSleepTime = { hour: null, minute: null };
  for (const entry of DATA) {

    if (entry.event === SLEEP) {                                                        // EVENT: GUARD FALLS ASLEEP
      currentGuard = entry.guard;                                                       // for sanity check
      currentSleepTime.hour = entry.hour;
      currentSleepTime.minute = entry.minute;
    }

    else if (entry.event === WAKE) {                                                    // EVENT: GUARD WAKES UP
      if (entry.guard !== currentGuard) {                                               // sanity check
        throw `ERROR: THIS ENTRY'S GUARD IS ${
          entry.guard} BUT CURRENT GUARD SHOULD BE ${currentGuard}`;
      }
      if (!(entry.guard in MINS_ASLEEP_BY_GUARD)) {
        MINS_ASLEEP_BY_GUARD[entry.guard] = {};
      }
      if (!(entry.guard in TOTAL_MINS_ASLEEP_BY_GUARD)) {
        TOTAL_MINS_ASLEEP_BY_GUARD[entry.guard] = 0;
      }

      let totalSleepTimeInMins = 0;
      for ( let min = currentSleepTime.minute;
            min !== entry.minute;                                                       // although not needed here, we
            min = (min + 1) % 60                                                        // support wrapping around to next hour
      ) {
        ++totalSleepTimeInMins;
        if (!(min in MINS_ASLEEP_BY_GUARD[entry.guard])) {
          MINS_ASLEEP_BY_GUARD[entry.guard][min] = 0;
        }
        ++MINS_ASLEEP_BY_GUARD[entry.guard][min];                                       // update minute data
      }
      TOTAL_MINS_ASLEEP_BY_GUARD[entry.guard] += totalSleepTimeInMins;                  // update total sleep time data
    }
  }

  // ANALYZE
  if (part === 1) {                                                                     // PART 1: TARGET GUARD WHO SLEPT
                                                                                        // THE MOST, AND PICK MINUTE HE
                                                                                        // WAS MOST OFTEN ASLEEP

    const guardWhoSleptMost = +Object.keys(TOTAL_MINS_ASLEEP_BY_GUARD)
                                .sort((a, b) => TOTAL_MINS_ASLEEP_BY_GUARD[b]
                                                  - TOTAL_MINS_ASLEEP_BY_GUARD[a])[0];
  
    const sleepDataByMinute = MINS_ASLEEP_BY_GUARD[guardWhoSleptMost];
    const minuteSleptMost = +Object.keys(sleepDataByMinute)
                                .sort((a, b) => sleepDataByMinute[b]
                                                  - sleepDataByMinute[a])[0];
    
    if (DISPLAY_EXTRA_INFO) {
      console.log('GUARD WHO SLEPT THE MOST:',
                  guardWhoSleptMost);
      console.log('TIME HE SPENT ASLEEP:',
                  TOTAL_MINS_ASLEEP_BY_GUARD[guardWhoSleptMost]);
      console.log('MINUTE DURING WHICH HE WAS ASLEEP MOST OFTEN:',
                  minuteSleptMost);
    }

    return guardWhoSleptMost * minuteSleptMost;

  } else {                                                                              // PART 2: TARGET GUARD WHO WAS
                                                                                        // MOST OFTEN ASLEEP ON THE SAME
                                                                                        // MINUTE

    let targetGuard = null;
    let targetMinute = null;
    let maxFreq = 0;

    for (const guard in MINS_ASLEEP_BY_GUARD) {
      for (const min in MINS_ASLEEP_BY_GUARD[guard]) {
        const freq = MINS_ASLEEP_BY_GUARD[guard][min];
        if (freq > maxFreq) {
          maxFreq = freq;
          targetGuard = guard;
          targetMinute = min;
        }
      }
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log('GUARD WHO WAS MOST OFTEN ASLEEP ON THE SAME MINUTE:',
                  targetGuard);
      console.log('MINUTE HE WAS MOST OFTEN ASLEEP:',
                  targetMinute);
      console.log('HOW OFTEN HE WAS ASLEEP DURING THIS MINUTE:',
                  MINS_ASLEEP_BY_GUARD[targetGuard][targetMinute]);
    }

    return targetGuard * targetMinute;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeSleepSchedule;
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
`[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 240;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 20859;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 4455;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 76576;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);