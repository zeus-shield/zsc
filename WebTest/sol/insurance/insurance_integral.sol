/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../token/ERC20/ERC20.sol";

contract InsuranceIntegral is ERC20 {
    uint private cap_;
    string private name_;
    string private symbol_;
    uint8 private decimals_;

    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint _cap) public {
        require(cap_ > 0);
        name_ = _name;
        symbol_ = _symbol;
        decimals_ = _decimals;
        cap_ = _cap;
    }

    /**
     * @return the cap for the integral.
     */
    function cap() external view returns (uint) {
        return cap_;
    }

    /**
     * @return the name of the token.
     */
    function name() external view returns (string memory) {
        return name_;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() external view returns (string memory) {
        return symbol_;
    }

    /**
     * @return the number of decimals of the token.
     */
    function decimals() external view returns (uint8) {
        return decimals_;
    }

    /**
     * @dev Function to mint integrals
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address _account, uint _value) external {
        require(totalSupply().add(_value) <= cap_);
        _mint(_account, _value);
    }
}
