//
//Copyright (c) 2018 ZSC Dev Team
//

function ContractTestDatabase(accountPass, solcompiled, contractname, parameter) {
personal.unlockAccount(eth.accounts[0], accountPass);

var databin = "0x" + solcompiled.contracts[contractname].bin;
var greeterContract = web3.eth.contract(JSON.parse(solcompiled.contracts[contractname].abi));
var greeter = greeterContract.new(parameter, {from:web3.eth.accounts[index], data: databin, gas: 2500000}, function(e, contract){
 if(!e) {
    if(!contract.address) {
      console.log("ContractTestDatabase send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
    } else {
      console.log("ContractTestDatabase mined! Address: " + contract.address);
      console.log(contract);
    }
  } else {
    console.log("ContractTestDatabase: Error!!");
    console.log(e);
  }
})
return greeter;
}




