
import TestSearch from './test_search.js';
import TestAnalysis from './test_analysis.js';
import Output from './output.js';

export default function file(module, input) {
    //support chrome IE10
    if (window.FileReader) {
        var file = input.files[0];
        var filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            let test;
            //console.log(this.result);
            //alert(this.result);

            switch(module) {
                case 'Search': {
                    if('undefined' == typeof window.testSearchClass) {
                        test = new TestSearch();
                        window.testSearchClass = test;
                    } else {
                        test = window.testSearchClass;
                    }
                    break;
                }
                case 'Analysis': {
                    if('undefined' == typeof window.testAnalysisClass) {
                        test = new TestAnalysis();
                        window.testAnalysisClass = test;
                    } else {
                        test = window.testAnalysisClass;
                    }
                    break;
                }
                default:
                    let error = `Module:[${module}] Error!`;
                    alert(error);
                    break;
            }

            if('undefined' != typeof test) {
                test.setCompiledJson(this.result);
                Output('output', 'small', 'red', 'Upload successfully!');
            }
        }
    } 
    //support IE 7 8 9 10
    else if (typeof window.ActiveXObject != 'undefined'){
        var xmlDoc; 
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
        xmlDoc.async = false; 
        xmlDoc.load(input.value); 
        alert(xmlDoc.xml); 
    } 
    //support FF
    else if (document.implementation && document.implementation.createDocument) { 
        var xmlDoc; 
        xmlDoc = document.implementation.createDocument("", "", null); 
        xmlDoc.async = false; 
        xmlDoc.load(input.value); 
        alert(xmlDoc.xml);
    } else { 
        alert('error'); 
    } 
}

// Node.js and other environments that support module.exports.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = file();
} else {
    // AMD.
    if (typeof define === 'functon' && define.amd) {
        define([], function() {return file;});
    // Browser.
    } else {
        window.file = file;
    }
}