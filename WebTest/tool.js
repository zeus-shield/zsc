const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function Tool() {};

Tool.prototype.DeployContract = function() {
    console.log("Tool.DeployContract()");
}

// Node.js and other environments that support module.exports.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Tool();
} else {
    // AMD.
    if (typeof define === 'functon' && define.amd) {
        define([], function() {return Tool;});
    // Browser.
    } else {
        window.Tool = Tool;
    }
}