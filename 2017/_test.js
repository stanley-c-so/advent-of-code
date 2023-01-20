const equals = require('./_equality-checker');

// REFERENCE
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// FgGray = "\x1b[90m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
// BgGray = "\x1b[100m"

function test (func, input, expected, testNum, skippedTests, lowestTest, highestTest) {
  if ((lowestTest || 0) <= testNum[0] && testNum[0] <= (highestTest || Infinity)) {
    if (skippedTests.has(testNum[0])) {
      console.log('\x1b[33m%s\x1b[0m', `ooooo TEST ${testNum[0]} SKIPPED`);
    } else {
      const output = func(...Object.values(input));
      if (equals(output, expected)) {
        console.log('\x1b[32m%s\x1b[0m', `+++++ TEST ${testNum[0]} PASSED: OUTPUT IS ${expected}`);
      } else {
        console.log('\x1b[31m%s\x1b[0m', `----- TEST ${testNum[0]} FAILED: EXPECTED ${expected} BUT GOT ${output}`);
      }
    }
    console.log('');
  }
  ++testNum[0];
};

module.exports = test;