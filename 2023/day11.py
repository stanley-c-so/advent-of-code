"""

--- Day 11: Cosmic Expansion ---

You continue following signs for "Hot Springs" and eventually come across an observatory. The Elf within turns out to be a researcher studying cosmic expansion using the giant telescope here.

He doesn't know anything about the missing machine parts; he's only visiting for this research project. However, he confirms that the hot springs are the next-closest area likely to have people; he'll even take you straight there once he's done with today's observation analysis.

Maybe you can help him with the analysis to speed things up?

The researcher has collected a bunch of data and compiled the data into a single giant image (your puzzle input). The image includes empty space (.) and galaxies (#). For example:

...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....

The researcher is trying to figure out the sum of the lengths of the shortest path between every pair of galaxies. However, there's a catch: the universe expanded in the time it took the light from those galaxies to reach the observatory.

Due to something involving gravitational effects, only some space expands. In fact, the result is that any rows or columns that contain no galaxies should all actually be twice as big.

In the above example, three columns and two rows contain no galaxies:

   v  v  v
 ...#......
 .......#..
 #.........
>..........<
 ......#...
 .#........
 .........#
>..........<
 .......#..
 #...#.....
   ^  ^  ^

These rows and columns need to be twice as big; the result of cosmic expansion therefore looks like this:

....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......

Equipped with this expanded universe, the shortest path between every pair of galaxies can be found. It can help to assign every galaxy a unique number:

....1........
.........2...
3............
.............
.............
........4....
.5...........
............6
.............
.............
.........7...
8....9.......

In these 9 galaxies, there are 36 pairs. Only count each pair once; order within the pair doesn't matter. For each pair, find any shortest path between the two galaxies using only steps that move up, down, left, or right exactly one . or # at a time. (The shortest path between two galaxies is allowed to pass through another galaxy.)

For example, here is one of the shortest paths between galaxies 5 and 9:

....1........
.........2...
3............
.............
.............
........4....
.5...........
.##.........6
..##.........
...##........
....##...7...
8....9.......

This path has length 9 because it takes a minimum of nine steps to get from galaxy 5 to galaxy 9 (the eight locations marked # plus the step onto galaxy 9 itself). Here are some other example shortest path lengths:

    Between galaxy 1 and galaxy 7: 15
    Between galaxy 3 and galaxy 6: 17
    Between galaxy 8 and galaxy 9: 5

In this example, after expanding the universe, the sum of the shortest path between all 36 pairs of galaxies is 374.

Expand the universe, then find the length of the shortest path between every pair of galaxies. What is the sum of these lengths?


--- Part Two ---

The galaxies are much older (and thus much farther apart) than the researcher initially estimated.

Now, instead of the expansion you did before, make each empty row or column one million times larger. That is, each empty row should be replaced with 1000000 empty rows, and each empty column should be replaced with 1000000 empty columns.

(In the example above, if each empty row or column were merely 10 times larger, the sum of the shortest paths between every pair of galaxies would be 1030. If each empty row or column were merely 100 times larger, the sum of the shortest paths between every pair of galaxies would be 8410. However, your universe will need to expand far beyond these values.)

Starting with the same initial image, expand the universe according to these new rules, then find the length of the shortest path between every pair of galaxies. What is the sum of these lengths?


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

def manhattan_distance_with_expanding_empty_space(part, input_str, DEBUG = False, factor = 2):

  # CONSTANTS

  GALAXY, SPACE = '#', '.'


  # UTILITY

  def manhattan_distance(r1, c1, r2, c2):
    return abs(r2 - r1) + abs(c2 - c1)


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  H = len(input_arr)
  W = len(input_arr[0])


  # DATA STRUCTURES

  # Create map
  MAP = [ [c for c in row] for row in input_arr ]
  
  # Create and populate collection of galaxies
  GALAXIES = []
  for r in range(H):
    for c in range(W):
      if MAP[r][c] == GALAXY:
        GALAXIES.append((r, c))

  # Create and populate collection of empty rows and cols
  EMPTY_ROWS = []
  EMPTY_COLS = []
  for r in range(H):
    if all([x == SPACE for x in MAP[r]]):
      EMPTY_ROWS.append(r)
  for c in range(W):
    if all([MAP[r][c] == SPACE for r in range(H)]):
      EMPTY_COLS.append(c)


  # ANALYZE

  total = 0

  for i in range(len(GALAXIES) - 1):
    for j in range(i + 1, len(GALAXIES)):

      # Add basic manhattan distance
      r1, c1 = GALAXIES[i]
      r2, c2 = GALAXIES[j]
      total += manhattan_distance(r1, c1, r2, c2)

      # Account for expansion of empty rows and cols
      for r in EMPTY_ROWS:
        if r1 < r < r2:                                   # NOTE: r1 < r2, since galaxies were discovered in row order
          total += (factor - 1)                           # don't forget to subtract 1!
      for c in EMPTY_COLS:
        if min(c1, c2) < c < max(c1, c2):                 # NOTE: c1 may not be less than c2
          total += (factor - 1)                           # don't forget to subtract 1!

  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = manhattan_distance_with_expanding_empty_space
skipped_tests = set([ 2, 3, 4, 5 ])
skipped_tests = set([ 3, 4, 5 ])
skipped_tests = set([ 5 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#....."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 374
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 9723824
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'factor': 10,
}
test_expected = 1030
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'factor': 100,
}
test_expected = 8410
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'factor': 1000000,
}
test_expected = 731244261352
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)