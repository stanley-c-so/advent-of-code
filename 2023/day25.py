"""

--- Day 25: Snowverload ---

Still somehow without snow, you go to the last place you haven't checked: the center of Snow Island, directly below the waterfall.

Here, someone has clearly been trying to fix the problem. Scattered everywhere are hundreds of weather machines, almanacs, communication modules, hoof prints, machine parts, mirrors, lenses, and so on.

Somehow, everything has been wired together into a massive snow-producing apparatus, but nothing seems to be running. You check a tiny screen on one of the communication modules: Error 2023. It doesn't say what Error 2023 means, but it does have the phone number for a support line printed on it.

"Hi, you've reached Weather Machines And So On, Inc. How can I help you?" You explain the situation.

"Error 2023, you say? Why, that's a power overload error, of course! It means you have too many components plugged in. Try unplugging some components and--" You explain that there are hundreds of components here and you're in a bit of a hurry.

"Well, let's see how bad it is; do you see a big red reset button somewhere? It should be on its own module. If you push it, it probably won't fix anything, but it'll report how overloaded things are." After a minute or two, you find the reset button; it's so big that it takes two hands just to get enough leverage to push it. Its screen then displays:

SYSTEM OVERLOAD!

Connected components would require
power equal to at least 100 stars!
"Wait, how many components did you say are plugged in? With that much equipment, you could produce snow for an entire--" You disconnect the call.

You have nowhere near that many stars - you need to find a way to disconnect at least half of the equipment here, but it's already Christmas! You only have time to disconnect three wires.

Fortunately, someone left a wiring diagram (your puzzle input) that shows how the components are connected. For example:

jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr

Each line shows the name of a component, a colon, and then a list of other components to which that component is connected. Connections aren't directional; abc: xyz and xyz: abc both represent the same configuration. Each connection between two components is represented only once, so some components might only ever appear on the left or right side of a colon.

In this example, if you disconnect the wire between hfx/pzl, the wire between bvb/cmg, and the wire between nvd/jqt, you will divide the components into two separate, disconnected groups:

9 components: cmg, frs, lhk, lsr, nvd, pzl, qnr, rsh, and rzs.
6 components: bvb, hfx, jqt, ntq, rhn, and xhk.

Multiplying the sizes of these groups together produces 54.

Find the three wires you need to disconnect in order to divide the components into two separate groups. What do you get if you multiply the sizes of these two groups together?


--- Part Two ---

You climb over weather machines, under giant springs, and narrowly avoid a pile of pipes as you find and disconnect the three wires.

A moment after you disconnect the last wire, the big red reset button module makes a small ding noise:

System overload resolved!
Power required is now 50 stars.
Out of the corner of your eye, you notice goggles and a loose-fitting hard hat peeking at you from behind an ultra crucible. You think you see a faint glow, but before you can investigate, you hear another small ding:

Power required is now 49 stars.

Please supply the necessary stars and
push the button to restart the system.

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

def bipartite_graph_min_cuts_stoer_wagner(part, input_str, DEBUG = False):

  # DATA STRUCTURES

  GRAPH = {}
  EDGES = []


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  for line in input_arr:
    node, connections = line.split(': ')
    if node not in GRAPH: GRAPH[node] = set()
    for connection in connections.split(' '):
      if connection not in GRAPH: GRAPH[connection] = set()
      GRAPH[connection].add(node)
      GRAPH[node].add(connection)
      EDGES.append((node, connection))

  NODES = [ node for node in GRAPH ]


  # STOER-WAGNER ALGORITHM
  # https://en.wikipedia.org/wiki/Stoer%E2%80%93Wagner_algorithm

  def go():

    # `ACC` is basically an arbitrary accumulating set that sucks up neighboring nodes and merges them into itself
    # We can use two data structures to avoid modifying the original graph
    ACC_NEIGHBORS = {}                                                            # tracks the current neighbors of ACC
    ACC = set()                                                                   # tracks the original graph nodes absorbed into ACC

    def add_node_to_ACC(node):
      ACC.add(node)
      if node in ACC_NEIGHBORS: del ACC_NEIGHBORS[node]                           # this will generally be true except when adding the very first node to ACC
      for neighbor in GRAPH[node]:
        if neighbor in ACC:                                                       # neighbor already in ACC - do nothing
          continue
        elif neighbor in ACC_NEIGHBORS:                                           # neighbor is also directly connected to ACC - "merge" this edge to the edge cost of ACC -> neighbor
          ACC_NEIGHBORS[neighbor] += 1
        else:                                                                     # neighbor is not directly connected to ACC - "connect" this neighbor to ACC
          ACC_NEIGHBORS[neighbor] = 1

    add_node_to_ACC(NODES[0])                                                     # start by adding any node (say, the first one) into ACC

    min_cut = float('inf')
    neighbors_at_min_cut = None
    neighbors_of_neighbors = None
    edges_to_cut = None

    # There are N - 1 iterations for N nodes
    for _ in range(len(NODES) - 1):
      
      neighbors = list(ACC_NEIGHBORS)
      neighbors.sort(key=lambda neighbor: ACC_NEIGHBORS[neighbor], reverse=True)

      # The current cost of cutting the graph between ACC and everything else
      # is equal to the sum of the weights of the edges going in and out of ACC
      cut = sum([ ACC_NEIGHBORS[neighbor] for neighbor in neighbors ])
      if cut < min_cut:
        min_cut = cut
        neighbors_at_min_cut = neighbors.copy()
        # Here we assume that the neighbor is only connected to one thing currently in ACC. Tends to hold true for our input
        neighbors_of_neighbors = [ ([ n for n in GRAPH[neighbor] if n in ACC ])[0] for neighbor in neighbors_at_min_cut ]
        edges_to_cut = [ (neighbors_at_min_cut[i], neighbors_of_neighbors[i]) for i in range(len(neighbors_at_min_cut)) ]

      add_node_to_ACC(neighbors[0])
    
    return (min_cut, edges_to_cut)


  # ANALYZE

  # Step 1: Run Stoer-Wagner algorithm, and verify that the min number of cuts is 3, as the problem promises
  min_cut, edges_to_cut = go()
  assert min_cut == 3

  # Step 2: Now actually make the cuts (i.e. remove the edges)
  for edge in edges_to_cut:
    (u, v) = edge
    GRAPH[u].remove(v)
    GRAPH[v].remove(u)

  # Step 3: Find the sizes of the resulting partitions
  visited = set()
  stack = [ NODES[0] ]
  while stack:
    node = stack.pop()
    if node in visited: continue
    visited.add(node)
    for neighbor in GRAPH[node]:
      stack.append(neighbor)

  partitionA_size, partitionB_size = len(visited), len(NODES) - len(visited)

  if DISPLAY_EXTRA_INFO:
    print(f"Partition sizes: {partitionA_size} and {partitionB_size}")

  return partitionA_size * partitionB_size


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = bipartite_graph_min_cuts_stoer_wagner
skipped_tests = set([ 2 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '/' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 54
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 538368
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# # Test case 3
# test_input = {
#   'part': 2,
#   'input_str': sample_input,
#   'DEBUG': True,
# }
# test_expected = None
# test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# # Test case 4
# test_input = {
#   'part': 2,
#   'input_str': actual_input,
# }
# test_expected = None
# test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)