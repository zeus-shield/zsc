'use strict';

require('babel-register');
const proj = process.argv[2];
if (proj === undefined) {
  console.log('Project is undefined, project config error!');
} else {
  if (proj === 'dashboard') {
    console.log('Project(dashboard) config success!');
    require('./app');
  } else {
    console.log('No project(' + proj + '), project config error!');
  }
}
