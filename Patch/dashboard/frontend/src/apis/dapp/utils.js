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

module.exports = { jsonToEth, jsonToEthObject, ethToJson, ethToObject, parseJson, parseEth, logs, strToBytes32, strToHex, hexToStr };
