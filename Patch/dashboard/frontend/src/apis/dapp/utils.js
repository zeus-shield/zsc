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
