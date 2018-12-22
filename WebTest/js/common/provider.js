/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Channel from './channel.js';
import Output from './output.js';

function getAccount(tryTimes, timeout, func) {
    let account = web3.eth.coinbase;
    let tag = true;

    if ("null" == account || null == account) {
        tag = false;
    } 

    tryTimes ++;
    if(tag){
        func(account);
    } else {
        setTimeout(function(){
            let status = "Try to get account again!";
            let string = `[Status]:${status}</br>[Try]:${tryTimes}(times)`;
            Output(window.outputProviderElement, 'small', 'red', string);
            getAccount(tryTimes, timeout, func);
        }, timeout);
    }
}

export default function provider(injected) {
    let Web3 = require('web3');
    let provider;

    // Open MetaMask and Ganache( or Geth) at the same time.
    if(typeof web3 !== 'undefined' 
        && typeof window.injectedWeb3 == 'undefined'
        && web3.currentProvider) {
        window.injectedWeb3 = web3.currentProvider;
    }

    if(true == injected) {
        if(window.injectedWeb3) {
            provider = window.injectedWeb3;
        } else {
            Output(window.outputProviderElement, 'small', 'red', `Injected Web3 do not exist!`);
            return;
        }
    } else {
        if(window.localhostWeb3) {
            provider = window.localhostWeb3;
        } else {
            provider = new Web3.providers.HttpProvider("http://localhost:8545");
            window.localhostWeb3 = provider;
        }
    }

    web3 = new Web3(provider);
    //web3.setProvider(provider);

    getAccount(0, 1000, function(account) {
        let type = (injected)?'injected':'localhost';
        let channel;

        if(!web3.isConnected()) {
            Output(window.outputProviderElement, 'small', 'red', `Web3(${type}, ${account}) do not connected!`);
        } else {
            Output(window.outputProviderElement, 'small', 'red', `Web3(${type}, ${account}) connected!`);
        }

        web3.eth.defaultAccount = web3.eth.coinbase;

        // import channel
        if('undefined' === typeof window.channelClass) {
            channel = new Channel();
            window.channelClass = channel;
        } else {
            channel = window.channelClass;
        }

        channel.clear();

        if (web3.currentProvider.isMetaMask) {
            channel.set(web3.eth.accounts[0], "0x68bd023921c785ed112fafb2cdf6437609e80456805a68bc125bdb5b9bb7d4e1");
            channel.set("0xf31cbe0ba29c559297505cddcfee15573625bd26", "0xbf0dda742ed1d2c154f00615727bc9c82ccb95d8d5ab8832c849dde0f83517b3");
            // channel.set("0x6A76fb522F948CfB7d6d929408D6aD5876E7139F", "0x805fd8b8d4aeee085b220b44caa5a73af77aa23fbebfc1a7e09d2150887c6e21");
        } else {
            // geth
            if ("http://localhost:8545" === web3.currentProvider.host) {
                channel.set(web3.eth.accounts[0], "0x748443675b8cc68e225d4d7f266d2e57a7157e28b55b7cf66409f76a02bd49ca");
                // channel.set(web3.eth.accounts[1], "0xbd435949a06911c2469d9eecafbbe4b4369d9a3d4b32e548082693fea122ad6e");
                // channel.set(web3.eth.accounts[2], "0xc5e2bad43d6fa36b5a300a297ff159aca19b43578e03c1bc49b097f628dd0c34");
                // channel.set(web3.eth.accounts[3], "0xf190443041cb11441b397d4c2053aa25e5080d65723f6e2ea42756e73324a77e");
            } else {
                // ganache
                channel.set(web3.eth.accounts[0], "0x549eda549a75bc75cab5bb9ad34c0d8dd6a81ab415978cbeac11777db546219c");
                channel.set(web3.eth.accounts[1], "0x7b8afaa612588030d01ba30767bda19cee74e2f697c441dcb5b10d236100e75c");
            }
 
        }
    });

    return;
}

// Node.js and other environments that support module.exports.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = provider();
} else {
    // AMD.
    if (typeof define === 'functon' && define.amd) {
        define([], function() {return provider;});
    // Browser.
    } else {
        window.provider = provider;
    }
}
