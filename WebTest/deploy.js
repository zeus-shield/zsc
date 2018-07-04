
import Contract from './contract.js';

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
                let output = document.getElementById(window.outputElement);
                let contract;
                output.style.fontSize = 'small';//10 +'pt';
                if(!contractInstance.address) {
                    console.log("transactionHash: " + contractInstance.transactionHash);
                    transactionHash = contractInstance.transactionHash;
                    output.innerHTML = `[TransactionHash]:${transactionHash}`;
                } else {
                    console.log("contractAddress: " + contractInstance.address);
                    //console.log(contractInstance);
                    //console.assert(contractInstance.address == contractInstanceReturned.address, "address failed");
                    if(contractInstance.address != contractInstanceReturned.address) {
                        alert("Address Failed!");

                    } else {
                        transactionHash = contractInstance.transactionHash;
                        contractAddress = contractInstance.address;
                        output.innerHTML = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;

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
                console.log(error);
                output.innerHTML = error;
            }
        })
      
        return contractInstanceReturned;
    }
}