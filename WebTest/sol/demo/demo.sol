/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";

contract Demo {

    using LibString for *;

    bytes32 private param_;

    constructor() public {}

    function set(bytes32 _param) external {
        param_ = _param;
    }

    function get(string _param) external pure returns (int, string, bytes32) {
        bytes32 param = _param.toBytes32();
        return (0, _param, param);
    }
}
