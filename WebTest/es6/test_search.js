
import Deploy from '../deploy.js';

//private member
const moduleName = Symbol('moduleName');
const compiledJson = Symbol('compiledJson');

export default class TestSearch {

    constructor() {
        this[moduleName] = '';
        this[compiledJson] = '';
    }

    setModuleName(name) {
        this[moduleName] = name;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy() {
        console.log('TestSearch.deploy()');
        let contractName = '';
        let byteCode = '';
        let abi = '';
        let parameter = '';
        let deploy;

        for (contractName in this[compiledJson].contracts) {
            if (contractName.indexOf(`${this[moduleName]}.sol`) > 0)
                break;
            //console.log(contractName);
        }

        byteCode = '0x' + this[compiledJson].contracts[contractName].bin;
        abi = JSON.parse(this[compiledJson].contracts[contractName].abi);
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
                let output = document.getElementById(window.outputElement);
                output.style.fontSize = 'small';//10 +'pt';
                output.innerHTML = 'Operation Error!';
                break;
        }
    }
}