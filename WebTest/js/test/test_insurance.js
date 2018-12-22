
import Output from '../common/output.js';
import Transaction from '../common/transaction_raw.js';
import Delegate from '../common/delegate.js';
import Logistics from '../logistics/logistics.js';
import LogisticsAnalytics from '../logistics/logistics_analytics.js';
import LogisticsAnalyticsMin from '../logistics/logistics_analytics_min.js';
import LogisticsCore from '../logistics/logistics_core.js';
import LogisticsTestData from './test_logistics_raw_data.js';

//private member
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');

const analyticsAbi = Symbol('analyticsAbi');
const analyticsContractAddress = Symbol('analyticsContractAddress');

const analyticsMinAbi = Symbol('analyticsMinAbi');
const analyticsMinContractAddress = Symbol('analyticsMinContractAddress');

const coreAbi = Symbol('coreAbi');
const coreContractAddress = Symbol('coreContractAddress');

const databaseAbi = Symbol('databaseAbi');
const databaseContractAddress = Symbol('databaseContractAddress');

const nextIndex = Symbol('nextIndex');
const tick = Symbol('tick');

//private function
const sleep = Symbol('sleep');
const getCommonAccount = Symbol('getCommonAccount');
const commmonTransactionProc = Symbol('commmonTransactionProc');
const openNextChannel = Symbol('openNextChannel');
const openChannelFunc = Symbol('openChannelFunc');
const openChannel = Symbol('openChannel');
const closeChannel = Symbol('closeChannel');
const removeBatch = Symbol('removeBatch');
const getInvalid = Symbol('getInvalid');
const invalidBatch = Symbol('invalidBatch');
const getDelegateInstance = Symbol('getDelegateInstance');
const getTimeStamp = Symbol('getTimeStamp');
const supplement0 = Symbol('supplement0');
const conditionBuild = Symbol('conditionBuild');

export default class TestLogisticsRaw {

    constructor() {
        this[compiledJson] = [];

        this[abi] = [{"constant":false,"inputs":[{"name":"_newOwner","type":"address"},{"name":"_degradePrio","type":"uint256"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_direction","type":"uint8"},{"name":"_srcCountry","type":"uint16"},{"name":"_destCountry","type":"uint16"},{"name":"_startTime","type":"uint64"},{"name":"_endTime","type":"uint64"}],"name":"number","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"info","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_coreAddr","type":"address"},{"name":"_analyticsAddr","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"checkDelegate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_direction","type":"uint8"},{"name":"_mulMatch","type":"bool"},{"name":"_condition","type":"bytes32[]"}],"name":"numbers","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfDelegates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getDelegateById","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"updateDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
        this[analyticsAbi] = [{"constant":false,"inputs":[{"name":"_newOwner","type":"address"},{"name":"_degradePrio","type":"uint256"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_direction","type":"uint8"},{"name":"_srcCountry","type":"uint16"},{"name":"_destCountry","type":"uint16"},{"name":"_startTime","type":"uint64"},{"name":"_endTime","type":"uint64"}],"name":"getParcelAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"checkDelegate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCoreAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_coreAddr","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tag","type":"string"},{"name":"_value","type":"uint8"}],"name":"setActionCode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numberOfDelegates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getDelegateById","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"updateDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_direction","type":"uint8"},{"name":"_mulMatch","type":"bool"},{"name":"_condition","type":"bytes32[]"}],"name":"getParcelAmountArray","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tag","type":"string"}],"name":"getActionCode","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
        this[analyticsMinAbi] = [{"constant":false,"inputs":[{"name":"_newOwner","type":"address"},{"name":"_degradePrio","type":"uint256"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"checkDelegate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"},{"name":"_count","type":"uint256"}],"name":"get","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_parcel","type":"bytes32"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"number","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfDelegates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getDelegateById","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"updateDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
        this[coreAbi] = [{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_invalidIndex","type":"uint256"}],"name":"getTracksInvalid","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"exist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"},{"name":"_degradePrio","type":"uint256"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getBriefByIndex","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint16"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"numberOfTracks","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_brief","type":"string"}],"name":"updateBriefEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"numberOfInvalid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getBriefEx","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getDatabaseContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_index","type":"uint256"},{"name":"_tag","type":"string"}],"name":"getTrackElement","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"checkDelegate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getBriefExByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getTracks","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_databaseAddr","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_tag","type":"string"}],"name":"getBriefElement","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"}],"name":"remove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"}],"name":"invalid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"number","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"uint16"},{"name":"_lastStatus","type":"uint8"},{"name":"_tracks","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"},{"name":"_tag","type":"string"}],"name":"getBriefElementByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_invalidIndex","type":"uint256"}],"name":"getBriefInvalid","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint16"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfDelegates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_info","type":"string"}],"name":"updateEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getParcelEx","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getParcel","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint16"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getDelegateById","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getBrief","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint16"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"updateDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"uint16"},{"name":"_lastStatus","type":"uint8"}],"name":"updateBrief","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getNumByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_tracks","type":"string"},{"name":"_updateType","type":"uint8"}],"name":"updateTracks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
        this[databaseAbi] = [{"constant":false,"inputs":[{"name":"_newOwner","type":"address"},{"name":"_degradePrio","type":"uint256"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"numberOfTracks","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_brief","type":"string"}],"name":"updateBriefEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_originalNum","type":"string"},{"name":"_num","type":"string"}],"name":"getParcelEx","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_index","type":"uint256"},{"name":"_tag","type":"string"}],"name":"getTrackElement","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_originalNum","type":"string"},{"name":"_num","type":"string"}],"name":"getBrief","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint16"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"checkDelegate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getTracks","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_tag","type":"string"}],"name":"getBriefElement","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"}],"name":"remove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_originalNum","type":"string"},{"name":"_num","type":"string"}],"name":"getBriefEx","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfDelegates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getParcel","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint16"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getDelegateById","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_prio","type":"uint256"}],"name":"updateDelegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"uint16"},{"name":"_lastStatus","type":"uint8"}],"name":"updateBrief","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_tracks","type":"string"},{"name":"_updateType","type":"uint8"}],"name":"updateTracks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];

        this[contractAddress] = "0x4ec5e170cfbd24d571ef0044e25c18364c78c9f8";
        this[analyticsContractAddress] = "0x29a4e150200aaac01f5bf964d3d23490bb7c74df";
        this[analyticsMinContractAddress] = "0x45a42b74a27e2fb0d1d0dbcaffe9607ec96cf0d5";
        this[coreContractAddress] = "0x1c0c2a444d6aab902f41eb17c0ba1570f5e87983";
        this[databaseContractAddress] = "0x52d141199f29efc91ea431180029190d5a196954";
        
        this[nextIndex] = 0;
        this[tick] = 0;
    }

    [sleep](ms) { 
        let now = new Date(); 
        let end = now.getTime() + ms;

        while (true) { 
            now = new Date(); 
            if (now.getTime() > end) 
            return; 
        } 
    }

    [getCommonAccount]() { 
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            return new Array(0, 0);
        }

        return new Array(channels[0].account, channels[0].key);
    }

    [commmonTransactionProc](error, result, output) { 
        if (!error) {
            if ("" != result.status) {
                let status;
                if (0x1 == parseInt(result.status)) {
                    status = "succeeded";
                } else {
                    status = "failure";
                }
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, 'small', 'red', string);
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, 'small', 'red', string);
            }
        } else {
            Output(output, 'small', 'red', error);
        }
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy(contractName) {
        console.log('TestLogisticsRaw.deploy(%s)', contractName);
        let elementId;
        let channels = window.channelClass.get("idle");

        if ('LogisticsDatabase' == contractName) {
            elementId = window.outputDeployDatabaseElement;
        } else if ('LogisticsCore' == contractName) {
            elementId = window.outputDeployCoreElement;
        } else if ('LogisticsAnalytics' == contractName) {
            elementId = window.outputDeployAnalyticsElement;
        } else if ('LogisticsAnalyticsMin' == contractName) {
            elementId = window.outputDeployAnalyticsMinElement;
        } else {
            elementId = window.outputDeployElement;
        }

        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(elementId, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        let name;
        let fullName;
        let found = false;

        let byteCode;
        let transaction;
        let contract;
        let data;
        let handler = this;

        for (fullName in this[compiledJson].contracts) {
            //console.log(fullName);
            name = fullName.substr(fullName.indexOf(":") + 1);
            if (name == contractName) {
                found = true;
                break;
            }
        }

        if (!found) {
            Output(elementId, 'small', 'red', "JSON file error！");
            return;
        }

        if ('' == this[compiledJson].contracts[fullName].bin) {
            Output(elementId, 'small', 'red', "Bin is null in json file!");
            return;
        }     

        byteCode = '0x' + this[compiledJson].contracts[fullName].bin;
        if ('LogisticsDatabase' == contractName) {
            this[databaseAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[databaseAbi]);
        } else if ('LogisticsCore' == contractName) {
            this[coreAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[coreAbi]);
        } else if ('LogisticsAnalytics' == contractName) {
            this[analyticsAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[analyticsAbi]);
        } else if ('LogisticsAnalyticsMin' == contractName) {
            this[analyticsMinAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[analyticsMinAbi]);
        } else {
            this[abi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[abi]);
        }

        data = contract.new.getData({data: byteCode});

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.estimateGas({data: data}, function(error, result) {
            if (!error) {
                transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("deploy", data, result, null, function(error, result) {
                        if (!error) {
                            if ('LogisticsDatabase' == contractName) {
                                handler[databaseContractAddress] = result.contractAddress;
                            } else if ('LogisticsCore' == contractName) {
                                handler[coreContractAddress] = result.contractAddress;
                            } else if ('LogisticsAnalytics' == contractName) {
                                handler[analyticsContractAddress] = result.contractAddress;
                            } else if ('LogisticsAnalyticsMin' == contractName) {
                                handler[analyticsMinContractAddress] = result.contractAddress;
                            } else {
                                handler[contractAddress] = result.contractAddress;
                            }
                            let string = `[TransactionHash]:${result.transactionHash}</br>[ContractAddress]:${result.contractAddress}</br>[Try]:${result.tryTimes}(times)`;
                            Output(elementId, 'small', 'red', string);
                        } else {
                            Output(elementId, 'small', 'red', error);
                        }
                    });
                }
            } else {
                Output(elementId, 'small', 'red', error);
            }
        });
    }

    setup(cmd, contractName) {
        console.log('TestLogisticsRaw.setup(%s, %s)', cmd, contractName);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputSetupElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        switch (cmd) {
            case "Set":
                if ("Logistics" == contractName) {
                    let logistics = new Logistics(this[abi], this[contractAddress]);
                    logistics.setup(account, key, this[coreContractAddress], this[analyticsContractAddress], function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("LogisticsAnalytics" == contractName) {
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.setup(account, key, this[coreContractAddress], function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("LogisticsCore" == contractName) {
                    let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
                    logisticsCore.setup(account, key, this[databaseContractAddress], function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputSetupElement);
                    });
                } else {
                    Output(window.outputSetupElement, 'small', 'red', "Contract name Error!");
                }
                break;
            case "Get":
                if ("Logistics" == contractName) {
                    Output(window.outputSetupElement, 'small', 'red', "Don't support now!");
                } else if ("LogisticsAnalytics" == contractName) {
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.getCoreAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[CoreContractAddress]: ${result}`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else if ("LogisticsCore" == contractName) {
                    let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
                    logisticsCore.getDatabaseAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[DatabaseContractAddress]: ${result}`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else {
                    Output(window.outputSetupElement, 'small', 'red', "Contract name Error!");
                }
                break;
            default:
                Output(window.outputSetupElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    [openNextChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result) {
        if (blockCount == handler[nextIndex]) {
            // no block will proc, close channel
            handler[closeChannel](account);

            // if all the channel is idle, all the block finished
            let channels = window.channelClass.get("idle");
            if (window.channelClass.size() == channels.length) {
                // finish the all the block
                let ticks = (new Date()).valueOf() - handler[tick];
                let string = `Finish all(cost: ${ticks}ms).`;
                Output(outputElement, 'small', 'red', string);
                return true;
            }
        } else {
            handler[openChannel](handler, account, key, data, parallelCount, handler[nextIndex], blockCount, outputElement);
            handler[nextIndex] ++;
        }

        return false;
    }

    [openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result) {
        if (!error) {
            if ("" != result.status) {
                if (0x1 == parseInt(result.status)) {
                    console.log("%cindex=%s(succeeded), account=%s","background:white;color:orange", blockIndex, account);
                } else {
                    console.log("%cindex=%s(failure), account=%s","background:white;color:red", blockIndex, account);
                }

                if (0x1 == parseInt(result.status)) {
                    // try to next transaction
                    status = "succeeded";

                    // lock -- DOTO
                    let finished = handler[openNextChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                    if (finished) {
                        return;
                    }
                    // unlock -- DOTO
                } else {
                    // retry to last transaction
                    status = "failure";

                    // if ((!web3.currentProvider.isMetaMask)
                    //     && ("http://localhost:7545" == web3.currentProvider.host)) {
                    //     // ganache (workaround)
                    //     // lock -- DOTO
                    //     let finished = handler[openNextChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                    //     if (finished) {
                    //         return;
                    //     }
                    //     // unlock -- DOTO
                    // } else {
                        // geth or metamask
                    handler[openChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
                    // }
                }

                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(outputElement, 'small', 'red', string);
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(outputElement, 'small', 'red', string);
            }
        } else {
            handler[openChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
            Output(outputElement, 'small', 'red', error);
        }        
    }

    [openChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement) {
        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        if (blockCount < blockIndex) {
            return;
        }

        let index = window.channelClass.find(account);
        let size = window.channelClass.size();
        if (size == index) {
            return;
        }

        window.channelClass.status(index, "busy");

        switch (data[blockIndex].type) {
            case "update":
                logisticsCore.update(account, key, 
                    data[blockIndex].num, data[blockIndex].transNum,
                    data[blockIndex].model, data[blockIndex].destinationCountry,
                    data[blockIndex].lastStatus, data[blockIndex].tracks, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateEx":
                logisticsCore.updateEx(account, key, data[blockIndex].num, data[blockIndex].info, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateBrief":
                logisticsCore.updateBrief(account, key,
                    data[blockIndex].num, data[blockIndex].transNum,
                    data[blockIndex].model, data[blockIndex].destinationCountry,
                    data[blockIndex].lastStatus, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateBriefEx":
                logisticsCore.updateBriefEx(account, key, data[blockIndex].num, data[blockIndex].info, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateTracks":
                logisticsCore.updateTracks(account, key, data[blockIndex].num, data[blockIndex].info, 1, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            default:
                Output(outputElement, 'small', 'red', "Command Type Error!");
                break;
        }
    }

    [closeChannel](account) {
        let index = window.channelClass.find(account);
        let size = window.channelClass.size();
        if (size == index) {
            return;
        }

        window.channelClass.status(index, "idle");
    }

    dummyData(para1, para2) {
        console.log('TestLogisticsRaw.dummyData(%s, %s)', para1, para2);
        // Analytics, Amount
        let data;
        let blockCount;
        let outputElement;

        let logisticsTestData = new LogisticsTestData();

        switch (para1) {
            case "Analytics":
                outputElement = window.outputAnalyticsElement;
                if ("Amount" == para2) {
                    data = logisticsTestData.buildAnalyticsAmountData();
                    blockCount = data.length;
                } else {
                    Output(outputElement, 'small', 'red', "Command Error!");
                    return;
                }
                break;
            case "Test":
                outputElement = window.outputCommonElement;
                if ("Create" == para2) {
                    data = logisticsTestData.buildTestCreateData();
                    blockCount = data.length;
                } else if ("Update" == para2) {
                    data = logisticsTestData.buildTestUpdateData();
                    blockCount = data.length;
                } else {
                    Output(outputElement, 'small', 'red', "Command Error!");
                    return;
                }
                break;
            default:
                return;
        }

        let parallelCount = 0;
        let channelIdles = window.channelClass.get("idle");

        if (0 == channelIdles.length) {
            Output(outputElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        if (blockCount > channelIdles.length) {
            parallelCount = channelIdles.length;
            this[nextIndex] = channelIdles.length;
        } else {
            parallelCount = blockCount;
            this[nextIndex] = blockCount;
        }

        // start tick
        this[tick] = (new Date()).valueOf();

        for (let blockIndex=0; blockIndex<parallelCount; blockIndex++) {
            let account = channelIdles[blockIndex].account;
            let key = channelIdles[blockIndex].key;
            this[openChannel](this, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
        }
    }

    debugBrief() {
        console.log('TestLogisticsRaw.debugBrief()');
        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        // number
        logisticsCore.number(function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    // getBriefExByIndex
                    // logisticsCore.getBriefByIndex(i, function(error, index, result) {
                    logisticsCore.getBriefExByIndex(i, function(error, index, result) {
                        if (!error) {
                            // console.log(result);
                            Output(window.outputCommonElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                        } else {
                            Output(window.outputCommonElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                        }
                    })
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', error);
            }
        })
    }

    update(type, para) {
        console.log('TestLogisticsRaw.update(%s)', type);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        if (type == "All") {
            let paras = para.split(",^,");
            let num = paras[0];
            let transNum = paras[1];
            let model = paras[2];
            let destinationCountry = paras[3];
            let lastStatus = paras[4];
            let tracks = paras[5];

            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.update(account, key, num, transNum, model, destinationCountry, lastStatus, tracks, function(error, result) {
                handler[commmonTransactionProc](error, result, window.outputWriteElement);
            });
        } else if (type == "Tracks") {
            Output(window.outputWriteElement, 'small', 'red', "Don't support now!");
        } else {
            Output(window.outputWriteElement, 'small', 'red', "Update type Error!");
        }
    }

    [removeBatch](account, key, handler) {
        console.log('TestLogisticsRaw.removeBatch()');

        // create and update at first

        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
        logisticsCore.remove(account, key, "JNTCU0600046684YQ", function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x0 == parseInt(result.status)) {
                        let status = "failure";
                        let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                        Output(window.outputCommonElement, 'small', 'red', string);
                        return;
                    }
                    logisticsCore.remove(account, key, "JNTCU0600046688YQ", function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputCommonElement);
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputCommonElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', error);
            }
        });
    }

    remove(type, para) {
        console.log('TestLogisticsRaw.remove(%s, %s)', type, para);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        if (type == "Common") {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.remove(account, key, para, function(error, result) {
                handler[commmonTransactionProc](error, result, window.outputWriteElement);
            });
        } else if (type == "Batch") {
            this[removeBatch](account, key, this);
        } else {
            Output(window.outputWriteElement, 'small', 'red', "Remove type Error!");
        }
    }

    [getInvalid](handler, num) {
        handler.numberOfInvalid(num, function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    // handler.getBriefInvalid(num, i, function(error, num, index, result) {
                    handler.getTracksInvalid(num, i, function(error, num, index, result) {
                        if (!error) {
                            // console.log(result);
                            Output(window.outputCommonElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                        } else {
                            Output(window.outputCommonElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                        }
                    })
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
            }
        })
    }

    // invalid -> update -> invalid -> updateEx -> invalid
    [invalidBatch](account, key, handler) {
        console.log('TestLogisticsRaw.invalidBatch()');
        let tracks5_invalid1 = "{\"trackElementList\":[{\"time\":\"1543830482\",\"facilityName\":\"invalid(1-1)\",\"desc\":\"invalid(1-1)\"}&{\"time\":\"1543830482\",\"facilityName\":\"invalid(1-2)\",\"desc\":\"invalid(1-2) Груз отправлен со склада хранения (<a href= >КСЭ</a>, номер накладной <a href=$f=$http://cse.ru/track.php?order=waybill%amp;number=JNTCU0600639867YQ$ tar target=$_blank$>JNTCU0600639867YQ</a>)\"}]}";
        let info5_invalid2 = "{\"error\":null,\"num\":\"JNTCU0600046685YQ\",\"transNum\":\"invalid(2) 上海市宜山路900号科技大楼A栋6楼，邮编：200233\",\"model\":\"invalid(2) J-NET俄全通INFO5\",\"destinationCountry\":\"07\",\"lastStatus\":\"23\",\"trackElementList\":[{\"type\":\"1\",\"time\":\"1543830694\",\"country\":\"0086\",\"city\":\"021\",\"facilityName\":\"invalid(2-1)\",\"timeZone\":\"1543830694\",\"desc\":\"invalid(2-1) Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"21\"}&{\"type\":\"0\",\"time\":\"1543830694\",\"country\":\"021\",\"city\":\"0571\",\"facilityName\":\"invalid(2-2)\",\"timeZone\":\"+3\",\"desc\":\"invalid(2-2) Order received successfully\",\"actionCode\":\"22\"}&{\"type\":\"1\",\"time\":\"1543830694\",\"country\":\"007\",\"city\":\"0724\",\"facilityName\":\"invalid(2-3)\",\"timeZone\":\"-7\",\"desc\":\"invalid(2-3) The parcel is ready to transfer to the courier\",\"actionCode\":\"23\"}]}";
        
        let status = "";
        let string = "";

        let num = "JNTCU0600046685YQ";

        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        // invalid
        logisticsCore.invalid(account, key, num, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x0 == parseInt(result.status)) {
                        status = "failure";
                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                        Output(window.outputCommonElement, 'small', 'red', string);
                        return;
                    }

                    // update
                    logisticsCore.update(account, key, num, "invalid(1)", "invalid(1)", 7, 12, tracks5_invalid1, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if (0x0 == parseInt(result.status)) {
                                    status = "failure";
                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                    Output(window.outputCommonElement, 'small', 'red', string);
                                    return;
                                }
                                // invalid
                                logisticsCore.invalid(account, key, num, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if (0x0 == parseInt(result.status)) {
                                                status = "failure";
                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                Output(window.outputCommonElement, 'small', 'red', string);
                                                return;
                                            }
                                            // invalid
                                            // logisticsCore.invalid(account, key, num, function(error, result) {
                                            //     if (!error) {
                                            //         if ("" != result.status) {
                                            //             if (0x0 == parseInt(result.status)) {
                                            //                 status = "failure";
                                            //                 string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            //                 Output(window.outputCommonElement, 'small', 'red', string);
                                            //                 return;
                                            //             }
                                                        // updateEx
                                                        logisticsCore.updateEx(account, key, "JNTCU0600046685YQ", info5_invalid2, function(error, result) {
                                                            if (!error) {
                                                                if ("" != result.status) {
                                                                    if (0x0 == parseInt(result.status)) {
                                                                        status = "failure";
                                                                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                        Output(window.outputCommonElement, 'small', 'red', string);
                                                                        return;
                                                                    }
                                                                    // invalid
                                                                    logisticsCore.invalid(account, key, num, function(error, result) {
                                                                        if (!error) {
                                                                            if ("" != result.status) {
                                                                                if (0x0 == parseInt(result.status)) {
                                                                                    status = "failure";
                                                                                } else {
                                                                                    status = "succeeded";
                                                                                }
                                                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                                Output(window.outputCommonElement, 'small', 'red', string);
                                                                                if (0x1 == parseInt(result.status)) {
                                                                                    handler[getInvalid](logisticsCore, num);
                                                                                }
                                                                            } else {
                                                                                status = "Try to get status again!";
                                                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                                Output(window.outputCommonElement, 'small', 'red', string);
                                                                            }
                                                                        } else {
                                                                            Output(window.outputCommonElement, 'small', 'red', error);
                                                                        }
                                                                    });
                                                                } else {
                                                                    status = "Try to get status again!";
                                                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputCommonElement, 'small', 'red', string);
                                                                }
                                                            } else {
                                                                Output(window.outputCommonElement, 'small', 'red', error);
                                                            }
                                                        });
                                            //         } else {
                                            //             status = "Try to get status again!";
                                            //             string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            //             Output(window.outputCommonElement, 'small', 'red', string);
                                            //         }
                                            //     } else {
                                            //         Output(window.outputCommonElement, 'small', 'red', error);
                                            //     }
                                            // });
                                        } else {
                                            status = "Try to get status again!";
                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputCommonElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputCommonElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                status = "Try to get status again!";
                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputCommonElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputCommonElement, 'small', 'red', error);
                        }
                    });
                } else {
                    status = "Try to get status again!";
                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputCommonElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', error);
            }
        });
    }

    invalid(type, para) {
        console.log('TestLogisticsRaw.invalid(%s, %s)', type, para);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        if (type == "Common") {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.invalid(account, key, para, function(error, result) {
                handler[commmonTransactionProc](error, result, window.outputWriteElement);
            });
        } else if (type == "Batch") {
            this[invalidBatch](account, key, this);
        } else {
            Output(window.outputWriteElement, 'small', 'red', "Invalid type Error!");
        }
    }

    getNumber(type, para) {
        console.log('TestLogisticsRaw.getNumber(%s)', type);
        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        if ("Num" == type) {
            // logisticsCore.numberOfTracks("JNTCU0600046685YQ", function(error, result) {
            logisticsCore.number(function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Number]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            })             
        } else if ("Tracks" == type) {
            // logisticsCore.numberOfTracks("JNTCU0600046685YQ", function(error, result) {
            logisticsCore.numberOfTracks(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Number]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            })   
        } else if ("Invalid" == type) {
            logisticsCore.numberOfInvalid(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Number]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            })   
        }
    }

    getInfo(type, para) {
        console.log('TestLogisticsRaw.getInfo(%s, %s)', type, para);
        
        if ('LogisticsInfo' == type) {
            let logistics = new Logistics(this[abi], this[contractAddress]);
            logistics.info(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Info]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('Parcel' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getParcel(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Parcel]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('ParcelEx' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getParcelEx(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Parcel]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });           
        } else if ('Tracks' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getTracks(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Tracks]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('TrackElement' == type) {
            let tmps = para.split(",");
            let num = tmps[0];
            let index = tmps[1];
            let tag = tmps[2];
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getTrackElement(num, index, tag, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Element]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('TracksInvalid' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            let paras = para.split(",");
            let num = paras[0];
            let index = paras[1];

            logisticsCore.getTracksInvalid(num, index, function(error, num, index, result) {
                if (!error) {
                    // console.log(result);
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                }
            })
        } else if ('Brief' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBrief(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('BriefEx' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefEx(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });           
        } else if ('BriefByIndex' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefByIndex(para, function(error, index, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                }
            });
        } else if ('BriefExByIndex' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefExByIndex(para, function(error, index, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                }
            });
        } else if ('BriefElement' == type) {
            let tmps = para.split(",");
            let num = tmps[0];
            let tag = tmps[1];
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefElement(num, tag, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Element]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('BriefElementByIndex' == type) {
            let tmps = para.split(",");
            let index = tmps[0];
            let tag = tmps[1];
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefElementByIndex(parseInt(index), tag, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Element]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('BriefInvalid' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            let paras = para.split(",");
            let num = paras[0];
            let index = paras[1];

            logisticsCore.getBriefInvalid(num, index, function(error, num, index, result) {
                if (!error) {
                    // console.log(result);
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                }
            })
        } else if ('Test' == type) {
            let handler = this;
            let logisticsAnalyticsMin = new LogisticsAnalyticsMin(this[analyticsMinAbi], this[analyticsMinContractAddress]);
            logisticsAnalyticsMin.test("1234567890helloworldhelloworld", function(error, result) {
                if (!error) {
                    // let str = handler._hexToString(result);
                    Output(window.outputReadElement, 'small', 'red', `[Test]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
            Output(window.outputReadElement, 'small', 'red', 'Do not support now!');
        } else {}
    }

    _hexToString(str) {
        let value = "";
        let byte = "";
        let code = "";

        str = str.substr(str.indexOf("0x")+2);

        for(let i=0; i<str.length/2; i++) {
            byte = str.substring(i*2, i*2+2);
            code = parseInt(byte, 16);
            if ("0" == code) {
                break;
            }
            value += String.fromCharCode(code);
        }

        return value;
  }

    [getDelegateInstance](contract) {
        let delegate = null;
        if ("Logistics" == contract) {
            delegate = new Delegate(this[abi], this[contractAddress]);
        } else if ("LogisticsAnalytics" == contract) {
            delegate = new Delegate(this[analyticsAbi], this[analyticsContractAddress]);
        } else if ("LogisticsAnalyticsMin" == contract) {
            delegate = new Delegate(this[analyticsMinAbi], this[analyticsMinContractAddress]);
        } else if ("LogisticsCore" == contract) {
            delegate = new Delegate(this[coreAbi], this[coreContractAddress]);
        } else if ("LogisticsDatabase" == contract) {
            delegate = new Delegate(this[databaseAbi], this[databaseContractAddress]);
        } else {}

        return delegate;       
    }

    delegate(cmds, paras) {
        console.log('TestLogisticsRaw.delegate(%s; %s)', cmds, paras);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputDelegateWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        tmps = cmds.split(",");
        let cmd = tmps[0];
        let contract = tmps[1];

        let delegate = this[getDelegateInstance](contract);
        if (null == delegate) {
            Output(window.outputDelegateReadElement, 'small', 'red', "Delegate instance Error!");
            return;
        }

        switch (cmd) {
            case "Debug":
                // number
                delegate.number(function(error, result) {
                    if (!error) {
                        let sum = result;
                        let logs = "";
                        let count = 0;
                        for (let i=0; i<sum; i++) {
                            delegate.getInfoById(i, function(error, id, result) {
                                if (!error) {
                                    logs = logs.concat(`[Delegate${id}]: ${result}</br>`);
                                    count ++;
                                    if (count == sum) {
                                        Output(window.outputDelegateReadElement, 'small', 'red', logs);
                                    }                                 
                                } else {
                                    Output(window.outputDelegateReadElement, 'small', 'red', `[Delegate${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputDelegateReadElement, 'small', 'red', error);
                    }
                })               
                break;
            case "Update":
                tmps = paras.split(",");
                let address = tmps[0];
                let priority = tmps[1];

                if (undefined == priority) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input priority!");
                    return;
                }

                // update
                delegate.update(account, key, address, priority, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputDelegateWriteElement);
                });

                break;
            case "Remove":
                // remove
                delegate.remove(account, key, paras, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputDelegateWriteElement);
                });
                break;
            case "Transfer":
                // transferOwnership
                delegate.transferOwnership(account, key, paras, 2, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputDelegateWriteElement);
                });                
                break;
            default:
                Output(window.outputDelegateReadElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    [getTimeStamp](year, month) {
        let start = "";
        let end = "";
        let date;
        let startTime = 0;
        let endTime = 0;

        if ("0" == year) {
            return new Array(0, 0);
        } else {
            start = start.concat(year, "-", month, "-01 00:00:00");
            date = new Date(parseInt(year), parseInt(month), 0);
            end = end.concat(year, "-", month, "-", date.getDate().toString(10), " 23:59:59");

            date = new Date(start);
            startTime = date.getTime()/1000;

            date = new Date(end);
            endTime = date.getTime()/1000; 

            return new Array(startTime, endTime);
        }
    }

    [supplement0](value, supplement0) {
        value = value.toString(16);
        let s = supplement0 + value;
        return s.substr(value.length, s.length);
    }

    [conditionBuild](src, dest, startTime, endTime){
        let bytes2 = "0000";
        let bytes8 = "0000000000000000";
        return "0x" + this[supplement0](src, bytes2) + this[supplement0](dest, bytes2)
                    + this[supplement0](startTime, bytes8) + this[supplement0](endTime, bytes8);
    }

    analytics(cmd, paras) {
        console.log('TestLogisticsRaw.Analytics(%s, %s)', cmd, paras);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputAnalyticsElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        let para;
        switch (cmd) {
            case "ActionCode":
                para = paras.split(",");
                let op = para[0];

                if ("Set" == op) {
                    let tag = para[1];
                    let actionCode = para[2];
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.setActionCode(account, key, tag, parseInt(actionCode), function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputAnalyticsElement);
                    });
                } else if ("Get" == op) {
                    let tag = para[1];
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.getActionCode(tag, function(error, result) {
                        if (!error) {
                            Output(window.outputAnalyticsElement, 'small', 'red', `[ActionCode]:${result}`);
                        } else {
                            Output(window.outputAnalyticsElement, 'small', 'red', error);
                        }
                    })  
                } else {
                    Output(window.outputAnalyticsElement, 'small', 'red', "Command Error!");
                }
                break;
            case "Amount":
                para = paras.split(",");
                let contract = para[0];
                let direction = para[1];
                let src = para[2];
                let dest = para[3];

                let date = this[getTimeStamp](para[4], para[5]);
                let startTime = date[0];
                let endTime = date[1];

                let condition = this[conditionBuild](parseInt(src), parseInt(dest), startTime, endTime);
                let conditionArray = new Array();
                conditionArray.push(condition);

                if ("Logistics" == contract) {
                    let logistics = new Logistics(this[abi], this[contractAddress]);
                    logistics.numbers(parseInt(direction), false, conditionArray, function(error, result) {
                    // logistics.number(parseInt(direction), parseInt(src), parseInt(dest), startTime, endTime, function(error, result) {
                        if (!error) {
                            Output(window.outputAnalyticsElement, 'small', 'red', `[Number]:${result}`);
                        } else {
                            Output(window.outputAnalyticsElement, 'small', 'red', error);
                        }
                    })
                } else if ("LogisticsAnalytics" == contract) {
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.getParcelAmountArray(parseInt(direction), false, conditionArray, function(error, result) {
                    // logisticsAnalytics.getParcelAmount(parseInt(direction), parseInt(src), parseInt(dest), startTime, endTime, function(error, result) {
                        if (!error) {
                            Output(window.outputAnalyticsElement, 'small', 'red', `[Amount]:${result}`);
                        } else {
                            Output(window.outputAnalyticsElement, 'small', 'red', error);
                        }
                    })
                } else {
                    Output(window.outputAnalyticsElement, 'small', 'red', "Contract Error!");
                }
                break;
            default:
                Output(window.outputAnalyticsElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    analyticsMin(cmd, paras) {
        console.log('TestLogisticsRaw.analyticsMin(%s, %s)', cmd, paras);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputAnalyticsMinElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        let para;
        let logisticsAnalyticsMin;
        switch (cmd) {
            case "Update":
                para = paras.split(",");
                let num = para[0];
                let parcel = para[1];
                logisticsAnalyticsMin = new LogisticsAnalyticsMin(this[analyticsMinAbi], this[analyticsMinContractAddress]);
                logisticsAnalyticsMin.update(account, key, num, parcel, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputAnalyticsMinElement);
                });
                break;
            case "Get":
                para = paras.split(",");
                let index = para[0];
                let count = para[1];
                logisticsAnalyticsMin = new LogisticsAnalyticsMin(this[analyticsMinAbi], this[analyticsMinContractAddress]);
                logisticsAnalyticsMin.get(index, count, function(error, result) {
                    if (!error) {
                        Output(window.outputAnalyticsMinElement, 'small', 'red', `[Parcels]:${result}`);
                    } else {
                        Output(window.outputAnalyticsMinElement, 'small', 'red', error);
                    }
                })
                break;
            default:
                Output(window.outputAnalyticsMinElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    do(operation, para1, para2) {
        console.log('TestLogisticsRaw.do(%s, %s, %s)', operation, para1, para2);
        switch(operation) {
            case 'Deploy':
                this.deploy(para1);
                break;
            case 'Setup':
                this.setup(para1, para2);
                break;
            case 'DummyData':
                this.dummyData(para1, para2);
                break;
            case 'DebugBrief':
                this.debugBrief();
                break;
            case 'Update':
                this.update(para1, para2);
                break;
            case 'Remove':
                this.remove(para1, para2);
                break;
            case 'Invalid':
                this.invalid(para1, para2);
                break;
            case 'GetNumber':
                this.getNumber(para1, para2);
                break;
            case 'GetInfo':
                this.getInfo(para1, para2);
                break;
            case 'Delegate':
                this.delegate(para1, para2);
                break;
            case 'Analytics':
                this.analytics(para1, para2);
            case 'AnalyticsMin':
                this.analyticsMin(para1, para2);
            default:
                Output(window.outputCommonElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}