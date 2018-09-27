
import Output from './output.js';
import Transaction from './transaction_raw.js';
import Logistics from './logistics_raw.js';
import Channel from './channel.js';

//private member
const contractName = Symbol('contractName');
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');
const channel = Symbol('channel');

//private function

export default class TestLogisticsRaw {

    constructor() {
        this[contractName] = '';
        this[compiledJson] = '';
        this[abi] = '';
        this[contractAddress] = '';

        this[channel] = new Channel();
        let isMetaMask = web3.currentProvider.isMetaMask;
        if (isMetaMask) {
        } else {
        }
    }

    setContractName(name) {
        this[contractName] = name;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy() {
        console.log('TestLogisticsRaw.deploy()');
        let channels = this[channel].get("idle");

        if (0 == channels.length) {
            Output(window.outputElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let name;
        let byteCode;
        let transaction;
        let contract;
        let data;
        let handler = this;

        for (name in this[compiledJson].contracts) {
            if (name.indexOf(this[contractName]) > 0)
                break;
            //console.log(contractName);
        }

        byteCode = '0x' + this[compiledJson].contracts[name].bin;
        this[abi] = JSON.parse(this[compiledJson].contracts[name].abi);

        contract = web3.eth.contract(this[abi]);
        data = contract.new.getData({data: byteCode});

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.estimateGas({data: data}, function(error, result) {
            if (!error) {
                transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("deploy", data, result, null, function(error, result) {
                        if (!error) {
                            handler[contractAddress] = result.contractAddress;
                            let string = `[TransactionHash]:${result.transactionHash}</br>[ContractAddress]:${result.contractAddress}</br>[Try]:${result.tryTimes}(times)`;
                            Output(window.outputElement, 'small', 'red', string);
                        } else {
                            Output(window.outputElement, 'small', 'red', error);
                        }
                    });
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    create() {
        console.log('TestLogisticsRaw.create()');
        let channels = this[channel].get("idle");

        if (0 == channels.length) {
            Output(window.outputElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let status = "";
        let string = "";

        // update testing data
        let info3 = "{\"error\":null,\"num\":\"JNTCU0600046683YQ\",\"transNum\":\"MSK0000027693\",\"model\":\"INFO3\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Армавир\",\"timeZone\":\"+3\",\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        let info6 = "{\"error\":null,\"num\":\"JNTCU0600046686YQ\",\"transNum\":\"MSK0000027696\",\"model\":\"INFO6\",\"destinationCountry\":\"China\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"China\",\"city\":\"HangZhou\",\"facilityName\":\"SF\",\"timeZone\":\"+3\",\"desc\":\"SF is good.\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"China\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"China\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        let tracks4 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track4-1\",\"timeZone\":\"+3\",\"desc\":\"Track4-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track4-2\",\"timeZone\":\"+3\",\"desc\":\"Track4-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        let tracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track5-1\",\"timeZone\":\"+3\",\"desc\":\"Track5-1\",\"actionCode\":\"GTMS_SIGNED\"}}]}";
        let tracks7 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track6-1\",\"timeZone\":\"+3\",\"desc\":\"Track6-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-2\",\"timeZone\":\"+3\",\"desc\":\"Track6-2\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-3\",\"timeZone\":\"+3\",\"desc\":\"Track6-3\",\"actionCode\":\"GWMS_ACCEPT\"}]}";

        let logistics = new Logistics(this[abi], this[contractAddress]);
        
        // updateEx
        logistics.updateEx(account, key, info3, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if ("0x1" == result.status) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }

                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputElement, 'small', 'red', string);

                    // update
                    logistics.update(account, key, "JNTCU0600046684YQ", "MSK0000027694", "INFO4", "Russian", "GTMS_SIGNED", tracks4, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if ("0x1" == result.status) {
                                    status = "succeeded";
                                } else {
                                    status = "failure";
                                }

                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputElement, 'small', 'red', string);

                                // update
                                logistics.update(account, key, "JNTCU0600046685YQ", "MSK0000027695", "INFO5", "Russian", "GTMS_SIGNED", tracks5, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if ("0x1" == result.status) {
                                                status = "succeeded";
                                            } else {
                                                status = "failure";
                                            }

                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputElement, 'small', 'red', string);

                                            // updateEx
                                            logistics.updateEx(account, key, info6, function(error, result) {
                                                if (!error) {
                                                    if ("" != result.status) {
                                                        if ("0x1" == result.status) {
                                                            status = "succeeded";
                                                        } else {
                                                            status = "failure";
                                                        }

                                                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                        Output(window.outputElement, 'small', 'red', string);

                                                        // update
                                                        logistics.update(account, key, "JNTCU0600046687YQ", "MSK0000027697", "INFO7", "Russian", "GTMS_SIGNED", tracks7, function(error, result) {
                                                            if (!error) {
                                                                if ("" != result.status) {
                                                                    if ("0x1" == result.status) {
                                                                        status = "succeeded";
                                                                    } else {
                                                                        status = "failure";
                                                                    }

                                                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputElement, 'small', 'red', string);
                                                                } else {
                                                                    let status = "Try to get status again!";
                                                                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputElement, 'small', 'red', string);
                                                                }
                                                            } else {
                                                                Output(window.outputElement, 'small', 'red', error);
                                                            }
                                                        });
                                                    } else {
                                                        let status = "Try to get status again!";
                                                        let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                        Output(window.outputElement, 'small', 'red', string);
                                                    }
                                                } else {
                                                    Output(window.outputElement, 'small', 'red', error);
                                                }
                                            });
                                        } else {
                                            let status = "Try to get status again!";
                                            let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                let status = "Try to get status again!";
                                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputElement, 'small', 'red', error);
                        }
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    update() {
        console.log('TestLogisticsRaw.update()');
        let channels = this[channel].get("idle");

        if (0 == channels.length) {
            Output(window.outputElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let status = "";
        let string = "";

        // update testing data
        let brief9 = "{\"error\":null,\"num\":\"JNTCU0600046689YQ\",\"transNum\":\"MSK0000027699\",\"model\":\"INFO9\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\"}";
        let newTracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"NewTrack5-1\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"NewTrack5-2\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // updateBrief
        logistics.updateBrief(account, key, "JNTCU0600046688YQ", "MSK0000027698", "INFO8", "Russian", "GTMS_SIGNED", function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if ("0x1" == result.status) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }

                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputElement, 'small', 'red', string);

                    // updateBriefEx
                    logistics.updateBriefEx(account, key, brief9, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if ("0x1" == result.status) {
                                    status = "succeeded";
                                } else {
                                    status = "failure";
                                }

                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputElement, 'small', 'red', string);

                                // updateTracks
                                logistics.updateTracks(account, key, "JNTCU0600046685YQ", newTracks5, 1, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if ("0x1" == result.status) {
                                                status = "succeeded";
                                            } else {
                                                status = "failure";
                                            }

                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputElement, 'small', 'red', string);
                                        } else {
                                            let status = "Try to get status again!";
                                            let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                let status = "Try to get status again!";
                                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputElement, 'small', 'red', error);
                        }
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    get() {
        console.log('TestLogisticsRaw.get()');
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // logistics.getBrief("JNTCU0600046689YQ", function(error, result) {
        //     if (!error) {
        //         Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
        //     } else {
        //         Output(window.outputElement, 'small', 'red', error);
        //     }
        // });

        // logistics.getBriefEx("JNTCU0600046688YQ", function(error, result) {
        //     if (!error) {
        //         Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
        //     } else {
        //         Output(window.outputElement, 'small', 'red', error);
        //     }
        // });

        // logistics.getBriefByIndex(0, function(error, result) {
        //     if (!error) {
        //         Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
        //     } else {
        //         Output(window.outputElement, 'small', 'red', error);
        //     }
        // });

        // logistics.getBriefExByIndex(4, function(error, result) {
        //     if (!error) {
        //         Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
        //     } else {
        //         Output(window.outputElement, 'small', 'red', error);
        //     }
        // });

        logistics.getTracks("JNTCU0600046685YQ", function(error, result) {
            if (!error) {
                Output(window.outputElement, 'small', 'red', `[Tracks]:</br>${result}`);
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    remove() {
        console.log('TestLogisticsRaw.remove()');
        let logistics = new Logistics(this[abi], this[contractAddress]);
        let tracks4 = "{\"trackElementList\":[{\"time\":\"2017-07-13 11:54:00\",\"facilityName\":\"Track4-1\",\"desc\":\"Track4-1\"}&{\"time\":\"2017-07-07 17:39:09\",\"facilityName\":\"Track4-2\",\"desc\":\"Груз отправлен со склада хранения (<a href= >КСЭ</a>, номер накладной <a href=$f=$http://cse.ru/track.php?order=waybill%amp;number=JNTCU0600639867YQ$ tar target=$_blank$>JNTCU0600639867YQ</a>)\"}]}";

        // update
        logistics.update("JNTCU0600639867YQ", "MSK0000027694", "INFO4", "Russian", "GTMS_SIGNED", tracks4, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if ("0x1" == result.status) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }
                    
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputElement, 'small', 'red', string);

                    // getTracks
                    logistics.getTracks("JNTCU0600639867YQ", function(error, result) {
                        if (!error) {
                            Output(window.outputElement, 'small', 'red', `[Track]:</br>${result}`);
                            // remove
                            logistics.remove("JNTCU0600639867YQ", function(error, result) {
                                if (!error) {
                                    if ("" != result.status) {
                                        if ("0x1" == result.status) {
                                            status = "succeeded";
                                        } else {
                                            status = "failure";
                                        }
                                        // getTracks
                                        logistics.getTracks("JNTCU0600639867YQ", function(error, result) {
                                            if (!error) {
                                                Output(window.outputElement, 'small', 'red', `[Track]:</br>${result}`);
                                            } else {
                                                Output(window.outputElement, 'small', 'red', error);
                                            }
                                        });
                                    } else {
                                        let status = "Try to get status again!";
                                        let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                        Output(window.outputElement, 'small', 'red', string);
                                    }
                                } else {
                                    Output(window.outputElement, 'small', 'red', error);
                                }
                            });
                        } else {
                            Output(window.outputElement, 'small', 'red', error);
                        }
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    number() {
        console.log('TestLogisticsRaw.number()');
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // number
        logistics.number(function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    // getBriefExByIndex
                    // logistics.getBriefByIndex(i, function(error, result) {
                    logistics.getBriefExByIndex(i, function(error, result) {
                        if (!error) {
                            console.log(result);
                            Output(window.outputElement, 'small', 'red', `[Brief]:</br>${result}`);
                        } else {
                            Output(window.outputElement, 'small', 'red', error);
                        }
                    })
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        })
    }

    numberOfTracks() {
        console.log('TestLogisticsRaw.numberOfTracks()');
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // number
        logistics.numberOfTracks("JNTCU0600046685YQ", function(error, result) {
            if (!error) {
                Output(window.outputElement, 'small', 'red', `[Number]:${result}`);
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        })
    }

    do(operation) {
        console.log('TestLogisticsRaw.do(%s)', operation);
        switch(operation) {
            case 'Deploy':
                this.deploy();
                break;
            case 'Create':
                this.create();
                break;
            case 'Update':
                this.update();
                break;
            case 'Get':
                this.get();
                // this.remove();
                // this.number();
                // this.numberOfTracks();
                break;
            default:
                Output(window.outputElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}