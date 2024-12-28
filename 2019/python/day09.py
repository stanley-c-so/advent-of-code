"""

--- Day 9: Sensor Boost ---

You've just said goodbye to the rebooted rover and left Mars when you receive a faint distress signal coming from the asteroid belt. It must be the Ceres monitoring station!

In order to lock on to the signal, you'll need to boost your sensors. The Elves send up the latest BOOST program - Basic Operation Of System Test.

While BOOST (your puzzle input) is capable of boosting your sensors, for tenuous safety reasons, it refuses to do so until the computer it runs on passes some checks to demonstrate it is a complete Intcode computer.

Your existing Intcode computer is missing one key feature: it needs support for parameters in relative mode.

Parameters in mode 2, relative mode, behave very similarly to parameters in position mode: the parameter is interpreted as a position. Like position mode, parameters in relative mode can be read from or written to.

The important difference is that relative mode parameters don't count from address 0. Instead, they count from a value called the relative base. The relative base starts at 0.

The address a relative mode parameter refers to is itself plus the current relative base. When the relative base is 0, relative mode parameters and position mode parameters with the same value refer to the same address.

For example, given a relative base of 50, a relative mode parameter of -7 refers to memory address 50 + -7 = 43.

The relative base is modified with the relative base offset instruction:

Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the value is negative) by the value of the parameter.
For example, if the relative base is 2000, then after the instruction 109,19, the relative base would be 2019. If the next instruction were 204,-34, then the value at address 1985 would be output.

Your Intcode computer will also need a few other capabilities:

The computer's available memory should be much larger than the initial program. Memory beyond the initial program starts with the value 0 and can be read or written like any other memory. (It is invalid to try to access memory at a negative address, though.)
The computer should have support for large numbers. Some instructions near the beginning of the BOOST program will verify this capability.
Here are some example programs that use these features:

109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99 takes no input and produces a copy of itself as output.
1102,34915192,34915192,7,4,7,99,0 should output a 16-digit number.
104,1125899906842624,99 should output the large number in the middle.
The BOOST program will ask for a single input; run it in test mode by providing it the value 1. It will perform a series of checks on each opcode, output any opcodes (and the associated parameter modes) that seem to be functioning incorrectly, and finally output a BOOST keycode.

Once your Intcode computer is fully functional, the BOOST program should report no malfunctioning opcodes when run in test mode; it should only output a single value, the BOOST keycode. What BOOST keycode does it produce?


--- Part Two ---

You now have a complete Intcode computer.

Finally, you can lock on to the Ceres distress signal! You just need to boost your sensors using the BOOST program.

The program runs in sensor boost mode by providing the input instruction the value 2. Once run, it will boost the sensors automatically, but it might take a few seconds to complete the operation on slower hardware. In sensor boost mode, the program will output a single value: the coordinates of the distress signal.

Run the BOOST program in sensor boost mode. What are the coordinates of the distress signal?

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

from itertools import permutations

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def intcode(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  PROGRAM = [ int(n) for n in input_str.split(',') ]

  (INPUT,) = args


  # UTILITY

  def simulate(PROGRAM, INPUT):

    INFINITE_LOOP_GUARD = 10 ** 6                                                         # part 2 real data goes to 
                                                                                          # index 371205!

    def PROGRAM_get(idx):
      expand_memory_if_needed(idx)
      return PROGRAM[idx]
    
    def PROGRAM_write(idx, data):
      expand_memory_if_needed(idx)
      PROGRAM[idx] = data

    def expand_memory_if_needed(idx):
      assert idx >= 0, f"INVALID NEGATIVE idx: {idx}"
      while idx >= len(PROGRAM):
        PROGRAM.append(0)

    ptr = 0
    input_ptr = 0
    relative_base = 0
    
    OUTPUT = []

    for _ in range(INFINITE_LOOP_GUARD):

      opcode_int = PROGRAM[ptr]
      opcode_str = str(opcode_int).zfill(2 + 3)
      opcode = opcode_str[-2:]

      mode1 = opcode_str[-3]
      mode2 = opcode_str[-4]
      mode3 = opcode_str[-5]
      assert mode1 in '012', f"INVALID MODE FOR OPERAND 1: {mode1}"
      assert mode2 in '012', f"INVALID MODE FOR OPERAND 2: {mode2}"
      assert mode3 in '012', f"INVALID MODE FOR OPERAND 3: {mode3}"

      param1 = PROGRAM_get(ptr + 1)
      param2 = PROGRAM_get(ptr + 2)
      param3 = PROGRAM_get(ptr + 3)

      if opcode == '01':                                                                  # ADD

        addend1 = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        addend2 = PROGRAM_get(param2) if mode2 == '0' else param2 if mode2 == '1' else PROGRAM_get(param2 + relative_base)
        res = addend1 + addend2

        assert mode3 in '02', f"INVALID MODE FOR OPERAND 3: {mode3}"
        write_idx = param3 if mode3 == '0' else (param3 + relative_base)
        PROGRAM_write(write_idx, res)

        ptr += 4

      elif opcode == '02':                                                                # MULTIPLY

        factor1 = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        factor2 = PROGRAM_get(param2) if mode2 == '0' else param2 if mode2 == '1' else PROGRAM_get(param2 + relative_base)
        res = factor1 * factor2
        
        assert mode3 in '02', f"INVALID MODE FOR OPERAND 3: {mode3}"
        write_idx = param3 if mode3 == '0' else (param3 + relative_base)
        PROGRAM_write(write_idx, res)

        ptr += 4

      elif opcode == '03':                                                                # INPUT

        assert mode1 in '02', f"INVALID MODE FOR OPERAND 1: {mode1}"
        assert 0 <= input_ptr < len(INPUT), f"OUT OF INPUTS WITH input_ptr: {input_ptr}"
        write_idx = param1 if mode1 == '0' else (param1 + relative_base)
        PROGRAM_write(write_idx, INPUT[input_ptr])                                        # given in function call
        input_ptr += 1

        ptr += 2

      elif opcode == '04':                                                                # OUTPUT

        output = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        OUTPUT.append(output)

        ptr += 2

      elif opcode == '05':                                                                # JUMP IF TRUE

        operand1 = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        operand2 = PROGRAM_get(param2) if mode2 == '0' else param2 if mode2 == '1' else PROGRAM_get(param2 + relative_base)

        if operand1 != 0:
          ptr = operand2
        else:
          ptr += 3

      elif opcode == '06':                                                                # JUMP IF FALSE

        operand1 = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        operand2 = PROGRAM_get(param2) if mode2 == '0' else param2 if mode2 == '1' else PROGRAM_get(param2 + relative_base)

        if operand1 == 0:
          ptr = operand2
        else:
          ptr += 3

      elif opcode == '07':                                                                # LESS THAN

        operand1 = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        operand2 = PROGRAM_get(param2) if mode2 == '0' else param2 if mode2 == '1' else PROGRAM_get(param2 + relative_base)
        res = 1 if operand1 < operand2 else 0

        assert mode3 in '02', f"INVALID MODE FOR OPERAND 3: {mode3}"
        write_idx = param3 if mode3 == '0' else (param3 + relative_base)
        PROGRAM_write(write_idx, res)

        ptr += 4

      elif opcode == '08':                                                                # EQUAL TO

        operand1 = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        operand2 = PROGRAM_get(param2) if mode2 == '0' else param2 if mode2 == '1' else PROGRAM_get(param2 + relative_base)
        res = 1 if operand1 == operand2 else 0
        
        assert mode3 in '02', f"INVALID MODE FOR OPERAND 3: {mode3}"
        write_idx = param3 if mode3 == '0' else (param3 + relative_base)
        PROGRAM_write(write_idx, res)

        ptr += 4

      elif opcode == '09':                                                                # OUTPUT

        delta = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        relative_base += delta

        ptr += 2

      elif opcode == '99':                                                                # TERMINATE

        return (PROGRAM, OUTPUT)

      else:

        assert False, f"UNRECOGNIZED OPCODE: {opcode}"

    assert False, f"OUT OF BOUNDS WITH POINTER AT: {ptr}"


  # ANALYZE

  if part == 2 and not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  MEMORY, OUTPUT = simulate(PROGRAM, INPUT)

  if DISPLAY_EXTRA_INFO:
    if DEBUG:
      print(f"Final state of program memory:")
      print(MEMORY)
      print('')
    print(f"The program produced the following output:")
    print(OUTPUT)

  if part == 2 and not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~0.19 seconds
  return OUTPUT


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = intcode
skipped_tests = set([ 2, 3, 4, 5 ])
skipped_tests = set([ 4, 5 ])
skipped_tests = set([ 5 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"""

sample_input2 = """1102,34915192,34915192,7,4,7,99,0"""

sample_input3 = """104,1125899906842624,99"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  'INPUT': [],
}
test_expected = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
  'INPUT': [],
}
test_expected = [1219070632396864]
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
  'INPUT': [],
}
test_expected = [1125899906842624]
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'INPUT': [1],
}
test_expected = [3512778005]
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'INPUT': [2],
}
test_expected = [35920]
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)