"""

--- Day 5: Cafeteria ---

As the forklifts break through the wall, the Elves are delighted to discover that there was a cafeteria on the other side after all.

You can hear a commotion coming from the kitchen. "At this rate, we won't have any time left to put the wreaths up in the dining hall!" Resolute in your quest, you investigate.

"If only we hadn't switched to the new inventory management system right before Christmas!" another Elf exclaims. You ask what's going on.

The Elves in the kitchen explain the situation: because of their complicated new inventory management system, they can't figure out which of their ingredients are fresh and which are spoiled. When you ask how it works, they give you a copy of their database (your puzzle input).

The database operates on ingredient IDs. It consists of a list of fresh ingredient ID ranges, a blank line, and a list of available ingredient IDs. For example:

3-5
10-14
16-20
12-18

1
5
8
11
17
32
The fresh ID ranges are inclusive: the range 3-5 means that ingredient IDs 3, 4, and 5 are all fresh. The ranges can also overlap; an ingredient ID is fresh if it is in any range.

The Elves are trying to determine which of the available ingredient IDs are fresh. In this example, this is done as follows:

Ingredient ID 1 is spoiled because it does not fall into any range.
Ingredient ID 5 is fresh because it falls into range 3-5.
Ingredient ID 8 is spoiled.
Ingredient ID 11 is fresh because it falls into range 10-14.
Ingredient ID 17 is fresh because it falls into range 16-20 as well as range 12-18.
Ingredient ID 32 is spoiled.
So, in this example, 3 of the available ingredient IDs are fresh.

Process the database file from the new inventory management system. How many of the available ingredient IDs are fresh?


--- Part Two ---

The Elves start bringing their spoiled inventory to the trash chute at the back of the kitchen.

So that they can stop bugging you when they get new inventory, the Elves would like to know all of the IDs that the fresh ingredient ID ranges consider to be fresh. An ingredient ID is still considered fresh if it is in any range.

Now, the second section of the database (the available ingredient IDs) is irrelevant. Here are the fresh ingredient ID ranges from the above example:

3-5
10-14
16-20
12-18
The ingredient IDs that these ranges consider to be fresh are 3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, and 20. So, in this example, the fresh ingredient ID ranges consider a total of 14 ingredient IDs to be fresh.

Process the database file again. How many ingredient IDs are considered to be fresh according to the fresh ingredient ID ranges?

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

def overlapping_intervals(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  [ fresh_range_data, id_strs ] = input_str.split('\n\n')

  FRESH_RANGES = []
  for fresh_range in fresh_range_data.split('\n'):
    [left, right] = [ int(terminal) for terminal in fresh_range.split('-') ]
    FRESH_RANGES.append([left, right])

  IDS_TO_CHECK = [ int(id_str) for id_str in id_strs.split('\n') ]


  # ANALYZE

  if part == 1:                                                                 # PART 1: CHECK IDs AGAINST INTERVALS

    output = 0
    for id in IDS_TO_CHECK:
      for [left, right] in FRESH_RANGES:
        if left <= id <= right:
          output += 1
          break
    return output

  else:                                                                         # PART 2: MERGE OVERLAPPING INTERVALS

    FRESH_RANGES.sort(key=lambda interval: interval[0])
    NEW_FRESH_RANGES = []
    for interval in FRESH_RANGES:
      if NEW_FRESH_RANGES and interval[0] <= (NEW_FRESH_RANGES[-1][1] + 1):     # merge even if interval[0] == prev_interval[1] + 1
                                                                                # (though this wouldn't affect answer if you didn't merge it)
        NEW_FRESH_RANGES[-1][1] = max(NEW_FRESH_RANGES[-1][1], interval[1])
      else:
        NEW_FRESH_RANGES.append(interval)

    output = 0
    for interval in NEW_FRESH_RANGES:
      output += (interval[1] - interval[0] + 1)
    return output


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = overlapping_intervals
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

sample_input = """3-5
10-14
16-20
12-18

1
5
8
11
17
32"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 3
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 770
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 14
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 357674099117260
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)