var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    num: { type: String, default: '' },
    startTime: { type: String, default: '' },
    // firstHash: { type: String, default: '' },
    // secondHash: { type: String, default: '' },
    // thirdHash: { type: String, default: '' },
    // fourthHash:{ type: String, default: ''},
    // fifthHash:{ type: String, default: ''},
    hashList:{ "type": "array", "items": "string", default: ''},
   
});
