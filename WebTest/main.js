
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
            if('undefined' == typeof window.TestSearch) {
                test = new TestSearch();
                window.TestSearch = test;
            } else {
                test = window.TestSearch;
            }
            test.setModuleName('ai_search');
            break;
        }
        case 'Analysis': {
            if('undefined' == typeof window.TestAnalysis) {
                test = new TestAnalysis();
                window.TestAnalysis = test;
            } else {
                test = window.TestAnalysis;
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
        test.setOutput('output');
        test.do(operation);
    }
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