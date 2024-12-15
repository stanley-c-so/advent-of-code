"""

--- Day 8: Resonant Collinearity ---

You find yourselves on the roof of a top-secret Easter Bunny installation.

While The Historians do their thing, you take a look at the familiar huge antenna. Much to your surprise, it seems to have been reconfigured to emit a signal that makes people 0.1% more likely to buy Easter Bunny brand Imitation Mediocre Chocolate as a Christmas gift! Unthinkable!

Scanning across the city, you find that there are actually many such antennas. Each antenna is tuned to a specific frequency indicated by a single lowercase letter, uppercase letter, or digit. You create a map (your puzzle input) of these antennas. For example:

............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
The signal only applies its nefarious effect at specific antinodes based on the resonant frequencies of the antennas. In particular, an antinode occurs at any point that is perfectly in line with two antennas of the same frequency - but only when one of the antennas is twice as far away as the other. This means that for any pair of antennas with the same frequency, there are two antinodes, one on either side of them.

So, for these two antennas with frequency a, they create the two antinodes marked with #:

..........
...#......
..........
....a.....
..........
.....a....
..........
......#...
..........
..........
Adding a third antenna with the same frequency creates several more antinodes. It would ideally add four antinodes, but two are off the right side of the map, so instead it adds only two:

..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......#...
..........
..........
Antennas with different frequencies don't create antinodes; A and a count as different frequencies. However, antinodes can occur at locations that contain antennas. In this diagram, the lone antenna with frequency capital A creates no antinodes but has a lowercase-a-frequency antinode at its location:

..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......A...
..........
..........
The first example has antennas with two different frequencies, so the antinodes they create look like this, plus an antinode overlapping the topmost A-frequency antenna:

......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.
Because the topmost A-frequency antenna overlaps with a 0-frequency antinode, there are 14 total unique locations that contain an antinode within the bounds of the map.

Calculate the impact of the signal. How many unique locations within the bounds of the map contain an antinode?


--- Part Two ---

Watching over your shoulder as you work, one of The Historians asks if you took the effects of resonant harmonics into your calculations.

Whoops!

After updating your model, it turns out that an antinode occurs at any grid position exactly in line with at least two antennas of the same frequency, regardless of distance. This means that some of the new antinodes will occur at the position of each antenna (unless that antenna is the only one of its frequency).

So, these three T-frequency antennas now create many antinodes:

T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........
In fact, the three T-frequency antennas are all exactly in line with two antennas, so they are all also antinodes! This brings the total number of antinodes in the above example to 9.

The original example now has 34 antinodes, including the antinodes that appear on every antenna:

##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##
Calculate the impact of the signal using this updated model. How many unique locations within the bounds of the map contain an antinode?

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

def find_points_collinear_with_pairings_of_key_points(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # CONSTANTS

  H, W = len(input_arr), len(input_arr[0])

  EMPTY = '.'


  # UTILITY

  def in_bounds(coords):
    (r, c) = coords
    return 0 <= r < H and 0 <= c < W


  # DATA STRUCTURES

  ANTENNA_COORDS_BY_SYMBOL = {}
  for row in range(H):
    for col in range(W):
      if input_arr[row][col] == EMPTY: continue
      symbol = input_arr[row][col]
      if symbol not in ANTENNA_COORDS_BY_SYMBOL:
        ANTENNA_COORDS_BY_SYMBOL[symbol] = []
      ANTENNA_COORDS_BY_SYMBOL[symbol].append((row, col))


  # ANALYZE

  TIME_AT_START = time.time()
  
  antinode_coords = set()

  for coords in ANTENNA_COORDS_BY_SYMBOL.values():                    # the antenna freqs (symbols) themselves are never needed - just their locations

    # iterate through every possible pairing of antenna coords
    for i in range(len(coords) - 1):
      for j in range(i + 1, len(coords)):
        coords1 = coords[i]
        coords2 = coords[j]
        dy = coords2[0] - coords1[0]
        dx = coords2[1] - coords1[1]

        # NOTE: what if dy and dx have a GCD > 1? then in part 2, the distance between antinodes would be smaller than the distance
        # between the two antennae. there would be antinodes between them, and similarly a lot more not between them.
        # i suppose this would also of interest in part 1, but for the part of the description that says:
        # "This means that for any pair of antennas with the same frequency, there are two antinodes, one on either side of them."
        # nevertheless, i will leave this block here.
        GCD = gcd(dy, dx)
        if GCD > 1:
          print('confirm whether any distances can be simplified')
          assert 0                                                    # it turns out that my data has no such pair where GCD > 1
        dy = dy // GCD
        dx = dx // GCD

        if part == 1:                                                 # PART 1: only 2 antinodes: at points where distance to one
                                                                      # antenna is twice that of distance to other

          # antinode closer to coords1
          antinode1 = (coords1[0] - dy, coords1[1] - dx)
          if in_bounds(antinode1): antinode_coords.add(antinode1)

          # antinode closer to coords2
          antinode2 = (coords2[0] + dy, coords2[1] + dx)
          if in_bounds(antinode2): antinode_coords.add(antinode2)

        else:                                                         # PART 2: ALL coords that line up with any pair of antennae
                                                                      # is an antinode

          # antinodes closer to coords1
          (r, c) = coords1
          while in_bounds((r, c)):
            antinode_coords.add((r, c))
            r -= dy
            c -= dx

          # antinodes closer to coords1
          (r, c) = coords2
          while in_bounds((r, c)):
            antinode_coords.add((r, c))
            r += dy
            c += dx

  if DISPLAY_EXTRA_INFO:
    ANTINODE = '#'
    for row in range(H):
      line = []
      for col in range(W):
        symbol = input_arr[row][col]
        line.append(symbol if symbol != EMPTY else ANTINODE if (row, col) in antinode_coords else EMPTY)
      print(' '.join(line))

  return len(antinode_coords)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = find_points_collinear_with_pairings_of_key_points
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

sample_input = """............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 14
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 369
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 34
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1169
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)