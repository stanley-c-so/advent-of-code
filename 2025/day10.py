"""

--- Day 10: Factory ---

Just across the hall, you find a large factory. Fortunately, the Elves here have plenty of time to decorate. Unfortunately, it's because the factory machines are all offline, and none of the Elves can figure out the initialization procedure.

The Elves do have the manual for the machines, but the section detailing the initialization procedure was eaten by a Shiba Inu. All that remains of the manual are some indicator light diagrams, button wiring schematics, and joltage requirements for each machine.

For example:

[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
The manual describes one machine per line. Each line contains a single indicator light diagram in [square brackets], one or more button wiring schematics in (parentheses), and joltage requirements in {curly braces}.

To start a machine, its indicator lights must match those shown in the diagram, where . means off and # means on. The machine has the number of indicator lights shown, but its indicator lights are all initially off.

So, an indicator light diagram like [.##.] means that the machine has four indicator lights which are initially off and that the goal is to simultaneously configure the first light to be off, the second light to be on, the third to be on, and the fourth to be off.

You can toggle the state of indicator lights by pushing any of the listed buttons. Each button lists which indicator lights it toggles, where 0 means the first light, 1 means the second light, and so on. When you push a button, each listed indicator light either turns on (if it was off) or turns off (if it was on). You have to push each button an integer number of times; there's no such thing as "0.5 presses" (nor can you push a button a negative number of times).

So, a button wiring schematic like (0,3,4) means that each time you push that button, the first, fourth, and fifth indicator lights would all toggle between on and off. If the indicator lights were [#.....], pushing the button would change them to be [...##.] instead.

Because none of the machines are running, the joltage requirements are irrelevant and can be safely ignored.

You can push each button as many times as you like. However, to save on time, you will need to determine the fewest total presses required to correctly configure all indicator lights for all machines in your list.

There are a few ways to correctly configure the first machine:

[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
You could press the first three buttons once each, a total of 3 button presses.
You could press (1,3) once, (2,3) once, and (0,1) twice, a total of 4 button presses.
You could press all of the buttons except (1,3) once each, a total of 5 button presses.
However, the fewest button presses required is 2. One way to do this is by pressing the last two buttons ((0,2) and (0,1)) once each.

The second machine can be configured with as few as 3 button presses:

[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
One way to achieve this is by pressing the last three buttons ((0,4), (0,1,2), and (1,2,3,4)) once each.

The third machine has a total of six indicator lights that need to be configured correctly:

[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
The fewest presses required to correctly configure it is 2; one way to do this is by pressing buttons (0,3,4) and (0,1,2,4,5) once each.

So, the fewest button presses required to correctly configure the indicator lights on all of the machines is 2 + 3 + 2 = 7.

Analyze each machine's indicator light diagram and button wiring schematics. What is the fewest button presses required to correctly configure the indicator lights on all of the machines?


--- Part Two ---

All of the machines are starting to come online! Now, it's time to worry about the joltage requirements.

Each machine needs to be configured to exactly the specified joltage levels to function properly. Below the buttons on each machine is a big lever that you can use to switch the buttons from configuring the indicator lights to increasing the joltage levels. (Ignore the indicator light diagrams.)

The machines each have a set of numeric counters tracking its joltage levels, one counter per joltage requirement. The counters are all initially set to zero.

So, joltage requirements like {3,5,4,7} mean that the machine has four counters which are initially 0 and that the goal is to simultaneously configure the first counter to be 3, the second counter to be 5, the third to be 4, and the fourth to be 7.

The button wiring schematics are still relevant: in this new joltage configuration mode, each button now indicates which counters it affects, where 0 means the first counter, 1 means the second counter, and so on. When you push a button, each listed counter is increased by 1.

So, a button wiring schematic like (1,3) means that each time you push that button, the second and fourth counters would each increase by 1. If the current joltage levels were {0,1,2,3}, pushing the button would change them to be {0,2,2,4}.

You can push each button as many times as you like. However, your finger is getting sore from all the button pushing, and so you will need to determine the fewest total presses required to correctly configure each machine's joltage level counters to match the specified joltage requirements.

Consider again the example from before:

[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
Configuring the first machine's counters requires a minimum of 10 button presses. One way to do this is by pressing (3) once, (1,3) three times, (2,3) three times, (0,2) once, and (0,1) twice.

Configuring the second machine's counters requires a minimum of 12 button presses. One way to do this is by pressing (0,2,3,4) twice, (2,3) five times, and (0,1,2) five times.

Configuring the third machine's counters requires a minimum of 11 button presses. One way to do this is by pressing (0,1,2,3,4) five times, (0,1,2,4,5) five times, and (1,2) once.

So, the fewest button presses required to correctly configure the joltage level counters on all of the machines is 10 + 12 + 11 = 33.

Analyze each machine's joltage requirements and button wiring schematics. What is the fewest button presses required to correctly configure the joltage level counters on all of the machines?

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

def solve_linear_programming_problem(part, input_str, DEBUG = False, *args):

  # DATA STRUCTURES

  MACHINES = []


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  ON = '#'

  for line in input_arr:
    components = line.split(' ')
    goal = components[0]
    buttons = components[1:-1]
    joltage = components[-1]

    MACHINES.append({
      'goal': [ c == ON for c in goal[1:-1] ],
      'buttons': [ [ int(n) for n in data[1:-1].split(',') ] for data in buttons ],
      'joltage_goal': [ int(n) for n in joltage[1:-1].split(',') ],
    })

  
  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                                         # PART 1: THE CONSTRAINTS ON THE SYSTEM OF EQUATIONS ARE RELAXED;
                                                                                        # EACH 'EQUATION' MAPS TO JUST ODD/EVEN, NOT A SPECIFIC CONSTANT

    """
    We tackle this with recursion and it just works.
    """
  
    output = 0

    for machine_idx in range(len(MACHINES)):

      # RECURSIVE FUNCTION
      def go(button_idx, state, buttons_pressed):

        # BASE CASE
        if button_idx == len(MACHINES[machine_idx]['buttons']):

          return (state == MACHINES[machine_idx]['goal'], buttons_pressed)

        # RECURSIVE CASE
        else:

          CANDIDATES = []                                                               # Candidate states of buttons pressed that ultimately lead to goal state

          # Don't press current button, and recurse
          (res_if_no_press, buttons_pressed_if_no_press) = go(button_idx + 1, state, buttons_pressed)
          if res_if_no_press:
            CANDIDATES.append((True, buttons_pressed_if_no_press))

          # Press current button, and recurse
          state_copy = state.copy()
          for i in MACHINES[machine_idx]['buttons'][button_idx]:
            state_copy[i] = not state_copy[i]
          buttons_pressed_copy = buttons_pressed.copy()
          buttons_pressed_copy.append(button_idx)
          (res_if_press, buttons_pressed_if_press) = go(button_idx + 1, state_copy, buttons_pressed_copy)
          if res_if_press:
            CANDIDATES.append((True, buttons_pressed_if_press))

          # Only propagate the solution with the least number of buttons presesd, if there are multiple solutions
          CANDIDATES.sort(key=lambda candidate: len(candidate[1]))
          return (True, CANDIDATES[0][1]) if CANDIDATES else (False, [])

      # KICK-START RECURSION
      initial_state = [False] * len(MACHINES[machine_idx]['goal'])
      initial_buttons_pressed = []
      (res, buttons_pressed) = go(0, initial_state, initial_buttons_pressed)

      assert res, f'ERROR: No solution for machine_idx={machine_idx}'
      output += len(buttons_pressed)

    return output

  else:                                                                                 # PART 2: NOW, EACH EQUATION IN THE SYSTEM MAPS TO A SPECIFIC CONSTANT

    """
    I'm basically doing a brute force here. It works for the sample input, but takes way too long for the real data.
    Next, I'll end up doing a solution involving the `pulp` library, and apply it to both sample input and real input.
    """

    # if DEBUG:

    #   def serialize(times_buttons_pressed):
    #     return ''.join([ str(n) for n in times_buttons_pressed ])

    #   MEMO = {}
    #   def go(machine_idx, button_idx, times_buttons_pressed, joltage_state):

    #     joltage_goal = MACHINES[machine_idx]['joltage_goal']

    #     serialized_times_button_pressed = serialize(times_buttons_pressed)

    #     if (machine_idx, button_idx, serialized_times_button_pressed) not in MEMO:

    #       # Prune
    #       prune = False
    #       for i in range(len(joltage_state)):
    #         if joltage_state[i] > joltage_goal[i]:
    #           MEMO[(machine_idx, button_idx, serialized_times_button_pressed)] = (False, [], [])
    #           prune = True

    #       if not prune:

    #         if button_idx == len(times_buttons_pressed):

    #           MEMO[(machine_idx, button_idx, serialized_times_button_pressed)] = (
    #             joltage_state == joltage_goal,
    #             times_buttons_pressed,
    #             joltage_state,
    #           )

    #         else:

    #           CANDIDATES = []

    #           # res if don't press
    #           (res_if_no_press, buttons_pressed_if_no_press, joltage_state_if_no_press) = go(machine_idx, button_idx + 1, times_buttons_pressed, joltage_state)
    #           if res_if_no_press and joltage_state_if_no_press == joltage_goal:
    #             CANDIDATES.append((True, buttons_pressed_if_no_press, joltage_state_if_no_press))

    #           # res if press

    #           # prune by finding the lowest candidate number for max_presses
    #           max_presses = float('inf')
    #           for b_idx in MACHINES[machine_idx]['buttons'][button_idx]:
    #             delta = joltage_goal[b_idx] - joltage_state[b_idx]
    #             max_presses = min(max_presses, delta)

    #           for num_presses in range(1, max_presses + 1):
    #             times_buttons_pressed_copy = times_buttons_pressed.copy()
    #             times_buttons_pressed_copy[button_idx] += num_presses
    #             joltage_state_copy = joltage_state.copy()
    #             for i in MACHINES[machine_idx]['buttons'][button_idx]:
    #               joltage_state_copy[i] += num_presses
    #             (res_if_press, buttons_pressed_if_press, joltage_state_if_press) = go(machine_idx, button_idx + 1, times_buttons_pressed_copy, joltage_state_copy)
    #             if res_if_press and joltage_state_if_press == joltage_goal:
    #               CANDIDATES.append((True, buttons_pressed_if_press, joltage_state_if_press))

    #           if not CANDIDATES:
    #             # return (False, [], [])
    #             MEMO[(machine_idx, button_idx, serialized_times_button_pressed)] = (False, [], [])

    #           else:
    #             CANDIDATES.sort(key=lambda candidate: sum(candidate[1]))
    #             winning_candidate = CANDIDATES[0]
    #             # return winning_candidate
    #             MEMO[(machine_idx, button_idx, serialized_times_button_pressed)] = winning_candidate
          
    #     return MEMO[(machine_idx, button_idx, serialized_times_button_pressed)]

    #   print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    #   print(f'Need to solve for {len(MACHINES)} machines')

    #   output = 0

    #   for machine_idx in range(len(MACHINES)):
    #     (res, buttons_pressed, _) = go(machine_idx, 0, [0] * len(MACHINES[machine_idx]['buttons']), [0] * len(MACHINES[machine_idx]['goal']))

    #     assert res, f'ERROR: No solution for machine_idx={machine_idx}'

    #     output += sum(buttons_pressed)

    #     print(f'Solved for machine {machine_idx}')

    #   print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    #   return output

    """
    Recognizing that we basically have a system of linear equations, I asked ChatGPT how I might solve such a system
    in Python (without any reference to the AoC problem itself).

    It showed me an implementation using the `pulp` library, which helps with linear programming.
    """

    import pulp

    output = 0

    for machine_idx in range(len(MACHINES)):
      
      # STEP 1: Set up relationships from input data
      # An equation is something like 'a + b + f = 30', which means the number of times buttons 0, 1, and 5 are pressed collectively equals 30

      EQUATIONS = [{
        'LS': [],                                                                       # we will populate this with all buttons that might affect this joltage goal
        'RS': MACHINES[machine_idx]['joltage_goal'][joltage_goal_idx],                  # total button presses among the aforementioned group of buttons
      } for joltage_goal_idx in range(len(MACHINES[machine_idx]['joltage_goal']))]      # the above happens for each joltage goal
      
      # Iterate through each button, and look to see which joltage goals it affects
      for button_idx in range(len(MACHINES[machine_idx]['buttons'])):
        equation_list = MACHINES[machine_idx]['buttons'][button_idx]
        for joltage_goal_idx in equation_list:
          EQUATIONS[joltage_goal_idx]['LS'].append(button_idx)


      # STEP 2: Set up PuLP - Started with hard-coded implementation by ChatGPT, then I made it dynamic

      prob = pulp.LpProblem('MinSum', pulp.LpMinimize)                                  # some init stuff

      # Variables (nonnegative integers)
      x = pulp.LpVariable.dicts(                                                        # more init stuff
        "x",
        range(len(MACHINES[machine_idx]['buttons'])),
        lowBound=0,
        cat=pulp.LpInteger
      )

      # Objective: minimize total
      prob += pulp.lpSum(x[v] for v in x)                                               # more init stuff


      # Constraints

      # Hard coded example for 5 equations:
      # prob += x[0] + x[2] + x[3] == 3                                                 # this is like a + c + d = 3
      # prob += x[2] + x[3] + x[4] == 6                                                 # c + d + e = 6, etc.
      # prob += x[1] + x[3] == 1
      # prob += x[2] + x[4] == 5
      # prob += x[3] == 1
      for equation in EQUATIONS:
        # Here we are setting up a more dynamic version of the hard coded example lines above:
        # prob += (x[i0] + x[i1] + ... x[ik]) == RS
        prob += reduce(lambda acc, button_idx: acc + x[button_idx], equation['LS'], 0) == equation['RS']

      # Solve
      prob.solve(pulp.PULP_CBC_CMD(msg=False))
      solution = {v.name: int(v.value()) for v in prob.variables()}

      total_buttons_pressed = sum(solution.values())
      output += total_buttons_pressed

      if DEBUG and DISPLAY_EXTRA_INFO:
        print(f'===== SOLUTION FOR MACHINE {machine_idx} =====')
        for button_idx in sorted(solution.keys(), key=lambda button_idx: int(button_idx[2:])):
          if solution[button_idx] > 0:
            print(f'Button {button_idx[2:]} {tuple(MACHINES[machine_idx]['buttons'][int(button_idx[2:])])}: {solution[button_idx]} presses')
        print(f'Total: {total_buttons_pressed} button presses')
        print('')

    print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return output



# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = solve_linear_programming_problem
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

sample_input = """[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 2 + 3 + 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 444
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 33
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 16513
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)