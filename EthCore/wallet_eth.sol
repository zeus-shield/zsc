/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_base.sol";

contract WalletEth is WalletBase {
    address tempAdr_;
    uint tempAmount_;

    // Constructor
    function WalletEth(bytes32 _name) public WalletBase(_name) {
        nodeType_ = "wallet-eth"; 
    }

    function() public payable {        
        // must not less than 0.01 ether
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            recordInput(msg.sender, msg.value);
        }
    }

    function getBlance() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return address(this).balance;
    }

    function executeTransaction(address _dest, uint256 _amount) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkBeforeSent(_dest, _amount);        

        if (_dest.call.value(_amount)()) {
            recordOut(_dest, _amount);
            return _amount;
        } else {
            return 0;
        }
    }
}
