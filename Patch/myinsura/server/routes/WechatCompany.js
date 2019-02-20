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
    //let Id = 0;
    let Id = req.body.Id;
    let insurance_company = new Insurance_company(companyAbi,companyAddress);
    insurance_company.getById(Id,function(error, result) {
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
            } else if (result[0] == -1) {//params error
                res.json({
                    status:"success",
                    code:"-1",
                    msg:"参数有问题，请检查是否输入正确",
                    data:null
                })
            } else if (result[0] == -2) {//no data
                res.json({
                    status:"success",
