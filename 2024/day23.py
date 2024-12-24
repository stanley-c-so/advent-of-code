"""

--- Day 23: LAN Party ---

As The Historians wander around a secure area at Easter Bunny HQ, you come across posters for a LAN party scheduled for today! Maybe you can find it; you connect to a nearby datalink port and download a map of the local network (your puzzle input).

The network map provides a list of every connection between two computers. For example:

kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
Each line of text in the network map represents a single connection; the line kh-tc represents a connection between the computer named kh and the computer named tc. Connections aren't directional; tc-kh would mean exactly the same thing.

LAN parties typically involve multiplayer games, so maybe you can locate it by finding groups of connected computers. Start by looking for sets of three computers where each computer in the set is connected to the other two computers.

In this example, there are 12 such sets of three inter-connected computers:

aq,cg,yn
aq,vc,wq
co,de,ka
co,de,ta
co,ka,ta
de,ka,ta
kh,qp,ub
qp,td,wh
tb,vc,wq
tc,td,wh
td,wh,yn
ub,vc,wq
If the Chief Historian is here, and he's at the LAN party, it would be best to know that right away. You're pretty sure his computer's name starts with t, so consider only sets of three computers where at least one computer's name starts with t. That narrows the list down to 7 sets of three inter-connected computers:

co,de,ta
co,ka,ta
de,ka,ta
qp,td,wh
tb,vc,wq
tc,td,wh
td,wh,yn
Find all the sets of three inter-connected computers. How many contain at least one computer with a name that starts with t?


--- Part Two ---

There are still way too many results to go through them all. You'll have to find the LAN party another way and go there yourself.

Since it doesn't seem like any employees are around, you figure they must all be at the LAN party. If that's true, the LAN party will be the largest set of computers that are all connected to each other. That is, for each computer at the LAN party, that computer will have a connection to every other computer at the LAN party.

In the above example, the largest set of computers that are all connected to each other is made up of co, de, ka, and ta. Each computer in this set has a connection to every other computer in the set:

ka-co
ta-co
de-co
ta-ka
de-ta
ka-de
The LAN party posters say that the password to get into the LAN party is the name of every computer at the LAN party, sorted alphabetically, then joined together with commas. (The people running the LAN party are clearly a bunch of nerds.) In this example, the password would be co,de,ka,ta.

What is the password to get into the LAN party?

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

def find_groups_within_graph_where_every_node_is_connected_to_every_other(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  EDGES = input_str.split('\n')


  # DATA STRUCTURES

  GRAPH = {}
  NODES = set()
  NODES_LIST = []
  for edge in EDGES:
    [u, v] = edge.split('-')
    NODES.add(u)
    NODES.add(v)
    if u not in GRAPH: GRAPH[u] = []
    if v not in GRAPH: GRAPH[v] = []
    GRAPH[u].append(v)
    GRAPH[v].append(u)

  NODES_LIST = list(NODES)                                                          # the order within this list is random
                                                                                    # because it's generated from NODES set
                                                                                    # (which has no inherent ordering).
                                                                                    # i'm not sure whether this affects whether
                                                                                    # part 2 can find ALL the ways to make
                                                                                    # a group of size X, but since there's only
                                                                                    # one way to make the biggest group, it's fine 


  # ANALYZE

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  largest_group_size = 0
  GROUPS_BY_SIZE = {}

  for node in NODES_LIST:                                                           # go node by node, assuming that node is
                                                                                    # in the final group.

    neighbors_list = GRAPH[node]                                                    # then the only nodes that could also be
                                                                                    # in the final group must be neighbors with
                                                                                    # the first node

    proposed_group = [ node ]
    def backtrack(i, cumulative_candidates_set):
      nonlocal largest_group_size

      if i == len(neighbors_list):                                                  # BASE CASE

        sorted_proposed_group = sorted(proposed_group)                              # NOTE: COPY the state of this list,
                                                                                    # as the list will change as backtracking
                                                                                    # continues

        # OPTIONAL: MAKE SURE EVERY NODE IN THIS GROUP IS ACTUALLY CONNECTED
        for ii in range(len(sorted_proposed_group) - 1):
          for jj in range(ii + 1, len(sorted_proposed_group)):
            u, v = sorted_proposed_group[ii], sorted_proposed_group[jj]
            assert v in GRAPH[u] and u in GRAPH[v], "FAILED THE CHECK"

        if len(sorted_proposed_group) not in GROUPS_BY_SIZE: GROUPS_BY_SIZE[len(sorted_proposed_group)] = set()
        GROUPS_BY_SIZE[len(sorted_proposed_group)].add(','.join(sorted_proposed_group))

        if DISPLAY_EXTRA_INFO:
          if len(sorted_proposed_group) > largest_group_size:
            print(f"NEW LARGEST GROUP WITH SIZE {largest_group_size}: {sorted_proposed_group}")
          elif len(sorted_proposed_group) == largest_group_size:
            print(f"TIED FOR LARGEST GROUP WITH SIZE {largest_group_size}: {sorted_proposed_group}")

        largest_group_size = max(largest_group_size, len(sorted_proposed_group))

      else:                                                                         # RECURSIVE CASE

        # try excluding neighbor
        backtrack(i + 1, cumulative_candidates_set)

        # try including neighbor, but only if it hasn't already been eliminated from cumulative candidates set
        neighbor = neighbors_list[i]
        if neighbor in cumulative_candidates_set:
          proposed_group.append(neighbor)
          neighbor_candidates_set = { neighbor, *GRAPH[neighbor] }
          common_set = { n for n in cumulative_candidates_set if n in neighbor_candidates_set }
          backtrack(i + 1, common_set)
          proposed_group.pop()

    backtrack(0, { node, *GRAPH[node] })

    # now remove this node from consideration
    for neighbor in NODES:
      GRAPH[neighbor] = [ n for n in GRAPH[neighbor] if n != node ]
    del GRAPH[node]
    NODES.discard(node)

  if part == 1:                                                                     # PART 1: FIND ALL THE WAYS TO MAKE A GROUP
                                                                                    # OF EXACTLY SIZE 3, FILTERED BY GROUPS
                                                                                    # THAT CONTAIN AT LEAST ONE COMPUTER WHOSE
                                                                                    # NAME BEGINS WITH 't'

    total = 0
    for group_str in GROUPS_BY_SIZE[3]:
      group = group_str.split(',')
      if 't' in (group[0][0], group[1][0], group[2][0]):
        total += 1

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")         # ~1.04 seconds
    return total

  else:                                                                             # PART 2: FIND THE BIGGEST POSSIBLE GROUP

    assert len(GROUPS_BY_SIZE[largest_group_size]) == 1                             # apparently there's supposed to be only ONE
                                                                                    # way to make the largest possible group,
                                                                                    # even though there are many ways to make
                                                                                    # smaller groupings.

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")         # ~1.03 seconds
    return list(GROUPS_BY_SIZE[largest_group_size])[0]


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = find_groups_within_graph_where_every_node_is_connected_to_every_other
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

sample_input = """kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 7
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1110
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = "co,de,ka,ta"
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 'ej,hm,ks,ms,ns,rb,rq,sc,so,un,vb,vd,wd'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)