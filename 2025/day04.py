"""

--- Day 4: Printing Department ---

You ride the escalator down to the printing department. They're clearly getting ready for Christmas; they have lots of large rolls of paper everywhere, and there's even a massive printer in the corner (to handle the really big print jobs).

Decorating here will be easy: they can make their own decorations. What you really need is a way to get further into the North Pole base while the elevators are offline.

"Actually, maybe we can help with that," one of the Elves replies when you ask for help. "We're pretty sure there's a cafeteria on the other side of the back wall. If we could break through the wall, you'd be able to keep moving. It's too bad all of our forklifts are so busy moving those big rolls of paper around."

If you can optimize the work the forklifts are doing, maybe they would have time to spare to break through the wall.

The rolls of paper (@) are arranged on a large grid; the Elves even have a helpful diagram (your puzzle input) indicating where everything is located.

For example:

..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
The forklifts can only access a roll of paper if there are fewer than four rolls of paper in the eight adjacent positions. If you can figure out which rolls of paper the forklifts can access, they'll spend less time looking and more time breaking down the wall to the cafeteria.

In this example, there are 13 rolls of paper that can be accessed by a forklift (marked with x):

..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.
Consider your complete diagram of the paper roll locations. How many rolls of paper can be accessed by a forklift?


--- Part Two ---

Now, the Elves just need help accessing as much of the paper as they can.

Once a roll of paper can be accessed by a forklift, it can be removed. Once a roll of paper is removed, the forklifts might be able to access more rolls of paper, which they might also be able to remove. How many total rolls of paper could the Elves remove if they keep repeating this process?

Starting with the same example as above, here is one way you could remove as many rolls of paper as possible, using highlighted @ to indicate that a roll of paper is about to be removed, and using x to indicate that a roll of paper was just removed:

Initial state:
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.

Remove 13 rolls of paper:
..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.

Remove 12 rolls of paper:
.......x..
.@@.x.x.@x
x@@@@...@@
x.@@@@..x.
.@.@@@@.x.
.x@@@@@@.x
.x.@.@.@@@
..@@@.@@@@
.x@@@@@@@.
....@@@...

Remove 7 rolls of paper:
..........
.x@.....x.
.@@@@...xx
..@@@@....
.x.@@@@...
..@@@@@@..
...@.@.@@x
..@@@.@@@@
..x@@@@@@.
....@@@...

Remove 5 rolls of paper:
..........
..x.......
.x@@@.....
..@@@@....
...@@@@...
..x@@@@@..
...@.@.@@.
..x@@.@@@x
...@@@@@@.
....@@@...

Remove 2 rolls of paper:
..........
..........
..x@@.....
..@@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@x.
....@@@...

Remove 1 roll of paper:
..........
..........
...@@.....
..x@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
...x@.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
....x.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
..........
...x@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...
Stop once no more rolls of paper are accessible by a forklift. In this example, a total of 43 rolls of paper can be removed.

Start with your original diagram. How many rolls of paper in total can be removed by the Elves and their forklifts?

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

def repeatedly_remove_cells_with_insufficient_neighboring_cells(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  

  # INIT

  H, W = len(input_arr), len(input_arr[0])
  ROLL, EMPTY = '@', '.'


  # DATA STRUCTURES

  GRID = [ [ c for c in row ] for row in input_arr]


  # UTILITY FUNCTIONS

  def remove_accessible_rolls():                                                # remove, and return num removed
    to_be_removed = []

    # FIND ROLLS TO BE REMOVED
    for row in range(H):
      for col in range(W):
        if GRID[row][col] == ROLL:
          neighboring_rolls = 0
          for dy in range(-1, 2):
            for dx in range(-1, 2):
              if 0 <= row + dy < H and 0 <= col + dx < W and (dy, dx) != (0, 0) and GRID[row + dy][col + dx] == ROLL:
                neighboring_rolls += 1
          if neighboring_rolls < 4:
            to_be_removed.append((row, col))
    
    if DEBUG and DISPLAY_EXTRA_INFO:

      class bcolors:
        # HEADER = '\033[95m'
        # OKBLUE = '\033[94m'
        # OKCYAN = '\033[96m'
        # OKGREEN = '\033[92m'
        WARNING = '\033[93m'
        FAIL = '\033[91m'
        ENDC = '\033[0m'
        # BOLD = '\033[1m'
        # UNDERLINE = '\033[4m'

      REMOVED = 'x'

      for (row, col) in to_be_removed:
        GRID[row][col] = REMOVED
      for line in GRID:
        line_copy = line.copy()
        for col in range(W):
          if line_copy[col] == REMOVED:
            line_copy[col] = f'{bcolors.FAIL}x{bcolors.ENDC}'
          if line_copy[col] == ROLL:
            line_copy[col] = f'{bcolors.WARNING}@{bcolors.ENDC}'
        print(''.join(line_copy))

    # REMOVE THOSE CELLS
    for (row, col) in to_be_removed:
      GRID[row][col] = EMPTY
    
    return len(to_be_removed)


  # ANALYZE

  if part == 1:                                                                 # PART 1: REMOVE ACCESSIBLE ROLLS ONLY ONCE

    return remove_accessible_rolls()

  else:                                                                         # PART 2: REMOVE ACCESSIBLE ROLLS REPEATEDLY

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')
    TIME_AT_START = time.time()

    output = 0
    while (num_removed := remove_accessible_rolls()):
      output += num_removed

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return output


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = repeatedly_remove_cells_with_insufficient_neighboring_cells
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

sample_input = """..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 13
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1474
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 43
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 8910
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)