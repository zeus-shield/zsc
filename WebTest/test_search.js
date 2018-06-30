
function TestSearch() {
    this.outputId;
};

TestSearch.prototype.setOutput = function(id) {
    console.log("TestSearch.setOutput()");
    this.outputId = id;
}

TestSearch.prototype.deploy = function() {
    console.log("TestSearch.deploy()");
    let tool = new Tool();
    tool.DeployContract();
}

TestSearch.prototype.create = function() {
    console.log("TestSearch.create()");
}

TestSearch.prototype.do = function(operation) {
    console.log("TestSearch.do(%s)", operation);
    switch(operation) {
        case 'Deploy':
            break;
        case 'Create':
            break;
        default:
            console.assert("Assertion of score length failed");
            var element = document.getElementById(this.outputId);
            element.style.fontSize = "small";//10 +'pt';
            element.innerHTML = "Operation Error!";
            break;
    }
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