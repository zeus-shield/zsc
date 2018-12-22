
//private member
const map = Symbol('map');

export default class Contract {
    constructor() {
        this[map] = new Map();
    }

    add(module, contractAddress) {
        console.log('Contract.add()');
        this[map].set(module, contractAddress);
    }

    find(module) {
        console.log('Contract.find()');
        return this[map].get(module);
    }
}