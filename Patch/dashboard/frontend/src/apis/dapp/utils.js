'use strict';

const Web3 = require('web3');
// const BigNumber = require('bignumber.js');

const HEX_PREFIX = '0x';

function jsonToEthObject(data) {
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
}

function strToBytes32(str) {
  return Web3.utils.rightPad(Web3.utils.stringToHex(str), 64);
}

function strToHex(str) {
}

function hexToStr(hex) {
}