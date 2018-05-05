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

    function executeTransaction(bool _doesDirectly, address _dest, uint256 _amount, bytes _data) public returns (uint) {
        checkDelegate(msg.sender, 1);
        require(checkBeforeSent(_dest, _amount));        

        if (ERC20Interface(_erc20TokenAdr).transfer(_dest, _amount)) {
            if (_doesDirectly) {
                recordOut(address(this), _dest, _amount, PlatString.tobytes32(_data));
            }
            changeValue(true, data == "locked", _amount);
            return amount;
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
