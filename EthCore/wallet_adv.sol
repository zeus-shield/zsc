/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_node.sol";

contract WalletAdv is DBNode {
    struct Payment {
        uint time_;
        bool isInput_;
        bytes32 tx_;
        address sender_;
        address receiver_;
        uint256 amount_;
    }
    uint private nos_;
    mapping(uint => Payment) private payments_;

    // Constructor
    function WalletAdv(bytes32 _name) public DBNode(_name) {
    }

    function checkBeforeSent(address _tokenAdr, address _dst, uint _amount) internal constant {
        require(getBlance(_tokenAdr) >= _amount && _dst != address(this));
    }

    function recordInput(address _sender, uint _amount) internal {
        payments_[nos_++] = Payment(now, false, 0x0, _sender, address(this), _amount);
    }

    function recordOut(address _receiver, uint _amount) internal {
        payments_[nos_++] = Payment(now, true, 0x0, address(this), _receiver, _amount);
    }

    ////////// public functions /////////////
    function() public payable {        
        // must not less than 0.01 ether
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            recordInput(msg.sender, msg.value);
        }
    }

    function getBlance(address _adr) public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        if (_adr == address(0)) {
            return address(this).balance;
        } else {
            return ERC20Interface(_erc20TokenAdr).balanceOf(address(this));
        }
    }

    function executeTransaction(address _tokenAdr, address _dest, uint256 _amount) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkBeforeSent(_tokenAdr, _dest, _amount);    


        
    }


    function getBlance() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        uint total = ERC20Interface(_erc20TokenAdr).balanceOf(address(this));
        return total;
    }

    
    function informTransaction(address _src, uint256 _amount) public {
        require(_src != address(this));
        checkDelegate(msg.sender, 1);
        recordInput(_src, _amount);
    }



}
