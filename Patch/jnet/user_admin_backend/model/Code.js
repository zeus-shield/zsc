var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    key: { type: String, default: '' },
    value: { type: String, default: '' },
});

module.exports = mongoose.model('Code', CodeSchema);