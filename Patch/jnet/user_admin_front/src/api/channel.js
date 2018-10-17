
//private member
const channel = Symbol('channel');

//private function

export default class Channel {

    constructor() {
        this[channel] = new Array();
    }

    set(account, key) {
        this[channel].push({account: account, key: key, status: "idle"});
    }
}