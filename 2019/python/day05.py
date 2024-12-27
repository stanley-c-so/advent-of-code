"""

--- Day 5: Sunny with a Chance of Asteroids ---

You're starting to sweat as the ship makes its way toward Mercury. The Elves suggest that you get the air conditioner working by upgrading your ship computer to support the Thermal Environment Supervision Terminal.

The Thermal Environment Supervision Terminal (TEST) starts by running a diagnostic program (your puzzle input). The TEST diagnostic program will run on your existing Intcode computer after a few modifications:

First, you'll need to add two new instructions:

Opcode 3 takes a single integer as input and saves it to the position given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.
Programs that use these instructions will come with documentation that explains what should be connected to the input and output. The program 3,0,4,0,99 outputs whatever it gets as input, then halts.

Second, you'll need to add support for parameter modes:

Each parameter of an instruction is handled based on its parameter mode. Right now, your ship computer already understands parameter mode 0, position mode, which causes the parameter to be interpreted as a position - if the parameter is 50, its value is the value stored at address 50 in memory. Until now, all parameters have been in position mode.

Now, your ship computer will also need to handle parameters in mode 1, immediate mode. In immediate mode, a parameter is interpreted as a value - if the parameter is 50, its value is simply 50.

Parameter modes are stored in the same value as the instruction's opcode. The opcode is a two-digit number based only on the ones and tens digit of the value, that is, the opcode is the rightmost two digits of the first value in an instruction. Parameter modes are single digits, one per parameter, read right-to-left from the opcode: the first parameter's mode is in the hundreds digit, the second parameter's mode is in the thousands digit, the third parameter's mode is in the ten-thousands digit, and so on. Any missing modes are 0.

For example, consider the program 1002,4,3,4,33.

The first instruction, 1002,4,3,4, is a multiply instruction - the rightmost two digits of the first value, 02, indicate opcode 2, multiplication. Then, going right to left, the parameter modes are 0 (hundreds digit), 1 (thousands digit), and 0 (ten-thousands digit, not present and therefore zero):

ABCDE
 1002

DE - two-digit opcode,      02 == opcode 2
 C - mode of 1st parameter,  0 == position mode
 B - mode of 2nd parameter,  1 == immediate mode
 A - mode of 3rd parameter,  0 == position mode,
                                  omitted due to being a leading zero
This instruction multiplies its first two parameters. The first parameter, 4 in position mode, works like it did before - its value is the value stored at address 4 (33). The second parameter, 3 in immediate mode, simply has value 3. The result of this operation, 33 * 3 = 99, is written according to the third parameter, 4 in position mode, which also works like it did before - 99 is written to address 4.

Parameters that an instruction writes to will never be in immediate mode.

Finally, some notes:

It is important to remember that the instruction pointer should increase by the number of values in the instruction after the instruction finishes. Because of the new instructions, this amount is no longer always 4.
Integers can be negative: 1101,100,-1,4,0 is a valid program (find 100 + -1, store the result in position 4).
The TEST diagnostic program will start by requesting from the user the ID of the system to test by running an input instruction - provide it 1, the ID for the ship's air conditioner unit.

It will then perform a series of diagnostic tests confirming that various parts of the Intcode computer, like parameter modes, function correctly. For each test, it will run an output instruction indicating how far the result of the test was from the expected value, where 0 means the test was successful. Non-zero outputs mean that a function is not working correctly; check the instructions that were run before the output instruction to see which one failed.

Finally, the program will output a diagnostic code and immediately halt. This final output isn't an error; an output followed immediately by a halt means the program finished. If all outputs were zero except the diagnostic code, the diagnostic program ran successfully.

After providing 1 to the only input instruction and passing all the tests, what diagnostic code does the program produce?


--- Part Two ---

The air conditioner comes online! Its cold air feels good for a while, but then the TEST alarms start to go off. Since the air conditioner can't vent its heat anywhere but back into the spacecraft, it's actually making the air inside the ship warmer.

Instead, you'll need to use the TEST to extend the thermal radiators. Fortunately, the diagnostic program (your puzzle input) is already equipped for this. Unfortunately, your Intcode computer is not.

Your computer is only missing a few opcodes:

Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
Like all instructions, these instructions need to support parameter modes as described above.

Normally, after an instruction is finished, the instruction pointer increases by the number of values in that instruction. However, if the instruction modifies the instruction pointer, that value is used and the instruction pointer is not automatically increased.

For example, here are several programs that take one input, compare it to the value 8, and then produce one output:

3,9,8,9,10,9,4,9,99,-1,8 - Using position mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
3,9,7,9,10,9,4,9,99,-1,8 - Using position mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
3,3,1108,-1,8,3,4,3,99 - Using immediate mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
3,3,1107,-1,8,3,4,3,99 - Using immediate mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
Here are some jump tests that take an input, then output 0 if the input was zero or 1 if the input was non-zero:

3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9 (using position mode)
3,3,1105,-1,9,1101,0,0,12,4,12,99,1 (using immediate mode)
Here's a larger example:

3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
The above example program uses an input instruction to ask for a single number. The program will then output 999 if the input value is below 8, output 1000 if the input value is equal to 8, or output 1001 if the input value is greater than 8.

This time, when the TEST diagnostic program runs its input instruction to get the ID of the system to test, provide it 5, the ID for the ship's thermal radiator controller. This diagnostic test suite only outputs one number, the diagnostic code.

What is the diagnostic code for system ID 5?

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

  (input_id, ) = args

  # UTILITY

  def in_bounds(idx, PROGRAM):
    return 0 <= idx < len(PROGRAM)

  def simulate(PROGRAM, input):

    OUTPUT = []

    ptr = 0
    while in_bounds(ptr, PROGRAM):

      opcode_int = PROGRAM[ptr]
      opcode_str = str(opcode_int).zfill(2 + 3)
      opcode = opcode_str[-2:]

      mode1 = opcode_str[-3]
      mode2 = opcode_str[-4]
      mode3 = opcode_str[-5]
      assert mode1 in '01', f"INVALID MODE FOR OPERAND 1: {mode1}"
      assert mode2 in '01', f"INVALID MODE FOR OPERAND 2: {mode2}"
      assert mode3 in '01', f"INVALID MODE FOR OPERAND 3: {mode3}"

      if opcode == '01':                                            # ADD
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)
        assert in_bounds(ptr + 3, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read addend1
        param2 = PROGRAM[ptr + 2]                                   # value to read addend2
        param3 = PROGRAM[ptr + 3]                                   # address to write sum

        addend1 = PROGRAM[param1] if mode1 == '0' else param1
        addend2 = PROGRAM[param2] if mode2 == '0' else param2

        res = addend1 + addend2

        assert mode3 == '0', f"INVALID MODE FOR OPERAND 3: {mode3}"
        PROGRAM[param3] = res

        ptr += 4

      elif opcode == '02':                                          # MULTIPLY
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)
        assert in_bounds(ptr + 3, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read factor1
        param2 = PROGRAM[ptr + 2]                                   # value to read factor2
        param3 = PROGRAM[ptr + 3]                                   # address to write product

        factor1 = PROGRAM[param1] if mode1 == '0' else param1
        factor2 = PROGRAM[param2] if mode2 == '0' else param2

        res = factor1 * factor2
        
        assert mode3 == '0', f"INVALID MODE FOR OPERAND 3: {mode3}"
        PROGRAM[param3] = res

        ptr += 4

      elif opcode == '03':                                          # INPUT
        assert in_bounds(ptr + 1, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # address to write input

        assert mode1 == '0', f"INVALID MODE FOR OPERAND 1: {mode1}"
        PROGRAM[param1] = input                                     # given in function call

        ptr += 2

      elif opcode == '04':                                          # OUTPUT
        assert in_bounds(ptr + 1, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read output

        output = PROGRAM[param1] if mode1 == '0' else param1

        OUTPUT.append(output)

        ptr += 2

      elif opcode == '05':                                          # JUMP IF TRUE
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read operand1
        param2 = PROGRAM[ptr + 2]                                   # value to read operand2

        operand1 = PROGRAM[param1] if mode1 == '0' else param1
        operand2 = PROGRAM[param2] if mode2 == '0' else param2

        if operand1 != 0:
          ptr = operand2
        else:
          ptr += 3

      elif opcode == '06':                                          # JUMP IF FALSE
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read operand1
        param2 = PROGRAM[ptr + 2]                                   # value to read operand2

        operand1 = PROGRAM[param1] if mode1 == '0' else param1
        operand2 = PROGRAM[param2] if mode2 == '0' else param2

        if operand1 == 0:
          ptr = operand2
        else:
          ptr += 3

      elif opcode == '07':                                          # LESS THAN
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)
        assert in_bounds(ptr + 3, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read operand1
        param2 = PROGRAM[ptr + 2]                                   # value to read operand2
        param3 = PROGRAM[ptr + 3]                                   # address to write result

        operand1 = PROGRAM[param1] if mode1 == '0' else param1
        operand2 = PROGRAM[param2] if mode2 == '0' else param2

        res = 1 if operand1 < operand2 else 0
        
        assert mode3 == '0', f"INVALID MODE FOR OPERAND 3: {mode3}"
        PROGRAM[param3] = res

        ptr += 4

      elif opcode == '08':                                          # EQUAL TO
        assert in_bounds(ptr + 1, PROGRAM)
        assert in_bounds(ptr + 2, PROGRAM)
        assert in_bounds(ptr + 3, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read operand1
        param2 = PROGRAM[ptr + 2]                                   # value to read operand2
        param3 = PROGRAM[ptr + 3]                                   # address to write result

        operand1 = PROGRAM[param1] if mode1 == '0' else param1
        operand2 = PROGRAM[param2] if mode2 == '0' else param2

        res = 1 if operand1 == operand2 else 0
        
        assert mode3 == '0', f"INVALID MODE FOR OPERAND 3: {mode3}"
        PROGRAM[param3] = res

        ptr += 4

      elif opcode == '99':                                          # TERMINATE
        return (PROGRAM, OUTPUT)

      else:
        assert False, f"UNRECOGNIZED OPCODE: {opcode}"

    assert False, f"OUT OF BOUNDS WITH POINTER AT: {ptr}"

  # ANALYZE

  TIME_AT_START = time.time()

  MEMORY, OUTPUT = simulate(PROGRAM.copy(), input_id)                 # PART 1: ID 1 FOR AIR CONDITIONING UNIT
                                                                      # PART 2: ID 5 FOR THERMAL RADIATOR CONTROLLER
  
  for i in range(len(OUTPUT) - 1):
    assert OUTPUT[i] == 0

  if DISPLAY_EXTRA_INFO:
    print(f"Final state of program memory:")
    print(MEMORY)
    print('')
    print(f"The program produced the following output:")
    print(OUTPUT)

  return OUTPUT[-1]


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = intcode
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 10 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """3,9,8,9,10,9,4,9,99,-1,8"""

sample_input2 = """3,9,7,9,10,9,4,9,99,-1,8"""

sample_input3 = """3,3,1108,-1,8,3,4,3,99"""

sample_input4 = """3,3,1107,-1,8,3,4,3,99"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'input_id': 1,
}
test_expected = 5074395
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'input_id': 7,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'input_id': 8,
}
test_expected = 1
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
  'input_id': 7,
}
test_expected = 1
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
  'input_id': 8,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
  'input_id': 7,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
  'input_id': 8,
}
test_expected = 1
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input4,
  'DEBUG': True,
  'input_id': 7,
}
test_expected = 1
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input4,
  'DEBUG': True,
  'input_id': 8,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'input_id': 5,
}
test_expected = 8346937
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)