// --- Day 3: Crossed Wires ---

// PART 1:

// The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

// Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

// The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

// For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

// ...........
// ...........
// ...........
// ....+----+.
// ....|....|.
// ....|....|.
// ....|....|.
// .........|.
// .o-------+.
// ...........
// Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

// ...........
// .+-----+...
// .|.....|...
// .|..+--X-+.
// .|..|..|.|.
// .|.-X--+.|.
// .|..|....|.
// .|.......|.
// .o-------+.
// ...........
// These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

// Here are a few more examples:

// R75,D30,R83,U83,L12,D49,R71,U7,L72
// U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
// R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
// U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
// What is the Manhattan distance from the central port to the closest intersection?

// PART 2:

// It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

// To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the first time it visits that position when calculating the total value of a specific intersection.

// The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location, including the intersection being considered. Again consider the example from above:

// ...........
// .+-----+...
// .|.....|...
// .|..+--X-+.
// .|..|..|.|.
// .|.-X--+.|.
// .|..|....|.
// .|.......|.
// .o-------+.
// ...........
// In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

// However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes only 7+6+2 = 15, a total of 15+15 = 30 steps.

// Here are the best steps for the extra examples from above:

// R75,D30,R83,U83,L12,D49,R71,U7,L72
// U62,R66,U55,R34,D71,R55,D58,R83 = 610 steps
// R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
// U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = 410 steps
// What is the fewest combined steps the wires must take to reach an intersection?

// SWITCHING BETWEEN SOLUTIONS:
const nearestIntersection = solution_1;

function solution_1 (part, wireInput) {

  const [wire1, wire2] = wireInput.split('\n').map(wire => wire.split(','));

  const createMap = wire => {
    let x = 0;
    let y = 0;
    const map = {'0,0': 0};
    let traveled = 1;
    for (const move of wire) {
      const dir = move[0];
      const distance = +move.slice(1);
      for (let i = 0; i < distance; i++) {
        if (dir === 'U') {
          y++;
        } else if (dir === 'D') {
          y--;
        } else if (dir === 'R') {
          x++;
        } else {
          x--;
        }
        if (!(`${x},${y}` in map)) map[`${x},${y}`] = traveled;
        traveled++;
      }
    }
    return map;
  };

  const wire1Map = createMap(wire1);
  const wire2Map = createMap(wire2);

  let output = Infinity;

  let callback;   // this will differ depending on if it's part 1 or part 2

  // PART 1 VS PART 2
  if (part === 1) {
    callback = coord => Math.abs(+(coord.split(',')[0])) + Math.abs(+(coord.split(',')[1]));
  } else {
    callback = (coord, wire1Map, wire2Map) => wire1Map[coord] + wire2Map[coord];
  }

  for (const coord in wire1Map) {
    if (coord !== '0,0' && coord in wire2Map) {
      output = Math.min(
        output,
        callback(coord, wire1Map, wire2Map)
      );
    }
  }

  return output;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = nearestIntersection;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `R1004,U520,R137,D262,L403,U857,R50,U679,R788,D98,L717,D1,R367,U608,L125,U703,L562,D701,L718,U357,R742,D860,R557,D117,R950,U546,L506,U836,R951,D460,L38,U893,L1,D217,R262,D950,R239,U384,R971,D289,R323,U878,L525,U687,L831,U523,R94,D33,L879,D318,R633,D775,R879,D351,L120,D8,R31,U49,R328,D598,L380,D160,R261,D716,R459,U533,L444,U412,L326,U93,L193,D621,R236,U769,L319,D885,L559,U509,L62,U321,L667,D505,R556,U159,L5,U126,L262,D946,L168,U491,L56,D831,R926,U926,R562,D270,R785,U436,R852,D629,R872,U716,R549,U435,R462,U191,R318,U91,L637,D682,R647,D53,L789,D725,R312,D366,L287,U29,R85,D657,R88,U300,R795,U378,R800,D391,L594,U791,R205,U352,L510,D975,R47,D311,R319,U579,R214,D112,R996,U874,R328,D578,R37,U689,L543,U16,L580,D230,L714,D58,L580,D658,R218,U535,R149,U996,L173,D316,L90,D372,L364,U700,L60,D70,L250,U276,R580,U505,L682,U943,R336,U847,R810,U963,R874,D740,R732,D328,R926,D447,R638,D102,R696,U211,L594,D354,R384,U81,L884,U916,L168,U759,R631,D702,L598,D382,L647,U642,R537,U53,R897,U954,R263,U445,L41,D91,L51,D338,R219,U269,L689,D172,R627,D287,L440,D504,L253,D252,R815,D108,L282,U835,L243,U638,R910,D306,R755,D202,R69,D862,L537,D947,L180,D835,L111,U832,R939,D449,R180,U105,R892,D837,L153,U215,L695,U957,R923,U496,R608,U739,L711,U700,L838,D117,R479,U852,R795,D955,L386,D70,R728,D40,R580,U777,L877,U284,R414,D300,R105,D372,L317,D91,R653,U920,R956,D496,L543,D363,R374,D283,L696,U466,R467,D878,R660,U590,L962,U619,R991,U848,L648,D191,R459,U125,L998,U19,L214,U947,R188,U103,R916
L1008,U717,R288,D770,R270,U514,R109,D538,L719,U179,R466,D792,R421,U723,L22,U705,L284,U14,L478,U367,R727,U880,R620,D46,R377,U897,L731,U840,L910,D385,L257,U311,L596,D991,L668,D730,L707,D816,R47,U948,R84,D700,R299,U707,R261,D928,R358,D504,R309,U369,R931,U20,L940,U326,L362,D52,R98,D475,L907,D918,R931,D468,R279,D586,R592,U973,R753,D365,R694,U278,R934,U712,R441,U996,L989,D693,L211,D561,R105,D425,R53,U168,L451,U865,L585,D412,L857,U988,R724,U774,R295,U588,R329,D810,L698,D118,R277,U193,R309,U933,R186,D535,R409,U322,L849,U606,R590,U892,L542,D237,R475,D920,R679,U602,L477,D634,L988,D540,L323,U791,L375,U625,L621,U567,L943,U512,L239,D90,L66,U151,R83,U435,R612,D865,L177,U368,R326,U574,L241,U197,R499,U419,R297,U207,L311,D243,L559,D281,R513,U748,L884,U207,R71,D441,R133,D993,L4,D977,L669,U523,L564,U186,R477,U737,L685,U338,L456,U939,R774,U674,L97,D827,R237,D451,R618,D143,R750,U196,L559,D178,L693,D916,R334,U231,L651,U249,R620,U283,L387,U352,L915,U959,L693,U909,R320,U119,L617,U177,L993,D265,R667,U204,R59,D601,L579,U483,R155,D484,L44,D751,R915,U510,L552,U308,R505,U394,R585,U872,L617,U202,R928,U941,R235,U768,R666,D547,L244,D270,R353,D612,R384,U430,L685,D536,R103,U147,R794,D621,L52,U96,L557,D455,L635,D58,R265,U545,R938,D266,L173,U746,L672,D237,R286,U131,R487,U837,R394,D702,R49,U579,L699,U819,L448,D223,L982,D906,L397,U807,L737,D223,L791,D965,R436,U29,R908,D273,R194,U91,R232,U591,L336,D70,R467,U505,L341,U989,R278,U387,L442,U950,R487,D384,L534,D514,L433,U627,R381,U54,L847,U231,L590`;

// Test case 1
input = {
  part: 1,
  wireInput: `R8,U5,L5,D3
U7,R6,D4,L4`,
};
expected = 6;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  wireInput: `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`,
};
expected = 159;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  wireInput: `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`,
};
expected = 135;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  wireInput: actualInput
};
expected = 207;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  wireInput: `R8,U5,L5,D3
U7,R6,D4,L4`,
};
expected = 30;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  wireInput: `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`,
};
expected = 610;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  wireInput: `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`,
};
expected = 410;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  wireInput: actualInput
};
expected = 21196;
test(func, input, expected, testNum, lowestTest, highestTest);