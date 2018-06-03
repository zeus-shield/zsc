/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementAll(nm, abi, adr) {
    this.userName = nm;
    this.userType;
    this.allAgrNos = 0;
    this.allAgrNames = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
}

ZSCAgreementAll.prototype.getUserName = function() {return this.userName;}

ZSCAgreementAll.prototype.setUserType = function(type) {return this.userType = type;}

ZSCAgreementAll.prototype.loadAllAgreements = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    gm.numAllAgreements(gm, function(gm) {
        for (var i = 0; i < gm.allAgrNos; ++i) {
            gm.getAllAgreementNameByIndex(gm, i, function(gm, index){
                if (index == gm.allAgrNos - 1) {
                    callBack();
                }
            });
        }
    });
}

ZSCAgreementAll.prototype.numAllAgreements= function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
        
    myControlApi.numFactoryElements(gm.userName, "agreement", 
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.allAgrNos = result.toString(10); 
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementAll.prototype.getAllAgreementNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getFactoryElementNameByIndex(gm.userName, "agreement", index,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.allAgrNames[index] = web3.toUtf8(result);
                func(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementAll.prototype.submitPurchaseAgreement = function(elementName, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.purchaseAgreement(gm.userName, elementName,
        {from:gm.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                bF_showHashResult("PurchaseAgreementHash", result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementAll.prototype.loadAllAgreementsHtml = function(elementId, showFunc, purchaseFunc)  {
    var showPrefix = showFunc + "('"; 
    var showSuffix = "')";

    var purchasePrefix = purchaseFunc + "('"; 
    var purchaseSuffix = "')";

    var titlle = "All published agreements: "

    var text ="";
    text += '<div class="well">';
    text += '<div class="well"> <text>' + titlle + ' </text></div>';
    text += '<table align="center" style="width:600px;min-height:30px">'

    text += '<div class="well">';
    text += '<text> Purchase agreement: </text> <text id="PurchaseAgreementHash"> </text>'
    text += '</div>';

    text += '<tr>'
    if (this.userType == "receiver") {
        text += '   <td>Index</td> <td>Name</td> <td> Details </td> <td> Purchase </td>'
    } else {
        text += '   <td>Index</td> <td>Name</td> <td> Details </td> <td> </td>'
    }
    text += '</tr>'
    text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td> </tr>'

    for (var i = 0; i < this.allAgrNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.allAgrNames[i] + '</text></td>'
        text += '   <td><button type="button" onClick="' + showPrefix + this.allAgrNames[i] + showSuffix + '">Details</button></td>'
        if (this.userType == "receiver") {
            text += '   <td><button type="button" onClick="' + purchasePrefix + this.allAgrNames[i] + purchaseSuffix + '">Purchase</button></td>'
        }
            text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td></tr>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}
