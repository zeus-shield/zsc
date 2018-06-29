const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function Tool() {};

Tool.prototype.DeployContract = function() {
  console.log("DeployContract");
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = new Tool();
} else {
  if (typeof define === 'functon' && define.amd) {
    define([], function() {return Tool;});
  } else {
    window.Tool = new Tool;
  }
}