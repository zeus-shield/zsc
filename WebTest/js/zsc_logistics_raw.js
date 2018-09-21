/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
import Output from './output.js';
import Deploy from './deploy_raw.js';

//private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('constractAddress');
const addressRaw = Symbol('addressRaw');
const privateKeyRaw = Symbol('privateKeyRaw');

export default class ZSCLogistics {
    constructor(abi, address) {
        let isMetaMask = web3.currentProvider.isMetaMask;

        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[addressRaw] = web3.eth.coinbase;
        if (isMetaMask) {
            //this[addressRaw] = "0xbaa43825f1bda3839c5f3038c65c504cb6d962c8";
            this[privateKeyRaw] = "0x5367874f5f72d3e7554e7df202a4f79e1f4ed591c3bc5a78993390f3becf313f";
        } else {
            //this[addressRaw] = "0x15ca13630ce52cd4e209012635f10b396e098296";
            this[privateKeyRaw] = "0x748443675b8cc68e225d4d7f266d2e57a7157e28b55b7cf66409f76a02bd49ca";
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