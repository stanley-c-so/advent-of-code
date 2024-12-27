"""

--- Day 7: Amplification Circuit ---

Based on the navigational maps, you're going to need to send more power to your ship's thrusters to reach Santa in time. To do this, you'll need to configure a series of amplifiers already installed on the ship.

There are five amplifiers connected in series; each one receives an input signal and produces an output signal. They are connected such that the first amplifier's output leads to the second amplifier's input, the second amplifier's output leads to the third amplifier's input, and so on. The first amplifier's input value is 0, and the last amplifier's output leads to your ship's thrusters.

    O-------O  O-------O  O-------O  O-------O  O-------O
0 ->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-> (to thrusters)
    O-------O  O-------O  O-------O  O-------O  O-------O
The Elves have sent you some Amplifier Controller Software (your puzzle input), a program that should run on your existing Intcode computer. Each amplifier will need to run a copy of the program.

When a copy of the program starts running on an amplifier, it will first use an input instruction to ask the amplifier for its current phase setting (an integer from 0 to 4). Each phase setting is used exactly once, but the Elves can't remember which amplifier needs which phase setting.

The program will then call another input instruction to get the amplifier's input signal, compute the correct output signal, and supply it back to the amplifier with an output instruction. (If the amplifier has not yet received an input signal, it waits until one arrives.)

Your job is to find the largest output signal that can be sent to the thrusters by trying every possible combination of phase settings on the amplifiers. Make sure that memory is not shared or reused between copies of the program.

For example, suppose you want to try the phase setting sequence 3,1,2,4,0, which would mean setting amplifier A to phase setting 3, amplifier B to setting 1, C to 2, D to 4, and E to 0. Then, you could determine the output signal that gets sent from amplifier E to the thrusters with the following steps:

Start the copy of the amplifier controller software that will run on amplifier A. At its first input instruction, provide it the amplifier's phase setting, 3. At its second input instruction, provide it the input signal, 0. After some calculations, it will use an output instruction to indicate the amplifier's output signal.
Start the software for amplifier B. Provide it the phase setting (1) and then whatever output signal was produced from amplifier A. It will then produce a new output signal destined for amplifier C.
Start the software for amplifier C, provide the phase setting (2) and the value from amplifier B, then collect its output signal.
Run amplifier D's software, provide the phase setting (4) and input value, and collect its output signal.
Run amplifier E's software, provide the phase setting (0) and input value, and collect its output signal.
The final output signal from amplifier E would be sent to the thrusters. However, this phase setting sequence may not have been the best one; another sequence might have sent a higher signal to the thrusters.

Here are some example programs:

Max thruster signal 43210 (from phase setting sequence 4,3,2,1,0):

3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0
Max thruster signal 54321 (from phase setting sequence 0,1,2,3,4):

3,23,3,24,1002,24,10,24,1002,23,-1,23,
101,5,23,23,1,24,23,23,4,23,99,0,0
Max thruster signal 65210 (from phase setting sequence 1,0,4,3,2):

3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
Try every combination of phase settings on the amplifiers. What is the highest signal that can be sent to the thrusters?


--- Part Two ---

It's no good - in this configuration, the amplifiers can't generate a large enough output signal to produce the thrust you'll need. The Elves quickly talk you through rewiring the amplifiers into a feedback loop:

      O-------O  O-------O  O-------O  O-------O  O-------O
0 -+->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-.
   |  O-------O  O-------O  O-------O  O-------O  O-------O |
   |                                                        |
   '--------------------------------------------------------+
                                                            |
                                                            v
                                                     (to thrusters)
Most of the amplifiers are connected as they were before; amplifier A's output is connected to amplifier B's input, and so on. However, the output from amplifier E is now connected into amplifier A's input. This creates the feedback loop: the signal will be sent through the amplifiers many times.

In feedback loop mode, the amplifiers need totally different phase settings: integers from 5 to 9, again each used exactly once. These settings will cause the Amplifier Controller Software to repeatedly take input and produce output many times before halting. Provide each amplifier its phase setting at its first input instruction; all further input/output instructions are for signals.

Don't restart the Amplifier Controller Software on any amplifier during this process. Each one should continue receiving and sending signals until it halts.

All signals sent or received in this process will be between pairs of amplifiers except the very first signal and the very last signal. To start the process, a 0 signal is sent to amplifier A's input exactly once.

Eventually, the software on the amplifiers will halt after they have processed the final loop. When this happens, the last output signal from amplifier E is sent to the thrusters. Your job is to find the largest output signal that can be sent to the thrusters using the new phase settings and feedback loop arrangement.

Here are some example programs:

Max thruster signal 139629729 (from phase setting sequence 9,8,7,6,5):

3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
Max thruster signal 18216 (from phase setting sequence 9,7,8,5,6):

3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
Try every combination of the new phase settings on the amplifier feedback loop. What is the highest signal that can be sent to the thrusters?

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


  # UTILITY

  def in_bounds(idx, PROGRAM):
    return 0 <= idx < len(PROGRAM)

  def simulate(MACHINE):

    def update_ptrs_before_returning():                             # FOR THIS PROBLEM ONLY
      nonlocal ptr
      nonlocal input_ptr
      MACHINE['ptr'] = ptr                                          # i didn't want to change the code too much
      MACHINE['input_ptr'] = input_ptr                              # so i only update MACHINE before returning

    PROGRAM = MACHINE['MEMORY']
    INPUT = MACHINE['input']                                        # contains full history of inputs

    ptr = MACHINE['ptr']
    input_ptr = MACHINE['input_ptr']
    
    OUTPUT = []                                                     # every run resets OUTPUT list

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
        param3 = PROGRAM[ptr + 3]                                   # address to write sum

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
        assert 0 <= input_ptr < len(INPUT), f"OUT OF INPUTS WITH input_ptr: {input_ptr}"
        PROGRAM[param1] = INPUT[input_ptr]                          # given in function call
        input_ptr += 1

        ptr += 2

      elif opcode == '04':                                          # OUTPUT
        assert in_bounds(ptr + 1, PROGRAM)

        param1 = PROGRAM[ptr + 1]                                   # value to read output

        output = PROGRAM[param1] if mode1 == '0' else param1

        OUTPUT.append(output)

        ptr += 2

        if part == 2:                                               # PART 2 ONLY: "PAUSE" THIS MACHINE
                                                                    # UNTIL WE COME BACK TO IT.
                                                                    # (Return, but save state, so we can recall
                                                                    # this simulate function again later)
          update_ptrs_before_returning()                            # FOR THIS PROBLEM ONLY
          return (MACHINE, OUTPUT, False)

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
        update_ptrs_before_returning()                              # FOR THIS PROBLEM ONLY
        return (MACHINE, OUTPUT, True)

      else:
        assert False, f"UNRECOGNIZED OPCODE: {opcode}"

    assert False, f"OUT OF BOUNDS WITH POINTER AT: {ptr}"


  # ANALYZE

  TIME_AT_START = time.time()

  NUM_AMPS = 5

  INFINITE_LOOP_GUARD = 1000                                        # the real data only goes up to about 10


  PHASE_SETTING_VALUES = (0, 1, 2, 3, 4) if part == 1 \
                          else (5, 6, 7, 8, 9)                      # PART 1: USE PERMUTATIONS OF (0, 1, 2, 3, 4)
                                                                    # PART 2: USE PERMUTATIONS OF (5, 6, 7, 8, 9)
  max_thruster_signal = float('-inf')

  ### EACH ITERATION IS A DIFFERENT PHASE SETTING ###
  for PHASE_SETTINGS in permutations(PHASE_SETTING_VALUES):

    AMPS = [ {
      'MEMORY': PROGRAM.copy(),
      'input': [],
      'ptr': 0,
      'input_ptr': 0,
    } for _ in range(NUM_AMPS) ]

    next_amp_input = 0                                              # always supply 0 as input to the first amp, the first time
    terminated = False                                              # PART 2 ONLY

    ### EACH ITERATION IS A FULL CYCLE OF EACH AMP ###
    for _ in range(INFINITE_LOOP_GUARD):

      ### EACH ITERATION IS ONE AMP RUNNING ITS PROGRAM UNTIL OUTPUT OR TERMINATE ###
      for amp_idx in range(NUM_AMPS):

        if len(AMPS[amp_idx]['input']) == 0:                        # supply the phase setting ONCE
          phase_setting = PHASE_SETTINGS[amp_idx]
          AMPS[amp_idx]['input'].append(phase_setting)

        AMPS[amp_idx]['input'].append(next_amp_input)               # always supply the next amp input
        
        MACHINE, OUTPUT, terminated = simulate(AMPS[amp_idx])

        if part == 2 and terminated:                                # IN PART 1, ALL AMPS TERMINATE
                                                                    # IN PART 2, ONLY AMP 0 TERMINATES
          break

        else:
          assert len(OUTPUT) == 1, f"OUTPUT FOR AMP {amp_idx} DID NOT HAVE LENGTH 1: {OUTPUT} | {terminated}"
          next_amp_input = OUTPUT[0]

          if amp_idx == NUM_AMPS - 1:
            if next_amp_input > max_thruster_signal:
              max_thruster_signal = next_amp_input
              if DISPLAY_EXTRA_INFO:
                print(f"New max thruster signal {max_thruster_signal} found with phase settings {PHASE_SETTINGS}")
            break

      if terminated: break

  return max_thruster_signal


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = intcode
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

sample_input = """3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5"""

sample_input2 = """3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 255590
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 139629729
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 18216
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 58285150
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)