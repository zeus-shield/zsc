
import TestSearch from '../test/test_search.js';
import TestLogistics from '../test/test_logistics.js';
import TestInsurance from '../test/test_insurance.js';
import TestDemo from '../test/test_demo.js';
import Output from './output.js';

export default function file(module, contractName, input) {
    //support chrome IE10
    if (window.FileReader) {
        var file = input.files[0];
        var filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            let test;
            let elementId;
            //console.log(this.result);
            //alert(this.result);

            switch(module) {
                case 'Search':
                    if('undefined' == typeof window.testSearchClass) {
                        test = new TestSearch();
                        window.testSearchClass = test;
                    } else {
                        test = window.testSearchClass;
                    }
                    break;
                case 'Logistics':
                    if('undefined' == typeof window.testLogisticsClass) {
                        test = new TestLogistics();
                        window.testLogisticsClass = test;
                    } else {
                        test = window.testLogisticsClass;
                    }
                    if ('LogisticsDatabase' == contractName) {
                        elementId = window.outputDeployDatabaseElement;
                    } else if ('LogisticsCore' == contractName) {
                        elementId = window.outputDeployCoreElement;
                    } else if ('LogisticsAnalytics' == contractName) {
                        elementId = window.outputDeployAnalyticsElement;
                    } else if ('LogisticsAnalyticsMin' == contractName) {
                        elementId = window.outputDeployAnalyticsMinElement;
                    } else {
                        elementId = window.outputDeployElement;
                    }
                    break;
                case 'Insurance':
                    if('undefined' == typeof window.testInsuranceClass) {
                        test = new TestInsurance();
                        window.testInsuranceClass = test;
                    } else {
                        test = window.testInsuranceClass;
                    }
                    if ('InsuranceCompany' == contractName) {
                        elementId = window.outputDeployCompanyElement;
                    } else if ('InsuranceTemplate' == contractName) {
                        elementId = window.outputDeployTemplateElement;
                    } else if ('InsuranceUser' == contractName) {
                        elementId = window.outputDeployUserElement;
                    } else if ('InsurancePolicy' == contractName) {
                        elementId = window.outputDeployPolicyElement;
                    } else if ('InsuranceUserPolicy' == contractName) {
                        elementId = window.outputDeployUserPolicyElement;
                    } else {
                        elementId = window.outputDeployElement;
                    }
                    break;
                case 'Demo':
                    if('undefined' == typeof window.testDemoClass) {
                        test = new TestDemo();
                        window.testDemoClass = test;
                    } else {
                        test = window.testDemoClass;
                    }
                    if ('Demo' == contractName) {
                        elementId = window.outputDeployDemoElement;
                    } else {
                        elementId = window.outputDeployElement;
                    }
                    break;
                default:
                    let error = `Module:[${module}] Error!`;
                    alert(error);
                    break;
            }

            if('undefined' != typeof test) {
                test.setCompiledJson(this.result);
                Output(elementId, 'small', 'red', 'Upload successfully!');
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