/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract Ownable {
  address internal owner_;

  modifier _onlyOwner() {
    require(msg.sender == owner_);
    _;
  }

  constructor() public {
    owner_ = msg.sender;
  }

  function kill() public _onlyOwner {
      selfdestruct(owner_);   
  }

  function() external payable { revert(); }

  function transferOwnership(address _newOwner) external _onlyOwner {
    if (0 != _newOwner) {
      owner_ = _newOwner;
    }
  }
}