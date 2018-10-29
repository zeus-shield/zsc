
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

    get(status) {
        let result = new Array();

        for (let i=0; i<this[channel].length; i++) {
            if (status == this[channel][i].status) {
                result.push({index: i, account: this[channel][i].account, key: this[channel][i].key});
            }
        }

        return result;
    }

    status(index, status) {
        this[channel][index].status = status;
    }

    find(account) {
        let i = 0;

        for (i=0; i<this[channel].length; i++) {
            if (account == this[channel][i].account) {
                break;
            }
        }
        return i;
    }

    size() {
        return this[channel].length;
    }

    clear() {
        let size = this[channel].length;
        for (let i=0; i<size; i++) {
            this[channel].pop();
        }
    }
}