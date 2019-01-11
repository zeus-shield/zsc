var express = require('express');
var router = express.Router();
const Code = require('../model/Code');

router.get('/getCode', function (req, res) {
   let code = {};

   Code.find(code, (err, doc) => {
        if(err) {
            return console.log(err);
        }
        let para = [];

        for(let i = 0; i < doc.length; i++) {
            para.push({ key   : doc[i].key,
                        value : doc[i].value });
        }
        
        res.json({
            code: para,
        })
   })
})

router.post('/saveCode', function(req, res, next) {
    let code = {
        key:    req.body.key,
        value:  req.body.value
    };
    
    Code.findOne(code, (err, doc) => {
        if (err) {
            return console.log(err);
        }
        if (doc) {
            Code.remove(code, (err, result) => {
                if (err) {
                    return console.log(err);
                 }else {
                 new Code(req.body).save();
                 res.json({
			status:4,
			msg:"添加成功",
			result:'',
                 })
	          }
            })
        } else {
	    new Code(req.body).save();
	    res.json({
		status:4,
		msg:"添加成功",
		result:'',		
	    })
	}
   })
})

module.exports = router;