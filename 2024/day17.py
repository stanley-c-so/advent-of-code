"""

--- Day 17: Chronospatial Computer ---

The Historians push the button on their strange device, but this time, you all just feel like you're falling.

"Situation critical", the device announces in a familiar voice. "Bootstrapping process failed. Initializing debugger...."

The small handheld device suddenly unfolds into an entire computer! The Historians look around nervously before one of them tosses it to you.

This seems to be a 3-bit computer: its program is a list of 3-bit numbers (0 through 7), like 0,1,2,3. The computer also has three registers named A, B, and C, but these registers aren't limited to 3 bits and can instead hold any integer.

The computer knows eight instructions, each identified by a 3-bit number (called the instruction's opcode). Each instruction also reads the 3-bit number after it as an input; this is called its operand.

A number called the instruction pointer identifies the position in the program from which the next opcode will be read; it starts at 0, pointing at the first 3-bit number in the program. Except for jump instructions, the instruction pointer increases by 2 after each instruction is processed (to move past the instruction's opcode and its operand). If the computer tries to read an opcode past the end of the program, it instead halts.

So, the program 0,1,2,3 would run the instruction whose opcode is 0 and pass it the operand 1, then run the instruction having opcode 2 and pass it the operand 3, then halt.

There are two types of operands; each instruction specifies the type of its operand. The value of a literal operand is the operand itself. For example, the value of the literal operand 7 is the number 7. The value of a combo operand can be found as follows:

Combo operands 0 through 3 represent literal values 0 through 3.
Combo operand 4 represents the value of register A.
Combo operand 5 represents the value of register B.
Combo operand 6 represents the value of register C.
Combo operand 7 is reserved and will not appear in valid programs.
The eight instructions are as follows:

The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.

The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.

The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.

The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.

The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)

The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)

The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)

The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)

Here are some examples of instruction operation:

If register C contains 9, the program 2,6 would set register B to 1.
If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.
If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.
If register B contains 29, the program 1,7 would set register B to 26.
If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.
The Historians' strange device has finished initializing its debugger and is displaying some information about the program it is trying to run (your puzzle input). For example:

Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
Your first task is to determine what the program is trying to output. To do this, initialize the registers to the given values, then run the given program, collecting any output produced by out instructions. (Always join the values produced by out instructions with commas.) After the above program halts, its final output will be 4,6,3,5,6,3,5,2,1,0.

Using the information provided by the debugger, initialize the registers to the given values, then run the program. Once it halts, what do you get if you use commas to join the values it output into a single string?


--- Part Two ---

Digging deeper in the device's manual, you discover the problem: this program is supposed to output another copy of the program! Unfortunately, the value in register A seems to have been corrupted. You'll need to find a new value to which you can initialize register A so that the program's output instructions produce an exact copy of the program itself.

For example:

Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
This program outputs a copy of itself if register A is instead initialized to 117440. (The original initial value of register A, 2024, is ignored.)

What is the lowest positive initial value for register A that causes the program to output a copy of itself?

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

def opcode_quine(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  A, B, C = 'A', 'B', 'C'

  # PARSE INPUT DATA

  [ register_data, program_data ] = input_str.split('\n\n')
  register_data_ints = [ int(line.split(': ')[1]) for line in register_data.split('\n') ]

  INITIAL_A = register_data_ints[0]
  INITIAL_B = register_data_ints[1]
  INITIAL_C = register_data_ints[2]

  PROGRAM = [ int(n) for n in program_data.split(': ')[1].split(',') ]
  PART_2_SOLUTION = ','.join([ str(n) for n in PROGRAM ])


  # UTILITY

  def combo_operand(operand, REGISTERS):
    if 0 <= operand <= 3: return operand
    if operand == 4: return REGISTERS[A]
    if operand == 5: return REGISTERS[B]
    if operand == 6: return REGISTERS[C]
    if operand == 7: assert False, f"INVALID COMBO OPERAND: 7"
    assert False, f"INVALID COMBO OPERAND: {operand}"


  # ANALYZE

  TIME_AT_START = time.time()


  def simulate(REGISTERS, display_extra_info):

    output = []
    ptr = 0
    iterations = 1
    while ptr < len(PROGRAM):
      
      opcode = PROGRAM[ptr]
      operand = PROGRAM[ptr + 1]

      jump = False

      if opcode == 0:                                                   # adv
        numerator = REGISTERS[A]
        denominator = 2 ** combo_operand(operand, REGISTERS)
        res = trunc(numerator / denominator)
        REGISTERS[A] = res
      
      elif opcode == 1:                                                 # bxl
        res = REGISTERS[B] ^ operand
        REGISTERS[B] = res
      
      elif opcode == 2:                                                 # bst
        res = combo_operand(operand, REGISTERS) % 8
        REGISTERS[B] = res
      
      elif opcode == 3:                                                 # jnz
        if REGISTERS[A] != 0:
          jump = True
          ptr = operand
          iterations += 1                                               # increment iterations when looping
      
      elif opcode == 4:                                                 # bxc
        res = REGISTERS[B] ^ REGISTERS[C]
        REGISTERS[B] = res
      
      elif opcode == 5:                                                 # out
        res = combo_operand(operand, REGISTERS) % 8
        output.append(res)
      
      elif opcode == 6:                                                 # bdv
        numerator = REGISTERS[A]
        denominator = 2 ** combo_operand(operand, REGISTERS)
        res = trunc(numerator / denominator)
        REGISTERS[B] = res
      
      elif opcode == 7:                                                 # cdv
        numerator = REGISTERS[A]
        denominator = 2 ** combo_operand(operand, REGISTERS)
        res = trunc(numerator / denominator)
        REGISTERS[C] = res
      
      else:
        assert False, f"INVALID OPCODE: {opcode}"

      if not jump: ptr += 2

    if display_extra_info:
      print(f"Number of iterations: {iterations}")
      print(f"Final state of registers: {REGISTERS}")
      print(f"Output (list form): {output}")

    return ','.join([ str(n) for n in output ])

  if part == 1:                                                         # PART 1: RUN SIMULATION, RETURN OUTPUT

    return simulate({ A: INITIAL_A, B: INITIAL_B, C: INITIAL_C }, True)
  
  else:                                                                 # PART 2: FIND LOWEST INITIAL A THAT MAKES PROGRAM INTO A QUINE
                                                                        # (IT OUTPUTS ITSELF)

    if DEBUG:                                                           # EXAMPLE DATA: JUST TRY EVERY POSSIBILITY

      print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

      LOWER_LIMIT = 1
      UPPER_LIMIT = 281474976710656

      multiple = 10 ** 4

      for n in range(LOWER_LIMIT, UPPER_LIMIT + 1):
        if n % multiple == 0: print(f"now trying n = {n}")
        if simulate({ A: n, B: INITIAL_B, C: INITIAL_C }, False) == PART_2_SOLUTION:
          print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
          return n
      
      print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
      assert False, 'Did not find solution after trying up to {UPPER_LIMIT}'

    else:                                                               # REAL DATA: ANALYSIS REQUIRED

      """
      ANALYSIS (THIS ONLY WORKS WITH THE ACTUAL INPUT DATA!):

      For my input, the program (2,4,1,4,7,5,4,1,1,4,5,5,0,3,3,0) translates to:

      OC  OP  HUMAN-READABLE
      bst A   A % 8 -> B
      bxl 4   B ^ 4 -> B
      cdv B   floor(A / 2^B) -> C
      bxc 1   B ^ C -> B
      bxl 4   B ^ 4 -> B
      out B   B % 8 -> output
      adv 3   floor(A / 8) -> A
      jnz 0   if A, jump to 0

      Observations:
      - The only jump is from the last instruction, and it always goes back to 0 if it applies.
        It applies if A is not 0. A typically starts as high number, and B and C start as 0.
        Of course, if A is 0, the program terminates.
      - The only thing that modifies A is the second last instruction, which floor-divides A by 8
        (in binary, effectively this pops off the last 3 bits) and saves it to itself (gradually approaching 0).
      - Therefore, the number of loops depends on A's size: generally, for n loops, 8**(n-1) <= A < 8**n.
      - Each loop outputs one number: B % 8, so this number, x, always obeys 0 <= x <= 7.
      - My program is 16 elements long. To output my program, I need to make 16 loops, so my original A
        obeys: 8**15 <= A < 8**16, or 2**45 <= A < 2**48, or 35,184,372,088,832 <= A < 281,474,976,710,656.
      - This is way too large to simulate. So analysis is required.

      - The number being output ultimately derives from the state of A:
        - Take the last 3 bits of A
        - xor it by 4... let's call this "XB", and observe that 0 <= XB <= 7
        - Right shift A by XB times - although the entire result is large and stored in C, and the result
          interacts with XB etc., ultimately only the last 3 digits get outputted, so effectively only the
          last 3 digits of A's right shift are really significant... let's call this "SA", and observe that
          0 <= SA <= 7
        - Find XB ^ SA and then xor that by 4... let's call this "XXBSA", and observe that 0 <= XXBSA <= 7
        - The next output is XXBSA.
      - Therefore the next number being outputted is affected by the current last 10 digits of A (padleft with 0
        if necessary), and nothing more. There are 2**10 or 1024 possibilities for these 10 digits. Therefore,
        we can create a mapping from 0 to 1023 (but exclude 0 because A can never be 0 within the loop), representing
        potential values of the last 10 digits of A, and determine what number it would ultimately output next.
      - For the curious, based on my math, this is the number of 10-digit parts of A that would generate each
        potential output from 0 <= output <= 7, by output:
          {
            0: 208,
            1: 112,
            2: 80,
            3: 176,
            4: 80,
            5: 112,
            6: 80,
            7: 176,
          }
      - To generate the desired sequence of outputs, then, we need to chain together a value of A (in binary,
        3*16 + (10-3), or 55 digits long, with the first 7 being guaranteed to be leading 0s) such that the last
        10 bits would output the first number, then after lopping off 3 bits, what is now the last 10 bits would
        output the second number, etc.
        
      """

      # Initialize set of possible values of the last 10 bits of A for every program output

      POTENTIAL_LAST_10_A_BY_DESIRED_OUTPUT = {}
      for LAST_10_A in range(1, 1024):                                  # IMPORTANT: Do NOT include LAST_10_A == 0! if you do,
                                                                        # the program will not output the final digit (expected 0).
                                                                        # LAST_10_A should never be 0, because every relevant valid input
                                                                        # begins with a large A, and A is only ever changed when it
                                                                        # is floor-divided by 8, followed by an immediate check that
                                                                        # terminates the program if A is now 0. The program only ever
                                                                        # loops if A is NOT 0.

                                                                        # Wrong answer if you allow for LAST_10_A to be 0:
                                                                        # 0000000000011101100011011111110111001110000011000000010

                                                                        # Right answer:
                                                                        # 0000000100011101100011011111110111001110000011000000010

                                                                        # Note that the difference is only 1 place: within the first
                                                                        # 10 digits (i.e. relevant on the final output). If these 10
                                                                        # digits were all 0, then the simulation would have ended
                                                                        # before reaching this final output.

        binary_A = '{0:010b}'.format(LAST_10_A)
        last_3 = binary_A[(10 - 3):]
        XB = int(last_3, 2) ^ 4
        SA_index = (10 - 3) - XB
        SA = int(binary_A[SA_index : SA_index + 3], 2)
        XXBSA = (XB ^ SA) ^ 4

        if XXBSA not in POTENTIAL_LAST_10_A_BY_DESIRED_OUTPUT: POTENTIAL_LAST_10_A_BY_DESIRED_OUTPUT[XXBSA] = set()
        POTENTIAL_LAST_10_A_BY_DESIRED_OUTPUT[XXBSA].add(LAST_10_A)

      POSSIBILITIES_FOR_OUTPUT = [ POTENTIAL_LAST_10_A_BY_DESIRED_OUTPUT[n].copy() for n in PROGRAM ]


      # (OPTIONAL) PARE DOWN POSSIBILITIES FOR THE LAST 4 NUMBERS BASED ON LEADING ZEROES NEEDING TO BE 0
      # (For the last 4 outputs, A will be sufficiently small such that there will be leading zeroes)

      if DISPLAY_EXTRA_INFO:
        print('BEFORE LEADING ZEROES PARE DOWN (LAST 4 OUTPUTS ONLY):', [ len(g) for g in POSSIBILITIES_FOR_OUTPUT ][-4:])

      leading_zeroes = 7
      output_idx = -1
      while leading_zeroes > 0:
        possibilities_set = POSSIBILITIES_FOR_OUTPUT[output_idx]
        to_be_removed = []
        for possibility in possibilities_set:
          binary_p = '{0:010b}'.format(possibility)
          slice_that_should_not_have_1 = binary_p[ : leading_zeroes ]
          if '1' in slice_that_should_not_have_1:
            to_be_removed.append(possibility)
        for possibility in to_be_removed:
          possibilities_set.remove(possibility)
        leading_zeroes -= 3
        output_idx -= 1

      if DISPLAY_EXTRA_INFO:
        print('AFTER LEADING ZEROES PARE DOWN (LAST 4 OUTPUTS ONLY):', [ len(g) for g in POSSIBILITIES_FOR_OUTPUT ][-4:])


      # BI-DIRECTIONAL RECURSIVE PARE DOWN

      if DISPLAY_EXTRA_INFO:
        print('BEFORE BI-DIRECTIONAL RECURSIVE PARE DOWN:', [ len(g) for g in POSSIBILITIES_FOR_OUTPUT ])

      # Backward recursion
      def pare_down_possibilities_by_next_output(i):
        possibilities_set = POSSIBILITIES_FOR_OUTPUT[i]
        next_possibilities = POSSIBILITIES_FOR_OUTPUT[i + 1]

        possible_overlapping_strs = {}
        for possibility in next_possibilities:
          binary_p = '{0:010b}'.format(possibility)
          overlapping_str = binary_p[3:]
          if overlapping_str not in possible_overlapping_strs: possible_overlapping_strs[overlapping_str] = []
          possible_overlapping_strs[overlapping_str].append(possibility)

        unused_next_possibilities = next_possibilities.copy()
        to_be_removed = []
        for possibility in possibilities_set:
          binary_p = '{0:010b}'.format(possibility)
          overlapping_str = binary_p[:-3]
          if overlapping_str in possible_overlapping_strs:
            for possibility in possible_overlapping_strs[overlapping_str]:
              unused_next_possibilities.discard(possibility)
          else:
            to_be_removed.append(possibility)

        for possibility in to_be_removed:
          possibilities_set.remove(possibility)

        if len(possibilities_set) == 0:
          assert False, 'RAN OUT OF POSSIBILITIES!'

        if i > 0:
          pare_down_possibilities_by_next_output(i - 1)

        if len(unused_next_possibilities):
          pare_down_possibilities_by_prev_output(i + 1)

      # Forward recursion
      def pare_down_possibilities_by_prev_output(i):
        possibilities_set = POSSIBILITIES_FOR_OUTPUT[i]
        prev_possibilities = POSSIBILITIES_FOR_OUTPUT[i - 1]

        possible_overlapping_strs = {}
        for possibility in prev_possibilities:
          binary_p = '{0:010b}'.format(possibility)
          overlapping_str = binary_p[:-3]
          if overlapping_str not in possible_overlapping_strs: possible_overlapping_strs[overlapping_str] = []
          possible_overlapping_strs[overlapping_str].append(possibility)

        unused_prev_possibilities = prev_possibilities.copy()
        to_be_removed = []
        for possibility in possibilities_set:
          binary_p = '{0:010b}'.format(possibility)
          overlapping_str = binary_p[3:]
          if overlapping_str in possible_overlapping_strs:
            for possibility in possible_overlapping_strs[overlapping_str]:
              unused_prev_possibilities.discard(possibility)
          else:
            to_be_removed.append(possibility)

        for possibility in to_be_removed:
          possibilities_set.remove(possibility)

        if len(possibilities_set) == 0:
          assert False, 'RAN OUT OF POSSIBILITIES!'

        if i < len(POSSIBILITIES_FOR_OUTPUT) - 1:
          pare_down_possibilities_by_prev_output(i + 1)

        if len(unused_prev_possibilities):
          pare_down_possibilities_by_next_output(i - 1)

      # Kick-start recursion
      pare_down_possibilities_by_next_output(len(POSSIBILITIES_FOR_OUTPUT) - 2)

      if DISPLAY_EXTRA_INFO:
        print('AFTER BI-DIRECTIONAL RECURSIVE PARE DOWN:', [ len(g) for g in POSSIBILITIES_FOR_OUTPUT ])
        print('')

      # NOW, POSSIBILITIES_FOR_OUTPUT ARE NOT JUST LOCALLY VALID, BUT VALID TO SUPPORT THE ENTIRE INITIAL VALUE OF A.
      # BUILD OUT THE INITIAL VALUE OF A WITH THE *SMALLEST* POSSIBLE CHOICE EACH TIME (PER PROBLEM SPECS)

      BUILD_OUT_A = []

      # Backward recursion
      def step_backward_through_output_list_while_choosing_lowest_possibility(i):

        lowest_possible_next_possibility = '{0:010b}'.format(list(sorted(POSSIBILITIES_FOR_OUTPUT[i + 1]))[0])

        if i == len(POSSIBILITIES_FOR_OUTPUT) - 2:                      # first iteration...
          BUILD_OUT_A.append(lowest_possible_next_possibility)          # ...include all 10 digits
        else:                                                           # subsequent iterations...
          BUILD_OUT_A.append(lowest_possible_next_possibility[-3:])     # ...you already have 7 digit overlap, so only include next 3

        ### BASE CASE ###

        if i < 0: return

        ### RECURSIVE CASE ###

        possibilities_set = POSSIBILITIES_FOR_OUTPUT[i]

        to_be_removed = []
        for possibility in possibilities_set:
          binary_p = '{0:010b}'.format(possibility)
          overlapping_str = binary_p[:-3]
          if overlapping_str != lowest_possible_next_possibility[3:]:
            to_be_removed.append(possibility)
        for possibility in to_be_removed:
          possibilities_set.remove(possibility)

        if len(possibilities_set) == 0:
          assert False, 'RAN OUT OF POSSIBILITIES!'

        step_backward_through_output_list_while_choosing_lowest_possibility(i - 1)

      # Kick-start recursion
      step_backward_through_output_list_while_choosing_lowest_possibility(len(POSSIBILITIES_FOR_OUTPUT) - 2)

      FINAL_A_BINARY = ''.join(BUILD_OUT_A)
      FINAL_A_DECIMAL = int(FINAL_A_BINARY, 2)

      if DISPLAY_EXTRA_INFO:
        print(f"FINAL A IN BINARY FORM: {FINAL_A_BINARY}")
        print(f"FINAL A IN DECIMAL FORM: {FINAL_A_DECIMAL}")
        print('')

      simulate_to_check = simulate({ A: FINAL_A_DECIMAL, B: INITIAL_B, C: INITIAL_C }, True)

      if DISPLAY_EXTRA_INFO:
        print(f"RESULT AFTER SIMULATING WITH {FINAL_A_DECIMAL}: {simulate_to_check}")
      
      assert simulate_to_check == PART_2_SOLUTION
      return FINAL_A_DECIMAL


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = opcode_quine
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9 ])
skipped_tests = set([ 7, 8, 9 ])
skipped_tests = set([ 8, 9 ])
skipped_tests = set([ 9 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0"""

sample_input2 = """Register A: 0
Register B: 0
Register C: 9

Program: 2,6"""

sample_input3 = """Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4"""

sample_input4 = """Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0"""

sample_input5 = """Register A: 0
Register B: 29
Register C: 0

Program: 1,7"""

sample_input6 = """Register A: 0
Register B: 2024
Register C: 43690

Program: 4,0"""

sample_input7 = """Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = '4,6,3,5,6,3,5,2,1,0'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = ''
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = '0,1,2'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': sample_input4,
  'DEBUG': True,
}
test_expected = '4,2,5,6,7,7,7,7,3,1,0'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 1,
  'input_str': sample_input5,
  'DEBUG': True,
}
test_expected = ''
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 1,
  'input_str': sample_input6,
  'DEBUG': True,
}
test_expected = ''
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = '7,0,7,3,4,1,3,0,1'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input7,
  'DEBUG': True,
}
test_expected = 117440
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 156985331222018
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)