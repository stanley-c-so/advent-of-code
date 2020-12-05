// --- Day 1: Report Repair ---

// After saving Christmas five years in a row, you've decided to take a vacation at a nice resort on a tropical island. Surely, Christmas will go on without you.

// The tropical island has its own currency and is entirely cash-only. The gold coins used there have a little picture of a starfish; the locals just call them stars. None of the currency exchanges seem to have heard of them, but somehow, you'll need to find fifty of these coins by the time you arrive so you can pay the deposit on your room.

// To save your vacation, you need to get all fifty stars by December 25th.

// Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

// Before you leave, the Elves in accounting just need you to fix your expense report (your puzzle input); apparently, something isn't quite adding up.

// Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together.

// For example, suppose your expense report contained the following:

// 1721
// 979
// 366
// 299
// 675
// 1456

// In this list, the two entries that sum to 2020 are 1721 and 299. Multiplying them together produces 1721 * 299 = 514579, so the correct answer is 514579.

// Of course, your expense report is much larger. Find the two entries that sum to 2020; what do you get if you multiply them together?

// --- Part Two ---

// The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.

// Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.

// In your expense report, what is the product of the three entries that sum to 2020?

function sumTo2020 (part, inputStr) {
  const inputArr = inputStr.split('\n').map(element => +element);

  if (part === 1) {                                                 // PART 1: TWO-SUM

    const set = new Set(inputArr);
    for (const num of inputArr) {
      const complement = 2020 - num;
      if (set.has(complement)) return num * complement;
    }
    throw "INVALID: NO SOLUTION";

  } else {                                                          // PART 2: THREE-SUM

    inputArr.sort((a, b) => a - b);
    for (let i = 0; i < inputArr.length - 2; ++i) {
      const target = 2020 - inputArr[i];
      let left = i + 1;
      let right = inputArr.length - 1;
      while (left < right) {
        const sum = inputArr[left] + inputArr[right];
        if (sum < target) {
          ++left;
        } else if (sum > target) {
          --right;
        } else {
          return inputArr[i] * inputArr[left] * inputArr[right];
        }
      }
    }
    throw "INVALID: NO SOLUTION";

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = sumTo2020;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `1721
979
366
299
675
1456`;

const actualInput = `1567
1223
1758
1842
1933
1898
1409
1058
1533
1417
1032
1634
1477
1394
1888
1972
1237
1390
1677
1546
1302
1070
1369
1455
1065
1924
1593
1131
1064
1346
1914
1129
1830
1450
1278
1740
1809
1176
1734
1102
1807
1982
1603
1736
2008
1980
1905
1633
1732
1350
1865
1988
1805
1998
1152
1046
1870
1557
1789
1766
1945
1359
1002
1126
1719
1497
1296
1560
1936
1929
1464
2005
1281
618
1257
1107
1632
1688
1964
1803
1360
1384
1889
1411
1328
1452
1868
1515
1586
1631
1618
1087
1710
1094
1774
1295
1700
1636
1230
1421
1910
1522
1366
1144
1757
1493
1316
1103
687
1371
1720
1155
1559
1900
989
1367
1999
1066
1773
1787
1402
1047
1806
1956
1219
1555
1307
1419
1706
1884
1109
1181
2010
1298
1730
1078
1848
1398
1687
2007
1550
1664
1225
1079
1698
350
1222
1377
1977
1510
1571
1630
1029
1379
1942
1949
1249
1829
1297
1530
1607
1324
1069
1476
928
1039
1855
1644
1454
1310
1172
547
1034
1878
1479
1457
1319
1810
1759
1439
1851
545
1470
2003
1908
1564
1491
1174
1301
1689
1276
1781
1392
1499
1962
1653
1823
1381
1827
1974`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 1721 * 299;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 866436;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 979 * 366 * 675;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 276650720;
test(func, input, expected, testNum, lowestTest, highestTest);