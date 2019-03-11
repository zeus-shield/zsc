
//private member
const watch = Symbol('watch');

//private function

export default class Watch {

    constructor() {
        this[watch] = new Array();
    }

    find(module, event) {
        let i = -1;

        for (i=0; i<this[watch].length; i++) {
            if (module == this[watch][i].module
                && event == this[watch][i].event) {
                break;
            }
        }

        if (this[watch].length == i) {
            return -1;
        }

        return i;
    }

    get(module, event) {
        let result = new Array();

        let index = this.find(module, event);
        if (-1 != index) {
            result.push({index: index, handle: this[watch][index].handle});
        }

        return result;
    }

    size() {
        return this[watch].length;
    }

    add(module, event) {
        this[watch].push({module: module, event: event, handle: null});
    }

    update(module, event, handle) {
        let index = this.find(module, event);
        if (-1 != index) {
            this[watch][index].handle = handle;
        }
    }

    clear() {
        let size = this[watch].length;
        for (let i=0; i<size; i++) {
            this[watch].pop();
        }
    }
}