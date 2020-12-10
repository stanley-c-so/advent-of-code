// --- Day 10: Adapter Array ---

// Patched into the aircraft's data port, you discover weather forecasts of a massive tropical storm. Before you can figure out whether it will impact your vacation plans, however, your device suddenly turns off!

// Its battery is dead.

// You'll need to plug it in. There's only one problem: the charging outlet near your seat produces the wrong number of jolts. Always prepared, you make a list of all of the joltage adapters in your bag.

// Each of your joltage adapters is rated for a specific output joltage (your puzzle input). Any given adapter can take an input 1, 2, or 3 jolts lower than its rating and still produce its rated output joltage.

// In addition, your device has a built-in joltage adapter rated for 3 jolts higher than the highest-rated adapter in your bag. (If your adapter list were 3, 9, and 6, your device's built-in adapter would be rated for 12 jolts.)

// Treat the charging outlet near your seat as having an effective joltage rating of 0.

// Since you have some time to kill, you might as well test all of your adapters. Wouldn't want to get to your resort and realize you can't even charge your device!

// If you use every adapter in your bag at once, what is the distribution of joltage differences between the charging outlet, the adapters, and your device?

// For example, suppose that in your bag, you have adapters with the following joltage ratings:

// 16
// 10
// 15
// 5
// 1
// 11
// 7
// 19
// 6
// 12
// 4

// With these adapters, your device's built-in joltage adapter would be rated for 19 + 3 = 22 jolts, 3 higher than the highest-rated adapter.

// Because adapters can only connect to a source 1-3 jolts lower than its rating, in order to use every adapter, you'd need to choose them like this:

// The charging outlet has an effective rating of 0 jolts, so the only adapters that could connect to it directly would need to have a joltage rating of 1, 2, or 3 jolts. Of these, only one you have is an adapter rated 1 jolt (difference of 1).
// From your 1-jolt rated adapter, the only choice is your 4-jolt rated adapter (difference of 3).
// From the 4-jolt rated adapter, the adapters rated 5, 6, or 7 are valid choices. However, in order to not skip any adapters, you have to pick the adapter rated 5 jolts (difference of 1).
// Similarly, the next choices would need to be the adapter rated 6 and then the adapter rated 7 (with difference of 1 and 1).
// The only adapter that works with the 7-jolt rated adapter is the one rated 10 jolts (difference of 3).
// From 10, the choices are 11 or 12; choose 11 (difference of 1) and then 12 (difference of 1).
// After 12, only valid adapter has a rating of 15 (difference of 3), then 16 (difference of 1), then 19 (difference of 3).
// Finally, your device's built-in adapter is always 3 higher than the highest adapter, so its rating is 22 jolts (always a difference of 3).
// In this example, when using every adapter, there are 7 differences of 1 jolt and 5 differences of 3 jolts.

// Here is a larger example:

// 28
// 33
// 18
// 42
// 31
// 14
// 46
// 20
// 48
// 47
// 24
// 23
// 49
// 45
// 19
// 38
// 39
// 11
// 1
// 32
// 25
// 35
// 8
// 17
// 7
// 9
// 4
// 2
// 34
// 10
// 3

// In this larger example, in a chain that uses all of the adapters, there are 22 differences of 1 jolt and 10 differences of 3 jolts.

// Find a chain that uses all of your adapters to connect the charging outlet to your device's built-in adapter and count the joltage differences between the charging outlet, the adapters, and your device. What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?

// --- Part Two ---

// To completely determine whether you have enough adapters, you'll need to figure out how many different ways they can be arranged. Every arrangement needs to connect the charging outlet to your device. The previous rules about when adapters can successfully connect still apply.

// The first example above (the one that starts with 16, 10, 15) supports the following arrangements:

// (0), 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 5, 6, 7, 10, 12, 15, 16, 19, (22)
// (0), 1, 4, 5, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 5, 7, 10, 12, 15, 16, 19, (22)
// (0), 1, 4, 6, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 6, 7, 10, 12, 15, 16, 19, (22)
// (0), 1, 4, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 7, 10, 12, 15, 16, 19, (22)

// (The charging outlet and your device's built-in adapter are shown in parentheses.) Given the adapters from the first example, the total number of arrangements that connect the charging outlet to your device is 8.

// The second example above (the one that starts with 28, 33, 18) has many arrangements. Here are a few:

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 48, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 47, 48, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 46, 48, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 46, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 47, 48, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 47, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 48, 49, (52)

// In total, this set of adapters can connect the charging outlet to your device in 19208 distinct arrangements.

// You glance back down at your bag and try to remember why you brought so many adapters; there must be more than a trillion valid ways to arrange them! Surely, there must be an efficient way to count the arrangements.

// What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?

function analyzeAdapters (part, inputStr) {
  const inputArr = inputStr.split('\n');

  const adapters = inputArr.map(n => +n).sort((a, b) => a - b);         // in part 1 we must use all adapters, which must always increase in joltage, so there is only one possible sequence
                                                                        // in part 2, the hash is dynamically built from lower values, so again, we need the data to be sorted
  const device = adapters[adapters.length - 1] + 3;                     // the device itself is 3 higher than the highest adapter. figure out what its value is...
  adapters.push(device);                                                // ...and add the device itself to the list

  if (part === 1) {                                                     // PART 1: DETERMINE THE JOLTAGE OF THE CONNECTIONS BETWEEN THE SORTED ADAPTERS

    let diff1 = 0;
    let diff3 = 0;
    for (let i = 0; i < adapters.length; ++i) {
      const diff = !i ? adapters[i] : adapters[i] - adapters[i - 1];    // the first adapter always connects to the outlet which has joltage value of 0
      if (diff < 1 || diff > 3) throw "INVALID: NO SOLUTION";           // we are given that there must be a solution (thus diff must be 1, 2, or 3)
      if (diff === 1) ++diff1;
      if (diff === 3) ++diff3;
    }
    return diff1 * diff3;

  } else {                                                              // PART 2: COUNT THE NUMBER OF WAYS YOU CAN CONNECT LOWER ADAPTERS UP TO THE ADAPTER OF A GIVEN JOLTAGE

    const hash = {};                                                    // if an adapter has joltage i, then hash[i] should be the number of arrangements to get up to that device
    hash[0] = 1;                                                        // there is, of course, only one arrangement to get up to just the outlet
    for (const adapter of adapters) {                                   // for each adapter, in increasing order, if the joltage value of the adapter is X...
      hash[adapter] = (hash[adapter - 1] || 0)                          // ...then the number of ways to reach it is the sum of the number of ways to reach X-1 (if such adapter exists)...
        + (hash[adapter - 2] || 0)                                      // ...plus the number of ways to reach X-2 (if such adapter exists)...
        + (hash[adapter - 3] || 0);                                     // ...plus the number of ways to reach X-3 (if such adapter exists). to get to X, you must come from X-1, X-2, or X-3.
    }
    return hash[device];                                                // recall that device is the joltage value of your device. simply return the corresponding value saved in the hash

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeAdapters;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInputA = `16
10
15
5
1
11
7
19
6
12
4`;

const sampleInputB = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;

const actualInput = `104
83
142
123
87
48
102
159
122
69
127
151
147
64
152
90
117
132
63
109
27
47
7
52
59
11
161
12
148
155
129
10
135
17
153
96
3
93
82
55
34
65
89
126
19
72
20
38
103
146
14
105
53
77
120
39
46
24
139
95
140
33
21
84
56
1
32
31
28
4
73
128
49
18
62
81
66
121
54
160
158
138
94
43
2
114
111
110
78
13
99
108
141
40
25
154
26
35
88
76
145`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInputA,
};
expected = 7 * 5;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInputB,
};
expected = 22 * 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2201;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: sampleInputA,
};
expected = 8;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInputB,
};
expected = 19208;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 169255295254528;
test(func, input, expected, testNum, lowestTest, highestTest);