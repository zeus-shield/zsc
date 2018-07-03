
export default class Deploy {
    constructor() {
    }

    do(byteCode, abi, parameter) {
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
                if(!contractInstance.address) {
                    console.log("transactionHash: " + contractInstance.transactionHash);
                    var transactionHash = contractInstance.transactionHash;
                    let element = document.getElementById('output');
                    element.style.fontSize = 'small';//10 +'pt';
                    element.innerHTML = `[TransactionHash]:${transactionHash}`;
                } else {
                    console.log("contractAddress: " + contractInstance.address);
                    //console.log(contractInstance);
                    //console.assert(contractInstance.address == contractInstanceReturned.address, "address failed");
                    if(contractInstance.address != contractInstanceReturned.address) {
                        alert("Address Failed!");

                    } else {
                        var transactionHash = contractInstance.transactionHash;
                        var contractAddress = contractInstance.address;
                        let element = document.getElementById('output');
                        element.style.fontSize = 'small';//10 +'pt';
                        element.innerHTML = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;
                    }

                }
            } else {
                //console.log("DeployContract: Error!!");
                console.log(error);
            }
        })
      
        return contractInstanceReturned;
    }
}