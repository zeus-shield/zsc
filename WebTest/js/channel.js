
//private member
const channel = Symbol('channel');

//private function

export default class Channel {
    set(account, key) {
        this[channel].push({account: account, key: key, status: "idle"});
    }

    status(index, status) {
        this[channel][index].status = status;
    }

    get(status) {
        let result = new Array();

        for (let i=0; i<this[channel].length; i++) {
            if ("idle" == this[channel][i].status) {
                result.push({index: i, account: this[channel][i].account, key: this[channel][i].key})
            }
        }

        return result;
    }

    constructor() {
        this[channel] = new Array();
    }
}