"""

--- Day 25: Cryostasis ---

As you approach Santa's ship, your sensors report two important details:

First, that you might be too late: the internal temperature is -40 degrees.

Second, that one faint life signature is somewhere on the ship.

The airlock door is locked with a code; your best option is to send in a small droid to investigate the situation. You attach your ship to Santa's, break a small hole in the hull, and let the droid run in before you seal it up again. Before your ship starts freezing, you detach your ship and set it to automatically stay within range of Santa's ship.

This droid can follow basic instructions and report on its surroundings; you can communicate with it through an Intcode program (your puzzle input) running on an ASCII-capable computer.

As the droid moves through its environment, it will describe what it encounters. When it says Command?, you can give it a single instruction terminated with a newline (ASCII code 10). Possible instructions are:

Movement via north, south, east, or west.
To take an item the droid sees in the environment, use the command take <name of item>. For example, if the droid reports seeing a red ball, you can pick it up with take red ball.
To drop an item the droid is carrying, use the command drop <name of item>. For example, if the droid is carrying a green ball, you can drop it with drop green ball.
To get a list of all of the items the droid is currently carrying, use the command inv (for "inventory").
Extra spaces or other characters aren't allowed - instructions must be provided precisely.

Santa's ship is a Reindeer-class starship; these ships use pressure-sensitive floors to determine the identity of droids and crew members. The standard configuration for these starships is for all droids to weigh exactly the same amount to make them easier to detect. If you need to get past such a sensor, you might be able to reach the correct weight by carrying items from the environment.

Look around the ship and see if you can find the password for the main airlock.


--- Part Two ---

As you move through the main airlock, the air inside the ship is already heating up to reasonable levels. Santa explains that he didn't notice you coming because he was just taking a quick nap. The ship wasn't frozen; he just had the thermostat set to "North Pole".

You make your way over to the navigation console. It beeps. "Status: Stranded. Please supply measurements from 49 stars to recalibrate."

"49 stars? But the Elves told me you needed fifty--"

Santa just smiles and nods his head toward the window. There, in the distance, you can see the center of the Solar System: the Sun!

The navigation console beeps again.

If you like, you can [Align the Warp Drive again].

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

  def str_to_ascii_list(s):
    return [ ord(c) for c in s ]

  def ascii_list_to_str(lst):
    return ''.join([ chr(n) for n in lst ])

  NO_PARAM_COMMANDS = { 'north', 'south', 'east', 'west', 'inv' }
  PARAM_COMMANDS = { 'take', 'drop' }
  def validate_input(s):
    if s == None: return False
    if s == 'quit': return True
    if s in NO_PARAM_COMMANDS: return True
    split = [ term for term in s.split(' ') if term ]
    return len(split) > 1 and split[0] in PARAM_COMMANDS

  def update_ptrs_before_returning(STATE, ptr, relative_base):                            # FOR THIS PROBLEM ONLY
    STATE['ptr'] = ptr                                                                    # i didn't want to change the code too much
    STATE['relative_base'] = relative_base                                                # so i only update MACHINE before returning

  def simulate(STATE, INPUT):

    INFINITE_LOOP_GUARD = 10 ** 5                                                         # should be good enough

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

    PROGRAM = STATE['MEMORY']
    ptr = STATE['ptr']
    relative_base = STATE['relative_base']

    input_ptr = 0
    
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
        PROGRAM_write(write_idx, INPUT[input_ptr])
        input_ptr += 1

        ptr += 2

      elif opcode == '04':                                                                # OUTPUT

        output = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        OUTPUT.append(output)

        ptr += 2

        if not (0 <= input_ptr < len(INPUT)) and len(OUTPUT) >= 9 and OUTPUT[-9:] == str_to_ascii_list('Command?' + '\n'):
          update_ptrs_before_returning(STATE, ptr, relative_base)

          RAW_OUTPUT_AS_STR = ascii_list_to_str(OUTPUT)
          print(RAW_OUTPUT_AS_STR)

          return STATE, OUTPUT, False, None

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

      elif opcode == '09':                                                                # CHANGE RELATIVE BASE

        delta = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        relative_base += delta

        ptr += 2

      elif opcode == '99':                                                                # TERMINATE

        update_ptrs_before_returning(STATE, ptr, relative_base)

        RAW_OUTPUT_AS_STR = ascii_list_to_str(OUTPUT)
        print(RAW_OUTPUT_AS_STR)

        return STATE, OUTPUT, True, RAW_OUTPUT_AS_STR

      else:

        assert False, f"UNRECOGNIZED OPCODE: {opcode}"

    assert False, f"TRIPPED INFINITE LOOP GUARD: EXCEEDED {INFINITE_LOOP_GUARD} ITERATIONS"


  # ANALYZE

  """

  MAP:

                        G
                        |
               ?--o--H--o
                        |
               x--E--D--C
                  |  |  |
                  x  F  .
                        .   for some reason, space overlaps, so to make that not happen on my map, i extend this vertical corridor out
               x--o--x  .
                  |     |
               B--x--o--S
                        |
                        A

  LEGEND:

  S: start
  A: fixed point
  B: hologram
  C: candy cane
  D: antenna
  E: shell
  F: whirled peas
  G: polygon
  H: fuel cell
  o: nothing to take
  x: if you take whatever is here, you lose
  ?: security checkpoint

  Through trial and error, I discovered you must be carrying the following (and only the following)
  to get past the security checkpoint:

  - A: fixed point
  - C: candy cane
  - E: shell
  - G: polygon

  """

  TIME_AT_START = time.time()

  STATE = {
    'MEMORY': PROGRAM,
    'ptr': 0,
    'relative_base': 0,
  }


  SOLUTION = [
    'south',
    'take fixed point',
    'north',
    'north',
    'take candy cane',
    'west',
    'west',
    'take shell',
    'east',
    'east',
    'north',
    'north',
    'take polygon',
    'south',
    'west',
    'west',
    'west',
  ]
  SOLUTION.reverse()

  SOLVE_PUZZLE_AUTOMATICALLY = True
  SOLVE_PUZZLE_AUTOMATICALLY = False

  STATE, OUTPUT, terminated, RAW_OUTPUT_AS_STR = simulate(STATE, [])
  while not terminated:

    user_command = None
    if SOLVE_PUZZLE_AUTOMATICALLY:
      user_command = SOLUTION.pop()
    else:
      while not validate_input(user_command):
        user_command = input('Input command: ')
    
    if user_command == 'quit': break

    INPUT = str_to_ascii_list(user_command + '\n')
    STATE, OUTPUT, terminated, RAW_OUTPUT_AS_STR = simulate(STATE, INPUT)

  rtn = None
  LEFT_OF_ANSWER = 'Oh, hello! You should be able to get in by typing '
  RIGHT_OF_ANSWER = ' on the keypad at the main airlock.'
  if RAW_OUTPUT_AS_STR != None and LEFT_OF_ANSWER in RAW_OUTPUT_AS_STR:
    output_str_without_left = RAW_OUTPUT_AS_STR.split(LEFT_OF_ANSWER)[-1]
    output_str_without_right = output_str_without_left.split(RIGHT_OF_ANSWER)[0]
    rtn = int(output_str_without_right)
    print('YOU WIN!')
  else:
    print('YOU LOSE!')

  return rtn


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = intcode
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

# Test case 1
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 136839232
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# # Test case 2
# test_input = {
#   'part': 2,
#   'input_str': actual_input,
#   'DEBUG': False,
# }
# test_expected = None
# test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)