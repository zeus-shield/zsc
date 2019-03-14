/** Copyright (c) 2018, ZSC Dev Team
  * 2018-10-19: v0.00.01
  */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../utillib/LibInt.sol";
import "../common/delegate.sol";

contract InsuranceCompany {
    function update(string _key, string _data) external;
    function remove(string _key) external;
    function size() external view returns (uint);
    function getByKey(string _key) external view returns (int, string);
    function getById(uint _id) external view returns (int, string, string);
    function getAll() external view returns (int, string);
}

contract InsuranceTemplate {
    function update(string _key, string _data) external;
    function remove(string _key) external;
    function size() external view returns (uint);
    function getByKey(string _key) external view returns (int, string);
    function getById(uint _id) external view returns (int, string, string);
}

contract InsuranceUser {
    function add(string _userKey, string _template, string _data) external;
    function remove(string _key) external;
    function size() public view returns (uint);
    function exist(uint8 _type, string _key0, address _key1) public view returns (bool);
    function getByKey(uint8 _type, string _key) external view returns (int, string);
    function getById(uint8 _type, uint _id) external view returns (int, string);
}

contract InsurancePolicy {
    function add(string _userKey, string _templateKey, string _policyKey, string _data) external;
    function addElement(string _key, string _elementKey, string _data) external;
    function remove(string _key) external;
    function size() public view returns (uint);
    function getByKey(uint8 _type, string _key) external view returns (int, string);
    function getById(uint8 _type, uint _id) external view returns (int, string);
    function getKeys(uint _id, uint _count) external view returns (int, string);
}

contract InsuranceIntegral {
    function claim(uint8 _type, address _account) public;
    function mint(address _account, uint _value) public;
    function burn(address _account, uint _value) public;
    function transfer(address _owner, address _to, uint _value) public returns (bool);
    function balanceOf(address owner) public view returns (uint);
}

contract InsuranceUserPolicy is Delegate {

    using LibString for *;
    using LibInt for *;

    struct strArray {
        /** @dev id start from '1', '0' means no exists */
        mapping(string => uint) ids_;
        mapping(uint => string) strs_;
        uint sum_;
    }

    address private companyAddr_;
    address private templateAddr_;
    address private userAddr_;
    address private policyAddr_;
    address private integralAddr_;
    string[] private keys_;

    /** @dev string(original policy key) => uint(max id)
      * @eg ddroyce@163.com_PingAn_Life => 9
      */
    mapping(string => uint) private maxIds_;

    /** @dev string(user key) => strArray(policy keys) */
    mapping(string => strArray) private policyKeys_;

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

    /** @dev Add policy key.
      * @param _userKey string The key of user.
      * @param _policyKey string The key of policy.
      */
    function _addPolicyKey(string _userKey, string _policyKey) private {
        // check exists
        if (0 != policyKeys_[_userKey].ids_[_policyKey]) {
            return;
        }

        uint sum = ++policyKeys_[_userKey].sum_;
        policyKeys_[_userKey].ids_[_policyKey] = sum;
        policyKeys_[_userKey].strs_[sum] = _policyKey;
    }

    /** @dev Remove policy key.
      * @param _userKey string The key of user.
      * @param _policyKey string The key of policy.
      */
    function _removePolicyKey(string _userKey, string _policyKey) private {
        uint sum = policyKeys_[_userKey].sum_;
        // check sum
        require(0 != sum);
        // check exists
        require(0 != policyKeys_[_userKey].ids_[_policyKey]);

        string memory key2 = policyKeys_[_userKey].strs_[sum];
        // check exists
        require(0 != policyKeys_[_userKey].ids_[key2]);

        // swap
        uint id1 = policyKeys_[_userKey].ids_[_policyKey];
        uint id2 = policyKeys_[_userKey].ids_[key2];

        policyKeys_[_userKey].strs_[id1] = key2;
        policyKeys_[_userKey].strs_[id2] = _policyKey;

        policyKeys_[_userKey].ids_[_policyKey] = id2;
        policyKeys_[_userKey].ids_[key2] = id1;

        delete policyKeys_[_userKey].strs_[sum];
        policyKeys_[_userKey].ids_[_policyKey] = 0;
        policyKeys_[_userKey].sum_ --;
    }

    /** @dev Remove policy.
      * @param _policyKey string The key of policy.
      */
    function _removePolicy(string _policyKey) private {
        _policyKey.split("_", keys_);

        // 1. remove policy key for insurance_user_policy.sol
        _removePolicyKey(keys_[0], _policyKey);


        // 2. remove policy for insurance_policy.sol
        InsurancePolicy(policyAddr_).remove(_policyKey);
    }

    /** @dev Setup.
      * @param _companyAddr address The address of template contract.
      * @param _templateAddr address The address of template contract.
      * @param _userAddr address The address of user contract.
      * @param _policyAddr address The address of policy contract.
      * @param _integralAddr address The address of integral contract.
      */
    function setup(address _companyAddr, address _templateAddr, address _userAddr, address _policyAddr, address _integralAddr) external _onlyOwner {
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

    /** @dev Update company.
      * @param _key string The key of company.
      * @param _data string The data of company.
      */
    function companyUpdate(string _key, string _data) external _onlyAdminOrHigher _checkCompanyAddr {
        InsuranceCompany(companyAddr_).update(_key, _data);
    }

    /** @dev Remove company.
      * @param _key string The key of company.
      */
    function companyRemove(string _key) external _onlyAdminOrHigher _checkCompanyAddr {
        InsuranceCompany(companyAddr_).remove(_key);
    }

    /** @dev Get size of company.
      * @return The size of company.
      */
    function companySize() external _checkCompanyAddr view returns (uint) {
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
    function companyGetByKey(string _key) external _checkCompanyAddr view returns (int, string) {
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
    function companyGetById(uint _id) external _checkCompanyAddr view returns (int, string, string) {
        return InsuranceCompany(companyAddr_).getById(_id);
    }

    /** @dev Get all companies' info.
      * @return The error code and the all companies' data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function companyGetAll() external _checkCompanyAddr view returns (int, string) {
        return InsuranceCompany(companyAddr_).getAll();
    }

    /** @dev Update template.
      * @param _key string The key of template.
      * @param _data string The data of template.
      */
    function templateUpdate(string _key, string _data) external _onlyAdminOrHigher _checkTemplateAddr {
        InsuranceTemplate(templateAddr_).update(_key, _data);
    }

    /** @dev Remove template.
      * @param _key string The key of template.
      */
    function templateRemove(string _key) external _onlyAdminOrHigher _checkTemplateAddr {
        InsuranceTemplate(templateAddr_).remove(_key);
    }

    /** @dev Get size of template.
      * @return The size of template.
      */
    function templateSize() external _checkTemplateAddr view returns (uint) {
        return InsuranceTemplate(templateAddr_).size();
    }

    /** @dev Get template info by key.
      * @param _key string The key of template.
      * @return The error code and the data of template info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function templateGetByKey(string _key) external _checkTemplateAddr view returns (int, string) {
        return InsuranceTemplate(templateAddr_).getByKey(_key);
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
    function templateGetById(uint _id) external _checkTemplateAddr view returns (int, string, string) {
        return InsuranceTemplate(templateAddr_).getById(_id);
    }

    /** @dev Add user.
      * @param _userKey string The key of user.
      * @param _templateKey string The key of user template.
      * @param _data string The JSON data of user.
      */
    function userAdd(string _userKey, string _templateKey, string _data) external _onlyAdminOrHigher _checkTemplateAddr _checkUserAddr _checkIntegralAddr {
        // check param
        require(0 != bytes(_userKey).length);
        require(0 != bytes(_templateKey).length);
        require(0 != bytes(_data).length);

        string memory template = "";
        int error = 0;
        (error, template) = InsuranceTemplate(templateAddr_).getByKey(_templateKey);
        require(0 == error);

        InsuranceUser(userAddr_).add(_userKey, template, _data);
        InsuranceIntegral(integralAddr_).claim(0, _userKey.toAddress());
    }

    /** @dev Remove user.
      * @param _key string The key of user.
      */
    function userRemove(string _key) external _onlyAdminOrHigher _checkUserAddr _checkPolicyAddr _checkIntegralAddr {
        // check param
        require(0 != bytes(_key).length);

        // remove integral
        address account = _key.toAddress();
        uint value = InsuranceIntegral(integralAddr_).balanceOf(account);
        if (0 < value) {
            integralBurn(account, value);
        }

        // remove policies
        uint size = policyKeys_[_key].sum_;
        for (uint i=0; i<size; i++) {
            string memory policyKey = policyKeys_[_key].strs_[1];
            _removePolicy(policyKey);
        }
        // remove user
        InsuranceUser(userAddr_).remove(_key);
    }

    /** @dev Get size of users.
      * @return The size of users.
      */
    function userSize() external _checkUserAddr view returns (uint) {
        return InsuranceUser(userAddr_).size();
    }

    /** @dev Check that if user exist
      * @param _type uint8 The info type (0: key is string, 1: key is address).
      * @param _key0 string The key of user for string.
      * @param _key1 address The key of user for address.
      * @return true/false.
      */
    function userExist(uint8 _type, string _key0, address _key1) external _checkUserAddr view returns (bool) {
        return InsuranceUser(userAddr_).exist(_type, _key0, _key1);
    }

    /** @dev Get user info by key.
      * @param _type uint8 The info type (0: detail, 1: brief).
      * @param _key string The key of user.
      * @return The error code and the JSON data of user info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function userGetByKey(uint8 _type, string _key) external _checkUserAddr view returns (int, string) {
        return InsuranceUser(userAddr_).getByKey(_type, _key);
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
    function userGetById(uint8 _type, uint _id) external _checkUserAddr view returns (int, string) {
        return InsuranceUser(userAddr_).getById(_type, _id);
    }

    /** @dev Get user policies by key.
      * @param _userKey string The key of user.
      * @return Error code and user policies info for JSON data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error
      */
    function userGetPolicies(string _userKey) external view returns (int, string) {
        // check param
        if (0 == bytes(_userKey).length) {
            return (-1, "");
        }
        
        uint sum = policyKeys_[_userKey].sum_;
        if (0 == sum) {
            return (-2, "");
        }

        string memory str = "";
        for (uint i=1; i<=sum; i++) {
            str = str.concat(policyKeys_[_userKey].strs_[i]);
            if (sum > i) {
                str = str.concat(",");
            }
        }

        return (0, str);
    }

    /** @dev Add policy.
      * @param _userKey string The key of user.
      * @param _templateKey string The key of policy template.
      * @param _policyKey string The key of policy.
      * @param _data string The JSON data of policy.
      */
    function policyAdd(string _userKey, string _templateKey, string _policyKey, string _data) external _onlyAdminOrHigher _checkPolicyAddr {
        // check param
        require(0 != bytes(_userKey).length);
        require(0 != bytes(_templateKey).length);
        require(0 != bytes(_policyKey).length);
        require(0 != bytes(_data).length);

        string memory template = "";
        int error = 0;
        (error, template) = InsuranceTemplate(templateAddr_).getByKey(_templateKey);
        require(0 == error);

        string memory policyKey = _policyKey.concat("_", maxIds_[_policyKey].toString());
        InsurancePolicy(policyAddr_).add(_userKey, policyKey, template, _data);

        _addPolicyKey(_userKey, policyKey);

        maxIds_[_policyKey] ++;
    }

    /** @dev Add policy's element.
      * @param _key string The key of policy.
      * @param _elementKey string The key of policy element.
      * @param _data string The element data of policy.
      */
    function policyAddElement(string _key, string _elementKey, string _data) external _onlyAdminOrHigher _checkPolicyAddr {
        InsurancePolicy(policyAddr_).addElement(_key, _elementKey, _data);
    }

    /** @dev Remove policy.
      * @param _key string The key of policy.
      */
    function policyRemove(string _key) external _onlyAdminOrHigher _checkPolicyAddr {
        // check param
        require(0 != bytes(_key).length);
        _removePolicy(_key);
    }

    /** @dev Get size of policies.
      * @return The size of policies.
      */
    function policySize() external _checkPolicyAddr view returns (uint) {
        return InsurancePolicy(policyAddr_).size();
    }

    /** @dev Get policy info by key.
      * @param _type uint8 The info type (0: detail, 1: brief).
      * @param _key string The key of policy.
      * @return The error code and the JSON data of policy info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error  
      */
    function policyGetByKey(uint8 _type, string _key) external _checkPolicyAddr view returns (int, string) {
        return InsurancePolicy(policyAddr_).getByKey(_type, _key);
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
    function policyGetById(uint8 _type, uint _id) external _checkPolicyAddr view returns (int, string) {
        return InsurancePolicy(policyAddr_).getById(_type, _id);
    }    

    /** @dev Get policy keys.
      * @param _id uint The starting id of policy.
      * @param _count uint The count wanted(include starting id).
      * @return The error code and the info
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function policyGetKeys(uint _id, uint _count) external view returns (int, string) {
        return InsurancePolicy(policyAddr_).getKeys(_id, _count);
    }

    /** @dev Claim integrals.
      * @param _type uint8 The types of bonus integrals.
      *         0: User sign up.
      *         1: User submit data.
      *         2: User check in everyday.
      *         3: User invite others.
      *         4: User share to Wechat.
      *         5: User share to QQ.
      *         6: User share to Microblog.
      *         7: User click advertisements.
      * @param _account address The address that will claim the integrals.
      */
    function integralClaim(uint8 _type, address _account) external _onlyAdminOrHigher _checkUserAddr _checkIntegralAddr {
        require(InsuranceUser(userAddr_).exist(1, "", _account));
        InsuranceIntegral(integralAddr_).claim(_type, _account);
    }

    /** @dev Mint integrals.
      * @param _account address The address that will receive the minted integrals.
      * @param _value uint The amount of integrals to mint.
      */
    function integralMint(address _account, uint _value) external _onlyAdminOrHigher _checkUserAddr _checkIntegralAddr {
        require(InsuranceUser(userAddr_).exist(1, "", _account));
        InsuranceIntegral(integralAddr_).mint(_account, _value);
    }

    /** @dev Burns a specific amount of integrals.
      * @param _account address The account whose integrals will be burnt.
      * @param _value uint The amount of integral to be burned.
      */
    function integralBurn(address _account, uint _value) public _onlyAdminOrHigher _checkUserAddr _checkIntegralAddr {
        require(InsuranceUser(userAddr_).exist(1, "", _account));
        InsuranceIntegral(integralAddr_).burn(_account, _value);
    }

    /** @dev Transfer integral to a specified address
      * @param _owner address The address which owns the integrals.
      * @param _to address The address to transfer to.
      * @param _value uint The amount to be transferred.
      */
    function integralTransfer(address _owner, address _to, uint _value) external _onlyAdminOrHigher _checkUserAddr _checkIntegralAddr {
        require(InsuranceUser(userAddr_).exist(1, "", _owner));
        require(InsuranceUser(userAddr_).exist(1, "", _to));
        require(InsuranceIntegral(integralAddr_).transfer(_owner, _to, _value));
    }

    /** @dev Gets the balance of the specified address.
      * @param _owner address The address to query the balance of.
      * @return A uint representing the amount owned by the passed address.
      */
    function integral(address _owner) external view _checkIntegralAddr returns (uint) {
        return InsuranceIntegral(integralAddr_).balanceOf(_owner);
    }

    /** @dev Get contract related address.
      * @return The addresses of contract related.
      */
    function getAddr() external view _onlyOwner returns (address, address, address, address, address) {
        return (companyAddr_, templateAddr_, userAddr_, policyAddr_, integralAddr_);
    }
}
