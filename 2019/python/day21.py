"""

--- Day 21: Springdroid Adventure ---
You lift off from Pluto and start flying in the direction of Santa.

While experimenting further with the tractor beam, you accidentally pull an asteroid directly into your ship! It deals significant damage to your hull and causes your ship to begin tumbling violently.

You can send a droid out to investigate, but the tumbling is causing enough artificial gravity that one wrong step could send the droid through a hole in the hull and flying out into space.

The clear choice for this mission is a droid that can jump over the holes in the hull - a springdroid.

You can use an Intcode program (your puzzle input) running on an ASCII-capable computer to program the springdroid. However, springdroids don't run Intcode; instead, they run a simplified assembly language called springscript.

While a springdroid is certainly capable of navigating the artificial gravity and giant holes, it has one downside: it can only remember at most 15 springscript instructions.

The springdroid will move forward automatically, constantly thinking about whether to jump. The springscript program defines the logic for this decision.

Springscript programs only use Boolean values, not numbers or strings. Two registers are available: T, the temporary value register, and J, the jump register. If the jump register is true at the end of the springscript program, the springdroid will try to jump. Both of these registers start with the value false.

Springdroids have a sensor that can detect whether there is ground at various distances in the direction it is facing; these values are provided in read-only registers. Your springdroid can detect ground at four distances: one tile away (A), two tiles away (B), three tiles away (C), and four tiles away (D). If there is ground at the given distance, the register will be true; if there is a hole, the register will be false.

There are only three instructions available in springscript:

AND X Y sets Y to true if both X and Y are true; otherwise, it sets Y to false.
OR X Y sets Y to true if at least one of X or Y is true; otherwise, it sets Y to false.
NOT X Y sets Y to true if X is false; otherwise, it sets Y to false.
In all three instructions, the second argument (Y) needs to be a writable register (either T or J). The first argument (X) can be any register (including A, B, C, or D).

For example, the one-instruction program NOT A J means "if the tile immediately in front of me is not ground, jump".

Or, here is a program that jumps if a three-tile-wide hole (with ground on the other side of the hole) is detected:

NOT A J
NOT B T
AND T J
NOT C T
AND T J
AND D J
The Intcode program expects ASCII inputs and outputs. It will begin by displaying a prompt; then, input the desired instructions one per line. End each line with a newline (ASCII code 10). When you have finished entering your program, provide the command WALK followed by a newline to instruct the springdroid to begin surveying the hull.

If the springdroid falls into space, an ASCII rendering of the last moments of its life will be produced. In these, @ is the springdroid, # is hull, and . is empty space. For example, suppose you program the springdroid like this:

NOT D J
WALK
This one-instruction program sets J to true if and only if there is no ground four tiles away. In other words, it attempts to jump into any hole it finds:

.................
.................
@................
#####.###########

.................
.................
.@...............
#####.###########

.................
..@..............
.................
#####.###########

...@.............
.................
.................
#####.###########

.................
....@............
.................
#####.###########

.................
.................
.....@...........
#####.###########

.................
.................
.................
#####@###########
However, if the springdroid successfully makes it across, it will use an output instruction to indicate the amount of damage to the hull as a single giant integer outside the normal ASCII range.

Program the springdroid with logic that allows it to survey the hull without falling into space. What amount of hull damage does it report?


--- Part Two ---

There are many areas the springdroid can't reach. You flip through the manual and discover a way to increase its sensor range.

Instead of ending your springcode program with WALK, use RUN. Doing this will enable extended sensor mode, capable of sensing ground up to nine tiles away. This data is available in five new read-only registers:

Register E indicates whether there is ground five tiles away.
Register F indicates whether there is ground six tiles away.
Register G indicates whether there is ground seven tiles away.
Register H indicates whether there is ground eight tiles away.
Register I indicates whether there is ground nine tiles away.
All other functions remain the same.

Successfully survey the rest of the hull by ending your program with RUN. What amount of hull damage does the springdroid now report?

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
        PROGRAM_write(write_idx, INPUT[input_ptr])
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

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  MAX_LINES = 15                                                                          # doesn't count WALK/RUN

  """
  Notes on physics:

  If you are currently over a hole and you haven't jumped, you fall. Therefore, jump BEFORE the hole.
  If you jump now, your gap with the ground remains 0. On the next tick it will be 1, then 2, then 1, then 0.
  If you are over a hole *the moment your gap is back down to 0*, you fall.
  
  Therefore, that the space 3 ahead of you is land is NECESSARY BUT NOT SUFFICIENT to make a complete journey.
  
  When would it not be sufficient? When the terrain ahead forces you to make another jump that is unsafe.
  This never happens in part 1. However, see further analysis in part 2.

  
  Part 1 logic:
  
  Can you simply always jump as long as the landing zone (D) is good? No. If you make an unnecessary
  jump, you may end up on a 1-island that dooms you (see above).

  However, if there IS a hole among A, B, or C, then you definitely need to jump soon, if not immediately.
  If D is safe, then you can actually jump right now and clear any hole of size 1-3 by landing safely on D.
  There's no situation with a hole followed by a 1-size land followed by a hole.

  So the logic in my instructions is to jump if there is at least one hole among A, B, C, but D is safe.

  The first three lines (OR A T, AND B T, AND C T) makes sure that the temporary register, T, ends up true
  if A, B, and C are ALL true. The next line (NOT T J) reverses this logic and saves it into J, which means
  we will jump if and only if it is NOT true that A, B, and C are all true (in other words, that there is at
  least one hole among A, B, C). Finally, we add the last line (AND D J) to enforce that D must be safe.

  Part 2 logic:

  ### TRAP: NEXT POSITION IS HOLE ###

      cbaABCD
  .................
  .................
  ......@..........
  ??????#.??.##.###
      ^^ should have jumped from one of these spots, if possible
  
  From this position, it would not be safe to jump. But it would also not be safe to avoid jumping.
  So being here (grounded) would lead to failure. The only way to negotiate this would have been to
  jump EARLIER, and land on wherever there is land (B or C).

  This is defined by:
  - A is hole
  - D is hole
  - B and/or C is land (they cannot both be holes or else A-D would be a 4-size hole which cannot be negotiated.)

  You should have jumped from c (if B is land). Only if not possible, you should have jumped from b.

  From c's perspective:
  - C is hole
  - D is land
  - F is hole

  From b's perspective:
  - B is hole
  - C is hole
  - D is land
  - E is hole
  
  
  ### TRAP: NEXT POSITION IS LAND, BUT THE POSITION AFTER THAT IS HOLE ###

       baABCDE
  .................
  .................
  ......@..........
  ??????##.#..#####
       ^ should have jumped from here, if possible

  From this position, jumping immediately would fail. Jumping at the next position would also fall
  into the same 2-size hole. But not jumping would fall into the 1-size hole. The only way to negotiate
  this would have been to jump EARLIER, and land on the 1-island.

  This is defined by:
  - A is land
  - B is hole
  - D is hole
  - E is hole
  - (C must be land, because otherwise B-E would be a 4-size hole which cannot be negotiated.)

  You should have jumped from b.

  From b's perspective:
  - B is land
  - C is hole
  - D is land
  - E is hole
  - F is hole


  ### ASSUMING THIS COVERS EVERYTHING... ###

  Jump if D is land, AND you do NOT end up in one of the traps above, which from your perspective means:

  Next position is hole:
  - E is hole
  - H is hole
  - F and/or G is land (they cannot both be holes)

  Next position is land, but the position after that is hole:
  - E is land
  - F is hole
  - H is hole
  - I is hole
  - (G must be land)

  # Additionally, remember that you should always jump if A is hole.

  Simplifying - set J to true, unless ANY of the following conditions disqualify jumping:

  - If not D, you CANNOT jump
  - If A, B, C (and D), NO NEED to jump. Safer not to, in case the course requires you to jump
    from A, B, or C.
  - If not E, not H, it is not safe to jump (trap: next position is hole)
  - If E, and not F, not H, not I, it is not safe to jump (trap: next position is land, but the position
    after that is hole)

  Try to use only the T register to check each condition, and save the result to J
    
  """

  part_1_instructions = (''                                                                      # solved manually
    
    # At least one of A, B, C must be hole == J is false if A, B, C are all true

    + 'OR A T' + '\n'                             # make T true if A...
    + 'AND B T' + '\n'                            # ...and B...
    + 'AND C T' + '\n'                            # ...and C...
    + 'NOT T J' + '\n'                            # ...and set J to false if T is true

    # D must be land

    + 'AND D J' + '\n'                            # D must be true for J to stay true

    + 'WALK' + '\n'
  )

  part_2_instructions = (''                                                                      # solved manually
    
    # Flip J to true by default

    + 'NOT J J' + '\n'

    # At least one of A, B, C must be hole == J is false if A, B, C are all true
    # NOTE: It is VERY important that this block come first before the next two.
    # The other two blocks begin with NOT x T, which is unaffected by the prior state
    # of T. However, this first block assumes that T begins as its default false.

    + 'OR A T' + '\n'                             # make T true if A...
    + 'AND B T' + '\n'                            # ...and B...
    + 'AND C T' + '\n'                            # ...and C...
    + 'NOT T J' + '\n'                            # ...and set J to false if T is true

    # If E and H are holes, set J to false == if either E or H are true, don't change J

    + 'NOT J T' + '\n'                            # we only care to analyze if J hasn't yet been set to false. if J is true, init T to false 
    + 'OR E T' + '\n'                             # flip T to true if either E is true...
    + 'OR H T' + '\n'                             # ...or H is true...
    + 'AND T J' + '\n'                            # ...and only allow J to remain true if T was flipped to true (by E or H)

    # If E is land, but F, H, and I are holes, set J to false == if E is hole, or F, H, or I are land, don't change J

    + 'NOT E T' + '\n'                            # make T true if E is false...
    + 'OR F T' + '\n'                             # ...or F is true...
    + 'OR H T' + '\n'                             # ...or H is true...
    + 'OR I T' + '\n'                             # ...or I is true...
    + 'AND T J' + '\n'                            # ...and only allow J to remain true if T was flipped to true (by E, F, H, or I)

    # D must be land

    + 'AND D J' + '\n'

    + 'RUN' + '\n'
  )

  instructions = part_1_instructions if part == 1 else part_2_instructions
  num_lines = len([ line for line in instructions.split('\n') if line and line not in ('WALK', 'RUN') ])
  assert num_lines <= MAX_LINES, f"THE SPRINGDROID CAN ONLY REMEMBER AT MOST {MAX_LINES} SPRINGSCRIPT INSTRUCTIONS, NOT {num_lines}"

  INPUT = str_to_ascii_list(instructions)
  MEMORY, OUTPUT = simulate(PROGRAM, INPUT)

  rtn = None
  if not is_ascii_range(OUTPUT[-1]):
    rtn = OUTPUT.pop()

  RAW_OUTPUT_AS_STR = ascii_list_to_str(OUTPUT)

  if DISPLAY_EXTRA_INFO:
    print(RAW_OUTPUT_AS_STR)

  assert rtn != None, f"DID NOT FIND A SOLUTION"
  print(f"Final output: {rtn}")
  if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")                 # ~0.56 seconds for part 2
  return rtn


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
test_expected = 19347995
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1141826552
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)