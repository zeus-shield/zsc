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
                    code:"-2",
                    msg:"该公司没有险种",
                    data:null
                })
            }  else if (result[0] == 0) {//success
                res.json({
                    status:"success",
                    code:"0",
                    msg:"公司所有险种获取成功",
                    data:result
                })
            }
        }
    })
})

router.post('/getByKey', function (req, res) {
    //let Key = "PingAn";
    let Key = req.body.Key;
    let insurance_company = new Insurance_company(companyAbi,companyAddress);
    insurance_company.getByKey(Key,function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"交易报错",
                error:error.toString(10)
            })
        } else {
            if(result.status == "0x0") {
                res.json({
                    status:"fail",
                    code:"-6",
                    msg:"交易失败"
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
                        code:"-2",
                        msg:"该公司没有险种",
                        data:null
                    })
                }  else if (result[0] == 0) {//success
                    res.json({
                        status:"success",
                        code:"0",
                        msg:"公司所有险种获取成功",
                        data:result
                    })
                }
            }
        }
    })
})

router.get('/getAll', function (req, res) {
    let insurance_company = new Insurance_company(companyAbi,companyAddress);
    insurance_company.getAll(function(error, result) {
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
                    code:"-2",
                    msg:"没有公司及险种",
                    data:null
                })
            }  else if (result[0] == 0) {//success
                res.json({
                    status:"success",
                    code:"0",
                    msg:"订单获取成功",
                    data:result
                })
            }
        }
    })
})
