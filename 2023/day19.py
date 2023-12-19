"""

--- Day 19: Aplenty ---

The Elves of Gear Island are thankful for your help and send you on your way. They even have a hang glider that someone stole from Desert Island; since you're already going that direction, it would help them a lot if you would use it to get down there and return it to them.

As you reach the bottom of the relentless avalanche of machine parts, you discover that they're already forming a formidable heap. Don't worry, though - a group of Elves is already here organizing the parts, and they have a system.

To start, each part is rated in each of four categories:

    x: Extremely cool looking
    m: Musical (it makes a noise when you hit it)
    a: Aerodynamic
    s: Shiny

Then, each part is sent through a series of workflows that will ultimately accept or reject the part. Each workflow has a name and contains a list of rules; each rule specifies a condition and where to send the part if the condition is true. The first rule that matches the part being considered is applied immediately, and the part moves on to the destination described by the rule. (The last rule in each workflow has no condition and always applies if reached.)

Consider the workflow ex{x>10:one,m<20:two,a>30:R,A}. This workflow is named ex and contains four rules. If workflow ex were considering a specific part, it would perform the following steps in order:

    Rule "x>10:one": If the part's x is more than 10, send the part to the workflow named one.
    Rule "m<20:two": Otherwise, if the part's m is less than 20, send the part to the workflow named two.
    Rule "a>30:R": Otherwise, if the part's a is more than 30, the part is immediately rejected (R).
    Rule "A": Otherwise, because no other rules matched the part, the part is immediately accepted (A).

If a part is sent to another workflow, it immediately switches to the start of that workflow instead and never returns. If a part is accepted (sent to A) or rejected (sent to R), the part immediately stops any further processing.

The system works, but it's not keeping up with the torrent of weird metal shapes. The Elves ask if you can help sort a few parts and give you the list of workflows and some part ratings (your puzzle input). For example:

px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}

The workflows are listed first, followed by a blank line, then the ratings of the parts the Elves would like you to sort. All parts begin in the workflow named in. In this example, the five listed parts go through the following workflows:

    {x=787,m=2655,a=1222,s=2876}: in -> qqz -> qs -> lnx -> A
    {x=1679,m=44,a=2067,s=496}: in -> px -> rfg -> gd -> R
    {x=2036,m=264,a=79,s=2244}: in -> qqz -> hdj -> pv -> A
    {x=2461,m=1339,a=466,s=291}: in -> px -> qkq -> crn -> R
    {x=2127,m=1623,a=2188,s=1013}: in -> px -> rfg -> A

Ultimately, three parts are accepted. Adding up the x, m, a, and s rating for each of the accepted parts gives 7540 for the part with x=787, 4623 for the part with x=2036, and 6951 for the part with x=2127. Adding all of the ratings for all of the accepted parts gives the sum total of 19114.

Sort through all of the parts you've been given; what do you get if you add together all of the rating numbers for all of the parts that ultimately get accepted?


--- Part Two ---

Even with your help, the sorting process still isn't fast enough.

One of the Elves comes up with a new plan: rather than sort parts individually through all of these workflows, maybe you can figure out in advance which combinations of ratings will be accepted or rejected.

Each of the four ratings (x, m, a, s) can have an integer value ranging from a minimum of 1 to a maximum of 4000. Of all possible distinct combinations of ratings, your job is to figure out which ones will be accepted.

In the above example, there are 167409079868000 distinct combinations of ratings that will be accepted.

Consider only your list of workflows; the list of part ratings that the Elves wanted you to sort is no longer relevant. How many distinct combinations of ratings will be accepted by the Elves' workflows?


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

def graph_traversal_based_on_series_of_conditions(part, input_str, DEBUG = False):

  # CONSTANTS

  x, m, a, s = 'x', 'm', 'a', 's'
  GREATER_THAN, LESS_THAN = '>', '<'
  A, R = 'A', 'R'


  # DATA STRUCTURES

  RULES = {}
  PARTS = []                                                                              # PART 1 ONLY


  # PARSE INPUT DATA

  input_arr = input_str.split('\n\n')
  [ rules, parts ] = input_arr

  # Extract rules data
  for rule in rules.split('\n'):
    workflow, remainder = rule.split('{')
    remainder = remainder[:-1]
    steps_data = remainder.split(',')
    steps_data_split = [ step.split(':') for step in steps_data]
    RULES[workflow] = [                                                                   # e.g. RULES['ex'][0] = { 'value': 'x', 'comp': '>', 'threshold': 10, 'destination': 'one' }
      ({
        'value': step[0][0],
        'comp': step[0][1],
        'threshold': int(step[0][2:]),
        'destination': step[-1]
      }) if len(step) > 1
      else ({                                                                             # e.g. RULES['pv'][1] = { 'value': None, 'comp': None, 'threshold': None, 'destination': 'A' }
        'value': None,
        'comp': None,
        'threshold': None,
        'destination': step[-1]
      }) for step in steps_data_split
    ]

  # Extract parts data
  for p in parts.split('\n'):                                                             # CAREFUL! don't call this variable `part` (which is an arg in your function)
    p = p[1:-1]                                                                           # strip the curly braces
    components = p.split(',')
    PARTS.append({
      component.split('=')[0]: int(component.split('=')[1])
    for component in components })


  # ANALYZE

  if part == 1:                                                                           # PART 1: ADD UP VALUES FOR ACCEPTED PARTS

    ACCEPTED_PARTS = []

    for p in PARTS:
      workflow = 'in'                                                                     # always start at 'in'
      while workflow not in (A, R):
        for rule in RULES[workflow]:
          if rule['value']:                                                               # if rule has a condition
            value = p[rule['value']]
            if rule['comp'] == GREATER_THAN:
              if value > rule['threshold']:
                workflow = rule['destination']
                break
            elif rule['comp'] == LESS_THAN:
              if value < rule['threshold']:
                workflow = rule['destination']
                break
            else: assert False
          else:                                                                           # if rule does not have a condition (last rule)
            workflow = rule['destination']

      # Reached A or R
      if workflow == A: ACCEPTED_PARTS.append(p)
      else: assert workflow == R

    return sum([ p[x] + p[m] + p[a] + p[s] for p in ACCEPTED_PARTS ])

  else:

    RANGES_TO_GET_TO_A = []

    def deep_copy_ranges(ranges):
      return {
        c: ranges[c].copy()
        for c in (x, m, a, s)
      }

    def dfs(workflow, ranges):

      ranges_copy = deep_copy_ranges(ranges)                                              # VERY IMPORTANT: MAKE A *DEEP COPY* OF THE RANGES OBJECT!

      # Base cases: A or R

      if workflow == A:
        RANGES_TO_GET_TO_A.append(ranges_copy)
        return
      if workflow == R:
        return

      # Recursive case

      for rule in RULES[workflow]:

        if rule['value']:                                                                 # if rule has a condition

          value = rule['value']
          if rule['comp'] == GREATER_THAN:

            old_value = ranges_copy[value][0]

            if ranges_copy[value][1] > rule['threshold']:                                 # if it is possible to match this rule...
              ranges_copy[value][0] = max(ranges_copy[value][0], rule['threshold'] + 1)
              dfs(rule['destination'], ranges_copy)                                       # ...recurse with updated ranges
            
            ranges_copy[value][0] = old_value                                             # and in any event, NEGATE the rule...
            ranges_copy[value][1] = min(ranges_copy[value][1], rule['threshold'])         # ...and prepare for next rule (next loop iteration)

          elif rule['comp'] == LESS_THAN:

            old_value = ranges_copy[value][1]

            if ranges_copy[value][0] < rule['threshold']:                                 # if it is possible to match this rule...
              ranges_copy[value][1] = min(ranges_copy[value][1], rule['threshold'] - 1)   # ...recurse with updated ranges
              dfs(rule['destination'], ranges_copy)
            
            ranges_copy[value][1] = old_value                                             # and in any event, NEGATE the rule...
            ranges_copy[value][0] = max(ranges_copy[value][0], rule['threshold'])         # ...and prepare for next rule (next loop iteration)

          else: assert False

        else:                                                                             # if rule does not have a condition (last rule)

          dfs(rule['destination'], ranges_copy)                                           # always recurse with an unmodified set of ranges

    # Kick-start recursion
    MIN_VALUE, MAX_VALUE = 1, 4000
    dfs('in', { c: [MIN_VALUE, MAX_VALUE] for c in (x, m, a, s) })

    # For each set of ranges that get to A, calculate the permutations and add to the total
    total = 0
    for possible_range in RANGES_TO_GET_TO_A:
      product = 1
      for interval in possible_range.values():
        width = interval[1] - interval[0] + 1
        product *= width
      total += product

    return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = graph_traversal_based_on_series_of_conditions
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

sample_input = """px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 19114
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 367602
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 167409079868000
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 125317461667458
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)