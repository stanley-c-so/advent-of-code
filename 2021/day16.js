/*

--- Day 16: Packet Decoder ---

As you leave the cave and reach open waters, you receive a transmission from the Elves back on the ship.

The transmission was sent using the Buoyancy Interchange Transmission System (BITS), a method of packing numeric expressions into a binary sequence. Your submarine's computer has saved the transmission in hexadecimal (your puzzle input).

The first step of decoding the message is to convert the hexadecimal representation into binary. Each character of hexadecimal corresponds to four bits of binary data:

0 = 0000
1 = 0001
2 = 0010
3 = 0011
4 = 0100
5 = 0101
6 = 0110
7 = 0111
8 = 1000
9 = 1001
A = 1010
B = 1011
C = 1100
D = 1101
E = 1110
F = 1111

The BITS transmission contains a single packet at its outermost layer which itself contains many other packets. The hexadecimal representation of this packet might encode a few extra 0 bits at the end; these are not part of the transmission and should be ignored.

Every packet begins with a standard header: the first three bits encode the packet version, and the next three bits encode the packet type ID. These two values are numbers; all numbers encoded in any packet are represented as binary with the most significant bit first. For example, a version encoded as the binary sequence 100 represents the number 4.

Packets with type ID 4 represent a literal value. Literal value packets encode a single binary number. To do this, the binary number is padded with leading zeroes until its length is a multiple of four bits, and then it is broken into groups of four bits. Each group is prefixed by a 1 bit except the last group, which is prefixed by a 0 bit. These groups of five bits immediately follow the packet header. For example, the hexadecimal string D2FE28 becomes:

110100101111111000101000
VVVTTTAAAAABBBBBCCCCC

Below each bit is a label indicating its purpose:

The three bits labeled V (110) are the packet version, 6.
The three bits labeled T (100) are the packet type ID, 4, which means the packet is a literal value.
The five bits labeled A (10111) start with a 1 (not the last group, keep reading) and contain the first four bits of the number, 0111.
The five bits labeled B (11110) start with a 1 (not the last group, keep reading) and contain four more bits of the number, 1110.
The five bits labeled C (00101) start with a 0 (last group, end of packet) and contain the last four bits of the number, 0101.
The three unlabeled 0 bits at the end are extra due to the hexadecimal representation and should be ignored.

So, this packet represents a literal value with binary representation 011111100101, which is 2021 in decimal.

Every other type of packet (any packet with a type ID other than 4) represent an operator that performs some calculation on one or more sub-packets contained within. Right now, the specific operations aren't important; focus on parsing the hierarchy of sub-packets.

An operator packet contains one or more packets. To indicate which subsequent binary data represents its sub-packets, an operator packet can use one of two modes indicated by the bit immediately after the packet header; this is called the length type ID:

If the length type ID is 0, then the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
If the length type ID is 1, then the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.

Finally, after the length type ID bit and the 15-bit or 11-bit field, the sub-packets appear.

For example, here is an operator packet (hexadecimal string 38006F45291200) with length type ID 0 that contains two sub-packets:

00111000000000000110111101000101001010010001001000000000
VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB

The three bits labeled V (001) are the packet version, 1.
The three bits labeled T (110) are the packet type ID, 6, which means the packet is an operator.
The bit labeled I (0) is the length type ID, which indicates that the length is a 15-bit number representing the number of bits in the sub-packets.
The 15 bits labeled L (000000000011011) contain the length of the sub-packets in bits, 27.
The 11 bits labeled A contain the first sub-packet, a literal value representing the number 10.
The 16 bits labeled B contain the second sub-packet, a literal value representing the number 20.

After reading 11 and 16 bits of sub-packet data, the total length indicated in L (27) is reached, and so parsing of this packet stops.

As another example, here is an operator packet (hexadecimal string EE00D40C823060) with length type ID 1 that contains three sub-packets:

11101110000000001101010000001100100000100011000001100000
VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC

The three bits labeled V (111) are the packet version, 7.
The three bits labeled T (011) are the packet type ID, 3, which means the packet is an operator.
The bit labeled I (1) is the length type ID, which indicates that the length is a 11-bit number representing the number of sub-packets.
The 11 bits labeled L (00000000011) contain the number of sub-packets, 3.
The 11 bits labeled A contain the first sub-packet, a literal value representing the number 1.
The 11 bits labeled B contain the second sub-packet, a literal value representing the number 2.
The 11 bits labeled C contain the third sub-packet, a literal value representing the number 3.

After reading 3 complete sub-packets, the number of sub-packets indicated in L (3) is reached, and so parsing of this packet stops.

For now, parse the hierarchy of the packets throughout the transmission and add up all of the version numbers.

Here are a few more examples of hexadecimal-encoded transmissions:

8A004A801A8002F478 represents an operator packet (version 4) which contains an operator packet (version 1) which contains an operator packet (version 5) which contains a literal value (version 6); this packet has a version sum of 16.
620080001611562C8802118E34 represents an operator packet (version 3) which contains two sub-packets; each sub-packet is an operator packet that contains two literal values. This packet has a version sum of 12.
C0015000016115A2E0802F182340 has the same structure as the previous example, but the outermost packet uses a different length type ID. This packet has a version sum of 23.
A0016C880162017C3686B18A3D4780 is an operator packet that contains an operator packet that contains an operator packet that contains five literal values; it has a version sum of 31.

Decode the structure of your hexadecimal-encoded BITS transmission; what do you get if you add up the version numbers in all packets?


--- Part Two ---

Now that you have the structure of your transmission decoded, you can calculate the value of the expression it represents.

Literal values (type ID 4) represent a single number as described above. The remaining type IDs are more interesting:

Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Using these rules, you can now work out the value of the outermost packet in your BITS transmission.

For example:

C200B40A82 finds the sum of 1 and 2, resulting in the value 3.
04005AC33890 finds the product of 6 and 9, resulting in the value 54.
880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.
CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.
D8005AC2A8F0 produces 1, because 5 is less than 15.
F600BC2D8F produces 0, because 5 is not greater than 15.
9C005AC2F8F0 produces 0, because 5 is not equal to 15.
9C0141080250320F1802104A08 produces 1, because 1 + 3 = 2 * 2.

What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?

*/

function packetDecoder (part, inputStr) {

  // PARSE DATA: CONVERT HEXADECIMAL INPUT INTO BINARY
  function convertHexToBinary(str) {
    let output = '';
    for (const hexDigit of str) {
      output += parseInt(hexDigit, 16).toString(2).padStart(4, '0');                                                    // convert from hex to decimal, then to binary; must be length 4
    }
    return output;
  }
  const inputBinary = convertHexToBinary(inputStr);                                                                     // this is the string that the rest of the function references!!!

  // UTILITY FUNCTION
  const convertBinaryToDecimal = binaryStr => parseInt(binaryStr, 2);

  // RECURSIVE HELPER FUNCTION: GIVEN A STARTING INDEX OF inputBinary, DECODE THIS PACKET (AND FOR RECURSIVE CALLS, RETURN NEW INDEX FROM WHICH TO CONTINUE PARSING inputBinary)
  function decodePacketAndGetNewIdx(startIdx) {                                                                         // returns (1) packet (version, type, subpackets, value), and (2) newIdx

    // INIT
    const version = convertBinaryToDecimal(inputBinary.slice(startIdx, startIdx + 3));                                  // version number is always the first 3 digits from startIdx
    const type = convertBinaryToDecimal(inputBinary.slice(startIdx + 3, startIdx + 6));                                 // type number is always the next 3 digits after that
    const subpackets = [];                                                                                              // store an array of subpackets, if any
    let literalValue = null;                                                                                            // null, unless this packet is type 4
    let currentIdx;                                                                                                     // track current index of inputBinary

    // PARSE STRING DEPENDING ON WHETHER IT IS LITERAL OR OPERATOR TYPE
    if (type === 4) {                                                                                                   // LITERAL TYPE

      let binaryRepresentation = '';
      currentIdx = startIdx + 6;                                                                                        // parsing begins immediately after type
      while (inputBinary[currentIdx] !== '0') {                                                                         // there is an unknown number of chunks of 5 digits starting with '1'
        binaryRepresentation += inputBinary.slice(currentIdx + 1, currentIdx + 5);
        currentIdx += 5;                                                                                                // always advance currentIdx by 5, after this chunk
      }
      binaryRepresentation += inputBinary.slice(currentIdx + 1, currentIdx + 5);                                        // finally, there is a chunk of 5 digits starting with '0'
      literalValue = convertBinaryToDecimal(binaryRepresentation);                                                      // convert binaryRepresentation into decimal and save as literalValue
      currentIdx += 5;                                                                                                  // advance currentIdx by 5, after the final chunk

    } else {                                                                                                            // OPERATOR TYPE

      const lengthType = inputBinary[startIdx + 6];                                                                     // first, get length type (0 or 1) from the 7th digit

      // PARSE STRING DEPENDING ON WHETHER THE LENGTH TYPE IS '0' OR '1'
      if (lengthType === '0') {

        const lengthOfSubpackets = convertBinaryToDecimal(inputBinary.slice(startIdx + 7, startIdx + 7 + 15));          // next 15 digits give TOTAL LENGTH of subpackets data
        currentIdx = startIdx + 7 + 15;                                                                                 // parsing begins after the chunk of 15 digits
        while (currentIdx < startIdx + 7 + 15 + lengthOfSubpackets) {                                                   // while currentIdx is within that range of subpackets data...
          const { packet, newIdx } = decodePacketAndGetNewIdx(currentIdx);                                              // ...recurse to get the subpacket and new index...
          subpackets.push(packet);                                                                                      // ...push the subpacket into the array...
          currentIdx = newIdx;                                                                                          // ...advance currentIdx to the new index
        }

      } else {

        const numOfSubpackets = convertBinaryToDecimal(inputBinary.slice(startIdx + 7, startIdx + 7 + 11));             // next 11 digits give the NUMBER OF SUBPACKETS
        currentIdx = startIdx + 7 + 11;                                                                                 // parsing begins after the chunk of 11 digits
        for (let k = 0; k < numOfSubpackets; ++k) {                                                                     // for each of the subpackets...
          const { packet, newIdx } = decodePacketAndGetNewIdx(currentIdx);                                              // ...recurse to get the subpacket and new index...
          subpackets.push(packet);                                                                                      // ...push the subpacket into the array...
          currentIdx = newIdx;                                                                                          // ...advance currentIdx to the new index
        }

      }

    }

    // FINALLY...
    return { packet: { version, type, subpackets, literalValue }, newIdx: currentIdx };                                 // return (1) packet, and (2) newIdx (if this is a recursive call)
  }

  // MAIN FUNCTION
  const packet = decodePacketAndGetNewIdx(0).packet;                                                                    // kick-start the recursion and decode this packet

  if (part === 1) {                                                                                                     // PART 1: iterate through packet hierarchy and aggregate version nums

    function getSumOfVersionNums(packet) {
      return packet.version + packet.subpackets.reduce((sum, subpacket) => sum + getSumOfVersionNums(subpacket), 0);
    }

    return getSumOfVersionNums(packet);

  } else {                                                                                                              // PART 2: calculate the value of the packet based on its type

    function getValueOfPacket(packet) {
      switch (packet.type) {
        case 0:                                                                                                         // SUM operator (aggregate, or literal value if just 1)
          if (!packet.subpackets.length) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE ANY SUBPACKETS`;
          }
          return packet.subpackets.reduce((sum, subpacket) => sum + getValueOfPacket(subpacket), 0);
        case 1:                                                                                                         // PRODUCT operator (aggregate, or literal value if just 1)
          if (!packet.subpackets.length) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE ANY SUBPACKETS`;
          }
          return packet.subpackets.reduce((product, subpacket) => product * getValueOfPacket(subpacket), 1);
        case 2:                                                                                                         // MINIMUM operator (minimum of all subpackets)
          if (!packet.subpackets.length) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE ANY SUBPACKETS`;
          }
          return packet.subpackets.reduce((min, subpacket) => Math.min(min, getValueOfPacket(subpacket)), Infinity);
        case 3:                                                                                                         // MAXIMUM operator (maximum of all subpackets)
          if (!packet.subpackets.length) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE ANY SUBPACKETS`;
          }
          return packet.subpackets.reduce((max, subpacket) => Math.max(max, getValueOfPacket(subpacket)), -Infinity);
        case 4:                                                                                                         // LITERAL type
          return packet.literalValue;
        case 5:                                                                                                         // GREATER THAN operator (1 or 0)
          if (packet.subpackets.length !== 2) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE EXACTLY 2 SUBPACKETS`;
          }
          return +(getValueOfPacket(packet.subpackets[0]) > getValueOfPacket(packet.subpackets[1]));
        case 6:                                                                                                         // LESS THAN operator (1 or 0)
          if (packet.subpackets.length !== 2) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE EXACTLY 2 SUBPACKETS`;
          }
          return +(getValueOfPacket(packet.subpackets[0]) < getValueOfPacket(packet.subpackets[1]));
        case 7:                                                                                                         // EQUAL TO operator (1 or 0)
          if (packet.subpackets.length !== 2) {
            throw `YOU SCREWED UP: TYPE ID ${packet.type} DOES NOT HAVE EXACTLY 2 SUBPACKETS`;
          }
          return +(getValueOfPacket(packet.subpackets[0]) === getValueOfPacket(packet.subpackets[1]));
      }
    }

    return getValueOfPacket(packet);

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = packetDecoder;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput1 = `D2FE28`;

const sampleInput2 = `38006F45291200`;

const sampleInput3 = `8A004A801A8002F478`;

const sampleInput4 = `620080001611562C8802118E34`;

const sampleInput5 = `C0015000016115A2E0802F182340`;

const sampleInput6 = `A0016C880162017C3686B18A3D4780`;

const actualInput = `A059141803C0008447E897180401F82F1E60D80021D11A3DC3F300470015786935BED80A5DB5002F69B4298A60FE73BE41968F48080328D00427BCD339CC7F431253838CCEFF4A943803D251B924EC283F16D400C9CDB3180213D2D542EC01092D77381A98DA89801D241705C80180960E93469801400F0A6CEA7617318732B08C67DA48C27551C00F972830052800B08550A277416401A5C913D0043D2CD125AC4B1DB50E0802059552912E9676931530046C0141007E3D4698E20008744D89509677DBF5759F38CDC594401093FC67BACDCE66B3C87380553E7127B88ECACAD96D98F8AC9E570C015C00B8E4E33AD33632938CEB4CD8C67890C01083B800E5CBDAB2BDDF65814C01299D7E34842E85801224D52DF9824D52DF981C4630047401400042E144698B2200C4328731CA6F9CBCA5FBB798021259B7B3BBC912803879CD67F6F5F78BB9CD6A77D42F1223005B8037600042E25C158FE0008747E8F50B276116C9A2730046801F29BC854A6BF4C65F64EB58DF77C018009D640086C318870A0C01D88105A0B9803310E2045C8CF3F4E7D7880484D0040001098B51DA0980021F17A3047899585004E79CE4ABD503005E610271ED4018899234B64F64588C0129EEDFD2EFBA75E0084CC659AF3457317069A509B97FB3531003254D080557A00CC8401F8791DA13080391EA39C739EFEE5394920C01098C735D51B004A7A92F6A0953D497B504F200F2BC01792FE9D64BFA739584774847CE26006A801AC05DE180184053E280104049D10111CA006300E962005A801E2007B80182007200792E00420051E400EF980192DC8471E259245100967FF7E6F2CF25DBFA8593108D342939595454802D79550C0068A72F0DC52A7D68003E99C863D5BC7A411EA37C229A86EBBC0CB802B331FDBED13BAB92080310265296AFA1EDE8AA64A0C02C9D49966195609C0594223005B80152977996D69EE7BD9CE4C1803978A7392ACE71DA448914C527FFE140`;

const sampleInput7 = `C200B40A82`;
const sampleInput8 = `04005AC33890`;
const sampleInput9 = `880086C3E88112`;
const sampleInput10 = `CE00C43D881120`;
const sampleInput11 = `D8005AC2A8F0`;
const sampleInput12 = `F600BC2D8F`;
const sampleInput13 = `9C005AC2F8F0`;
const sampleInput14 = `9C0141080250320F1802104A08`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput1,
};
expected = 6;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
};
expected = 9;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
};
expected = 16;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
};
expected = 12;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
};
expected = 23;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
};
expected = 31;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 860;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput7,
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInput8,
};
expected = 54;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput9,
};
expected = 7;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput10,
};
expected = 9;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInput11,
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: sampleInput12,
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 14
input = {
  part: 2,
  inputStr: sampleInput13,
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 15
input = {
  part: 2,
  inputStr: sampleInput14,
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 16
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 470949537659;
test(func, input, expected, testNum, lowestTest, highestTest);