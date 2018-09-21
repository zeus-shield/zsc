/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
import Output from './output.js';
import Deploy from './deploy_raw.js';

// private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('constractAddress');
const account = Symbol('account');

export default class ZSCLogistics {
    constructor(abi, address) {
        let isMetaMask = web3.currentProvider.isMetaMask;

        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[account] = web3.eth.coinbase;
        if (isMetaMask) {
            //this[account] = "0xbaa43825f1bda3839c5f3038c65c504cb6d962c8";
        } else {
            //this[account] = "0x15ca13630ce52cd4e209012635f10b396e098296";
        }
    }

    updateTracks(_num, _tracks, _updateType, func) {
    }

    updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus, func) {
    }

    updateBriefEx(_brief, func) {
    }

    update(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.update.getData(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks);

        contractInstance.update.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, {data: data}, function(error, result) {
            if (!error) {
                let deploy = new Deploy();
                if('undefined' != typeof deploy) {
                    deploy.do("transaction", data, result, handler[constractAddress], null, func);
                    //deploy.doUpdate(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, func, contractInstance);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    updateEx(_info, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateEx.getData(_info);

        contractInstance.updateEx.estimateGas(_info, function(error, result) {
            if (!error) {
                let deploy = new Deploy();
                if('undefined' != typeof deploy) {
                    deploy.do("transaction", data, result, handler[constractAddress], null, func);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    remove(_num) {
    }

    getTracks(_num) {
    }

    getBrief(_num) {
    }

    getBriefEx(_num) {
    }

    number() {
    }

    numberOfTracks(_num) {
    }
}