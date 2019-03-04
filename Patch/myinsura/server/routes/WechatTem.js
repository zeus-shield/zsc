var express = require('express');
var router = express.Router();

import Insurance_template from '../public/js/insurance_template';
import ContractInfo from '../public/js/ContractInfo';

const temAbi = ContractInfo.temAbi;
const temAddress = ContractInfo.temAddress;

const account = "";
const accountkey = "";

router.get('/size', function (req, res) {
    let insurance_template = new Insurance_template(temAbi,temAddress);
    insurance_template.size(function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"½»Ò×±¨´í",
                error:error.toString(10)
            })
