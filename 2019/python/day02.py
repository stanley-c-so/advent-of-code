"""

--- Day 2: 1202 Program Alarm ---

On the way to your gravity assist around the Moon, your ship computer beeps angrily about a "1202 program alarm". On the radio, an Elf is already explaining how to handle the situation: "Don't worry, that's perfectly norma--" The ship computer bursts into flames.

You notify the Elves that the computer's magic smoke seems to have escaped. "That computer ran Intcode programs like the gravity assist program it was working on; surely there are enough spare parts up there to build a new Intcode computer!"

An Intcode program is a list of integers separated by commas (like 1,0,0,3,99). To run one, start by looking at the first integer (called position 0). Here, you will find an opcode - either 1, 2, or 99. The opcode indicates what to do; for example, 99 means that the program is finished and should immediately halt. Encountering an unknown opcode means something went wrong.

Opcode 1 adds together numbers read from two positions and stores the result in a third position. The three integers immediately after the opcode tell you these three positions - the first two indicate the positions from which you should read the input values, and the third indicates the position at which the output should be stored.

For example, if your Intcode computer encounters 1,10,20,30, it should read the values at positions 10 and 20, add those values, and then overwrite the value at position 30 with their sum.

Opcode 2 works exactly like opcode 1, except it multiplies the two inputs instead of adding them. Again, the three integers after the opcode indicate where the inputs and outputs are, not their values.

Once you're done processing an opcode, move to the next one by stepping forward 4 positions.

For example, suppose you have the following program:

1,9,10,3,2,3,11,0,99,30,40,50
For the purposes of illustration, here is the same program split into multiple lines:

1,9,10,3,
2,3,11,0,
99,
30,40,50
The first four integers, 1,9,10,3, are at positions 0, 1, 2, and 3. Together, they represent the first opcode (1, addition), the positions of the two inputs (9 and 10), and the position of the output (3). To handle this opcode, you first need to get the values at the input positions: position 9 contains 30, and position 10 contains 40. Add these numbers together to get 70. Then, store this value at the output position; here, the output position (3) is at position 3, so it overwrites itself. Afterward, the program looks like this:

1,9,10,70,
2,3,11,0,
99,
30,40,50
Step forward 4 positions to reach the next opcode, 2. This opcode works just like the previous, but it multiplies instead of adding. The inputs are at positions 3 and 11; these positions contain 70 and 50 respectively. Multiplying these produces 3500; this is stored at position 0:

3500,9,10,70,
2,3,11,0,
99,
30,40,50
Stepping forward 4 more positions arrives at opcode 99, halting the program.

Here are the initial and final states of a few more small programs:

1,0,0,0,99 becomes 2,0,0,0,99 (1 + 1 = 2).
2,3,0,3,99 becomes 2,3,0,6,99 (3 * 2 = 6).
2,4,4,5,99,0 becomes 2,4,4,5,99,9801 (99 * 99 = 9801).
1,1,1,4,99,5,6,0,99 becomes 30,1,1,4,2,5,6,0,99.
Once you have a working computer, the first step is to restore the gravity assist program (your puzzle input) to the "1202 program alarm" state it had just before the last computer caught fire. To do this, before running the program, replace position 1 with the value 12 and replace position 2 with the value 2. What value is left at position 0 after the program halts?


--- Part Two ---

"Good, the new computer seems to be working correctly! Keep it nearby during this mission - you'll probably use it again. Real Intcode computers support many more features than your new one, but we'll let you know what they are as you need them."

"However, your current priority should be to complete your gravity assist around the Moon. For this mission to succeed, we should settle on some terminology for the parts you've already built."

Intcode programs are given as a list of integers; these values are used as the initial state for the computer's memory. When you run an Intcode program, make sure to start by initializing memory to the program's values. A position in memory is called an address (for example, the first value in memory is at "address 0").

Opcodes (like 1, 2, or 99) mark the beginning of an instruction. The values used immediately after an opcode, if any, are called the instruction's parameters. For example, in the instruction 1,2,3,4, 1 is the opcode; 2, 3, and 4 are the parameters. The instruction 99 contains only an opcode and has no parameters.

The address of the current instruction is called the instruction pointer; it starts at 0. After an instruction finishes, the instruction pointer increases by the number of values in the instruction; until you add more instructions to the computer, this is always 4 (1 opcode + 3 parameters) for the add and multiply instructions. (The halt instruction would increase the instruction pointer by 1, but it halts the program instead.)

"With terminology out of the way, we're ready to proceed. To complete the gravity assist, you need to determine what pair of inputs produces the output 19690720."

The inputs should still be provided to the program by replacing the values at addresses 1 and 2, just like before. In this program, the value placed in address 1 is called the noun, and the value placed in address 2 is called the verb. Each of the two input values will be between 0 and 99, inclusive.

Once the program has halted, its output is available at address 0, also just like before. Each time you try a pair of inputs, make sure you first reset the computer's memory to the values in the program (your puzzle input) - in other words, don't reuse memory from a previous attempt.

Find the input noun and verb that cause the program to produce the output 19690720. What is 100 * noun + verb? (For example, if noun=12 and verb=2, the answer would be 1202.)

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

def intcode(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  PROGRAM = [ int(n) for n in input_str.split(',') ]


  # UTILITY

  def in_bounds(idx, PROGRAM):
    return 0 <= idx < len(PROGRAM)

  def simulate(PROGRAM):

    ptr = 0
    while in_bounds(ptr, PROGRAM):

      opcode = PROGRAM[ptr]

      if opcode == 1:
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)
        assert in_bounds(ptr + 3, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # address to read addend1
        param2 = PROGRAM[ptr + 2]                                   # address to read addend2
        param3 = PROGRAM[ptr + 3]                                   # address to write sum

        res = PROGRAM[param1] + PROGRAM[param2]
        PROGRAM[param3] = res

        ptr += 4

      elif opcode == 2:
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)
        assert in_bounds(ptr + 3, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # address to read factor1
        param2 = PROGRAM[ptr + 2]                                   # address to read factor2
        param3 = PROGRAM[ptr + 3]                                   # address to write product

        res = PROGRAM[param1] * PROGRAM[param2]
        PROGRAM[param3] = res
        
        ptr += 4

      elif opcode == 99:
        return PROGRAM

      else:
        assert False, f"UNRECOGNIZED OPCODE: {opcode}"

    assert False, f"OUT OF BOUNDS WITH POINTER AT: {ptr}"


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                     # PART 1: OVERWRITE ADDRESSES 1 AND 2 WITH (12, 2)
                                                                    # AND FIND RESULT IN ADDRESS 0

    PROGRAM_COPY = PROGRAM.copy()

    if not DEBUG:
      PROGRAM_INPUT = (12, 2)
      PROGRAM_COPY[1], PROGRAM_COPY[2] = PROGRAM_INPUT

    output = simulate(PROGRAM_COPY)[0]
    return output

  else:                                                             # PART 2: FIND WHAT TO OVERWRITE ADDRESSES 1 AND 2 WITH
                                                                    # TO PRODUCE TARGET_OUTPUT IN ADDRESS 0

    TARGET_OUTPUT = 19690720                                        # we are given this target

    for noun in range(100):
      for verb in range(100):
        PROGRAM_INPUT = (noun, verb)
        PROGRAM_COPY = PROGRAM.copy()
        PROGRAM_COPY[1], PROGRAM_COPY[2] = PROGRAM_INPUT
        output = simulate(PROGRAM_COPY)[0]
        if output == TARGET_OUTPUT:
          if DISPLAY_EXTRA_INFO:
            print(f"Noun: {noun}")
            print(f"Verb: {verb}")
          return noun * 100 + verb


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = intcode
skipped_tests = set([ 2, 3, 4, 5, 6 ])
skipped_tests = set([ 5, 6 ])
skipped_tests = set([ 6 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """1,0,0,0,99"""

sample_input2 = """2,3,0,3,99"""

sample_input3 = """2,4,4,5,99,0"""

sample_input4 = """1,1,1,4,99,5,6,0,99"""

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
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': sample_input4,
  'DEBUG': True,
}
test_expected = 30
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 3931283
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 6979
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)