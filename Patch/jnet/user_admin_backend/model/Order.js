var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    num: { type: String, default: '' },
    startTime: { type: String, default: '' },
    hashList:{ "type": "array", "items": "string", default: ''},
   
});

module.exports = mongoose.model('Order', OrderSchema);