/*

--- Day 8: Seven Segment Search ---

You barely reach the safety of the cave when the whale smashes into the cave mouth, collapsing it. Sensors indicate another exit to this cave at a much greater depth, so you have no choice but to press on.

As your submarine slowly makes its way through the cave system, you notice that the four-digit seven-segment displays in your submarine are malfunctioning; they must have been damaged during the escape. You'll be in a lot of trouble without them, so you'd better figure out what's wrong.

Each digit of a seven-segment display is rendered by turning on or off any of seven segments named a through g:

  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

So, to render a 1, only segments c and f would be turned on; the rest would be off. To render a 7, only segments a, c, and f would be turned on.

The problem is that the signals which control the segments have been mixed up on each display. The submarine is still trying to display numbers by producing output on signal wires a through g, but those wires are connected to segments randomly. Worse, the wire/segment connections are mixed up separately for each four-digit display! (All of the digits within a display use the same connections, though.)

So, you might know that only signal wires b and g are turned on, but that doesn't mean segments b and g are turned on: the only digit that uses two segments is 1, so it must mean segments c and f are meant to be on. With just that information, you still can't tell which wire (b/g) goes to which segment (c/f). For that, you'll need to collect more information.

For each display, you watch the changing signals for a while, make a note of all ten unique signal patterns you see, and then write down a single four digit output value (your puzzle input). Using the signal patterns, you should be able to work out which pattern corresponds to which digit.

For example, here is what you might see in a single entry in your notes:

acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |
cdfeb fcadb cdfeb cdbaf
(The entry is wrapped here to two lines so it fits; in your notes, it will all be on a single line.)

Each entry consists of ten unique signal patterns, a | delimiter, and finally the four digit output value. Within an entry, the same wire/segment connections are used (but you don't know what the connections actually are). The unique signal patterns correspond to the ten different ways the submarine tries to render a digit using the current wire/segment connections. Because 7 is the only digit that uses three segments, dab in the above example means that to render a 7, signal lines d, a, and b are on. Because 4 is the only digit that uses four segments, eafb means that to render a 4, signal lines e, a, f, and b are on.

Using this information, you should be able to work out which combination of signal wires corresponds to each of the ten digits. Then, you can decode the four digit output value. Unfortunately, in the above example, all of the digits in the output value (cdfeb fcadb cdfeb cdbaf) use five segments and are more difficult to deduce.

For now, focus on the easy digits. Consider this larger example:

be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb |
fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec |
fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef |
cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega |
efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga |
gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf |
gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf |
cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd |
ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg |
gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc |
fgae cfgab fg bagce

Because the digits 1, 4, 7, and 8 each use a unique number of segments, you should be able to tell which combinations of signals correspond to those digits. Counting only digits in the output values (the part after | on each line), in the above example, there are 26 instances of digits that use a unique number of segments (highlighted above).

In the output values, how many times do digits 1, 4, 7, or 8 appear?


--- Part Two ---

Through a little deduction, you should now be able to determine the remaining digits. Consider again the first example above:

acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |
cdfeb fcadb cdfeb cdbaf
After some careful analysis, the mapping between signal wires and segments only make sense in the following configuration:

 dddd
e    a
e    a
 ffff
g    b
g    b
 cccc

So, the unique signal patterns would correspond to the following digits:

acedgfb: 8
cdfbe: 5
gcdfa: 2
fbcad: 3
dab: 7
cefabd: 9
cdfgeb: 6
eafb: 4
cagedb: 0
ab: 1

Then, the four digits of the output value can be decoded:

cdfeb: 5
fcadb: 3
cdfeb: 5
cdbaf: 3

Therefore, the output value for this entry is 5353.

Following this same process for each entry in the second, larger example above, the output value of each entry can be determined:

fdgacbe cefdb cefbgd gcbe: 8394
fcgedb cgb dgebacf gc: 9781
cg cg fdcagb cbg: 1197
efabcd cedba gadfec cb: 9361
gecf egdcabf bgf bfgea: 4873
gebdcfa ecba ca fadegcb: 8418
cefg dcbef fcge gbcadfe: 4548
ed bcgafe cdgba cbgef: 1625
gbdfcae bgc cg cgb: 8717
fgae cfgab fg bagce: 4315

Adding all of the output values in this larger example produces 61229.

For each entry, determine all of the wire/segment connections and decode the four-digit output values. What do you get if you add up all of the output values?

*/

function decode (part, inputStr) {

  /*
    PART 2 ANALYSIS WILL MAKE SENSE IF YOU CONSIDER EACH DIGIT TO BE MADE WITH THE FOLLOWING WIRES, BASED ON THE PROMPT (letters are sorted), GROUPED BY LENGTH:

     AAAA
    B    C
    B    C
     DDDD
    E    F
    E    F
     GGGG

    UNIQUE LENGTHS:
    1 -> 'CF'
    4 -> 'BCDF'
    7 -> 'ACF'
    8 -> 'ABCDEFG'

    LENGTH 5:
    2 -> 'ACDEG'
    3 -> 'ACDFG'
    5 -> 'ABDFG'

    LENGTH 6:
    0 -> 'ABCEFG'
    6 -> 'ABDEFG'
    9 -> 'ABCDFG'

  */

  // INIT
  const inputArr = inputStr.split('\n');
  const YOU_SCREWED_UP = 'YOU SCREWED UP';
  let total = 0;                                                                  // part 1: number of output digits with unique lengths. part 2: total of output numbers

  // UTILITY FUNCTION
  const sortStr = str => str.split('').sort().join('');

  for (const line of inputArr) {

    const [LS, RS] = line.split(' | ');
    const outputArr = RS.split(' ');
    
    if (part === 1) {                                                             // PART 1: total up the number of output digits with unique lengths

      const uniqueLengths = [2, 4, 3, 7];                                         // these are the unique lengths (only '1' has a length of 2, '4' has a length of 4, etc.)
      for (const str of outputArr) {
        if (uniqueLengths.includes(str.length)) ++total;
      }

    } else {                                                                      // PART 2: decode output digits and total up their numbers

      // INIT
      const strByDigit = Array(10).fill(null);                                    // if we know a certain string str represents a digit k, then strByDigit[k] === str
      const decodedDigits = {};                                                   // refer to the wires that make up '8' in the prompt. e.g. D is middle line. if mapped to x, then decodedDigits.D === x
      const digitStrs = LS.split(' ').map(sortStr);                               // sort all the string representations of the 10 digits
      const strByLength = digitStrs.reduce((dict, str) => {                       // will have keys 2, 3, 4, 5, 6, and 7, mapping to arrays containing str representations of those lengths
        if (!(str.length in dict)) dict[str.length] = [];
        dict[str.length].push(str);
        return dict;
      }, {});

      // ===== STEP 1: find 1, 4, 7, 8

      strByDigit[1] = strByLength[2][0];                                          // only '1' has a length of 2
      strByDigit[4] = strByLength[4][0];                                          // only '4' has a length of 4
      strByDigit[7] = strByLength[3][0];                                          // only '7' has a length of 3
      strByDigit[8] = strByLength[7][0];                                          // only '8' has a length of 7

      // ===== STEP 2: find F, D, 0, 2
      
      // --- STEP 2a: look for all string representations with length 5 or 6, and track the frequency of their component letters.
      const freq1 = {};
      for (const str of [...strByLength[5], ...strByLength[6]]) {
        for (const c of str) {
          freq1[c] = freq1[c] + 1 || 1;
        }
      }

      // --- STEP 2b: only the letters mapped to D and F will have frequency 5. identify those two letters.
      const D_and_F = [];
      for (const c in freq1) {
        if (freq1[c] === 5) D_and_F.push(c);
      }
      if (D_and_F.length !== 2) throw YOU_SCREWED_UP;

      // --- STEP 2c: identify F by checking for the letter that also features in the string representation of '1'. the other letter is D.
      const does1IncludeFirstLetter = strByDigit[1].includes(D_and_F[0]);
      decodedDigits.F = does1IncludeFirstLetter ? D_and_F[0] : D_and_F[1];
      decodedDigits.D = does1IncludeFirstLetter ? D_and_F[1] : D_and_F[0];

      // --- STEP 2d: the only 6-length string representation that does not include D is 0.
      for (const str of strByLength[6]) {
        if (!str.includes(decodedDigits.D)) strByDigit[0] = str;
      }
      if (strByDigit[0] === null) throw YOU_SCREWED_UP;

      // --- STEP 2e: the only 5-length string representation that does not include F is 2.
      for (const str of strByLength[5]) {
        if (!str.includes(decodedDigits.F)) strByDigit[2] = str;
      }
      if (strByDigit[2] === null) throw YOU_SCREWED_UP;

      // ===== STEP 3: find B, E, 5

      // --- STEP 3a: look for all string representations with length 5, and track the frequency of their component letters.
      const freq2 = {};
      for (const str of strByLength[5]) {
        for (const c of str) {
          freq2[c] = freq2[c] + 1 || 1;
        }
      }

      // --- STEP 3b: only the letters mapped to B and E will have frequency 1. identify those two letters.
      const B_and_E = [];
      for (const c in freq2) {
        if (freq2[c] === 1) B_and_E.push(c);
      }
      if (B_and_E.length !== 2) throw YOU_SCREWED_UP;

      // --- STEP 3c: identify F by checking for the letter that also features in the string representation of '1'. the other letter is D.
      const does4IncludeFirstLetter = strByDigit[4].includes(B_and_E[0]);
      decodedDigits.B = does4IncludeFirstLetter ? B_and_E[0] : B_and_E[1];
      decodedDigits.E = does4IncludeFirstLetter ? B_and_E[1] : B_and_E[0];

      // --- STEP 3d: the only 5-length string representation that includes B is 5.
      for (const str of strByLength[5]) {
        if (str.includes(decodedDigits.B)) strByDigit[5] = str;
      }
      if (strByDigit[5] === null) throw YOU_SCREWED_UP;

      // ===== STEP 4: find 3 from the last 5-length string representation that does not match 2 (found in step 2) and 5 (found in step 3).

      for (const str of strByLength[5]) {
        if (str !== strByDigit[2] && str !== strByDigit[5]) strByDigit[3] = str;
      }
      if (strByDigit[3] === null) throw YOU_SCREWED_UP;

      // ===== STEP 5: find 6, 9 from the 6-length string representations that do not match 0 (found in step 2). the one that includes the letter mapped to E (found in step 3) is 6, and the other is 9.

      for (const str of strByLength[6]) {
        if (str === strByDigit[0]) continue;
        else if (str.includes(decodedDigits.E)) strByDigit[6] = str;
        else strByDigit[9] = str;
      }
      if (strByDigit[6] === null || strByDigit[9] === null) throw YOU_SCREWED_UP;

      // ===== STEP 6: you now have all 10 digits, so decode the output and add it to the total

      const digitByStr = strByDigit.reduce((dict, str, i) => {
        dict[str] = i;
        return dict;
      }, {});

      const outputStr = outputArr.map(sortStr).map(str => digitByStr[str]).join('');
      const outputNum = +outputStr;
      total += outputNum;

      // ===== OPTIONAL: while we've found all 10 digits, we still haven't solved for A, C, G.

      // --- find A by looking for the letter appears in '7' but not in '1'.
      for (const c of strByDigit[7]) {
        if (!strByDigit[1].includes(c)) decodedDigits.A = c;
      }
      if (!decodedDigits.A) throw YOU_SCREWED_UP;

      // --- find C by looking for the only letter that does not appear in the string representation for '6'.
      for (const c of 'abcdefg') {
        if (!strByDigit[6].includes(c)) decodedDigits.C = c;
      }
      if (!decodedDigits.C) throw YOU_SCREWED_UP;

      // --- find G by looking for the final letter that is not mapped
      const lettersFoundSoFar = Object.values(decodedDigits);
      for (const c of 'abcdefg') {
        if (!lettersFoundSoFar.includes(c)) decodedDigits.G = c;
      }
      if (!decodedDigits.G) throw YOU_SCREWED_UP;

      // ===== DEBUG:

      console.log(strByDigit);
      console.log(decodedDigits);

    }
  }

  return total;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = decode;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput1 = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`;

const sampleInput2 = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

const actualInput = `begfcd fabg aecgbdf cefagb edgcba eacbf efgbc bca ab decfa | cbgef befdcg bceaf fagb
cfdegb bdefca ac becdf cefagd bfac cfegbad aegbd cad beacd | ca dgfaec gbdae agcdfe
dfegbc dea cabdefg efdgca fgabed dgeac cgadb gfdec ae afec | dfecg feca bgcad ebgfcd
cdbag ca gdbae cga acfd cabdefg bgfcad eabcgf defcgb bcdfg | cagbd gadcb gacbd dbagfc
facedg begfac efdga ag cefadbg gacd bdgefc afg fdbea fegdc | fag ebcgfd gfeda afg
cb cab cefad dafecb caefb cfdb cdfgabe dgebac afgdec fagbe | bdceaf fcdb deacf cb
cbaged adefcgb bdcf gaedbf gdcef fgbed bgdfec ecgaf cde cd | gbdfe cd efgbcd cdbf
dcfag gebc acgef cfe cdbefag cfbaed ec begfa efcagb egdabf | bfage ce ec gdfca
geabf befcdag dfbg fegac bg adbgef deafb bagced fadceb gbe | dgcaefb bdgf cfeag gbe
fc acdeb ecbdf edafcb bfdge acdebg gbcfea cdfa abefcdg bfc | decab egcabd dacgeb fagbdec
dfg bfga faedb dfeag dcbgef dgfecab faedbc fg bedafg egdac | eagdbf daefg gdf gcdebfa
acdgfbe afebdg agebc efcdab dbcafg dc efcd cabed abfde dca | ecfbda dgbecfa adc begdfa
fbadge dfaecb dcfbg acgbef cgadefb egda feadb dbfeg ge gfe | bgfdcae efgbd fgecadb feg
bfgdace abdc ebdgac aecgf cbg afbegd acegb fgcbed bc dbgea | cb cebdga gbc eabgd
baef gedafc ba cfead bdcgf gefacdb cadgbe abc bfcad bfadce | gcefad agedfc bfae cafde
cadfb fdbge gbcefa adcfbg bae ebacfdg ae bedfa cdea eadcbf | edgfb dfgbcea ae deca
cfbadeg fcdeg cagebf gac gcaed bgad acefdb edabc baedgc ga | acg eacdbfg gdba badfce
fda bagdcf da ceagdfb ecgfa beagfd fdgae egbdf dbfcge deba | bacefdg dbea bfegd dgbfca
aceg dcafg eaf cdgefa ebadfc adefg dfecbga dcbgaf ea bedfg | daefg fegad agce fcebagd
aged gd dgbfca egbac dcebf dgc ebdcag cegdb begacf bcegfad | afecbg bcadeg gecfbda edga
cfbaeg bfca bae fdbge cegaf ba eagfb gfcdae agbecd gbecfda | cbgefa ba aeb cbaf
ag dgafceb gfacdb gcdaf gac abfdc facegb beacdf bdag cdfeg | adcfgbe bgcfea ga cbeadf
cgfdb gfbdce cebg dfgaeb dgefac cg dgbef cbdfega fdcba gdc | degfab fcdgea fgcbd cg
afecg fca dgcef cdgeba af abgce dcfbae bafg cfbeag egdcbfa | gecdf aebcg dgacbef cabeg
dbcea gadef bfge bg dbg adcfge dbgfcae abdge bgfdea bfcagd | bgd gcadfe abged fcbdaeg
gfaecbd ab cfeba abfd acb fabcde ecbgf eagdfc adecf cdageb | fbaec ba cgbdeaf ab
bfedg egafb fcae gbdace bfcegad bgafdc bgfca ega cfbeag ea | cfadebg cgbdaf efac bcgfa
dfbgeca cfbega aedcfb faebgd feabd aeg gbde eg cdgaf dafge | bfeacg gaefd ega bcafge
bacd agc fgdbc fdgcab ac bgfca aegbf adcgbef ebcfgd eadgcf | cbdafg agc dafbgec bgcfad
gc cfg ebcafd edacgf fgdcb afdgb fcebd bgce aebcgdf fgbcde | cgbe cbge gc bgce
feadc fg dbcgae fga bcefag fbdcaeg gacef febg gafbcd gaecb | fg afg afg gf
cfea ce gbdefc bdacf agfdbc badfce bgdea adbce gcfbaed ebc | ce bacdf dcabf ec
dafcb beagfc abcgf fedabgc fda ad dcga gfbcda egdbfa ebfcd | agdc eafgbdc ceagfb daf
ecbagd edb gafed caebgfd gcdafb cfdbg bedgf cefb ebgfcd be | bgdfcae adcgeb deb ecgabfd
aebdfc dba bafdgec adfcg dbacf ab dgfeab befcd bedgfc acbe | ecba cadfbe fgcebd gfcbde
dc gdc cfaeg gdbcfae edfbcg cagbfd dgacf cbda abfdge abgdf | cbad efagc dabfg fedbga
acefbg gda ad agdeb edfcag abcdge bfdcgea bdgfe bdca agebc | ad bcgfeda ad gda
gd gbeacd fdbgac bfgea eagcbdf fagbd gbd cfabed fcdg fdcba | fcdbga gdafb cdgaefb bfgad
ef bfegcda bfe bgfea dacgfb cebga gfdab feda egfdba fgedbc | fe ebgaf dfea gbeac
afbge ecdbag gdfaec cafbe badefgc adbfge dgeba gf dgbf gfa | bdfg fga feagb fg
afcedb cgabe ecd beafd cbfd dc edabc bgdafe gfcbdae acgedf | dec debfa gabec dfeab
gcafd fb bdagcf cebfga fgdb bfc cegfdba dcabe dfbac acdgef | cagebf dfaegc agfcbd feadgc
aefcb geab ga eacfg gca cbefad gefcadb dfbcga fgdce baecgf | ga bgae bdefgca deabfc
gfdc dcbfga fg edafbgc acbdeg dabef fcaegb gdcba fbdag gfb | baefd bgf feabd bfg
gdbcea ef edafc agdce facbd gcfead gfbeca dfge fec cafegdb | bfcda facged adfcebg fce
bgadc aedg efgacdb abdfc gdb dfcegb abecg efgbac gd acgdbe | adbgc dgb afcdb gdae
deg adbcfge dcbeg ceag dfbace bdaecg bdcgf bcdae bdfgea ge | adbec eacg ge gde
fbgde afdgeb bfgecd dgfa aegbf fabedgc ag ecbaf gab ecbgda | agb bfgde gedfb eabgf
dfega gedcfb bdagf fgcdae bdg ebad cafbg gbfcdae gbaefd db | adbgfce bdgafe ecdabgf gadbef
cbagf adgeb df dfbe gdabcfe bedfag dgf fcgeda abfgd ecbgad | fd dfbe cfdbgae gedbfa
fabdecg cdgae cdaebg acdef gecdbf egacfd dfc fd fgda bfcae | dbeacg feadc gfad fd
cegdabf db cfeadb gdcef adbg gfabc bdfcg agdcbf dfb facgbe | dfb dgfce acdbegf cbfgad
gfecab bedgcf ecgbdaf cagbf dgba dg gacfd cfeda gfdbac cgd | bagd fecgbd begfcd dgc
dfcagb fdabe daebc af adegcb afce fegcadb dbfge edafcb fad | cgebda cdfbae bfgdac fa
ec gedafc fcbegad dabcef aecb dfabe dbefag gcdbf cfedb edc | fgdaeb bace ceab eacb
faegcd bce bdcgae gcabe acdb bacfdeg daegc bc efcbdg bgfae | ceb bcgea bc bec
gcdfe bacdf be bdefc ebd adbfce gdeabc bafe cabdfg edbcfag | bgcfda dafcb gdbfeca fcdbga
agdfce defcgab fbdgc ba fgabd baf bdae gefda gedfab gcaebf | ba cgefab fgbdc aefgcd
fbcdag egcdba cgfed baedcf afbg cdagbef bf cbf agbdc bfcdg | gbfa egbcad fb defgc
gafc dcg bgefcad fdbacg cg gcdab bfgda gbfade cebad defbgc | bacde fbdga cdg facg
dfgbca bfed abgefd becag dgface bgf abgfe bdcfgae fb defag | gfb cgaeb bceag fb
efadc gcfbaed cdeafb cabdge acgf geadfc afdge gdebf ag aeg | aegbcd afcg edabcg fadgec
abcdg daebc ae afgdcbe cbefdg dbfec afeb eca cabfde gfecad | ceabd cdgab bedca dbfgcea
gedbafc gdbef edg abefcg cbfgd edgbaf afdcge gaefb ebad ed | bfdge bgfae ed abedfg
cgabdfe ebc degbc debcgf acgbd bfdge adfbge efbgca ce dcfe | acbefdg begadf fbdge dfce
fecgb adbe cbage fgcead gdcea cgedafb bgafcd abc bedacg ba | fgbdac dfaceg gdeafcb acb
edfag abdf befgd bf ebgdaf cdebg gbfdeac fgb bfgcae egfdac | ecfgab fbg gbf ecdagf
cdebg dace ebgcdfa cagfbd ebdcag ce gedbf ecg bacgfe cagbd | acfgeb ec ceg gabcef
defca edgca gecafb adg gd bedg dbgace agbec cdafebg abgdfc | gedb degb ebcafg fcade
gcabedf cdb dcegb dbegf cb acedg fcgbad fabedg fcdebg bfec | dgbef cdage cbdeg bdcge
dae bfgdea ad fcbedg aegdc gedfc cegfadb dfaecg bcega afdc | aed dcebfga beacgfd beagdf
fge cegfdba cdgae fdgcba ef bdgfa acgebf dfaeg afgdbe fedb | ef gecda afdgb fagbdc
afd cfgd bdgeca fbega bdgaf gfebdca badgcf gcabd cbfade fd | afd gdabf cfdaeb dacgeb
ebgca dg bfcgdae gdb bedfc geda dgafbc cbged dbcgea cabfge | gd adfcgb daeg gd
gd facbge bagced fdcbe dbg gacd cebga ebdfga becdg agedbfc | cadg dagbef ebfdc cadg
adf dcaef cfbage bcefgad feacgd df gedf gcfabd ecgaf ebdac | ecabd dfaec afdec cdaeb
gaf adgef bfae fa dgacbf aebgd cgadbe gecfdab efdgc aegbfd | fedgba dacbfeg gedcf bdacfg
ebfdc cebgda cfbged fgdeb efcg fbedac fbgcdea afdbg gde ge | ecfg facdbge debfg dge
dgef gabdc ebcagf fbcdea aefcbgd begadf dgabe ge eag baefd | efbgca cdagb degf cadebf
dc cbgead ebcga bcd cgbaedf cgfabe agbcd dgbfa cgde acfedb | caebgd cedg cd becdfa
gcbfae bca fgac gadbce fdeabg ca edbfc cfeadgb fgabe acebf | facg fgabe caebdgf fcag
fagdbe afcge fadcgeb aecdgf cfegb fegad afc edca ca fbgdca | fgdacb eadgf bcdfgae cfabedg
ebgfca bgfec gfb efdbc aegbc adecgb dfabegc fg gafe fgabdc | bedcf efag gecba gbfec
dgabef caef bdfcae fe bgdfc fbe dfecb abgdce cbdefag beacd | fbe cdabfe cbedf cefa
bgcfda facbe gdeacf cd dcgb bdfeagc dca dbgfea cdbfa gfadb | fbcda fbeca cd bfgad
bfcgda bcgdfea facbe aecgdb badge cg beafdg gecd agc gcaeb | gefbda bedga edgcab gced
gac gacef fdabgc fbdcega abfec cg cebfga eadfg fbecda cgbe | bcfaed fbeca gc ebfgac
gd badcg fdbac bfgd eafdgcb gda eacbg bfadce gbdfca gfecda | fcdabe gd bcfad cfeagbd
da bdga beagdfc fcgbda cefbda fgcda fcedbg gcfbd egfca dac | afbgcd da abgcedf badcfe
aec decbfa ecgb faecg bcfeag adcfbeg ec fgaed bdgfca bafgc | gacbef bdcfea gafec fabegc
geafb abdge gfb cfab efgca cedfgb fb feadcg cegdabf fgaebc | efbgac bfg bf fb
bdcf abfcge dacfg gcdab fc fcagedb fcdagb gcf gdaecb gdeaf | fcagd fcg cbfgaed gdacb
egbfcda bfgdec efd acef ef dgace edfagc bgfda agfde dceagb | gaedc dcbgfe degca fcae
cbdeagf gbfad defgbc cbfea dbegfa dacbf cd cbgfad bcd dcag | bdcaf becdgf dafgb bdgfa
edcfa gae bfga cegabd caebgf cbgfe ga fcgdaeb efgdcb facge | efcbdg cabegd bfgec ag
eagfdcb cgab gadbec adc ebdafg edcba ac deabg bfedc dcfega | ac cgba adc edcba
degbc ae dabfgc dcgaf gafdce ega acedgbf bagecf agdec aedf | edcbg gcebaf abgdfc defa
dbgaf gd gdcfae fcabd dgbfcea abefg facgeb dag edfagb egbd | fgbdae gbfdea bgafd fcgbade
cf dcbga gbfeca cedgba cfg edgfbac cbfgd fcda gdbef dbgfac | fgc cgdba cfbega edbcag
fd cgbead fcd befgdc bcdge becdaf cbegfda fcdbg gfde gacfb | cdf fgcba gbced df
cdgafb dgfe cgefb cebfdg bfg cgbde fg acfeb fcdgbea gcebad | dgef cfbeg gf fbg
gebcfa fecdba fcgeabd eg eafdc caegd dacbg cgfade cge fegd | eagcd efgd dabcfe cge
geacd gcbadf abedgc cgfabde fdec aefdg gbfae daf ecgadf df | adgefc adf dfa gedaf
dbea de bfgdcae cdgbf def ceafb ceabgf ecfdag feabdc efbcd | ed gbcfd cedbf cfdbae
dgaef dac bacdfe cefad cd acdbeg cefgba cdbf eabcf fbgaecd | cd eafcd dc acd
bagdec gabec egfc cbfgae dgefab abdcf bfe aefbc ef ecfbgda | dafecbg fbegad fdabc efb
bagfec bfegc aefdgbc dfagcb gef ge dceafg abeg bfdec gfcab | ge dfcabg cabgf adcegf
fbadcg fegad cadeb cg fcgade gacde edgfab aecgfdb cdg cgfe | fdagbe gdeacfb gecf facgde
gcebf edcg fcgdbea feadbc dgfabe cfe gbfde cfagb dbcegf ec | fbegd cef bcdefa faebgd
dacbe gecadf dcefg adf bedgcaf cdfgbe af dgacbf fdeca aegf | agefcd gdaefc dgefbc fcdge
gedfca abgdce bagde fabg efgbd fdgbea gef bcfegda ebdfc gf | fg defabg ebcfd fg
ad gcfea cadeg adc degfbc gdabec cfadgb eabcgdf dbgce ebda | cegaf acd efacbdg gbdcae
dcbgef bdgecfa fgce bgdafe dbefc fed fe gdacbf cdaeb bfgdc | acfdgb fe fcbgd gcfe
fad da dgecf edgbaf adfbgc gfebac adbfgce badc bafgc cagdf | da acfgdb da fdecg
fbdag adefcgb bafdgc ae gbade gcdeb gdebfa eba abegcf afde | aedf defagb cagdbf bae
cfgaeb cbf fc adgbce agbdfc gbcda egfbd gcfbd fdac ecfbgda | fc gcdebfa cdaf adcf
cgabd dgc eadcfbg facgde acbefd bcafg gd ecbgda bgde edbac | dabcg bfagc ebdac ceadb
fbdca cfedba def cgdea fadcgeb ef dbfgac ebfagd cefb defac | dbcaf cbfe efd abgdecf
abfe ea gcafd fcgdbea gae eacgdb gfbce efacg cebgfd ecfgba | cadfg agcebf fabe bfceag
edgc fabgecd fabdc eabgcf deafcg eca gedbfa ce efgad faedc | fcdae debagf bfadc dfcea
dbcef cdbaf cagbde ecadbf aefb gdfec fbdceag acdbgf be deb | dcgfe cabfgd ebaf dcafb
bdaeg gebaf ecdfga gda cbdea ebfgad bacdefg acebfg gd bfdg | aefgb gda bdfg gbecdaf
beg efdgc fbged gfaedbc edfgba bagfd cfegba cdgafb eb bead | deab egbdfac ebfcgda baed
eba fgea becgfda fcbead cbegfa abegc ecgfb dabgc cfbdge ae | afbceg eba feag aeb
dcgbfa degba debfa egcafbd adgcbe eag abcdg fagbec cegd ge | gcde bdeacg dagbe dbfea
egcdba cdaegf abfc dagbf ab cedbfga fdbge cdfga gba abdgfc | fgdeca bag bag afcb
bagdc fbea abfdegc deb acdefg ebdac fecda deafcb ecgfdb eb | fcgead be dfbcge dbeca
abdfe gebcfd gedab adcfgb abf debcf af adbfegc fdacbe face | af fcebd cdabfg baf
fdbega dfg eadcg cfgde bcefd fdeacb fecdbg fg fbgc cbagdfe | cdgef adebcf ebcgfd fegdc
fgadecb fagec fa gcdbef adfc baecg gdbafe afe afegcd dfcge | ecgdaf egbcdaf cabeg edgbcf
fcegba egabf gaedb acgfbde bad bdgf db fdaebg bfdeac cgead | dab agcbfe gcdea caefbd
egbfa fgbc egbafc ecb bcgdfea bagdef cb acdfe gedbac cfabe | bfgc cb afbgec fgcedab
ec fadcbe dcgaf fegab fgeacb egbc eac fcebdga fbdaeg cgefa | abfeg ebfag bagcef aec
baegdf agbcdfe dagce abcg dca daegb dcgbea ac degcf dacfbe | fbeagd adcbge adegc abecfd
ebac bedafc fab cadfe bgfcd debfga ab dcgafe gdfbace bcafd | afgdbce ba ebcfad aebc
cfdabg acfedb edgbf acgf acdgeb fad cbadg adgfb fa eacgfbd | gaefbcd fgac fad agfc
fage ged dgaec bcgad gecadfb decfa badfec dcfbge ge acfdge | dgbca fbcegd bcedfg adegc
fcgdb cebadf cdgab fbecgd bfacedg eabdgf fgec fecdb fgd gf | fcge dabgfe dgbfc ecfg
eafgc cfedab bagdecf bg bcgeda cebdf dbgf geb gbecf bcedgf | gfcae cfbeg egfbc bfgd
adefgb efdgbc fcdbgae gdfbe dafb fgaecd fga gbeca bgeaf fa | dcgfbe edgbf fa ebgaf
afgcb afdce gacfd cfeagd dcg dg gfcbde egda abcfde bagfecd | dbfaceg dfeac cdg gfbac
degf cde febcda cdfga afdgec cebag gdaec cgdbaef gadcbf de | fged abfcde dec cfgad
bdfcae dgaef gfdab bfgdec aecfgdb edfcg ae egfcad aef caeg | gefad fea ae fcaedb
dcbgfa bagcd badce ed gbadcfe aecbf decbgf gbdeac dec aged | bedca gbaced adcbe cdegabf
cgfbed cgb bc gfabd cfgabd gaefcbd egfdba fcba cbdag ecdag | fabc gcaedfb agefdb bc
abcfgd becafgd ecdb ce febga ebafc bfdca fec edfbca facegd | dabegcf dafcgb gaecbfd ebfac
beacf gdbfaec bgfd dba db fagecd dbafeg ebadf ecdbga dfega | gacebd ecgadf bd gdbfae
decg dafebg cfd gfaebcd becdf bedgf begfcd cd gdafcb fbeca | cfdgba dacbgf fabedg bcfea
acbedg bgeac edc bdefa cd ecadb beacfg gacd ebdfcg edcabfg | gbdcfe cd adbec ebgca
gadceb ebfgdc ebcfg efacb fg fgdeabc bcadfg fgde debcg bfg | bfeac facbgde fg dcegbf
edfc cadbg eagfd cge adgec gdcfea ebfagd ec fegcab fedbcga | fced cdfe ec ce
defacgb acgfbd gafd agebcf bdcfg gcbda dcabe gefbdc ag gac | ga gdfa cga ag
cedgbf fgabe dcbfg efgacd ed bdcfga bcde def geacfdb dgbef | fde cdabgf gaefcd ceafdg
ce gcdeaf cdabe fdebcga acgbd fadeb gdfcba dbgcea ecgb cea | ec afebd dfcaeg adebc
bgaced agdce adgcf dfa beafdg fd bgfac faecdg acbegfd decf | edagcb gbfdcea eabdcg adf
fce fbcg geafbc bceaf egfba gcdefa cf afbedg baced dgaebcf | fec aefbc dgaefc cbade
aefg baegfd cfdbag adbge ag bdcea adg cgefdb bafdecg febdg | fage dbace bdgacf cbdfga
bgfeda bface caefg debfac adgcbf acdebfg bdcaf ebcd feb eb | ecdb fcgae bcadfg ecdb
edcabf gebfdc ecdbf ba edafg acbd cfeagb fab bfaed gbacdfe | dcab ba gfaed fab
dafg dcafgbe da acebgd gbefda abefd facgeb eda fedbc egbaf | dae cedbgaf bdgaec fbced
fcae gbcdf edabfcg edf ecdbfa badce abdegc fbdeag ef cefbd | def efd efd feca
ecf cagfb edgfcb gbaedc cgebd cdbfea fe dagecfb gdef fegcb | gfed cdbefa gefd ebgcd
decafgb fed dbgaf cegbd ebfcgd gdecaf cfbe ebdgf fe bagdec | fed agdcbe ebcdg eadfgcb
bfced befagc ca gbdefc cab ecad afbcd abgdf afcebgd fdeabc | fdbag ca bacfd ca
ecadbg adbge fae dfcaegb dfebc gbefca af afgd badfge feabd | fa bdcefag cafebg efbdc
afdge agfdbe agdcf bdgecf cg bdagfce fedgac eacg cbdfa cgf | defga bcafd cg fdgac
bgfcde ecf bdecaf beca fecad adebf dcafg gbeadf decabfg ec | dabef cef adfce cdbeaf
gcabf gbeda febdacg gbdfca fdg gfcdea fd fabgd febcag dbcf | bcfd df dfcb bcdf
dgfae feg cgfbdae debagc gedca feac degcbf fe agfdb cdfeag | egadcb eagdbcf dgecab daebcg
gbfc fdebgca fb cedaf gcebd dcfbeg dfbega bdf edfcb agdbec | fbd cbgf edcbg bfd
gdea dcgbf afbed deafbc fgdaceb daegfb abcfeg ag bgfad agb | edag efgacb bga aegfdb
dagbcf efbda cfbde fcd afdbgec ebcgf eagdbf dc bdcfea adec | dc fcgbaed acfbde dfbce
acfbd efad gafcdb adceb ea aecgbf cgedb abecdgf aec efdacb | bdafc bcfad befcgda ea
gdaebc cbage af afgc bdcafe ebfdg bfa fgeba fagbdec cgefba | ecgbaf egcafb abf gcfa
cbfdae agebf afb geafc edcgfa cfgb ebafcg adgeb ebcfgad bf | efagbc afcdbe bgdea bfadec
beadcgf gdc eadcb bcfga bgacd fcebdg fdga fgacbd gd gfbaec | adcbg agdf cbagf cabdg
gba cdba cbegaf gbdec gefcdb gdfceba gbead ab geafd cgadbe | ba dbca deafg efagd
cfgeab bagedf ceabd dfeabcg aedfbc acged dba db bcdf bceaf | db db dba beacf
de debg dgcef cbdgaf cfbedg bcdgf cfaeg dfe bceafgd acbfde | fcgea cdgefab gfabdc ecfdab
febacg aecb bgfedca bfagde cdgfb fgbce ebg be efcga dcegaf | dgeafb ceba cfeabg cbae
aegbd gdafbc dae gadcb fadgcbe fagedc adbgce ea ceba fgbed | gdfeac cbae ceab dcbfeag
df fgabde gfd ecgda cdgfeb bcdf cefgb cbefga abefgdc gdfec | aedgfb fd fdg dfg
fbade gefab df cgfedb dfb fadg beafcg bcegdfa cbade agefdb | fbead bgfea dafg fdag
ac edfcabg fcgde adc eafdb ceafdb fbac dcafe decgba edbgfa | ca ecbdaf facb ecdbfa
fgb fgebac gbcaf fdaecgb fgae ecafbd cabdg fg fbeca cegdbf | dbaecf bdfcge dgefacb fage
dfea gacdbe ad agfbed dfgba gfebca bgfcd dag geafb dbfeagc | gdafecb debgcfa ecfabdg gafebc
cefgbad efd fgceb beafdc fdaegb gacdfb dafcb befcd ed cdea | befcg ecda ed fcebg
fgcea eb adbcfg cbfgd efbdcag feb fdgecb efdgba dbec bgcef | edbc egafbd feb fbdage
cfbda gfbdaec cfaed bceagf gabd cab dgcfb dgfcba ab fcdbge | cafbge fedac ba gbcdfa
ecdafb cegfd edcgfa efd faeg gcdbe cegfbda ef afgbcd afcdg | adfcg ef aegf fgedc
cagfbe egafdbc cfa aebdgc cdfbag gfda af dbacf bdecf cgabd | gfda bgdefac acbgd acbdf
bfcde egafc afdg cbaged dgecfa cfabge dcg bagefcd dgcef gd | cagef efbcga dcg cedfga
aed gcafebd daefc cgdaef aecgf efbdc abefgc da gdac febgad | agdc eda dagbfec ceagbf
befad cfgaebd dcefab adcfge ec cgbfd beca bdefc gdebfa ced | cabe beac cebfd edfcb
acbd cea deafbc edbaf ecgadf gbfec dbgefa eafcb ac bgedfac | abegdf fgcbe efcab ac
gf fadce fag bcgad bcfg fdcga abdfeg gdfacb degbca fgdbace | cdaegb feacd fbgc eafdcgb
ebgdca fedgab fdcab acdegfb cabdfe fda acbde af bfgcd ecaf | bfgeda deabc bdeca ecadb
fbedcg cf cabdg dgcebaf cfg efcb aegfcd fbdcg fdabeg fegdb | ebcf fc gbfcd cdfbge
def fd fedga ebdcaf fgbd cbgeafd cabdeg edfbga gdeba agfec | cagdbe fbgaecd afgce fde
cefba bafde fbgdec dagb dae gfdeab geafcd ebfgd eabdcfg da | aefbd eda adebgf da`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput1,
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
};
expected = 26;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 367;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: sampleInput1
};
expected = 5353;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput2
};
expected = 61229;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 974512;
test(func, input, expected, testNum, lowestTest, highestTest);