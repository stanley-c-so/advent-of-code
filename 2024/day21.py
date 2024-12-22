"""

--- Day 21: Keypad Conundrum ---

As you teleport onto Santa's Reindeer-class starship, The Historians begin to panic: someone from their search party is missing. A quick life-form scan by the ship's computer reveals that when the missing Historian teleported, he arrived in another part of the ship.

The door to that area is locked, but the computer can't open it; it can only be opened by physically typing the door codes (your puzzle input) on the numeric keypad on the door.

The numeric keypad has four rows of buttons: 789, 456, 123, and finally an empty gap followed by 0A. Visually, they are arranged like this:

+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+
Unfortunately, the area outside the door is currently depressurized and nobody can go near the door. A robot needs to be sent instead.

The robot has no problem navigating the ship and finding the numeric keypad, but it's not designed for button pushing: it can't be told to push a specific button directly. Instead, it has a robotic arm that can be controlled remotely via a directional keypad.

The directional keypad has two rows of buttons: a gap / ^ (up) / A (activate) on the first row and < (left) / v (down) / > (right) on the second row. Visually, they are arranged like this:

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
When the robot arrives at the numeric keypad, its robotic arm is pointed at the A button in the bottom right corner. After that, this directional keypad remote control must be used to maneuver the robotic arm: the up / down / left / right buttons cause it to move its arm one button in that direction, and the A button causes the robot to briefly move forward, pressing the button being aimed at by the robotic arm.

For example, to make the robot type 029A on the numeric keypad, one sequence of inputs on the directional keypad you could use is:

< to move the arm from A (its initial position) to 0.
A to push the 0 button.
^A to move the arm to the 2 button and push it.
>^^A to move the arm to the 9 button and push it.
vvvA to move the arm to the A button and push it.
In total, there are three shortest possible sequences of button presses on this directional keypad that would cause the robot to type 029A: <A^A>^^AvvvA, <A^A^>^AvvvA, and <A^A^^>AvvvA.

Unfortunately, the area containing this directional keypad remote control is currently experiencing high levels of radiation and nobody can go near it. A robot needs to be sent instead.

When the robot arrives at the directional keypad, its robot arm is pointed at the A button in the upper right corner. After that, a second, different directional keypad remote control is used to control this robot (in the same way as the first robot, except that this one is typing on a directional keypad instead of a numeric keypad).

There are multiple shortest possible sequences of directional keypad button presses that would cause this robot to tell the first robot to type 029A on the door. One such sequence is v<<A>>^A<A>AvA<^AA>A<vAAA>^A.

Unfortunately, the area containing this second directional keypad remote control is currently -40 degrees! Another robot will need to be sent to type on that directional keypad, too.

There are many shortest possible sequences of directional keypad button presses that would cause this robot to tell the second robot to tell the first robot to eventually type 029A on the door. One such sequence is <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A.

Unfortunately, the area containing this third directional keypad remote control is currently full of Historians, so no robots can find a clear path there. Instead, you will have to type this sequence yourself.

Were you to choose this sequence of button presses, here are all of the buttons that would be pressed on your directional keypad, the two robots' directional keypads, and the numeric keypad:

<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
v<<A>>^A<A>AvA<^AA>A<vAAA>^A
<A^A>^^AvvvA
029A
In summary, there are the following keypads:

One directional keypad that you are using.
Two directional keypads that robots are using.
One numeric keypad (on a door) that a robot is using.
It is important to remember that these robots are not designed for button pushing. In particular, if a robot arm is ever aimed at a gap where no button is present on the keypad, even for an instant, the robot will panic unrecoverably. So, don't do that. All robots will initially aim at the keypad's A key, wherever it is.

To unlock the door, five codes will need to be typed on its numeric keypad. For example:

029A
980A
179A
456A
379A
For each of these, here is a shortest sequence of button presses you could type to cause the desired code to be typed on the numeric keypad:

029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A
179A: <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
456A: <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A
379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
The Historians are getting nervous; the ship computer doesn't remember whether the missing Historian is trapped in the area containing a giant electromagnet or molten lava. You'll need to make sure that for each of the five codes, you find the shortest sequence of button presses necessary.

The complexity of a single code (like 029A) is equal to the result of multiplying these two values:

The length of the shortest sequence of button presses you need to type on your directional keypad in order to cause the code to be typed on the numeric keypad; for 029A, this would be 68.
The numeric part of the code (ignoring leading zeroes); for 029A, this would be 29.
In the above example, complexity of the five codes can be found by calculating 68 * 29, 60 * 980, 68 * 179, 64 * 456, and 64 * 379. Adding these together produces 126384.

Find the fewest number of button presses you'll need to perform in order to cause the robot in front of the door to type each code. What is the sum of the complexities of the five codes on your list?


--- Part Two ---

Just as the missing Historian is released, The Historians realize that a second member of their search party has also been missing this entire time!

A quick life-form scan reveals the Historian is also trapped in a locked area of the ship. Due to a variety of hazards, robots are once again dispatched, forming another chain of remote control keypads managing robotic-arm-wielding robots.

This time, many more robots are involved. In summary, there are the following keypads:

One directional keypad that you are using.
25 directional keypads that robots are using.
One numeric keypad (on a door) that a robot is using.
The keypads form a chain, just like before: your directional keypad controls a robot which is typing on a directional keypad which controls a robot which is typing on a directional keypad... and so on, ending with the robot which is typing on the numeric keypad.

The door codes are the same this time around; only the number of robots and directional keypads has changed.

Find the fewest number of button presses you'll need to perform in order to cause the robot in front of the door to type each code. What is the sum of the complexities of the five codes on your list?

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

def make_robot_push_buttons_on_keypad_indirectly_through_chain_of_more_robots(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  TARGETS = input_str.split('\n')


  # CONSTANTS

  A = 'A'
  U, D, L, R = '^', 'v', '<', '>'

  NUMERIC_KEYPAD_COORDS_BY_C = {
    '7': (0, 0),
    '8': (0, 1),
    '9': (0, 2),
    '4': (1, 0),
    '5': (1, 1),
    '6': (1, 2),
    '1': (2, 0),
    '2': (2, 1),
    '3': (2, 2),
    '0': (3, 1),
    A: (3, 2),
  }

  DIRECTIONAL_KEYPAD_COORDS_BY_C = {
    U: (0, 1),
    A: (0, 2),
    L: (1, 0),
    D: (1, 1),
    R: (1, 2),
  }

  SYMBOL_BY_DELTAS = {
    (-1, 0): U,
    (0, -1): L,
    (+1, 0): D,
    (0, +1): R,
  }

  NUM_ROBOTS = 3 if part == 1 else 26                                                               # PART 1: 3 ROBOTS (1 NUMERIC KEYPAD, 2 DIRECTIONAL KEYPADS) + YOU
                                                                                                    # PART 2: 26 ROBOTS (1 NUMERIC KEYPAD, 25 DIRECTIONAL KEYPADS) + YOU


  # UTILITY

  MEMO_KEYPAD_ROUTES = {}                                                                           # can memoize, but this is not expensive anyway
  def keypad_all_routes(a, b, COORD_REF, FORBIDDEN):
    serial = (FORBIDDEN, a, b)
    if serial not in MEMO_KEYPAD_ROUTES:
      start_row, start_col = COORD_REF[a]
      end_row, end_col = COORD_REF[b]
      dy, dx = end_row - start_row, end_col - start_col
      ways = set()
      path = []
      def backtrack(row, col):
        if (row, col) == FORBIDDEN:
          return
        elif (row, col) == (end_row, end_col):
          ways.add(''.join(path + [A]))
        else:
          if row != end_row:
            margin = 1 if dy > 0 else -1
            deltas = (margin, 0)
            path.append(SYMBOL_BY_DELTAS[deltas])
            backtrack(row + margin, col)
            path.pop()
          if col != end_col:
            margin = 1 if dx > 0 else -1
            deltas = (0, margin)
            path.append(SYMBOL_BY_DELTAS[deltas])
            backtrack(row, col + margin)
            path.pop()
      backtrack(start_row, start_col)
      MEMO_KEYPAD_ROUTES[serial] = ways
    return MEMO_KEYPAD_ROUTES[serial]


  MEMO_SHORTEST_LEN_BY_SEGMENT_AND_LEVEL = {}                                                       # ABSOLUTELY MUST MEMOIZE FOR PART 2!
  def shortest_len(segment, level):                                                                 # by definition, a segment ends in A.
    assert segment[-1] == A, "ERROR: SEGMENT {segment} DOES NOT END IN A"

    ### BASE CASE ###

    if level == NUM_ROBOTS + 1:                                                                     # BASE CASE: the button presser is YOU, not a robot
      return len(segment)                                                                           # then you can directly press the buttons yourself

    ### RECURSIVE CASE ###

    COORDS_BY_C_REF = NUMERIC_KEYPAD_COORDS_BY_C if level == 1 else DIRECTIONAL_KEYPAD_COORDS_BY_C  # robot 1 uses a numeric keypad (forbidden cell is (3, 0));
    FORBIDDEN = (3, 0) if level == 1 else (0, 0)                                                    # all other button pressers use a directional keypad (forbidden (0, 0))

    serial = (level, segment)
    if serial not in MEMO_SHORTEST_LEN_BY_SEGMENT_AND_LEVEL:
      total = 0
      for i in range(len(segment)):
        a = segment[i - 1] if i > 0 else A                                                          # origin of any segment is A
        b = segment[i]
        shortest = float('inf')
        for way in keypad_all_routes(a, b, COORDS_BY_C_REF, FORBIDDEN):                             # each way is a possible segment for higher robot to make robot go from a to b
          cost_of_going_from_a_to_b = shortest_len(way, level + 1)                                  # to find its cost, recurse
          shortest = min(shortest, cost_of_going_from_a_to_b)                                       # keep the minimum cost found
        total += shortest                                                                           # add the minimum cost (a to b) to the running total (for the entire sequence)
      MEMO_SHORTEST_LEN_BY_SEGMENT_AND_LEVEL[serial] = total

    return MEMO_SHORTEST_LEN_BY_SEGMENT_AND_LEVEL[serial]



  # ANALYZE

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  total = 0

  for TARGET in TARGETS:

    sequence_len = shortest_len(TARGET, 1)                                                          # NOTE: all TARGETs happily end in a single A.
                                                                                                    # this matches the pattern we assume for higher robot levels:
                                                                                                    # to make a lower robot hit a button, the higher robot ultimately
                                                                                                    # needs to press A. so, after every time a lower robot presses
                                                                                                    # any button, the higher robot has returned to its starting position of A.
                                                                                                    # this allows us to break down paths of the higher robot into segments
                                                                                                    # that all end in A.
    complexity = sequence_len * int(TARGET[:-1])
    total += complexity

    if DISPLAY_EXTRA_INFO:
      print(f"Code {TARGET} complexity: {sequence_len} * {int(TARGET[:-1])} = {complexity}")

  if not DEBUG or True:
    print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")                                       # 0.00 seconds

  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = make_robot_push_buttons_on_keypad_indirectly_through_chain_of_more_robots
skipped_tests = set([ 2, 3 ])
skipped_tests = set([ 3 ])
skipped_tests = set([  ])

# skipped_tests = set([ 1, 2 ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """029A
980A
179A
456A
379A"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 126384
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 217662
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 263617786809000
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)