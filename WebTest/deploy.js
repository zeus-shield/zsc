
import Contract from './contract.js';
import Output from './output.js';

//private member

export default class Deploy {
    constructor() {
    }

    do(module, byteCode, abi, parameter) {
        console.log('Deploy.do()');
        const Web3 = require('web3');
        let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

        let contractObject = web3.eth.contract(abi);
        //let contractInstanceReturned = contractObject.new(parameter, {
        //  from:web3.eth.accounts[0],
        //  data: byteCode,
        //  gasPrice: '60000000000',
        //  gas: 9050000}, function(e, contract) {

        let contractInstanceReturned = contractObject.new(parameter, {
            from:web3.eth.accounts[0],
            data: byteCode, gas: 4700000}, function(error, contractInstance) {
            if(!error) {
                let transactionHash = '';
                let contractAddress = '';
                let string = '';
                let contract;
                if(!contractInstance.address) {
                    console.log("transactionHash: " + contractInstance.transactionHash);
                    transactionHash = contractInstance.transactionHash;
                    string = `[TransactionHash]:${transactionHash}`;
                    Output(window.outputElement, 'small', 'red', string);
                } else {
                    console.log("contractAddress: " + contractInstance.address);
                    //console.log(contractInstance);
                    //console.assert(contractInstance.address == contractInstanceReturned.address, "address failed");
                    if(contractInstance.address != contractInstanceReturned.address) {
                        Output(window.outputElement, 'small', 'red', 'Address Failed!');
                    } else {
                        transactionHash = contractInstance.transactionHash;
                        contractAddress = contractInstance.address;
                        string = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;
                        Output(window.outputElement, 'small', 'red', string);
                        if('undefined' == typeof window.contractClass) {
                            contract = new Contract();
                            window.contractClass = contract;
                        } else {
                            contract = window.contractClass;
                        }
                        contract.add(module, contractAddress);
                    }
                }
            } else {
                //console.log("DeployContract: Error!!");
                Output(window.outputElement, 'small', 'red', error);
            }
        })
      
        return contractInstanceReturned;
    }
}