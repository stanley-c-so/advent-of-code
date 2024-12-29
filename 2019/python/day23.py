"""

--- Day 23: Category Six ---

The droids have finished repairing as much of the ship as they can. Their report indicates that this was a Category 6 disaster - not because it was that bad, but because it destroyed the stockpile of Category 6 network cables as well as most of the ship's network infrastructure.

You'll need to rebuild the network from scratch.

The computers on the network are standard Intcode computers that communicate by sending packets to each other. There are 50 of them in total, each running a copy of the same Network Interface Controller (NIC) software (your puzzle input). The computers have network addresses 0 through 49; when each computer boots up, it will request its network address via a single input instruction. Be sure to give each computer a unique network address.

Once a computer has received its network address, it will begin doing work and communicating over the network by sending and receiving packets. All packets contain two values named X and Y. Packets sent to a computer are queued by the recipient and read in the order they are received.

To send a packet to another computer, the NIC will use three output instructions that provide the destination address of the packet followed by its X and Y values. For example, three output instructions that provide the values 10, 20, 30 would send a packet with X=20 and Y=30 to the computer with address 10.

To receive a packet from another computer, the NIC will use an input instruction. If the incoming packet queue is empty, provide -1. Otherwise, provide the X value of the next packet; the computer will then use a second input instruction to receive the Y value for the same packet. Once both values of the packet are read in this way, the packet is removed from the queue.

Note that these input and output instructions never block. Specifically, output instructions do not wait for the sent packet to be received - the computer might send multiple packets before receiving any. Similarly, input instructions do not wait for a packet to arrive - if no packet is waiting, input instructions should receive -1.

Boot up all 50 computers and attach them to your network. What is the Y value of the first packet sent to address 255?


--- Part Two ---

Packets sent to address 255 are handled by a device called a NAT (Not Always Transmitting). The NAT is responsible for managing power consumption of the network by blocking certain packets and watching for idle periods in the computers.

If a packet would be sent to address 255, the NAT receives it instead. The NAT remembers only the last packet it receives; that is, the data in each packet it receives overwrites the NAT's packet memory with the new packet's X and Y values.

The NAT also monitors all computers on the network. If all computers have empty incoming packet queues and are continuously trying to receive packets without sending packets, the network is considered idle.

Once the network is idle, the NAT sends only the last packet it received to address 0; this will cause the computers on the network to resume activity. In this way, the NAT can throttle power consumption of the network when the ship needs power in other areas.

Monitor packets released to the computer at address 0 by the NAT. What is the first Y value delivered by the NAT to the computer at address 0 twice in a row?

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

  def update_state_before_returning(MACHINE, ptr, input_ptr, output_ptr, relative_base):  # FOR THIS PROBLEM ONLY
    MACHINE['ptr'] = ptr                                                                  # i didn't want to change the code too much
    MACHINE['input_ptr'] = input_ptr                                                      # so i only update MACHINE before returning
    MACHINE['output_ptr'] = output_ptr
    MACHINE['relative_base'] = relative_base

  def simulate(MACHINE):

    INFINITE_LOOP_GUARD = 10 ** 0                                                         # ...

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


    ### GET STATE FROM GLOBAL OBJECT ###

    id = MACHINE['id']
    PROGRAM = MACHINE['MEMORY']
    INPUT = MACHINE['INPUT']
    OUTPUT = MACHINE['OUTPUT']
    ptr = MACHINE['ptr']
    input_ptr = MACHINE['input_ptr']
    output_ptr = MACHINE['output_ptr']
    relative_base = MACHINE['relative_base']

    packet_to_NAT = None
    
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

        write_idx = param1 if mode1 == '0' else (param1 + relative_base)
        if not (0 <= CPUS[id]['input_ptr'] < len(CPUS[id]['INPUT'])):
          PROGRAM_write(write_idx, -1)                                                    # provide -1 if no valid input
          IS_IDLE[id] = True                                                              # NOTE: important to toggle this at the right time.
                                                                                          # a computer is considered idle at the time of the input instruction
        else:
          PROGRAM_write(write_idx, INPUT[input_ptr])
          input_ptr += 1

        ptr += 2

      elif opcode == '04':                                                                # OUTPUT

        output = PROGRAM_get(param1) if mode1 == '0' else param1 if mode1 == '1' else PROGRAM_get(param1 + relative_base)
        OUTPUT.append(output)

        if len(OUTPUT) - output_ptr == 3:
          [ destination, x, y ] = OUTPUT[-3:]
          if destination == NAT_ADDRESS:
            packet_to_NAT = (x, y)
            if part == 1 and DISPLAY_EXTRA_INFO:
              print(f"Packet sent to {NAT_ADDRESS} (NAT): x = {x}; y = {y}")
          else:
            assert 0 <= destination < NUM_CPUS, f"DESTINATION OUT OF RANGE: {destination}"
            CPUS[destination]['INPUT'].append(x)
            CPUS[destination]['INPUT'].append(y)
            IS_IDLE[destination] = False                                                  # NOTE: set idle to false as soon as we add to its input queue
          output_ptr += 3

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

      ### ALWAYS RETURN AFTER EACH OPERATION, TO KEEP ALL MACHINES RUNNING AT THE SAME "SPEED" ###

      update_state_before_returning(MACHINE, ptr, input_ptr, output_ptr, relative_base)
      return (MACHINE, packet_to_NAT)

    assert False, f"TRIPPED INFINITE LOOP GUARD: EXCEEDED {INFINITE_LOOP_GUARD} ITERATIONS"


  # ANALYZE

  if part == 2 and not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  NAT_ADDRESS = 255

  NUM_CPUS = 50

  CPUS = [ {
    'id': id,
    'MEMORY': PROGRAM.copy(),
    'INPUT': [ id ],
    'OUTPUT': [],
    'ptr': 0,
    'input_ptr': 0,
    'output_ptr': 0,
    'relative_base': 0,
  } for id in range(NUM_CPUS) ]

  IS_IDLE = [ False ] * NUM_CPUS  # QQQ

  last_packet_to_NAT = None
  last_packet_to_NAT_sent_to_CPU_0 = None

  INFINITE_LOOP_GUARD = 10 ** 6                                                           # part 2 goes to index 102413
  for _ in range(INFINITE_LOOP_GUARD):
    for idx in range(NUM_CPUS):
      
      MACHINE, packet_to_NAT = simulate(CPUS[idx])
      
      if packet_to_NAT:
        last_packet_to_NAT = packet_to_NAT
        if part == 1:                                                                     # PART 1: RETURN y VALUE OF FIRST PACKET TO NAT
          (x, y) = packet_to_NAT
          return y
        
      # Run the NAT in part 2 only, after the last CPU is processed, and only when the network is idle
      if part == 2 and idx == NUM_CPUS - 1 and all(IS_IDLE):

        # It's possible for the network to be idle before a packet was ever sent to NAT. Just continue if this happens.
        if not last_packet_to_NAT: continue

        # Send to CPU 0 the last packet that was sent to NAT
        (x, y) = last_packet_to_NAT
        CPUS[0]['INPUT'].append(x)
        CPUS[0]['INPUT'].append(y)
        IS_IDLE[0] = False                                                                # NOTE: set idle to false as soon as we add to its input queue

        if DISPLAY_EXTRA_INFO:
          print(f"NAT sending packet to CPU 0: x = {x}; y = {y}")

        # Check for an immediate repeat of the y value that NAT sends to CPU 0
        if last_packet_to_NAT_sent_to_CPU_0:
          (xx, yy) = last_packet_to_NAT_sent_to_CPU_0
          if y == yy:
            if DISPLAY_EXTRA_INFO:
              print(f"NAT sending y value {y} to CPU 0 for the second time in a row")            
            if part == 2 and not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~5.25 seconds
            return y                                                                      # PART 2: RETURN FIRST IMMEDIATELY REPEATED Y VALUE SENT FROM NAT TO CPU 0

        last_packet_to_NAT_sent_to_CPU_0 = last_packet_to_NAT

  assert False, f"TRIPPED INFINITE LOOP GUARD: EXCEEDED {INFINITE_LOOP_GUARD} ITERATIONS"


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
test_expected = 20225
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 14348
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)