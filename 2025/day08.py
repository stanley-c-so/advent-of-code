"""

--- Day 8: Playground ---

Equipped with a new understanding of teleporter maintenance, you confidently step onto the repaired teleporter pad.

You rematerialize on an unfamiliar teleporter pad and find yourself in a vast underground space which contains a giant playground!

Across the playground, a group of Elves are working on setting up an ambitious Christmas decoration project. Through careful rigging, they have suspended a large number of small electrical junction boxes.

Their plan is to connect the junction boxes with long strings of lights. Most of the junction boxes don't provide electricity; however, when two junction boxes are connected by a string of lights, electricity can pass between those two junction boxes.

The Elves are trying to figure out which junction boxes to connect so that electricity can reach every junction box. They even have a list of all of the junction boxes' positions in 3D space (your puzzle input).

For example:

162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
This list describes the position of 20 junction boxes, one per line. Each position is given as X,Y,Z coordinates. So, the first junction box in the list is at X=162, Y=817, Z=812.

To save on string lights, the Elves would like to focus on connecting pairs of junction boxes that are as close together as possible according to straight-line distance. In this example, the two junction boxes which are closest together are 162,817,812 and 425,690,689.

By connecting these two junction boxes together, because electricity can flow between them, they become part of the same circuit. After connecting them, there is a single circuit which contains two junction boxes, and the remaining 18 junction boxes remain in their own individual circuits.

Now, the two junction boxes which are closest together but aren't already directly connected are 162,817,812 and 431,825,988. After connecting them, since 162,817,812 is already connected to another junction box, there is now a single circuit which contains three junction boxes and an additional 17 circuits which contain one junction box each.

The next two junction boxes to connect are 906,360,560 and 805,96,715. After connecting them, there is a circuit containing 3 junction boxes, a circuit containing 2 junction boxes, and 15 circuits which contain one junction box each.

The next two junction boxes are 431,825,988 and 425,690,689. Because these two junction boxes were already in the same circuit, nothing happens!

This process continues for a while, and the Elves are concerned that they don't have enough extension cables for all these circuits. They would like to know how big the circuits will be.

After making the ten shortest connections, there are 11 circuits: one circuit which contains 5 junction boxes, one circuit which contains 4 junction boxes, two circuits which contain 2 junction boxes each, and seven circuits which each contain a single junction box. Multiplying together the sizes of the three largest circuits (5, 4, and one of the circuits of size 2) produces 40.

Your list contains many junction boxes; connect together the 1000 pairs of junction boxes which are closest together. Afterward, what do you get if you multiply together the sizes of the three largest circuits?


--- Part Two ---

The Elves were right; they definitely don't have enough extension cables. You'll need to keep connecting junction boxes together until they're all in one large circuit.

Continuing the above example, the first connection which causes all of the junction boxes to form a single circuit is between the junction boxes at 216,146,977 and 117,168,530. The Elves need to know how far those junction boxes are from the wall so they can pick the right extension cable; multiplying the X coordinates of those two junction boxes (216 and 117) produces 25272.

Continue connecting the closest unconnected pairs of junction boxes together until they're all in the same circuit. What do you get if you multiply together the X coordinates of the last two junction boxes you need to connect?

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

def connect_graph_nodes_in_order_of_closest_pairs(part, input_str, DEBUG = False, *args):

  num_connections, = args

  # DATA STRUCTURES

  JUNCTIONS = []
  POSSIBLE_CONNECTIONS = []
  NODES_BY_NETWORK_ID = {}


  # PARSE INPUT DATA AND PRE-PROCESSING

  input_arr = input_str.split('\n')

  for i in range(len(input_arr)):
    line = input_arr[i]
    x, y, z = [ int(n) for n in line.split(',') ]

    # Save the junction data
    JUNCTIONS.append({
      'x': x,
      'y': y,
      'z': z,
      'network_id': i
    })

    # Create isolated network for junction
    NODES_BY_NETWORK_ID[i] = { i }

  # Consider every possible connection between pairs of junctions
  for i in range(len(JUNCTIONS) - 1):
    for j in range(i + 1, len(JUNCTIONS)):
      POSSIBLE_CONNECTIONS.append({
        'nodes': (i, j),
        'squared_distance': (JUNCTIONS[i]['x'] - JUNCTIONS[j]['x'])**2 \
                              + (JUNCTIONS[i]['y'] - JUNCTIONS[j]['y'])**2 \
                              + (JUNCTIONS[i]['z'] - JUNCTIONS[j]['z'])**2
      })

  # Sort possible connections by squared distance
  POSSIBLE_CONNECTIONS.sort(key=lambda connection: connection['squared_distance'], reverse=True)


  # HELPER FUNCTION

  def connect_next_pair():                                                      # Connects the next two closest junctions
    (u, v) = POSSIBLE_CONNECTIONS.pop()['nodes']
    u_network_id = JUNCTIONS[u]['network_id']
    v_network_id = JUNCTIONS[v]['network_id']

    # No-op if both nodes are already in the same network
    if u_network_id != v_network_id:
      lower_network_id = min(u_network_id, v_network_id)
      higher_network_id = max(u_network_id, v_network_id)

      # Assign all nodes from higher network to lower network
      for id in NODES_BY_NETWORK_ID[higher_network_id]:
        JUNCTIONS[id]['network_id'] = lower_network_id
        NODES_BY_NETWORK_ID[lower_network_id].add(id)

      # Destroy higher network
      del NODES_BY_NETWORK_ID[higher_network_id]

    return (u, v)                                                               # Returns the ids of the nodes just connected


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                                 # PART 1: ANALYZE GRAPH AFTER A GIVEN NUMBER OF CONNECTIONS

    for i in range(num_connections):                                            # Call the connect function a given number of times
      connect_next_pair()

    NETWORK_SIZES_SORTED = sorted([ len(NODES_BY_NETWORK_ID[id]) for id in NODES_BY_NETWORK_ID ], reverse=True)

    # Get product of the network sizes of the top networks required by the question
    output = 1
    NUM_NETWORKS_REQUIRED_BY_QUESTION = 3
    for i in range(NUM_NETWORKS_REQUIRED_BY_QUESTION):
      output *= NETWORK_SIZES_SORTED[i]
    
    if DISPLAY_EXTRA_INFO:
      if DEBUG:
        print(f'Nodes by network ID: {NODES_BY_NETWORK_ID}')
      print(f'Top {NUM_NETWORKS_REQUIRED_BY_QUESTION} network sizes: {NETWORK_SIZES_SORTED[:NUM_NETWORKS_REQUIRED_BY_QUESTION]}')

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return output

  else:                                                                         # PART 2: IDENTIFY NODES THAT CONNECT TO FORM ONE NETWORK

    u, v = None, None
    while len(NODES_BY_NETWORK_ID) > 1:                                         # Just keep calling the connect function until there's one network
      (u, v) = connect_next_pair()

    if DISPLAY_EXTRA_INFO:
      print(f'One network is formed after connecting nodes {u} and {v}:')
      print(f'Node {u} has x value: {JUNCTIONS[u]['x']}')
      print(f'Node {v} has x value: {JUNCTIONS[v]['x']}')

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return JUNCTIONS[u]['x'] * JUNCTIONS[v]['x']


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = connect_graph_nodes_in_order_of_closest_pairs
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

sample_input = """162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  'num_connections': 10,
}
test_expected = 40
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'num_connections': 1000,
}
test_expected = 66912
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'num_connections': None,
}
test_expected = 25272
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'num_connections': None,
}
test_expected = 724454082
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)