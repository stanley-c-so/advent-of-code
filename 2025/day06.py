"""

--- Day 6: Trash Compactor ---

After helping the Elves in the kitchen, you were taking a break and helping them re-enact a movie scene when you over-enthusiastically jumped into the garbage chute!

A brief fall later, you find yourself in a garbage smasher. Unfortunately, the door's been magnetically sealed.

As you try to find a way out, you are approached by a family of cephalopods! They're pretty sure they can get the door open, but it will take some time. While you wait, they're curious if you can help the youngest cephalopod with her math homework.

Cephalopod math doesn't look that different from normal math. The math worksheet (your puzzle input) consists of a list of problems; each problem has a group of numbers that need to either be either added (+) or multiplied (*) together.

However, the problems are arranged a little strangely; they seem to be presented next to each other in a very long horizontal list. For example:

123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
Each problem's numbers are arranged vertically; at the bottom of the problem is the symbol for the operation that needs to be performed. Problems are separated by a full column of only spaces. The left/right alignment of numbers within each problem can be ignored.

So, this worksheet contains four problems:

123 * 45 * 6 = 33210
328 + 64 + 98 = 490
51 * 387 * 215 = 4243455
64 + 23 + 314 = 401
To check their work, cephalopod students are given the grand total of adding together all of the answers to the individual problems. In this worksheet, the grand total is 33210 + 490 + 4243455 + 401 = 4277556.

Of course, the actual worksheet is much wider. You'll need to make sure to unroll it completely so that you can read the problems clearly.

Solve the problems on the math worksheet. What is the grand total found by adding together all of the answers to the individual problems?


--- Part Two ---

The big cephalopods come back to check on how things are going. When they see that your grand total doesn't match the one expected by the worksheet, they realize they forgot to explain how to read cephalopod math.

Cephalopod math is written right-to-left in columns. Each number is given in its own column, with the most significant digit at the top and the least significant digit at the bottom. (Problems are still separated with a column consisting only of spaces, and the symbol at the bottom of the problem is still the operator to use.)

Here's the example worksheet again:

123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
Reading the problems right-to-left one column at a time, the problems are now quite different:

The rightmost problem is 4 + 431 + 623 = 1058
The second problem from the right is 175 * 581 * 32 = 3253600
The third problem from the right is 8 + 248 + 369 = 625
Finally, the leftmost problem is 356 * 24 * 1 = 8544
Now, the grand total is 1058 + 3253600 + 625 + 8544 = 3263827.

Solve the problems on the math worksheet again. What is the grand total found by adding together all of the answers to the individual problems?

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

def handle_grid_of_numbers_with_annoying_whitespace_alignment(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  SPACE = ' '


  if part == 1:

    # PARSE INPUT DATA

    def reduce_whitespace_to_one_space(line):
      new_line = []
      for c in line:
        if (not new_line) or c != SPACE or new_line[-1] != SPACE:
          new_line.append(c)
      return ''.join(new_line).strip()

    input_arr = [ reduce_whitespace_to_one_space(line) for line in input_str.split('\n') ]


    # DATA STRUCTURES
    # Each line has had its whitespace reduced thanks to our utility function.
    # Now we can go line by line to see the value of each operand; store operands in a list for each problem

    NUM_PROBLEMS = len(input_arr[0].split(SPACE))
    PROBLEM_DATA = [ [] for _ in range(NUM_PROBLEMS) ]

    for line in input_arr:
      data = [ (x if x in '+*' else int(x)) for x in line.split(SPACE) ]
      assert len(data) == NUM_PROBLEMS, f'ERROR: First line of data has length {NUM_PROBLEMS} but line has length {len(data)}: {data}'
      
      for i in range(NUM_PROBLEMS):
        PROBLEM_DATA[i].append(data[i])


    # ANALYZE

    output = 0

    # Simply iterate through PROBLEM_DATA and apply the operator to the accumulator with each operand
    for problem in PROBLEM_DATA:
      operator = problem[-1]
      if operator == '+':
        accumulator = 0
        for operand in problem[:-1]:
          accumulator += operand
      elif operator == '*':
        accumulator = 1
        for operand in problem[:-1]:
          accumulator *= operand
      else:
        assert False, f'ERROR: Unrecognized operator {operator}'

      # Add result to output
      output += accumulator

    return output

  else:

    # PARSE INPUT DATA

    input_arr = input_str.split('\n')
    num_lines_without_operator = len(input_arr) - 1


    # Pad the last line in case it's shorter than the rest of the lines.
    # (Only matters for the sample input; the actual data seems to have equal length lines.)
    num_spaces_to_append_to_last_line = len(input_arr[0]) - len(input_arr[-1])
    input_arr[-1] += (SPACE * num_spaces_to_append_to_last_line)

    last_line = input_arr[-1]


    # DATA STRUCTURES

    # Every problem's numbers start as early as the operator index, and end as late as 2 before the next operator index,
    # so we definitely need to save the operator index positions to help us keep track of the problem boundaries.
    OPERATOR_INDICES = []
    for i in range(len(last_line)):
      if last_line[i] != SPACE:
        OPERATOR_INDICES.append(i)


    # ANALYZE

    output = 0

    # For each problem...
    for i in range(len(OPERATOR_INDICES)):

      # Init the boundaries, operator, and accumulator
      first_horizontal_index = OPERATOR_INDICES[i]
      last_horizontal_index = (OPERATOR_INDICES[i + 1] - 2) if i < len(OPERATOR_INDICES) - 1 \
                              else (len(last_line) - 1)

      operator = last_line[first_horizontal_index]
      accumulator = None
      if operator == '+':
        accumulator = 0
      elif operator == '*':
        accumulator = 1

      # Go column by column within the problem boundaries to figure out the operand,
      # and then apply the operator to the operand and accumulator
      for col in range(first_horizontal_index, last_horizontal_index + 1):
        operand_list = []
        for row in range(num_lines_without_operator):
          operand_list.append(input_arr[row][col])
        operand = int(''.join(operand_list))

        if operator == '+':
          accumulator += operand
        elif operator == '*':
          accumulator *= operand

      # Add result to output
      output += accumulator

  return output


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = handle_grid_of_numbers_with_annoying_whitespace_alignment
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

sample_input = """123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + """

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 4277556
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 4449991244405
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 3263827
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 9348430857627
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)