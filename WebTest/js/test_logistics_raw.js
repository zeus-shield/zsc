
//import Deploy from './deploy.js';
import Output from './output.js';
//import ZSCLogistics from './zsc_logistics.js';

//private member
const contractName = Symbol('contractName');
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');
const deployFunc = Symbol('deployFunc');

export default class TestLogisticsRaw {

    constructor() {
        this[contractName] = '';
        this[compiledJson] = '';
        this[abi] = '';
        this[contractAddress] = '';
    }

    setContractName(name) {
        this[contractName] = name;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    [deployFunc](caller, address) {
        console.log('TestLogisticsRaw.deployFunc()');
        caller[contractAddress] = address;
    }

    deploy() {
        console.log('TestLogisticsRaw.deploy()');
        // let name = '';
        // let byteCode = '';
        // let parameter = '';
        // let deploy;

        // for (name in this[compiledJson].contracts) {
        //     if (name.indexOf(this[contractName]) > 0)
        //         break;
        //     //console.log(contractName);
        // }

        // byteCode = '0x' + this[compiledJson].contracts[name].bin;
        // this[abi] = JSON.parse(this[compiledJson].contracts[name].abi);
        // parameter = 'tester';

        // deploy = new Deploy();
        // if('undefined' != typeof deploy) {
        //     deploy.do(byteCode, this[abi], parameter, this, this[deployFunc]);
        // }
    }

    create() {
        console.log('TestLogisticsRaw.create()');

        // update testing data
        // let info3 = "{\"error\":null,\"num\":\"JNTCU0600046683YQ\",\"transNum\":\"MSK0000027693\",\"model\":\"INFO3\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Армавир\",\"timeZone\":\"+3\",\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        // let info6 = "{\"error\":null,\"num\":\"JNTCU0600046686YQ\",\"transNum\":\"MSK0000027696\",\"model\":\"INFO6\",\"destinationCountry\":\"China\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"China\",\"city\":\"HangZhou\",\"facilityName\":\"SF\",\"timeZone\":\"+3\",\"desc\":\"SF is good.\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"China\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"China\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        // let tracks4 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track4-1\",\"timeZone\":\"+3\",\"desc\":\"Track4-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track4-2\",\"timeZone\":\"+3\",\"desc\":\"Track4-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        // let tracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track5-1\",\"timeZone\":\"+3\",\"desc\":\"Track5-1\",\"actionCode\":\"GTMS_SIGNED\"}}]}";
        // let tracks7 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track6-1\",\"timeZone\":\"+3\",\"desc\":\"Track6-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-2\",\"timeZone\":\"+3\",\"desc\":\"Track6-2\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-3\",\"timeZone\":\"+3\",\"desc\":\"Track6-3\",\"actionCode\":\"GWMS_ACCEPT\"}]}";

        // let zsc = new ZSCLogistics(this[abi], this[contractAddress]);
        // zsc.updateEx(info3, function(error, result) {
        //     if (!error && "0x1" == result) {
        //         zsc.update("JNTCU0600046684YQ", "MSK0000027694", "INFO4", "Russian", "GTMS_SIGNED", tracks4, function(error, result) {
        //             if (!error && "0x1" == result) {
        //                 zsc.update("JNTCU0600046685YQ", "MSK0000027695", "INFO5", "Russian", "GTMS_SIGNED", tracks5, function(error, result) {
        //                     if (!error && "0x1" == result) {
        //                         zsc.updateEx(info6, function(error, result) {
        //                             if (!error && "0x1" == result) {
        //                                 zsc.update("JNTCU0600046687YQ", "MSK0000027697", "INFO7", "Russian", "GTMS_SIGNED", tracks7, function(error, result) {
        //                                     if (!error && "0x1" == result) {
        //                                         console.log("create testing finished.");
        //                                     }
        //                                 });
        //                             }
        //                         });
        //                     }
        //                 });
        //             }
        //         });
        //     }
        // });
    }

    update() {
        console.log('TestLogisticsRaw.update()');
        // let brief9 = "{\"error\":null,\"num\":\"JNTCU0600046689YQ\",\"transNum\":\"MSK0000027699\",\"model\":\"INFO9\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\"}";
        // let newTracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"NewTrack5-1\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"NewTrack5-2\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        // let zsc = new ZSCLogistics(this[abi], this[contractAddress]);

        // zsc.updateBrief("JNTCU0600046688YQ", "MSK0000027698", "INFO8", "Russian", "GTMS_SIGNED", function(error, result){
        //     if (!error && "0x1" == result) {
        //         zsc.updateBriefEx(brief9, function(error, result) {
        //             //zsc.updateTracks("JNTCU0600046685YQ", tracks5, 0, function(error, result) {
        //             zsc.updateTracks("JNTCU0600046685YQ", newTracks5, 1, function(error, result) {
        //                 if (!error && "0x1" == result) {
        //                     console.log("update testing finished.");
        //                 }
        //             });
        //         })
        //     }
        // });
    }

    get() {
        console.log('TestLogisticsRaw.get()');
        // let zsc = new ZSCLogistics(this[abi], this[contractAddress]);
        // zsc.getBrief("JNTCU0600046689YQ");
        // zsc.getBriefEx("JNTCU0600046688YQ");
        // zsc.getTracks("JNTCU0600046685YQ");
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
                break;
            default:
                Output(window.outputElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}