
import Deploy from '../common/deploy.js';
import Output from '../common/output.js';

//private member
const contractName = Symbol('contractName');
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');
const deployFunc = Symbol('deployFunc');

export default class TestAnalysis {

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
        console.log('TestAnalysis.deployFunc()');
        caller[contractAddress] = address;
    }

    deploy() {
        console.log('TestAnalysis.deploy()');
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

    create() {
        console.log('TestAnalysis.create()');
    }

    do(operation) {
        console.log('TestAnalysis.do(%s)', operation);
        switch(operation) {
            case 'Deploy':
                this.deploy();
                break;
            case 'Create':
                this.create();
                break;
            default:
                Output(window.outputElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}