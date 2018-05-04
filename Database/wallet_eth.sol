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

    function confirmTransaction(bytes32 _user) public returns (uint) {
        if (doesMulSigFinished(_user)) {
            address dest;
            uint amount;
            bytes32 data;

            (dest, amount, data) = getLastUnsignedTransaction();
            
            if (dest.call.value(amount)(data)) {
                changeValue(true, data == "locked", amount);
                return amount;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

}
