/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;

import "../utillib/LibSafeMath.sol";

/**
 * @title Standard integral
 *
 * @dev Implementation of the basic standard integral.
 *
 * This implementation emits additional Approval events, allowing applications to reconstruct the allowance status for
 * all accounts just by listening to said events. Note that this isn't required by the specification, and other
 * compliant implementations may not do it.
 */
contract Integral {
    using LibSafeMath for uint256;

    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowed;

    uint256 private _totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Total number of integrals in existence
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     * @return A uint256 representing the amount owned by the passed address.
     */
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    /**
     * @dev Function to check the amount of integrals that an owner allowed to a spender.
     * @param owner address The address which owns the integrals.
     * @param spender address The address which will spend the integrals.
     * @return A uint256 specifying the amount of integrals still available for the spender.
     */
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowed[owner][spender];
    }

    /**
     * @dev Transfer integral to a specified address
     * @param owner address The address which owns the integrals.
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function transfer(address owner, address to, uint256 value) public returns (bool) {
        _transfer(owner, to, value);
        return true;
    }

    /**
     * @dev Approve the passed address to spend the specified amount of integrals on behalf of owner.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param owner address The address which owns the integrals.
     * @param spender The address which will spend the integrals.
     * @param value The amount of integrals to be spent.
     */
    function approve(address owner, address spender, uint256 value) public returns (bool) {
        _approve(owner, spender, value);
        return true;
    }

    /**
     * @dev Transfer integrals from one address to another.
     * Note that while this function emits an Approval event, this is not required as per the specification,
     * and other compliant implementations may not emit the event.
     * @param from address The address which you want to send integrals from
     * @param to address The address which you want to transfer to
     * @param spender The address which will spend the integrals.
     * @param value uint256 the amount of integrals to be transferred
     */
    function transferFrom(address from, address to, address spender, uint256 value) public returns (bool) {
        _transfer(from, to, value);
        _approve(from, spender, _allowed[from][spender].sub(value));
        return true;
    }

    /**
     * @dev Increase the amount of integrals that an owner allowed to a spender.
     * approve should be called when _allowed[owner][spender] == 0. To increment
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * Emits an Approval event.
     * @param owner address The address which owns the integrals.
     * @param spender The address which will spend the integrals.
     * @param addedValue The amount of integrals to increase the allowance by.
     */
    function increaseAllowance(address owner, address spender, uint256 addedValue) public returns (bool) {
        _approve(owner, spender, _allowed[owner][spender].add(addedValue));
        return true;
    }

    /**
     * @dev Decrease the amount of integrals that an owner allowed to a spender.
     * approve should be called when _allowed[owner][spender] == 0. To decrement
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * Emits an Approval event.
     * @param owner address The address which owns the integrals.
     * @param spender The address which will spend the integrals.
     * @param subtractedValue The amount of integrals to decrease the allowance by.
     */
    function decreaseAllowance(address owner, address spender, uint256 subtractedValue) public returns (bool) {
        _approve(owner, spender, _allowed[owner][spender].sub(subtractedValue));
        return true;
    }

    /**
     * @dev Transfer integral for a specified addresses
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0));

        _balances[from] = _balances[from].sub(value);
        _balances[to] = _balances[to].add(value);
        emit Transfer(from, to, value);
    }

    /**
     * @dev Internal function that mints an amount of the integral and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param account The account that will receive the created integrals.
     * @param value The amount that will be created.
     */
    function _mint(address account, uint256 value) internal {
        require(account != address(0));

        _totalSupply = _totalSupply.add(value);
        _balances[account] = _balances[account].add(value);
        emit Transfer(address(0), account, value);
    }

    /**
     * @dev Internal function that burns an amount of the integral of a given
     * account.
     * @param account The account whose integrals will be burnt.
     * @param value The amount that will be burnt.
     */
    function _burn(address account, uint256 value) internal {
        require(account != address(0));

        _totalSupply = _totalSupply.sub(value);
        _balances[account] = _balances[account].sub(value);
        emit Transfer(account, address(0), value);
    }

    /**
     * @dev Approve an address to spend another addresses' integrals.
     * @param owner The address that owns the integrals.
     * @param spender The address that will spend the integrals.
     * @param value The number of integrals that can be spent.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        require(spender != address(0));
        require(owner != address(0));

        _allowed[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    /**
     * @dev Internal function that burns an amount of the integral of a given
     * account, deducting from the spender's allowance for said account. Uses the
     * internal burn function.
     * Emits an Approval event (reflecting the reduced allowance).
     * @param account The account whose integrals will be burnt.
     * @param spender The address that will spend the integrals.
     * @param value The amount that will be burnt.
     */
    function _burnFrom(address account, address spender, uint256 value) internal {
        _burn(account, value);
        _approve(account, spender, _allowed[account][spender].sub(value));
    }
}
