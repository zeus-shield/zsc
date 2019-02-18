var express = require('express');
var router = express.Router();

import Insurance_company from '../public/js/insurance_company';
import ContractInfo from '../public/js/ContractInfo';

const companyAbi = ContractInfo.companyAbi;
const companyAddress = ContractInfo.companyAddress;

const account = "";
const accountkey = "";

router.get('/size', function (req, res) {
    let insurance_company = new Insurance_company(companyAbi,companyAddress);
    insurance_company.size(function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"½»Ò×±¨´í",
                error:error.toString(10)
            })
        } else {
