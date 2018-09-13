
import Deploy from './deploy.js';
import Output from './output.js';
import ZSCLogistics from './zsc_logistics.js';

//private member
const contractName = Symbol('contractName');
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');
const deployFunc = Symbol('deployFunc');

export default class TestLogistics {

    constructor() {
        this[contractName] = '';
        this[compiledJson] = '';
        this[abi] = '';
        this[contractAddress] = '';
    }

    setContractName(name) {
        this[contractName] = name;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    [deployFunc](caller, address) {
        console.log('TestLogistics.deployFunc()');
        caller[contractAddress] = address;
    }

    deploy() {
        console.log('TestLogistics.deploy()');
        let name = '';
        let byteCode = '';
        let parameter = '';
        let deploy;

        for (name in this[compiledJson].contracts) {
            if (name.indexOf(this[contractName]) > 0)
                break;
            //console.log(contractName);
        }

        byteCode = '0x' + this[compiledJson].contracts[name].bin;
        this[abi] = JSON.parse(this[compiledJson].contracts[name].abi);
        parameter = 'tester';

        deploy = new Deploy();
        if('undefined' != typeof deploy) {
            deploy.do(byteCode, this[abi], parameter, this, this[deployFunc]);
        }
    }

    set() {
        console.log('TestLogistics.set()');
        let zsc = new ZSCLogistics(this[abi], this[contractAddress]);

        zsc.setBrief("JNTCU0600046683YQ","MSK0000027693","MOSEXP","Russian","GTMS_SIGNED");
        zsc.setBrief("JNTCU0600046684YQ","MSK0000027694","MOSEXP","Russian","GTMS_SIGNED");
        zsc.setBrief("JNTCU0600046685YQ","MSK0000027695","MOSEXP","Russian","GTMS_SIGNED");
        zsc.setBrief("JNTCU0600046686YQ","MSK0000027696","MOSEXP","Russian","GTMS_SIGNED");
        zsc.setBrief("JNTCU0600046687YQ","MSK0000027697","MOSEXP","Russian","GTMS_SIGNED");
    }

    get() {
        console.log('TestLogistics.get()');
        let zsc = new ZSCLogistics(this[abi], this[contractAddress]);
        zsc.getBrief("JNTCU0600046686YQ");
    }

    do(operation) {
        console.log('TestLogistics.do(%s)', operation);
        switch(operation) {
            case 'Deploy':
                this.deploy();
                break;
            case 'Set':
                this.set();
                break;
            case 'Get':
                this.get();
                break;
            default:
                Output(window.outputElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}