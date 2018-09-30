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
            Output(window.outputElement, 'small', 'red', string);
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
            Output(window.outputElement, 'small', 'red', `Injected Web3 do not exist!`);
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
            Output(window.outputElement, 'small', 'red', `Web3(${type}, ${account}) do not connected!`);
        } else {
            Output(window.outputElement, 'small', 'red', `Web3(${type}, ${account}) connected!`);
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
            channel.set(web3.eth.accounts[0], "");
            channel.set("", "");
        } else {
            // geth
            if ("http://localhost:8545" === web3.currentProvider.host) {
                channel.set(web3.eth.accounts[0], "");
                channel.set(web3.eth.accounts[1], "");
                channel.set(web3.eth.accounts[2], "");
                channel.set(web3.eth.accounts[3], "");
            } else {
                // ganache
                channel.set("web3.eth.accounts[0]", "");
                channel.set("web3.eth.accounts[1]", "");
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
