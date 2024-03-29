/*

--- Day 19: Beacon Scanner ---

As your probe drifted down through this area, it released an assortment of beacons and scanners into the water. It's difficult to navigate in the pitch black open waters of the ocean trench, but if you can build a map of the trench using data from the scanners, you should be able to safely reach the bottom.

The beacons and scanners float motionless in the water; they're designed to maintain the same position for long periods of time. Each scanner is capable of detecting all beacons in a large cube centered on the scanner; beacons that are at most 1000 units away from the scanner in each of the three axes (x, y, and z) have their precise position determined relative to the scanner. However, scanners cannot detect other scanners. The submarine has automatically summarized the relative positions of beacons detected by each scanner (your puzzle input).

For example, if a scanner is at x,y,z coordinates 500,0,-500 and there are beacons at -500,1000,-1500 and 1501,0,-500, the scanner could report that the first beacon is at -1000,1000,-1000 (relative to the scanner) but would not detect the second beacon at all.

Unfortunately, while each scanner can report the positions of all detected beacons relative to itself, the scanners do not know their own position. You'll need to determine the positions of the beacons and scanners yourself.

The scanners and beacons map a single contiguous 3d region. This region can be reconstructed by finding pairs of scanners that have overlapping detection regions such that there are at least 12 beacons that both scanners detect within the overlap. By establishing 12 common beacons, you can precisely determine where the scanners are relative to each other, allowing you to reconstruct the beacon map one scanner at a time.

For a moment, consider only two dimensions. Suppose you have the following scanner reports:

--- scanner 0 ---
0,2
4,1
3,3

--- scanner 1 ---
-1,-1
-5,0
-2,1

Drawing x increasing rightward, y increasing upward, scanners as S, and beacons as B, scanner 0 detects this:

...B.
B....
....B
S....

Scanner 1 detects this:

...B..
B....S
....B.

For this example, assume scanners only need 3 overlapping beacons. Then, the beacons visible to both scanners overlap to produce the following complete map:

...B..
B....S
....B.
S.....

Unfortunately, there's a second problem: the scanners also don't know their rotation or facing direction. Due to magnetic alignment, each scanner is rotated some integer number of 90-degree turns around all of the x, y, and z axes. That is, one scanner might call a direction positive x, while another scanner might call that direction negative y. Or, two scanners might agree on which direction is positive x, but one scanner might be upside-down from the perspective of the other scanner. In total, each scanner could be in any of 24 different orientations: facing positive or negative x, y, or z, and considering any of four directions "up" from that facing.

For example, here is an arrangement of beacons as seen from a scanner in the same position but in different orientations:

--- scanner 0 ---
-1,-1,1
-2,-2,2
-3,-3,3
-2,-3,1
5,6,-4
8,0,7

--- scanner 0 ---
1,-1,1
2,-2,2
3,-3,3
2,-1,3
-5,4,-6
-8,-7,0

--- scanner 0 ---
-1,-1,-1
-2,-2,-2
-3,-3,-3
-1,-3,-2
4,6,5
-7,0,8

--- scanner 0 ---
1,1,-1
2,2,-2
3,3,-3
1,3,-2
-4,-6,5
7,0,8

--- scanner 0 ---
1,1,1
2,2,2
3,3,3
3,1,2
-6,-4,-5
0,7,-8

By finding pairs of scanners that both see at least 12 of the same beacons, you can assemble the entire map. For example, consider the following report:

--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14

Because all coordinates are relative, in this example, all "absolute" positions will be expressed relative to scanner 0 (using the orientation of scanner 0 and as if scanner 0 is at coordinates 0,0,0).

Scanners 0 and 1 have overlapping detection cubes; the 12 beacons they both detect (relative to scanner 0) are at the following coordinates:

-618,-824,-621
-537,-823,-458
-447,-329,318
404,-588,-901
544,-627,-890
528,-643,409
-661,-816,-575
390,-675,-793
423,-701,434
-345,-311,381
459,-707,401
-485,-357,347

These same 12 beacons (in the same order) but from the perspective of scanner 1 are:

686,422,578
605,423,415
515,917,-361
-336,658,858
-476,619,847
-460,603,-452
729,430,532
-322,571,750
-355,545,-477
413,935,-424
-391,539,-444
553,889,-390

Because of this, scanner 1 must be at 68,-1246,-43 (relative to scanner 0).

Scanner 4 overlaps with scanner 1; the 12 beacons they both detect (relative to scanner 0) are:

459,-707,401
-739,-1745,668
-485,-357,347
432,-2009,850
528,-643,409
423,-701,434
-345,-311,381
408,-1815,803
534,-1912,768
-687,-1600,576
-447,-329,318
-635,-1737,486

So, scanner 4 is at -20,-1133,1061 (relative to scanner 0).

Following this process, scanner 2 must be at 1105,-1205,1229 (relative to scanner 0) and scanner 3 must be at -92,-2380,-20 (relative to scanner 0).

The full list of beacons (relative to scanner 0) is:

-892,524,684
-876,649,763
-838,591,734
-789,900,-551
-739,-1745,668
-706,-3180,-659
-697,-3072,-689
-689,845,-530
-687,-1600,576
-661,-816,-575
-654,-3158,-753
-635,-1737,486
-631,-672,1502
-624,-1620,1868
-620,-3212,371
-618,-824,-621
-612,-1695,1788
-601,-1648,-643
-584,868,-557
-537,-823,-458
-532,-1715,1894
-518,-1681,-600
-499,-1607,-770
-485,-357,347
-470,-3283,303
-456,-621,1527
-447,-329,318
-430,-3130,366
-413,-627,1469
-345,-311,381
-36,-1284,1171
-27,-1108,-65
7,-33,-71
12,-2351,-103
26,-1119,1091
346,-2985,342
366,-3059,397
377,-2827,367
390,-675,-793
396,-1931,-563
404,-588,-901
408,-1815,803
423,-701,434
432,-2009,850
443,580,662
455,729,728
456,-540,1869
459,-707,401
465,-695,1988
474,580,667
496,-1584,1900
497,-1838,-617
527,-524,1933
528,-643,409
534,-1912,768
544,-627,-890
553,345,-567
564,392,-477
568,-2007,-577
605,-1665,1952
612,-1593,1893
630,319,-379
686,-3108,-505
776,-3184,-501
846,-3110,-434
1135,-1161,1235
1243,-1093,1063
1660,-552,429
1693,-557,386
1735,-437,1738
1749,-1800,1813
1772,-405,1572
1776,-675,371
1779,-442,1789
1780,-1548,337
1786,-1538,337
1847,-1591,415
1889,-1729,1762
1994,-1805,1792

In total, there are 79 beacons.

Assemble the full map of beacons. How many beacons are there?


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

const MEMO = {};                                                                        // store computed data by inputStr so part 2 doesn't have to recalculate

function scanBeacons (part, inputStr) {

  if (!(inputStr in MEMO)) {

    // PARSE DATA

    const scannerDataArr = [];
    const scannerStrData = inputStr.split('\n\n');
    for (const block of scannerStrData) {
      const lines = block.split('\n').slice(1).map(str => str.split(',').map(n => +n));
      scannerDataArr.push(lines);
    }

    // HELPFUL CONSTANTS

    const X = 'X', Y = 'Y', Z = 'Z';

    // HELPER FUNCTIONS

    function rotate(axis, [x, y, z], n) {
      if (n === 0) return [x, y, z];
      const rotated = axis === X ? [x, z, -y]                                           // when YOU are looking from the right, rotate sensor clockwise: +y -> -z; +z -> +y
        : axis === Y ? [-z, y, x]                                                       // when YOU are looking from above, rotate sensor clockwise: +x -> +z; +z -> -x
        : [-y, x, z];                                                                   // when YOU are looking straight, rotate sensor clockwise: +x -> +y; +y -> -x
      return (n === 1) ? rotated : rotate(axis, rotated, n - 1);
    }

    // NOTE: I ENDED UP NOT USING THIS FUNCTION BECAUSE THE KEY IS TO **REVERSE ROTATE** B's DATA WHEN COMPARING A AND B, BUT SAVING IT HERE FOR POSTERITY

    function rotateData(data, rot) {

      const firstRot = Math.floor(rot / 4);
      const secondRot = rot % 4;

      switch (firstRot) {
        case 0:                                                                         // 0-3: no first rotation (up stays up), then rotate along Y
          data = data.map(coords => rotate(X, coords, 0));
          data = data.map(coords => rotate(Y, coords, secondRot));
          break;
        case 1:                                                                         // 4-7: rotate along X (up now points at you), then rotate along Z
          data = data.map(coords => rotate(X, coords, 1));
          data = data.map(coords => rotate(Z, coords, secondRot));
          break;
        case 2:                                                                         // 8-11: rotate along Z (up now points right), then rotate along X
          data = data.map(coords => rotate(Z, coords, 3));
          data = data.map(coords => rotate(X, coords, secondRot));
          break;
        case 3:                                                                         // 12-15: rotate along X (up now points away), then rotate along Z
          data = data.map(coords => rotate(X, coords, 3));
          data = data.map(coords => rotate(Z, coords, secondRot));
          break;
        case 4:                                                                         // 16-19: rotate along Z (up now points left), then rotate along X
          data = data.map(coords => rotate(Z, coords, 1));
          data = data.map(coords => rotate(X, coords, secondRot));
          break;
        case 5:                                                                         // 20-23: rotate along Z (up points down), then rotate along Y
          data = data.map(coords => rotate(Z, coords, 2));
          data = data.map(coords => rotate(Y, coords, secondRot));
          break;
      }
      return data;
    }

    // AS EXPLAINED ABOVE, THE KEY WAS TO REVERSE THE ROTATION OF B, SINCE DURING THE COMPARISON PROCESS, WE FOUND THE FORWARD ROTATION

    function reverseRotateData(coords, rot) {

      const firstRot = Math.floor(rot / 4);
      const secondRot = rot % 4;

      switch (firstRot) {
        case 0:
          coords = rotate(Y, coords, 4 - secondRot);
          coords = rotate(X, coords, 0);
          break;
        case 1:
          coords = rotate(Z, coords, 4 - secondRot);
          coords = rotate(X, coords, 3);
          break;
        case 2:
          coords = rotate(X, coords, 4 - secondRot);
          coords = rotate(Z, coords, 1);
          break;
        case 3:
          coords = rotate(Z, coords, 4 - secondRot);
          coords = rotate(X, coords, 1);
          break;
        case 4:
          coords = rotate(X, coords, 4 - secondRot);
          coords = rotate(Z, coords, 3);
          break;
        case 5:
          coords = rotate(Y, coords, 4 - secondRot);
          coords = rotate(Z, coords, 2);
          break;
      }
      return coords;
    }

    // GIVEN ONE BEACON WITHIN THE SET OF BEACONS SEEN BY ONE SCANNER, FIND THE RELATIVE POSITION OF THE OTHER BEACONS, IN THAT SCANNER'S REFERENCE FRAME

    function getOtherBeaconsRelativeData(scannerData) {
      const relativeData = [];
      for (let i = 0; i < scannerData.length; ++i) {
        const otherBeaconsRelativeToBeacon = new Set();
        const [ix, iy, iz] = scannerData[i];
        for (let j = 0; j < scannerData.length; ++j) {
          if (i === j) continue;
          const [jx, jy, jz] = scannerData[j];
          otherBeaconsRelativeToBeacon.add([jx - ix, jy - iy, jz - iz].join(','));
        }
        relativeData.push(otherBeaconsRelativeToBeacon);
      }
      return relativeData;
    }

    // GIVEN THE DATA FOR TWO SCANNERS, A AND B, IF WE CAN DERIVE THE RELATIVE POSITION AND ROTATION OF B BASED ON A's REFERENCE FRAME, RETURN IT, ELSE null

    function compareTwoScanners(A, B) {

      const dataA = scannerDataArr[A];
      const dataB = scannerDataArr[B];
      const dataABeaconRelativeData = getOtherBeaconsRelativeData(dataA);

      // for each of the 24 possible rotations, copy dataB and rotate the result, then derive the data for dataBCopy's beacons relative to each other, and compare
      for (let rot = 0; rot < 24; ++rot) {
        const dataBCopy = dataB.map(coords => reverseRotateData(coords, rot));
        const dataBCopyBeaconRelativeData = getOtherBeaconsRelativeData(dataBCopy);

        for (let a = 0; a < dataA.length; ++a) {
          for (let b = 0; b < dataBCopy.length; ++b) {
            const setA = dataABeaconRelativeData[a];
            const setB = dataBCopyBeaconRelativeData[b];
            let count = 1;                                                              // assume the current sensors a and b are the same, so common count is 1
            for (const coord of setA) {
              if (setB.has(coord)) ++count;
            }

            // the common beacons are confirmed to be the same ones if there are 12 or more of them
            if (count >= 12) {
              const [ax, ay, az] = dataA[a];
              const [bx, by, bz] = dataBCopy[b];
              return {
                relativePosition: [ax - bx, ay - by, az - bz],
                relativeRotation: rot
              };
            }
          }
        }
      }
      return null;
    }

    // FIND ALL SCANNERS AND BEACONS

    // init - based on running the compare function on all pairs of scanners, we will derive partially complete grids of how the scanners relate to each other
    const relativePositionGrid = Array.from(                                            // row: reference frame, col: other
      {length: scannerDataArr.length},
      () => Array(scannerDataArr.length).fill(null)
    );
    const relativeRotationGrid = Array.from(                                            // row: reference frame, col: other
      {length: scannerDataArr.length},
      () => Array(scannerDataArr.length).fill(null)
    );

    // using the partially complete data from the grids above, we should be able to standardize all data relative to scanner zero's reference frame
    const transformationsRelativeToScannerZero = [
      {                                                                                 // (of course, scanner zero, relative to itself, has empty values)
        position: [0, 0, 0],                                                            // relative displacement of other scanner relative to zero
        rotation: []                                                                    // series of rotations that must be done relative to zero
      },
      ...Array(scannerDataArr.length - 1).fill(null)
    ];

    // compare all pairs of scanners to partially fill out relativePositionGrid and relativeRotationGrid
    for (let i = 0; i < scannerDataArr.length; ++i) {
      for (let j = 0; j < scannerDataArr.length; ++j) {
        if (i === j) {
          relativePositionGrid[i][j] = [0, 0, 0];
          relativeRotationGrid[i][j] = 0;
          continue;
        }
        console.log(`--- now comparing ${i} and ${j} ---`);                             // leaving this here because part 2 takes a long time
        const compare = compareTwoScanners(i, j);
        if (compare === null) continue;
        relativePositionGrid[i][j] = compare.relativePosition;
        relativeRotationGrid[i][j] = compare.relativeRotation;
      }
    }

    // navigate the grids to derive the relative positions and rotations of each scanner compared to scanner zero
    const visited = Array(scannerDataArr.length).fill(false);
    const stack = [0];
    while (stack.length) {
      const i = stack.pop();
      if (visited[i] || transformationsRelativeToScannerZero[i] === null) continue;
      visited[i] = true;
      const [ax, ay, az] = transformationsRelativeToScannerZero[i].position;
      for (let j = 0; j < relativePositionGrid[i].length; ++j) {
        if (i === j || visited[j] || relativePositionGrid[i][j] === null) continue;
        let [bx, by, bz] = relativePositionGrid[i][j];
        for (let k = transformationsRelativeToScannerZero[i].rotation.length - 1; k >= 0; --k) {
          [bx, by, bz] = reverseRotateData([bx, by, bz], transformationsRelativeToScannerZero[i].rotation[k]);
        }
        transformationsRelativeToScannerZero[j] = {
          position: [ ax + bx, ay + by, az + bz ],
          rotation: [ ...transformationsRelativeToScannerZero[i].rotation, relativeRotationGrid[i][j] ]
        };
        stack.push(j);
      }
    }

    MEMO[inputStr] = { scannerDataArr, transformationsRelativeToScannerZero };
  }

  // MAIN FUNCTION: BASED ON FOUND SCANNERS AND BEACONS, RETURN REQUIRED INFORMATION

  const { scannerDataArr, transformationsRelativeToScannerZero } = MEMO[inputStr];

  if (part === 1) {                                                                                     // PART 1: return number of beacons

    const beaconSet = new Set();
    for (let i = 0; i < scannerDataArr.length; ++i) {
      const reverseRotated = scannerDataArr[i].map(coords => {
        let [x, y, z] = coords;
        for (let k = transformationsRelativeToScannerZero[i].rotation.length - 1; k >= 0; --k) {
          [x, y, z] = reverseRotateData([x, y, z], transformationsRelativeToScannerZero[i].rotation[k]);
        }
        const [dx, dy, dz] = transformationsRelativeToScannerZero[i].position;
        return [x + dx, y + dy, z + dz];
      });
      for (const [x, y, z] of reverseRotated) beaconSet.add(`${x},${y},${z}`);
    }
    return beaconSet.size;

  } else {                                                                                              // PART 2: get max manhattan distance between scanners

    let maxManhattanDistance = 0;
    const allScanners = transformationsRelativeToScannerZero.map(scannerData => scannerData.position);
    for (let i = 0; i < allScanners.length - 1; ++i) {
      for (let j = i + 1; j < allScanners.length; ++j) {
        const [ax, ay, az] = allScanners[i];
        const [bx, by, bz] = allScanners[j];
        const manhattanDistance = Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);
        maxManhattanDistance = Math.max(maxManhattanDistance, manhattanDistance);
      }
    }
    return maxManhattanDistance;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = scanBeacons;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;

const actualInput = `--- scanner 0 ---
518,781,-434
587,-467,-517
-602,676,848
411,517,775
-6,117,112
521,910,-382
-579,596,796
-670,-552,413
329,507,669
-711,621,864
-757,-373,-766
463,-496,-653
-485,-567,434
333,-451,767
-688,-551,504
489,-466,723
638,-534,-698
-933,412,-628
619,877,-351
-129,21,-2
342,541,680
-957,462,-734
-924,543,-748
-959,-404,-724
-932,-350,-707
348,-491,716

--- scanner 1 ---
416,-472,809
-731,-669,-481
508,490,518
-86,89,144
501,551,488
557,-738,-447
444,724,-450
498,-583,871
605,-729,-624
-443,-654,634
-667,-743,-581
-343,475,-367
-595,979,559
-598,956,601
-403,-697,564
-404,-702,689
385,717,-310
94,175,27
567,555,384
-455,472,-446
-689,875,526
-383,458,-391
-673,-704,-577
445,630,-450
589,-455,881
626,-628,-514

--- scanner 2 ---
-666,-416,-935
-452,-753,396
-600,-412,-831
344,793,-685
-487,-758,447
-597,722,-448
601,495,259
305,841,-630
499,-817,-718
675,-415,676
-552,537,379
-607,-351,-801
-515,611,-510
304,836,-755
-504,482,315
590,-736,-793
-688,594,-438
640,-479,786
489,-422,708
-564,634,250
-461,-836,493
617,535,319
-150,11,8
-65,83,-161
496,-840,-760
739,545,232

--- scanner 3 ---
-300,354,-552
864,-675,-477
176,-8,-142
455,648,-617
-589,-630,-578
762,-614,424
-345,468,257
-643,-690,402
897,-656,-522
759,-701,376
676,758,287
-349,537,418
764,-474,394
-638,-844,370
-681,-786,561
743,717,433
790,-721,-442
-461,368,-428
723,739,373
511,641,-834
555,627,-697
-384,437,-508
-594,-416,-504
-328,551,413
-677,-565,-496
37,-11,29

--- scanner 4 ---
-463,497,873
-727,828,-603
-358,-623,-409
-677,852,-709
470,-637,736
-622,-516,800
-229,-626,-357
195,-29,49
789,817,-463
907,694,-426
842,744,-466
791,-795,-392
503,-681,584
736,333,929
-543,474,821
-632,-434,694
-596,819,-723
473,-533,593
770,-746,-524
-518,606,889
743,324,956
-598,-447,705
119,81,172
686,497,895
-262,-724,-326
712,-823,-439

--- scanner 5 ---
824,-682,628
726,-402,-319
837,485,848
436,977,-516
-622,-630,648
-486,670,-602
-452,675,-842
416,942,-403
589,976,-482
-488,548,483
-696,-352,-691
-447,688,-793
-474,-545,636
-588,-258,-784
641,-289,-320
879,-497,655
-46,38,-28
705,495,723
45,186,111
729,492,779
-496,-510,627
890,-604,524
-702,-340,-726
-455,530,452
560,-423,-263
-441,449,595

--- scanner 6 ---
-315,309,-414
439,-612,-437
-538,-660,630
829,555,783
-499,-635,616
55,46,-63
299,441,-807
873,-452,401
-623,-573,-845
-480,-681,752
-646,448,581
-797,447,531
860,-434,387
345,358,-846
506,-632,-490
-708,561,481
-506,-651,-875
-499,-451,-871
456,-672,-587
360,339,-854
-401,407,-429
-434,416,-379
695,-414,369
807,580,760
-93,-33,11
686,444,772

--- scanner 7 ---
347,355,826
742,-400,-856
-122,-84,-57
634,-749,447
659,723,-628
-705,-466,-772
-510,627,516
-465,589,691
834,-429,-868
-540,-497,739
-646,656,640
-456,773,-879
682,736,-614
-439,719,-906
296,408,674
-708,-409,-574
683,-647,381
-742,-505,-636
355,472,731
-397,750,-704
610,-598,339
18,28,34
674,742,-845
-634,-423,616
-625,-468,570
812,-405,-882

--- scanner 8 ---
606,-636,920
343,-356,-530
557,-603,786
667,542,625
646,-610,768
-579,-623,-790
-515,874,-784
682,590,688
405,-514,-535
396,-478,-607
-492,311,478
-83,-74,132
32,14,-5
-389,319,576
-701,-639,-754
451,523,-341
420,571,-292
-566,861,-808
-908,-471,778
-440,766,-739
428,740,-309
552,658,690
-637,-611,-745
-896,-347,751
-470,377,455
-891,-489,628

--- scanner 9 ---
686,-478,-712
-832,-720,-351
-684,511,488
631,391,752
588,681,-662
911,-874,524
-780,410,405
888,-786,433
593,566,707
-513,-716,558
774,-458,-617
548,696,-713
-836,-610,-356
-539,-943,552
-426,-842,624
816,-970,449
-29,-146,-102
-410,700,-615
-420,618,-721
141,-64,-47
771,-496,-798
-444,687,-626
-788,-535,-348
563,540,-669
-813,508,436
564,442,571

--- scanner 10 ---
718,-564,500
663,813,-420
-523,-541,309
541,738,414
-477,-521,503
-357,-705,-680
481,651,274
705,-297,-719
581,-271,-841
84,152,1
-593,493,-562
-247,893,331
588,-267,-641
597,817,-524
-359,896,410
540,644,414
614,-479,444
604,878,-554
39,33,-141
-582,-489,456
-499,389,-595
-502,412,-637
-287,910,355
-424,-652,-660
-374,-555,-620
731,-501,573

--- scanner 11 ---
897,-579,604
903,560,336
466,465,-620
790,-520,-775
821,-525,561
150,-94,2
-323,440,-709
510,561,-622
900,-617,478
887,-528,-807
-334,-617,-539
-570,523,294
-412,-655,-406
-645,458,361
838,612,489
-698,468,321
-381,346,-760
-469,-594,-571
-308,-475,425
-322,-636,481
576,408,-690
-366,-593,517
48,62,-135
905,-599,-719
852,625,444
-362,287,-685

--- scanner 12 ---
526,613,-486
754,893,779
707,546,-537
845,870,691
-533,-445,-768
-789,887,514
-547,-437,-830
-12,128,37
842,-831,-603
-586,-414,-880
-294,730,-446
-665,899,487
829,798,875
654,-444,747
873,-798,-505
-526,-655,497
571,575,-661
-286,847,-351
149,30,-42
-533,-566,479
790,-702,-606
-647,882,637
726,-557,848
-500,-615,345
720,-531,621
-235,794,-503

--- scanner 13 ---
691,-768,453
-484,762,339
496,346,561
574,316,444
595,604,-518
374,320,437
-816,-765,-822
555,701,-568
-926,-701,-787
-81,-17,44
661,-829,460
-587,-422,340
-493,812,372
-848,-758,-636
-633,-344,314
795,-764,519
-386,777,253
578,-363,-646
620,-340,-643
535,754,-501
-416,337,-422
-536,-427,305
-435,345,-407
-518,384,-361
3,-112,-115
653,-444,-737

--- scanner 14 ---
243,-555,655
750,450,795
10,-110,-8
347,-522,561
-764,607,-320
365,-751,-577
-687,349,631
-635,496,572
-798,-620,730
702,361,-285
764,395,867
-701,-580,780
752,467,-309
-540,-480,-681
-817,604,-393
453,-825,-645
-667,543,677
621,347,-318
266,-597,652
-556,-434,-601
-851,-640,797
-488,-456,-717
494,-664,-588
-882,644,-443
747,371,907
-90,-34,141

--- scanner 15 ---
50,-133,85
586,615,469
-447,-636,-526
-659,400,-586
-105,22,-10
-754,493,718
-666,541,-611
-685,440,628
595,569,514
-710,385,-626
512,-575,455
680,738,543
764,-880,-727
478,-637,551
-851,-705,747
-377,-433,-510
823,-705,-704
755,690,-543
515,-773,512
781,-907,-673
574,639,-610
-771,-696,679
710,515,-581
-356,-618,-525
-727,405,550
-834,-728,495

--- scanner 16 ---
407,710,-769
-50,-11,134
-702,-757,515
619,-668,667
461,-782,-781
753,-635,716
477,585,632
601,-661,756
-774,-793,506
584,-924,-786
-697,-915,453
250,591,658
-851,487,-431
-872,322,-397
-867,415,-582
611,-800,-798
-921,-632,-591
-189,-142,64
-912,-660,-527
319,619,-792
-957,-648,-469
-460,621,745
223,694,-697
-437,798,711
351,519,545
-439,841,786

--- scanner 17 ---
-534,753,-842
-960,-235,785
-525,-322,-659
-673,-346,-721
442,-608,-483
-122,78,-121
459,471,-673
-972,-404,793
767,580,773
8,-5,17
538,398,-734
-920,-347,784
-596,662,635
-456,617,-838
625,-456,498
-512,-272,-667
-623,591,619
431,-576,-444
637,534,817
651,-368,387
439,-521,-588
-607,436,644
696,556,718
532,460,-837
-500,756,-724
638,-345,550

--- scanner 18 ---
709,-483,-367
-680,-877,-594
748,-460,-317
784,-766,592
783,420,594
-355,383,859
697,-637,581
-314,-510,851
-711,-844,-692
695,-491,-429
760,433,608
-13,-42,-54
-338,437,886
-409,529,-536
-545,500,-660
-434,-379,860
-364,567,-711
775,414,825
-328,-429,884
858,-678,524
397,748,-694
-628,-748,-591
-296,406,684
106,95,64
456,684,-751
448,801,-846

--- scanner 19 ---
548,-925,-540
766,660,842
667,528,811
640,-824,-520
20,-99,4
-749,-854,-551
-137,2,-90
-871,242,377
526,535,-322
-922,394,430
-608,729,-576
-535,687,-625
298,-798,844
356,-919,763
-579,-856,-433
-492,-596,325
539,-791,-403
-368,-623,337
-584,621,-727
-598,-851,-651
803,521,779
510,564,-330
-510,-746,342
-863,337,494
308,536,-349
290,-896,741

--- scanner 20 ---
-443,-767,-548
-507,576,850
-568,497,777
-802,816,-814
616,839,712
-813,806,-716
435,444,-575
-517,-462,492
449,489,-588
-884,717,-845
-399,-496,495
832,-741,681
819,-784,526
-359,-702,-475
777,-622,-639
-403,-418,631
821,-620,-735
104,-111,10
-404,570,788
384,336,-640
713,710,724
711,-690,-792
-449,-793,-540
767,-712,541
768,774,772
-69,15,-48

--- scanner 21 ---
396,635,755
-441,773,-515
749,-637,420
17,53,-71
800,-357,-810
744,725,-372
-408,759,-434
454,539,790
729,-777,553
784,749,-389
-763,-823,-648
-786,-771,-568
-432,653,-384
-695,-388,580
-433,732,378
717,-414,-689
-677,-479,579
686,-447,-823
735,-702,373
-608,791,401
460,535,829
-654,-839,-593
-880,-409,595
-21,-116,33
-406,749,432
672,670,-386

--- scanner 22 ---
877,813,447
-554,665,637
863,758,519
-522,712,742
-581,-368,418
-512,724,-454
439,-269,391
-534,595,-571
125,6,154
860,837,407
611,754,-380
705,754,-381
560,-326,474
-19,147,77
-741,-333,495
-760,-510,-504
-676,-524,-619
464,-571,-382
-597,668,-558
-574,859,683
-572,-343,431
426,-359,505
618,894,-321
-651,-505,-369
482,-560,-523
460,-586,-326

--- scanner 23 ---
558,412,431
78,20,44
721,-315,-843
-766,-563,-610
526,614,-815
-315,-604,563
664,514,430
-383,-472,538
604,699,-904
-745,-378,-625
637,-437,406
706,511,382
-675,-581,-609
-404,518,459
-412,440,-509
613,591,-808
802,-376,-726
732,-415,-810
-456,596,-524
-499,449,483
-463,455,-549
595,-613,336
-510,436,449
646,-570,496
-331,-495,618

--- scanner 24 ---
458,-867,457
389,654,-484
751,748,679
746,-849,-605
-715,811,897
-644,-698,-562
523,-881,504
681,545,663
772,563,664
-700,-601,-533
-640,556,-442
-773,-622,-585
-37,25,-24
-923,-584,576
-869,-626,632
383,-861,637
-147,-104,168
803,-932,-726
321,522,-509
-726,711,864
-796,750,780
713,-818,-739
-631,689,-352
-955,-481,593
337,631,-564
-589,513,-282

--- scanner 25 ---
615,532,-575
-720,-384,-668
-379,769,527
416,905,494
890,-504,-433
-471,597,-761
506,804,397
373,-513,517
-493,-833,392
-554,-745,422
-422,-749,490
835,-480,-504
406,-515,531
504,444,-549
166,54,1
-253,681,548
448,867,298
-322,814,552
5,23,-117
-327,652,-769
515,-407,510
-556,-395,-741
667,421,-562
934,-458,-563
-617,-322,-662
-366,684,-758

--- scanner 26 ---
-658,498,-926
548,-363,-518
-466,-409,-409
-646,731,402
-374,-397,-438
-549,-637,714
-662,365,-857
739,-627,532
659,527,-852
-526,-651,727
-591,770,354
651,582,-708
358,458,660
271,336,650
-716,771,359
-534,-420,733
-396,-383,-414
603,-464,-556
766,-737,531
730,-729,671
-6,-26,-17
-637,410,-800
298,474,700
537,-537,-408
648,495,-813

--- scanner 27 ---
-370,576,594
756,-745,848
331,573,-440
521,-759,-580
-641,-479,794
362,-778,-592
581,508,540
-753,386,-329
327,512,-340
684,-758,727
-746,-438,720
-667,-795,-668
-778,415,-523
648,576,476
-867,-744,-678
317,523,-223
579,507,487
804,-753,814
-796,528,-357
-3,-47,5
-460,569,490
420,-652,-617
-501,529,542
-858,-508,754
-690,-695,-617

--- scanner 28 ---
545,732,409
848,671,-609
-531,473,545
-749,-478,-674
353,-601,-696
-444,466,568
477,-404,414
827,656,-424
-10,-37,2
494,772,394
-742,-463,-770
-554,-576,736
757,672,-627
450,-572,502
538,757,550
433,-533,-687
-639,438,-361
-650,471,-461
-522,377,653
370,-349,-719
-555,-446,635
-720,555,-422
-755,-558,-611
-516,-679,627
519,-482,449

--- scanner 29 ---
-306,737,554
668,707,-658
762,-561,-580
-275,836,686
-780,-298,-597
-338,873,547
822,576,779
722,-587,-428
798,639,-660
-687,-852,420
783,591,-723
-273,368,-772
552,-554,685
767,715,674
809,700,743
-354,426,-893
544,-540,747
-740,-801,268
-623,-793,363
673,-554,-562
-792,-422,-570
-376,360,-870
-775,-440,-720
102,21,-46
521,-501,797

--- scanner 30 ---
-695,269,-473
-165,-59,-27
700,-453,443
770,-458,417
-546,-455,-391
-750,-462,725
-784,-558,663
640,683,685
-498,720,420
508,-970,-464
450,315,-737
792,-482,431
520,358,-697
-747,-519,527
-523,-654,-343
575,310,-736
-41,-184,111
529,-844,-376
617,670,671
-439,697,595
504,-901,-331
-595,343,-409
-481,666,393
632,689,454
-639,-591,-391
-691,308,-467

--- scanner 31 ---
822,509,-602
-593,-792,788
-444,772,466
753,599,-549
778,-605,620
839,548,587
-527,713,-678
-687,-555,-826
829,-505,597
795,677,-514
-559,-862,676
-633,-821,571
-566,-542,-754
-447,715,664
778,-648,-490
919,480,596
741,-541,-591
53,-135,-49
-653,-547,-874
-612,684,-847
-410,676,528
839,-556,797
753,-522,-432
902,732,619
-518,758,-724

--- scanner 32 ---
-639,-722,-652
-332,635,547
620,-713,690
-835,-591,489
-513,-602,-673
-458,357,-705
820,393,-452
688,403,-577
-491,-637,-664
378,665,460
692,-749,699
-472,438,-848
355,842,494
357,885,419
-683,-617,449
-505,456,-817
-559,629,573
-433,563,660
-701,-624,538
807,-774,-672
873,-696,-776
92,44,-88
615,-871,752
712,400,-521
862,-589,-645

--- scanner 33 ---
807,-310,365
747,802,-660
-343,494,341
787,845,-590
459,817,455
523,891,555
592,-808,-627
-648,-580,-694
735,-324,420
-705,-621,-855
595,-831,-585
-621,490,-757
10,32,-45
786,850,-715
-345,-372,331
-637,-709,-781
847,-327,341
-404,471,-772
-369,-322,437
-545,463,299
-370,440,358
517,852,551
501,-727,-552
-635,477,-780
-378,-453,317

--- scanner 34 ---
462,-498,474
452,-352,604
486,551,654
398,-507,652
391,-452,-510
-361,-360,604
450,691,662
-753,-639,-758
918,522,-549
98,73,-86
-578,-304,611
469,-395,-661
858,562,-533
477,690,552
945,572,-411
-643,451,317
-498,-404,590
-46,163,-12
-691,745,-453
-767,612,331
-617,740,-667
-673,-746,-693
-718,-713,-712
-687,535,400
-699,828,-602
501,-388,-475

--- scanner 35 ---
542,322,-585
856,657,421
470,-631,749
478,-862,755
410,-873,-387
-592,516,-331
318,-885,-416
-869,530,770
-795,-655,554
797,714,485
-604,-919,-496
-786,-553,693
493,-645,736
518,430,-736
-733,523,802
-35,-86,69
-374,515,-358
-659,-818,-534
-832,391,833
-593,-745,-386
-822,-545,553
340,-899,-392
469,364,-634
-576,487,-339
-84,28,-109
805,809,368

--- scanner 36 ---
-558,471,-344
-709,594,415
723,-703,-309
-655,370,-254
707,-771,-457
414,743,-453
-459,408,-286
401,854,-505
-13,92,44
-730,-535,-625
552,-368,785
584,-748,-326
-838,-481,-656
597,591,528
-447,-287,927
-425,-301,903
388,831,-342
-713,461,484
608,623,489
486,-441,933
-818,-559,-655
-517,-313,932
600,678,633
-120,1,147
497,-267,823
-688,506,541

--- scanner 37 ---
768,-432,-774
-809,-717,-611
662,774,-471
-632,790,746
-492,782,710
65,151,15
454,-533,727
-513,-283,251
-503,-405,338
511,-382,805
-436,704,-546
-631,680,719
-804,-718,-736
447,-347,695
411,732,744
621,717,-632
-449,690,-569
-17,40,-126
849,-523,-699
-430,473,-554
-463,-421,278
557,602,734
566,780,798
872,-526,-741
750,706,-545
-761,-678,-666

--- scanner 38 ---
-662,-665,372
643,910,848
-575,-544,-461
-694,776,-406
-737,621,-419
341,-582,619
757,819,-525
536,-493,-789
368,-637,747
408,-647,694
689,884,770
740,919,765
-638,-818,411
-828,564,788
383,-545,-854
886,807,-622
-573,-640,-417
821,867,-470
-643,-697,-527
-838,618,553
491,-480,-803
-713,-759,430
-52,73,-21
-665,636,-471
-852,712,710

--- scanner 39 ---
-827,583,978
647,521,-591
-480,-628,-720
85,-6,165
364,-715,814
-785,756,-658
662,469,-663
-763,-377,534
-526,-702,-685
571,-660,-778
-577,-384,502
719,-738,-754
464,575,831
-705,573,891
373,-798,717
-689,533,951
-728,-441,424
-571,751,-584
665,-503,-764
476,672,960
-74,20,-10
507,456,-620
416,520,895
39,156,49
399,-720,763
-545,-735,-640
-636,839,-666`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 79;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 465;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 3621;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 12149;
test(func, input, expected, testNum, lowestTest, highestTest);