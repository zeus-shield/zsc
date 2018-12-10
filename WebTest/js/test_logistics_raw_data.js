
export default class TestLogisticsRawData {

    constructor() {}

    buildTestCreateData() {
        // 中国(t0) -> 俄罗斯(t1)，签收
        let num3 = "JNTCU0600046683YQ";
        let transNum3 = "订单描述：（中国 -> 俄罗斯，签收）";
        let model3 = "J-NET俄全通：（Russia, GTMS_SIGNED）"; 
        let destinationCountry3 = 7; // Russia
        let lastStatus3 = 28;        // GTMS_SIGNED("用户签收","Delivered")
        let tracks3 = 
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"01\"," +            // OC
                    "\"time\":\"1537924497\"," +    // 2018-09-26 09:14:57
                    "\"country\":\"086\"," +        // China
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(0) -> track(0)描述：（OC, 2018-09-26 09:14:57, China, PU_PICKUP_SUCCESS）\"," +
                    "\"timeZone\":\"+8\"," +        // +8
                    "\"desc\":\"上海市闵行区宜山路2016号合川大厦6H上海德铎泰信息科技有限公司揽件成功！\"," +
                    "\"actionCode\":\"001\"" +      // PU_PICKUP_SUCCESS("揽收成功","Item picked up by courier")
                "}&{" +
                    "\"type\":\"02\"," +            // DC
                    "\"time\":\"1539854640\"," +    // 2018-10-18 17:24:00
                    "\"country\":\"07\"," +         // Russia
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(1) -> track(1)描述：（DC, 2018-10-18 17:24:00, Russia, GTMS_SIGNED）\"," +
                    "\"timeZone\":\"+3\"," +        // +3
                    "\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\"," +
                    "\"actionCode\":\"028\"" +      // GTMS_SIGNED("用户签收","Delivered")
                "}]" +
            "}";
        
        // 中国(t1) -> 美国(t2) -> 俄罗斯(t0)，签收
        let num4 = "JNTCU0600046684YQ";
        let info4 = 
            "{" +
                "\"error\":null," +
                "\"num\":\"JNTCU0600046684YQ\"," +
                "\"transNum\":\"订单描述：（中国 -> 美国 -> 俄罗斯，签收）\"," +
                "\"model\":\"J-NET俄全通：（Russia, GTMS_SIGNED）\"," +
                "\"destinationCountry\":\"07\"," +  // Russia
                "\"lastStatus\":\"028\"," +         // GTMS_SIGNED("用户签收","Delivered")
                "\"trackElementList\":[{" +
                    "\"type\":\"02\"," +            // DC 
                    "\"time\":\"1538797740\"," +    // 2018-10-06 11:49:00
                    "\"country\":\"07\", " +        // Russia
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(2) -> track(0)描述：（DC, 2018-10-06 11:49:00, Russia, GTMS_SIGNED）\"," +
                    "\"timeZone\":\"+3\"," +        // +3
                    "\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\"," +
                    "\"actionCode\":\"028\"" +      // GTMS_SIGNED("用户签收","Delivered")
                "}&{" +
                    "\"type\":\"1\"," +             // OC
                    "\"time\":\"1537924497\"," +    // 2018-09-26 09:14:57
                    "\"country\":\"86\"," +         // China
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(0) -> track(1)描述：（OC, 2018-09-26 09:14:57, China, PU_PICKUP_SUCCESS）\"," +
                    "\"timeZone\":\"+8\", " +       // +8
                    "\"desc\":\"上海市闵行区宜山路2016号合川大厦6H上海德铎泰信息科技有限公司揽件成功！\"," +
                    "\"actionCode\":\"1\"" +        // PU_PICKUP_SUCCESS("揽收成功","Item picked up by courier")
                "}&{" +
                    "\"type\":\"002\"," +           // DC
                    "\"time\":\"1538365740\"," +    // 2018-10-01 11:49:00
                    "\"country\":\"007\"," +        // USA
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(1) -> track(2)描述：（DC, 2018-10-01 11:49:00, USA, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"-5\"," +        // -5
                    "\"desc\":\"The parcel is ready to transfer to the courier\"," +
                    "\"actionCode\":\"0037\"" +     // VISIBLE_UNKOWN("转运","transfer")     
                "}]" +
            "}";
        
        // 中国(t3) -> 法国(t1) -> 美国(t0) -> 俄罗斯(t2)，转运中
        let num5 = "JNTCU0600046685YQ";
        let transNum5 = "订单描述：（中国 -> 法国 -> 美国 -> 俄罗斯，转运中）";
        let model5 = "J-NET俄全通：（Russia, VISIBLE_UNKOWN）"; 
        let destinationCountry5 = 7;                // Russia
        let lastStatus5 = 37;                       // VISIBLE_UNKOWN("转运","transfer")
        let tracks5 =
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"2\"," +             // DC
                    "\"time\":\"1541991540\"," +    // 2018-11-12 10:59:00
                    "\"country\":\"1\"," +          // USA
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(2) -> track(0)描述：（DC, 2018-11-12 10:59:00, USA, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"-5\"," +        // -5
                    "\"desc\":\"International shipment release - Export\"," +
                    "\"actionCode\":\"37\"" +       // VISIBLE_UNKOWN("转运","transfer")
                "}&{" +
                    "\"type\":\"2\"," +             // DC
                    "\"time\":\"1541813640\"," +    // 2018-11-10 09:34:00
                    "\"country\":\"33\"," +         // France
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(1) -> track(1)描述：（DC, 2018-11-10 09:34:00, France, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"+0\"," +        // +0
                    "\"desc\":\"Transport de marchandises\"," +
                    "\"actionCode\":\"37\"" +       // VISIBLE_UNKOWN("转运","transfer")
                "}&{" +
                    "\"type\":\"2\"," +             // DC
                    "\"time\":\"1542079440\"," +    // 2018-11-13 11:24:00
                    "\"country\":\"7\"," +          // Russia
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(3) -> track(2)描述：（DC, 2018-11-13 11:24:00, Russia, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"+3\"," +        // +3
                    "\"desc\":\"Принят на транзитный склад\"," +      
                    "\"actionCode\":\"37\"" +       // VISIBLE_UNKOWN("转运","transfer")
                "}&{" +
                    "\"type\":\"1\"," +             // OC
                    "\"time\":\"1540966156\"," +    // 2018-10-31 14:09:16
                    "\"country\":\"86\"," +         // China
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(0) -> track(3)描述：（OC, 2018-10-31 14:09:16, China, PU_PICKUP_SUCCESS）\"," +
                    "\"timeZone\":\"+8\"," +        // +8
                    "\"desc\":\"上海市闵行区宜山路2016号合川大厦6H上海德铎泰信息科技有限公司揽件成功！\"," +      
                    "\"actionCode\":\"1\"" +       // PU_PICKUP_SUCCESS("揽收成功","Item picked up by courier")
                "}]" +
            "}";
        
        let num6 = "JNTCU0600046686YQ";
        let info6 = 
            "{\"error\":null," +
                "\"num\":\"JNTCU0600046686YQ\"," +
                "\"transNum\":\"MSK0000027696\"," +
                "\"model\":\"J-NET俄全通INFO6\"," +
                "\"destinationCountry\":\"0086\"," +
                "\"lastStatus\":\"77\"," +
                "\"trackElementList\":[{" +
                    "\"type\":\"0\"," +
                    "\"time\":\"1499918040\"," +
                    "\"country\":\"086\"," +
                    "\"city\":\"0724\"," +
                    "\"facilityName\":\"SF\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"SF is good.\"," +
                    "\"actionCode\":\"10\"" +
                "}&{" +
                    "\"type\":\"1\"," +
                    "\"time\":\"1543804012\"," +
                    "\"country\":\"86\"," +
                    "\"city\":\"021\"," +
                    "\"facilityName\":\"Sorting center of J-NET\"," +
                    "\"timeZone\":\"-3\"," +
                    "\"desc\":\"Order received successfully\"," +
                    "\"actionCode\":\"66\"" +
                "}&{" +
                    "\"type\":\"1\"," +
                    "\"time\":\"1499420340\"," +
                    "\"country\":\"0086\"," +
                    "\"city\":\"010\"," +
                    "\"facilityName\":\"Sorting center of J-NET\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"The parcel is ready to transfer to the courier\"," +
                    "\"actionCode\":\"38\"" +
                "}]" +
            "}";
        
        let num7 = "JNTCU0600046687YQ";
        let transNum7 = "MSK0000027697";
        let model7 = "J-NET俄全通INFO7"; 
        let destinationCountry7 = 7;
        let lastStatus7 = 38;
        let tracks7 =
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"1\"," +
                    "\"time\":\"1543804012\"," +
                    "\"country\":\"7\"," +
                    "\"city\":\"0571\"," +
                    "\"facilityName\":\"Track7-1\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"Track7-1\"," +
                    "\"actionCode\":\"18\"" +
                "}&{" +
                    "\"type\":\"1\"," +
                    "\"time\":\"1543804012\"," +
                    "\"country\":\"7\"," +
                    "\"city\":\"021\"," +
                    "\"facilityName\":\"Track7-2\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"Track7-2\"," +
                    "\"actionCode\":\"10\"" +
                "}&{" +
                    "\"type\":\"0\"," +
                    "\"time\":\"1543804012\"," +
                    "\"country\":\"7\"," +
                    "\"city\":\"0021\"," +
                    "\"facilityName\":\"Track7-3\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"Track7-3\"," +
                    "\"actionCode\":\"48\"" +
                "}]" +
            "}";

        let data = new Array();

        data.push({
                    type: "update",
                    num: num3,
                    transNum: transNum3,
                    model: model3,
                    destinationCountry: destinationCountry3,
                    lastStatus: lastStatus3,
                    tracks: tracks3
                });
        data.push({
                    type: "updateEx",
                    num: num4,
                    info: info4
                });
        data.push({
                    type: "update",
                    num: num5,
                    transNum: transNum5,
                    model: model5,
                    destinationCountry: destinationCountry5,
                    lastStatus: lastStatus5,
                    tracks: tracks5
                });
        data.push({
                    type: "updateEx",
                    num: num6,
                    info: info6
                });
        data.push({
                    type: "update",
                    num: num7,
                    transNum: transNum7,
                    model: model7,
                    destinationCountry: destinationCountry7,
                    lastStatus: lastStatus7,
                    tracks: tracks7
                });

        return data;
    }

    buildTestUpdateData() {
        let num8 = "JNTCU0600046688YQ";
        let transNum8 = "MSK0000027698";
        let model8 = "上海德铎泰信息科技有限公司 上海市闵行区宜山路2016号合川大厦6H"; 
        let destinationCountry8 = 7;
        let lastStatus8 = 38;

        let num9 = "JNTCU0600046689YQ";
        let brief9 =
            "{" +
                "\"error\":null," +
                "\"num\":\"JNTCU0600046689YQ\"," +
                "\"transNum\":\"MSK0000027699\"," +
                "\"model\":\"J-NET俄全通INFO9\"," +
                "\"destinationCountry\":\"07\"," +
                "\"lastStatus\":\"10\"" +
            "}";

        let num5 = "JNTCU0600046685YQ";
        let newTracks5 =
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"1\"," +
                    "\"time\":\"1543804012\"," +
                    "\"country\":\"07\"," +
                    "\"city\":\"0021\"," +
                    "\"facilityName\":\"NewTrack5-1\"," +
                    "\"timeZone\":\"-3\"," +
                    "\"desc\":\"上海德铎泰信息科技有限公司 上海市闵行区宜山路2016号合川大厦6H\"," +
                    "\"actionCode\":\"18\"" +
                "}&{" +
                    "\"type\":\"0\"," +
                    "\"time\":\"1543804509\"," +
                    "\"country\":\"007\"," +
                    "\"city\":\"021\"," +
                    "\"facilityName\":\"NewTrack5-2\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"NewTrack5-2\"," +
                    "\"actionCode\":\"88\"" +
                "}]" +
            "}";

        let data = new Array();

        data.push({
                    type: "updateBrief",
                    num: num8,
                    transNum: transNum8,
                    model: model8,
                    destinationCountry: destinationCountry8,
                    lastStatus: lastStatus8
                });
        data.push({
                    type: "updateBriefEx",
                    num: num9,
                    info: brief9
                });
        data.push({
                    type: "updateTracks",
                    num: num5,
                    info: newTracks5
                });

        return data;
    }

    buildAnalyticsAmountData() {
    }
}