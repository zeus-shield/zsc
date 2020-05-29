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
}

function ethToJson(data) {
  return JSON.stringify(ethToObject(data));
}

function parseJson(data) {
}

function parseEth(data) {
}

function logs(logs) {
  if (!logs) {
    return;
  }

  for (let i = 0; i < logs.length; i++) {
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
