/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;

import "../common/integral.sol";
import "../common/pausable.sol";
import "../common/delegate.sol";

contract InsuranceIntegral is Integral, Pausable, Delegate {
    uint private cap_;

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    /**
     * @dev Construct the contract.
     * @param _cap The cap of the integral.
     */
    constructor (uint _cap) public {
        // require(cap_ > 0);
        cap_ = _cap;
    }

    /**
     * @dev Destroy the contract.
     */
    function destroy() public {
        super.kill();
    }

    /**
     * @dev Transfer integral to a specified address
     * @param _owner address The address which owns the integrals.
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
    function transfer(address _owner, address _to, uint256 _value) public whenNotPaused returns (bool) {
        return super.transfer(_owner, _to, _value);
    }

    /**
     * @dev Transfer integrals from one address to another.
     * Note that while this function emits an Approval event, this is not required as per the specification,
     * and other compliant implementations may not emit the event.
     * @param _from address The address which you want to send integrals from
     * @param _to address The address which you want to transfer to
     * @param _spender The address which will spend the integrals.
     * @param _value uint256 the amount of integrals to be transferred
     */
    function transferFrom(address _from, address _to, address _spender, uint256 _value) public whenNotPaused returns (bool) {
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
    function approve(address _owner, address _spender, uint256 _value) public whenNotPaused returns (bool) {
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
    function mint(address _account, uint _value) public whenNotPaused {
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
     * @dev Update cap of integrals.
     * @param _newCap The new cap of integrals.
     */
    function updateCap(uint _newCap) public whenNotPaused {
        require((_newCap > totalSupply()) && (_newCap > cap_));
        cap_ = _newCap;
    }
}
