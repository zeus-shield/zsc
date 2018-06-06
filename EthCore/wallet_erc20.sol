/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./wallet_base.sol";

contract WalletErc20 is WalletBase {
    address _erc20TokenAdr;

    // Constructor
    function WalletErc20(bytes32 _name) public WalletBase(_name) {
        nodeType_ = "wallet-erc20";
    }

    function setERC20TokenAddress(address _tokenAdr) public {
        checkDelegate(msg.sender, 1);
        _erc20TokenAdr = _tokenAdr;
    }

    function getBlance() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        uint total = ERC20Interface(_erc20TokenAdr).balanceOf(address(this));
        return total;
    }

    function executeTransaction(address _dest, uint256 _amount) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkBeforeSent(_dest, _amount);

        if (ERC20Interface(_erc20TokenAdr).transfer(_dest, _amount)) {
            recordOut(_dest, _amount);
            return _amount;
        } else {
            return 0;
        }
    }

    function informTransaction(address _src, address _dest, uint256 _amount) public {
        require(_dest == address(this));
        checkDelegate(msg.sender, 1);
        recordInput(_src, _amount);
    }
}
