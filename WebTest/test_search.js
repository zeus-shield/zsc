
//define(['test_analysis'], function(){});
//require(['test_analysis'], function (){});

import Output from './output.js';

const STATUS = {
  INIT: "init",
  DEPLOY: "deploy",
  CREATE: "create"
};

export default function TestSearch() {
};

TestSearch.prototype.deploy = function() {
    console.log("TestSearch.deploy()");
}

TestSearch.prototype.create = function() {
    console.log("TestSearch.create()");
}

TestSearch.prototype.do = function(operation) {
    console.log("TestSearch.do(%s)", operation);
    switch(operation) {
        case 'Deploy':
            this.deploy();
            break;
        case 'Create':
            this.create();
            break;
        default:
            //console.assert("Assertion of score length failed");
            Output(window.outputElement, 'small', 'red', 'Operation Error!');
            break;
    }
}
