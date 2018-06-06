/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./plat_math.sol";

contract PosBlock is Object {
    struct TxHash {
        bool sentIn_;
        address sender_;
        address receiver_;
        uint gasUsage_;
        uint reigsterTime_;
    }
    
    bool private minedStatus_;
    uint private sizeLimit_;
    uint private currentSize_;
    uint private txNos_;
    mapping(uint => TxHash) private txHashs_;
    mapping(bytes32 => uint) private txIndice_;
    mapping(bytes32 => bool) private txExists_;

    address private previousBlock_ = address(0);
    address private nextBlock_ = address(0);
    uint private blockSizeLimit_ = 0;

    function PosBlock() public Object("null") {
        currentSize_ = 0;
        txNos_ = 0;
        minedStatus_ = false;
    }

    function setBlockSizeLimit(uint _limit) public {
        checkDelegate(msg.sender, 1);
        blockSizeLimit_ = _limit;
    }

    function setPreviousBlock(address _previous) public {
        checkDelegate(msg.sender, 1);

        require(previousBlock_ != address(0));
        previousBlock_ = _previous;
    }

    function setNextBlock(address _next) public {
        checkDelegate(msg.sender, 1);

        require(nextBlock_ != address(0));
        nextBlock_ = _next;
    }

    function getPreviousBlock() public constant returns (address) {
        checkDelegate(msg.sender, 1);
        return previousBlock_;
    }

    function getNextBlock() public constant returns (address) {
        checkDelegate(msg.sender, 1);
        return nextBlock_;
    }
    
    function setMined() public {
        checkDelegate(msg.sender, 1);
        minedStatus_ = true;
    }

    function doesMined() public constant returns (bool) {
        checkDelegate(msg.sender, 1);
        return minedStatus_;
    }

    function checkIsFull(uint _gasUsage) public constant returns (bool) {
        checkDelegate(msg.sender, 1);

        require(blockSizeLimit_ != 0);

        uint size = SafeMath.add(currentSize_, _gasUsage);
        if (size > blockSizeLimit_) {
            return true;
        } else {
            return false;
        }
    } 
    
    function registerTx(bool _sentIn, bytes32 _tx, address _sender, address _receiver, uint _gasUsage) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (minedStatus_) return false;

        txExists_[_tx] = true;
        txIndice_[_tx] = txNos_;
        txHashs_[txNos_] = TxHash(_sentIn, _sender, _receiver, _gasUsage, now);
        txNos_++;
        minedStatus_ = true;
        return true;
    }

    function getTxByIndex(uint _index) public constant returns (address, address, uint, uint) {
        checkDelegate(msg.sender, 1);

        require(_index < txNos_);
        
        return (txHashs_[_index].sender_, txHashs_[_index].receiver_, txHashs_[_index].gasUsage_, txHashs_[_index].reigsterTime_);
    }

    function getTxByHash(bytes32 _tx) public constant returns (address, address, uint, uint) {
        checkDelegate(msg.sender, 1);

        require(txExists_[_tx]);
        return getTxByIndex(txIndice_[_tx]);
    }

    function doesBlockMined() public constant returns (bool) {
        checkDelegate(msg.sender, 1);
        return minedStatus_;
    }
    
    function getBlockLimit() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return sizeLimit_;
    }

    function numTx() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return txNos_;
    }

    function getCurrentSize() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return currentSize_;
    }

}

