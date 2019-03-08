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
    let insurance_template = new Insurance_template(temAbi,temAddress);
    insurance_template.getById(id,function(error, result) {
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
                    msg:"该模板不存在",
                    data:null
                })
            }  else if (result[0] == 0) {//success
                res.json({
                    status:"success",
                    code:"0",
                    msg:"模板获取成功",
                    data:result
                })
            }
        }
    })
})

router.post('/getByKey', function (req, res) {
    //let key = "DB_User";
    let key = req.body.Key;
    let insurance_template = new Insurance_template(temAbi,temAddress);
    insurance_template.getByKey(key,function(error, result) {
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
                    msg:"交易失败",
                    data:null
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
                        msg:"该模板不存在",
                        data:null
                    })
                }  else if (result[0] == 0) {//success
                    res.json({
                        status:"success",
                        code:"0",
                        msg:"模板获取成功",
                        data:result[1]
                    })
                }
            }
        }
    })
})

router.post('/update', function (req, res) {
    //let key = "DB_User";
    //let data = "Key#Password#NickName#SignUpTime#UpdateTime#Policies#Receipts";
    //let key = "DB_Policy_PingAn_Life";
    //let data = "Key#UserKey#Insurant#Sex#Age#Amount#StartTime#Period#Description";
    let key = req.body.Key;
    let data = req.body.Data;
    let insurance_template = new Insurance_template(temAbi,temAddress);
    insurance_template.update(account,accountkey,key,data,function(error, result) {
        if(error) {
            res.json({
                status:"error",
                code:"-9",
                msg:"交易报错",
                error:error.toString(10)
            })
        } else {
            if(result.status == ""){
                console.log("=====padding=====")
            } else {
                if(result.status == "0x0") {
                    res.json({
                        status:"fail",
                        code:"-6",
                        msg:"交易失败",
                        data:null
                    })
                } else {
                    res.json({
                        status:"success",
                        code:"0",
                        msg:"保存成功",
                        data:null
                    })
                }
            }
        }
    })
})

module.exports = router;