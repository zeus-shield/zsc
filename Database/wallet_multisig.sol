/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_base.sol";

contract WalletMultiSig is WalletBase {
    address[] multiSig_;
    mapping(address => bool) sigAdrExists_;
    mapping(address => bool) sigStatus_;

    // Constructor
    constructor(bytes32 _name) public WalletBase(_name) {
    }

    ////////// internal functions /////////////
    function checkAllowedSignature(address _sigAdr) internal constant returns (bool) {
        require(sigAdrExists_[_sigAdr]);
    }

    function doesMulSigFinished(address _sigAdr) internal returns (bool) {
        if (sigStatus_[_sigAdr]) {
            return false;
        }

        sigStatus_[_sigAdr] = true;
        
        for (uint i = 0; i < multiSig_.length; ++i) {
            if (sigStatus_[multiSig_[i]] == false) {
                return false;
            }
        }
        return true;
    }

    ////////// public functions /////////////
    function addSignature(address _sigAdr) public {
        checkDelegate(msg.sender, 1);
        require(_sigAdr != address(0));
        require(!sigAdrExists_[_sigAdr])
        multiSig_.push(_sigAdr);
        sigAdrExists_[_s_sigAdrig] = true;
    }
    
    function submitTransaction(address _dest, uint256 _amount, bytes _data, bytes32 _sigAdr) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkAllowedSignature(_sigAdr);

        recordOut(address(this), _dest, _amount, PlatString.tobytes32(_data));
        return confirmTransaction(_user);
    }

    function confirmTransaction(address _sigAdr) public returns (uint) {
        if (doesMulSigFinished(_sigAdr)) {
            address dest;
            uint amount;
            bytes32 data;

            (dest, amount, data) = getLastUnsignedTransaction();
            
            return executeTransaction(false, dest, amount, data);
        } else {
            return 0;
        }
    }
}
