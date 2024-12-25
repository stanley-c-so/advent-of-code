"""

--- Day 24: Crossed Wires ---

You and The Historians arrive at the edge of a large grove somewhere in the jungle. After the last incident, the Elves installed a small device that monitors the fruit. While The Historians search the grove, one of them asks if you can take a look at the monitoring device; apparently, it's been malfunctioning recently.

The device seems to be trying to produce a number through some boolean logic gates. Each gate has two inputs and one output. The gates all operate on values that are either true (1) or false (0).

AND gates output 1 if both inputs are 1; if either input is 0, these gates output 0.
OR gates output 1 if one or both inputs is 1; if both inputs are 0, these gates output 0.
XOR gates output 1 if the inputs are different; if the inputs are the same, these gates output 0.
Gates wait until both inputs are received before producing output; wires can carry 0, 1 or no value at all. There are no loops; once a gate has determined its output, the output will not change until the whole system is reset. Each wire is connected to at most one gate output, but can be connected to many gate inputs.

Rather than risk getting shocked while tinkering with the live system, you write down all of the gate connections and initial wire values (your puzzle input) so you can consider them in relative safety. For example:

x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02
Because gates wait for input, some wires need to start with a value (as inputs to the entire system). The first section specifies these values. For example, x00: 1 means that the wire named x00 starts with the value 1 (as if a gate is already outputting that value onto that wire).

The second section lists all of the gates and the wires connected to them. For example, x00 AND y00 -> z00 describes an instance of an AND gate which has wires x00 and y00 connected to its inputs and which will write its output to wire z00.

In this example, simulating these gates eventually causes 0 to appear on wire z00, 0 to appear on wire z01, and 1 to appear on wire z02.

Ultimately, the system is trying to produce a number by combining the bits on all wires starting with z. z00 is the least significant bit, then z01, then z02, and so on.

In this example, the three output bits form the binary number 100 which is equal to the decimal number 4.

Here's a larger example:

x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
After waiting for values on all wires starting with z, the wires in this system have the following values:

bfw: 1
bqk: 1
djm: 1
ffh: 0
fgs: 1
frj: 1
fst: 1
gnj: 1
hwm: 1
kjc: 0
kpj: 1
kwq: 0
mjb: 1
nrd: 1
ntg: 0
pbm: 1
psh: 1
qhw: 1
rvg: 0
tgd: 0
tnw: 1
vdt: 1
wpb: 0
z00: 0
z01: 0
z02: 0
z03: 1
z04: 0
z05: 1
z06: 1
z07: 1
z08: 1
z09: 1
z10: 1
z11: 0
z12: 0
Combining the bits from all wires starting with z produces the binary number 0011111101000. Converting this number to decimal produces 2024.

Simulate the system of gates and wires. What decimal number does it output on the wires starting with z?


--- Part Two ---

After inspecting the monitoring device more closely, you determine that the system you're simulating is trying to add two binary numbers.

Specifically, it is treating the bits on wires starting with x as one binary number, treating the bits on wires starting with y as a second binary number, and then attempting to add those two numbers together. The output of this operation is produced as a binary number on the wires starting with z. (In all three cases, wire 00 is the least significant bit, then 01, then 02, and so on.)

The initial values for the wires in your puzzle input represent just one instance of a pair of numbers that sum to the wrong value. Ultimately, any two binary numbers provided as input should be handled correctly. That is, for any combination of bits on wires starting with x and wires starting with y, the sum of the two numbers those bits represent should be produced as a binary number on the wires starting with z.

For example, if you have an addition system with four x wires, four y wires, and five z wires, you should be able to supply any four-bit number on the x wires, any four-bit number on the y numbers, and eventually find the sum of those two numbers as a five-bit number on the z wires. One of the many ways you could provide numbers to such a system would be to pass 11 on the x wires (1011 in binary) and 13 on the y wires (1101 in binary):

x00: 1
x01: 1
x02: 0
x03: 1
y00: 1
y01: 0
y02: 1
y03: 1
If the system were working correctly, then after all gates are finished processing, you should find 24 (11+13) on the z wires as the five-bit binary number 11000:

z00: 0
z01: 0
z02: 0
z03: 1
z04: 1
Unfortunately, your actual system needs to add numbers with many more bits and therefore has many more wires.

Based on forensic analysis of scuff marks and scratches on the device, you can tell that there are exactly four pairs of gates whose output wires have been swapped. (A gate can only be in at most one such pair; no gate's output was swapped multiple times.)

For example, the system below is supposed to find the bitwise AND of the six-bit number on x00 through x05 and the six-bit number on y00 through y05 and then write the result as a six-bit number on z00 through z05:

x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00
However, in this example, two pairs of gates have had their output wires swapped, causing the system to produce wrong answers. The first pair of gates with swapped outputs is x00 AND y00 -> z05 and x05 AND y05 -> z00; the second pair of gates is x01 AND y01 -> z02 and x02 AND y02 -> z01. Correcting these two swaps results in this system that works as intended for any set of initial values on wires that start with x or y:

x00 AND y00 -> z00
x01 AND y01 -> z01
x02 AND y02 -> z02
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z05
In this example, two pairs of gates have outputs that are involved in a swap. By sorting their output wires' names and joining them with commas, the list of wires involved in swaps is z00,z01,z02,z05.

Of course, your actual system is much more complex than this, and the gates that need their outputs swapped could be anywhere, not just attached to a wire starting with z. If you were to determine that you need to swap output wires aaa with eee, ooo with z99, bbb with ccc, and aoc with z24, your answer would be aaa,aoc,bbb,ccc,eee,ooo,z24,z99.

Your system of gates and wires has four pairs of gates which need their output wires swapped - eight wires in total. Determine which four pairs of gates need their outputs swapped so that your system correctly performs addition; what do you get if you sort the names of the eight wires involved in a swap and then join those names with commas?

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

def solve_logic_gates(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  OR, AND, XOR = 'OR', 'AND', 'XOR'


  # DATA STRUCTURES

  WIRES = {}
  GATES = {}


  # PARSE INPUT DATA

  [ input_data, gate_data ] = input_str.split('\n\n')
  
  for line in input_data.split('\n'):
    [ wire, value ] = line.split(': ')
    WIRES[wire] = int(value)

  for line in gate_data.split('\n'):
    [ gate, out ] = line.split(' -> ')
    [ a, operator, b ] = gate.split(' ')
    GATES[out] = { 'a': a, 'b': b, 'operator': operator }

    if not DEBUG and (a[0] in ('x', 'y') or b[0] in ('x', 'y')):                        # FOR REAL DATA ONLY:
      assert { a[0], b[0] } == { 'x', 'y' } and a[1:] == b[1:]                          # assert that where you see x,
                                                                                        # you also see y, and vice versa,
                                                                                        # and always for the same bits on
                                                                                        # the same line. e.g. x00 and y00

    for wire in (a, b, out):
      if wire not in WIRES: WIRES[wire] = None


  # UTILITY

  def simulate(WIRES, GATES):

    cycle_checker = set()

    def get_wire_value(wire):
      assert wire in WIRES, f"WIRE NOT DISCOVERED ON DATA PARSE: {wire}"
      if WIRES[wire] == None:
        assert wire in GATES, f"WIRE NOT INITIALLY KNOWN, AND NOT FOUND IN GATES: {wire}"

        # if there is somehow a cyclic dependency, simply return None
        if wire in cycle_checker: return None          
        cycle_checker.add(wire)

        a = GATES[wire]['a']
        b = GATES[wire]['b']
        operator = GATES[wire]['operator']

        if operator == OR:
          WIRES[wire] = 1 if (get_wire_value(a) or get_wire_value(b)) else 0
        elif operator == AND:
          WIRES[wire] = 1 if (get_wire_value(a) and get_wire_value(b)) else 0
        elif operator == XOR:
          WIRES[wire] = 1 if (get_wire_value(a) != get_wire_value(b)) else 0
        else:
          assert False, f"UNRECOGNIZED OPERATOR: {operator}"

      return WIRES[wire]
    
    for wire in WIRES: get_wire_value(wire)
    valid = None not in WIRES.values()
    return (valid, WIRES)


  def get_binary_for_wires_beginning_with_char(c, SIM_DATA):
    all_wires = sorted([ wire for wire in SIM_DATA.keys() if wire[0] == c ], reverse=True)
    binary = ''.join([ str(SIM_DATA[wire]) for wire in all_wires ])
    return binary


  # MANUALLY RESOLVE ERRORS IN PART 2 REAL DATA
  # Using the assertions in code, I was able to catch the 4 places that needed to be swapped.
  # I then added lines here to manually "fix" them and wait for the next error to be caught.

  if not DEBUG and part == 2:

    pass

    # x06 AND y06 -> z06
    # qtf XOR nsp -> ksv
    GATES['z06'], GATES['ksv'] = GATES['ksv'], GATES['z06']

    # x10 AND y10 -> nbd
    # y10 XOR x10 -> kbs
    GATES['nbd'], GATES['kbs'] = GATES['kbs'], GATES['nbd']

    # tsm OR dnc -> z20
    # bnp XOR mtq -> tqq
    GATES['z20'], GATES['tqq'] = GATES['tqq'], GATES['z20']

    # cmj AND hpp -> z39
    # hpp XOR cmj -> ckb
    GATES['z39'], GATES['ckb'] = GATES['ckb'], GATES['z39']


  # ANALYZE

  TIME_AT_START = time.time()
  NEXT_MIN_TARGET = 1

  if part == 1:                                                                         # PART 1: FIND VALUE OF Z NUMBER

    valid, SIM_DATA = simulate(WIRES, GATES)

    assert valid, f"CYCLE DETECTED"

    z_binary = get_binary_for_wires_beginning_with_char('z', SIM_DATA)
    z_decimal = int(z_binary, 2)

    return z_decimal

  else:                                                                                 # PART 2: IDENTIFY THE SWAPPED WIRES
                                                                                        # TO GET THE SYSTEM TO PERFORM THE
                                                                                        # INTENDED OPERATION FOR ANY X, Y -> Z

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    num_bits = 0
    while 'x' + ('{0:02}').format(num_bits) in WIRES: num_bits += 1
    X_BITS = num_bits
    num_bits = 0
    while 'y' + ('{0:02}').format(num_bits) in WIRES: num_bits += 1
    Y_BITS = num_bits

    assert X_BITS == Y_BITS, f"X_BITS {X_BITS} IS NOT EQUAL TO Y_BITS {Y_BITS}"         # all data support this assumption.
                                                                                        # this makes sense, as the two intended
                                                                                        # operations (& and +) should have the
                                                                                        # commutative property.

    Z_BITS = X_BITS + (0 if DEBUG else 1)                                               # in sample, operation is &, so Z_BITS is equal
                                                                                        # in actual data, operation is +, so need one extra bit in Z_BITS


    ##### PROGRAMMATIC SOLUTION FOR SAMPLE DATA #####

    if DEBUG:

      from itertools import permutations
      from random import randint

      intended_operation, num_pairs_swapped = args

      GATE_KEYS = list(GATES.keys())

      good_pairs = set()
      for pairs in permutations(GATE_KEYS, num_pairs_swapped * 2):                      # build out every possible swapping and test

        if floor((time.time() - TIME_AT_START) / 60) == NEXT_MIN_TARGET:
          print(f"{NEXT_MIN_TARGET} mins have passed since beginning this run")
          NEXT_MIN_TARGET += 1

        WIRES_COPY = WIRES.copy()
        GATES_COPY = GATES.copy()
        for i in range(0, len(pairs), 2):
          a, b = pairs[i], pairs[i + 1]
          GATES_COPY[a], GATES_COPY[b] = GATES_COPY[b], GATES_COPY[a]
        
        valid, SIM_DATA = simulate(WIRES_COPY, GATES_COPY)
        if not valid:
          print(f"CYCLE DETECTED WITH PAIRS {pairs}")
          continue

        x_binary = get_binary_for_wires_beginning_with_char('x', SIM_DATA)
        x_decimal = int(x_binary, 2)
        y_binary = get_binary_for_wires_beginning_with_char('y', SIM_DATA)
        y_decimal = int(y_binary, 2)
        z_binary = get_binary_for_wires_beginning_with_char('z', SIM_DATA)
        z_decimal = int(z_binary, 2)
          
        if intended_operation(x_decimal, y_decimal) == z_decimal:                       # the swaps work for your given instance of x, y, z,
                                                                                        # but now we need to test other random values of x and y
                                                                                        # and see if we still get z after applying the operation
          
          if DISPLAY_EXTRA_INFO: print(f"Possible good swap: {pairs}")

          NUM_RANDOM_TESTS = 10

          passes_random_test = True
          for _ in range(NUM_RANDOM_TESTS):
            new_x = randint(0, 2 ** X_BITS - 1)
            new_y = randint(0, 2 ** Y_BITS - 1)

            new_x_binary = ('{0:0' + str(X_BITS) + 'b}').format(new_x)
            new_y_binary = ('{0:0' + str(Y_BITS) + 'b}').format(new_y)
            NEW_WIRES_COPY = WIRES.copy()

            for digit in range(X_BITS):
              NEW_WIRES_COPY['x' + '{0:02}'.format(digit)] = int(new_x_binary[-1 - digit])
            for digit in range(Y_BITS):
              NEW_WIRES_COPY['y' + '{0:02}'.format(digit)] = int(new_y_binary[-1 - digit])

            _, NEW_SIM_DATA = simulate(NEW_WIRES_COPY, GATES_COPY)
            x_binary = get_binary_for_wires_beginning_with_char('x', NEW_SIM_DATA)
            x_decimal = int(x_binary, 2)
            y_binary = get_binary_for_wires_beginning_with_char('y', NEW_SIM_DATA)
            y_decimal = int(y_binary, 2)
            z_binary = get_binary_for_wires_beginning_with_char('z', NEW_SIM_DATA)
            z_decimal = int(z_binary, 2)

            if intended_operation(x_decimal, y_decimal) != z_decimal:
              passes_random_test = False
              break
          
          if passes_random_test:
            if DISPLAY_EXTRA_INFO: print(f"PASSED RANDOM TEST!")
            serial = ','.join(sorted(pairs))
            good_pairs.add(serial)
          else:
            if DISPLAY_EXTRA_INFO: print(f"FAILED RANDOM TEST!")

      if DISPLAY_EXTRA_INFO: print(f"GOOD PAIRS: {good_pairs}")

      assert len(good_pairs) == 1                                                       # the puzzle is designed to have only one solution
      if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
      return list(good_pairs)[0]


    ##### MANUAL SOLUTION FOR REAL DATA, CRAFTED USING ANALYSIS #####


    else:

      """
      ANALYSIS (THIS ONLY WORKS WITH THE ACTUAL INPUT DATA!):

      We are told that the intended operation of this system is addition.

      Observations:
      - We are given 45 bits of x (x00 - x44) and 45 bits of y (y00 - y44) as input.
        This makes sense since addition is commutative.
      - z has 46 bits (z00 - z45). This makes sense because we have the potential to
        increase the bit count by 1 as a result of addition.
      - All gates involving an operand with x will also involve an operand with y, and vice
        versa. Moreover, they will always pertain to the same bit.
      - In fact, there are exactly 2 gates for each bit, and one will always have operator XOR
        and the other AND. So x00 XOR y00 and x00 AND y00, and same for 01, 02, etc.
      - At this point, ask yourself how you would model addition:
        - Let's set aside the first (rightmost) bit, z00, for now. Let's also set aside the last
          (leftmost) bit. For all bits in between, let's say for xn, yn, and zn, what would we expect
          to be the operator for the gate that feeds directly into zn? It can't be OR or AND. The only
          thing that makes sense is XOR: 0 + 0 = 0; 1 + 0 = 1; 0 + 1 = 1; 1 + 1 = 10 (0 in ones bit).
        - Therefore, we would expect the operation that feeds into zn to be XOR. This makes sense,
          as we can see that all but 4 of them are in fact XOR, which means the 4 gates that don't
          do this are 4 of the 8 problematic gates already.
        - Of course, we cannot simply xn XOR yn into zn (except for z00), due to the possibility
          of a carryover digit. Here's how this is handled:
          - xn XOR yn, the ones digit of addition, gets saved into some wire ("sum_wire")
          - What about if this produces a carryover? We can derive this from xn AND yn (since the
            only way to carry over is if both were 1), and store this into another wire ("carry_a")
          - This explains why every xn and yn appear together twice - once with XOR, once with AND
          - Let's assume we already have access to the carryover from the earlier bit ("last_carry").
            This also needs to be included in our sum. So we repeat the addition process:
              - sum_wire XOR last_carry finally gets saved into zn, as we have no more addition to do
              - sum_wire AND last_carry itself may generate a carryover, so save this into another wire
                ("carry_b") 
          - Note that it's true that we could have first performed addition between the last carryover
            with either x or y, before adding the other operand, but I suppose this would have been
            cruel. At any rate, since x and y always appear together with XOR and AND, we know this is
            thankfully not the case!
          - What can we say about the relationship between carry_a and carry_b? They cannot BOTH be 1.
            Remember, the only way for carry_a to be 1 is if xn and yn were both 1, which results in
            sum_wire of 0. The only way for carry_b to be 1 is if sum_wire and last_carry were both 1.
            Since sum_wire cannot both be 0 and 1, you cannot have carry_a and carry_b both be 1.
            However, since you could have them both be 0, or one of them be 1, this would represent
            the carryover to the next digit. So, next_carry is carry_a OR carry_b.
        - We now have a general model of what kinds of wires we will need. A quick note about the exceptions:
          - As stated previously, z00 = x00 XOR y00. It's a lot simpler because there is no last_carry to
            deal with.
          - The final bit, z45 = carry_a OR carry_b at i = 44. Since nothing further has to be done at
            i = 45, unlike with the other bits, we do not need to save carry_a OR carry_b into its own
            next_carry (or last_carry for i = 45) wire, as no operations need to be done with it.
        - Our general model is highly likely to be correct, because the number of gates is roughly equal
          to what we would expect it to be under this model.
      - So what do we do now? We assume each iteration is correct and we derive the wires that represent
        each of these things described by our model. We also set up assertion statements everywhere we can
        think of, so the swapped wires will trip them.
      - By doing this, we can zone in on roughly where the mistakes are, inspect the gates more carefully,
        and manually discover the mistakes.
        
      """

      def find_output_wire_given_inputs_and_operator(op1, op2, op):
        for out in GATES:
          if GATES[out]['operator'] == op \
            and { GATES[out]['a'], GATES[out]['b'] } == { op1, op2 }:
            return out
        return None

      last_carry_a, last_carry_b, last_carry = None, None, None

      for i in range(Z_BITS):
        idx = '{0:02}'.format(i)
        x_wire = 'x' + idx
        y_wire = 'y' + idx
        z_wire = 'z' + idx

        # LAST BIT - only have to verify that the last carry_a and carry_b form the final z
        if i == Z_BITS - 1:
          assert GATES[z_wire]['operator'] == OR \
            and { GATES[z_wire]['a'], GATES[z_wire]['b'] } == { last_carry_a, last_carry_b }

        # FIRST BIT - only have to verify that z00 is formed from x00 XOR y00
        elif idx == '00':
          assert GATES['z00']['operator'] == XOR \
            and { GATES['z00']['a'], GATES['z00']['b'] } == { 'x00', 'y00' }
          
          next_carry = find_output_wire_given_inputs_and_operator('x00', 'y00', AND)
          assert next_carry != None
          print(f"i = {i} | carry wire: {next_carry}")

          last_carry = next_carry

        # ALL IN-BETWEEN BITS
        else:

          if DISPLAY_EXTRA_INFO: print(f"i = {i} | last_carry: {last_carry}")

          # sum x and y with XOR to get sum_wire (the ones digit result)
          sum_wire = find_output_wire_given_inputs_and_operator(x_wire, y_wire, XOR)
          assert sum_wire != None, f"sum_wire assertion failed on i = {i}"
          if DISPLAY_EXTRA_INFO: print(f"i = {i} | sum_wire: {sum_wire}")

          # check if z is derived from something XOR something
          assert GATES[z_wire]['operator'] == XOR, f"i = {i} | z_wire assertion failed on i = {i}: not derived from {last_carry} XOR {sum_wire} | {GATES[z_wire]}"

          # now consider sum of sum_wire with last_carry, so apply XOR and get digit z (the ones digit result)
          assert { last_carry, sum_wire } == { GATES[z_wire]['a'], GATES[z_wire]['b'] }, f"XOR assertion failed on i = {i}: not derived from {last_carry} XOR {sum_wire} | {GATES[z_wire]}"

          # carry_a is the carry over from the sum of x and y
          carry_a = find_output_wire_given_inputs_and_operator(x_wire, y_wire, AND)
          assert carry_a != None, f"carry_a assertion failed on i = {i}"
          print(f"i = {i} | carry_a: {carry_a}")

          # carry_b is the carry over from summing sum_wire and last_carry
          carry_b = find_output_wire_given_inputs_and_operator(sum_wire, last_carry, AND)
          assert carry_b != None, f"carry_b assertion failed on i = {i}"
          print(f"i = {i} | carry_b: {carry_b}")

          # NOTE: carry_a and carry_b cannot BOTH be true.
          # however, next_carry depends on whether ONE of them is true
          next_carry = find_output_wire_given_inputs_and_operator(carry_a, carry_b, OR)
          assert next_carry != None, f"next_carry assertion failed on i = {i}"
          print(f"i = {i} | carry wire: {next_carry}")

          last_carry_a, last_carry_b, last_carry = carry_a, carry_b, next_carry
            
      # DERIVED FROM MANUAL INSPECTION, AND MANUALLY FIXING THE WIRES ONE PAIR AT A TIME
      return ','.join(sorted(['z06', 'ksv', 'nbd', 'kbs', 'z20', 'tqq', 'z39', 'ckb']))

# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = solve_logic_gates
skipped_tests = set([ 2, 3, 4, 5 ])
skipped_tests = set([ 3, 4, 5 ])
skipped_tests = set([ 4, 5 ])
skipped_tests = set([ 5 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02"""

sample_input2 = """x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj"""

sample_input3 = """x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  'intended_operation': None,
  'num_pairs_swapped': 0,
}
test_expected = 4
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
  'intended_operation': None,
  'num_pairs_swapped': 0,
}
test_expected = 2024
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'intended_operation': None,
  'num_pairs_swapped': 0,
}
test_expected = 49574189473968
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
  'intended_operation': lambda a, b: a & b,
  'num_pairs_swapped': 2,
}
test_expected = 'z00,z01,z02,z05'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'intended_operation': lambda a, b: a + b,
  'num_pairs_swapped': 4,
}
test_expected = 'ckb,kbs,ksv,nbd,tqq,z06,z20,z39'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)