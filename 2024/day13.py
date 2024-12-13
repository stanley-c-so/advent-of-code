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
from queue import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def find_whole_number_combination_of_additions_to_match_target(part, input_str, DEBUG = False):

  # CONSTANTS

  BUTTON_A_TOKEN_COST = 3
  BUTTON_B_TOKEN_COST = 1

  PART_2_ERROR = 10000000000000                                                           # in part 2, we add this value to the target X and Y values


  # PARSE INPUT DATA AND ANALYZE

  total = 0

  input_arr = input_str.split('\n\n')
  for machine_data in input_arr:
    data = machine_data.split('\n')

    A_values = [ int(d.split('+')[1]) for d in data[0].split(': ')[1].split(', ') ]       # e.g. if "Button A: X+94, Y+34" then this is [ 94, 34 ]
    [ Xa, Ya ] = A_values
    B_values = [ int(d.split('+')[1]) for d in data[1].split(': ')[1].split(', ') ]       # e.g. if "Button B: X+22, Y+67" then this is [ 22, 67 ]
    [ Xb, Yb ] = B_values
    T_values = [ int(d.split('=')[1]) for d in data[2].split(': ')[1].split(', ') ]       # e.g. if "Prize: X=8400, Y=5400" then this is [ 8400, 5400 ]
    [ Xt, Yt ] = T_values

                                                                                          # PART 1: NO FURTHER CHANGE TO TARGET X AND Y VALUES
    if part == 2:                                                                         # PART 2: INCREASE EACH TARGET X AND Y VALUE BY 10000000000000
      Xt += PART_2_ERROR
      Yt += PART_2_ERROR

    ### SHOW YOUR WORK ###

    # Given:
    # A(Xa) + B(Xb) = Xt
    #   e.g. A(94) + B(22) = 8400
    # A(Ya) + B(Yb) = Yt
    #   e.g. A(34) + B(67) = 5400

    # Isolate A and express it in terms of B in equation 1:
    # A = (Xt - Xb*B) / Xa
    #   e.g. A = (8400 - B(22)) / 94
    
    # Substitute new definition of A into equation 2:
    # ((Xt - Xb*B) / Xa)(Ya) + B(Yb) = Yt
    #   e.g. ((8400 - B(22)) / 94)(34) + B(67) = 5400

    # Isolate and solve for B:
    # (Xt - Xb*B)*Ya + B(Yb)(Xa) = (Yt)(Xa)
    # => (Xt*Ya) - Xb*Ya*B + Xa*Yb*B = Yt*Xa
    # => B = (Xt*Ya - Yt*Xa) / (Xb*Ya - Xa*Yb)
    #   e.g. (34*8400 - 22*34*B)/94 + 67B = 5400
    #        => (34*8400 - 22*34*B) + 6298B = 507600
    #        => 285600 - 507600 = (748 - 6298)B
    #        => B = 222000 / 5550
    #             = 40

    # Solve for A:
    # A = (Xt - Xb*B) / Xa
    #   e.g. A = (8400 - 40*22) / 94
    #          = 7520 / 94
    #          = 80

    B = (Xt * Ya - Yt * Xa) / (Xb * Ya - Xa * Yb)

    A = (Xt - Xb * B) / Xa

    valid_A = A == floor(A)
    valid_B = B == floor(B)
    valid = valid_A and valid_B

    token_cost = floor(A * BUTTON_A_TOKEN_COST + B * BUTTON_B_TOKEN_COST) if valid else 0

    if valid:                                                                             # since division is involved, a machine is unbeatable if
                                                                                          # the division does not result in a whole number quotient
      total += token_cost

    if DISPLAY_EXTRA_INFO:

      class bcolors:
        # HEADER = '\033[95m'
        # OKBLUE = '\033[94m'
        # OKCYAN = '\033[96m'
        OKGREEN = '\033[92m'
        # WARNING = '\033[93m'
        FAIL = '\033[91m'
        ENDC = '\033[0m'
        # BOLD = '\033[1m'
        # UNDERLINE = '\033[4m'
      
      print(f"A = {bcolors.OKGREEN if valid_A else bcolors.FAIL}{floor(A) if valid_A else A}{bcolors.ENDC}")
      print(f"B = {bcolors.OKGREEN if valid_B else bcolors.FAIL}{floor(B) if valid_B else B}{bcolors.ENDC}")
      print(f"Valid machine? {bcolors.OKGREEN if valid else bcolors.FAIL}{valid}{bcolors.ENDC}")
      print(f"Token cost for machine: {bcolors.OKGREEN if valid else bcolors.FAIL}{token_cost}{bcolors.ENDC}")
      print(f"")

  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = find_whole_number_combination_of_additions_to_match_target
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

sample_input = """Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 480
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 36870
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 875318608908
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 78101482023732
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)