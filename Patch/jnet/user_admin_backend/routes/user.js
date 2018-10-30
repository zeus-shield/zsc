/*
*！！！！！！！！此文件内写有密码，不得上传至git！！！！！！！！！
*！！！！！！！！此文件内写有密码，不得上传至git！！！！！！！！！
*！！！！！！！！此文件内写有密码，不得上传至git！！！！！！！！！
*！！！！！！！！此文件内写有密码，不得上传至git！！！！！！！！！
*！！！！！！！！此文件内写有密码，不得上传至git！！！！！！！！！
*！！！！！！！！此文件内写有密码，不得上传至git！！！！！！！！！
*/

var express = require('express');
var router = express.Router();
const axios = require('axios');
const Order = require('./../model/Order');

router.post('/getTrack', function (req, res) {
    let para = { num: req.body.num };
    let url = `http://api2.j-net.cn/track/${para.num}`;

    axios.get(url)
        .then(response => {
            res.json({
                date: response.data
            })
        })
        .catch(error => {
            console.log(error);
        });
})

router.post('/getNums', function (req, res) {
    let para = { beginTime: req.body.beginTime , endTime: req.body.endTime };
    axios({
        url: `http://api2.j-net.cn/track/list?beginTime=${para.beginTime}&endTime=${para.endTime}`,
        method: 'get',
        auth: {
            username: '',
            password: ''
        }
        
    })
        .then(response => {
            res.json({
                date: response.data
            })
        })
        .catch(error => {
            console.log(error);
        });
})

//添加订单信息至数据库
router.post('/add', function (req, res) {
    let order = {
        num:    req.body.num,
    };
    
    Order.findOne(order, (err, doc) => {
        if (err) {
            return console.log(err);
        }
        if (doc) {
            Order.remove(order, (err, result) => {
                if (err) {
                    return console.log(err);
                 }else {
                 new Order(req.body).save();
                 res.json({
			status:4,
			msg:"添加成功",
			result:'',
                 })
	          }
            })
        } else {
	    new Order(req.body).save();
	    res.json({
		status:4,
		msg:"添加成功",
		result:'',		
	    })
	}
   })
})

router.get('/getOrder', function (req, res) {
    let num = {
            num:    req.query[0]
    };
    
    Order.findOne(num, function (err, doc) {
        if (err) {
            return console.log(err);
        }
        res.json({
            users: doc
        })
   })

})

router.get('/getContractInfo', function (req, res) {
    res.json({
        address: "0x991b5ab978b457f668a03821b9355faf2a46fea9",
        abi: [{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"exist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getBriefByIndex","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"numberOfTracks","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"string"},{"name":"_lastStatus","type":"string"}],"name":"updateBrief","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getBriefEx","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getBriefExByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getTracks","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_brief","type":"string"}],"name":"updateBriefEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_info","type":"string"}],"name":"updateEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"}],"name":"remove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"}],"name":"invalid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"number","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_tracks","type":"string"},{"name":"_updateType","type":"uint256"}],"name":"updateTracks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"},{"name":"_invalidIndex","type":"uint256"}],"name":"getBriefInvalid","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"string"},{"name":"_lastStatus","type":"string"},{"name":"_tracks","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getBrief","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"numberOfInvalidNums","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    })
   
})

module.exports = router;

