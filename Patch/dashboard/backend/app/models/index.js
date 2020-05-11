'use strict';

const mdbs = {};
mdbs.User = require('./user');
mdbs.Company = require('./company');
mdbs.Insurance = require('./insurance');
mdbs.QA = require('./qa');
// mdbs.Role = require('./role');
// mdbs.Right = require('./right');
// mdbs.Article = require('./article');
// mdbs.ArticleCategory = require('./category');

module.exports = mdbs;