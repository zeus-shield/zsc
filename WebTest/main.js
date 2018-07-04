
/*
require.config({
    paths: {
        "test_search": "test_search",
        "test_analysis": "test_analysis"
    }
});

require(['test_search', 'test_analysis'], function (){});
*/
import TestSearch from './es6/test_search.js';
import TestAnalysis from './test_analysis.js';

export default function main(module, operation) {
    let test = 0;
    let string = `Module:[${module}], Operation:[${operation}]`;
    alert(string);

    switch(module) {
        case 'Search': {
            if('undefined' == typeof window.testSearchClass) {
                test = new TestSearch();
                window.testSearchClass = test;
            } else {
                test = window.testSearchClass;
            }
            test.setModuleName('ai_search');
            break;
        }
        case 'Analysis': {
            if('undefined' == typeof window.testAnalysisClass) {
                test = new TestAnalysis();
                window.testAnalysisClass = test;
            } else {
                test = window.testAnalysisClass;
            }
            test.setModuleName('ai_analysis');
            break;
        }
        default:
            let error = `Module:[${module}] Error!`;
            alert(error);
            break;
    }

    if(0 != test)
    {
        test.do(operation);
    }

    window.outputElement = 'output';
}

// Node.js and other environments that support module.exports.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = main();
} else {
    // AMD.
    if (typeof define === 'functon' && define.amd) {
        define([], function() {return main;});
    // Browser.
    } else {
        window.main = main;
    }
}