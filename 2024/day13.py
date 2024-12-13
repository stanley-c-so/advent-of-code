"""

--- Day 13: Claw Contraption ---

Next up: the lobby of a resort on a tropical island. The Historians take a moment to admire the hexagonal floor tiles before spreading out.

Fortunately, it looks like the resort has a new arcade! Maybe you can win some prizes from the claw machines?

The claw machines here are a little unusual. Instead of a joystick or directional buttons to control the claw, these machines have two buttons labeled A and B. Worse, you can't just put in a token and play; it costs 3 tokens to push the A button and 1 token to push the B button.

With a little experimentation, you figure out that each machine's buttons are configured to move the claw a specific amount to the right (along the X axis) and a specific amount forward (along the Y axis) each time that button is pressed.

Each machine contains one prize; to win the prize, the claw must be positioned exactly above the prize on both the X and Y axes.

You wonder: what is the smallest number of tokens you would have to spend to win as many prizes as possible? You assemble a list of every machine's button behavior and prize location (your puzzle input). For example:

Button A: X+94, Y+34
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
Prize: X=18641, Y=10279
This list describes the button configuration and prize location of four different claw machines.

For now, consider just the first claw machine in the list:

Pushing the machine's A button would move the claw 94 units along the X axis and 34 units along the Y axis.
Pushing the B button would move the claw 22 units along the X axis and 67 units along the Y axis.
The prize is located at X=8400, Y=5400; this means that from the claw's initial position, it would need to move exactly 8400 units along the X axis and exactly 5400 units along the Y axis to be perfectly aligned with the prize in this machine.
The cheapest way to win the prize is by pushing the A button 80 times and the B button 40 times. This would line up the claw along the X axis (because 80*94 + 40*22 = 8400) and along the Y axis (because 80*34 + 40*67 = 5400). Doing this would cost 80*3 tokens for the A presses and 40*1 for the B presses, a total of 280 tokens.

For the second and fourth claw machines, there is no combination of A and B presses that will ever win a prize.

For the third claw machine, the cheapest way to win the prize is by pushing the A button 38 times and the B button 86 times. Doing this would cost a total of 200 tokens.

So, the most prizes you could possibly win is two; the minimum tokens you would have to spend to win all (two) prizes is 480.

You estimate that each button would need to be pressed no more than 100 times to win a prize. How else would someone be expected to play?

Figure out how to win as many prizes as possible. What is the fewest tokens you would have to spend to win all possible prizes?


--- Part Two ---

As you go to win the first prize, you discover that the claw is nowhere near where you expected it would be. Due to a unit conversion error in your measurements, the position of every prize is actually 10000000000000 higher on both the X and Y axis!

Add 10000000000000 to the X and Y position of every prize. After making this change, the example above would now look like this:

Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=10000000008400, Y=10000000005400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=10000000012748, Y=10000000012176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=10000000007870, Y=10000000006450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=10000000018641, Y=10000000010279
Now, it is only possible to win a prize on the second and fourth claw machines. Unfortunately, it will take many more than 100 presses to do so.

Using the corrected prize coordinates, figure out how to win as many prizes as possible. What is the fewest tokens you would have to spend to win all possible prizes?

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