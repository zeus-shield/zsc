const formidable = require('formidable'); //文件处理模块
const fs = require('fs'); //文件模块
const path = require('path'); //path模块


module.exports = function(req) {
    const form = new formidable.IncomingForm();
    let uploadDir = path.resolve(__dirname,'../public/images/robot');

    form.uploadDir = uploadDir; //存储目录
    form.keepExtensions = true; //保留后缀
    form.encoding = 'utf-8'; //设置编码
    form.maxFieldsSize = 2 * 1024 //设置最大文件
    console.log(4)
    return new Promise(function(resolve, reject) {
        form.parse(req, function(err, fields, files) {
            if (err) {
                return console.log(err);
            }
            resolve({
                fields,
                files
            });
        })
    })


}