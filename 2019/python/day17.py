"""

--- Day 17: Set and Forget ---

An early warning system detects an incoming solar flare and automatically activates the ship's electromagnetic shield. Unfortunately, this has cut off the Wi-Fi for many small robots that, unaware of the impending danger, are now trapped on exterior scaffolding on the unsafe side of the shield. To rescue them, you'll have to act quickly!

The only tools at your disposal are some wired cameras and a small vacuum robot currently asleep at its charging station. The video quality is poor, but the vacuum robot has a needlessly bright LED that makes it easy to spot no matter where it is.

An Intcode program, the Aft Scaffolding Control and Information Interface (ASCII, your puzzle input), provides access to the cameras and the vacuum robot. Currently, because the vacuum robot is asleep, you can only access the cameras.

Running the ASCII program on your Intcode computer will provide the current view of the scaffolds. This is output, purely coincidentally, as ASCII code: 35 means #, 46 means ., 10 starts a new line of output below the current one, and so on. (Within a line, characters are drawn left-to-right.)

In the camera output, # represents a scaffold and . represents open space. The vacuum robot is visible as ^, v, <, or > depending on whether it is facing up, down, left, or right respectively. When drawn like this, the vacuum robot is always on a scaffold; if the vacuum robot ever walks off of a scaffold and begins tumbling through space uncontrollably, it will instead be visible as X.

In general, the scaffold forms a path, but it sometimes loops back onto itself. For example, suppose you can see the following view from the cameras:

..#..........
..#..........
#######...###
#.#...#...#.#
#############
..#...#...#..
..#####...^..
Here, the vacuum robot, ^ is facing up and sitting at one end of the scaffold near the bottom-right of the image. The scaffold continues up, loops across itself several times, and ends at the top-left of the image.

The first step is to calibrate the cameras by getting the alignment parameters of some well-defined points. Locate all scaffold intersections; for each, its alignment parameter is the distance between its left edge and the left edge of the view multiplied by the distance between its top edge and the top edge of the view. Here, the intersections from the above image are marked O:

..#..........
..#..........
##O####...###
#.#...#...#.#
##O###O###O##
..#...#...#..
..#####...^..
For these intersections:

The top-left intersection is 2 units from the left of the image and 2 units from the top of the image, so its alignment parameter is 2 * 2 = 4.
The bottom-left intersection is 2 units from the left and 4 units from the top, so its alignment parameter is 2 * 4 = 8.
The bottom-middle intersection is 6 from the left and 4 from the top, so its alignment parameter is 24.
The bottom-right intersection's alignment parameter is 40.
To calibrate the cameras, you need the sum of the alignment parameters. In the above example, this is 76.

Run your ASCII program. What is the sum of the alignment parameters for the scaffold intersections?


--- Part Two ---

Now for the tricky part: notifying all the other robots about the solar flare. The vacuum robot can do this automatically if it gets into range of a robot. However, you can't see the other robots on the camera, so you need to be thorough instead: you need to make the vacuum robot visit every part of the scaffold at least once.

The vacuum robot normally wanders randomly, but there isn't time for that today. Instead, you can override its movement logic with new rules.

Force the vacuum robot to wake up by changing the value in your ASCII program at address 0 from 1 to 2. When you do this, you will be automatically prompted for the new movement rules that the vacuum robot should use. The ASCII program will use input instructions to receive them, but they need to be provided as ASCII code; end each line of logic with a single newline, ASCII code 10.

First, you will be prompted for the main movement routine. The main routine may only call the movement functions: A, B, or C. Supply the movement functions to use as ASCII text, separating them with commas (,, ASCII code 44), and ending the list with a newline (ASCII code 10). For example, to call A twice, then alternate between B and C three times, provide the string A,A,B,C,B,C,B,C and then a newline.

Then, you will be prompted for each movement function. Movement functions may use L to turn left, R to turn right, or a number to move forward that many units. Movement functions may not call other movement functions. Again, separate the actions with commas and end the list with a newline. For example, to move forward 10 units, turn left, move forward 8 units, turn right, and finally move forward 6 units, provide the string 10,L,8,R,6 and then a newline.

Finally, you will be asked whether you want to see a continuous video feed; provide either y or n and a newline. Enabling the continuous video feed can help you see what's going on, but it also requires a significant amount of processing power, and may even cause your Intcode computer to overheat.

Due to the limited amount of memory in the vacuum robot, the ASCII definitions of the main routine and the movement functions may each contain at most 20 characters, not counting the newline.

For example, consider the following camera feed:

#######...#####
#.....#...#...#
#.....#...#...#
......#...#...#
......#...###.#
......#.....#.#
^########...#.#
......#.#...#.#
......#########
........#...#..
....#########..
....#...#......
....#...#......
....#...#......
....#####......
In order for the vacuum robot to visit every part of the scaffold at least once, one path it could take is:

R,8,R,8,R,4,R,4,R,8,L,6,L,2,R,4,R,4,R,8,R,8,R,8,L,6,L,2
Without the memory limit, you could just supply this whole string to function A and have the main routine call A once. However, you'll need to split it into smaller parts.

One approach is:

Main routine: A,B,C,B,A,C
(ASCII input: 65, 44, 66, 44, 67, 44, 66, 44, 65, 44, 67, 10)
Function A:   R,8,R,8
(ASCII input: 82, 44, 56, 44, 82, 44, 56, 10)
Function B:   R,4,R,4,R,8
(ASCII input: 82, 44, 52, 44, 82, 44, 52, 44, 82, 44, 56, 10)
Function C:   L,6,L,2
(ASCII input: 76, 44, 54, 44, 76, 44, 50, 10)
Visually, this would break the desired path into the following parts:

A,        B,            C,        B,            A,        C
R,8,R,8,  R,4,R,4,R,8,  L,6,L,2,  R,4,R,4,R,8,  R,8,R,8,  L,6,L,2

CCCCCCA...BBBBB
C.....A...B...B
C.....A...B...B
......A...B...B
......A...CCC.B
......A.....C.B
^AAAAAAAA...C.B
......A.A...C.B
......AAAAAA#AB
........A...C..
....BBBB#BBBB..
....B...A......
....B...A......
....B...A......
....BBBBA......
Of course, the scaffolding outside your ship is much more complex.

As the vacuum robot finds other robots and notifies them of the impending solar flare, it also can't help but leave them squeaky clean, collecting any space dust it finds. Once it finishes the programmed set of movements, assuming it hasn't drifted off into space, the cleaning robot will return to its docking station and report the amount of space dust it collected as a large, non-ASCII value in a single output instruction.

After visiting every part of the scaffold at least once, how much dust does the vacuum robot report it has collected?

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
  
  def is_ascii_range(n):
    HIGHEST_VALID_ASCII = 55295
    return 0 <= n <= HIGHEST_VALID_ASCII


  def simulate(PROGRAM, INPUT):

    INFINITE_LOOP_GUARD = 10 ** 8                                                         # part 2 real data goes to 
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

  TIME_AT_START = time.time()

  part_2_rtn = None
  show_continuous_feed = True                                                             # HIGHLY RECOMMEND FALSE
  show_continuous_feed = False

  INPUT = []

  if part == 2:                                                                           # PART 2: WAKE ROBOT UP AND GIVE IT MOVE INSTRUCTIONS 
    PROGRAM[0] = 2
    INPUT = str_to_ascii_list(
      'A,B,A,B,C,C,B,A,B,C' + '\n'                                                        # solved manually
      + 'L,10,R,10,L,10,L,10' + '\n'
      + 'R,10,R,12,L,12' + '\n'
      + 'R,12,L,12,R,6' + '\n'
      + ('y' if show_continuous_feed else 'n') + '\n'
    )

  MEMORY, OUTPUT = simulate(PROGRAM, INPUT)

  if part == 2:
    assert not is_ascii_range(OUTPUT[-1]), f"FINAL OUTPUT {OUTPUT[-1]} SHOULD BE OUTSIDE NORMAL ASCII RANGE"
    part_2_rtn = OUTPUT.pop()                                                             # the final number in output is the answer

  RAW_MAP_AS_STR = ascii_list_to_str(OUTPUT)
  GRID = [ [ c for c in row ] for row in RAW_MAP_AS_STR.split('\n') if row ]

  H, W = len(GRID), len(GRID[0])

  SCAFFOLD, EMPTY = '#', '.'

  if DISPLAY_EXTRA_INFO:
    print(RAW_MAP_AS_STR)

  if part == 1:                                                                           # PART 1: FIND ALL INTERSECTIONS IN THE PATH

    total = 0

    for row in range(1, H - 1):
      for col in range(1, W - 1):
        if {
          GRID[row][col],
          GRID[row + 1][col],
          GRID[row - 1][col],
          GRID[row][col + 1],
          GRID[row][col - 1],
        } == { SCAFFOLD }:
          
          total += row * col

    return total
  
  else:                                                                                   # PART 2: RETURN FINAL OUTPUT AFTER CORRECTLY GUIDING ROBOT

    return part_2_rtn


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = intcode
skipped_tests = set([ 2 ])
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
test_expected = 7720
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1681189
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)