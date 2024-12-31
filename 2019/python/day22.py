"""

--- Day 22: Slam Shuffle ---

There isn't much to do while you wait for the droids to repair your ship. At least you're drifting in the right direction. You decide to practice a new card shuffle you've been working on.

Digging through the ship's storage, you find a deck of space cards! Just like any deck of space cards, there are 10007 cards in the deck numbered 0 through 10006. The deck must be new - they're still in factory order, with 0 on the top, then 1, then 2, and so on, all the way through to 10006 on the bottom.

You've been practicing three different techniques that you use while shuffling. Suppose you have a deck of only 10 cards (numbered 0 through 9):

To deal into new stack, create a new stack of cards by dealing the top card of the deck onto the top of the new stack repeatedly until you run out of cards:

Top          Bottom
0 1 2 3 4 5 6 7 8 9   Your deck
                      New stack

  1 2 3 4 5 6 7 8 9   Your deck
                  0   New stack

    2 3 4 5 6 7 8 9   Your deck
                1 0   New stack

      3 4 5 6 7 8 9   Your deck
              2 1 0   New stack

Several steps later...

                  9   Your deck
  8 7 6 5 4 3 2 1 0   New stack

                      Your deck
9 8 7 6 5 4 3 2 1 0   New stack
Finally, pick up the new stack you've just created and use it as the deck for the next technique.

To cut N cards, take the top N cards off the top of the deck and move them as a single unit to the bottom of the deck, retaining their order. For example, to cut 3:

Top          Bottom
0 1 2 3 4 5 6 7 8 9   Your deck

      3 4 5 6 7 8 9   Your deck
0 1 2                 Cut cards

3 4 5 6 7 8 9         Your deck
              0 1 2   Cut cards

3 4 5 6 7 8 9 0 1 2   Your deck
You've also been getting pretty good at a version of this technique where N is negative! In that case, cut (the absolute value of) N cards from the bottom of the deck onto the top. For example, to cut -4:

Top          Bottom
0 1 2 3 4 5 6 7 8 9   Your deck

0 1 2 3 4 5           Your deck
            6 7 8 9   Cut cards

        0 1 2 3 4 5   Your deck
6 7 8 9               Cut cards

6 7 8 9 0 1 2 3 4 5   Your deck
To deal with increment N, start by clearing enough space on your table to lay out all of the cards individually in a long line. Deal the top card into the leftmost position. Then, move N positions to the right and deal the next card there. If you would move into a position past the end of the space on your table, wrap around and keep counting from the leftmost card again. Continue this process until you run out of cards.

For example, to deal with increment 3:


0 1 2 3 4 5 6 7 8 9   Your deck
. . . . . . . . . .   Space on table
^                     Current position

Deal the top card to the current position:

  1 2 3 4 5 6 7 8 9   Your deck
0 . . . . . . . . .   Space on table
^                     Current position

Move the current position right 3:

  1 2 3 4 5 6 7 8 9   Your deck
0 . . . . . . . . .   Space on table
      ^               Current position

Deal the top card:

    2 3 4 5 6 7 8 9   Your deck
0 . . 1 . . . . . .   Space on table
      ^               Current position

Move right 3 and deal:

      3 4 5 6 7 8 9   Your deck
0 . . 1 . . 2 . . .   Space on table
            ^         Current position

Move right 3 and deal:

        4 5 6 7 8 9   Your deck
0 . . 1 . . 2 . . 3   Space on table
                  ^   Current position

Move right 3, wrapping around, and deal:

          5 6 7 8 9   Your deck
0 . 4 1 . . 2 . . 3   Space on table
    ^                 Current position

And so on:

0 7 4 1 8 5 2 9 6 3   Space on table
Positions on the table which already contain cards are still counted; they're not skipped. Of course, this technique is carefully designed so it will never put two cards in the same position or leave a position empty.

Finally, collect the cards on the table so that the leftmost card ends up at the top of your deck, the card to its right ends up just below the top card, and so on, until the rightmost card ends up at the bottom of the deck.

The complete shuffle process (your puzzle input) consists of applying many of these techniques. Here are some examples that combine techniques; they all start with a factory order deck of 10 cards:

deal with increment 7
deal into new stack
deal into new stack
Result: 0 3 6 9 2 5 8 1 4 7
cut 6
deal with increment 7
deal into new stack
Result: 3 0 7 4 1 8 5 2 9 6
deal with increment 7
deal with increment 9
cut -2
Result: 6 3 0 7 4 1 8 5 2 9
deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1
Result: 9 2 5 8 1 4 7 0 3 6
Positions within the deck count from 0 at the top, then 1 for the card immediately below the top card, and so on to the bottom. (That is, cards start in the position matching their number.)

After shuffling your factory order deck of 10007 cards, what is the position of card 2019?


--- Part Two ---

After a while, you realize your shuffling skill won't improve much more with merely a single deck of cards. You ask every 3D printer on the ship to make you some more cards while you check on the ship repairs. While reviewing the work the droids have finished so far, you think you see Halley's Comet fly past!

When you get back, you discover that the 3D printers have combined their power to create for you a single, giant, brand new, factory order deck of 119315717514047 space cards.

Finally, a deck of cards worthy of shuffling!

You decide to apply your complete shuffle process (your puzzle input) to the deck 101741582076661 times in a row.

You'll need to be careful, though - one wrong move with this many cards and you might overflow your entire ship!

After shuffling your new, giant, factory order deck that many times, what number is on the card that ends up in position 2020?

"""

# LIBRARIES
import time
import pathlib
import os
# from math import *                                                      # so as not to override pow
import math
from functools import *
from sys import *
from collections import *
from queue import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def shuffle_with_mod_math(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  INSTRUCTIONS = input_str.split('\n')

  (pos, D, num_shuffles) = args


  # def is_prime(n):
  #   if n < 2: return False
  #   if n in (2, 3): return True
  #   if n % 2 == 0: return False
  #   for d in range(3, floor(sqrt(n) + 2), 2):
  #     if n % d == 0: return False
  #   return True
  # for n in range(31):
  #   print(f"is {n} prime? {is_prime(n)}")
  # print(f"is {119315717514047} prime? {is_prime(119315717514047)}") # True
  # print(f"is {101741582076661} prime? {is_prime(101741582076661)}") # True
  # 119315717514047 cards
  # 101741582076661 times

  # UTILITY

  ### PART 1 FORWARD FUNCTIONS ###

  def new_stack(x, D):
    return ((x * -1) - 1) % D
  
  def cut_N(x, N, D):
    return (x - N) % D

  def increment_N(x, N, D):
    return (x * N) % D
  
  ### PART 2 INVERSE FUNCTIONS ###

  """
  https://codeforces.com/blog/entry/72593

  Each transformation can be rewritten in the form of:
  
      f(x) = ax + b (mod m).    (Different values for a and b, depending on the operation.)
  
  This is called a linear congruential function, and forms the basis for linear congruential generators, a simple type of pseudorandom number generator.
    
    "deal into new stack": f(x) = -x - 1 (mod m), so a=-1, b=-1
    "cut n": f(x) = x-n (mod m), so a=1, b=-n
    "deal with increment n": f(x) = nx (mod m), so a=n, b=0

  For part 2, we need the inverse function. If f(x) -> X, then:

    x = f-1(X)
      = (X - b) / a (mod m)
      = (X - b) * (1/a) (mod m)
      = (X - b) * (multiplicative inverse of a) (mod m)

  """

  def reverse_new_stack(x, D):
    return new_stack(x, D)
  
  def reverse_cut_N(x, N, D):
    return cut_N(x, -N, D)
  
  def reverse_increment_N(x, N, D):

    """
    For the form f(x) = ax + b (mod m),
    this operation has a=n, b=0.

    So, for x = (X - b) * (multiplicative inverse of a) (mod m),
    for this operation, we want x = (X - 0) * (multiplicative inverse of N) (mod m),
    where the modulo is the size of the deck, which is D.
    """
    multiplicative_inverse_of_N = mod_inverse(N, D)
    assert multiplicative_inverse_of_N != None, f"MULTIPLICATIVE INVERSE OF {N} DOES NOT EXIST"
    return ((x - 0) * multiplicative_inverse_of_N) % D

  ### UTILITY FUNCTIONS FOR CALCULATING THE MULTIPLICATIVE INVERSE OF a, USING EXTENDED EUCLIDEAN ALGORITHM ***
    # See https://www.youtube.com/watch?v=shaQZg8bqUM to have some idea of how extended GCD works
    # Code generated by Google AI

  """Extended Euclidean Algorithm to find GCD and coefficients x, y such that ax + by = gcd(a, b)"""
  def extended_gcd(a, b):
    if b == 0: return a, 1, 0
    x1, y1, x2, y2 = 0, 1, 1, 0
    while b:
      q, r = divmod(a, b)
      x1, x2 = x2 - q * x1, x1
      y1, y2 = y2 - q * y1, y1
      a, b = b, r
    return a, x2, y2

  """Find the modular multiplicative inverse of 'a' under modulo 'm'"""
  def mod_inverse(a, m):
    gcd, x, _ = extended_gcd(a, m)
    if gcd != 1:
      return None  # Inverse doesn't exist
    else:
      return x % m


  def simulate_part_1(pos, D):

    ORIGINAL_POS = pos
    a = 1
    b = 0

    for line in INSTRUCTIONS:
      split = line.split(' ')
      multiplier = None
      offset = None

      if line == 'deal into new stack':                                   # "deal into new stack"
        pos = new_stack(pos, D)
        multiplier = -1
        offset = -1

      elif split[0] == 'cut':                                             # e.g. "cut -2846"
        assert len(split) == 2, f"CUT LINE WRONG LENGTH: {line}"
        N = int(split[-1])
        pos = cut_N(pos, N, D)
        multiplier = 1
        offset = -N
        
      elif split[0] == 'deal':                                            # e.g. "deal with increment 3"
        assert len(split) == 4, f"INCREMENT LINE WRONG LENGTH: {line}"
        N = int(split[-1])
        pos = increment_N(pos, N, D)
        multiplier = N
        offset = 0

      else:
        assert False, f"UNRECOGNIZED LINE: {line}"

      a = (a * multiplier) % D
      b = (b * multiplier + offset) % D

    FINAL_A, FINAL_B = a, b
    predicted_answer = (ORIGINAL_POS * a + b) % D

    assert pos == predicted_answer, f"SIMULATED ANSWER {pos} DID NOT MATCH PREDICTED ANSWER {predicted_answer}"
    return pos, FINAL_A, FINAL_B


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:

    pos, FINAL_A, FINAL_B = simulate_part_1(pos, D)
    return pos

  else:

    print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    if DEBUG:

      INSTRUCTIONS.reverse()                                                # RUN INSTRUCTIONS IN REVERSE!
      
      for _ in range(num_shuffles):

        for line in INSTRUCTIONS:

          split = line.split(' ')

          if line == 'deal into new stack':                                 # "deal into new stack"
            pos = reverse_new_stack(pos, D)

          elif split[0] == 'cut':                                           # e.g. "cut -2846"
            assert len(split) == 2, f"CUT LINE WRONG LENGTH: {line}"
            N = int(split[-1])
            pos = reverse_cut_N(pos, N, D)

          elif split[0] == 'deal':                                          # e.g. "deal with increment 3"
            assert len(split) == 4, f"INCREMENT LINE WRONG LENGTH: {line}"
            N = int(split[-1])
            pos = reverse_increment_N(pos, N, D)

          else:
            assert False, f"UNRECOGNIZED LINE: {line}"

      print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
      return pos
    
    else:

      """
      x1 = A(x0) + B  (mod D)

      x2 = A(x1) + B  (mod D)
        = A(A(x0) + B) + B  (mod D)
        = A^2(x0) + AB + B  (mod D)
        = A^2(x0) + B(A + 1)  (mod D)

      x3 = A(x2) + B  (mod D)
        = A(A^2(x0) + AB + B) + B  (mod D)
        = A^3(x0) + A^2B + AB + B  (mod D)
        = A^3(x0) + B(A^2 + A + 1)  (mod D)

      x4 = A(x3) + B  (mod D)
        = A(A^3(x0) + A^2B + AB + B) + B  (mod D)
        = A^4(x0) + A^3B + A^2B + AB + B  (mod D)
        = A^4(x0) + B(A^3 + A^2 + A + 1)  (mod D)

      xn = A^n(x0) + B(A^(n-1) + A^(n-2) + ... + 1)  (mod D)
         = A^n(x0) + B*(sum of geometric series with base term 1, ratio A, n terms altogether)  (mod D)
         = A^n(x0) + B*( base term * (1 - ratio^n) / (1 - ratio) )  (mod D)
         = A^n(x0) + B*( 1 * (1 - A^n) / (1 - A) )  (mod D)
         = A^n(x0) + B*((1 - A^n) / (1 - A))  (mod D)

      x0 = (xn - B*((1 - A^n) / (1 - A))) / A^n  (mod D)

      A = 7540
      B = 4932
      xn = 2020
      2020 = 7540^n(x0) + 4932*((1 - 7540^n) / (1 - 7540))  (mod D)
      2020 - 4932*((1 - 7540^n) / (1 - 7540)) = 7540^n(x0)  (mod D)
      x0 = ( 2020 - 4932*((1 - 7540^n) / (1 - 7540)) ) / 7540^n  (mod D)

      """

      FINAL_POS = pos
      _, FINAL_A, FINAL_B = simulate_part_1(pos, D)

      print(f"FINAL_A: {FINAL_A}")
      print(f"FINAL_B: {FINAL_B}")

      # print('checkpoint 1')
      FINAL_A_TO_POWER_OF_NUM_SHUFFLES = pow(FINAL_A, num_shuffles, D)    # IMPORTANT: do not `from math import *` or else its 2-arg pow overrides python's built-in 3-arg pow
      # print('checkpoint 2')
      print(f"FINAL_A_TO_POWER_OF_NUM_SHUFFLES: {FINAL_A_TO_POWER_OF_NUM_SHUFFLES}")

      # GEOMETRIC_SERIES = (1 - FINAL_A_TO_POWER_OF_NUM_SHUFFLES) / (1 - FINAL_A)
      # GEOMETRIC_SERIES = (FINAL_A_TO_POWER_OF_NUM_SHUFFLES - 1) / (FINAL_A - 1)
      GEOMETRIC_SERIES = ((1 - FINAL_A_TO_POWER_OF_NUM_SHUFFLES) * mod_inverse(1 - FINAL_A, D)) % D
      print(GEOMETRIC_SERIES)
      # assert math.floor(GEOMETRIC_SERIES) == GEOMETRIC_SERIES, f"DOES NOT DIVIDE EVENLY"

      x0 = (
        # (FINAL_POS - FINAL_B*( GEOMETRIC_SERIES )) // FINAL_A_TO_POWER_OF_NUM_SHUFFLES
        (FINAL_POS - FINAL_B*( GEOMETRIC_SERIES )) * mod_inverse(FINAL_A_TO_POWER_OF_NUM_SHUFFLES, D)
      ) % D
      return x0
      # 81124945601692 too high
      # 119315717514045 too high
      # 73942046789987 too high
      # 12706692375144


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = shuffle_with_mod_math
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
skipped_tests = set([ 5, 6, 7, 8, 9, 10, 11 ])
skipped_tests = set([ 6, 7, 8, 9, 10, 11 ])
skipped_tests = set([ 7, 8, 9, 10, 11 ])
skipped_tests = set([ 11 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """deal with increment 7
deal into new stack
deal into new stack"""

sample_input2 = """cut 6
deal with increment 7
deal into new stack"""

sample_input3 = """deal with increment 7
deal with increment 9
cut -2"""

sample_input4 = """deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  'pos': 0,
  'D': 10,
  'num_shuffles': 1,
}
test_expected = [ int(n) for n in '0 3 6 9 2 5 8 1 4 7'.split(' ') ].index(0)
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
  'pos': 0,
  'D': 10,
  'num_shuffles': 1,
}
test_expected = [ int(n) for n in '3 0 7 4 1 8 5 2 9 6'.split(' ') ].index(0)
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
  'pos': 0,
  'D': 10,
  'num_shuffles': 1,
}
test_expected = [ int(n) for n in '6 3 0 7 4 1 8 5 2 9'.split(' ') ].index(0)
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': sample_input4,
  'DEBUG': True,
  'pos': 0,
  'D': 10,
  'num_shuffles': 1,
}
test_expected = [ int(n) for n in '9 2 5 8 1 4 7 0 3 6'.split(' ') ].index(0)
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'pos': 2019,
  'D': 10007,
  'num_shuffles': 1,
}
test_expected = 7545
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'pos': [ int(n) for n in '0 3 6 9 2 5 8 1 4 7'.split(' ') ].index(0),
  'D': 10,
  'num_shuffles': 1,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
  'pos': [ int(n) for n in '3 0 7 4 1 8 5 2 9 6'.split(' ') ].index(0),
  'D': 10,
  'num_shuffles': 1,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
  'pos': [ int(n) for n in '6 3 0 7 4 1 8 5 2 9'.split(' ') ].index(0),
  'D': 10,
  'num_shuffles': 1,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input4,
  'DEBUG': True,
  'pos': [ int(n) for n in '9 2 5 8 1 4 7 0 3 6'.split(' ') ].index(0),
  'D': 10,
  'num_shuffles': 1,
}
test_expected = 0
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': True,                # because deck size is sufficiently small
  'pos': 7545,
  'D': 10007,
  'num_shuffles': 1,
}
test_expected = 2019
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 11
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'pos': 2020,
  'D': 119315717514047,
  'num_shuffles': 101741582076661,
}
test_expected = 12706692375144
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)