/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_base.sol";

contract WalletEth is WalletBase {

    // Constructor
    constructor(bytes32 _name) public WalletBase(_name) {
        setNodeType("wallet-eth"); 
        setAsEthAccount();
    }

    function() public payable {        
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            recordInput(msg.sender, address(this), msg.value, PlatString.tobytes32(msg.data));
        }
    }

    function getBlance(bool _locked) public constant returns (uint256) {
        checkDelegate(msg.sender, 1);

        if (_locked) { 
            return super.getBlance(true);
        } else {
            return this.balance;
        }
    }

    function executeTransaction(address _dest, uint256 _amount, bytes _data) public returns (uint) {
        checkDelegate(msg.sender, 1);

        require(checkBeforeSent(_dest, _amount));        

        if (_dest.call.value(_value)(_data)) {
            recordOut(address(this), _dest, _amount, PlatString.tobytes32(msg.data));
            return _amount;
        } else {
            return 0;
        }
    }
}
