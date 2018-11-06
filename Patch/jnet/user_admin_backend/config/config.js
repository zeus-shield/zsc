const path = require('path');

let dev = "http://localhost:3001";
let produ = "";

let serverPath = dev;

let robotSavePath = path.resolve(__dirname,'../public/images/robot')
let robotServerPath = `${serverPath}/images/robot`;
