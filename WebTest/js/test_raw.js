
import Deploy from './deploy.js';
import Output from './output.js';
import ZSCRaw from './zsc_raw.js';

//private member
const contractName = Symbol('contractName');
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');
const deployFunc = Symbol('deployFunc');

export default class TestSearch {

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
        console.log('TestRaw.deployFunc()');
        caller[contractAddress] = address;
    }

    deploy() {
        console.log('TestRaw.deploy()');
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

        deploy = new Deploy()
        if('undefined' != typeof deploy) {
            deploy.do(byteCode, this[abi], parameter, this, this[deployFunc]);
        }
    }

    set() {
        console.log('TestRaw.set()');
        let zsc = new ZSCRaw(this[abi], this[contractAddress]);
        
        // zsc.set(1, "(1) hello");
        // zsc.set(2, "(2) hello");
        // zsc.set(3, "(3) hello");
        // zsc.set(4, "(4) hello");
        // zsc.set(5, "(5) hello");
        
        zsc.setRaw(2, "(2) hello");
    }

    get() {
        console.log('TestRaw.get()');
        let zsc = new ZSCRaw(this[abi], this[contractAddress]);
        zsc.get(4);
    }

    do(operation) {
        console.log('TestRaw.do(%s)', operation);
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