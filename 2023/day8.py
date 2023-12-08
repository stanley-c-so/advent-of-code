"""

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

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

def NAME_OF_FUNC_HERE(part, input_str, DEBUG = False):

  # DATA STRUCTURE

  DATA = {}


  # PARSE INPUT DATA

  [ INSTRUCTIONS, DATA_STR ] = input_str.split('\n\n')  
  for line in DATA_STR.split('\n'):
    split = line.split(' = ')
    key = split[0]
    left_and_right_split = split[1].split(', ')
    left = left_and_right_split[0][1:]
    right = left_and_right_split[1][:-1]
    DATA[key] = { 'L': left, 'R': right }


  # ANALYZE

  LIMIT = maxsize

  if part == 1:

    steps = 0
    idx = 0
    node = 'AAA'
    while steps < LIMIT:
      if node == 'ZZZ': return steps
      node = DATA[node][INSTRUCTIONS[idx]]
      idx = (idx + 1) % len(INSTRUCTIONS)
      steps += 1

    print('STEPS EXCEEDED LIMIT')
    assert(False)

  else:

    # find all start nodes

    node_list = []
    for line in DATA_STR.split('\n'):
      split = line.split(' = ')
      key = split[0]
      if key[-1] == 'A':
        node_list.append(key)


    # for each node, find period of repeat

    periods = {}

    for node in node_list:
      periods[node] = {}
      steps = 0
      idx = 0
      curr_node = node
      while steps < LIMIT:
        if curr_node[-1] == 'Z':
          periods[node][curr_node] = steps
        if (curr_node in periods[node]):

          # NOTE: IT SEEMS THAT, COINCIDENTALLY (I THINK?) BOTH IN THE SAMPLE DATA AND IN THE REAL DATA,
          # THE NUMBER OF STEPS IT TAKES TO GO FROM A TO THE FIRST Z NODE IS EQUAL TO THE NUMBER OF STEPS
          # IT TAKES TO GO FROM THE FIRST Z NODE BACK TO ITSELF. (ALSO, EACH A NODE UNIQUELY VISITS ONLY
          # ONE UNIQUE Z NODE.) IF THESE THINGS WERE NOT TRUE, THIS SOLUTION WOULD NEED TO BE TWEAKED.
          # HOWEVER, I HAVE INSPECTED THE DATA WITH THE FOLLOWING AND CONFIRMED THIS TO BE THE CASE.
          if DISPLAY_EXTRA_INFO:
            print(f'ANALYZING {node}:')
            print(f'Total steps on first Z node to repeat: {steps}')
            print(f'Steps from A to first Z: {periods[node][curr_node]}')
            print('---')
            
          break
        curr_node = DATA[curr_node][INSTRUCTIONS[idx]]
        idx = (idx + 1) % len(INSTRUCTIONS)
        steps += 1
      
      if steps == LIMIT:
        print('STEPS EXCEEDED LIMIT')
        assert(False)
    
    if DISPLAY_EXTRA_INFO: print(periods)

    # UTILITY FUNCTIONS

    # uses Euclidean algorithm (https://en.wikipedia.org/wiki/Euclidean_algorithm)
    # credit to Phrogz (https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction)
    def GCD(num, denom):
      num = abs(num)
      denom = abs(denom)
      return GCD(denom, num % denom) if denom else num

    # credit to w3resource (https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php)
    def LCM(num1, num2):
      return 0 if (not num1 or not num2) else abs((num1 * num2) // GCD(num1, num2))


    # FIND LCM OF ALL PERIODS

    steps_list = [ list(periods[start_node].values())[0] for start_node in periods ]
    if DISPLAY_EXTRA_INFO:
      for i in range(len(node_list)):
        print(f"{node_list[i]}: {steps_list[i]} steps")

    return reduce(lambda x, y: LCM(x, y), steps_list)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
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

sample_input = """RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)"""

sample_input2 = """LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 17263
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 6
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 14631604759649
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)