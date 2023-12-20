"""

--- Day 20: Pulse Propagation ---

With your help, the Elves manage to find the right parts and fix all of the machines. Now, they just need to send the command to boot up the machines and get the sand flowing again.

The machines are far apart and wired together with long cables. The cables don't connect to the machines directly, but rather to communication modules attached to the machines that perform various initialization tasks and also act as communication relays.

Modules communicate using pulses. Each pulse is either a high pulse or a low pulse. When a module sends a pulse, it sends that type of pulse to each module in its list of destination modules.

There are several different types of modules:

Flip-flop modules (prefix %) are either on or off; they are initially off. If a flip-flop module receives a high pulse, it is ignored and nothing happens. However, if a flip-flop module receives a low pulse, it flips between on and off. If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.

Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules; they initially default to remembering a low pulse for each input. When a pulse is received, the conjunction module first updates its memory for that input. Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.

There is a single broadcast module (named broadcaster). When it receives a pulse, it sends the same pulse to all of its destination modules.

Here at Desert Machine Headquarters, there is a module with a single button on it called, aptly, the button module. When you push the button, a single low pulse is sent directly to the broadcaster module.

After pushing the button, you must wait until all pulses have been delivered and fully handled before pushing it again. Never push the button if modules are still processing pulses.

Pulses are always processed in the order they are sent. So, if a pulse is sent to modules a, b, and c, and then module a processes its pulse and sends more pulses, the pulses sent to modules b and c would have to be handled first.

The module configuration (your puzzle input) lists each module. The name of the module is preceded by a symbol identifying its type, if any. The name is then followed by an arrow and a list of its destination modules. For example:

broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a

In this module configuration, the broadcaster has three destination modules named a, b, and c. Each of these modules is a flip-flop module (as indicated by the % prefix). a outputs to b which outputs to c which outputs to another module named inv. inv is a conjunction module (as indicated by the & prefix) which, because it has only one input, acts like an inverter (it sends the opposite of the pulse type it receives); it outputs to a.

By pushing the button once, the following pulses are sent:

button -low-> broadcaster
broadcaster -low-> a
broadcaster -low-> b
broadcaster -low-> c
a -high-> b
b -high-> c
c -high-> inv
inv -low-> a
a -low-> b
b -low-> c
c -low-> inv
inv -high-> a

After this sequence, the flip-flop modules all end up off, so pushing the button again repeats the same sequence.

Here's a more interesting example:

broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output

This module configuration includes the broadcaster, two flip-flops (named a and b), a single-input conjunction module (inv), a multi-input conjunction module (con), and an untyped module named output (for testing purposes). The multi-input conjunction module con watches the two flip-flop modules and, if they're both on, sends a low pulse to the output module.

Here's what happens if you push the button once:

button -low-> broadcaster
broadcaster -low-> a
a -high-> inv
a -high-> con
inv -low-> b
con -high-> output
b -high-> con
con -low-> output

Both flip-flops turn on and a low pulse is sent to output! However, now that both flip-flops are on and con remembers a high pulse from each of its two inputs, pushing the button a second time does something different:

button -low-> broadcaster
broadcaster -low-> a
a -low-> inv
a -low-> con
inv -high-> b
con -high-> output

Flip-flop a turns off! Now, con remembers a low pulse from module a, and so it sends only a high pulse to output.

Push the button a third time:

button -low-> broadcaster
broadcaster -low-> a
a -high-> inv
a -high-> con
inv -low-> b
con -low-> output
b -low-> con
con -high-> output

This time, flip-flop a turns on, then flip-flop b turns off. However, before b can turn off, the pulse sent to con is handled first, so it briefly remembers all high pulses for its inputs and sends a low pulse to output. After that, flip-flop b turns off, which causes con to update its state and send a high pulse to output.

Finally, with a on and b off, push the button a fourth time:

button -low-> broadcaster
broadcaster -low-> a
a -low-> inv
a -low-> con
inv -high-> b
con -high-> output

This completes the cycle: a turns off, causing con to remember only low pulses and restoring all modules to their original states.

To get the cables warmed up, the Elves have pushed the button 1000 times. How many pulses got sent as a result (including the pulses sent by the button itself)?

In the first example, the same thing happens every time the button is pushed: 8 low pulses and 4 high pulses are sent. So, after pushing the button 1000 times, 8000 low pulses and 4000 high pulses are sent. Multiplying these together gives 32000000.

In the second example, after pushing the button 1000 times, 4250 low pulses and 2750 high pulses are sent. Multiplying these together gives 11687500.

Consult your module configuration; determine the number of low pulses and high pulses that would be sent after pushing the button 1000 times, waiting for all pulses to be fully handled after each push of the button. What do you get if you multiply the total number of low pulses sent by the total number of high pulses sent?


--- Part Two ---

The final machine responsible for moving the sand down to Island Island has a module attached named rx. The machine turns on when a single low pulse is sent to rx.

Reset all modules to their default states. Waiting for all pulses to be fully handled after each button press, what is the fewest number of button presses required to deliver a single low pulse to the module named rx?

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

def analyze_pulses_sent_by_modules(part, input_str, DEBUG = False):

  # CONSTANTS

  BROADCASTER, FLIPFLOP, CONJUNCTION, BUTTON = 'broadcaster', '%', '&', 'BUTTON'
  ON, OFF, HIGH, LOW = 'ON', 'OFF', 'HIGH', 'LOW'
  RX = 'rx'


  # DATA STRUCTURES

  MODULES = {}
  INPUTS_BY_MODULE = {}

  RX_FEEDER_INPUT_LAST_SEEN = {}                                                          # PART 2 ONLY
  PERIOD_FOR_RX_FEEDER_INPUT = {}                                                         # PART 2 ONLY


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')

  # First pass: Get all data, except for INPUTS_BY_MODULE
  for line in input_arr:

    module, destinations_data = line.split(' -> ')

    # Get module type
    module_type = BROADCASTER if module == BROADCASTER \
                    else FLIPFLOP if module[0] == FLIPFLOP \
                    else CONJUNCTION if module[0] == CONJUNCTION \
                    else None
    assert module_type != None

    # Strip module name if module starts with % or &
    if module_type in (FLIPFLOP, CONJUNCTION):
      module = module[1:]

    # Extract destination data
    destinations = destinations_data.split(', ')
    for destination in destinations:
      if not destination in INPUTS_BY_MODULE: INPUTS_BY_MODULE[destination] = []
      INPUTS_BY_MODULE[destination].append(module)

    # Save entry in data structure
    MODULES[module] = {
      'type': module_type,
      'destinations': destinations,
      'status': OFF if module_type == FLIPFLOP else None,
    }

  # Second pass: Populate INPUTS_BY_MODULE
  for module in MODULES:
    MODULES[module]['memory'] = { inp: LOW for inp in INPUTS_BY_MODULE[module] } \
                                if MODULES[module]['type'] == CONJUNCTION \
                                else None


  # Initialize PERIOD_FOR_RX_FEEDER_INPUT for part 2
  if RX in INPUTS_BY_MODULE:                                                          # PART 2: FOR DESTIONATION 'rx'...
    assert len(INPUTS_BY_MODULE[RX]) == 1                                             # ...assume it has only 1 input (which is true for my data)
    RX_FEEDER = INPUTS_BY_MODULE[RX][0]                                               # grab the name of the module that feeds into rx (for me, it's ll)
    for inp in INPUTS_BY_MODULE[RX_FEEDER]:                                           # init part 2 data structures with all inputs into that module (ll)
      RX_FEEDER_INPUT_LAST_SEEN[inp] = None
      PERIOD_FOR_RX_FEEDER_INPUT[inp] = None
  

  # INIT

  pulse_count_high = 0
  pulse_count_low = 0
  num_presses = 0


  # ANALYZE

  PART_1_LIMIT = 1000
  while (num_presses < PART_1_LIMIT if part == 1 else True):                          # PART 1: PRESS BUTTON 1000 TIMES; PART 2: PRESS INDEFINITELY

    num_presses += 1

    # Queue data structure
    Q = deque()
    Q.append( (BUTTON, BROADCASTER, LOW) )
    while len(Q):

      sender, module, pulse_level = Q.popleft()
      
      if pulse_level == HIGH:   pulse_count_high += 1
      elif pulse_level == LOW:  pulse_count_low += 1
      else:                     assert False


      """
      EXPLANATION FOR PART 2:

      It turns out my answer is 241,528,184,647,003 (over 241T). Obviously, we don't have time to actually simulate this.

      I inspected my data by hand and quickly found that only one module, ll, feeds into rx. So on data parse, I saved ll into RX_FEEDER.

      Only 4 modules feed into RX_FEEDER (ll): kl, vm, kv, vb. In order for ll to send a low pulse to rx, ll's memory of these 4 modules
      must be high. So, I suspected there was a cycle in terms of the button press count that would result in each of the 4 modules sending
      a high pulse to ll.

      Here, we run code if the target module is ll, and the pulse level is high. This code updates the last seen count for the sender.
      If we have already seen at least two button press counts for this sender, we can take the difference and consider that to be its period.
      In the future, each time we see this sender again (with a high pulse level), we can verify that the period has not changed.

      Once we know all 4 periods (and the code hasn't broken, so we know the periods are constant), then we can return the LCM of the periods.
      """

      # PART 2: IF MODULE FEEDS INTO RX (ll for my data), UPDATE ITS PERIOD DATA
      if part == 2 and module == RX_FEEDER and pulse_level == HIGH:

        # If we've seen this sender before, but only once, because we don't know the period yet, then set the period
        if RX_FEEDER_INPUT_LAST_SEEN[sender] != None and PERIOD_FOR_RX_FEEDER_INPUT[sender] == None:
          assert num_presses != RX_FEEDER_INPUT_LAST_SEEN[sender]
          PERIOD_FOR_RX_FEEDER_INPUT[sender] = num_presses - RX_FEEDER_INPUT_LAST_SEEN[sender]

        # If we know the period of this sender, verify that there is no change to the period now
        if PERIOD_FOR_RX_FEEDER_INPUT[sender] != None:
          assert PERIOD_FOR_RX_FEEDER_INPUT[sender] == num_presses - RX_FEEDER_INPUT_LAST_SEEN[sender]

        # In all cases, update the button press count for this sender
        RX_FEEDER_INPUT_LAST_SEEN[sender] = num_presses

        # If we now know the period data for all RX feeders, return the LCM
        PERIOD_FOR_RX_FEEDER_INPUT_VALUES = PERIOD_FOR_RX_FEEDER_INPUT.values()
        if all([ val != None for val in PERIOD_FOR_RX_FEEDER_INPUT_VALUES]):
          if DISPLAY_EXTRA_INFO:
            print(f"Module that feeds into rx: {RX_FEEDER}")
            print(f"Periods for modules that feed into {RX_FEEDER}: {tuple(PERIOD_FOR_RX_FEEDER_INPUT_VALUES)}")
          return reduce(lcm, PERIOD_FOR_RX_FEEDER_INPUT_VALUES)


      if not module in MODULES: continue                                              # prevent code from throwing error on final module with no destinations

      data = MODULES[module]

      if data['type'] == BROADCASTER:                                                 # BROADCASTER...

        for destination in data['destinations']:                                      # ...simply pass on the same pulse to all destination modules
          Q.append( (module, destination, pulse_level) )

      elif data['type'] == FLIPFLOP:                                                  # FLIPFLOP...

        if pulse_level == HIGH: continue                                              # ...do nothing if pulse level is high
        if data['status'] == OFF:                                                     # ...else, if module is off...
          data['status'] = ON                                                           # ...switch module to on...
          for destination in data['destinations']:                                      # ...and send a high pulse to all destination modules
            Q.append( (module, destination, HIGH) )
        elif data['status'] == ON:                                                    # ...else, if module is on...
          data['status'] = OFF                                                          # ...switch module to off...
          for destination in data['destinations']:                                      # ...and send a low pulse to all destination modules
            Q.append( (module, destination, LOW) )
        else: assert False

      elif data['type'] == CONJUNCTION:                                               # CONJUNCTION...

        data['memory'][sender] = pulse_level                                          # ...update memory for this sender
        if all([ val == HIGH for val in data['memory'].values() ]):                   # ...then, if memory values for all inputs is high...
          for destination in data['destinations']:                                      # ...send a low pulse to all destination modules
            Q.append( (module, destination, LOW) )
        else:                                                                         # ...else, if memory value for at least one input is low...
          for destination in data['destinations']:                                      # ...send a high pulse to all destination modules
            Q.append( (module, destination, HIGH) )

      else: assert False

  if DISPLAY_EXTRA_INFO:
    print(f"Low pulses: {pulse_count_low}; High pulses: {pulse_count_high}")
  return pulse_count_low * pulse_count_high                                           # PART 1: ONCE LOOP ENDS AFTER 1000 BUTTON PRESSES, RETURN PRODUCT


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_pulses_sent_by_modules
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

sample_input = """broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a"""

sample_input2 = """broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 32000000
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 11687500
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 743090292
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 241528184647003
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)