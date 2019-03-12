/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;

import "../common/integral.sol";
import "../common/pausable.sol";
import "../common/delegate.sol";

contract InsuranceUser {
    function exist(uint8 _type, string _key0, address _key1) external view returns (bool);
}

contract InsuranceIntegral is Integral, Pausable, Delegate {
    address private userAddr_;
    uint private cap_;
    mapping (uint8 => uint) private threshold_;

    modifier _checkUserAddr() {
        require(0 != userAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    /**
     * @dev Construct the contract.
     */
    constructor () public {
        userAddr_ = address(0);
        cap_ = 100000;
        threshold_[0] = 40;
        threshold_[1] = 20;
        threshold_[2] = 20;
        threshold_[3] = 20;
        threshold_[4] = 20;
        threshold_[5] = 20;
        threshold_[6] = 20;
        threshold_[7] = 20;
    }

    /**
     * @dev Destroy the contract.
     */
    function destroy() public _onlyOwner {
        super.kill();
    }

    /**
     * @dev Setup
     * @param _userAddr address The address of user contract.
     */
    function setup(address _userAddr) public _onlyOwner {
        // check params
        require(address(0) != _userAddr);
        userAddr_ = _userAddr;
    }

    /**
     * @dev Claim integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in everyday.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _account The address that will claim the integrals.
     */
    function claim(uint8 _type, address _account) public {
        require(0 <= _type && 8 > _type);
        log0(bytes32(_account));
        mint(_account, threshold(_type));
    }    

    /**
     * @dev Transfer integral to a specified address
     * @param _owner address The address which owns the integrals.
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
    function transfer(address _owner, address _to, uint _value) public whenNotPaused returns (bool) {
        return super.transfer(_owner, _to, _value);
    }

    /**
     * @dev Transfer integrals from one address to another.
     * Note that while this function emits an Approval event, this is not required as per the specification,
     * and other compliant implementations may not emit the event.
     * @param _from address The address which you want to send integrals from
     * @param _to address The address which you want to transfer to
     * @param _spender The address which will spend the integrals.
     * @param _value uint the amount of integrals to be transferred
     */
    function transferFrom(address _from, address _to, address _spender, uint _value) public whenNotPaused returns (bool) {
        return super.transferFrom(_from, _to, _spender, _value);
    }

    /**
     * @dev Approve the passed address to spend the specified amount of integrals on behalf of owner.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param _owner address The address which owns the integrals.
     * @param _spender The address which will spend the integrals.
     * @param _value The amount of integrals to be spent.
     */
    function approve(address _owner, address _spender, uint _value) public whenNotPaused returns (bool) {
        return super.approve(_owner, _spender, _value);
    }

    /**
     * @dev Increase the amount of integrals that an owner allowed to a spender.
     * approve should be called when _allowed[owner][spender] == 0. To increment
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * Emits an Approval event.
     * @param _owner address The address which owns the integrals.
     * @param _spender The address which will spend the integrals.
     * @param _addedValue The amount of integrals to increase the allowance by.
     */
    function increaseAllowance(address _owner, address _spender, uint _addedValue) public whenNotPaused returns (bool success) {
        return super.increaseAllowance(_owner, _spender, _addedValue);
    }

    /**
     * @dev Decrease the amount of integrals that an owner allowed to a spender.
     * approve should be called when _allowed[owner][spender] == 0. To decrement
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * Emits an Approval event.
     * @param _owner address The address which owns the integrals.
     * @param _spender The address which will spend the integrals.
     * @param _subtractedValue The amount of integrals to decrease the allowance by.
     */
    function decreaseAllowance(address _owner, address _spender, uint _subtractedValue) public whenNotPaused returns (bool success) {
        return super.decreaseAllowance(_owner, _spender, _subtractedValue);
    }

    /**
     * @dev Mint integrals.
     * @param _account The address that will receive the minted integrals.
     * @param _value The amount of integrals to mint.
     */
    function mint(address _account, uint _value) public whenNotPaused _checkUserAddr {
        require(InsuranceUser(userAddr_).exist(1, "", _account));
        require(totalSupply().add(_value) <= cap_);
        _mint(_account, _value);
    }

    /**
     * @dev Burns a specific amount of integrals.
     * @param _account The account whose integrals will be burnt.
     * @param _value The amount of integral to be burned.
     */
    function burn(address _account, uint _value) public whenNotPaused {
        _burn(_account, _value);
    }

    /**
     * @dev Burns a specific amount of integrals from the target address and decrements allowance
     * @param _from The account whose integrals will be burned.
     * @param _spender The address that will spend the integrals.
     * @param _value The amount of integral to be burned.
     */
    function burnFrom(address _from, address _spender, uint _value) public whenNotPaused {
        _burnFrom(_from, _spender, _value);
    }

    /**
     * @dev Update the threshold of different types of bonus integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in everyday.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _threshold uint The threshold of different types of bonus integrals.
     */
    function updateThreshold(uint8 _type, uint _threshold) public whenNotPaused _onlyOwner {
        // check params
        require(0 <= _type && 8 > _type);
        threshold_[_type] = _threshold;
    }

    /**
     * @dev Update cap of integrals.
     * @param _newCap The new cap of integrals.
     */
    function updateCap(uint _newCap) public whenNotPaused _onlyOwner {
        require((_newCap > totalSupply()) && (_newCap > cap_));
        cap_ = _newCap;
    }

    /**
     * @dev Get the threshold of different types of bonus integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in everyday.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @return The threshold of different types of bonus integrals.
     */
    function threshold(uint8 _type) public view returns (uint) {
        return threshold_[_type];
    }

    /**
     * @dev Get the cap of integrals.
     * @return The cap of integrals.
     */
    function cap() public view returns (uint) {
        return cap_;
    }

    /**
     * @dev Get contract related address.
     * @return The address related .
     */
    function getAddr() public view _onlyOwner returns (address) {
        return userAddr_;
    }
}
