/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_include.sol";
import "./sys_gm_base.sol";

contract PosGasPool {
    function getBlockByIndex(uint _blockIndex) public view returns (address);
    function adjustBlockSizeLImit(uint _sizeLimit /*in terms of gas usage*/) public;
    function registerGasUsage(address _sender, uint _gasUsage) public;
    function numBlocks() public view returns (uint, uint);
    function minePendingBlockByIndex(uint _index) public returns (uint);
}

contract PosProofPower {
    function createVPUs(uint[] _ratio, uint[] _power, uint[] _priceMin) public;
    function createVPUs(uint _number, uint _ratio, uint _power, uint _priceMin) public;
    function getVPUInfo(uint _vpuId) public view returns (uint, uint, uint, uint);
    function purchaseVPU(address _buyerAdr, uint _vpuId) public;
}

contract PosStakerGroup {
    function setZscTokenAddress(address _adr) public;
    function numStakers() public view returns (uint);
    function registerStakerType(bytes32 _stakerType, uint _dividendDuration, uint _ratio) public;
    function removeStakerType(bytes32 _stakerType) public;
    function addStaker(bytes32 _stakerType, address _nodeAddress) public;
    function removeStaker(address _nodeAddress) public;
    function claimStakerSPByIndex(uint _index, uint _tokenAmount) public returns (uint);
    function getTotalRemainingSP() public view returns (uint);
    function setNextStakerForUseSP(uint _index) public;
    function getNextStakerForUseSP() public view returns (uint);
}

contract SysGmPos is SysGmBase {
    address stakerGroup_;
    address gasPool_;
    address proofPower_;

    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function configurePos(address _stakerGroup, address _gasPool, address _proofPower) public {
        checkDelegate(msg.sender, 1);

        if (_stakerGroup != address(0)) {
            if (stakerGroup_ != _stakerGroup && stakerGroup_ != address(0)) {
                Object(stakerGroup_).kill();
            }
            stakerGroup_ = _stakerGroup;
        }

        if (_gasPool != address(0)) {
            if (gasPool_ != _gasPool && gasPool_ != address(0)) {
                Object(gasPool_).kill();
            }
            gasPool_   = _gasPool;
        }

        if (_proofPower != address(0))  {
            if (proofPower_ != _proofPower && proofPower_ != address(0)) {
                Object(proofPower_).kill();
            }
            proofPower_  = _proofPower;
        }
    }

    function minePendingBlocks() public {
        checkDelegate(msg.sender, 1);

        uint totalBlocks;
        uint minedBlocks;
        uint minedPower = 0;
        
        (totalBlocks, minedBlocks) = PosGaskPool(gasPool_).numBlocks();

        for (uint i = minedBlocks - 1; i < totalBlocks; ++i) {
            minedPower = minedPower.add(PosGaskPool(gasPool_).minePendingBlockByIndex(i));
        }
    }

    function numBlockInfo() public view returns (uint, uint) {
        checkDelegate(msg.sender, 1);
        return PosGaskPool(gasPool_).numBlocks();
    }

    function getBlockInfoByIndex(uint _blockIndex) public constant returns (uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        return PosGaskPool(gasPool_).getBlockByIndex;
    }
}
