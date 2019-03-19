/** Copyright (c) 2018, ZSC Dev Team
  * 2018-10-19: v0.00.01
  */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../common/pausable.sol";
import "../common/delegate.sol";

contract InsuranceCompany {
    function update(string _key, string _data) external;
    function remove(string _key) external;
    function size() external view returns (uint);
    function getByKey(string _key) external view returns (int, string);
    function getById(uint _id) external view returns (int, string, string);
    // function getAll() external view returns (int, string);
}

contract InsuranceTemplate {
    function update(string _key, string _data) external;
    function remove(string _key) external;
    function size() external view returns (uint);
    // function getByKey(string _key) external view returns (int, string);
    function getById(uint _id) external view returns (int, string, string);
}

contract InsuranceUser {
    // function add(string _userKey, string _template, string _data) external;
    // function remove(string _key) external;
    function size() public view returns (uint);
    function exist(uint8 _type, string _key0, address _key1) public view returns (bool);
    // function getByKey(uint8 _type, string _key) external view returns (int, string);
    function getById(uint8 _type, uint _id) external view returns (int, string);
}

contract InsurancePolicy {
    // function add(string _userKey, string _templateKey, string _policyKey, string _data) external;
    // function addElement(string _key, string _elementKey, string _data) external;
    // function remove(string _key) external;
    function size() public view returns (uint);
    // function getByKey(uint8 _type, string _key) external view returns (int, string);
    function getById(uint8 _type, uint _id) external view returns (int, string);
    // function getKeys(uint _id, uint _count) external view returns (int, string);
}

contract InsuranceIntegral {
    // function claim(address _account, uint8 _type) public;
    function mint(address _account, uint _value) public;
    // function burn(address _account, uint _value) public;
    function transfer(address _owner, address _to, uint _value) public returns (bool);
    // function addTrace(address _account, uint8 _type, uint _time) public;
    // function removeTrace(address _account) public;
    function updateThreshold(uint8 _type, uint _threshold) public;
    function updateCap(uint _newCap) public;
    // function trace(address _account, uint _startTime, uint _endTime) public view returns (string);
    // function traceSize(address _account, uint _time, uint8 _type) public view returns (uint);
    function threshold(uint8 _type) public view returns (uint);
    function cap() public view returns (uint);
    function totalSupply() public view returns (uint);
    // function balanceOf(address _owner) public view returns (uint);
}

contract InsuranceExtension is Pausable, Delegate {

    address private companyAddr_;
    address private templateAddr_;
    address private userAddr_;
    address private policyAddr_;
    address private integralAddr_;

    modifier _checkCompanyAddr() {
        require(0 != companyAddr_);
        _;
    }

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    modifier _checkUserAddr() {
        require(0 != userAddr_);
        _;
    }

    modifier _checkPolicyAddr() {
        require(0 != policyAddr_);
        _;
    }

    modifier _checkIntegralAddr() {
        require(0 != integralAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    modifier _onlyReaderOrHigher() {
        require(checkDelegate(msg.sender, 3));
        _;
    }

    constructor() public {
        companyAddr_ = address(0);
        templateAddr_ = address(0);
        userAddr_ = address(0);
        policyAddr_ = address(0);
        integralAddr_ = address(0);
    }

    /** @dev Destroy the contract. */
    function destroy() public _onlyOwner {
        super.kill();
    }

    /** @dev Setup.
      * @param _companyAddr address The address of template contract.
      * @param _templateAddr address The address of template contract.
      * @param _userAddr address The address of user contract.
      * @param _policyAddr address The address of policy contract.
      * @param _integralAddr address The address of integral contract.
      */
    function setup(address _companyAddr, address _templateAddr, address _userAddr, address _policyAddr, address _integralAddr) external whenNotPaused _onlyOwner {
        // check params
        require(address(0) != _companyAddr);
        require(address(0) != _templateAddr);
        require(address(0) != _userAddr);
        require(address(0) != _policyAddr);
        require(address(0) != _integralAddr);
        companyAddr_ = _companyAddr;
        templateAddr_ = _templateAddr;
        userAddr_ = _userAddr;
        policyAddr_ = _policyAddr;
        integralAddr_ = _integralAddr;
    }

    /** @dev called by the owner to pause, triggers stopped state
      */
    function pause() public whenNotPaused _onlyOwner {
        super.pause();
    }

    /** @dev called by the owner to unpause, returns to normal state
      */
    function unpause() public whenPaused _onlyOwner {
        super.unpause();
    }

    /** @return true if the contract is paused, false otherwise.
      */
    function paused() public view _onlyOwner returns (bool) {
        return super.paused();
    }

    /** @dev Update company.
      * @param _key string The key of company.
      * @param _data string The data of company.
      */
    function companyUpdate(string _key, string _data) external whenNotPaused _onlyOwner _checkCompanyAddr {
        InsuranceCompany(companyAddr_).update(_key, _data);
    }

    /** @dev Remove company.
      * @param _key string The key of company.
      */
    function companyRemove(string _key) external whenNotPaused _onlyOwner _checkCompanyAddr {
        InsuranceCompany(companyAddr_).remove(_key);
    }

    /** @dev Get size of company.
      * @return The size of company.
      */
    function companySize() external view whenNotPaused _onlyReaderOrHigher _checkCompanyAddr returns (uint) {
        return InsuranceCompany(companyAddr_).size();
    }

    /** @dev Get company info by key.
      * @param _key string The key of company.
      * @return The error code and the data of template info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function companyGetByKey(string _key) external view whenNotPaused _onlyReaderOrHigher _checkCompanyAddr returns (int, string) {
        return InsuranceCompany(companyAddr_).getByKey(_key);
    }

    /** @dev Get company info by id.
      * @param _id uint The id of company.
      * @return The error code and the key/data of company.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function companyGetById(uint _id) external view whenNotPaused _onlyReaderOrHigher _checkCompanyAddr returns (int, string, string) {
        return InsuranceCompany(companyAddr_).getById(_id);
    }

    /** @dev Update template.
      * @param _key string The key of template.
      * @param _data string The data of template.
      */
    function templateUpdate(string _key, string _data) external whenNotPaused _onlyOwner _checkTemplateAddr {
        InsuranceTemplate(templateAddr_).update(_key, _data);
    }

    /** @dev Remove template.
      * @param _key string The key of template.
      */
    function templateRemove(string _key) external whenNotPaused _onlyOwner _checkTemplateAddr {
        InsuranceTemplate(templateAddr_).remove(_key);
    }

    /** @dev Get size of template.
      * @return The size of template.
      */
    function templateSize() external view whenNotPaused _onlyReaderOrHigher _checkTemplateAddr returns (uint) {
        return InsuranceTemplate(templateAddr_).size();
    }

    /** @dev Get template info by id.
      * @param _id uint The id of template.
      * @return The error code and the key/data of template.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function templateGetById(uint _id) external view whenNotPaused _onlyReaderOrHigher _checkTemplateAddr returns (int, string, string) {
        return InsuranceTemplate(templateAddr_).getById(_id);
    }

    /** @dev Get size of users.
      * @return The size of users.
      */
    function userSize() external view whenNotPaused _onlyReaderOrHigher _checkUserAddr returns (uint) {
        return InsuranceUser(userAddr_).size();
    }

    /** @dev Get user info by id.
      * @param _type uint8 The info type (0: detail, 1: brief).
      * @param _id uint The id of user.
      * @return The error code and the JSON data of user info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function userGetById(uint8 _type, uint _id) external view whenNotPaused _onlyReaderOrHigher _checkUserAddr returns (int, string) {
        return InsuranceUser(userAddr_).getById(_type, _id);
    }

    /** @dev Get size of policies.
      * @return The size of policies.
      */
    function policySize() external view whenNotPaused _onlyReaderOrHigher _checkPolicyAddr returns (uint) {
        return InsurancePolicy(policyAddr_).size();
    }

    /** @dev Get policy info by id.
      * @param _type uint8 The info type (0: detail, 1: brief).
      * @param _id uint The id of policy.
      * @return The error code and the JSON data of policy info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function policyGetById(uint8 _type, uint _id) external whenNotPaused _onlyReaderOrHigher _checkPolicyAddr view returns (int, string) {
        return InsurancePolicy(policyAddr_).getById(_type, _id);
    }

    /** @dev Mint integrals.
      * @param _account address The address that will receive the minted integrals.
      * @param _value uint The amount of integrals to mint.
      */
    function integralMint(address _account, uint _value) external whenNotPaused _onlyOwner _checkUserAddr _checkIntegralAddr {
        require(InsuranceUser(userAddr_).exist(1, "", _account));
        InsuranceIntegral(integralAddr_).mint(_account, _value);
    }

    /** @dev Update the threshold of different types of bonus integrals.
      * @param _type uint8 The types of bonus integrals.
      *         0: User sign up.
      *         1: User submit data.
      *         2: User check in every day.
      *         3: User invite others.
      *         4: User share to Wechat.
      *         5: User share to QQ.
      *         6: User share to Microblog.
      *         7: User click advertisements.
      * @param _threshold uint The threshold of different types of bonus integrals.
      */
    function integralUpdateThreshold(uint8 _type, uint _threshold) external whenNotPaused _onlyOwner _checkIntegralAddr {
        InsuranceIntegral(integralAddr_).updateThreshold(_type, _threshold);
    }

    /** @dev Update cap of integrals.
      * @param _newCap uint The new cap of integrals.
      */
    function integralUpdateCap(uint _newCap) external whenNotPaused _onlyOwner _checkIntegralAddr {
        InsuranceIntegral(integralAddr_).updateCap(_newCap);
    }

    /** @dev Get the threshold of different types of bonus integrals.
      * @param _type uint8 The types of bonus integrals.
      *         0: User sign up.
      *         1: User submit data.
      *         2: User check in every day.
      *         3: User invite others.
      *         4: User share to Wechat.
      *         5: User share to QQ.
      *         6: User share to Microblog.
      *         7: User click advertisements.
      * @return The threshold of different types of bonus integrals.
      */
    function integralThreshold(uint8 _type) external view whenNotPaused _onlyOwner _checkIntegralAddr returns (uint) {
        return InsuranceIntegral(integralAddr_).threshold(_type);
    }

    /** @dev Get the cap of integrals.
      * @return The cap of integrals.
      */
    function integralCap() external view whenNotPaused _onlyOwner _checkIntegralAddr returns (uint) {
        return InsuranceIntegral(integralAddr_).cap();
    }

    /** @dev Total number of integrals in existence
      * @return The total number of integrals.
      */
    function integralTotal() external view whenNotPaused _onlyOwner _checkIntegralAddr returns (uint) {
        return InsuranceIntegral(integralAddr_).totalSupply();
    }

    /** @dev Get contract related address.
      * @return The addresses of contract related.
      */
    function getAddr() external view whenNotPaused _onlyOwner returns (address, address, address, address, address) {
        return (companyAddr_, templateAddr_, userAddr_, policyAddr_, integralAddr_);
    }
}
