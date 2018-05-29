/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_base.sol";

contract WalletEth is WalletBase {

    // Constructor
    function WalletEth(bytes32 _name) public WalletBase(_name) {
        setNodeType("wallet-eth"); 
    }

    function() public payable {        
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            bytes32 strData = PlatString.tobytes32(string(msg.data));
            recordInput(msg.sender, msg.value, strData);
            changeValue(true, false, msg.value);
        }
    }

    function getBlance(bool _locked) public constant returns (uint256) {
        checkDelegate(msg.sender, 1);
        uint total = address(this).balance;
        uint amount;

        if (_locked) { 
            amount = super.getBlance(true);
            require(amount <= total);
        } else {
            amount = super.getBlance(false);
            require(amount == total);
        }
        return amount;
    }

    function executeTransaction(address _dest, uint256 _amount, bytes _data) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkBeforeSent(_dest, _amount);        
        bytes32 strData = PlatString.tobytes32(string(_data));

        if (_dest.call.value(_amount)(_data)) {
            recordOut(_dest, _amount, strData);
            changeValue(false, strData == "locked", _amount);
            return _amount;
        } else {
            return 0;
        }
    }

}
