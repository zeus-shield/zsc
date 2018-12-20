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
