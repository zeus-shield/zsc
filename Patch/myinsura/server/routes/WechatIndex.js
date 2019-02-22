var express = require('express');
var router = express.Router();
const axios = require('axios');
var crypto = require('crypto');

import Insurance_user from '../public/js/insurance_user';
import ContractInfo from '../public/js/ContractInfo';

const userAbi = ContractInfo.userAbi;
const userAddress = ContractInfo.userAddress;
