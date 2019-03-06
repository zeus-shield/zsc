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
    string private name_;
    string private symbol_;
    uint8 private decimals_;

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    /**
     * @dev Construct the contract.
     * @param _name The name of the integral.
     * @param _symbol The symbol of the integral.
     * @param _decimals The symbol of the integral.
     * @param _cap The cap of the integral.
     */
    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint _cap) public {
        // require(cap_ > 0);
        name_ = _name;
        symbol_ = _symbol;
        decimals_ = _decimals;
        cap_ = _cap;
    }

    /**
     * @dev Destroy the contract.
     */
    function destroy() public {
        super.kill();
    }

    /**
     * @return The cap for the integral.
     */
    function cap() external view returns (uint) {
        return cap_;
    }

    /**
     * @return The name of the integral.
     */
    function name() external view returns (string memory) {
        return name_;
    }

    /**
     * @return The symbol of the integral.
     */
    function symbol() external view returns (string memory) {
        return symbol_;
    }

    /**
     * @return the number of decimals of the integral.
     */
    function decimals() external view returns (uint8) {
        return decimals_;
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
     * @param _value The amount of integral to be burned.
     */
    function burn(uint _value) public whenNotPaused {
        _burn(msg.sender, _value);
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
