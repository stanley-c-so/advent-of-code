/*

--- Day 16: Proboscidea Volcanium ---

The sensors have led you to the origin of the distress signal: yet another handheld device, just like the one the Elves gave you. However, you don't see any Elves around; instead, the device is surrounded by elephants! They must have gotten lost in these tunnels, and one of the elephants apparently figured out how to turn on the distress signal.

The ground rumbles again, much stronger this time. What kind of cave is this, exactly? You scan the cave with your handheld device; it reports mostly igneous rock, some ash, pockets of pressurized gas, magma... this isn't just a cave, it's a volcano!

You need to get the elephants out of here, quickly. Your device estimates that you have 30 minutes before the volcano erupts, so you don't have time to go back out the way you came in.

You scan the cave for other options and discover a network of pipes and pressure-release valves. You aren't sure how such a system got into a volcano, but you don't have time to complain; your device produces a report (your puzzle input) of each valve's flow rate if it were opened (in pressure per minute) and the tunnels you could use to move between the valves.

There's even a valve in the room you and the elephants are currently standing in labeled AA. You estimate it will take you one minute to open a single valve and one minute to follow any tunnel from one valve to another. What is the most pressure you could release?

For example, suppose you had the following scan output:

Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II

All of the valves begin closed. You start at valve AA, but it must be damaged or jammed or something: its flow rate is 0, so there's no point in opening it. However, you could spend one minute moving to valve BB and another minute opening it; doing so would release pressure during the remaining 28 minutes at a flow rate of 13, a total eventual pressure release of 28 * 13 = 364. Then, you could spend your third minute moving to valve CC and your fourth minute opening it, providing an additional 26 minutes of eventual pressure release at a flow rate of 2, or 52 total pressure released by valve CC.

Making your way through the tunnels like this, you could probably open many or all of the valves by the time 30 minutes have elapsed. However, you need to release as much pressure as possible, so you'll need to be methodical. Instead, consider this approach:

== Minute 1 ==
No valves are open.
You move to valve DD.

== Minute 2 ==
No valves are open.
You open valve DD.

== Minute 3 ==
Valve DD is open, releasing 20 pressure.
You move to valve CC.

== Minute 4 ==
Valve DD is open, releasing 20 pressure.
You move to valve BB.

== Minute 5 ==
Valve DD is open, releasing 20 pressure.
You open valve BB.

== Minute 6 ==
Valves BB and DD are open, releasing 33 pressure.
You move to valve AA.

== Minute 7 ==
Valves BB and DD are open, releasing 33 pressure.
You move to valve II.

== Minute 8 ==
Valves BB and DD are open, releasing 33 pressure.
You move to valve JJ.

== Minute 9 ==
Valves BB and DD are open, releasing 33 pressure.
You open valve JJ.

== Minute 10 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve II.

== Minute 11 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve AA.

== Minute 12 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve DD.

== Minute 13 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve EE.

== Minute 14 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve FF.

== Minute 15 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve GG.

== Minute 16 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve HH.

== Minute 17 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You open valve HH.

== Minute 18 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve GG.

== Minute 19 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve FF.

== Minute 20 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve EE.

== Minute 21 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You open valve EE.

== Minute 22 ==
Valves BB, DD, EE, HH, and JJ are open, releasing 79 pressure.
You move to valve DD.

== Minute 23 ==
Valves BB, DD, EE, HH, and JJ are open, releasing 79 pressure.
You move to valve CC.

== Minute 24 ==
Valves BB, DD, EE, HH, and JJ are open, releasing 79 pressure.
You open valve CC.

== Minute 25 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 26 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 27 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 28 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 29 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 30 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

This approach lets you release the most pressure possible in 30 minutes with this valve layout, 1651.

Work out the steps to release the most pressure in 30 minutes. What is the most pressure you can release?


--- Part Two ---

You're worried that even with an optimal approach, the pressure released won't be enough. What if you got one of the elephants to help you?

It would take you 4 minutes to teach an elephant how to open the right valves in the right order, leaving you with only 26 minutes to actually execute your plan. Would having two of you working together be better, even if it means having less time? (Assume that you teach the elephant before opening any valves yourself, giving you both the same full 26 minutes.)

In the example above, you could teach the elephant to help you as follows:

== Minute 1 ==
No valves are open.
You move to valve II.
The elephant moves to valve DD.

== Minute 2 ==
No valves are open.
You move to valve JJ.
The elephant opens valve DD.

== Minute 3 ==
Valve DD is open, releasing 20 pressure.
You open valve JJ.
The elephant moves to valve EE.

== Minute 4 ==
Valves DD and JJ are open, releasing 41 pressure.
You move to valve II.
The elephant moves to valve FF.

== Minute 5 ==
Valves DD and JJ are open, releasing 41 pressure.
You move to valve AA.
The elephant moves to valve GG.

== Minute 6 ==
Valves DD and JJ are open, releasing 41 pressure.
You move to valve BB.
The elephant moves to valve HH.

== Minute 7 ==
Valves DD and JJ are open, releasing 41 pressure.
You open valve BB.
The elephant opens valve HH.

== Minute 8 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve CC.
The elephant moves to valve GG.

== Minute 9 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You open valve CC.
The elephant moves to valve FF.

== Minute 10 ==
Valves BB, CC, DD, HH, and JJ are open, releasing 78 pressure.
The elephant moves to valve EE.

== Minute 11 ==
Valves BB, CC, DD, HH, and JJ are open, releasing 78 pressure.
The elephant opens valve EE.

(At this point, all valves are open.)

== Minute 12 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

...

== Minute 20 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

...

== Minute 26 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

With the elephant helping, after 26 minutes, the best you could do would release a total of 1707 pressure.

With you and an elephant working together for 26 minutes, what is the most pressure you could release?

*/

const { MinHeap } = require('./classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;


// ========== SOLUTION 1: WARNING - I HAVE NOT VERIFIED IF THIS WORKS! IT CAN TAKE POSSIBLY 1.5 HOURS TO RUN! IN PART 2, KEEP SEPARATE
// 'TIMERS' FOR YOU AND THE ELEPHANT, TRACKING THE AMOUNT OF TIME THAT WILL BE REMAINING WHEN THE ACTOR GETS TO ITS NEXT DESTINATION.
// WHENEVER I RECURSE, I MOVE THE TIME DOWN TO THE HIGHER VALUE BETWEEN THE TWO. IF ONLY YOU OR THE ELEPHANT IS ACTIVE, I MOVE AND
// RECURSE ACCORDINGLY. IF BOTH ARE ACTIVE, I CONSIDER ALL POSSIBLE COMBINATIONS OF THE MOVES YOU CAN BOTH MAKE.
//
// THIS SOLUTION IS OBVIOUSLY GARBAGE BUT I AM LEAVING IT HERE FOR POSTERITY, ESPECIALLY IF IT WORKS THEORETICALLY.

function optimalGraphTraversal (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // NOTE: WE SIMPLIFY THE PROBLEM SPACE BY IMAGINING YOU ARE ONLY REALLY TRAVELING BETWEEN VALVES WITH POSITIVE FLOW RATE (AND 'AA').
  // THEREFORE, YOU CAN 'MOVE DIRECTLY' FROM ONE VALVE TO ANOTHER BY ABSTRACTING AWAY INTERMEDIATE NODES, AND ALSO KNOW FOR SURE THAT THE
  // REASON YOU ARE MOVING TO THAT VALVE IS WITH THE EXPRESS INTENT OF TURNING IT ON (AS OPPOSED TO LEAVING IT TO SAVE 1 MINUTE).
  
  // DATA PARSING
  const VALVE_DATA = {};
  for (const line of inputArr) {
    const [LS, RS] = line.split(';');
    const [VALVE, FLOW_RATE] = LS.split(' has flow rate=');
    const valve = VALVE.split('Valve ').at(-1);
    const flowRate = +FLOW_RATE;
    const NEIGHBORS = RS.split('to ').at(-1);
    const neighbors = NEIGHBORS.slice( NEIGHBORS.slice(0, 6) === 'valves' ? 7 : 6 ).split(', ');
    VALVE_DATA[valve] = { flowRate, neighbors };
  }
  
  // PRE-PROCESSING WITH DIJKSTRA
  const VALVES_WITH_FLOW = Object.keys(VALVE_DATA).filter(loc => VALVE_DATA[loc].flowRate > 0);
  const VALVES_WITH_FLOW_PLUS_START = [ 'AA', ...VALVES_WITH_FLOW ];
  
  function dijkstra(A, B) {
    const visited = new Set();
    const COST = {};
    for (const loc in VALVE_DATA) COST[loc] = loc === A ? 0 : Infinity;
    const PQ = new MinHeap();
    PQ.insert(A, 0);
    while (PQ.queue.length) {
      const popped = PQ.popMin();
      const loc = popped.value;
      const cost = popped.priority;
      if (visited.has(loc)) continue;
      for (const neighbor of VALVE_DATA[loc].neighbors) {
        const tentativeCost = cost + 1;
        if (tentativeCost < COST[neighbor]) {
          COST[neighbor] = tentativeCost;
          PQ.insert(neighbor, tentativeCost);
        }
      }
    }
    return COST[B];
  }

  const DISTANCE_BETWEEN_KEY_NODES = {};
  for (let i = 0; i < VALVES_WITH_FLOW_PLUS_START.length - 1; ++i) {
    for (let j = i + 1; j < VALVES_WITH_FLOW_PLUS_START.length; ++j) {
      const A = VALVES_WITH_FLOW_PLUS_START[i];
      const B = VALVES_WITH_FLOW_PLUS_START[j];
      const distance = dijkstra(A, B);
      if (!(A in DISTANCE_BETWEEN_KEY_NODES)) DISTANCE_BETWEEN_KEY_NODES[A] = {};
      DISTANCE_BETWEEN_KEY_NODES[A][B] = distance;
      if (!(B in DISTANCE_BETWEEN_KEY_NODES)) DISTANCE_BETWEEN_KEY_NODES[B] = {};
      DISTANCE_BETWEEN_KEY_NODES[B][A] = distance;
    }
  }

  // HELPER FUNCTION: GIVEN A LIST OF VALVES WITH POSITIVE FLOW RATE, AND A TIME LIMIT, RETURN MAX ACHIEVABLE PRESSURE RELEASE (YOU MAY NOT VISIT ALL VALVES).
  function ANALYZE(VALVES_WITH_FLOW, TIME_LIMIT) {

    // init
    let pressureReleased = 0;
    let maxPressureReleased = 0;
    let path = [];
    const visited = new Set();

    // backtracking function
    function go(loc, time) {
      if (time < 2) return;                                                                 // if time is less than 2, there is not enough time to release more pressure
      visited.add(loc);

      const OPEN_THE_VALVE = time > 1 && loc !== 'AA';                                      // 'AA' has 0 flow rate; if time <= 1, there is no reason to open valve
      const flowRate = VALVE_DATA[loc].flowRate;

      if (time > 1) {                                                                       // RECURSIVE CASE: potentially visit neighbors if there is enough time
        if (OPEN_THE_VALVE) pressureReleased += flowRate * (time - 1);                      // if we open the valve, increase total pressure released

        const VIABLE_NEIGHBORS = VALVES_WITH_FLOW.filter(valve => !visited.has(valve));
        for (const neighbor of VIABLE_NEIGHBORS) {
          const travelTime = DISTANCE_BETWEEN_KEY_NODES[loc][neighbor];
          go(neighbor, time - travelTime - (OPEN_THE_VALVE ? 1 : 0));                       // (ternary needed as there is no valve to be opened at 'AA')
        }
      }
      
      // update results
      if (pressureReleased > maxPressureReleased) {
        maxPressureReleased = pressureReleased;
        path = [...visited];
      }

      // backtrack: undo changes
      if (OPEN_THE_VALVE) pressureReleased -= flowRate * (time - 1);
      visited.delete(loc);
    }

    go('AA', TIME_LIMIT);                                                                   // kickstart backtracking at 'AA'
    return { maxPressureReleased, path };
  }

  const TIME_START = Date.now();

  // ANALYZE
  if (part === 1) {

    const { maxPressureReleased, path } = ANALYZE(VALVES_WITH_FLOW, 30)
    if (DISPLAY_EXTRA_INFO) console.log(`(PATH: ${path.join(', ')})`);
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`)
    return maxPressureReleased;

  } else {

    // INIT
    let maxPressureReleased = 0;
    let pressureReleased = 0;  
    const opened = new Set();

    const MEMO = {};

    function go(locA, locB, time, timeA, timeB, visitedA, visitedB, doneA, doneB) {

      const SERIAL = [ locA, locB, time, timeA, timeB, [...visitedA].join(','), [...visitedB].join(','), doneA, doneB ].join('|');
      if (SERIAL in MEMO) return MEMO[SERIAL];

      if (timeA < 0 || timeB < 0) {
        MEMO[SERIAL] = -Infinity;
        return MEMO[SERIAL];
      }

      const A_IS_READY = time === timeA;
      const B_IS_READY = time === timeB;

      if (A_IS_READY) {
        if (!doneA && locA !== 'AA' && (visitedA.has(locA) || visitedB.has(locA))) {
          MEMO[SERIAL] = -Infinity;
          return MEMO[SERIAL];
        }
        visitedA.add(locA);
      }
      if (B_IS_READY) {
        if (!doneB && locB !== 'AA' && (visitedA.has(locB) || visitedB.has(locB))) {
          MEMO[SERIAL] = -Infinity;
          return MEMO[SERIAL];
        }
        visitedB.add(locB);
      }

      const flowRateA = VALVE_DATA[locA].flowRate;
      const flowRateB = VALVE_DATA[locB].flowRate;

      const openA = A_IS_READY && !opened.has(locA) && time > 1 && flowRateA > 0;
      const openB = B_IS_READY && !opened.has(locB) && time > 1 && flowRateB > 0;

      // BASE CASE
      if (time === 0 || opened.size === VALVES_WITH_FLOW.length || doneA && doneB) {
        if (pressureReleased > maxPressureReleased) {
          console.log(
            'NEW RECORD:', pressureReleased,
            `- DISCOVERED AFTER ${(Date.now() - TIME_START)/1000} SECS`,
          )
        }
        maxPressureReleased = Math.max(maxPressureReleased, pressureReleased);
        MEMO[SERIAL] = maxPressureReleased;
        return MEMO[SERIAL];
      }

      if (A_IS_READY && B_IS_READY) {

        if (openA) {
          opened.add(locA);
          pressureReleased += flowRateA * (time - 1);
        }
        if (openB) {
          opened.add(locB);
          pressureReleased += flowRateB * (time - 1);
        }

        const VIABLE_NEIGHBORS_A = VALVES_WITH_FLOW.filter(valve => !visitedA.has(valve));
        const VIABLE_NEIGHBORS_B = VALVES_WITH_FLOW.filter(valve => !visitedB.has(valve));

        if (!VIABLE_NEIGHBORS_A.length && !VIABLE_NEIGHBORS_B.length) {

          go( locA,
              locB,
              0,
              0,
              0,
              openA ? new Set([locA]) : visitedA,
              openB ? new Set([locB]) : visitedB,
              true,
              true);

        }
        else if (!VIABLE_NEIGHBORS_A.length) {

          for (const neighborB of VIABLE_NEIGHBORS_B) {
            if (neighborB === locB) continue;
            const travelTimeB = DISTANCE_BETWEEN_KEY_NODES[locB][neighborB];
            timeB -= travelTimeB + (openB ? 1 : 0);
            go( locA,
                neighborB,
                timeB,
                0,
                timeB,
                openA ? new Set([locA]) : visitedA,
                openB ? new Set([locB]) : visitedB,
                true,
                doneB);
            timeB += travelTimeB + (openB ? 1 : 0);
          }

        }
        else if (!VIABLE_NEIGHBORS_B.length) {

          for (const neighborA of VIABLE_NEIGHBORS_A) {
            if (neighborA === locA) continue;
            const travelTimeA = DISTANCE_BETWEEN_KEY_NODES[locA][neighborA];
            timeA -= travelTimeA + (openA ? 1 : 0);
            go( neighborA,
                locB,
                timeA,
                timeA,
                0,
                openA ? new Set([locA]) : visitedA,
                openB ? new Set([locB]) : visitedB,
                doneA,
                true);
            timeA += travelTimeA + (openA ? 1 : 0);
          }

        }
        else {

          for (const neighborA of VIABLE_NEIGHBORS_A) {
            if (neighborA === locA) continue;

            if (!VIABLE_NEIGHBORS_B.length) {
              go( neighborA,
                  locB,
                  timeA,
                  timeA,
                  0,
                  openA ? new Set([locA]) : visitedA,
                  openB ? new Set([locB]) : visitedB,
                  doneA,
                  true);
            } else {
              for (const neighborB of VIABLE_NEIGHBORS_B) {
                if (neighborB === locB || neighborB === neighborA) continue;

                const travelTimeA = DISTANCE_BETWEEN_KEY_NODES[locA][neighborA];
                const travelTimeB = DISTANCE_BETWEEN_KEY_NODES[locB][neighborB];

                timeA -= travelTimeA + (openA ? 1 : 0);
                timeB -= travelTimeB + (openB ? 1 : 0);

                go( neighborA,
                    neighborB,
                    Math.max(timeA, timeB),
                    timeA,
                    timeB,
                    openA ? new Set([locA]) : visitedA,
                    openB ? new Set([locB]) : visitedB,
                    doneA,
                    doneB);

                timeA += travelTimeA + (openA ? 1 : 0);
                timeB += travelTimeB + (openB ? 1 : 0);
              }
            }
          }

        }

        if (openA) {
          opened.delete(locA);
          pressureReleased -= flowRateA * (time - 1);
        }
        if (openB) {
          opened.delete(locB);
          pressureReleased -= flowRateB * (time - 1);
        }
      }
      else if (A_IS_READY) {

        if (openA) {
          opened.add(locA);
          pressureReleased += flowRateA * (time - 1);
        }

        const VIABLE_NEIGHBORS_A = VALVES_WITH_FLOW.filter(valve => !visitedA.has(valve));
        if (!VIABLE_NEIGHBORS_A.length) {
          go( locA,
              locB,
              timeB,
              0,
              timeB,
              visitedA,
              visitedB,
              true,
              doneB);
        } else {
          for (const neighborA of VIABLE_NEIGHBORS_A) {
            if (neighborA === locA) continue;
            const travelTimeA = DISTANCE_BETWEEN_KEY_NODES[locA][neighborA];
            timeA -= travelTimeA + (openA ? 1 : 0);
            go( neighborA,
                locB,
                Math.max(timeA, timeB),
                timeA,
                timeB,
                openA ? new Set([locA]) : visitedA,
                visitedB,
                doneA,
                doneB);
            timeA += travelTimeA + (openA ? 1 : 0);
          }
        }

        if (openA) {
          opened.delete(locA);
          pressureReleased -= flowRateA * (time - 1);
        }
      }
      else if (B_IS_READY) {

        if (openB) {
          opened.add(locB);
          pressureReleased += flowRateB * (time - 1);
        }

        const VIABLE_NEIGHBORS_B = VALVES_WITH_FLOW.filter(valve => !visitedB.has(valve));
        if (!VIABLE_NEIGHBORS_B.length) {
          go( locA,
              locB,
              timeA,
              timeA,
              0,
              visitedA,
              visitedB,
              doneA,
              true);
        } else {
          for (const neighborB of VIABLE_NEIGHBORS_B) {
            if (neighborB === locB) continue;
            const travelTimeB = DISTANCE_BETWEEN_KEY_NODES[locB][neighborB];
            timeB -= travelTimeB + (openB ? 1 : 0);
            go( locA,
                neighborB,
                Math.max(timeA, timeB),
                timeA,
                timeB,
                visitedA,
                openB ? new Set([locB]) : visitedB,
                doneA,
                doneB);
            timeB += travelTimeB + (openB ? 1 : 0);
          }
        }

        if (openB) {
          opened.delete(locB);
          pressureReleased -= flowRateB * (time - 1);
        }
      }
      else throw 'ERROR: EITHER A OR B SHOULD BE READY';

      if (A_IS_READY) visitedA.delete(locA);
      if (B_IS_READY) visitedB.delete(locB);
    }

    go('AA', 'AA', 26, 26, 26, new Set(), new Set(), false, false);
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`)
    return maxPressureReleased;

  }
}


// ========== SOLUTION 2: FOR PART 2, THERE SHOULD NEVER BE ANY CROSSOVER IN THE LOCATIONS THAT YOU MAY POTENTIALLY VISIT, AND THE LOCATIONS
// THAT THE ELEPHANT MAY POTENTIALLY VISIT. THEREFORE, WE CAN DETERMINE ALL THE POSSIBLE WAYS TO CREATE TWO DISJOINT SETS OF CANDIDATE LOCATIONS
// FOR THE TWO ACTORS (2^N, WHERE N IS THE NUMBER OF VALVES WITH NON-ZERO FLOW). FOR EACH COMBINATION, WE RUN THE CANDIDATE LIST FOR EACH ACTOR
// THROUGH THE ANALYZE FUNCTION, AND ADD THE RESULTS.

function optimalGraphTraversal2 (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // NOTE: WE SIMPLIFY THE PROBLEM SPACE BY IMAGINING YOU ARE ONLY REALLY TRAVELING BETWEEN VALVES WITH POSITIVE FLOW RATE (AND 'AA').
  // THEREFORE, YOU CAN 'MOVE DIRECTLY' FROM ONE VALVE TO ANOTHER BY ABSTRACTING AWAY INTERMEDIATE NODES, AND ALSO KNOW FOR SURE THAT THE
  // REASON YOU ARE MOVING TO THAT VALVE IS WITH THE EXPRESS INTENT OF TURNING IT ON (AS OPPOSED TO LEAVING IT TO SAVE 1 MINUTE).
  
  // DATA PARSING
  const VALVE_DATA = {};
  for (const line of inputArr) {
    const [LS, RS] = line.split(';');
    const [VALVE, FLOW_RATE] = LS.split(' has flow rate=');
    const valve = VALVE.split('Valve ').at(-1);
    const flowRate = +FLOW_RATE;
    const NEIGHBORS = RS.split('to ').at(-1);
    const neighbors = NEIGHBORS.slice( NEIGHBORS.slice(0, 6) === 'valves' ? 7 : 6 ).split(', ');
    VALVE_DATA[valve] = { flowRate, neighbors };
  }
  
  // PRE-PROCESSING WITH DIJKSTRA
  const VALVES_WITH_FLOW = Object.keys(VALVE_DATA).filter(loc => VALVE_DATA[loc].flowRate > 0);
  const VALVES_WITH_FLOW_PLUS_START = [ 'AA', ...VALVES_WITH_FLOW ];
  
  function dijkstra(A, B) {
    const visited = new Set();
    const COST = {};
    for (const loc in VALVE_DATA) COST[loc] = loc === A ? 0 : Infinity;
    const PQ = new MinHeap();
    PQ.insert(A, 0);
    while (PQ.queue.length) {
      const popped = PQ.popMin();
      const loc = popped.value;
      const cost = popped.priority;
      if (visited.has(loc)) continue;
      for (const neighbor of VALVE_DATA[loc].neighbors) {
        const tentativeCost = cost + 1;
        if (tentativeCost < COST[neighbor]) {
          COST[neighbor] = tentativeCost;
          PQ.insert(neighbor, tentativeCost);
        }
      }
    }
    return COST[B];
  }

  const DISTANCE_BETWEEN_KEY_NODES = {};
  for (let i = 0; i < VALVES_WITH_FLOW_PLUS_START.length - 1; ++i) {
    for (let j = i + 1; j < VALVES_WITH_FLOW_PLUS_START.length; ++j) {
      const A = VALVES_WITH_FLOW_PLUS_START[i];
      const B = VALVES_WITH_FLOW_PLUS_START[j];
      const distance = dijkstra(A, B);
      if (!(A in DISTANCE_BETWEEN_KEY_NODES)) DISTANCE_BETWEEN_KEY_NODES[A] = {};
      DISTANCE_BETWEEN_KEY_NODES[A][B] = distance;
      if (!(B in DISTANCE_BETWEEN_KEY_NODES)) DISTANCE_BETWEEN_KEY_NODES[B] = {};
      DISTANCE_BETWEEN_KEY_NODES[B][A] = distance;
    }
  }

  // HELPER FUNCTION: GIVEN A LIST OF VALVES WITH POSITIVE FLOW RATE, AND A TIME LIMIT, RETURN MAX ACHIEVABLE PRESSURE RELEASE (YOU MAY NOT VISIT ALL VALVES).
  function ANALYZE(VALVES_WITH_FLOW, TIME_LIMIT) {

    // init
    let pressureReleased = 0;
    let maxPressureReleased = 0;
    let path = [];
    const visited = new Set();

    // backtracking function
    function go(loc, time) {
      if (time < 2) return;                                                                 // if time is less than 2, there is not enough time to release more pressure
      visited.add(loc);

      const OPEN_THE_VALVE = time > 1 && loc !== 'AA';                                      // 'AA' has 0 flow rate; if time <= 1, there is no reason to open valve
      const flowRate = VALVE_DATA[loc].flowRate;

      if (time > 1) {                                                                       // RECURSIVE CASE: potentially visit neighbors if there is enough time
        if (OPEN_THE_VALVE) pressureReleased += flowRate * (time - 1);                      // if we open the valve, increase total pressure released

        const VIABLE_NEIGHBORS = VALVES_WITH_FLOW.filter(valve => !visited.has(valve));
        for (const neighbor of VIABLE_NEIGHBORS) {
          const travelTime = DISTANCE_BETWEEN_KEY_NODES[loc][neighbor];
          go(neighbor, time - travelTime - (OPEN_THE_VALVE ? 1 : 0));                       // (ternary needed as there is no valve to be opened at 'AA')
        }
      }
      
      // update results
      if (pressureReleased > maxPressureReleased) {
        maxPressureReleased = pressureReleased;
        path = [...visited];
      }

      // backtrack: undo changes
      if (OPEN_THE_VALVE) pressureReleased -= flowRate * (time - 1);
      visited.delete(loc);
    }

    go('AA', TIME_LIMIT);                                                                   // kickstart backtracking at 'AA'
    return { maxPressureReleased, path };
  }

  const TIME_START = Date.now();

  // ANALYZE
  if (part === 1) {

    const { maxPressureReleased, path } = ANALYZE(VALVES_WITH_FLOW, 30)
    if (DISPLAY_EXTRA_INFO) console.log(`(PATH: ${path.join(', ')})`);
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`)
    return maxPressureReleased;

  } else {

    // INIT
    const YOU = [];
    const ELEPHANT = [];
    let combinationCount = 0;
    let maxPressureReleased = 0;
    let yourPath;
    let elephantPath;

    // BACKTRACKING FUNCTION TO FIND EVERY COMBINATION OF DIVIDING UP CANDIDATE NODES BETWEEN YOU AND ELEPHANT
    function buildCombinationsAndAnalyze(i) {

      // BASE CASE: COMBINATION HAS BEEN BUILT, NOW ANALYZE YOU AND ELEPHANT ACCORDINGLY AND COMBINE RESULTS
      if (i === VALVES_WITH_FLOW.length) {
        ++combinationCount;
        const RESULT_YOU = ANALYZE(YOU, 26);
        const RESULT_ELEPHANT = ANALYZE(ELEPHANT, 26);
        const RESULT = RESULT_YOU.maxPressureReleased + RESULT_ELEPHANT.maxPressureReleased;

        if (RESULT > maxPressureReleased) {
          if (!DEBUG) console.log(
            `(COMBINATION ${combinationCount}`
            + ' | '
            + `NEW RECORD: ${RESULT} - DISCOVERED AFTER ${(Date.now() - TIME_START)/1000} SECS)`
          )
          maxPressureReleased = RESULT;
          yourPath = RESULT_YOU.path;
          elephantPath = RESULT_ELEPHANT.path;
        }
      }

      // RECURSIVE CASE
      else {
        YOU.push(VALVES_WITH_FLOW[i])
        buildCombinationsAndAnalyze(i + 1);
        ELEPHANT.push(YOU.pop());
        buildCombinationsAndAnalyze(i + 1);
        ELEPHANT.pop();
      }
    }

    // ANALYZE
    buildCombinationsAndAnalyze(0);

    if (combinationCount !== 2**(VALVES_WITH_FLOW.length)) {
      throw 'ERROR: INCORRECT NUMBER OF COMBINTATIONS ANALYZED';
    }
    if (DISPLAY_EXTRA_INFO) console.log(`(ANALYZED ${combinationCount} COMBINATIONS)`);
    if (DISPLAY_EXTRA_INFO) console.log('YOUR PATH:', yourPath.join(', '));
    if (DISPLAY_EXTRA_INFO) console.log('ELEPHANT PATH:', elephantPath.join(', '));

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`);
    return maxPressureReleased;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = optimalGraphTraversal;
const func = optimalGraphTraversal2;
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
`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1651;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1828;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1707;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2292;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);