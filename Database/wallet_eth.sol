/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_multisig.sol";

contract WalletEth is WalletBase {

    // Constructor
    constructor(bytes32 _name) public WalletBase(_name) {
        setNodeType("wallet-eth"); 
    }

    function() public payable {        
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            recordInput(msg.sender, address(this), msg.value, PlatString.tobytes32(msg.data));
            changeValue(false, false, _amount);
        }
    }

    function getBlance(bool _locked) public constant returns (uint256) {
        checkDelegate(msg.sender, 1);
        uint total = this.balance;;
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

        if (_dest.call.value(_amount)(data)) {
            recordOut(address(this), _dest, _amount, PlatString.tobytes32(_data));
            changeValue(true, data == "locked", _amount);
            return amount;
        } else {
            return 0;
        }
    }

}
