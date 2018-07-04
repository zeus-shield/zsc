
import Deploy from '../deploy.js';
import Output from '../output.js';

//private member
const contractName = Symbol('contractName');
const compiledJson = Symbol('compiledJson');

export default class TestSearch {

    constructor() {
        this[contractName] = '';
        this[compiledJson] = '';
    }

    setContractName(name) {
        this[contractName] = name;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy() {
        console.log('TestSearch.deploy()');
        let name = '';
        let byteCode = '';
        let abi = '';
        let parameter = '';
        let deploy;

        for (name in this[compiledJson].contracts) {
            if (name.indexOf(this[contractName]) > 0)
                break;
            //console.log(contractName);
        }

        byteCode = '0x' + this[compiledJson].contracts[name].bin;
        abi = JSON.parse(this[compiledJson].contracts[name].abi);
        parameter = '123';

        deploy = new Deploy()
        if('undefined' != typeof deploy) {
            deploy.do('Search', byteCode, abi, parameter);
        }
    }

    create() {
        console.log('TestSearch.create()');
    }

    do(operation) {
        console.log('TestSearch.do(%s)', operation);
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