/*

--- Day 14: Extended Polymerization ---

The incredible pressures at this depth are starting to put a strain on your submarine. The submarine has polymerization equipment that would produce suitable materials to reinforce the submarine, and the nearby volcanically-active caves should even have the necessary input elements in sufficient quantities.

The submarine manual contains instructions for finding the optimal polymer formula; specifically, it offers a polymer template and a list of pair insertion rules (your puzzle input). You just need to work out what polymer would result after repeating the pair insertion process a few times.

For example:

NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C

The first line is the polymer template - this is the starting point of the process.

The following section defines the pair insertion rules. A rule like AB -> C means that when elements A and B are immediately adjacent, element C should be inserted between them. These insertions all happen simultaneously.

So, starting with the polymer template NNCB, the first step simultaneously considers all three pairs:

The first pair (NN) matches the rule NN -> C, so element C is inserted between the first N and the second N.
The second pair (NC) matches the rule NC -> B, so element B is inserted between the N and the C.
The third pair (CB) matches the rule CB -> H, so element H is inserted between the C and the B.
Note that these pairs overlap: the second element of one pair is the first element of the next pair. Also, because all pairs are considered simultaneously, inserted elements are not considered to be part of a pair until the next step.

After the first step of this process, the polymer becomes NCNBCHB.

Here are the results of a few steps using the above rules:

Template:     NNCB
After step 1: NCNBCHB
After step 2: NBCCNBBBCBHCB
After step 3: NBBBCNCCNBBNBNBBCHBHHBCHB
After step 4: NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB

This polymer grows quickly. After step 5, it has length 97; After step 10, it has length 3073. After step 10, B occurs 1749 times, C occurs 298 times, H occurs 191 times, and N occurs 865 times; taking the quantity of the most common element (B, 1749) and subtracting the quantity of the least common element (H, 161) produces 1749 - 161 = 1588.

Apply 10 steps of pair insertion to the polymer template and find the most and least common elements in the result. What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?


--- Part Two ---

The resulting polymer isn't nearly strong enough to reinforce the submarine. You'll need to run more steps of the pair insertion process; a total of 40 steps should do it.

In the above example, the most common element is B (occurring 2192039569602 times) and the least common element is H (occurring 3849876073 times); subtracting these produces 2188189693529.

Apply 40 steps of pair insertion to the polymer template and find the most and least common elements in the result. What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?

*/

function insertCharsBetweenPairsAndCountFreq (part, inputStr) {

  // PARSE DATA
  const [template, rulesChunk] = inputStr.split('\n\n');
  const rules = rulesChunk.split('\n').map(rule => rule.split(' -> '));

  // CONSTRUCT REFERENCE DATA STRUCTURE
  const rulesDict = {};
  for (const rule of rules) {
    const [pair, letter] = rule;
    rulesDict[pair] = letter;
  }

  // PREPARE FOR SIMULATION BY INITIALIZING A DICTIONARY OF PAIRS FOUND IN TEMPLATE
  let freqOfPairs = {};                                                                                   // e.g. for template 'NNCB', we want { 'NN': 1, 'NC': 1, 'CB': 1 }
  for (let i = 0; i < template.length - 1; ++i) {
    const pair = template[i] + template[i + 1];
    freqOfPairs[pair] = freqOfPairs[pair] + 1 || 1;
  }

  // RUN SIMULATION, GENERATING NOT THE STRING ITSELF, BUT A DICTIONARY OF PAIRS FOUND IN FINAL STRING
  for (let k = 0; k < (part === 1 ? 10 : 40); ++k) {                                                      // PART 1: run 10 steps; PART 2: run 40 steps
    const newFreqOfPairs = {};                                                                            // based on freqOfPairs, we want to figure out newFreqOfPairs
    for (const pair in freqOfPairs) {                                                                     // e.g. if pair is 'AB'...
      const val = freqOfPairs[pair];                                                                      // ...assume freqOfPairs tells us that 'AB' currently appears 10 times...
      if (!(pair in rulesDict)) throw 'YOU SCREWED UP';                                                   // (we reasonably assume a rule exists for every pair that is encountered)
      const newChar = rulesDict[pair];                                                                    // ...assume rulesDict tells us that AB -> X (so X gets inserted between A and B)...
      const newPairA = pair[0] + newChar;                                                                 // ...then that means one resulting pair would be 'AX'...
      const newPairB = newChar + pair[1];                                                                 // ...and the other would be 'XB'...
      newFreqOfPairs[newPairA] = newFreqOfPairs[newPairA] + val || val;                                   // ...so in what would be the new string, we would find 'AX' 10 times...
      newFreqOfPairs[newPairB] = newFreqOfPairs[newPairB] + val || val;                                   // ...and 'XB' 10 times. thus, we update newFreqOfPairs accordingly
    }
    freqOfPairs = newFreqOfPairs;                                                                         // finally, we update freqOfPairs based on newFreqOfPairs
  }

  // COUNT THE FREQUENCY OF EACH UNIQUE CHARACTER IN WHAT WOULD BE THE FINAL STRING
  const finalCharFreq = {};
  for (const pair in freqOfPairs) {                                                                       // to get the freq of each char, count freq of each PAIR - that's double counting!
    const val = freqOfPairs[pair];                                                                        // e.g. if pair is 'AB' and that appears 1000 times...
    finalCharFreq[pair[0]] = finalCharFreq[pair[0]] + val || val;                                         // ...then that's 1000 As and 1000 Bs. this is a double count, though...
    finalCharFreq[pair[1]] = finalCharFreq[pair[1]] + val || val;                                         // ...because in general the first char of one pair is the last char of another!
  }
  for (const c in finalCharFreq) {                                                                        // so we halve. BUT there's ONE LESS of the first and last chars of template!
    finalCharFreq[c] = Math.ceil(finalCharFreq[c] / 2);                                                   // we could either increment each of these once before halving, or just Math.ceil
  }

  // SORT BY FREQUENCY, AND SUBTRACT LEAST FREQUENT FROM MOST FREQUENT
  const sorted = Object.keys(finalCharFreq).sort((a, b) => finalCharFreq[b] - finalCharFreq[a]);
  return finalCharFreq[sorted[0]] - finalCharFreq[sorted[sorted.length - 1]];

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = insertCharsBetweenPairsAndCountFreq;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const actualInput = `SNVVKOBFKOPBFFFCPBSF

HH -> P
CH -> P
HK -> N
OS -> N
HV -> S
VC -> C
VO -> K
OC -> C
FB -> S
NP -> S
OK -> H
OO -> N
PP -> B
VK -> B
BV -> N
PN -> K
HC -> C
NS -> K
BO -> C
BN -> O
SP -> H
FK -> K
KF -> N
VP -> H
NO -> N
OH -> N
CC -> O
PK -> P
BF -> K
CP -> N
SH -> V
VS -> P
BH -> B
KS -> H
HB -> K
BK -> S
KV -> C
SF -> B
BB -> O
PC -> S
HN -> S
FP -> S
PH -> C
OB -> O
FH -> K
CS -> P
OF -> N
FF -> V
PV -> B
PF -> C
FC -> S
KC -> O
PS -> V
CO -> F
CK -> O
KH -> H
OP -> O
SK -> S
VB -> P
FN -> H
FS -> P
FV -> N
HP -> O
SB -> N
VN -> V
KK -> P
KO -> V
BC -> B
FO -> H
OV -> H
CF -> H
HF -> K
SS -> V
SC -> N
CB -> B
SV -> C
SN -> P
PB -> B
KP -> S
PO -> B
CN -> F
ON -> B
CV -> S
HO -> O
NF -> F
VH -> P
NN -> S
HS -> S
NV -> V
NH -> C
NB -> B
SO -> K
NC -> C
VF -> B
BS -> V
VV -> N
BP -> P
KN -> C
NK -> O
KB -> F`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 1588;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2967;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 2188189693529;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3692219987038;
test(func, input, expected, testNum, lowestTest, highestTest);