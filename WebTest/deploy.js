
export default class Deploy {
    constructor() {
    }

    do(byteCode, abi, parameter) {
        console.log('Deploy.do()');
        const Web3 = require('web3');
        let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
}