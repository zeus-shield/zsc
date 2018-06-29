
function TestAnalysis() {};

TestAnalysis.prototype.deploy = function() {
    console.log("TestAnalysis.deploy()");
    let tool = new Tool();
    tool.DeployContract();
}

TestAnalysis.prototype.create = function() {
    console.log("TestAnalysis.create()");
}

TestAnalysis.prototype.do = function(operation) {
    console.log("TestAnalysis.do(%s)", operation);
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