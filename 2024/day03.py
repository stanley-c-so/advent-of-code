"""

--- Day 3: Mull It Over ---

"Our computers are having issues, so I have no idea if we have any Chief Historians in stock! You're welcome to check the warehouse, though," says the mildly flustered shopkeeper at the North Pole Toboggan Rental Shop. The Historians head out to take a look.

The shopkeeper turns to you. "Any chance you can see why our computers are having issues again?"

The computer appears to be trying to run a program, but its memory (your puzzle input) is corrupted. All of the instructions have been jumbled up!

It seems like the goal of the program is just to multiply some numbers. It does that with instructions like mul(X,Y), where X and Y are each 1-3 digit numbers. For instance, mul(44,46) multiplies 44 by 46 to get a result of 2024. Similarly, mul(123,4) would multiply 123 by 4.

However, because the program's memory has been corrupted, there are also many invalid characters that should be ignored, even if they look like part of a mul instruction. Sequences like mul(4*, mul(6,9!, ?(12,34), or mul ( 2 , 4 ) do nothing.

For example, consider the following section of corrupted memory:

xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
Only the four highlighted sections are real mul instructions. Adding up the result of each instruction produces 161 (2*4 + 5*5 + 11*8 + 8*5).

Scan the corrupted memory for uncorrupted mul instructions. What do you get if you add up all of the results of the multiplications?


--- Part Two ---

As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

There are two new instructions you'll need to handle:

The do() instruction enables future mul instructions.
The don't() instruction disables future mul instructions.
Only the most recent do() or don't() instruction applies. At the beginning of the program, mul instructions are enabled.

For example:

xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
This corrupted memory is similar to the example from before, but this time the mul(5,5) and mul(11,8) instructions are disabled because there is a don't() instruction before them. The other mul instructions function normally, including the one at the end that gets re-enabled by a do() instruction.

This time, the sum of the results is 48 (2*4 + 8*5).

Handle the new instructions; what do you get if you add up all of the results of just the enabled multiplications?

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

def search_string_for_uncorrupted_commands(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  MUL_COMMAND = 'mul('
  DIGITS = '0123456789'                                                                                 # expect both factors to consist of digits
  COMMA = ','                                                                                           # expect a comma to separate two factors
  CLOSE_PARENS = ')'                                                                                    # expect a close parens to follow factor2

  # ANALYZE

  instructions = input_str                                                                              # PART 1: regular instructions

  if part == 2:                                                                                         # PART 2: apply do() and don't() commands
    DO_COMMAND = 'do()'
    DONT_COMMAND = "don't()"
    do_splits = input_str.split(DO_COMMAND)                                                             # note: mul() is enabled at the start
    splits_after_removing_dont_segments = [ segment.split(DONT_COMMAND)[0] for segment in do_splits ]   # anything after first segment is disabled!
    instructions = ''.join(splits_after_removing_dont_segments)

  total = 0

  for segment in instructions.split(MUL_COMMAND):
    factor1 = []
    factor2 = []
    curr_factor = factor1                                                                               # start on factor1...
    error = False
    found_close_parens = False

    for c in segment:
      if c in DIGITS:
        curr_factor.append(c)
      elif c == COMMA:
        curr_factor = factor2                                                                           # ...and switch to factor2 on finding comma
      elif c == CLOSE_PARENS:                                                                           # close parens ends the segment
        found_close_parens = True
        break
      else:                                                                                             # non-digit, non-comma, non-close is a fail
        error = True
        break
    
    if len(factor1) == 0 or len(factor2) == 0 or not found_close_parens:                                # not having both factors or close parens is a fail
      error = True

    if not error:
      total += int(''.join(factor1)) * int(''.join(factor2))

  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = search_string_for_uncorrupted_commands
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

sample_input = """xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"""
sample_input2 = """xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 161
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 170807108
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 48
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 74838033
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)