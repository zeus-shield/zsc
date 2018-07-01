
function TestAnalysis() {
    this.outputId;
};

TestAnalysis.prototype.setOutput = function(id) {
    console.log("TestAnalysis.setOutput()");
    this.outputId = id;
}

TestAnalysis.prototype.deploy = function() {
    console.log("TestAnalysis.deploy()");
    //let tool = new Tool();
    //tool.DeployContract();
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
            let element = document.getElementById(this.outputId);
            element.style.fontSize = "small";//10 +'pt';
            element.innerHTML = "Operation Error!";
            break;
    }
}

// Node.js and other environments that support module.exports.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TestAnalysis();
} else {
    // AMD.
    if (typeof define === 'functon' && define.amd) {
        define([], function() {return TestAnalysis;});
    // Browser.
    } else {
        window.TestAnalysis = TestAnalysis;
    }
}