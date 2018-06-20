/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUserAgrs(adr, abi) {
    this.userName;
    this.agrNos = 0;
    this.agrNames = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(700);
}

ZSCShowUserAgrs.prototype = new ZSCJsBase();

ZSCShowUserAgrs.prototype.setUserName = function(userName) {
    this.userName = userName;
    this.setModuleType("userAgreements");
}

ZSCShowUserAgrs.prototype.loadUserAgrs = function(func) {
    this.numUserAgrs(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getAgrNameByIndex(i, function(index){
                if (indx == this.agrNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCShowUserAgrs.prototype.numUserAgrs= function(func) {
    this.myControlApi.numAgreements(this.userName,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) {
                this.agrNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserAgrs.prototype.getAgrNameByIndex = function(index, func) {
    this.myControlApi.getAgreementNameByIndex(this.userName, index,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) {
                this.agrNames[index] = result;
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserAgrs.prototype.loadWalletHtml = function(funcName, elementId)  {
    var funcPrefix = funcName + '('; 
    var funcSuffix = ')"';

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Index</text></td> <td><text>Agreement Name</text></td>  '
    text += '</tr>'

    for (var i = 0; i < this.agrNos; ++i) {
        text += '<tr>'
        text += '   <td><button type="button" onClick="' + showPrefix + "'" + this.userName + "', '" + this.agrNames[i] + "'" + showSuffix + '">Details</button>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.agrNames[i] + '</text></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}


