var keythereum = require("keythereum");
  
var datadir = "D:\\MyChain";
//var datadir = "C:\\Users\\ASUS\\AppData\\Roaming\\Ethereum";

var address= "0x15ca13630ce52cd4e209012635f10b396e098296";
const password = "";

//var address= "0xb9403395cd228a61ab4e035c5b867ea5dc13674d";
//const password = "88888888";

var keyObject = keythereum.importFromFile(address, datadir);

var privateKey = keythereum.recover(password, keyObject);

console.log("[address]", address);
console.log("[privateKey]", "0x" + privateKey.toString('hex'));