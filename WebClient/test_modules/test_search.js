
function TestSearch() {};

TestSearch.prototype.Deploy = function() {
    console.log("TestSearch.Deploy()");
    let tool = new Tool();
    tool.DeployContract();
}

TestSearch.prototype.Create = function() {
    console.log("TestSearch.Create()");
}

TestSearch.prototype.Do = function(operation) {
    console.log("TestSearch.Do(%s)", operation);
}

// Node.js and other environments that support module.exports.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TestSearch();
} else {
    // AMD.
    if (typeof define === 'functon' && define.amd) {
        define([], function() {return TestSearch;});
    // Browser.
    } else {
        window.TestSearch = TestSearch;
    }
}