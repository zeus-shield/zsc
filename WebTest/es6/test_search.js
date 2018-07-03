
import Deploy from '../deploy.js';

//private member
const outputId = Symbol('outputId');
const moduleName = Symbol('moduleName');
const compiledJson = Symbol('compiledJson');

export default class TestSearch {

    constructor() {
        this[outputId] = '';
        this[compiledJson] = '';
    }

    setOutput(id) {
        console.log('TestSearch.setOutput(%s)', id);
        this[outputId] = id;
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
            deploy.do(byteCode, abi, parameter);
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
                let element = document.getElementById(this[outputId]);
                element.style.fontSize = 'small';//10 +'pt';
                element.innerHTML = 'Operation Error!';
                break;
        }
    }
}