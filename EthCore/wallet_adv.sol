/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_node.sol";

contract WalletAdv is DBNode {
    struct Payment {
        uint time_;
        bool isInput_;
        address sender_;
        address receiver_;
        uint256 amount_;
    }
    uint private constant MIN_VALUE = (1 ether) / 100;

    uint private nos_;
    mapping(uint => Payment) private payments_;

    mapping(address => uint) private lockedAmounts_;

    // Constructor
    function WalletAdv(bytes32 _name) public DBNode(_name) {
    }

    function checkBeforeSent(address _tokenAdr, address _dst, uint _amount) internal view {
        uint balan = getBlance(_tokenAdr);
        require(balan >= _amount);
        require(balan >= lockedAmounts_[_tokenAdr]);
        require(_dst != address(this));
    }

    function recordInput(address _sender, uint _amount) internal {
        payments_[nos_] = Payment(now, false, _sender, address(this), _amount);
        nos_++;
    }

    function recordOut(address _receiver, uint _amount) internal {
        payments_[nos_] = Payment(now, true, address(this), _receiver, _amount);
        nos_++;
    }

    ////////// public functions /////////////
    function() public payable {        
        // must not less than 0.01 ether
        require(msg.value >= MIN_VALUE);
        recordInput(msg.sender, msg.value);
    }

    function getBlance(address _tokenAdr) public view returns (uint) {
        checkDelegate(msg.sender, 1);
        if (_tokenAdr == address(0)) {
            return address(this).balance;
        } else {
            return ERC20Interface(_tokenAdr).balanceOf(address(this));
        }
    }

    function getLockedAmount(address _tokenAdr) public view returns (uint) {
        checkDelegate(msg.sender, 1);
        return lockedAmounts_[_tokenAdr];
    }
    
    function executeTransaction(address _tokenAdr, address _dest, uint256 _amount) public returns (uint) {
        checkDelegate(msg.sender, 1);
        checkBeforeSent(_tokenAdr, _dest, _amount);    
        if (_tokenAdr == address(0)) {
            if (_dest.call.value(_amount)()) {
                recordOut(_dest, _amount);
                return _amount;
            } else {
                return 0;
            }
        } else {
            if (ERC20Interface(_tokenAdr).transfer(_dest, _amount)) {
                recordOut(_dest, _amount);
                return _amount;
            } else {
                return 0;
            }
        }        
    }
    
    function lockWallet(address _tokenAdr, uint _amount) public {
        checkDelegate(msg.sender, 1);
        lockedAmounts_[_tokenAdr] = lockedAmounts_[_tokenAdr].add(_amount);
    }
    
    function unlockWallet(address _tokenAdr, uint _amount) public {
        checkDelegate(msg.sender, 1);
        if (lockedAmounts_[_tokenAdr] >= _amount) {
            lockedAmounts_[_tokenAdr] = lockedAmounts_[_tokenAdr].sub(_amount);
        } else {
            lockedAmounts_[_tokenAdr] = 0;
        }
    }
}
