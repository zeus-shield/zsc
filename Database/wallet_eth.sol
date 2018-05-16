/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_multisig.sol";

contract WalletEth is WalletMultiSig {

    // Constructor
    constructor(bytes32 _name) public WalletMultiSig(_name) {
        setNodeType("wallet-eth"); 
        setAsEthAccount();
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

        if (_locked) { 
            return super.getBlance(true);
        } else {
            return this.balance;
        }
    }

    function executeTransaction(bool _doesDirectly, address _dest, uint256 _amount, bytes _data) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkBeforeSent(_dest, _amount);        

        if (_dest.call.value(_amount)(data)) {
            if (_doesDirectly) {
                recordOut(address(this), _dest, _amount, PlatString.tobytes32(_data));
            }
            changeValue(true, data == "locked", _amount);
            return amount;
        } else {
            return 0;
        }
    }

}
