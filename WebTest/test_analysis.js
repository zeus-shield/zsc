
import Output from './output.js';

export default function TestAnalysis() {
};

TestAnalysis.prototype.deploy = function() {
    console.log("TestAnalysis.deploy()");
}

TestAnalysis.prototype.create = function() {
    console.log("TestAnalysis.create()");
}

TestAnalysis.prototype.do = function(operation) {
    console.log("TestAnalysis.do(%s)", operation);
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
