"""

--- Day 8: Haunted Wasteland ---

You're still riding a camel across Desert Island when you spot a sandstorm quickly approaching. When you turn to warn the Elf, she disappears before your eyes! To be fair, she had just finished warning you about ghosts a few minutes ago.

One of the camel's pouches is labeled "maps" - sure enough, it's full of documents (your puzzle input) about how to navigate the desert. At least, you're pretty sure that's what they are; one of the documents contains a list of left/right instructions, and the rest of the documents seem to describe some kind of network of labeled nodes.

It seems like you're meant to use the left/right instructions to navigate the network. Perhaps if you have the camel follow the same instructions, you can escape the haunted wasteland!

After examining the maps for a bit, two nodes stick out: AAA and ZZZ. You feel like AAA is where you are now, and you have to follow the left/right instructions until you reach ZZZ.

This format defines each node of the network individually. For example:

RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)

Starting with AAA, you need to look up the next element based on the next left/right instruction in your input. In this example, start with AAA and go right (R) by choosing the right element of AAA, CCC. Then, L means to choose the left element of CCC, ZZZ. By following the left/right instructions, you reach ZZZ in 2 steps.

Of course, you might not find ZZZ right away. If you run out of left/right instructions, repeat the whole sequence of instructions as necessary: RL really means RLRLRLRLRLRLRLRL... and so on. For example, here is a situation that takes 6 steps to reach ZZZ:

LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)

Starting at AAA, follow the left/right instructions. How many steps are required to reach ZZZ?


--- Part Two ---

The sandstorm is upon you and you aren't any closer to escaping the wasteland. You had the camel follow the instructions, but you've barely left your starting position. It's going to take significantly more steps to escape!

What if the map isn't for people - what if the map is for ghosts? Are ghosts even bound by the laws of spacetime? Only one way to find out.

After examining the maps a bit longer, your attention is drawn to a curious fact: the number of nodes with names ending in A is equal to the number ending in Z! If you were a ghost, you'd probably just start at every node that ends with A and follow all of the paths at the same time until they all simultaneously end up at nodes that end with Z.

For example:

LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)

Here, there are two starting nodes, 11A and 22A (because they both end with A). As you follow each left/right instruction, use that instruction to simultaneously navigate away from both nodes you're currently on. Repeat this process until all of the nodes you're currently on end with Z. (If only some of the nodes you're on end with Z, they act like any other node and you continue as normal.) In this example, you would proceed as follows:

    Step 0: You are at 11A and 22A.
    Step 1: You choose all of the left paths, leading you to 11B and 22B.
    Step 2: You choose all of the right paths, leading you to 11Z and 22C.
    Step 3: You choose all of the left paths, leading you to 11B and 22Z.
    Step 4: You choose all of the right paths, leading you to 11Z and 22B.
    Step 5: You choose all of the left paths, leading you to 11B and 22C.
    Step 6: You choose all of the right paths, leading you to 11Z and 22Z.

So, in this example, you end up entirely on nodes that end in Z after 6 steps.

Simultaneously start on every node that ends with A. How many steps does it take before you're only on nodes that end with Z?


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

def find_sync_point_of_all_cycles(part, input_str, DEBUG = False):

  # DATA STRUCTURE

  DATA = {}


  # PARSE INPUT DATA

  [ INSTRUCTIONS, DATA_STR ] = input_str.split('\n\n')  
  for line in DATA_STR.split('\n'):
    split = line.split(' = ')
    key = split[0]
    left_and_right_split = split[1].split(', ')
    left = left_and_right_split[0][1:]
    right = left_and_right_split[1][:-1]
    DATA[key] = { 'L': left, 'R': right }


  # ANALYZE

  LIMIT = maxsize

  if part == 1:                                   # PART 1: GO FROM 'AAA' TO 'ZZZ'

    steps = 0
    idx = 0
    node = 'AAA'
    while steps < LIMIT:
      if node == 'ZZZ': return steps
      node = DATA[node][INSTRUCTIONS[idx]]
      idx = (idx + 1) % len(INSTRUCTIONS)
      steps += 1

    print('STEPS EXCEEDED LIMIT')
    assert(False)

  else:                                           # PART 2: SEND MULTIPLE THREADS ALONG ALL '*A' TO '*Z' AND FIND POINT IN TIME WHERE CYCLES MATCH

    # find all start nodes

    node_list = []
    for line in DATA_STR.split('\n'):
      split = line.split(' = ')
      key = split[0]
      if key[-1] == 'A':
        node_list.append(key)


    # for each node, find period of repeat

    periods = {}

    for node in node_list:
      periods[node] = {}
      steps = 0
      idx = 0
      curr_node = node
      while steps < LIMIT:
        if curr_node[-1] == 'Z':
          periods[node][curr_node] = steps
        if (curr_node in periods[node]):

          # NOTE: IT SEEMS THAT, COINCIDENTALLY (I THINK?) BOTH IN THE SAMPLE DATA AND IN THE REAL DATA,
          # THE NUMBER OF STEPS IT TAKES TO GO FROM A TO THE FIRST Z NODE IS EQUAL TO THE NUMBER OF STEPS
          # IT TAKES TO GO FROM THE FIRST Z NODE BACK TO ITSELF. (ALSO, EACH A NODE UNIQUELY VISITS ONLY
          # ONE UNIQUE Z NODE.) IF THESE THINGS WERE NOT TRUE, THIS SOLUTION WOULD NEED TO BE TWEAKED.
          # HOWEVER, I HAVE INSPECTED THE DATA WITH THE FOLLOWING AND CONFIRMED THIS TO BE THE CASE.
          if DISPLAY_EXTRA_INFO:
            print(f'ANALYZING {node}:')
            print(f'Total steps on first Z node to repeat: {steps}')
            print(f'Steps from A to first Z: {periods[node][curr_node]}')
            print('---')
            
          break
        curr_node = DATA[curr_node][INSTRUCTIONS[idx]]
        idx = (idx + 1) % len(INSTRUCTIONS)
        steps += 1
      
      if steps == LIMIT:
        print('STEPS EXCEEDED LIMIT')
        assert(False)
    
    if DISPLAY_EXTRA_INFO: print(periods)

    # # UTILITY FUNCTIONS - ALTHOUGH WE DON'T NEED THIS BECAUSE math ALREADY HAS lcm FUNCTION!

    # # uses Euclidean algorithm (https://en.wikipedia.org/wiki/Euclidean_algorithm)
    # # credit to Phrogz (https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction)
    # def GCD(num, denom):
    #   num = abs(num)
    #   denom = abs(denom)
    #   return GCD(denom, num % denom) if denom else num

    # # credit to w3resource (https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php)
    # def LCM(num1, num2):
    #   return 0 if (not num1 or not num2) else abs((num1 * num2) // GCD(num1, num2))


    # FIND LCM OF ALL PERIODS

    steps_list = [ list(periods[start_node].values())[0] for start_node in periods ]
    if DISPLAY_EXTRA_INFO:
      for i in range(len(node_list)):
        print(f"{node_list[i]}: {steps_list[i]} steps")

    return reduce(lambda x, y: lcm(x, y), steps_list)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = find_sync_point_of_all_cycles
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
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)"""

sample_input2 = """LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)"""

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
  'input_str': actual_input,
}
test_expected = 17263
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 6
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 14631604759649
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)