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

    constructor (uint _cap) public {
        require(cap_ > 0);
        cap_ = _cap;
    }

    /**
     * @return the cap for the integral.
     */
    function cap() external view returns (uint) {
        return cap_;
    }

    function mint(address _account, uint _value) external {
        require(totalSupply().add(_value) <= cap_);
        _mint(_account, _value);
    }
}
