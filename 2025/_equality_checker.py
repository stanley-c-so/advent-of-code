def equals(actual, expected):
  return actual == expected

# only print these tests if this file is run directly from the command line
if __name__ == '__main__':
  
  # none
  print('None:')
  print('True?', equals(None, None))
  print('False?', equals(1, None))
  print('False?', equals(None, 1))
  print('False?', equals(None, ''))
  print('False?', equals(None, []))
  print('False?', equals(None, {}))
  print('')

  # booleans
  print('BOOLEANS:')
  print('True?', equals(True, True))
  print('True?', equals(False, False))
  print('False?', equals(True, False))
  print('False?', equals(False, True))
  print('')
  
  # numbers
  print('NUMBERS:')
  print('True?', equals(1, 1))
  print('False?', equals(0, 1))
  print('')
  
  # strings
  print('STRINGS:')
  print('True?', equals('abc', 'abc'))
  print('False?', equals('abc', 'abcd'))
  print('')
  
  # lists
  print('LISTS:')
  print('True?', equals([], []))
  print('False?', equals([], [1]))
  print('True?', equals([1, 2, 3], [1, 2, 3]))
  print('False?', equals([1, 2, 3], [3, 2, 1]))
  print('')
  
  # dictionaries
  print('DICTIONARIES:')
  print('True?', equals({}, {}))
  print('False?', equals({}, {'a': 1}))
  print('True?', equals({'a': 1, 'b': 2, 'c': 3}, {'a': 1, 'b': 2, 'c': 3}))
  print('False?', equals({'a': 1, 'b': 2, 'c': 3}, {'a': 4, 'b': 5, 'c': 6}))
  print('False?', equals({'a': 1, 'b': 2, 'c': 3}, {'d': 1, 'e': 2, 'f': 3}))
  print('True?', equals({'a': 1, 'b': 2, 'c': 3}, {'c': 3, 'b': 2, 'a': 1}))
  print('False?', equals({'a': 1, 'b': 2, 'c': 3}, {'a': 1, 'b': 2, 'c': 3, 'd': 4}))
  print('')
  
  # sets
  print('SETS:')
  print('True?', equals(set(), set()))
  print('False?', equals(set([1]), set()))
  print('True?', equals(set([1, 2, 3]), set([3, 2, 1])))
  print('False?', equals(set([1, 2, 3]), set([1, 2, 3, 4])))
  print('True?', equals(set([1, 2, 3]), set([1, 2, 3, 1, 2, 3])))
  print('True?', equals(set(set([1, 2, 3])), set(set([1, 2, 3]))))
  print('True?', equals(set(set([1, 2, 3])), set(set([1, 2, 3, 1, 2, 3]))))
  print('')
  
  # nested objects
  print('NESTED OBJECTS:')
  print('True?', equals([{'a': 1, 'b': 2, 'c': 3}, [], {'d': 4, 'e': {'f': 6, 'g': 7}}], [{'c': 3, 'b': 2, 'a': 1}, [], {'e': {'g': 7, 'f': 6}, 'd': 4}]))
  print('')