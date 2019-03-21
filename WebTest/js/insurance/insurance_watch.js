/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */
export default class InsuranceWatch {
    constructor() {}

    start(abi, address, type, func) {
        let event = null;
        let contractInstance = web3.eth.contract(abi).at(address);

        switch(type) {
            case "InsuranceIntegralTransfer":
                event = contractInstance.Transfer(function(error, result) {
                    if (null === error) {
                        for(let key in result["args"]) {
                            console.log(key + " : " + result["args"][key]);
                        }

                        let from = result["args"]["from"];
                        let to = result["args"]["to"];
                        let value = result["args"]["value"].toString(10);

                        console.log("[Event]: Transfer(%s, %s, %s)", from, to, value);
                        func(error, from, to, value);
                    } else {
                        func(error, 0, 0, 0);
                    }
                });
                break;
            case "InsuranceIntegralApproval":
                break;
            default:
                break;
        }

        return event;
    }

    stop(event) {
        if (null != event) {
            event.stopWatching();
        }
    }
}