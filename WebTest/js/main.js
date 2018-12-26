
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
import TestLogistics from './test/test_logistics.js';
import TestInsurance from './test/test_insurance.js';
import TestDemo from './test/test_demo.js';

export default function main(module, param1, param2, param3) {
    let test = 0;
    let string = `Module:[${module}], params:[${param1} ${param2} ${param3}]`;
    //alert(string);

    switch(module) {
        case 'Search':
            if('undefined' == typeof window.testSearchClass) {
                test = new TestSearch();
                window.testSearchClass = test;
            } else {
                test = window.testSearchClass;
            }
            test.setContractName('AISearch');
            break;
        case 'Logistics':
            if('undefined' == typeof window.testLogisticsClass) {
                test = new TestLogistics();
                window.testLogisticsClass = test;
            } else {
                test = window.testLogisticsClass;
            }
            // test.setContractName('Logistics');
            break;
        case 'Insurance':
            if('undefined' == typeof window.testInsuranceClass) {
                test = new TestInsurance();
                window.testInsuranceClass = test;
            } else {
                test = window.testInsuranceClass;
            }
            break;
        case 'Demo':
            if('undefined' == typeof window.testDemoClass) {
                test = new TestDemo();
                window.testDemoClass = test;
            } else {
                test = window.testDemoClass;
            }
            break;
        default:
            let error = `Module:[${module}] Error!`;
            alert(error);
            break;
    }

    if(0 != test)
    {
        test.do(param1, param2, param3);
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