/*
 Copyright (c) 2018 ZSC Dev Team
*/

//private member
const _getXmlHttpObject = Symbol('_getXmlHttpObject');

export default class Http {
    constructor() {}

    [_getXmlHttpObject]() {

        let xmlHttp = null;

        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            // Internet Explorer
            try {
                xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xmlHttp;
    }

    get(url, time, func) {
        let request = 0;
        let timer = 0;
        let timeout = false;

        /*
        if (window.XMLHttpRequest) {
            // code for all new browsers
            request = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            // code for IE5 and IE6
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        */
        request = this.[_getXmlHttpObject];

        timer = setTimeout(function() {
            timeout = true;
            request.abort();
            alert('HTTP[GET] Timeout!');
        }, time );

        if (0 != request) {
            request.onreadystatechange = function() {
                if (4 != request.readyState) {
                    return;
                }

                if (timeout) {
                    clearTimeout(timer);
                    return;
                }

                clearTimeout(timer);
                if (200 == request.status) {
                    func(request.responseText);
                }
            }
            request.open("GET", url, true);
            request.send(null);
        } else {
            alert("Your browser does not support XMLHTTP.");
        }
    }
}
