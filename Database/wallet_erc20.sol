/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_multisig.sol";

contract WalletErc20 is WalletMultiSig {
    address _erc20TokenAdr;

    // Constructor
    constructor(bytes32 _name) public WalletMultiSig(_name) {
        setNodeType("wallet-erc20"); 
    }

    function setERC20TokenAddress(address _tokenAdr) public {
        checkDelegate(msg.sender, 1);
        _erc20TokenAdr = _tokenAdr;
    }

    function getBlance(bool _locked) public constant returns (uint256) {
        checkDelegate(msg.sender, 1);

        if (_locked) { 
            return super.getBlance(true);
        } else {
            return ERC20Interface(_erc20TokenAdr).balanceOf(address(this));
        }
    }

    function confirmTransaction(bytes32 _user) public returns (uint) {
        if (doesMulSigFinished(_user)) {
            address dest;
            uint amount;
            bytes32 data;

            (dest, amount, data) = getLastUnsignedTransaction();
            
            require(checkBeforeSent(dest, amount));        
            if (ERC20Interface(_erc20TokenAdr).transfer(dest, amount)) {
                changeValue(true, data == "locked", amount);
                return amount;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    function informTransaction(address _src, address _dest, uint256 _amount) public {
        checkDelegate(msg.sender, 1);
        recordInput(_src, _dest, _amount, "");
        changeValue(false, _data == "locked", _amount);
    }
}
