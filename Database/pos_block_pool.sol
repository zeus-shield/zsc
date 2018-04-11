/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./pos_block.sol";

contract PosBlockPool is Object {
    struct BlockPool {
        uint blockNos_;
        uint minedGasUsage_;
        uint remaingGasUsage_;
        mapping(uint => address) blocks_;
    }

    uint private poolNos_;
    mapping(uint => BlockPool) private pools_;
    mapping(bytes32 => uint) private poolIndice_;
    mapping(bytes32 => bool) private poolExists_;

    ////////////////
    uint blockSizeLimit_;

    // Constructor
    function BlockPool() {
    } 

    function createBlock() internal returns (address);

    function createPool(bytes32 _name, uint _dividendDuration, uint _rewardRate /* x% */) public only_delegate(1) {
        require(poolExists_[_name]);

        poolIndice_[_name] = poolNos_;
        pools_[poolNos_].blockNos_ = 0;
        pools_[poolNos_].minedGasUsage_ = 0;
        pools_[poolNos_].remaingGasUsage_ = 0;
    }

    function adjustBlockSize(uint _sizeLimit /*in terms of gas usage*/) internal {
        poolNos_ = 0;
        blockSizeLimit_ = _sizeLimit;
    }
}
