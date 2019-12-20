// --- Day 16: Flawed Frequency Transmission ---

// PART 1:

// You're 3/4ths of the way through the gas giants. Not only do roundtrip signals to Earth take five hours, but the signal quality is quite bad as well. You can clean up the signal with the Flawed Frequency Transmission algorithm, or FFT.

// As input, FFT takes a list of numbers. In the signal you received (your puzzle input), each number is a single digit: data like 15243 represents the sequence 1, 5, 2, 4, 3.

// FFT operates in repeated phases. In each phase, a new list is constructed with the same length as the input list. This new list is also used as the input for the next phase.

// Each element in the new list is built by multiplying every value in the input list by a value in a repeating pattern and then adding up the results. So, if the input list were 9, 8, 7, 6, 5 and the pattern for a given element were 1, 2, 3, the result would be 9*1 + 8*2 + 7*3 + 6*1 + 5*2 (with each input element on the left and each value in the repeating pattern on the right of each multiplication). Then, only the ones digit is kept: 38 becomes 8, -17 becomes 7, and so on.

// While each element in the output array uses all of the same input array elements, the actual repeating pattern to use depends on which output element is being calculated. The base pattern is 0, 1, 0, -1. Then, repeat each value in the pattern a number of times equal to the position in the output list being considered. Repeat once for the first element, twice for the second element, three times for the third element, and so on. So, if the third element of the output list is being calculated, repeating the values would produce: 0, 0, 0, 1, 1, 1, 0, 0, 0, -1, -1, -1.

// When applying the pattern, skip the very first value exactly once. (In other words, offset the whole pattern left by one.) So, for the second element of the output list, the actual pattern used would be: 0, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, 0, 0, -1, -1, ....

// After using this process to calculate each element of the output list, the phase is complete, and the output list of this phase is used as the new input list for the next phase, if any.

// Given the input signal 12345678, below are four phases of FFT. Within each phase, each output digit is calculated on a single line with the result at the far right; each multiplication operation shows the input digit on the left and the pattern value on the right:

// Input signal: 12345678

// 1*1  + 2*0  + 3*-1 + 4*0  + 5*1  + 6*0  + 7*-1 + 8*0  = 4
// 1*0  + 2*1  + 3*1  + 4*0  + 5*0  + 6*-1 + 7*-1 + 8*0  = 8
// 1*0  + 2*0  + 3*1  + 4*1  + 5*1  + 6*0  + 7*0  + 8*0  = 2
// 1*0  + 2*0  + 3*0  + 4*1  + 5*1  + 6*1  + 7*1  + 8*0  = 2
// 1*0  + 2*0  + 3*0  + 4*0  + 5*1  + 6*1  + 7*1  + 8*1  = 6
// 1*0  + 2*0  + 3*0  + 4*0  + 5*0  + 6*1  + 7*1  + 8*1  = 1
// 1*0  + 2*0  + 3*0  + 4*0  + 5*0  + 6*0  + 7*1  + 8*1  = 5
// 1*0  + 2*0  + 3*0  + 4*0  + 5*0  + 6*0  + 7*0  + 8*1  = 8

// After 1 phase: 48226158

// 4*1  + 8*0  + 2*-1 + 2*0  + 6*1  + 1*0  + 5*-1 + 8*0  = 3
// 4*0  + 8*1  + 2*1  + 2*0  + 6*0  + 1*-1 + 5*-1 + 8*0  = 4
// 4*0  + 8*0  + 2*1  + 2*1  + 6*1  + 1*0  + 5*0  + 8*0  = 0
// 4*0  + 8*0  + 2*0  + 2*1  + 6*1  + 1*1  + 5*1  + 8*0  = 4
// 4*0  + 8*0  + 2*0  + 2*0  + 6*1  + 1*1  + 5*1  + 8*1  = 0
// 4*0  + 8*0  + 2*0  + 2*0  + 6*0  + 1*1  + 5*1  + 8*1  = 4
// 4*0  + 8*0  + 2*0  + 2*0  + 6*0  + 1*0  + 5*1  + 8*1  = 3
// 4*0  + 8*0  + 2*0  + 2*0  + 6*0  + 1*0  + 5*0  + 8*1  = 8

// After 2 phases: 34040438

// 3*1  + 4*0  + 0*-1 + 4*0  + 0*1  + 4*0  + 3*-1 + 8*0  = 0
// 3*0  + 4*1  + 0*1  + 4*0  + 0*0  + 4*-1 + 3*-1 + 8*0  = 3
// 3*0  + 4*0  + 0*1  + 4*1  + 0*1  + 4*0  + 3*0  + 8*0  = 4
// 3*0  + 4*0  + 0*0  + 4*1  + 0*1  + 4*1  + 3*1  + 8*0  = 1
// 3*0  + 4*0  + 0*0  + 4*0  + 0*1  + 4*1  + 3*1  + 8*1  = 5
// 3*0  + 4*0  + 0*0  + 4*0  + 0*0  + 4*1  + 3*1  + 8*1  = 5
// 3*0  + 4*0  + 0*0  + 4*0  + 0*0  + 4*0  + 3*1  + 8*1  = 1
// 3*0  + 4*0  + 0*0  + 4*0  + 0*0  + 4*0  + 3*0  + 8*1  = 8

// After 3 phases: 03415518

// 0*1  + 3*0  + 4*-1 + 1*0  + 5*1  + 5*0  + 1*-1 + 8*0  = 0
// 0*0  + 3*1  + 4*1  + 1*0  + 5*0  + 5*-1 + 1*-1 + 8*0  = 1
// 0*0  + 3*0  + 4*1  + 1*1  + 5*1  + 5*0  + 1*0  + 8*0  = 0
// 0*0  + 3*0  + 4*0  + 1*1  + 5*1  + 5*1  + 1*1  + 8*0  = 2
// 0*0  + 3*0  + 4*0  + 1*0  + 5*1  + 5*1  + 1*1  + 8*1  = 9
// 0*0  + 3*0  + 4*0  + 1*0  + 5*0  + 5*1  + 1*1  + 8*1  = 4
// 0*0  + 3*0  + 4*0  + 1*0  + 5*0  + 5*0  + 1*1  + 8*1  = 9
// 0*0  + 3*0  + 4*0  + 1*0  + 5*0  + 5*0  + 1*0  + 8*1  = 8

// After 4 phases: 01029498
// Here are the first eight digits of the final output list after 100 phases for some larger inputs:

// 80871224585914546619083218645595 becomes 24176176.
// 19617804207202209144916044189917 becomes 73745418.
// 69317163492948606335995924319873 becomes 52432133.

// After 100 phases of FFT, what are the first eight digits in the final output list?

// PART 2:

// Now that your FFT is working, you can decode the real signal.

// The real signal is your puzzle input repeated 10000 times. Treat this new signal as a single input list. Patterns are still calculated as before, and 100 phases of FFT are still applied.

// The first seven digits of your initial input signal also represent the message offset. The message offset is the location of the eight-digit message in the final output list. Specifically, the message offset indicates the number of digits to skip before reading the eight-digit message. For example, if the first seven digits of your initial input signal were 1234567, the eight-digit message would be the eight digits after skipping 1,234,567 digits of the final output list. Or, if the message offset were 7 and your final output list were 98765432109876543210, the eight-digit message would be 21098765. (Of course, your real message offset will be a seven-digit number, not a one-digit number like 7.)

// Here is the eight-digit message in the final output list after 100 phases. The message offset given in each input has been highlighted. (Note that the inputs given below are repeated 10000 times to find the actual starting input lists.)

// 03036732577212944063491565474664 becomes 84462026.
// 02935109699940807407585447034323 becomes 78725270.
// 03081770884921959731165446850517 becomes 53553731.

// After repeating your input signal 10000 times and running 100 phases of FFT, what is the eight-digit message embedded in the final output list?

function FFT (part, codeStr, phases, basePattern, outputLength) {

  let input = codeStr.repeat(part === 1 ? 1 : 10000);
  const offset = part === 1 ? 0 : +input.slice(0, 7);

  for (let phase = 0; phase < phases; phase++) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      let total = 0;
      for (let j = 0; j < input.length; j++) {
        const num = input[j];
        total += num * basePattern[Math.floor((j + 1) / (i + 1)) % basePattern.length];
      }
      output += Math.abs(total % 10);
    }
    input = output;
  }

  return input.slice(offset, offset + outputLength);

  // PART 1 VS PART 2
  // if (part === 1) {


    
  // } else {

  

  // }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = FFT;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 8 || 0;
const highestTest = 8 || Infinity;

const actualInput = `59738571488265718089358904960114455280973585922664604231570733151978336391124265667937788506879073944958411270241510791284757734034790319100185375919394328222644897570527214451044757312242600574353568346245764353769293536616467729923693209336874623429206418395498129094105619169880166958902855461622600841062466017030859476352821921910265996487329020467621714808665711053916709619048510429655689461607438170767108694118419011350540476627272614676919542728299869247813713586665464823624393342098676116916475052995741277706794475619032833146441996338192744444491539626122725710939892200153464936225009531836069741189390642278774113797883240104687033645`;

// Test case 1
input = {
  part: 1,
  codeStr: `12345678`,
  phases: 1,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '48226158';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  codeStr: `12345678`,
  phases: 2,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '34040438';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  codeStr: `12345678`,
  phases: 3,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '03415518';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  codeStr: `12345678`,
  phases: 4,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '01029498';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  codeStr: `80871224585914546619083218645595`,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '24176176';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  codeStr: `19617804207202209144916044189917`,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '73745418';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  codeStr: `69317163492948606335995924319873`,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '52432133';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 1,
  codeStr: actualInput,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '73127523';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  codeStr: `03036732577212944063491565474664`,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '84462026';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  codeStr: `02935109699940807407585447034323`,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '78725270';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  codeStr: `03081770884921959731165446850517`,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = '53553731';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  codeStr: actualInput,
  phases: 100,
  basePattern: [0, 1, 0, -1],
  outputLength: 8,
};
expected = 'fill me in';
test(func, input, expected, testNum, lowestTest, highestTest);