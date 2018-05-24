/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_multisig.sol";

contract WalletErc20 is WalletBase {
    address _erc20TokenAdr;

    // Constructor
    constructor(bytes32 _name) public WalletBase(_name) {
        setNodeType("wallet-erc20"); 
    }

    function setERC20TokenAddress(address _tokenAdr) public {
        checkDelegate(msg.sender, 1);
        _erc20TokenAdr = _tokenAdr;
    }

    function getBlance(bool _locked) public constant returns (uint256) {
        checkDelegate(msg.sender, 1);
        uint total = ERC20Interface(_erc20TokenAdr).balanceOf(address(this));
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

        if (ERC20Interface(_erc20TokenAdr).transfer(_dest, _amount)) {
            recordOut(address(this), _dest, _amount, PlatString.tobytes32(_data));
            changeValue(false, data == "locked", _amount);
            return amount;
        } else {
            return 0;
        }
    }

    function informTransaction(address _src, address _dest, uint256 _amount) public {
        checkDelegate(msg.sender, 1);
        recordInput(_src, _dest, _amount, "");
        changeValue(true, _data == "locked", _amount);
    }
}
