"""

--- Day 11: Reactor ---

You hear some loud beeping coming from a hatch in the floor of the factory, so you decide to check it out. Inside, you find several large electrical conduits and a ladder.

Climbing down the ladder, you discover the source of the beeping: a large, toroidal reactor which powers the factory above. Some Elves here are hurriedly running between the reactor and a nearby server rack, apparently trying to fix something.

One of the Elves notices you and rushes over. "It's a good thing you're here! We just installed a new server rack, but we aren't having any luck getting the reactor to communicate with it!" You glance around the room and see a tangle of cables and devices running from the server rack to the reactor. She rushes off, returning a moment later with a list of the devices and their outputs (your puzzle input).

For example:

aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
Each line gives the name of a device followed by a list of the devices to which its outputs are attached. So, bbb: ddd eee means that device bbb has two outputs, one leading to device ddd and the other leading to device eee.

The Elves are pretty sure that the issue isn't due to any specific device, but rather that the issue is triggered by data following some specific path through the devices. Data only ever flows from a device through its outputs; it can't flow backwards.

After dividing up the work, the Elves would like you to focus on the devices starting with the one next to you (an Elf hastily attaches a label which just says you) and ending with the main output to the reactor (which is the device with the label out).

To help the Elves figure out which path is causing the issue, they need you to find every path from you to out.

In this example, these are all of the paths from you to out:

Data could take the connection from you to bbb, then from bbb to ddd, then from ddd to ggg, then from ggg to out.
Data could take the connection to bbb, then to eee, then to out.
Data could go to ccc, then ddd, then ggg, then out.
Data could go to ccc, then eee, then out.
Data could go to ccc, then fff, then out.
In total, there are 5 different paths leading from you to out.

How many different paths lead from you to out?


--- Part Two ---

Thanks in part to your analysis, the Elves have figured out a little bit about the issue. They now know that the problematic data path passes through both dac (a digital-to-analog converter) and fft (a device which performs a fast Fourier transform).

They're still not sure which specific path is the problem, and so they now need you to find every path from svr (the server rack) to out. However, the paths you find must all also visit both dac and fft (in any order).

For example:

svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
This new list of devices contains many paths from svr to out:

svr,aaa,fft,ccc,ddd,hub,fff,ggg,out
svr,aaa,fft,ccc,ddd,hub,fff,hhh,out
svr,aaa,fft,ccc,eee,dac,fff,ggg,out
svr,aaa,fft,ccc,eee,dac,fff,hhh,out
svr,bbb,tty,ccc,ddd,hub,fff,ggg,out
svr,bbb,tty,ccc,ddd,hub,fff,hhh,out
svr,bbb,tty,ccc,eee,dac,fff,ggg,out
svr,bbb,tty,ccc,eee,dac,fff,hhh,out
However, only 2 paths from svr to out visit both dac and fft.

Find all of the paths that lead from svr to out. How many of those paths visit both dac and fft?

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

def count_paths_through_directed_graph_with_some_required_nodes(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  OUT, YOU, SVR, DAC, FFT = 'out', 'you', 'svr', 'dac', 'fft'


  # DATA STRUCTURES

  GRAPH = {}


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  for line in input_arr:
    [LS, RS] = line.split(': ')
    from_node = LS
    GRAPH[from_node] = []
    for to_node in RS.split(' '):
      GRAPH[from_node].append(to_node)


  # RECURSIVE FUNCTION

  MEMO = {}
  def ways_to_out_from_node(from_node):

    # BASE CASE
    if from_node == OUT:
      return {
        'dac_only': 0,
        'fft_only': 0,
        'both': 0,
        'neither': 1,
      }
    
    # RECURSIVE CASE
    if from_node not in MEMO:
      dac_only = 0
      fft_only = 0
      both = 0
      neither = 0

      for to_node in GRAPH[from_node]:
        recurse = ways_to_out_from_node(to_node)
        dac_only += recurse['dac_only']
        fft_only += recurse['fft_only']
        both += recurse['both']
        neither += recurse['neither']

      # If current node is dac, then count of `fft_only` becomes `both`, and count of neither becomes `dac_only`
      # (and `fft_only` and `neither` get reset to 0)
      if from_node == DAC:
        both = fft_only
        dac_only = neither
        fft_only = 0
        neither = 0

      # If current node is fft, then count of `dac_only` becomes `both`, and count of neither becomes `fft_only`
      # (and `dac_only` and `neither` get reset to 0)
      if from_node == FFT:
        both = dac_only
        fft_only = neither
        dac_only = 0
        neither = 0

      MEMO[from_node] = {
        'dac_only': dac_only,
        'fft_only': fft_only,
        'both': both,
        'neither': neither,
      }

    return MEMO[from_node]


  # ANALYZE

  if part == 1:

    return sum(ways_to_out_from_node(YOU).values())                 # PART 1: COUNT ALL PATHS FROM START TO `out`

  else:                                                             # PART 2: ONLY COUNT PATHS THAT WENT THROUGH `dac` AND `fft` IN ANY ORDER
  
    return ways_to_out_from_node(SVR)['both']


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = count_paths_through_directed_graph_with_some_required_nodes
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

sample_input = """aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out"""

sample_input2 = """svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 5
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 534
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 499645520864100
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)