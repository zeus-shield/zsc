
function TestAnalysis() {};

TestAnalysis.prototype.Deploy = function() {
    console.log("TestAnalysis.Deploy()");
    let tool = new Tool();
    tool.DeployContract();
}

TestAnalysis.prototype.Create = function() {
    console.log("TestAnalysis.Create()");
}

TestAnalysis.prototype.Do = function(operation) {
    console.log("TestAnalysis.Do(%s)", operation);
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