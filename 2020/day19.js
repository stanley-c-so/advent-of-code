// --- Day 19: Monster Messages ---

// You land in an airport surrounded by dense forest. As you walk to your high-speed train, the Elves at the Mythical Information Bureau contact you again. They think their satellite has collected an image of a sea monster! Unfortunately, the connection to the satellite is having problems, and many of the messages sent back from the satellite have been corrupted.

// They sent you a list of the rules valid messages should obey and a list of received messages they've collected so far (your puzzle input).

// The rules for valid messages (the top part of your puzzle input) are numbered and build upon each other. For example:

// 0: 1 2
// 1: "a"
// 2: 1 3 | 3 1
// 3: "b"

// Some rules, like 3: "b", simply match a single character (in this case, b).

// The remaining rules list the sub-rules that must be followed; for example, the rule 0: 1 2 means that to match rule 0, the text being checked must match rule 1, and the text after the part that matched rule 1 must then match rule 2.

// Some of the rules have multiple lists of sub-rules separated by a pipe (|). This means that at least one list of sub-rules must match. (The ones that match might be different each time the rule is encountered.) For example, the rule 2: 1 3 | 3 1 means that to match rule 2, the text being checked must match rule 1 followed by rule 3 or it must match rule 3 followed by rule 1.

// Fortunately, there are no loops in the rules, so the list of possible matches will be finite. Since rule 1 matches a and rule 3 matches b, rule 2 matches either ab or ba. Therefore, rule 0 matches aab or aba.

// Here's a more interesting example:

// 0: 4 1 5
// 1: 2 3 | 3 2
// 2: 4 4 | 5 5
// 3: 4 5 | 5 4
// 4: "a"
// 5: "b"

// Here, because rule 4 matches a and rule 5 matches b, rule 2 matches two letters that are the same (aa or bb), and rule 3 matches two letters that are different (ab or ba).

// Since rule 1 matches rules 2 and 3 once each in either order, it must match two pairs of letters, one pair with matching letters and one pair with different letters. This leaves eight possibilities: aaab, aaba, bbab, bbba, abaa, abbb, baaa, or babb.

// Rule 0, therefore, matches a (rule 4), then any of the eight options from rule 1, then b (rule 5): aaaabb, aaabab, abbabb, abbbab, aabaab, aabbbb, abaaab, or ababbb.

// The received messages (the bottom part of your puzzle input) need to be checked against the rules so you can determine which are valid and which are corrupted. Including the rules and the messages together, this might look like:

// 0: 4 1 5
// 1: 2 3 | 3 2
// 2: 4 4 | 5 5
// 3: 4 5 | 5 4
// 4: "a"
// 5: "b"

// ababbb
// bababa
// abbbab
// aaabbb
// aaaabbb

// Your goal is to determine the number of messages that completely match rule 0. In the above example, ababbb and abbbab match, but bababa, aaabbb, and aaaabbb do not, producing the answer 2. The whole message must match all of rule 0; there can't be extra unmatched characters in the message. (For example, aaaabbb might appear to match rule 0 above, but it has an extra unmatched b on the end.)

// How many messages completely match rule 0?

// --- Part Two ---

// As you look over the list of messages, you realize your matching rules aren't quite right. To fix them, completely replace rules 8: 42 and 11: 42 31 with the following:

// 8: 42 | 42 8
// 11: 42 31 | 42 11 31
// This small change has a big impact: now, the rules do contain loops, and the list of messages they could hypothetically match is infinite. You'll need to determine how these changes affect which messages are valid.

// Fortunately, many of the rules are unaffected by this change; it might help to start by looking at which rules always match the same set of values and how those rules (especially rules 42 and 31) are used by the new versions of rules 8 and 11.

// (Remember, you only need to handle the rules you have; building a solution that could handle any hypothetical combination of rules would be significantly more difficult.)

// For example:

// 42: 9 14 | 10 1
// 9: 14 27 | 1 26
// 10: 23 14 | 28 1
// 1: "a"
// 11: 42 31
// 5: 1 14 | 15 1
// 19: 14 1 | 14 14
// 12: 24 14 | 19 1
// 16: 15 1 | 14 14
// 31: 14 17 | 1 13
// 6: 14 14 | 1 14
// 2: 1 24 | 14 4
// 0: 8 11
// 13: 14 3 | 1 12
// 15: 1 | 14
// 17: 14 2 | 1 7
// 23: 25 1 | 22 14
// 28: 16 1
// 4: 1 1
// 20: 14 14 | 1 15
// 3: 5 14 | 16 1
// 27: 1 6 | 14 18
// 14: "b"
// 21: 14 1 | 1 14
// 25: 1 1 | 1 14
// 22: 14 14
// 8: 42
// 26: 14 22 | 1 20
// 18: 15 15
// 7: 14 5 | 1 21
// 24: 14 1

// abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
// bbabbbbaabaabba
// babbbbaabbbbbabbbbbbaabaaabaaa
// aaabbbbbbaaaabaababaabababbabaaabbababababaaa
// bbbbbbbaaaabbbbaaabbabaaa
// bbbababbbbaaaaaaaabbababaaababaabab
// ababaaaaaabaaab
// ababaaaaabbbaba
// baabbaaaabbaaaababbaababb
// abbbbabbbbaaaababbbbbbaaaababb
// aaaaabbaabaaaaababaa
// aaaabbaaaabbaaa
// aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
// babaaabbbaaabaababbaabababaaab
// aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba

// Without updating rules 8 and 11, these rules only match three messages: bbabbbbaabaabba, ababaaaaaabaaab, and ababaaaaabbbaba.

// However, after updating rules 8 and 11, a total of 12 messages match:

// bbabbbbaabaabba
// babbbbaabbbbbabbbbbbaabaaabaaa
// aaabbbbbbaaaabaababaabababbabaaabbababababaaa
// bbbbbbbaaaabbbbaaabbabaaa
// bbbababbbbaaaaaaaabbababaaababaabab
// ababaaaaaabaaab
// ababaaaaabbbaba
// baabbaaaabbaaaababbaababb
// abbbbabbbbaaaababbbbbbaaaababb
// aaaaabbaabaaaaababaa
// aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
// aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba

// After updating rules 8 and 11, how many messages completely match rule 0?


// NOTE: PART 2 OF THIS PROBLEM EXPLICITLY ENCOURAGES AN INVESTIGATION OF THE SPECIFIC INPUT FOR THIS PROBLEM, RATHER THAN TRYING TO WRITE A GENERAL SOLUTION.
// Based on the investigation I conducted (via commented out code), here are my observations:
// (1) By changing Rules 8 and 11 in the manner specified in Part 2, only Rule 0 would be affected (apart from Rules 8 and 11 themselves)
// (2) Valid Rule 42 and Rule 31 sequences are always the same length. If that length is N, then valid Part 1 Rule 8 sequences are also length N; Rule 11 are 2N; Rule 0 are 3N
// (3) All input messages have lengths that are multiples of N (see above), and are always at least 3N
// (4) There is no overlap between a valid Rule 42 sequence and a valid Rule 31 sequence
// With these observations I crafted the code in Part 2 in a specific way to solve this problem.

function countValidMessages (part, inputStr) {
  const inputArr = inputStr.split('\n\n');

  const [rules, messages] = inputArr;
  const messagesArr = messages.split("\n");
  const parsedData = [];                                        // e.g. if input is ..., 1: "a", 2: 1 3 | 3 1, ... then parsedData[1] is "a" and parsedData[2] is [ [1, 3], [3, 1] ]
  for (const rule of rules.split("\n")) {
    const [key, val] = rule.split(": ");
    if (val.includes(`"`)) parsedData[+key] = val[1];
    else parsedData[+key] = val.split(" | ").map(str => str.split(" ").map(n => +n));
  }

  // INVESTIGATORY CODE (based on actual input): EXAMINING WHICH RULES ARE AFFECTED BY CHANGING RULES 8 AND 11 (AND VERIFYING THAT IT IS ALWAYS RULES 0, 8, 11)
  if (parsedData.length > 11 && parsedData[8] && parsedData[11]) {
    const knownAffected = new Set();
    const stack = [8, 11];
    while (stack.length) {
      const rule = stack.pop();
      knownAffected.add(rule);
      for (let i = 0; i < parsedData.length; ++i) {
        if (!parsedData[i] || parsedData[i].constructor !== Array || knownAffected.has(i)) continue;
        if (parsedData[i].some(possibility => possibility.includes(rule))) stack.push(i);
      }
    }
    console.log("THE FOLLOWING RULES WOULD BE AFFECTED BY CHANGING RULES 8 AND 11:", knownAffected);
  }

  const translated = {};                                        // e.g. if valid Rule 2 strings are "ab" or "ba", then translated[2] is ["ab", "ba"]

  // THIS UTILITY FUNCTION TAKES A RULE INPUT, AND RETURNS AN ARRAY OF ALL STRINGS THAT ARE VALID FOR THAT RULE. IT MAKES USE OF THE translated CACHE DEFINED ABOVE
  function getTranslation(n) {
    if (!(n in translated)) {

      // THIS INNER UTILITY FUNCTION TAKES INFORMATION FROM parsedData ABOVE, AND IF THE INPUT DEPENDS ON OTHER RULES, IT RECURSIVELY CALLS THE OUTER getTranslation UTILITY FUNCTION
      function translate (input) {
        if (typeof input === "string") return [input];          // BASE CASE: this rule is simply one specific letter (basically either "a" or "b") - so return that letter in an array
        const output = [];                                      // this output array will ultimately store all possible strings that are valid for Rule n
        for (const possibility of input) {                      // e.g. if input is [ [2, 3], [3, 2] ], the first possibility is [2, 3] (note that there will only be 1 or 2 possibilities)
          const storage = [];                                   // this storage array will store all possible strings that are valid for the current possibility of Rule n
          for (const num of possibility) {                      // e.g. if possibility is [2, 3], the first num is 2
            const translation = getTranslation(num);            // we need to build up each permutation based on each component num. recurse outer function to get all strings for the latest num
            if (!storage.length) storage.push(...translation);  // if this is the first num (storage array is empty) then simply copy all strings for this num into the storage array
            else {
              const newStorage = [];                            // otherwise, create a new, temporary storage array
              for (const A of storage) {                        // cross-reference every string in the primary storage array...
                for (const B of translation) {                  // ...against every string in the current translation...
                  newStorage.push(A + B);                       // ...and combine them to make each permutation, which is stored in the new storage array
                }
              }
              storage.length = 0;                               // clear the primary storage array...
              for (const str of newStorage) storage.push(str);  // ...and copy over all data from the new, temporary storage array. NOTE: these get VERY large - CANNOT USE SPREAD OPERATOR! 
            }
          }
          for (const str of storage) output.push(str);          // finally, push all elements from the primary storage array into the output array
        }
        return output;
      }
      translated[n] = translate(parsedData[n]);                 // store the calculated array of valid strings into the cache
    }
    return translated[n];
  }

  const valid0 = new Set(getTranslation(0));                    // since Rule 0 is at outermost level of the dependency structure, we can kick start recursion by calling getTranslation(0).
                                                                // we then save all valid Rule 0 strings into a set for faster validation in Part 1

  // INVESTIGATORY CODE (based on actual input): UNDERSTANDING THE PART 1 LENGTHS OF VALID SEQUENCES FOR RULES 42 AND 31 (FROM WHICH WE CAN DERIVE THOSE OF VALID SEQUENCES FROM RULES 0, 8, 11)
  if (42 in translated && 31 in translated) {
    console.log("LENTH OF A POSSIBLITY FROM 42:", translated[42][0].length);  // 8
    console.log("LENTH OF A POSSIBLITY FROM 31:", translated[31][0].length);  // 8
  }

  // INVESTIGATORY CODE (based on actual input): EXAMINING THE LENGTHS OF MESSAGES FROM THE INPUT DATA (AND SEEING THAT THEY TEND TO BE MULTIPLES OF RULE 42 OR 31 SEQUENCES)
  const messageLengths = {};
  for (const message of messagesArr) messageLengths[message.length] = messageLengths[message.length] + 1 || 1;
  console.log("MESSAGE LENGTHS:", messageLengths);

  // INVESTIGATORY CODE (based on actual input): VERIFYING THAT A VALID RULE 42 SEQUENCE CAN NEVER BE A VALID RULE 31 SEQUENCE
  if (42 in translated && 31 in translated) {
    const valid42 = new Set(translated[42]);
    for (const possible31 of translated[31]) if (valid42.has(possible31)) throw "INVALID: NO SOLUTION";   // sanity check: there should be no overlap between Rule 42 and Rule 31 sequences
  }

  if (part === 1) {

    return messagesArr.reduce((total, message) => total + +valid0.has(message), 0);                       // add up the number of messages that are inside the Rule 0 set

  } else {

    const valid42 = new Set(translated[42]);
    const valid31 = new Set(translated[31]);

    if (translated[42][0].length !== translated[31][0].length) throw "INVALID: NO SOLUTION";              // sanity check: Rule 42 sequences and Rule 31 sequences must be the same length
    const lengthOfAValid42Or31 = translated[42][0].length;

    let total = 0;
    for (const message of messagesArr) {          // Rule 0 is "8 11". Rule 8 is 1+ Rule 42 sequences. Rule 11 is 1+ valid Rule 42 sequences followed by the same number of Rule 31 sequences.
      let numOfValid42Sequences = 0;
      let numOfValid31Sequences = 0;
      let invalid = false;                                                  // this flag helps skip to the next message as soon as the current one is found to be invalid
      let switchFrom42To31 = false;                                         // this flag marks whether the first valid Rule 31 sequence has been found
      for (let i = 0; i < message.length; i += lengthOfAValid42Or31) {      // iterate through each message, incrementing by the length of a valid Rule 42 (or 31) sequence
        const segment = message.slice(i, i + lengthOfAValid42Or31);
        if (!valid42.has(segment) && !valid31.has(segment)) {               // if the current segment is neither a valid Rule 42 or Rule 31 sequence, the message is invalid
          invalid = true;
          break;
        }
        if (!switchFrom42To31) {                                            // while we have not yet encountered a valid Rule 31 sequence, count up the number of valid Rule 42 sequences
          if (valid31.has(segment)) {                                       // as soon as a valid Rule 31 sequence is found, trigger the switch
            switchFrom42To31 = true;
            ++numOfValid31Sequences;
            continue;
          }
          ++numOfValid42Sequences;
        } else {                                                            // count up the number of valid Rule 31 sequences
          if (valid42.has(segment)) {                                       // no more Rule 42 sequences are permitted - if one is found, this message is invalid
            invalid = true;
            break;
          }
          ++numOfValid31Sequences;
        }
      }
      if (                                                                  // count this message toward the total, if and only if...
        !invalid &&                                                         // ...the message was not found to be invalid by the logic above...
        numOfValid42Sequences > numOfValid31Sequences &&                    // ...the number of valid Rule 42 sequences outnumbers that of Rule 31 (implied by Rule 8 followed by Rule 11)
        numOfValid31Sequences > 0                                           // ...there is at least 1 valid Rule 31 sequence (implied by Rule 11)
      ) ++total;
    }
    return total;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = countValidMessages;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInputA = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

const sampleInputB = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;

const actualInput = `120: "b"
117: 120 51 | 2 10
37: 120 96 | 2 94
19: 110 2 | 52 120
26: 120 102 | 2 79
2: "a"
32: 120 57 | 2 55
22: 64 2 | 12 120
3: 120 18 | 2 82
5: 2 81 | 120 34
1: 2 120 | 120 131
63: 2 120
71: 120 78 | 2 45
128: 120 46 | 2 62
9: 118 2 | 91 120
36: 82 2 | 63 120
64: 50 2 | 38 120
16: 69 120 | 80 2
92: 96 2 | 50 120
113: 131 18
38: 120 120 | 120 2
6: 2 112 | 120 15
24: 2 1 | 120 18
111: 120 70 | 2 115
34: 2 119 | 120 96
104: 50 120 | 91 2
85: 117 2 | 74 120
12: 2 82 | 120 118
79: 100 2 | 56 120
78: 120 118 | 2 119
116: 2 75 | 120 22
55: 89 2 | 107 120
82: 2 2
119: 2 120 | 2 2
100: 2 23 | 120 68
0: 8 11
50: 131 131
102: 39 2 | 6 120
95: 120 38 | 2 94
21: 119 2 | 63 120
69: 124 120 | 32 2
10: 84 120 | 104 2
49: 96 120 | 94 2
88: 2 82 | 120 63
72: 120 2 | 2 2
76: 77 120 | 106 2
51: 120 9 | 2 35
122: 91 120 | 96 2
109: 2 119 | 120 28
101: 88 2 | 70 120
57: 81 2 | 99 120
83: 98 120 | 30 2
61: 119 2
68: 120 3 | 2 92
86: 2 54 | 120 77
18: 120 120 | 131 2
80: 120 123 | 2 90
74: 2 86 | 120 101
118: 2 131 | 120 120
91: 2 120 | 120 2
131: 2 | 120
121: 63 2 | 82 120
43: 120 50 | 2 60
99: 60 120 | 91 2
20: 66 2 | 99 120
73: 29 120 | 37 2
129: 49 2 | 21 120
13: 120 120
29: 131 94
87: 2 13
107: 2 28 | 120 13
66: 50 131
115: 120 60
65: 2 38 | 120 119
70: 2 63 | 120 18
47: 2 108 | 120 19
108: 17 120 | 116 2
62: 120 63 | 2 18
125: 120 93 | 2 12
105: 113 120 | 114 2
46: 60 2 | 119 120
54: 120 91 | 2 118
94: 120 120 | 2 2
4: 120 53 | 2 95
23: 103 120 | 43 2
75: 70 120 | 127 2
39: 27 120 | 5 2
90: 128 120 | 59 2
59: 65 120 | 36 2
48: 2 118 | 120 63
81: 2 82 | 120 96
130: 2 61 | 120 48
45: 120 72 | 2 96
93: 131 28
35: 120 28 | 2 63
40: 2 118 | 120 119
7: 87 120 | 9 2
106: 2 60 | 120 63
41: 120 9 | 2 65
77: 119 2 | 38 120
58: 54 2 | 61 120
33: 2 29 | 120 109
17: 2 111 | 120 58
8: 42
123: 25 2 | 105 120
11: 42 31
84: 82 120 | 91 2
96: 120 2
56: 33 120 | 73 2
15: 62 120 | 24 2
114: 63 120 | 91 2
112: 122 120 | 44 2
127: 119 120 | 91 2
53: 18 131
124: 4 2 | 20 120
30: 14 120 | 130 2
25: 121 2 | 40 120
97: 120 28
52: 2 71 | 120 7
110: 2 129 | 120 125
60: 120 120 | 2 120
42: 120 16 | 2 126
27: 37 2 | 104 120
28: 2 131 | 120 2
126: 2 83 | 120 85
44: 60 2 | 94 120
31: 2 26 | 120 47
98: 41 2 | 76 120
89: 2 28 | 120 91
67: 120 13 | 2 119
14: 120 97 | 2 67
103: 120 28 | 2 38

abbaabbbababaaaabbababbbbbbaabbaaabaabbb
ababaaabbbaababbbabaabaabaaabaaaaabaaabb
babaabbaaababbabaaaababa
aabbbbbbbaabbbaababbbaab
babaabbbbbabaaaaabababaabbbbaaba
baaaabbbbbababbaabbbbbbbbaababbbbbbaababbbbbbabaaaaabbbbabaabbbabaaaabba
bbbbabbaaababbbbababaaaabbabbbaa
aaaabaaabababbaaabbbbbbbababbbbbbbbbaabbabbbbaaaaaabbaba
aabbbbbbbabaabaabaaaabba
aabbbaabbbabababbabbaaaa
aababbbbabaabbababbbaaba
baabbabbabaaabbabbbaabbbaaabaaababbbbbab
bbababbbbaaababaabaaabbbabbabbbb
babbbbabbbabaabaaaaabbaa
bbbaababaabaaaabaaabbbbb
babbaaababaabbababbbaaba
bbbaabbbabbbaaaaababaabb
babbbabaaaabababbbaaabaaabbbbbbbbbaababbababbbbaabbbbaaaabbbbaaaaaaaabaa
bbababbbbabbabbbbbbabbab
aabbbaabbbbaaababaabaabb
babaabaabbaaaabbbbabbaab
baaaabbbbababbaaaabbabbb
bababbaabababbaaabaaabbababaabaaabbbbaab
bbaaabaabababaaaaababaaaabaaaaabbbaaaabaababaababaababaaababbaabbabbaababbbaaaab
abaaaaabaabbabbabbbbaabbbaaabbbaaababaabbbbababa
baaabbabaababbaaabbbbbba
baaabaabaababaabaabbbabb
bbbbabbaabbaabbbbaaabaaa
abababaaabbababaaabbabababbaaaabbabbbabbbbaaabab
bbbabbbaaaabbbabbaaabbaaabababaabaaaababbbabbbaabbbbabbbaabbbbab
babbbbbbbbabaaaaabbbabaaaaabbaaa
abbbbbaaaabbbbbbbbbbbaab
aabaaaabaabbababaaabbaab
bbbbbbbaababababbbabbaab
babababaaabbaabaabaababbaabbabbaabbabaab
abaaabaaaaaababbbbbbbbbbabbaaaabbabbababbbbbbaba
bbbabbaabaaaaaabbbaabbba
bbbbbbbbaabbbbbbbbbabaab
babaabaabbaaabbababbabbbabaaaaaaaabaaaba
bbbaabbabbaababbbaabbaba
aabaabaaaababbabaaabbbbaaaabbbbbbbabbbbb
abaabababbbababbabbaaaabbababababbabbbabababaabb
baaabbbaaabbbababaabbbaabbbaabbabbbbabbbbbabbaaa
aababaababbabababbaabaaabbbabbaaabaabaaabaaabbbbbaabbbbb
abbbaabbaaaaabbaaabbbbaa
babbaabbbbabbbbaabbababaabbabaabaaaaabab
baabaaabaaaaaabaaaabbbaa
bbbaaabaaababbaaabaaaabb
aabaabaaabaabbabbbbbaabbbbbbbbaababbbbaa
abaaaabbbbbbabbbbbabbbbb
babababaabbbbabaaaabaaba
aaababbbbbaaabaaabbbababaabbaaaa
aabbbabaabababbabbbbaaaabaabbbbbaaabaabbaaaaabababbabbbaaaabaaab
bbbbabbbababaaabbbbabbba
babbbabbababaabaaaaaabbbbbbbaaabbbbabaabbabbabbabbbababa
aaaaabbbbabaabbbbbaaabbaaabaaaabbbbabbbb
abbbbabbabaaabaabababbbbbbababbbbbabaabb
aabbababbbbabbaababaaaba
aaaaabbbabbbaaaabbbbaabbbbabaaab
aaabbabbbaababbbabaaaaabababaabaaaabaabaabbaabab
aaaabaababbaaaaabababbbaabbababbaaabaababbbaaabababaaabbaabaaaab
abaababaabaaaaabbaabbaaababaabbbbbaaaaaababbaaaa
bbbbabbbabbaaaabbabbabbbbaabbabbbabbabab
bbabbbaaaabaabaaaababbababaaaabbaaaaaaab
bbbaabbbbbaabaaaaaaabbaa
baaaaabbaababbaaaaabbbbaababbbaaaababbabbbbbbbabbbaaaaaa
bbbaababaabbabababaaabab
baaaaaaababbbbbbbbababbaaabbabbabbaaaabaabbabbbb
abababaabbbbaaababbbababbaaabababbabbbbababbbabaaaabaabb
bbaabbaabbabaababbbaabaabaabaabbaaababaa
bbbababbabbbabaabaaabbbb
babaabbababbbbbbaabaabbb
aababbaababaabbbbbabbabb
bababbaaaabaaaabbbaaaaaa
abbaaaabaaaabbabaabbbbbbbbbbbaaaaabbaabb
bbbbbbabbaaabbabbaaaaababbaaaabbbababbaaaabaaabb
baaaaaaabaabbaaabaabbaaabbabbabb
bbaababbabaaaabbabbaabbbbbabaababbbbababbbbbbbaa
abbbabababbaaaabaabbabbabaaaaabababaaababbaaaaba
baabaabababaaabaaaababaabbbaaabababaabaaaababbbaaaabaaaa
baabababbbabbbaaababbbaabbaabbbbaabbabbb
bbaababbaabbbaabbbbababbaaaababbbabbaaba
aaabababbaabbbaaabbabaab
bbbbbabbbbaabbaabaabbabaaabababaababaaaabbbabbbabbaaabaabaaaaaabbaaaabaa
aaaaaaaababbaabbbaababbbaaaaaaaabbaaababbaaabaaa
bbabbbababaaabaababbbaaa
bababbbaaabbababbbaabbbbababaaabababbbab
bbbababbbbbbaabbababbbaabaababaaabbbabababbaaabb
bbaabaaaabbbbbaaabbbaaaabbabaabbbabababb
baabbbabbbaaababbaaabaaaaababaabbbaababaababbbaaaaaabbabbbaaaaaaabaaabaa
bbababbaabbbabbaabaaaabbbbababbbbaabaaba
aabbbbbababaaababbbbbbbaaaaabaaaaabababbabaaabbbaaaaaabbbbabbbbb
babaabaaabaabbaabaabaaabaaabaaba
bbbbabbbbbbaabbbbbababaaaabaaaabbabbbaababbaaaaaabbaababaaabaaab
abaababbbbbaabaaabbbbbab
aaaababbaabababbaabbabaababbbaaaaabbabbb
aaababbbbbbabbaaabaaabaaaabaaabb
bbbbaabbbbaabbbbabbababaaabbabaabbaabbaaabaabbba
baababbbaababaabbaaaaabbaaaaaabaaabaaaabbabaabbbbaabbbbb
babbaaabbaaaabbbbaaaaabbbbabbabbbabbabba
bbabbbabbbaaaaabbbaabbaabbababaa
aabbbaabbaabbabbaaabbaaa
abbaaaabbbbbabbbaabababa
bbaabbaaaabbbabaaaaabbba
baaabaabbaaabbabbbbabaab
bbabaabababaabbbbaabbbbb
aabaaaabababbbbbaaaaabab
abbbaabbabaaabbaabbbbabbbbabaabbabababba
bbbaaababaaabbbaaaababba
bbaabbaaaabbabaabbbabbab
baaaaaabbbaababbbbbbabab
babaabbabbaaabaabbababbabbbbabbbaaaaabbbbabbabab
aabaaaaaaaabbbbabbbabaaa
aaaaabbbabbaabbbabaabbba
baaaaabbbbbbbabbaababbabababbaaa
abaaabbababbbabbbbbbbbbbbbbbababaabbaabb
bbbabbaaabaabbbbababaaabbabbbbbb
bbaaabbbaababbaabbaabaab
bbabbabaabaabbababbaaababbabbabb
bbbababbabbaaabaaaaababbaaaabbaababababb
bbbbbababaabbbbababbabbaababaabbabbabbbababbbaaa
bbababbaabbaabbbbbbabaab
bbabbaaaaaabbbbbabaaaabbbabbbbaaabbabbaaababaababbbabbabbabaabbb
abaaabbaabbabbaabbbaaabababaaaba
bbaabababaabbbbbabbbbaaaaaabbaaaabbbaaba
baaaaaaaabbbbbbbbbabaabb
aababaaaabbbbbbbbabababababbaaabbababbaaababbaaaabbaaaba
bbbbabbbaaababbbaabbabbb
aababaabbbabbbbabbaaaabbaabbababbaabaabb
aaabbabbbbbbabbbbabaabab
aaaabbabbabbaabbbbbabbbb
aaaaabbaabaaaabbaabaabaaaabbbbbababbbbaabaaaabbbabbabaaaaabbbbab
abababababaaaaabbbaabbaabababbbababbabaa
baaaaaaababaabaabbaaaabbbababaabaaabbabbaabaabbb
abaaaaabbbbabbaaaaabbbbabbaabbaaabbabbaaabaaaaaabbaababa
abbbabbabababaababbbbaab
bbbbbbbbbbbbbbabbababaaa
baabaaabaaaababbbabaaaab
abbbbbaabababbbbaaababbbaaaaabaa
bbaabbaaabbbbbbbbbabaabb
baabbaaaaabbabaabaabbaaababaabaaababbabaaaaaaabb
babababaaaaababbaababaabaabaaaaabaaabbaabbbbbaba
ababbbaabaaaaabbaaaaabbbaababbababaaaaabbbbbaaaa
babbbabbbbbaaababababbbabbbbabbaabaaabab
baaababababababaabbbbaab
abaaabbaabbbaabbabaaabaa
bbaabbaaaaaaaaaaababbbab
baabbaaababaabbabaabbbbb
aabbabaabaaaaaaaabbabbab
bbababbaabbbbbbbaabbbaaa
abbbbabababbbabbbabaabab
babbbabaabbbababbbaabaaabbababbbaabaabaaaabbbaabaaaaaabb
baaaaaababaaaabbbabababb
bbbbaaabababbaabaabbbbbaabbabbababbbaaab
abbbabaaaabaaaaaabaaaabbabaaaaabbbbabaaa
bbbababbbaaabaabaabbaabb
abbaabbbbbaabbaaaabaaababaabbbabbaabbaba
aabababbbaaabbabbababaab
bbabaaaabbaaabaaaaabaaabbbbababbabaaabaabaaabbbbabbababb
bbabaaaaaaaababbbbabbbabaabbabbb
abbbaabbababaaaabaabbbab
aaabbbbaaabababbabbbabaaababbabbaaaabaabbbbbbaaa
aaaaaaaaababbbaabbbabbbb
abbbbaaabbaaaabbabbbaabaabaabbbbaaaabbbbabbabbaaaabababaaaaaabbabaaaabbbbbbbbbaabbabbbba
babaabaabbabbbbaabbbbbab
aababbaaabaaabbbababbaaa
bababbaabaabbaaaaababbaaaaabbbab
bbabaaaabbabbbaabbaababbababababbabbaaaa
baaaaabbbbaabbbbbbababababaababaababbbbaabbaabaa
bbaabaaabbabababaaababbbbbaabbab
babbbbabbaaaababaabbaaab
ababbbbbbbaaabbaabbaabaa
aabbaababbabbabababbabba
babaababbbbaaaaaaaabaabb
bbbbbbabaabbbaababbbaaaabbbaaaaaaaabbababaabbbabaaabbaab
aabbbaabababaaabaabaabab
babbbbabbbabbbabbabaabbaaabbbbaa
aababbbbababbbaabbaabaaaaabaaaabaaaaabaabbbbbaba
ababbbaaabaabaaababaabaabbabaabbaabaaabb
bbbaabbaaabaaaaabaaaababaaaaaaaaabbababb
bbaabbaaaaabaaababbbbabbaabbbababbaaabaaaaaaabababaaabab
abaabaaaaabbababbabababb
abbabababbbaaabaabaabbba
baababaaabbaabbbbaabbbab
abbbbbaabaaaaaabbbaaaaabaaabbaabbaaabaaa
bababbbbabaaabaabaaaaaaababbaaabbbbbabbaaabbbbbaabbabaab
aaaaabbabaaaaababaaaaaaabbaabaab
bbbaabbbbbbbbbbaabbbbbaaababaaabababababbaaabbbb
abbabaaaabbbbabbbababbab
bbababbbbabbaabbbbaaabab
bbabaaaabaaaabbbaabbabaabbbaabaabaaababaaaaabbbbaabaaabaabbabbba
abababaaaabaaaaaababaabb
baaaababbbbaabbbabbbabbaaaaabbaa
bbbaabaababbabbbaabbaabaabbabbbb
aaabababaaabababbbabbbbaabbbbbababbabbba
bbaaabbaababaaaabbabbabaabbbabbaaaaaabbbbbaaabab
ababaababbbaabbaabbaaaababbbababaaababbbaabaabbaabbabbbb
abaabbabaaaabaabbbbbabbbaaaabaaaababaababbbbbabbbbaaabab
bbaabbbbaabaaaabaaaabbbb
bbaabaaaabbabbaaabaaaabbbaaaababaabaaabbabbabbba
aaaabaabaabbbabababbbabbaaaababa
bbaabbbbbbbabbaababbaaaa
abbbabaaaaabbabbbbaaaaba
bbbaabbabbbaabaabbbaaaab
bababbbaabbaaaabaaaabaaa
abbbaaaaaabbbbbbbbabaaaabbaabbba
abaababbbbbababbbabaaabb
abaaabaabbabbbabbbbabaaa
aaabaaabbaabaaabaaaabbabbbbaaabbbbbaaaababaaababbabaabbbbbaababbbbababaabbaababaaabaaabb
baabbbaaabababaabbabaaab
abbaaababbbaaabaabbaaaabbbbbaaaa
abaaabbbaaabbbbaaabbbaaabbababaaaaabaababababbbbbbaaaabababaababaaaabaab
baaabababbaaaaabbbaaaaabbbbbbbabaaababaabbbabbbb
aabbbbbbaabbababababbabb
abababaaaaababababbababaababbbbbaaabbbaaaaaabbbb
bbabaaaaabaababbaaaabbba
bbbaabbbbbabbbabbaabaaaa
bbaaabbabbbbbbabbbabaaaaaabbbbba
bbabaabbabbbabbbbabaabbaabbaabbbaabaaababbababba
aabbabbaabbabaaabbaabbaabbbaabaaababaaabbbbbabab
aabaaaaaaababbaabaaaaabaaaaabaabbaaababaaabbbbab
babbaabbabbbababbaaaaabbaaaabaabbabbaaba
abaababbbaaababababbabba
aabbababababaaababababba
baaaababaaaaabbababaabab
aababbaaabbbbabaaabaaabb
ababbbbbaaabbbbaaabbaaab
baababaabbabaabaaabaaaaababbaaabbabbaaaabbabaabbabbabaab
ababbabbbbbaaabbbbabaaaaaabbaaba
aaabaaababaabababbbaaabababbbbbbabbaabaababbbaab
abbaaaabbaaaabababaabbaabbbaabbbabbaabba
abbabababbaabbaababbbabaabbbaaaabababaabbabaabbabbaabababaaababb
baaaaaaaabaabbabbababaabbbaababababbabab
aabbbbbbaaaababbabbbaabbbbbbbabbaaaaaaab
abbaabbbbaaaaaabbabbbbbbbaaaaabbabaaabbbabbabbbb
babbbbbbbaaababaaaabbaba
bbbbabbbbaaaaaaaabaababaaaabbbab
aaabaaababaababbbbbababbbbaaaaba
abbbbbbbbbbabbaaababaaabbaaaaabbbabaaaab
aabaaaababbbababbabbaaabbbbaaaabaabaaaba
abbbbbaaababaaabababaaabaaaabaabbaaabbbabbbabbbaababbbab
abaabbbbabababaabbaaabaababbabbbbbaaabaaaaaababbaabaaaab
bbaaaaabbaababbaaaaaaababbaaabbaaaaaabab
babbbbbbabaabbaaaabaaaaaabaaabbbbaababbabaabaaaa
aaaaabbabbbbbbbbaaaabbabbaababbabbbbbaab
babbaaababbaabbbbaaabababbabaaaaaabbaaaa
aabbabbababbaaababaaaaaa
bbaaaabbaaaababbaaabbaabbbbabababaaababbbbbbababbaabbaaababaababbbbaababaaaaabbaaaababbababbbbaa
babababbaabbabaabbbbabababbbbbaaabaaabbaabbbaaabbbabbbba
aabbbabaabbbabbaabbabbba
abbaaaababbaababbaaaabababaababbbbbaaaab
aabbabbaaaaaaabaabaabaaabbaabaaabbbbbabbaaababbbbbababaa
abbaaaabbabbaaabbbababaa
abaaabaabaababaabaaaababbabbaaba
bababbbbaaabababbbabbbbb
bbabbababaababbbbbbabbbb
bbbaaababaaabbbabbababbaabaaabba
baaaabababaababaabaaaaababababaaaaabbabbbaabbbab
baaaabbbbbaabbaabbbaabaaaabbaaab
baabbabbbbaaabbbaaabbbaa
bababbbabbbaababbbbababa
bbabbbababaaaaabbbaabaab
babbaaabbbabbbabaabbaabb
bbaaabaabbbbbbbaaaabbbbb
bbbaabbbbabbbbabaaaaabab
baaaabaabbbabbbabbbbbbaabaabababbaabbbbbbaaaaabbbbabaabbabbbabaa
bbbbbbbbbbabbabababbbaab
babaabababbbaaaaabbbaabbaaabaaabbabaabbaabbaaabababbbabaabbbbbbbaaabbbaa
aaaaaabaabbbaaaaabbbbbba
bbbaabaabbaaaaababaabaab
babbaababbbbbbbaaabbbbbbbbbabbbbbabaaaaabbababaabaabaaabbabaabbaabbbbbbabaababba
aababbaabaaaabbbbbbbbbaa
bbaaabaaaabbbabaababbabbaabbbbbbbabbabbbbbaabbbbabbabaabaababaaabbaaaaaa
aabababbbabbbabbbbbbbbaa
baaabbbabaabbbaaaaaabbbb
abaaabaaaababbaaaabaaaba
abababbbaaabbbaabbaaaabbaabbababaabbbabbbbbbbbbaabbbbaabbabaabbb
abaaabbabababaabaabaabab
aabbaabaabbbabaabbabbabaaabaaaaaaabbbabaaabbababbabbaaaa
bbbaabbabaaaabbbabbbbaaa
aaabababaabbbbbbbaababbbaabaaabbbaaaabaaabbababb
baaaabbbaaaabaabbaaaababaaaababa
abaaabbbababaaababbaabbbaabbbbbbbbabbababbaaabbbabbababb
bbabbabaabbbbabaaaaabbababbbbaaa
baabbabbbbbbbbabaaabaaababbaaaaa
bbaaabbabaababbaaabaaaaaaabaabaaabbaabab
bbaaabbababbabbbaababaabbbaabbaaabbbaaba
bbababbbbbbaaabbaaabbbbaababaaababaabaaaaaabbaabbaabbaab
ababababbbabbbaaababbbaabbabbabaabaaaaaa
bbbbbabbabbaaabaaaabbaaa
baaabbabbbaaabaabbaaabaabbaaabbabbabbabababababb
aaabbbbaaabbabbabbbbaaba
baaabaababaaabbbbbbababa
bbbbbbbbbbabaababbbbabab
baaabbbaaaaabbabaaabababaaabbbbabababbab
abbbaaaaababbabbbbbbaabbaabbabbababbbabbbbaaaabbbbbbbbaa
bbababbbaaabbbbabaaababb
aabbbbbbabbbaaaaabbbbbaabbbbbbabbabbabaa
bbabbbabbabbbabbaabbabaabbabaaaabbbabbbb
aaababbbaabaaaabbbabbaab
babbabbbbbabbbaaababababbabbaaababbbbbaabbabbbbbbbbabaab
baaaababaabbababbaaabaaa
abaaabbbaaaaaabaaaababbbbbbbbbaa
babbaabbabaaabaaaaaababa
baaabababbaabbbabbabbabbbbababbaaaaababbbbbbaabbbbbabbaaaaabbbbbabbbabba
abbbbababaaaabbbbbbbbaaa
babababaaabbbbbbbbaabaab
bbbaababaabbbbbbbbbabbab
bbabbabaaaaababbbbaabaab
baaaaababaabbabbbabbbbaa
bababbbbbbbaabaabaaababababaaabb
bbbbbaaabbbbabbabaaabbabaaaaababbaaababbbbbaabbabbaaaaaaaaaaabaabbaaaaabbbabaaaa
bbababbbbbaaaaabaababbbbbaabaaaa
bbaaabbaabbabaaabaabbabbbbbbaaba
baabaabaabbaababbbbaaababbbbbbabaabaaaaaabbbbbabababaaaabbaaaaba
baabbabbabbbaaaabbbbbaaa
bababbbaaaabbabbaaababba
aabababbabbbaaaaabaabaab
bbaaabaaababbbbbabaaabbbbbababaa
bbbaaabbababbbbbbbbbaaba
aabababbbabbbbbbabbbabbb
aabababbaabbaabaaaaaabbbbbabaaab
aabbbbbbabaaabbbabbaaaaa
aababaabbbaabaaaabbbaaaaabbaabaa
babbbbbbbabaabbababbbaaa
bbbbaaabbabbaabbbbbbbbbbbbaaabbbaabaabba
babbbababbbbbbbbbbbbbaab
babaabaaaaaababbaaabababbbabaaaaabbaabbbaaaaaabbabbaabab
ababaaaabbababbbabaaaaaa
baaaababbbababbbabbababb
aabbabbabaaaababbaababbbbaabbbabaabaabbaabaabbaaaabbaabaaaabbbab
abaababbbababbbbbbbbbaab
babaabbabaababababbbabbaabaabbabbbaababbabbabbbb
ababaabababbaabbaabbaabb
aaaabaaaababaabaabbbbbab
abaaabbbaaababbbababaabb
bbbaababaabaabaabaababbaabaaabaabbbbabbabbbabbbaababbbbaaabbbaaa
bababaabbaababbabbbbabbbaaaabbbb
abbbbbbaabbbbbaabbbababbabaaaabbabbbbbbbabbbabaaaaaaaabb
aabaabbbaaaabbaabbabbaaaabababbabbabaabb
aaababbbbbbaabaaaabaabaabbbabaab
baaaababaabbabbabbaababa
abbabababbababbabaaabbababbbabbb
babbabbbaabababbbabbaaba
bbabaabababbbbababbababb
abbbaabbabaabababbaaabbbbaabbaaabbbbaabbaabbbbba
babbbbabbbabbabaabbbabaaabbabababababbbbaabaababbbaababa
bababbbaaaaabaaaabababbb
babbaaababaaabbabababbbabbbbabaa
babaabbabbbaabbbabbaabbbaabbabbb
bbbaababaabaaaaaabaaabaabaababababaabbaaaaabbaabaaaabbbaaaabbaab
babbbaabaabbbabbabaaaaab
abbbbaababbaabaaaaaabbbbaaaabaabaabaaaba
bbbababbbaaabbbabbbbabaa
bababbaaaaabbabbbbabbbabbbbaaaaa
abaaaaabbbaaabbaaaabbbbaabaababbaabaabbb
abbbaabbabbbaaaabbaaaaaa
babaabbbbabababaaabaaaaaaabaabab
bbaaabbbaabbbbbbaababaaa
abbbbabaaabbbbbbabbbaaab
aabbabbaababaabaabbababaababaabb
aaaaaaaabbabaabaabaabaab
abbabaaaabbbbbbbabbaaabb
bbabaababaababbbbbaababbbaaabbbabaaaaaaabbbbbabbbbabbbbb
abbaaaabbbaabbbbabbbbbbbabbaabbbbbaabbbaabbaabba
abbaaababaaaaabaabaaabbabbaaabbaaababbbbabbaabaaabbababbabbbbaaa
aaababbbbbabbbaabbababaa
baaaaabaaabbababbabaababaaaaaabb
babbaabbaaaaaababbaababa
aaaabbabbabbabbbabbaaabababbaaaabbabaaab
abbbaaaababaabbbbbabababbbbbabaa
baabbabbababbabbaabbbabaabbabababaabababaaaabbbababbaaba
baababaabaaaaababbababaa
bbabbbaaaabaaaabbaaabbaa
bbbbbbbabbbaababaabaabbb
baaaabbbbaaabaabbaaabbbb
aaaabaaabaaaababaabaabaaabaabababaabbbbbaaababba
bbabbbbaaaabbabbbabaabaabababaaababbbbba
abaaabbbbabbbbbbbababbbaabbbabbabbbaaaaa
aabbbbbbbbbaaabbabbabbab
aaabbabbaaaabaababbabbbb
baaaabbbaabaaaaaaabbabbb
bbbbaaababaaabbabababaabbbabbaaa
aaaaaabababaabbbababaaabbababbbabbbaaaaaaabbbaaa
aabbabababaabaaabbababaa
abaabaaabbabbbbaabaaabbaaaaaaabb
bbbaaaaaaaaaabaabbaaaaaabbabbaaabaaabbbbabbbbaab
bbaaaabbaabbabaabaabbaaaabaaababbabaabab
baaabbbaabaaabbbbbbbbbabaaaaabababbabbab
bbbbbbbabbababbaabbabaab
baababbbbabababaaaaababbaababbabaaaaabab
bbaaaabbaaaaabbaababbaaa
bababbaabbababbbaabbbaababaaabaaaaabababbbbaabaabbbabbbbaaabbaaa
bbaaaabbabbabaaaabaaaaaa
babbbabbbbabaaaabaaabbbabbaabbab
abbbbbbbabbbbabaaaababbbabbbaaabaaabbaabaabaabbb
aabbbbbbbabbabbbabaaaaabaabbbbbbbabbabbbaababababababaaa
abaabaaaaabbabaaaabababa
babbbbbbaaabaaabaaabaaaa
abbaabaabababbbbabbbbaababbbaaaaabaaaabbbbbababbabbaaaba
abaabaaaaabaaaabbbbaabbbbbbababbbbbbabaaabbababb
abababaabaaabababbababbbbbbbaaaababbabba
bbbaabbaabaabbaaaaaaabaa
babaabaaabbbababbbababbaaaabbaba
bababbaabbaaaabbbbbaababaaaababbaaaabbabbaabbbabbababbab
bbabbbaaaabbbaabaaaabaabaabbbabb
babababaababbbaabbbbbbbaaabaabaababbaaabbaaaabbabbbabbba
bbbaabaaabbabbaabaaaaabaaaabaaba
baaabbbaabbabbaaaabbababbbabbabbaabaabbb
babaabbababbabbbaaabbaaa
baabababbbbaaabbbbbababa
abbbbbbbbaababaaaaabaaababbbabbabbbaaabaabbbabbb
aaaabaababbabaaabaaaaabaaaababaa
abaabbaaabbbbbbbbaaabbbabbababbbbbabaabb
bbababababbaaabaaabaabbb
babbabbbbbbababbbaaabbbb
bbbbaabbaababbaaaaaababa
ababaaabbaaaaababbabbbbb
aababbbbbabaabbbabbbabaaaaaaabab
baababbbabaaabaababaabaabbaababa
abaababbbabbbbbbabababaababaaabb
baaaaaabaabaaaabbbbbbaba
aaaaababbbaaaabaaaaaaaabaabbababbbbabbbbbbbaabababbbbbbabaabaababbaaaabbaabbabbbbabaaaabbaaaabba
babaabbaaaabababaaaaaabb
babbbababbabbbababbaaabb
bbabbbbabbaaabbabaaabbbaabbbbaaaaababbba
bababaababbbbabababaabab
baaabbbaaababbaabbaaaabb
bbbababbaaababbbbaababbbbabbbaaaaabbabbaaabbbbaabaabaababababbabbbbbabaabbaabbab
aabaabaaabaaabaaabbbaaaaababababababbbba
aaaabaaabbabbbabbaabbbaabaabbbbbbabaaaba
abbbaaabaabaaababaababaaabbababbaaaabbabaabbabaaaabbaabbaaaaaabaaaaababbbbbababb
abaaaabbbababbbabbbabbbb
aababbaaabbbbabbbbaabbaaaabbabbbabbaabba
bababaabbbabbabaaabaabbb
aabaabbabbaaaabaabbbbaaa
babbbabaabaabbaaaaaaabaa
aababbaaaaabbbbaabbbabaababbbaabaabbaaaa
babaabbaabbbbabbaabaabab
bbbaababababaaaabbbaaabbbaaaaabbbbbbbaaabbbbabaa
bbbabbaabaaaabbbaaabbbab
baaaabbbaaaababbaabaabaabaaaaaabaabbbbaa
bbaaabbbbaabbbaabbaabaaaaabbaaab
aaaabaabbbbaabbbabbabbba
bbabaaaabbbbbabbbbbaababbabbaaabbbaaabbbbabbbbbbbaabbabaabbbabbbbaaaabbabaabbaba
aaaabbabbbbbabbbbaabbbaabbaababbaaabaaabbbaaabab`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInputA,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 184;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInputB,
};
expected = 12;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 389;
test(func, input, expected, testNum, lowestTest, highestTest);