"""

--- Day 13: Point of Incidence ---

With your help, the hot springs team locates an appropriate spring which launches you neatly and precisely up to the edge of Lava Island.

There's just one problem: you don't see any lava.

You do see a lot of ash and igneous rock; there are even what look like gray mountains scattered around. After a while, you make your way to a nearby cluster of mountains only to discover that the valley between them is completely full of large mirrors. Most of the mirrors seem to be aligned in a consistent way; perhaps you should head in that direction?

As you move through the valley of mirrors, you find that several of them have fallen from the large metal frames keeping them in place. The mirrors are extremely flat and shiny, and many of the fallen mirrors have lodged into the ash at strange angles. Because the terrain is all one color, it's hard to tell where it's safe to walk or where you're about to run into a mirror.

You note down the patterns of ash (.) and rocks (#) that you see as you walk (your puzzle input); perhaps by carefully analyzing these patterns, you can figure out where the mirrors are!

For example:

#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#

To find the reflection in each pattern, you need to find a perfect reflection across either a horizontal line between two rows or across a vertical line between two columns.

In the first pattern, the reflection is across a vertical line between two columns; arrows on each of the two columns point at the line between the columns:

123456789
    ><   
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.
    ><   
123456789

In this pattern, the line of reflection is the vertical line between columns 5 and 6. Because the vertical line is not perfectly in the middle of the pattern, part of the pattern (column 1) has nowhere to reflect onto and can be ignored; every other column has a reflected column within the pattern and must match exactly: column 2 matches column 9, column 3 matches 8, 4 matches 7, and 5 matches 6.

The second pattern reflects across a horizontal line instead:

1 #...##..# 1
2 #....#..# 2
3 ..##..### 3
4v#####.##.v4
5^#####.##.^5
6 ..##..### 6
7 #....#..# 7

This pattern reflects across the horizontal line between rows 4 and 5. Row 1 would reflect with a hypothetical row 8, but since that's not in the pattern, row 1 doesn't need to match anything. The remaining rows match: row 2 matches row 7, row 3 matches row 6, and row 4 matches row 5.

To summarize your pattern notes, add up the number of columns to the left of each vertical line of reflection; to that, also add 100 multiplied by the number of rows above each horizontal line of reflection. In the above example, the first pattern's vertical line has 5 columns to its left and the second pattern's horizontal line has 4 rows above it, a total of 405.

Find the line of reflection in each of the patterns in your notes. What number do you get after summarizing all of your notes?


--- Part Two ---

You resume walking through the valley of mirrors and - SMACK! - run directly into one. Hopefully nobody was watching, because that must have been pretty embarrassing.

Upon closer inspection, you discover that every mirror has exactly one smudge: exactly one . or # should be the opposite type.

In each pattern, you'll need to locate and fix the smudge that causes a different reflection line to be valid. (The old reflection line won't necessarily continue being valid after the smudge is fixed.)

Here's the above example again:

#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#

The first pattern's smudge is in the top-left corner. If the top-left # were instead ., it would have a different, horizontal line of reflection:

1 ..##..##. 1
2 ..#.##.#. 2
3v##......#v3
4^##......#^4
5 ..#.##.#. 5
6 ..##..##. 6
7 #.#.##.#. 7

With the smudge in the top-left corner repaired, a new horizontal line of reflection between rows 3 and 4 now exists. Row 7 has no corresponding reflected row and can be ignored, but every other row matches exactly: row 1 matches row 6, row 2 matches row 5, and row 3 matches row 4.

In the second pattern, the smudge can be fixed by changing the fifth symbol on row 2 from . to #:

1v#...##..#v1
2^#...##..#^2
3 ..##..### 3
4 #####.##. 4
5 #####.##. 5
6 ..##..### 6
7 #....#..# 7

Now, the pattern has a different horizontal line of reflection between rows 1 and 2.

Summarize your notes as before, but instead use the new different reflection lines. In this example, the first pattern's new horizontal line has 3 rows above it and the second pattern's new horizontal line has 1 row above it, summarizing to the value 400.

In each pattern, fix the smudge and find the different line of reflection. What number do you get after summarizing the new reflection line in each pattern in your notes?


"""

# LIBRARIES
import time
import pathlib
import os
from math import *
from functools import *
from sys import *
from collections import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def find_line_of_symmetry(part, input_str, DEBUG = False):

  # CONSTANTS

  ASH, ROCKS = '.', '#'


  # PARSE INPUT DATA

  input_arr = [ [ [ c for c in row ] for row in block.split('\n') ] for block in input_str.split('\n\n') ]


  # HELPER FUNCTION

  def get_reflection_value(pattern):

    # CONSTANTS
    H, W = len(pattern), len(pattern[0])

    # REFERENCE STRUCTURES
    columns = []
    for c in range(W):
      column = []
      for r in range(H):
        column.append(pattern[r][c])
      columns.append(column)

    rows = pattern

    # INIT
    output = []                                                             # we use a list, because in part 2 we want to support there being multiple answers

    # first try vertical line - line goes AFTER the index
    for c in range(W - 1):
      symmetrical = True
      for i in range(min(c + 1, W - 1 - c)):
        if columns[c - i] != columns[c + 1 + i]:
          symmetrical = False
      if symmetrical:
        output.append(c + 1)

    # then try horizontal line - line goes AFTER the index
    for r in range(H - 1):
      symmetrical = True
      for i in range(min(r + 1, H - 1 - r)):
        if rows[r - i] != rows[r + 1 + i]:
          symmetrical = False
      if symmetrical:
        output.append(100 * (r + 1))

    return output                                                           # NOTE: IN PART 2, WE DO NOT NECESSARILY FIND AN ANSWER, SO OUTPUT MAY BE EMPTY


  # ANALYZE

  if part == 1:                                                             # PART 1: FIND THE REFLECTION VALUE FOR EACH PATTERN

    output = 0
    for pattern in input_arr:
      reflection_values = get_reflection_value(pattern)
      # if len(reflection_values) > 1: assert 0
      assert reflection_values
      output += reflection_values[0]                                        # grab the first answer (it turns out there will only ever be 1 answer)
    return output

  else:                                                                     # PART 2: KEEP SWAPPING ASH/ROCKS UNTIL IT YIELDS AN ALTERNATIVE AXIS OF REFLECTION

    ORIGINAL_REFLECTION_VALUES = []
    for pattern in input_arr:
      ORIGINAL_REFLECTION_VALUES.append(get_reflection_value(pattern)[0])

    if DISPLAY_EXTRA_INFO:
      print(f"Original reflection values for each pattern: {ORIGINAL_REFLECTION_VALUES}")
      print('')

    output = []
    for i in range(len(input_arr)):
      pattern = input_arr[i]
      original_reflection_value = ORIGINAL_REFLECTION_VALUES[i]

      H, W = len(pattern), len(pattern[0])

      new_reflection_values = []

      for r in range(H):
        skip = False
        for c in range(W):
          pattern_copy = [ row.copy() for row in pattern ]
          pattern_copy[r][c] = ASH if pattern_copy[r][c] == ROCKS else ROCKS
          new_reflection_values = list(filter(lambda x: x != original_reflection_value, get_reflection_value(pattern_copy)))
          if new_reflection_values:
            output.append(new_reflection_values[0])
            skip = True
            break
        if skip: break

      assert new_reflection_values
      
    if DISPLAY_EXTRA_INFO:
      print(f"New reflection values for each pattern: {output}")
      print('')
    return sum(output)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = find_line_of_symmetry
skipped_tests = set([ 2, 3, 4, 5 ])
skipped_tests = set([ 3, 4, 5 ])
skipped_tests = set([ 4, 5 ])
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

sample_input = """#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 405
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 31877
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 400
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# THIS IS MY TEST CASE FOR THE EDGE CASE WHERE MY ORIGINAL BUGGY CODE WAS BREAKING EARLY AND NOT CATCHING THE ALTERNATE LINE OF SYMMETRY
# Test case 4
test_input = {
  'part': 2,
  'input_str': """...#.#.#.####.#.#
..###..###..###..
##.###..........#
....####...#..###
...#.#...#..#...#
##...##.##..##.##
###..##.#....#.##
..##.##...##...##
##.##............""",
}
test_expected = 11
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 42996
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)