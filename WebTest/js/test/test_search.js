
import Deploy from '../common/deploy.js';
import Output from '../common/output.js';
import ZSCSearch from '../zsc/zsc_search.js';

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
        console.log('TestSearch.deployFunc()');
        caller[contractAddress] = address;
    }

    deploy() {
        console.log('TestSearch.deploy()');
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
        console.log('TestSearch.create()');
        let zsc = new ZSCSearch(this[abi], this[contractAddress]);
        zsc.addParameter('0x11', '0x21', '0xef55bfac4228981e850936aaf042951f7b146e4f', '0x31', '0x31');
        zsc.addParameter('0x11', '0x21', '0xef55bfac4228981e850936aaf042951f7b146e4d', '0x32', '0x33');
        zsc.addParameter('0x11', '0x21', '0xef55bfac4228981e850936aaf042951f7b146e4e', '0x32', '0x34');
        zsc.addParameter('0x11', '0x21', '0xef55bfac4228981e850936aaf042951f7b146e4f', '0x33', '0x35');
    }

    debug() {
        console.log('TestSearch.debug()');
        let zsc = new ZSCSearch(this[abi], this[contractAddress]);
        zsc.debug();
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
            case 'Debug':
                this.debug();
                break;
            default:
                Output(window.outputElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}