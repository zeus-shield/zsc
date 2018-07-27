/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";

/** @title String manager. */
contract SysGmString is SysGmBase {

    // parameter mapping string
    struct ParameterValues {
        uint count_;
        // index => parameter
        mapping(uint => bytes32) parameters_;
        // parameter => index
        mapping(bytes32 => uint) indexs_;
        // parameter => register
        mapping(bytes32 => bool) registers_;
        // parameter => string
        mapping(bytes32 => string) strings_;
    }

    // user holder info
    struct UserHolderInfo {
        address holder_;
        mapping(address => bool) multisig_;
    }

    // database name => user name => entity name => parameter value
    mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => ParameterValues))) private entitys_;

    // database name => user name => holder
    mapping(bytes32 => mapping(bytes32 => UserHolderInfo)) private userHolders_;

    // constructor
    function SysGmString(bytes32 _name) public SysGmBase(_name) {}

    // check holder.
    function checkHolder(bytes32 _dbName, bytes32 _userName, address _holder) internal view {
        require(_holder == userHolders_[_dbName][_userName].holder_);
    }

    /** @dev Register holder.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _holder(address): Address of the holder.
      * @return none.
      */
    function registerHolder(bytes32 _dbName, bytes32 _userName, address _holder) external {
        checkDelegate(msg.sender, 1);
        userHolders_[_dbName][_userName].holder_ = _holder;
    }

    /** @dev Add parameter.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @param _parameter(bytes32): Name of parameter.
      * @return (bool): The result(true/false).
      */
    function addEntityParameter(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName, bytes32 _parameter) external returns (bool) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        // check register
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

    /** @dev Set string.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @param _parameter(bytes32): Name of parameter.
      * @param _value(string): Value of string.
      * @return (bool): The result(true/false).
      */
    function setEntityParameterValue(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName, bytes32 _parameter, string _value) external returns (bool) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        // check register
        if(false == entitys_[_dbName][_userName][_enName].registers_[_parameter]) {
            require(addEntityParameter(_dbName, _userName, _enName, _parameter));
        }

        entitys_[_dbName][_userName][_enName].strings_[_parameter] = _value;

        return true;
    }

    /** @dev Get number of string.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @return (uint): Number of string.
      */
    function numEntityParameters(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName) external view returns (uint) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        return  entitys_[_dbName][_userName][_enName].count_;
    }

    /** @dev Get string.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @param _parameter(bytes32): Name of parameter.
      * @return (string): Value of string.
      */
    function getEntityParameterValue(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName, bytes32 _parameter) external view returns (string) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        // check register
        require(entitys_[_dbName][_userName][_enName].registers_[_parameter]);

        string memory str = entitys_[_dbName][_userName][_enName].strings_[_parameter];

        return str;
    }

    /** @dev Get parameter by index.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @param _index(uint): index of parameter.
      * @return (bytes32): Name of parameter.
      */
    function getEntityParameterByIndex(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName, uint _index) external view returns (bytes32) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        // check param
        require(entitys_[_dbName][_userName][_enName].count_ >= (_index  + 1));

        bytes32 parameter = entitys_[_dbName][_userName][_enName].parameters_[_index];

        // check register
        require(entitys_[_dbName][_userName][_enName].registers_[parameter]);

        return parameter;
    }

    /** @dev Remove string.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @param _parameter(bytes32): Name of parameter.
      * @return (bool): The result(true/false).
      */
    function removeEntityParameterValue(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName, bytes32 _parameter) external returns (bool) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        // check register
        require(entitys_[_dbName][_userName][_enName].registers_[_parameter]);

        uint index = entitys_[_dbName][_userName][_enName].indexs_[_parameter];

        delete entitys_[_dbName][_userName][_enName].parameters_[index];
        delete entitys_[_dbName][_userName][_enName].indexs_[_parameter];
        delete entitys_[_dbName][_userName][_enName].registers_[_parameter];
        delete entitys_[_dbName][_userName][_enName].strings_[_parameter];

        return true;
    }

    /** @dev Remove string by index.
      * @param _dbName(bytes32): Name of the database.
      * @param _userName(bytes32): Name of the user.
      * @param _enName(bytes32): Name of the entity.
      * @param _index(uint): Index of parameter.
      * @return (bool): The result(true/false).
      */
    function removeEntityParameterValueByIndex(
        bytes32 _dbName, bytes32 _userName,
        bytes32 _enName, uint _index) external returns (bool) {
        // check holder
        checkHolder(_dbName, _userName, msg.sender);

        // check param
        require(entitys_[_dbName][_userName][_enName].count_ >= (_index  + 1));

        bytes32 parameter = entitys_[_dbName][_userName][_enName].parameters_[_index];

        // check register
        require(entitys_[_dbName][_userName][_enName].registers_[parameter]);

        return removeEntityParameterValue(_dbName, _userName, _enName, parameter);
    }
}