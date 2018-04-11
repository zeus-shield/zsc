/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./wallet_base.sol";

contract WalletEth is WalletBase {

    // Constructor
    function WalletEth(bytes32 _name) public WalletBase(_name) {
        setAsEthAccount();
    }

    function() public payable {        
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            recordInput(msg.sender, 0, msg.value, msg.data);
        }
    }


    function executeTransaction(address _dest, uint256 _amount, bytes _data) public only_delegate(1) returns (bool) {
        if (_dest.call.value(_value)(_data)) {
            recordOut(address(this), _dest, _amount, _data);
            return true;
        } else {
            return false;
        }
    }
}
