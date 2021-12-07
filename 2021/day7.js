/*

--- Day 7: The Treachery of Whales ---

A giant whale has decided your submarine is its next meal, and it's much faster than you are. There's nowhere to run!

Suddenly, a swarm of crabs (each in its own tiny submarine - it's too deep for them otherwise) zooms in to rescue you! They seem to be preparing to blast a hole in the ocean floor; sensors indicate a massive underground cave system just beyond where they're aiming!

The crab submarines all need to be aligned before they'll have enough power to blast a large enough hole for your submarine to get through. However, it doesn't look like they'll be aligned before the whale catches you! Maybe you can help?

There's one major catch - crab submarines can only move horizontally.

You quickly make a list of the horizontal position of each crab (your puzzle input). Crab submarines have limited fuel, so you need to find a way to make all of their horizontal positions match while requiring them to spend as little fuel as possible.

For example, consider the following horizontal positions:

16,1,2,0,4,2,7,1,2,14
This means there's a crab with horizontal position 16, a crab with horizontal position 1, and so on.

Each change of 1 step in horizontal position of a single crab costs 1 fuel. You could choose any horizontal position to align them all on, but the one that costs the least fuel is horizontal position 2:

Move from 16 to 2: 14 fuel
Move from 1 to 2: 1 fuel
Move from 2 to 2: 0 fuel
Move from 0 to 2: 2 fuel
Move from 4 to 2: 2 fuel
Move from 2 to 2: 0 fuel
Move from 7 to 2: 5 fuel
Move from 1 to 2: 1 fuel
Move from 2 to 2: 0 fuel
Move from 14 to 2: 12 fuel
This costs a total of 37 fuel. This is the cheapest possible outcome; more expensive outcomes include aligning at position 1 (41 fuel), position 3 (39 fuel), or position 10 (71 fuel).

Determine the horizontal position that the crabs can align to using the least fuel possible. How much fuel must they spend to align to that position?


--- Part Two ---

The crabs don't seem interested in your proposed solution. Perhaps you misunderstand crab engineering?

As it turns out, crab submarine engines don't burn fuel at a constant rate. Instead, each change of 1 step in horizontal position costs 1 more unit of fuel than the last: the first step costs 1, the second step costs 2, the third step costs 3, and so on.

As each crab moves, moving further becomes more expensive. This changes the best horizontal position to align them all on; in the example above, this becomes 5:

Move from 16 to 5: 66 fuel
Move from 1 to 5: 10 fuel
Move from 2 to 5: 6 fuel
Move from 0 to 5: 15 fuel
Move from 4 to 5: 1 fuel
Move from 2 to 5: 6 fuel
Move from 7 to 5: 3 fuel
Move from 1 to 5: 10 fuel
Move from 2 to 5: 6 fuel
Move from 14 to 5: 45 fuel
This costs a total of 168 fuel. This is the new cheapest possible outcome; the old alignment position (2) now costs 206 fuel instead.

Determine the horizontal position that the crabs can align to using the least fuel possible so they can make you an escape route! How much fuel must they spend to align to that position?

*/

function optimizeFuel (part, inputStr) {
  const inputArr = inputStr.split(',').map(n => +n);

  // INIT
  const maxX = Math.max(...inputArr);
  const minX = Math.min(...inputArr);

  // HELPER FUNCTION: CALCULATE THE COST OF MOVING BETWEEN TWO POINTS (BASED ON PART 1, PART 2)
  function getCost(a, b) {
    const delta = Math.abs(a - b);
    if (part === 1) return delta;                                   // part 1: each unit of distance costs 1 fuel
    return (delta * (delta + 1)) / 2;                               // part 2: for each i, the ith unit of distance costs i fuel, so use gauss' summation formula (n)(n+1)/2
  }

  // RUN SIMULATION FOR ALL VALUES OF x FROM minX to maxX AND CALCULATE TOTAL FUEL COST TO GET TO THAT x. RETURN THE LOWEST COST
  // NOTE: THE SLIGHTLY OPTIMIZED WAY TO SOLVE THIS IS TO REALIZE YOU HAVE AN OPTIMIZATION PROBLEM - THE FUEL COST WILL DECREASE AS YOU APPROACH THE BEST X,
  // AND THEN INREASE AGAIN. THEREFORE YOU ONLY NEED TO KEEP TRACK OF THE PREVIOUS TOTAL FUEL COST - AS SOON AS THE CURRENT TOTAL FUEL COST EXCEEDS PREVIOUS VALUE,
  // YOU KNOW THAT THE PREVIOUS VALUE WAS THE BEST ONE AND YOU CAN STOP THE SIMULATION.

  // let lowest = Infinity;                                         // SLIGHT OPTIMIZATION AVAILABLE
  let prevValue = Infinity;
  for (let candidateX = minX; candidateX <= maxX; ++candidateX) {
    let total = 0;
    for (const crabX of inputArr) {
      total += getCost(crabX, candidateX);
    }
    // lowest = Math.min(lowest, total);                            // SLIGHT OPTIMIZATION AVAILABLE
    if (total > prevValue) return prevValue;
    prevValue = total;
  }
  // return lowest;                                                 // SLIGHT OPTIMIZATION AVAILABLE

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = optimizeFuel;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `16,1,2,0,4,2,7,1,2,14`;

const actualInput = `1101,1,29,67,1102,0,1,65,1008,65,35,66,1005,66,28,1,67,65,20,4,0,1001,65,1,65,1106,0,8,99,35,67,101,99,105,32,110,39,101,115,116,32,112,97,115,32,117,110,101,32,105,110,116,99,111,100,101,32,112,114,111,103,114,97,109,10,485,366,347,712,806,319,115,790,7,383,980,1,808,323,12,115,595,77,699,666,280,65,501,1570,859,300,857,854,928,443,692,876,275,550,1085,478,858,380,666,115,381,595,632,1144,117,718,507,11,29,938,48,16,6,134,675,542,742,421,538,436,646,505,80,230,745,78,77,738,196,587,1781,199,24,1230,297,671,25,430,1249,265,901,3,570,829,386,1227,1396,1033,596,396,181,15,158,630,416,136,192,281,153,236,316,544,1080,444,572,593,1201,70,1740,1007,92,45,382,910,666,160,1504,1135,134,1105,51,714,246,39,1098,256,1183,1514,1456,388,408,1638,393,58,771,2,193,840,1018,154,242,60,4,240,101,502,472,331,61,349,44,620,707,794,1301,470,38,227,8,249,462,1038,575,278,171,384,176,633,220,613,377,193,293,1595,676,832,22,1093,302,201,218,1063,753,990,714,16,135,182,239,63,604,238,832,477,582,375,217,1877,193,500,89,1882,310,471,83,104,893,136,181,218,479,522,20,91,700,1218,42,1020,400,152,355,316,906,1101,1027,527,276,1050,18,780,593,185,473,673,472,97,791,421,682,63,231,322,54,133,520,1333,631,602,846,852,43,315,1327,1557,461,183,1531,1013,1227,1201,1303,35,1471,483,159,40,346,1074,160,25,233,768,134,565,1275,41,272,645,381,239,1166,84,1119,388,1439,948,630,911,245,90,152,1310,474,1509,561,679,35,47,596,407,10,277,682,800,900,1323,1799,606,426,620,321,100,182,418,292,773,1541,959,964,227,0,351,168,61,293,47,252,646,642,629,135,123,134,1584,241,1631,702,983,67,907,298,14,216,50,50,188,646,77,453,1170,1315,26,408,432,304,1254,5,40,415,1232,213,565,1502,1478,64,180,116,288,1311,379,647,235,1101,246,334,149,545,209,240,12,525,1175,269,235,529,24,898,588,667,1767,659,1385,196,54,802,252,1854,13,1001,283,391,621,54,11,207,278,458,164,249,1042,632,726,555,539,740,365,71,309,39,1058,495,3,534,541,88,557,257,145,109,37,424,445,282,411,469,56,224,579,422,613,241,89,40,66,962,10,387,85,577,1137,255,142,395,1981,12,341,448,268,53,492,601,1102,39,700,449,1681,3,877,156,216,83,515,908,563,749,291,533,352,741,721,316,366,727,84,382,548,305,287,531,65,1000,220,2,156,657,645,117,124,383,327,183,373,352,491,1350,726,99,420,263,916,241,221,543,366,1564,610,213,790,253,316,760,84,17,935,147,1640,79,310,1360,1718,80,328,464,116,791,671,273,32,16,53,991,520,155,689,373,14,268,100,2,608,90,271,276,316,88,20,912,217,236,88,163,242,181,1269,443,465,674,372,1487,271,1361,1219,1208,824,40,660,1438,138,377,149,544,423,442,819,1524,383,327,408,1504,754,145,199,202,976,401,420,1039,95,1291,74,438,31,648,1346,66,1229,148,1257,353,696,536,866,462,560,1287,67,61,1218,36,293,741,667,348,203,875,385,367,42,983,346,76,1044,503,302,581,1409,179,1592,367,562,666,813,1872,221,1007,684,223,314,1005,76,398,673,112,1561,1222,336,618,357,1243,298,215,934,581,12,1096,42,588,326,93,498,1549,1413,1305,33,453,448,486,251,321,1600,950,112,85,1435,50,835,556,197,107,101,948,453,194,1006,382,50,460,1116,735,811,93,249,1416,81,16,252,601,294,905,18,48,113,240,1135,334,305,38,1279,8,1039,229,360,606,419,1121,1500,1057,97,174,149,411,977,434,518,1197,1531,1210,594,14,343,92,61,510,105,253,43,1083,519,264,15,36,73,784,732,68,944,808,179,487,972,1000,185,545,1433,149,112,62,557,956,92,518,1626,522,690,789,32,392,222,501,130,187,1017,1266,701,207,16,306,1222,4,1072,950,1438,135,103,355,1793,62,996,1255,529,974,1133,412,69,46,633,143,442,850,187,115,162,3,230,802,627,167,652,1359,742,467,977,1539,969,1542,24,266,527,712,800,177,1301,543,867,227,866,20,515,483,617,334,114,73,913,389,42,71,1421,712,852,1073,305,11,617,153,280,625,2,544,201,970,69,1463,638,11,143,240,199,92,1068,598,625,1596,262,350,880,124,675,1026,272,545,1349,1103,725,601,1501,86,21,149,316,1512,22,1181,247,61,596,210,475,86,842,410,642,643,156,166,684,2,45,1460,349,1720,877,256,48,43,554,1086,53,5,223,930,181,883,899,39,1440,739,480,476,981,584,2,809,1080,59`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 37;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 352254;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 168;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 99053143;
test(func, input, expected, testNum, lowestTest, highestTest);