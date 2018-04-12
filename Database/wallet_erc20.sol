/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./wallet_base.sol";

contract WalletErc20 is WalletBase {
    address _erc20TokenAdr;

    // Constructor
    function WalletErc20(bytes32 _name) public WalletBase(_name) {
        setNodeType("wallet-erc20"); 
    }

    function() public payable {        
        revert();
    }

    function setERC20TokenAddress(address _tokenAdr) public only_delegate(1) {
        _erc20TokenAdr = _tokenAdr;
    }

    function executeTransaction(address _dest, uint256 _amount, bytes _data) public only_delegate(1) returns (bool) {
        require(checkBeforeSent(_dest, _amount));
    
        if (ERC20Interface(_erc20TokenAdr).transfer(_dest, _value)) {
            recordOut(address(this), _dest, _amount, _data);
            return true;
        } else {
            return false;
        }
    }
}
