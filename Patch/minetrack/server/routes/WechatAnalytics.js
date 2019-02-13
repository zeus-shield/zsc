var express = require('express');
var router = express.Router();

import Insurance_analytics from '../public/js/insurance_analytics';
import ContractInfo from '../public/js/ContractInfo';

const analyticsAddress = ContractInfo.analyticsAddress;
const analyticsAbi = ContractInfo.analyticsAbi;

const account = "0x00";
const accountkey = "0x00";


router.get('/getKeys', function (req, res) {
    let insurance_analytics = new Insurance_analytics(analyticsAbi,analyticsAddress);
    let id = 0;
    let count = 100;
    insurance_analytics.getKeys(id,count,function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"交易报错",
                error:error.toString(10)
            })
        } else {