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

// ===== BORROWED THIS MinHeap CODE FROM ONE OF MY OTHER REPOS

class MinHeap {

  constructor () {
    this.queue = [];                                            // elements will be in the form of {value: someValue, priority: somePriority}
  }
  
  // ===== UTILITY METHODS =====

  _swap (idxA, idxB) {
    [this.queue[idxA], this.queue[idxB]] = [this.queue[idxB], this.queue[idxA]];
  }

  _parentIdx (childIdx) {
    return Math.floor((childIdx - 1) / 2);
  }

  _childrenIndices (parentIdx) {
    return [2 * parentIdx + 1, 2 * parentIdx + 2];
  }

  // ===== PQ METHODS =====

  peek () {
    return this.queue[0];
  }

  insert (value, priority = value) {

    // FIRST, ADD THE NEW ELEMENT TO THE END OF QUEUE
    this.queue.push({value, priority});

    // NEXT, 'HEAPIFY UP' ('bubble up' the first element in queue until heap is proper)
    let currentNodeIdx = this.queue.length - 1;
    while (currentNodeIdx !== 0 && this.queue[currentNodeIdx].priority < this.queue[this._parentIdx(currentNodeIdx)].priority) {
      this._swap(currentNodeIdx, this._parentIdx(currentNodeIdx));
      currentNodeIdx = this._parentIdx(currentNodeIdx);
    }
    
    return this;                                                // for chaining
  }

  popMin () {

    // EDGE CASES: 0- OR 1-LENGTH HEAP
    if (!this.queue.length) return undefined;
    if (this.queue.length === 1) return this.queue.pop();       // if only one node, just pop it off the queue and return
    
    // FIRST, SAVE THE TOP ELEMENT AND THEN REPLACE IT WITH LAST ELEMENT (AFTER POPPING IT OFF)
    const poppedMin = this.peek();                              // use .peek() to save the top element inside poppedMin, to be returned later
    this.queue[0] = this.queue.pop();                           // replace top of heap with node popped off from end of queue

    // NEXT, 'HEAPIFY DOWN' ('push down' the first element in queue until heap is proper)
    let currentNodeIdx = 0;
    let [left, right] = this._childrenIndices(currentNodeIdx);
    while (left < this.queue.length) {                          // while left child exists...
      let smallestChildIdx = right < this.queue.length && this.queue[right].priority < this.queue[left].priority
        ? right                                                 // ...smallestChildIdx is right if right child exists AND takes priority over left child...
        : left;                                                 // ...otherwise, smallestChildIdx is left
      if (this.queue[smallestChildIdx].priority < this.queue[currentNodeIdx].priority) {    // see if smallest child is smaller than parent
        this._swap(currentNodeIdx, smallestChildIdx);           // swap parent and smaller child
        currentNodeIdx = smallestChildIdx;                      // update currentNodeIdx
        [left, right] = this._childrenIndices(currentNodeIdx);  // update left and right
      } else {
        break;                                                  // if smaller child is not smaller than parent, break out of heapify down
      }
    }

    return poppedMin;                                           // finally, return the stored top element from the beginning
  }
}


function optimalGraphTraversal (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

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
  // if (!DEBUG) console.log(DISTANCE_BETWEEN_KEY_NODES)

  // console.log(VALVES_WITH_FLOW)
  // console.log(VALVES_WITH_FLOW.length)
  // return

  const TIME_START = Date.now();

  function getPressure(sequence, TIME_LIMIT) {
    let start = 'AA'
    let time = TIME_LIMIT
    let pressure = 0;

    for (let i = 0; i < sequence.length; ++i) {
      const destination = sequence[i];
      time -= DISTANCE_BETWEEN_KEY_NODES[start][destination];
      if (time <= 1) return pressure;
      time -= 1;
      pressure += time * VALVE_DATA[destination].flowRate;
      start = destination;
    }
    console.log('PRESSURE FOR SEQUENCE', sequence, ':', pressure)
    return pressure;
  }
  // if (DEBUG) {
  //   const A = getPressure('JJ, BB, CC'.split(', '), 26)
  //   const B = getPressure('DD, HH, EE'.split(', '), 26)
  //   console.log(A + B)
  //   return;
  // } else {
  //   const A = getPressure('UI, AT, ES, TR, XN'.split(', '), 26)
  //   const B = getPressure('VK, GQ, YL, AZ, EY, JT'.split(', '), 26)
  //   console.log(A + B)
  //   return;
  // }

  function ANALYZE(VALVES_WITH_FLOW, TIME_LIMIT) {
    let maxRelease = 0;
    let pressureReleased = 0;
    const opened = new Set();
    let BEST_PATH = [];

    // const visited = new Set();
    // function go(loc, time) {
    function go(loc, time, visited) {

      if (time < 0 || visited.has(loc)) return;
      visited.add(loc);
      
      // BASE CASE
      if (time === 0 || opened.size === VALVES_WITH_FLOW.length) {
        if (pressureReleased > maxRelease) {
          maxRelease = pressureReleased;
          BEST_PATH = [...opened];
        }
        return;
      }

      // if (time < 0 || visited.has(loc)) return;
      // visited.add(loc);

      const flowRate = VALVE_DATA[loc].flowRate;

      if (!opened.has(loc) && time > 1 && flowRate > 0) {
        opened.add(loc);
        pressureReleased += flowRate * (time - 1);
        const VIABLE_NEIGHBORS = VALVES_WITH_FLOW.filter(valve => !visited.has(valve));
        if (!VIABLE_NEIGHBORS.length) {
          go(loc, 0, new Set());
        } else {
          for (const neighbor of VIABLE_NEIGHBORS) {
            if (neighbor !== loc) {
              const travelTime = DISTANCE_BETWEEN_KEY_NODES[loc][neighbor];
              go(neighbor, time - travelTime - 1, new Set([loc]));
              // go(neighbor, time - travelTime - 1, visited);
            }
          }
        }
        opened.delete(loc);
        pressureReleased -= flowRate * (time - 1);
      }
      else {
        for (const neighbor of VALVES_WITH_FLOW) {
          if (neighbor !== loc) {
            const travelTime = DISTANCE_BETWEEN_KEY_NODES[loc][neighbor];
            go(neighbor, time - travelTime, visited);
          }
        }
      }

      visited.delete(loc);
    }

    go('AA', TIME_LIMIT, new Set());
    return { res: maxRelease, path: BEST_PATH };
  }

  if (part === 1) {

    const { res, path } = ANALYZE(VALVES_WITH_FLOW, 30)
    console.log('PATH:', path.join(', '));
    console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`)
    return res;

  } else {

    // // ===== HACK - doesn't work if one actor can hit all valves alone
    // const RES_YOU = ANALYZE(VALVES_WITH_FLOW, 26)
    // const res1 = RES_YOU.res
    // const path1 = RES_YOU.path
    // console.log('YOUR PATH:', path1.join(', '));
    // const pathSet = new Set(path1)
    // // console.log('VALVES WITH FLOW (BEFORE):', VALVES_WITH_FLOW)
    // const NEW_VALVES_WITH_FLOW = VALVES_WITH_FLOW.filter(valve => !pathSet.has(valve))
    // // console.log('VALVES WITH FLOW (AFTER):', NEW_VALVES_WITH_FLOW)
    // const RES_ELEPHANT = ANALYZE(NEW_VALVES_WITH_FLOW, 26)
    // const res2 = RES_ELEPHANT.res
    // const path2 = RES_ELEPHANT.path
    // console.log('ELEPHANT PATH:', path2.join(', '));
    // return res1 + res2;

    // // ===== ATTEMPT 2 
    const YOU = [];
    const ELEPHANT = [];

    let permutationCount = 0;

    let BEST = 0;

    const SANITY_CHECK_SET = new Set();

    function backtrack(i) {

      // BASE CASE
      if (i === VALVES_WITH_FLOW.length) {
        ++permutationCount;

        // const SANITY_CHECK_SERIAL = YOU.join(',') + '|' + ELEPHANT.join(',');
        // if (SANITY_CHECK_SET.has(SANITY_CHECK_SERIAL)) throw 'ERROR: YOU HAVE ANALYZED THIS SEQUENCE BEFORE';
        // SANITY_CHECK_SET.add(SANITY_CHECK_SERIAL);

        const RESULT_YOU = ANALYZE(YOU, 26);
        const RESULT_ELEPHANT = ANALYZE(ELEPHANT, 26);

        const RESULT = RESULT_YOU.res + RESULT_ELEPHANT.res;

        // if (RESULT >= BEST) {
        if (RESULT > BEST) {
          console.log(
            `===== ON PERMUTATION ${permutationCount} | ${RESULT > BEST ? '**NEW**' : 'MATCHED'} RECORD: ${RESULT} - DISCOVERED AFTER ${(Date.now() - TIME_START)/1000} SECS`,
          )
          console.log('    YOUR PATH:', RESULT_YOU.path.join(', '))
          console.log('    ELEPHANT PATH:', RESULT_ELEPHANT.path.join(', '))
          BEST = RESULT;
        }
        return;
      }

      YOU.push(VALVES_WITH_FLOW[i])
      backtrack(i + 1);
      ELEPHANT.push(YOU.pop());
      backtrack(i + 1);
      ELEPHANT.pop();

    }
    backtrack(0);
    console.log('+++++ TOTAL PERMUTATIONS:', permutationCount)
    console.log('+++++ BEST:', BEST)
    console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`)
    return BEST




  // // ===== ATTEMPT 1

  //   let maxRelease = 0;
  //   let pressureReleased = 0;  
  //   const opened = new Set();

  //   // const PATH_A = [];
  //   // const PATH_B = [];

  //   const MEMO = {};

  //   function go(locA, locB, time, timeA, timeB, visitedA, visitedB, doneA, doneB) {

  //     const SERIAL = [ locA, locB, time, timeA, timeB, [...visitedA].join(','), [...visitedB].join(','), doneA, doneB ].join('|');
  //     if (SERIAL in MEMO) return MEMO[SERIAL];

  //     if (timeA < 0 || timeB < 0) {
  //       MEMO[SERIAL] = -Infinity;
  //       return MEMO[SERIAL];
  //       // return;
  //     }

  //     const A_IS_READY = time === timeA;
  //     const B_IS_READY = time === timeB;

  //     if (A_IS_READY) {
  //       if (!doneA && locA !== 'AA' && (visitedA.has(locA) || visitedB.has(locA))) {
  //         MEMO[SERIAL] = -Infinity;
  //         return MEMO[SERIAL];
  //         // return;
  //       }
  //       visitedA.add(locA);
  //       // PATH_A.push(locA);
  //     }
  //     if (B_IS_READY) {
  //       if (!doneB && locB !== 'AA' && (visitedA.has(locB) || visitedB.has(locB))) {
  //         MEMO[SERIAL] = -Infinity;
  //         return MEMO[SERIAL];
  //         // return;
  //       }
  //       visitedB.add(locB);
  //       // PATH_B.push(locB);
  //     }

  //     const flowRateA = VALVE_DATA[locA].flowRate;
  //     const flowRateB = VALVE_DATA[locB].flowRate;

  //     const openA = A_IS_READY && !opened.has(locA) && time > 1 && flowRateA > 0;
  //     const openB = B_IS_READY && !opened.has(locB) && time > 1 && flowRateB > 0;

  //     // BASE CASE
  //     if (time === 0 || opened.size === VALVES_WITH_FLOW.length || doneA && doneB) {
  //       if (pressureReleased > maxRelease) {
  //         console.log(
  //           'NEW RECORD:', pressureReleased,
  //           // 'PATH A:', PATH_A.join(', '),
  //           // 'PATH B:', PATH_B.join(', ')
  //           `- DISCOVERED AFTER ${(Date.now() - TIME_START)/1000} SECS`,
  //         )
  //       }
  //       maxRelease = Math.max(maxRelease, pressureReleased);
  //       // console.log('ENDED WITH PRESSURE RELEASED:', pressureReleased, '| BEST SO FAR:', maxRelease)
  //       // return;
  //       MEMO[SERIAL] = maxRelease;
  //       return MEMO[SERIAL];
  //     }

  //     if (A_IS_READY && B_IS_READY) {

  //       if (openA) {
  //         opened.add(locA);
  //         pressureReleased += flowRateA * (time - 1);
  //       }
  //       if (openB) {
  //         opened.add(locB);
  //         pressureReleased += flowRateB * (time - 1);
  //       }

  //       const VIABLE_NEIGHBORS_A = VALVES_WITH_FLOW.filter(valve => !visitedA.has(valve));
  //       const VIABLE_NEIGHBORS_B = VALVES_WITH_FLOW.filter(valve => !visitedB.has(valve));

  //       if (!VIABLE_NEIGHBORS_A.length && !VIABLE_NEIGHBORS_B.length) {

  //         go( locA,
  //             locB,
  //             0,
  //             0,
  //             0,
  //             openA ? new Set([locA]) : visitedA,
  //             openB ? new Set([locB]) : visitedB,
  //             true,
  //             true);

  //       }
  //       else if (!VIABLE_NEIGHBORS_A.length) {

  //         for (const neighborB of VIABLE_NEIGHBORS_B) {
  //           if (neighborB === locB) continue;
  //           const travelTimeB = DISTANCE_BETWEEN_KEY_NODES[locB][neighborB];
  //           timeB -= travelTimeB + (openB ? 1 : 0);
  //           go( locA,
  //               neighborB,
  //               timeB,
  //               0,
  //               timeB,
  //               openA ? new Set([locA]) : visitedA,
  //               openB ? new Set([locB]) : visitedB,
  //               true,
  //               doneB);
  //           timeB += travelTimeB + (openB ? 1 : 0);
  //         }

  //       }
  //       else if (!VIABLE_NEIGHBORS_B.length) {

  //         for (const neighborA of VIABLE_NEIGHBORS_A) {
  //           if (neighborA === locA) continue;
  //           const travelTimeA = DISTANCE_BETWEEN_KEY_NODES[locA][neighborA];
  //           timeA -= travelTimeA + (openA ? 1 : 0);
  //           go( neighborA,
  //               locB,
  //               timeA,
  //               timeA,
  //               0,
  //               openA ? new Set([locA]) : visitedA,
  //               openB ? new Set([locB]) : visitedB,
  //               doneA,
  //               true);
  //           timeA += travelTimeA + (openA ? 1 : 0);
  //         }

  //       }
  //       else {

  //         for (const neighborA of VIABLE_NEIGHBORS_A) {
  //           if (neighborA === locA) continue;

  //           if (!VIABLE_NEIGHBORS_B.length) {
  //             go( neighborA,
  //                 locB,
  //                 timeA,
  //                 timeA,
  //                 0,
  //                 openA ? new Set([locA]) : visitedA,
  //                 openB ? new Set([locB]) : visitedB,
  //                 doneA,
  //                 true);
  //           } else {
  //             for (const neighborB of VIABLE_NEIGHBORS_B) {
  //               if (neighborB === locB || neighborB === neighborA) continue;

  //               const travelTimeA = DISTANCE_BETWEEN_KEY_NODES[locA][neighborA];
  //               const travelTimeB = DISTANCE_BETWEEN_KEY_NODES[locB][neighborB];

  //               timeA -= travelTimeA + (openA ? 1 : 0);
  //               timeB -= travelTimeB + (openB ? 1 : 0);

  //               go( neighborA,
  //                   neighborB,
  //                   Math.max(timeA, timeB),
  //                   timeA,
  //                   timeB,
  //                   openA ? new Set([locA]) : visitedA,
  //                   openB ? new Set([locB]) : visitedB,
  //                   doneA,
  //                   doneB);

  //               timeA += travelTimeA + (openA ? 1 : 0);
  //               timeB += travelTimeB + (openB ? 1 : 0);
  //             }
  //           }
  //         }

  //       }

  //       if (openA) {
  //         opened.delete(locA);
  //         pressureReleased -= flowRateA * (time - 1);
  //       }
  //       if (openB) {
  //         opened.delete(locB);
  //         pressureReleased -= flowRateB * (time - 1);
  //       }
  //     }
  //     else if (A_IS_READY) {

  //       if (openA) {
  //         opened.add(locA);
  //         pressureReleased += flowRateA * (time - 1);
  //       }

  //       const VIABLE_NEIGHBORS_A = VALVES_WITH_FLOW.filter(valve => !visitedA.has(valve));
  //       if (!VIABLE_NEIGHBORS_A.length) {
  //         go( locA,
  //             locB,
  //             timeB,
  //             0,
  //             timeB,
  //             visitedA,
  //             visitedB,
  //             true,
  //             doneB);
  //       } else {
  //         for (const neighborA of VIABLE_NEIGHBORS_A) {
  //           if (neighborA === locA) continue;
  //           const travelTimeA = DISTANCE_BETWEEN_KEY_NODES[locA][neighborA];
  //           timeA -= travelTimeA + (openA ? 1 : 0);
  //           go( neighborA,
  //               locB,
  //               Math.max(timeA, timeB),
  //               timeA,
  //               timeB,
  //               openA ? new Set([locA]) : visitedA,
  //               visitedB,
  //               doneA,
  //               doneB);
  //           timeA += travelTimeA + (openA ? 1 : 0);
  //         }
  //       }

  //       if (openA) {
  //         opened.delete(locA);
  //         pressureReleased -= flowRateA * (time - 1);
  //       }
  //     }
  //     else if (B_IS_READY) {

  //       if (openB) {
  //         opened.add(locB);
  //         pressureReleased += flowRateB * (time - 1);
  //       }

  //       const VIABLE_NEIGHBORS_B = VALVES_WITH_FLOW.filter(valve => !visitedB.has(valve));
  //       if (!VIABLE_NEIGHBORS_B.length) {
  //         go( locA,
  //             locB,
  //             timeA,
  //             timeA,
  //             0,
  //             visitedA,
  //             visitedB,
  //             doneA,
  //             true);
  //       } else {
  //         for (const neighborB of VIABLE_NEIGHBORS_B) {
  //           if (neighborB === locB) continue;
  //           const travelTimeB = DISTANCE_BETWEEN_KEY_NODES[locB][neighborB];
  //           timeB -= travelTimeB + (openB ? 1 : 0);
  //           go( locA,
  //               neighborB,
  //               Math.max(timeA, timeB),
  //               timeA,
  //               timeB,
  //               visitedA,
  //               openB ? new Set([locB]) : visitedB,
  //               doneA,
  //               doneB);
  //           timeB += travelTimeB + (openB ? 1 : 0);
  //         }
  //       }

  //       if (openB) {
  //         opened.delete(locB);
  //         pressureReleased -= flowRateB * (time - 1);
  //       }
  //     }
  //     else throw 'ERROR: EITHER A OR B SHOULD BE READY';

  //     if (A_IS_READY) {
  //       visitedA.delete(locA);
  //       // PATH_A.pop();
  //     }
  //     if (B_IS_READY) {
  //       visitedB.delete(locB);
  //       // PATH_B.pop();
  //     }
  //   }

  //   // const visitedA = new Set();
  //   // const visitedB = new Set();
  //   go('AA', 'AA', 26, 26, 26, new Set(), new Set(), false, false);
  //   console.log(`(RUN TOOK ${(Date.now() - TIME_START)/1000} SECS)`)
  //   return maxRelease;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = optimalGraphTraversal;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([ 4 ]);
// const skippedTests = new Set([  ]);
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
expected = null;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);