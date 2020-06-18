'use strict';

const Web3 = require('web3');
// const BigNumber = require('bignumber.js');

const HEX_PREFIX = '0x';

function jsonToEthObject(data) {
  let parsedData;
  try {
    parsedData = parseJson(data);
  } catch (e) {
    throw new Error('JS data is not valid: ' + e.message);
  }

  return Object.keys(parsedData).reduce((ethData, key) => {
    ethData.keys.push(Web3.utils.rightPad(Web3.utils.stringToHex(key), 64));
    ethData.offsets.push((ethData.values.length - HEX_PREFIX.length) / 2);
    ethData.values += Web3.utils.stringToHex(parsedData[key]).slice(2);
    return ethData;
  }, {
    keys: [],
    values: HEX_PREFIX,
    offsets: []
  });
}

function jsonToEth(data) {
  return Object.values(jsonToEthObject(data));
}

function ethToObject(data) {
  let keys, values, offsets;
  try {
    ({keys, values, offsets} = parseEth(data));
  } catch (e) {
    throw new Error('Ethereum data is not valid: ' + e.message);
  }

  return keys.reduce((resultJS, key, index) => {
    const startValue = offsets[index] * 2;
    const endValue = index !== offsets.length - 1 ? offsets[index + 1] * 2 : values.length;
    const value = values.slice(startValue, endValue);
    resultJS[key] = Web3.utils.hexToString(HEX_PREFIX + value);
    return resultJS;
  }, {});
}

function ethToJson(data) {
  return JSON.stringify(ethToObject(data));
}

function parseJson(data) {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    throw new Error(`JSON data parse error: ${e.message}`);
  }
  if (!Object.keys(parsedData).every(key => typeof parsedData[key] === 'string' &&
    parsedData[key].trim() !== '' && key.length)) {
    throw new Error('JS data key values are not strings or at least one of key values has zero length after trim');
  }
  return parsedData;
}

function parseEth(data) {
  const keys = data[0];
  const values = data[1];
  const offsets = data[2];
  if (!(keys instanceof Array)) throw new Error('keys is not instanceof Array');
  if (values !== null && typeof values !== 'string') throw new Error('values is not null and is not topeof string');
  if (typeof values === 'string' && values.indexOf(HEX_PREFIX) === -1) throw new Error('Values is not hex prefixed');
  if (!(offsets instanceof Array)) throw new Error('offsets is not instanceof Array');
  if (offsets.length !== keys.length) throw new Error('keys and offsets lengths are not equal');

  return {
    keys: keys.map(key => Web3.utils.hexToString(key)),
  };
}

function logs(logs) {
  if (!logs) {
    return;
  }

  for (let i = 0; i < logs.length; i++) {
    let message = '';
    console.log('==================================== logs%d ====================================', i);
    // console.log("data(hex):  %s", logs[i].data);
    // console.log("data(uint): %s", parseInt(logs[i].data));
    // console.log("data(str):  %s", Web3.utils.hexToString(logs[i].data));
    message += Web3.utils.hexToString(logs[i].data);
    for (let j = 0; j < logs[i].topics.length; j++) {
      // console.log("topics[%d](hex):  %s", j, logs[i].topics[j]);
      // console.log("topics[%d](uint): %s", j, parseInt(logs[i].topics[j]));
      // console.log("topics[%d](str):  %s", j, Web3.utils.hexToString(logs[i].topics[j]));
      if (j > 0) {
        message += ', ';
      }

      if (logs[i].topics[j].slice(0, 34) === '0x00000000000000000000000000000000') {
        message += '(int)' + Web3.utils.hexToNumberString(logs[i].topics[j]);
      } else {
        message += '(str)' + Web3.utils.hexToString(logs[i].topics[j]);
      }
    }
    console.log(message);
  }
  return;
}

function toBytes32(value) {
  return Web3.utils.rightPad(value, 64);
}

function strToBytes32(str) {
  return Web3.utils.rightPad(Web3.utils.stringToHex(str), 64);
}

function strToHex(str) {
  return Web3.utils.stringToHex(str);
}

function hexToStr(hex) {
  return Web3.utils.hexToString(hex);
}

function bigNumberToNumber(value) {
  return Web3.utils.isBigNumber(value) ? value.toNumber() : value;
}

module.exports = { jsonToEth, jsonToEthObject, ethToJson, ethToObject, parseJson, parseEth, logs, toBytes32, strToBytes32, strToHex, hexToStr, bigNumberToNumber };
