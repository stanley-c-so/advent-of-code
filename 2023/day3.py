"""

--- Day 3: Gear Ratios ---

You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?


--- Part Two ---

The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?


"""

# LIBRARIES
import time
import pathlib
import os
from math import *
from functools import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def analyze_symbols_near_numbers(part, input_str, DEBUG = False):

  # DATA STRUCTURES
  
  numbers_data = []
  gears_data = {}

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  H, W = len(input_arr), len(input_arr[0])

  for row in range(H):
    start_idx = None
    line = input_arr[row]
    for i in range(W):
      is_digit = line[i].isdigit()
      if is_digit and start_idx == None:                              # found start of new number
        start_idx = i
      if start_idx != None and (i == W - 1 or not is_digit):          # found end of current number
        numbers_data.append({
          'start_idx': start_idx,
          'end_idx': i if is_digit else i - 1,
          'row': row,
          'num': int(line[start_idx : (i + 1 if is_digit else i)]),
        })
        start_idx = None
    assert start_idx == None


  # CONSTANTS

  EMPTY = '.'
  GEAR = '*'


  # HELPER FUNCTIONS

  def is_part_num(data):
    start_idx = data['start_idx']
    end_idx = data['end_idx']
    row = data['row']

    check_start_idx = max(start_idx - 1, 0)
    check_end_idx = min(end_idx + 1, W - 1)

    # check line above
    if row > 0:
      for i in range(check_start_idx, check_end_idx + 1):
        if input_arr[row - 1][i] != EMPTY:
          return True

    # check same line, before and after
    if check_start_idx > 0 and input_arr[row][check_start_idx] != EMPTY:
      return True
    if check_end_idx < W - 1 and input_arr[row][check_end_idx] != EMPTY:
      return True

    # check line below
    if row < H - 1:
      for i in range(check_start_idx, check_end_idx + 1):
        if input_arr[row + 1][i] != EMPTY:
          return True

    return False

  def get_pos_of_adjacent_gear(data):
    start_idx = data['start_idx']
    end_idx = data['end_idx']
    row = data['row']

    check_start_idx = max(start_idx - 1, 0)
    check_end_idx = min(end_idx + 1, W - 1)

    output = []

    # check line above
    if row > 0:
      for i in range(check_start_idx, check_end_idx + 1):
        if input_arr[row - 1][i] == GEAR:
          output.append((row - 1, i))

    # check same line, before and after
    if check_start_idx > 0 and input_arr[row][check_start_idx] == GEAR:
      output.append((row, check_start_idx))
    if check_end_idx < W - 1 and input_arr[row][check_end_idx] == GEAR:
      output.append((row, check_end_idx))

    # check line below
    if row < H - 1:
      for i in range(check_start_idx, check_end_idx + 1):
        if input_arr[row + 1][i] == GEAR:
          output.append((row + 1, i))

    # NOTE: THE PROBLEM NEVER PROMISES THAT A NUMBER WILL BE ADJACENT TO AT MOST ONE GEAR.
    # MY SOLUTION SUPPORTS THE POSSIBILITY THAT A NUMBER CAN BE NEXT TO MULTIPLE GEARS.
    # HOWEVER, OUT OF CURIOSITY I PUT IN THIS ASSERT AND I SEE THAT A NUMBER IS NEVER ADJACENT TO MORE THAN ONE GEAR.
    assert len(output) <= 1

    return output


  # ANALYZE

  if part == 1:

    # add up data for numbers that are adjacent to at least 1 symbol
    sum = 0
    for data in numbers_data:
      if is_part_num(data):
        sum += data['num']
    return sum

  else:

    # STEP 1: gather data on adjacent gears
    for data in numbers_data:                                       # run through all numbers
      for gear_loc in get_pos_of_adjacent_gear(data):
        if gear_loc not in gears_data: gears_data[gear_loc] = []
        gears_data[gear_loc].append(data['num'])                    # ...file the current number under that gear's location

    # STEP 2: add up data for gears with exactly 2 adjacent numbers
    sum = 0
    for gear_loc in gears_data:
      if len(gears_data[gear_loc]) == 2:
        sum += gears_data[gear_loc][0] * gears_data[gear_loc][1]
    return sum

# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_symbols_near_numbers
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
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598.."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 4361
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 553079
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 467835
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 84363105
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)