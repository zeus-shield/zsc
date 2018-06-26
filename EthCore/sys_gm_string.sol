        /*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";

contract SysGmString is SysGmBase {

    struct ParameterValues {
        uint count_;
        /* index => parameter */
        mapping(uint => bytes32) parameters_;
        /* parameter => index */
        mapping(bytes32 => uint) indexs_;
        /* parameter => register */
        mapping(bytes32 => bool) registers_;
        /* parameter => string */
        mapping(bytes32 => string) strings_;
    }

    struct UserHolderInfo {
        address holder_;
        mapping(address => bool) multisig_;
    }

    /* database name => user name => entity name => parameter value */
    mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => ParameterValues))) private entitys_;

    mapping(bytes32 => mapping(bytes32 => UserHolderInfo)) private userHolders_;

    function SysGmString(bytes32 _name) public SysGmBase(_name) {}

    function checkHolder(bytes32 _dbName, bytes32 _userName, address _holder) internal constant {
        require(_holder == userHolders_[_dbName][_userName].holder_);
    }

    function registerHolder(bytes32 _dbName, bytes32 _userName, address _holder) public {
        checkDelegate(msg.sender, 1);
        userHolders_[_dbName][_userName].holder_ = _holder;
    }

    function addEntityParameter(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        /* check register */
        if(true == entitys_[_dbName][_userName][_enName].registers_[_parameter]) {
            return true;
        }
        
        uint count = entitys_[_dbName][_userName][_enName].count_;
        entitys_[_dbName][_userName][_enName].parameters_[count] = _parameter;
        entitys_[_dbName][_userName][_enName].indexs_[_parameter] = count;
        entitys_[_dbName][_userName][_enName].registers_[_parameter] = true;
        entitys_[_dbName][_userName][_enName].count_ ++;

        return true;
    }

    function setEntityParameterValue(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter, string _value) public returns (bool) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        /* check register */
        if(false == entitys_[_dbName][_userName][_enName].registers_[_parameter]) {
            require(addEntityParameter(_dbName, _userName, _enName, _parameter));
        }

        entitys_[_dbName][_userName][_enName].strings_[_parameter] = _value;

        return true;
    }

    function numEntityParameters(bytes32 _dbName, bytes32 _userName, bytes32 _enName) public view returns (uint) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        return  entitys_[_dbName][_userName][_enName].count_;
    }

    function getEntityParameterValue(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter) public view returns (string) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        /* check register */
        require(entitys_[_dbName][_userName][_enName].registers_[_parameter]);

        string memory str = entitys_[_dbName][_userName][_enName].strings_[_parameter];

        return str;
    }

    function getEntityParameterByIndex(bytes32 _dbName, bytes32 _userName, bytes32 _enName, uint _index) public view returns (bytes32) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        /* check param */
        require(entitys_[_dbName][_userName][_enName].count_ >= (_index  + 1));

        bytes32 parameter = entitys_[_dbName][_userName][_enName].parameters_[_index];

        /* check register */
        require(entitys_[_dbName][_userName][_enName].registers_[parameter]);

        return parameter;
    }

    function removeEntityParameterValue(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        /* check register */
        require(entitys_[_dbName][_userName][_enName].registers_[_parameter]);

        uint index = entitys_[_dbName][_userName][_enName].indexs_[_parameter];

        delete entitys_[_dbName][_userName][_enName].parameters_[index];
        delete entitys_[_dbName][_userName][_enName].indexs_[_parameter];
        delete entitys_[_dbName][_userName][_enName].registers_[_parameter];
        delete entitys_[_dbName][_userName][_enName].strings_[_parameter];

        return true;
    }

    function removeEntityParameterValueByIndex(bytes32 _dbName, bytes32 _userName, bytes32 _enName, uint _index) public returns (bool) {
        /* check holder */
        checkHolder(_dbName, _userName, msg.sender);

        /* check param */
        require(entitys_[_dbName][_userName][_enName].count_ >= (_index  + 1));

        bytes32 parameter = entitys_[_dbName][_userName][_enName].parameters_[_index];

        /* check register */
        require(entitys_[_dbName][_userName][_enName].registers_[parameter]);

        return removeEntityParameterValue(_dbName, _userName, _enName, parameter);
    }
}