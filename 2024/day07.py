"""

--- Day 7: Bridge Repair ---

The Historians take you to a familiar rope bridge over a river in the middle of a jungle. The Chief isn't on this side of the bridge, though; maybe he's on the other side?

When you go to cross the bridge, you notice a group of engineers trying to repair it. (Apparently, it breaks pretty frequently.) You won't be able to cross until it's fixed.

You ask how long it'll take; the engineers tell you that it only needs final calibrations, but some young elephants were playing nearby and stole all the operators from their calibration equations! They could finish the calibrations if only someone could determine which test values could possibly be produced by placing any combination of operators into their calibration equations (your puzzle input).

For example:

190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
Each line represents a single equation. The test value appears before the colon on each line; it is your job to determine whether the remaining numbers can be combined with operators to produce the test value.

Operators are always evaluated left-to-right, not according to precedence rules. Furthermore, numbers in the equations cannot be rearranged. Glancing into the jungle, you can see elephants holding two different types of operators: add (+) and multiply (*).

Only three of the above equations can be made true by inserting operators:

190: 10 19 has only one position that accepts an operator: between 10 and 19. Choosing + would give 29, but choosing * would give the test value (10 * 19 = 190).
3267: 81 40 27 has two positions for operators. Of the four possible configurations of the operators, two cause the right side to match the test value: 81 + 40 * 27 and 81 * 40 + 27 both equal 3267 (when evaluated left-to-right)!
292: 11 6 16 20 can be solved in exactly one way: 11 + 6 * 16 + 20.
The engineers just need the total calibration result, which is the sum of the test values from just the equations that could possibly be true. In the above example, the sum of the test values for the three equations listed above is 3749.

Determine which equations could possibly be true. What is their total calibration result?


--- Part Two ---

The engineers seem concerned; the total calibration result you gave them is nowhere close to being within safety tolerances. Just then, you spot your mistake: some well-hidden elephants are holding a third type of operator.

The concatenation operator (||) combines the digits from its left and right inputs into a single number. For example, 12 || 345 would become 12345. All operators are still evaluated left-to-right.

Now, apart from the three equations that could be made true using only addition and multiplication, the above example has three more equations that can be made true by inserting operators:

156: 15 6 can be made true through a single concatenation: 15 || 6 = 156.
7290: 6 8 6 15 can be made true using 6 * 8 || 6 * 15.
192: 17 8 14 can be made true using 17 || 8 + 14.
Adding up all six test values (the three that could be made before using only + and * plus the new three that can now be made by also using ||) produces the new total calibration result of 11387.

Using your new knowledge of elephant hiding spots, determine which equations could possibly be true. What is their total calibration result?

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
SOLUTION 1:

Backtracking. Naturally allows trying every possible permutation of operations between operands.
"""
def try_every_possible_permutation(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # ANALYZE

  TIME_AT_START = time.time()
  if part == 2 and not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

  total = 0

  for line in input_arr:
    [LS, RS] = line.split(': ')
    answer = int(LS)
    operands = [ int(n) for n in RS.split(' ') ]
    
    # visited = set()                                                                     # this actually slows it down. there are few collisions, apparently
    found_answer = False                                                                  # stops further recursion once a valid answer is found

    # backtrack
    def go(i, curr):                                                                      # curr is the running total, already including num at i
      nonlocal found_answer
      if found_answer or curr > answer: return                                            # micro-optimization: discontinue if curr is already too big
      # if (i, curr) in visited: return                                                   # see note above
      # visited.add((i, curr))                                                            # see note above

      # base case
      if i == len(operands) - 1:
        if curr == answer: found_answer = True                                            # if running total matches answer, set found_answer flag. else, no-op

      # recursive case
      else:
        next_num = operands[i + 1]
        go(i + 1, curr + next_num)                                                        # PARTS 1 AND 2: try + as an operator
        go(i + 1, curr * next_num)                                                        # PARTS 1 AND 2: try * as an operator
        if part == 2:                                                                     # PART 2 ONLY: try || as an operator (concatenating running total with next num)
          new_num = int(str(curr) + str(next_num))
          go(i + 1, new_num)


    go(0, operands[0])                                                                    # init curr with first operand, operands[0]
    if found_answer: total += answer

  if part == 2 and not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~1.45 seconds
  return total


"""
SOLUTION 2:

No backtracking. Instead, recognize that there are k permutations of operations, where k == base ** num_of_operators
(where base is the number of operator types - i.e. 2 in part 1, or 3 in part 2). Each number from 0 through k-1 maps
to one of these permutations by being converted into base-num_of_operators form, such that the digit 0 represents +,
the digit 1 represents *, and the digit 2 represents ||.

MUCH slower than solution 1 - probably because it's taking longer to generate the base representations for each permutation.
"""
def try_every_possible_permutation2(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # UTILITY

  # REF: https://stackoverflow.com/questions/2267362/how-to-convert-an-integer-to-a-string-in-any-base
  def baseN(num, b, numerals="0123456789abcdefghijklmnopqrstuvwxyz"):
    return ((num == 0) and numerals[0]) or (baseN(num // b, b, numerals).lstrip(numerals[0]) + numerals[num % b])


  # ANALYZE

  TIME_AT_START = time.time()
  if part == 2 and not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

  total = 0

  for line in input_arr:
    [LS, RS] = line.split(': ')
    answer = int(LS)
    operands = [ int(n) for n in RS.split(' ') ]

    num_of_operator_types = 2 if part == 1 else 3                                         # PARTS 1 AND 2: try + or * as operators
                                                                                          # PART 2 ONLY: try || as an operator (concatenating running total with next num)
    base = num_of_operator_types

    num_of_operators = len(operands) - 1

    for k in range(base ** num_of_operators):
      curr = operands[0]
      base_representation = baseN(k, base).zfill(num_of_operators)                        # use representation of every possible k to designate a permutation
      for i in range(len(base_representation)):
        if curr > answer: break                                                           # micro-optimization: discontinue if curr is already too big
        digit = base_representation[i]
        next_num = operands[i + 1]
        if digit == '0':                                                                  # represents +
          curr += next_num
        elif digit == '1':                                                                # represents *
          curr *= next_num
        elif digit == '2':                                                                # represents || (PART 2 ONLY)
          curr = int(str(curr) + str(next_num))
        else:
          assert False

      if curr == answer:
        total += answer
        break

  if part == 2 and not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~23.87 seconds
  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = try_every_possible_permutation
# func = try_every_possible_permutation2
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

sample_input = """190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 3749
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 20281182715321
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 11387
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 159490400628354
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)