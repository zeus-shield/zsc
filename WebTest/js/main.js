
/*
require.config({
    paths: {
        "test_search": "test_search",
        "test_analysis": "test_analysis"
    }
});

require(['test_search', 'test_analysis'], function (){});
*/
import TestSearch from './test/test_search.js';
import TestRaw from './test/test_raw.js';
import TestLogistics from './test/test_logistics.js';
import TestLogisticsRaw from './test/test_logistics_raw.js';
import TestAnalysis from './test/test_analysis.js';
import TestInsurance from './test/test_insurance.js';

export default function main(module, operation, para1, para2) {
    let test = 0;
    let string = `Module:[${module}], Operation:[${operation}]`;
    //alert(string);

    switch(module) {
        case 'Search': {
            if('undefined' == typeof window.testSearchClass) {
                test = new TestSearch();
                window.testSearchClass = test;
            } else {
                test = window.testSearchClass;
            }
            test.setContractName('AISearch');
            break;
        }
        case 'Raw': {
            if('undefined' == typeof window.testRawClass) {
                test = new TestRaw();
                window.testRawClass = test;
            } else {
                test = window.testRawClass;
            }
            test.setContractName('Sample');
            break;
        }
        case 'Logistics': {
            if('undefined' == typeof window.testLogisticsClass) {
                test = new TestLogistics();
                window.testLogisticsClass = test;
            } else {
                test = window.testLogisticsClass;
            }
            test.setContractName('Logistics');
            break;
        }
        case 'LogisticsRaw': {
            if('undefined' == typeof window.testLogisticsRawClass) {
                test = new TestLogisticsRaw();
                window.testLogisticsRawClass = test;
            } else {
                test = window.testLogisticsRawClass;
            }
            // test.setContractName('Logistics');
            break;
        }
        case 'Analysis': {
            if('undefined' == typeof window.testAnalysisClass) {
                test = new TestAnalysis();
                window.testAnalysisClass = test;
            } else {
                test = window.testAnalysisClass;
            }
            test.setContractName('AIAnalysis');
            break;
        }
        case 'Insurance': {
            if('undefined' == typeof window.testInsuranceClass) {
                test = new TestInsurance();
                window.testInsuranceClass = test;
            } else {
                test = window.testInsuranceClass;
            }
            break;
        }
        default:
            let error = `Module:[${module}] Error!`;
            alert(error);
            break;
    }

    if(0 != test)
    {
        test.do(operation, para1, para2);
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