var express = require('express');
var router = express.Router();

import Insurance_analytics from '../public/js/insurance_analytics';
import ContractInfo from '../public/js/ContractInfo';

const analyticsAddress = ContractInfo.analyticsAddress;
const analyticsAbi = ContractInfo.analyticsAbi;
router.get('/getKeys', function (req, res) {
})
module.exports = router;