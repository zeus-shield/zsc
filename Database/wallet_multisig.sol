/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_base.sol";

contract WalletMultiSig is WalletBase {
    address[] multiSig_;
    mapping(address => bool) sigAdrExists_;
    mapping(address => bool) sigStatus_;

    bool submittedTransaction_; 
    Payment tempPyment_;

    // Constructor
    constructor(bytes32 _name) public WalletBase(_name) {
        submittedTransaction_ = false;
    }


    ////////// virtual functions /////////////
    function executeTransaction(address _dest, uint256 _amount, bytes _data) public returns (uint);

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
    function addSignature(address _sigAdr) public return (bool) {
        checkDelegate(msg.sender, 1);
        require(_sigAdr != address(0));
        
        if (sigAdrExists_[_sigAdr]) {
            return false;
        }
        multiSig_.push(_sigAdr);
        sigAdrExists_[_s_sigAdrig] = true;
        return true;
    }
    
    function submitTransaction(address _dest, uint256 _amount, bytes _data, bytes32 _sigAdr) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkAllowedSignature(_sigAdr);

        require(!tempPaymetStatus_);

        submittedTransaction_ = true;

        tempPyment_.time_     = now;
        tempPyment_.isInput_  = false;
        tempPyment_.sender_   = address(this);
        tempPyment_.receiver_ = _dest;
        tempPyment_.amount_   = _amount;
        tempPyment_.data_     = PlatString.tobytes32(_data);

        return confirmTransaction(_user);
    }

    function confirmTransaction(address _sigAdr) public returns (uint) {
        checkDelegate(msg.sender, 1);
        require(submittedTransaction_);

        if (doesMulSigFinished(_sigAdr)) {

            uint ret = executeTransaction(tempPyment_.receiver_, tempPyment_.amount_, tempPyment_.data_);
            require(ret > 0);

            tempPaymetStatus_ = false;
        
            return ret;
        } else {
            return 0;
        }
    }
}

