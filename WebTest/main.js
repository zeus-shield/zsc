
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
    let string = `Module:` + `[` + module + `]` + `, ` + `Operation:` + `[`+ operation + `]`;
    alert(string);

    switch(module) {
        case `Search`: {
            test = new TestSearch();
            break;
        }
        case `Analysis`: {
            test = new TestAnalysis();
            break;
        }
        default:
            let error = `Module:` + `[` + module + `]` + ` Error!`;
            alert(error);
            break;
    }

    test.setOutput(`output`);
    test.do(operation);
}