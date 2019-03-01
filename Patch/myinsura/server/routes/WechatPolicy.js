var express = require('express');
var router = express.Router();

import Insurance_policy from '../public/js/insurance_policy';
import ContractInfo from '../public/js/ContractInfo';

const policyAbi = ContractInfo.policyAbi;
const policyAddress = ContractInfo.policyAddress;

const account = "";
const accountkey = "";

router.get('/size', function (req, res) {
    let insurance_policy = new Insurance_policy(policyAbi,policyAddress);
    insurance_policy.size(function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"交易报错",
                error:error.toString(10)
            })
        } else {
            res.json({
                status:"success",
                code:"0",
                msg:"获取成功",
                data:result
            })
        }
    })
})


router.post('/getById', function (req, res) {
    //let id = 0;
    let id = req.body.Id;
    let insurance_policy = new Insurance_policy(policyAbi,policyAddress);
    insurance_policy.getById(0,id,function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"交易报错",
                error:error.toString(10)
            })
        } else {
            if(result[0] == -3) {//判断状态值//inner error
                res.json({
                    status:"success",
                    code:"-3",
                    msg:"合约出现问题，请稍后再试或联系管理员",
                    data:null
                })
