
import TestSearch from './es6/test_search.js';
import TestAnalysis from './test_analysis.js';

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
                    if('undefined' == typeof window.TestSearch) {
                        test = new TestSearch();
                        window.TestSearch = test;
                    } else {
                        test = window.TestSearch;
                    }
                    break;
                }
                case 'Analysis': {
                    if('undefined' == typeof window.TestAnalysis) {
                        test = new TestAnalysis();
                        window.TestAnalysis = test;
                    } else {
                        test = window.TestAnalysis;
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