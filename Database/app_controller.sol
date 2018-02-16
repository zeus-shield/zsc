/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";
import "./db_apis.sol";


contract APPController is Object {
    DBApis apiController_;

    function AppController(bytes32 _name) public Object(_name) {
        apiController_ = new DBApis("zsc_db");
    }

    function pushMessaeFromClient(string _metaData) public only_delegate {
        string temp = _metaData;
    }

}
