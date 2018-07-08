/*
 Copyright (c) 2018 ZSC Dev Team
*/

export default class Http {
    constructor() {}

    get(url, time, func) {
        let request = 0;
        let timer = 0;
        let timeout = false;

        if (window.XMLHttpRequest) {
            // code for all new browsers
            request = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            // code for IE5 and IE6
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

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
