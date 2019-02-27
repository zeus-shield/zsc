var express = require('express');
var router = express.Router();

import Insurance_policy from '../public/js/insurance_policy';
import ContractInfo from '../public/js/ContractInfo';

const policyAbi = ContractInfo.policyAbi;
const policyAddress = ContractInfo.policyAddress;
