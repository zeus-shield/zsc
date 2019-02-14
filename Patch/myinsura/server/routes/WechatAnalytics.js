var express = require('express');
var router = express.Router();

import Insurance_analytics from '../public/js/insurance_analytics';
import ContractInfo from '../public/js/ContractInfo';

const analyticsAddress = ContractInfo.analyticsAddress;
const analyticsAbi = ContractInfo.analyticsAbi;

const account = "0x6A76fb522F948CfB7d6d929408D6aD5876E7139F";
const accountkey = "0x805fd8b8d4aeee085b220b44caa5a73af77aa23fbebfc1a7e09d2150887c6e21";
router.get('/getKeys', function (req, res) {
})
module.exports = router;