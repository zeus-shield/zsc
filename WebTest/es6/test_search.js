
//private member
const outputId = Symbol('outputId');
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

    setCompiledJson(json) {
        this[compiledJson] = json;
    }

    deploy() {
        console.log('TestSearch.deploy()');
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