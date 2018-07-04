/*
 Copyright (c) 2018 ZSC Dev Team
*/
export default class ZSCSearch() {
    construct() {
    }

    ZSCTemplate.prototype.numTemplates= function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numTemplates(gm.userName,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tmpNos = result.toString(10);
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
    }
}