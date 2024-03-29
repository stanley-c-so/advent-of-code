/*

--- Day 4: Giant Squid ---

You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.

Maybe it wants to play bingo?

Bingo is played on a set of boards each consisting of a 5x5 grid of numbers. Numbers are chosen at random, and the chosen number is marked on all boards on which it appears. (Numbers may not appear on all boards.) If all numbers in any row or any column of a board are marked, that board wins. (Diagonals don't count.)

The submarine has a bingo subsystem to help passengers (currently, you and the giant squid) pass the time. It automatically generates a random order in which to draw numbers and a random set of boards (your puzzle input). For example:

7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7

After the first five numbers are drawn (7, 4, 9, 5, and 11), there are no winners, but the boards are marked as follows (shown here adjacent to each other to save space):

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7

After the next six numbers are drawn (17, 23, 2, 0, 14, and 21), there are still no winners:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7

Finally, 24 is drawn:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7

At this point, the third board wins because it has at least one complete row or column of marked numbers (in this case, the entire top row is marked: 14 21 17 24 4).

The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.

To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?


--- Part Two ---

On the other hand, it might be wise to try a different strategy: let the giant squid win.

You aren't sure how many bingo boards a giant squid could play at once, so rather than waste time counting its arms, the safe thing to do is to figure out which board will win last and choose that one. That way, no matter which boards it picks, it will win for sure.

In the above example, the second board is the last to win, which happens after 13 is eventually called and its middle column is completely marked. If you were to keep playing until this point, the second board would have a sum of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

Figure out which board will win last. Once it wins, what would its final score be?

*/

function bingo (part, inputStr) {

  // PARSE DATA
  const inputArr = inputStr
    .split('\n\n')                                  // split on double line breaks to separate the blocks
    .map((block, i) => {

      return !i ? block.split(',').map(n => +n)     // first element is always a line of comma-separated draw numbers... split them and convert strings into numbers
        : block                                     // remaining elements are bingo boards..
            .split('\n')                            // split them into individual lines
            .map(row => row
              .split('  ')                          // one digit numbers have an extra space before them, so split on double spaces first...
              .join(' ')                            // ...replacing them with single splaces
              .split(' ')                           // then, split on single spaces to separate numbers
              .filter(n => n)                       // if a line begins with a single digit number, there will be an extra empty element in the front after the split, so filter those out
              .map(n => +n));                       // finally, convert strings into numbers
  });

  // INIT
  const X = 'X';
  const boardLength = 5;
  const draw = inputArr[0];
  const boards = inputArr.slice(1);
  const numBoards = boards.length;
  let numBoardsRemaining = numBoards;

  // PREPROCESSING: CREATE DICTIONARIES FOR EACH BOARD TO MARK WHAT NUMBERS EXIST AND WHERE THEY ARE LOCATED
  const boardDicts = boards.map(board => {
    const dict = {};
    for (let row = 0; row < boardLength; ++row) {
      for (let col = 0; col < boardLength; ++col) {
        dict[board[row][col]] = [row, col];
      }
    }
    return dict;
  });

  // PREPROCESSING: TRACK SUMS OF UNMARKED NUMBERS FOR EACH BOARD
  const boardSums = boards.map(board => board.reduce((sum, row) => sum + row.reduce((total, n) => total + n), 0));

  // PREPROCESSING: TRACK WHICH BOARDS HAVE ALREADY WON SO WE DON'T NEED TO ANALYZE THEM
  const alreadyWon = Array(numBoards).fill(false);

  // UTILITY FUNCTION
  function checkForWin(board, currRow, currCol) {       // currRow and currCol represent the num that was just picked - we only need to check that row and col for a win
    let rowComplete = true;
    for (let row = 0; row < boardLength; ++row) {
      if (board[row][currCol] !== X) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) return true;
    
    let colComplete = true;
    for (let col = 0; col < boardLength; ++col) {
      if (board[currRow][col] !== X) {
        colComplete = false;
        break;
      }
    }
    return colComplete;
  }

  // RUN SIMULATION
  for (const num of draw) {
    for (let i = 0; i < numBoards; ++i) {
      if (alreadyWon[i]) continue;                      // PART 2: skip a board that has already won
      const board = boards[i];
      const dict = boardDicts[i];
      if (num in dict) {                                // if the drawn num is found on this board...
        const [row, col] = dict[num];
        board[row][col] = X;                            // ...mark the coords on that board with 'X'...
        boardSums[i] -= num;                            // ...subtract the drawn num from the running total of unmarked nums for that board...
        if (checkForWin(board, row, col)) {             // ...and check for a win:
          if (
            part === 1                                  // PART 1: stop at the first winning board
            || part === 2 && numBoardsRemaining === 1   // PART 2: stop at the last winning board
          ) return boardSums[i] * num;                  // (ASSUMING ONLY ONE BOARD WINS AT A TIME) upon finding a win for YOUR board, return relevant data
          alreadyWon[i] = true;                         // part 2: if your board not yet found, mark this board as finished...
          --numBoardsRemaining;                         // ...and decrement the number of boards remaining
        }
      }
    }
  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = bingo;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

const actualInput = `31,50,79,59,39,53,58,95,92,55,40,97,81,22,69,26,6,23,3,29,83,48,18,75,47,49,62,45,35,34,1,88,54,16,56,77,28,94,52,15,0,87,93,90,60,67,68,85,80,51,20,96,61,66,63,91,8,99,70,13,71,17,7,38,44,43,5,25,72,2,57,33,82,78,89,21,30,11,73,84,4,46,14,19,12,10,42,32,64,98,9,74,86,27,24,65,37,41,76,36

31  5 70  8 88
38 63 14 91 56
22 67 17 47 74
93 52 69 29 53
33 66 64 19 73

35 63 17 48 77
25 58 33 14 96
32 87 90 66 70
16  4 98 72 23
19 74 39 29 59

40 29 44 17 27
56 98 83 62 70
25 91 20 60 84
42 66 34 77 31
16  8  6 50 28

13  6 58 39 74
 3 15 69  5 23
81 65  0 85 93
72  7 60 42 52
45 64 47 53 67

94 21 67  0 14
 2 75 77 15 78
38 25 49 99 92
76 35 69  4 64
42 96 86 84 70

46  7 74 65 80
99 12  4 38 77
30 90 78 94 21
22 15 72 52 57
11 67 59  3  9

18 17 63 53 96
16 76 55  5 92
33 82 60 51  8
29 99 87 95 58
88 15 75 61 21

10 24 79 28 90
64 43 21 48 99
45 85 80 71 94
68 39 57 50 72
47 60  3 62 49

82 92 58 16 89
76 90 74 61 29
 2 72 43 69 23
84 38  0  4 55
 5 64 49 78 94

79 60 28 45 95
47  2 93 89 77
56 18 54 97 33
55 91 68 58 90
87 37 88 35 10

42 76 25 15 38
 6 34 33 88 30
43 10 27 26 72
78 66 62 14 37
 1 65 95 54  5

14  0 46 72 75
83  2 62 76 26
65 85 19 18 95
57 45 87 51 29
32 37 61 34 43

 9 75 56 60 50
53 81 41 55 11
86 54 29 85  2
92  6 97 46 84
 5  0 70  3 82

 3 15 61 94 85
62  7 12 10 45
84 66 18 33 86
91 19 11 22 39
57 16 80 26  9

 1 69 46 98 61
19  7 63 56 90
 9  3 66 38 73
40 49 72  0 94
42 23 75 89 32

33 59 17 15 86
62 96 84  2 18
27 63 55  3 82
 0 89 19 73 24
56 93 12 87 41

31 56 33  3  9
55 52 87 57 30
44 89  6  5 65
15 53 62 51 11
61 35 13  4 46

15 84 95 88 65
96 18 93 14 21
49 40 46  1 30
50 64 69 80 81
 3 19 87  9 38

71 68 18 81 41
95 26 45 24 25
42 73 62 36 94
 5 61 98 99 48
31 55  8  1 88

 0 73 19 12  4
72 22 27 59 48
71 26 28 66 37
54 87  8  2 65
20 60 35 32 29

44 41 93 76 47
24 33 15 14 61
78 49 81 67 52
74 73 54 23 66
75 10 18  3 60

94 95 52 23 10
55 14 35 44 56
 0 49 50 60 79
59 54 90 67 46
17 81  4 37 58

38 29  8 79 77
91 98  1 68 30
86 13 95 46 61
55 36 90 42 97
69  7  0 93 27

82  5 67 40  3
61 16 56 68 29
55 20 13 15  0
75 28 45 17 77
86 85 10  2 26

98 73 72 43 17
32 41 56 46 76
85  7 31 69 91
86 21 37 40 82
33 57 15 39 30

83 18 90 75 29
17 73 32 88 50
51 99  5 23 22
60 47 35 42  2
37 86 82 14 30

17 47  7 54  0
65 83 33 11 57
85 16 27 75 61
60 90 44 69 81
71 73 38 46 28

57 79 76 91 99
96 20 13 34 52
 0 21  5 47 63
60 62 55 29 71
44 59 58 78 65

83 30  7  1 80
90  2 11 41 92
 3 27 33 10 78
63 75  0 38 86
96 76 87 67  6

63 19 42 56 12
35 89 87 13 81
21 23  4 16 11
64 78 25 92 33
41 10 66 68 99

56 76 37 18 41
38 27 17 50 14
60 23  0  6  1
 9  8 30 93 44
58 99 16 46 26

40 77  4 96 68
55 21 30 24 76
81 58 41 91 98
56 46 20 78  0
82 29 87 67 53

59 33  4 18 95
 2 52 54 96 19
46 72  3 43 81
20 97 87 55 53
 9 80 84 76 29

 2 25 44 64 46
93 35 17 84 67
14 48 21 73 90
89 62 53 54 52
38 59 69 45 50

71 96 56 57 72
47 39 25 15 90
29 65 44  3 83
36 30 92 59 95
97 86 48 74 94

51 91 75 25 28
72 56  9 21 93
88 32 58 24 37
82 48 95 53 23
68 20 43 84 69

68 75 33 39 96
 0 65 45 27 53
36 71  2 91 97
10 82 44 41  7
11 42 17 26 14

61 36 56  6 64
72 10 62 77 21
99 73 37 38 25
60  7 44 43 14
81 59 29 19 92

63 49 13 31 56
59 76 62 83 44
69 24 57 40 91
20 41  2 55  9
50 60 46 15 52

87 90 97 53 23
85 67  7 71 98
 1 22 48 82 69
15 21 17 91 80
99 57 28 94 79

24 25 44 95 99
55 97  9 18 27
71 37 13 52 39
30  3 79 14 28
81 62 98 22 31

49 90 17 65  4
59 42 15 14 54
91 55 67 58  8
13 61 79 32 99
92 28 16 72 20

73 47 39 94 45
93 53 95 71 27
66 40 65 37 58
15 61 63 50 55
57  8 99 90 85

 6 45 79  9 14
82 12 42 38 15
31 71 48  5 96
35 81 25 63 19
 2 90 64 22 33

62 56 60 29 63
47 33 75 77 76
86  7 90 34 46
85  3  0 16 65
71 44 11 40 52

18 19 73 67 64
66 85 37 10 51
62 46 11 40 35
83 69 57  1 78
81 48 36  6 22

99  0 41 81 52
68 31 27 30  5
12 62 54 43 50
58 36 10 55 86
61 69 97 22 49

59 18 91 86 90
87 20 57 61 42
15 99 31 32 73
23 89 64 96 49
79 47 97 19 51

17 46 19 20 58
67 29  4  8 22
52 18 13 34 70
82 73 71 95 47
35 28 33 42 62

15 16 78 99 74
61 81 84 72 69
12 11 17 62 94
76 63 96 42 98
89 64 10 32 18

18 21 63 89 14
95  5 79 19 11
29 82 77 59 90
13  3 31 46 45
80 37 97 78 61

75  9 94 11 80
93 27 10  2 82
89 32 64 52 60
42 56 23 20 18
70 78 45 76 40

16 98  0 94 73
28 13 48 90 11
30 43 20  9 78
14 39 89  4  6
15 63 91 45 37

41 55 44  2 39
38 14 19 72 64
75 95 35  6 47
70  7  1 29 86
83 79 90 96 82

32 29 42 60  3
85 93 16 41 35
11 90 46 13 58
26 19 79 30 86
72 56 63 18 95

25 71 26 35 59
80 21 11 24 87
48 29 64 66 34
74 83 84 60 57
44 30 95 20 32

29 60 31  2  7
51 78 32 45 14
70  6 59 33 81
16 26 11 38 88
49 74 39 46  3

58 91 95 21 47
61 52 30  2 96
83 19 89  9  1
41 64 28 23 11
62 55 43 60 53

81 15 33  4 19
51 97 88 70 13
76 38 58 28 82
67  3  6 22 47
57 41 53 31 79

29 42 12 64 86
23  0 14 28 82
99 63 79  9 17
75 73  3 45  1
93 52 43 54 76

15 70 19  3 44
47 60 46 93 59
16 87 41 30 68
88  9 26 45 43
28 49 73 98 78

57 30 65 22 25
99 21 36 47 11
70 83 31 73 16
61 77 94 93 23
91 26 13 87 63

13 58 63  4 82
 5 89 11 39 51
12 43 75 97  8
15 56 21  0 74
23 66 62 70 44

37 25 82 80 86
58 89 30 91 38
75 40 87 50 67
78  4 55  0 39
54 64 52 96 45

61 57 42 74 26
88 48  8 13 70
81 69  7 97 10
16 23 18 55 36
11 46 68 39 27

37 85 59 41  2
 3 29 91 87 84
65 18 70 78 12
 9 80 97 19 24
 1 75 58 13 92

62  8 80 34 86
72  6 40 57  3
85 82 48 84 37
79 29 70 21 96
41  5 33 32 94

58 21 50  7 72
34 71 93 35 90
77 43 79 55 88
57 12 45 95 70
38  9 29 37 52

57 26  2 22 98
87  4 53 17 97
75 25 70 62 93
 3  9 86 33 28
58 50 72 27  5

16 15 71 64 94
37 56 84 32  7
54 99 73 20  8
60 19 22 70 27
69 83 79 48 77

94 38  0 31 19
43 58 22 93 84
 2 88 56 13 50
90 68 46 95 47
32 59 89 42 69

94 60 26 63 86
21 64 81 47 71
36 32 93 20 67
16 10 68 39 74
75 99 82 27 18

24 31 35 82 18
49 16 98 90 26
 8 64 25 87 92
54 76  2 22 15
 7 50 44 94 68

 1 31 72 28 18
76 93 20  4 16
35 54 49 30 10
59 32 53 62 84
99 52 92 75 25

 1 75 51 22 90
61 83 58 63 28
 9  5 85 43 92
69  8 62 93 48
84 31 21 82 78

99  6 70 73 75
65 53 29 31 16
78 61 37 90  7
54 64 20 35  4
97 44  1 10  3

73 50 53 24 49
15 56 94 82 39
31 40 65 79 44
92 70 57 95 30
21 74 55  3 64

44 42 78 31 37
33 69 71 24 81
12  7 23  8 30
10  9 11 68 29
93 28 94 63 87

87 53 75 85  0
34 52 37 49 28
11 72  2 86 62
66 17 61 46 45
13 96 18 99 29

50 76 71 10 92
 4 99 46 39 86
23 94 12 73 40
 5 70 96 43 51
55 61 67 18 15

51 88 97 58 33
36 12 90 53 85
86  5 42  6  2
95 57 19 34 17
26  1 77 78 20

61 17 79 97 10
29 65 21 55 63
19 88 74 62  6
73 76 89 33 31
50 30 12 22 39

18 94 15 17 26
69 37 91 30 85
13 67 25 84 58
95 90 27 82 33
20 56 62  4 65

58 19 17 83 89
14 82 48 36 97
 5 46 20 50 57
60 92 52 85  9
95 34 31 53 73

89 47  3 15 21
 2 10 59 76 36
 5 24 14 30 72
37 77 57 48 91
16  9 73 94 26

62  1 32 85  9
13 52 75 34 84
93 24 95 51 90
86 35 22 72 38
 0 46 96 88  7

67 80 84 34  4
39 11 37 47 82
29 63 57 86 77
78 64  5 32 96
38 69 55 87 50

91 26 89 87 54
51 43 22 68 21
74 62 88 38 53
28 92  4 39 40
96 97 73 72 29

40 83 35  5 91
41 45 57 94 60
61 31 59 47 95
81 89 69 25 33
 3 36 15 93 27

19 49 37 14 48
96 55 43  6 12
22 21 50 47 75
78 40 51 91 63
59 87 28 93 86

86 44  3 54 17
71 82 70 88 49
14 43 63 76 15
78 81 61 22 46
84 65  9 29 83

15 28  5 45 29
12 19 64 93 48
83 40  7 99 74
20 30 85 67 58
22 21 59 76 18

42  1 46  8 62
69 27 67 68 38
88 35 83 14 84
53 85 82 29 59
61 73 39 74 99

38 32 50  9 74
75 66 63  3 62
68 15 17 98  6
81 29 52 88 21
58  2 87 96 56

49 12 26 89 98
92 69 90 50 35
74 40  0 87 48
19 47 65 42 31
17  3 33 28 85

47 64 43 73 81
32 49 65 42 24
95 93 36 78 62
34 96 79 10  4
39 54 15 17 51

53 32 41 16 95
54 47 56 69 17
31  0 42 66 13
88  9 43 38 79
21  8 19 98 92

78 43 38 75 14
36 62 64 45 53
31 96 16 46 44
93 11 57 56 65
27  3 73 74 68

66 23 39 13 58
40 85 68 50 57
97 37 77 28 83
48 29 51 84 91
95  1 70 78 56

51 74 68 89 91
49 54  8 83 36
86 65 99 28 47
82 57 32 81 58
13 66  3 94 67`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 4512;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 25410;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 1924;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2730;
test(func, input, expected, testNum, lowestTest, highestTest);