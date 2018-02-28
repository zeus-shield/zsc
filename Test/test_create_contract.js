//
//Copyright (c) 2018 ZSC Dev Team
//

function ContractTestDatabase(solcompiled, contractname, parameter) {
var databin = "0x" + solcompiled.contracts[contractname].bin;
var greeterContract = web3.eth.contract(JSON.parse(solcompiled.contracts[contractname].abi));
var greeter = greeterContract.new(parameter, {from:web3.eth.accounts[0], data: databin, gas: 55000000}, function(e, contract){
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

function ContractTestApis(solcompiled, contractname, parameter) {
  var databin = "0x" + solcompiled.contracts[contractname].bin;
  var greeterContract = web3.eth.contract(JSON.parse(solcompiled.contracts[contractname].abi));
  var greeter = greeterContract.new(parameter, {from:web3.eth.accounts[0], data: databin, gas: 905000000}, function(e, contract){
    if(!e) {
      if(!contract.address) {
        console.log("ContractTestApis send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      } else {
        console.log("ContractTestApis mined! Address: " + contract.address);
        console.log(contract);
      }
    } else {
      console.log("ContractTestApis: Error!!");
      console.log(e);
    }})
  return greeter;
}

function ContractTestTemplate(solcompiled, contractname, parameter) {
  var databin = "0x" + solcompiled.contracts[contractname].bin;
  var greeterContract = web3.eth.contract(JSON.parse(solcompiled.contracts[contractname].abi));
  var greeter = greeterContract.new(parameter, {from:web3.eth.accounts[0], data: databin, gas: 905000000}, function(e, contract){
    if(!e) {
      if(!contract.address) {
        console.log("ContractTestTemplate send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      } else {
        console.log("ContractTestTemplate mined! Address: " + contract.address);
        console.log(contract);
      }
    } else {
      console.log("ContractTestTemplate: Error!!");
      console.log(e);
    }})
  return greeter;
}


function ContractAppController(solcompiled, contractname, parameter) {
var databin = "0x" + solcompiled.contracts[contractname].bin;
var greeterContract = web3.eth.contract(JSON.parse(solcompiled.contracts[contractname].abi));
var greeter = greeterContract.new(parameter, {from:web3.eth.accounts[0], data: databin, gas: 991000000}, function(e, contract){
 if(!e) {
    if(!contract.address) {
      console.log("ContractAppController send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
    } else {
      console.log("ContractAppController mined! Address: " + contract.address);
      console.log(contract);
    }
  } else {
    console.log("ContractAppController: Error!!");
    console.log(e);
  }
})
return greeter;
}



