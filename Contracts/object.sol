/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.18;

contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    modifier only_owner {
        if (msg.sender != owner) revert();
        _;
    }

    function transferOwnership(address newOwner) public only_owner {
        owner = newOwner;
    }
}

contract Delegated is Owned {
    mapping (address => bool) delegates_;
    
    modifier only_delegate { 
        require (msg.sender == owner || delegates_[msg.sender]);
        _; 
    }

    event DelegateChanged(address _delegate, bool _state);
    
    function setDelegate(address _address, bool _state) public only_owner { 
        if (_state) {
            delegates_[_address] = true;
        } else { 
            delete delegates_[_address];
        }
        DelegateChanged(_address, _state);
    }

    function isDelegate(address _account) public constant returns (bool)  {
        if (delegates_[_account] == true) {
            return true;
        } else {
            return false;
        }
    }
}

contract Object is Delegated {
    string  name_ ;

    // Constructor
    function Object(string _name) public {
        name_ = _name;
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable {
        revert();
    }

    function name() public only_delegate constant returns (string) {
        return name_;
    }

}


/*

*/