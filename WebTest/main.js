alert("main loading");

require.config({
    paths: {
        "test_search": "test_search",
    }
});

require(['test_search'], function (){});
require(['test_analysis'], function (){});

function addIframe(operation) {
    let test = 0;
    //let string = '[Module]:' + 'Search' + ', ' + '[Operation]:' + operation;
    //alert(string);
    console.log('[Module]:%s, [Operation]:%s', 'Search', operation);
    test = new TestSearch();
    test.setOutput('output');
    test.do(operation);
}