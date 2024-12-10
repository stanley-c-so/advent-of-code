"""

--- Day 10: Hoof It ---

You all arrive at a Lava Production Facility on a floating island in the sky. As the others begin to search the massive industrial complex, you feel a small nose boop your leg and look down to discover a reindeer wearing a hard hat.

The reindeer is holding a book titled "Lava Island Hiking Guide". However, when you open the book, you discover that most of it seems to have been scorched by lava! As you're about to ask how you can help, the reindeer brings you a blank topographic map of the surrounding area (your puzzle input) and looks up at you excitedly.

Perhaps you can help fill in the missing hiking trails?

The topographic map indicates the height at each position using a scale from 0 (lowest) to 9 (highest). For example:

0123
1234
8765
9876
Based on un-scorched scraps of the book, you determine that a good hiking trail is as long as possible and has an even, gradual, uphill slope. For all practical purposes, this means that a hiking trail is any path that starts at height 0, ends at height 9, and always increases by a height of exactly 1 at each step. Hiking trails never include diagonal steps - only up, down, left, or right (from the perspective of the map).

You look up from the map and notice that the reindeer has helpfully begun to construct a small pile of pencils, markers, rulers, compasses, stickers, and other equipment you might need to update the map with hiking trails.

A trailhead is any position that starts one or more hiking trails - here, these positions will always have height 0. Assembling more fragments of pages, you establish that a trailhead's score is the number of 9-height positions reachable from that trailhead via a hiking trail. In the above example, the single trailhead in the top left corner has a score of 1 because it can reach a single 9 (the one in the bottom left).

This trailhead has a score of 2:

...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9
(The positions marked . are impassable tiles to simplify these examples; they do not appear on your actual topographic map.)

This trailhead has a score of 4 because every 9 is reachable via a hiking trail except the one immediately to the left of the trailhead:

..90..9
...1.98
...2..7
6543456
765.987
876....
987....
This topographic map contains two trailheads; the trailhead at the top has a score of 1, while the trailhead at the bottom has a score of 2:

10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01
Here's a larger example:

89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
This larger example has 9 trailheads. Considering the trailheads in reading order, they have scores of 5, 6, 5, 3, 1, 3, 5, 3, and 5. Adding these scores together, the sum of the scores of all trailheads is 36.

The reindeer gleefully carries over a protractor and adds it to the pile. What is the sum of the scores of all trailheads on your topographic map?


--- Part Two ---

The reindeer spends a few minutes reviewing your hiking trail map before realizing something, disappearing for a few minutes, and finally returning with yet another slightly-charred piece of paper.

The paper describes a second way to measure a trailhead called its rating. A trailhead's rating is the number of distinct hiking trails which begin at that trailhead. For example:

.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....
The above map has a single trailhead; its rating is 3 because there are exactly three distinct hiking trails which begin at that position:

.....0.   .....0.   .....0.
..4321.   .....1.   .....1.
..5....   .....2.   .....2.
..6....   ..6543.   .....3.
..7....   ..7....   .....4.
..8....   ..8....   ..8765.
..9....   ..9....   ..9....
Here is a map containing a single trailhead with rating 13:

..90..9
...1.98
...2..7
6543456
765.987
876....
987....
This map contains a single trailhead with rating 227 (because there are 121 distinct hiking trails that lead to the 9 on the right edge and 106 that lead to the 9 on the bottom edge):

012345
123456
234567
345678
4.6789
56789.
Here's the larger example from before:

89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
Considering its trailheads in reading order, they have ratings of 20, 24, 10, 4, 1, 4, 5, 8, and 5. The sum of all trailhead ratings in this larger example topographic map is 81.

You're not sure how, but the reindeer seems to have crafted some tiny flags out of toothpicks and bits of paper and is using them to mark trailheads on your topographic map. What is the sum of the ratings of all trailheads?

"""

# LIBRARIES
import time
import pathlib
import os
from math import *
from functools import *
from sys import *
from collections import *
from queue import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

"""
Surprisingly, no optimization required. Even with the input data, the naive BFS is lightning fast!
"""
def paths_from_0_through_9_on_a_grid(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  GRID = [ [ (n if n == '.' else int(n)) for n in row ] for row in input_arr ]


  # CONSTANTS

  H, W = len(GRID), len(GRID[0])

  DELTAS = (+1, 0), (-1, 0), (0, +1), (0, -1)

  TRAILHEAD = 0
  PEAK = 9


  # INIT

  trailheads = []
  for row in range(H):
    for col in range(W):
      if GRID[row][col] == TRAILHEAD:
        trailheads.append((row, col))

  total_score = 0                                                                 # for part 1
  total_rating = 0                                                                # for part 2


  # ANALYZE

  for trailhead in trailheads:
    peaks = set()                                                                 # for part 1
    rating = 0                                                                    # for part 2

    Q = deque()
    Q.append((*trailhead, TRAILHEAD))
    while Q:
      (r, c, h) = Q.popleft()
      if h == PEAK:
        peaks.add((r, c))                                                         # for part 1
        rating += 1                                                               # for part 2
      else:
        for dy, dx in DELTAS:
          new_r = r + dy
          new_c = c + dx
          if 0 <= new_r < H and 0 <= new_c < W and GRID[new_r][new_c] == h + 1:
            Q.append((new_r, new_c, h + 1))

    total_score += len(peaks)                                                     # for part 1
    total_rating += rating                                                        # for part 2

  if part == 1: return total_score                                                # PART 1: SCORE: NUMBER OF UNIQUE PEAKS REACHABLE FROM EACH TRAILHEAD
  else:         return total_rating                                               # PART 2: RATING: NUMBER OF UNIQUE PATHS TO A PEAK FROM EACH TRAILHEAD


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = paths_from_0_through_9_on_a_grid
skipped_tests = set([ 2, 3, 4 ])
skipped_tests = set([ 3, 4 ])
skipped_tests = set([ 4 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732"""

sample_input2 = """...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9"""

sample_input3 = """..90..9
...1.98
...2..7
6543456
765.987
876....
987...."""

sample_input4 = """10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01"""

sample_input5 = """.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9...."""

sample_input6 = """..90..9
...1.98
...2..7
6543456
765.987
876....
987...."""

sample_input7 = """012345
123456
234567
345678
4.6789
56789."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 36
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 4
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': sample_input4,
  'DEBUG': True,
}
test_expected = 1 + 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 582
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 81
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input5,
  'DEBUG': True,
}
test_expected = 3
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input6,
  'DEBUG': True,
}
test_expected = 13
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input7,
  'DEBUG': True,
}
test_expected = 121 + 106
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 1302
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)