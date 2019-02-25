var express = require('express');
var router = express.Router();
const axios = require('axios');
var crypto = require('crypto');

import Insurance_user from '../public/js/insurance_user';
import ContractInfo from '../public/js/ContractInfo';

const userAbi = ContractInfo.userAbi;
const userAddress = ContractInfo.userAddress;

const account = "";
const accountkey = "";

const appid = "";
const secret = "";

//const appid = "";
//const secret = "";

const encryptKey = "";

router.post('/login', function (req, res) {
    //let code = "sss";
    let code = req.body.Code;
    let nickName = req.body.NickName;
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
   
    axios.get(url)
        .then(response => {
            if(response.data.errcode) {
                res.json({
                    status:"fail",
                    code:"1",
                    msg:"该用户身份识别有问题",
                    data:response.data
                })
            } else {
                //加密
               

                let temKey = "DB_User";
                let insurance_user = new Insurance_user(userAbi,userAddress);
                insurance_user.getByKey(0,key,function(error, result) {
                    if(error) {
                        console.log(error);
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
                                result[0] = result[0].toString(10);
                                console.log(result);
                                if(result[0] == -3) {//判断状态值//inner error
                                    res.json({
                                        status:"success",
                                        code:"-3",
                                        msg:"合约出现问题，请稍后再试或联系管理员",
                                        data:null
                                    })
