/*
Copyright (c) 2017 ZSC Dev
2018-02-08: v0.01
*/

function MyToken(abi, address) {
    var mytoken = eth.contract(abi).at(address);
    return mytoken
}


function FromWei(value) {
  return value / 1000000000000000000;
}

function RegistrarConfigure(registrarCheck, enS, pubResolver, ensName, index, pass) {
    _testRegistrar = registrarCheck;
    _ens = enS;
    _publicResolver = pubResolver;
    _ensName = ensName;
    _index = index;
    _pass = pass;
}

function RegistrarCheckName() {
    return new Date(_testRegistrar.expiryTimes(web3.sha3(_ensName)).toNumber() * 1000)
}

function RegistrarNameOwer() {
    var fullname = _ensName + '.test'
    return _ens.owner(namehash(fullname))
}


function RegistrarRegist() {
    personal.unlockAccount(eth.accounts[_index], _pass);
    return _testRegistrar.register(web3.sha3(_ensName), eth.accounts[_index], {from: eth.accounts[_index], gas:500000})
}

function RegistrarSetSolver() {
    var fullname = _ensName + '.test'
    personal.unlockAccount(eth.accounts[_index], _pass);
    return _ens.setResolver(namehash(fullname), _publicResolver.address, {from: eth.accounts[_index], gas:500000});
}

function RegistrarSetAddress(adr) {
    var fullname = _ensName + '.test'
    personal.unlockAccount(eth.accounts[_index], _pass);
    return _publicResolver.setAddr(namehash(fullname), adr, {from: eth.accounts[_index], gas:500000});
}


function AccountShowAll() {
    var i =0
    eth.accounts.forEach( function(e){
        console.log(" eth.accounts["+i+"]: " + e + " \tbalance: " + web3.fromWei(eth.getBalance(e), "ether") + " ether");
        i++;
    })
}

function AccountBalance(addr) {
    console.log(addr + ": " + " \tbalance: " + web3.fromWei(eth.getBalance(addr), "ether") + " ether");
}

function AccountUnlock(index, pass) {
    personal.unlockAccount(eth.accounts[index], pass)
}

function AccountAdd(pass) {
    personal.newAccount(pass);
}


function AccountMineNumer() {
    return eth.getBalance(eth.coinbase).toNumber();
}

function MineDoneBlocks(lastn, addr) {
    addrs = [];
    if (!addr) {
        addr = eth.coinbase
    }

    limit = eth.blockNumber - lastn
    for (i = eth.blockNumber; i >= limit; i--) {
        if (eth.getBlock(i).miner == addr) {
          addrs.push(i)
    }
  }
  return addrs
}

function MineSetBase(index) {
    return miner.setEtherbase(eth.accounts[index])
}


function MineTime() {
    etm = eth.getBlock("latest").difficulty/eth.hashrate; // estimated time in seconds
    return Math.floor(etm / 3600.) + "h " + Math.floor((etm % 3600)/60) + "m " + Math.floor(etm % 60) + "s";
}


function TransactionSendByAddress(pass, sender, recver, eth_num) {
    var amount = web3.toWei(eth_num, "ether");
    personal.unlockAccount(sender, pass);
    eth.sendTransaction({from:sender, to:recver, value: amount, gas:80000});
}

function TransactionSend(pass, sender_index, recve_index, eth_num) {
    var sender = eth.accounts[sender_index];
    var receiver = eth.accounts[recve_index];
    var amount = web3.toWei(eth_num, "ether");
    personal.unlockAccount(sender, pass);
    eth.sendTransaction({from:sender, to:receiver, value: amount, gas:80000});
}


function TransactionCheck() {
    if (eth.pendingTransactions.length > 0) {
        if (eth.mining) return;
        console.log("== Pending transactions! Mining...");
        miner.start(1);
    } else {
        miner.stop();
        console.log("== No transactions! Mining stopped.");
    }
}


function peerGet() {
    return admin.peers.forEach( function(e) {
        console.log("admin.addPeer('enode://" + 
        e.id + "@" + 
        e.network.remoteAddress.subbytes32(0, e.network.remoteAddress.indexOf(':')) + 
        ":30303');");
    }) 
}

