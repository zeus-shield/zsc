
//private member
const channel = Symbol('channel');

//private function

export default class Channel {

    constructor() {
        this[channel] = new Array();
    }
}