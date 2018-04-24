/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./plat_math.sol";
import "./object.sol";

contract CBDBDatabase is Object {
    function getNode(bytes32 _name) public only_delegate(1) constant returns (address);
    function destroyNode(address _node) public only_delegate(1) returns (bool);
    function _addNode(address _node) only_delegate(1) public ;
}

contract DBNode is Object {
    address private database_ = address(0);
    address private parent_ = address(0);
    address private controller_ = address(0);
    address private posAdv_ = address(0);
    address private walletGM_ = address(0);
    address private simulatorGM_ = address(0);

    bytes32 private nodeType_ = "node";
    address private ethWalletId_ ;
    bool    private activated_;


    address[] children_;
    mapping(bytes32 => address) childMap_;

    address[] factories_;

    // Constructor
    function DBNode(bytes32 _name) public Object(_name) {
    }

    function kill() public only_delegate(1) { 
        removeAndDestroyAllChildren(); 
        super.kill();
    }
    
    function setNodeType(bytes32 _type) internal only_delegate(1) {
        nodeType_ = _type;
    }

    function getNodeType() public only_delegate(1) constant returns (bytes32) {
        return nodeType_;
    }

    function setId(address _ethWalletiId) public only_delegate(1) {
        ethWalletId_ = _ethWalletiId;
    }

    function getId() public only_delegate(1) constant returns (address) {
        return ethWalletId_;
    }
    
    function setDelegatedModules(address _database, address _contoller, address _posAdv, address _walletGM, address _simulatorGM, address[] _factories) public only_delegate(1) {
        database_ = _database;
        factories_ = _factories;
        controller_ = _contoller;
        posAdv_ = _posAdv;
        walletGM_ = _walletGM;
        simulatorGM_ = _simulatorGM;

        setDelegate(database_, 1);
        for (uint i=0; i<factories_.length; i++) {
            setDelegate(factories_[i], 1);
        }
        CBDBDatabase(database_)._addNode(this);
    }
    
    function getController() internal constant returns (address) {
        return controller_;
    }
    
    function getDatabase() public only_delegate(1) constant returns (CBDBDatabase) {
        return CBDBDatabase(database_);
    }

    function numChildren() public only_delegate(1) constant returns(uint) {
        return children_.length;
    }
    
    function setParent(address _parent) public only_delegate(1) {
        if (parent_ == address(0)) {
            parent_ = _parent;
            if (parent_ != address(0)) {
               setDelegate(parent_, 1);
            }
        }
    }

    function getParent() public only_delegate(1) constant returns(address) {
        return parent_; 
    }

    function removeFromParent() public only_delegate(1) {
        if (parent_ != address(0)) {
            DBNode(parent_).removeChild(name());
        }
        parent_ = address(0);
    }

    function addChild(address _node) public only_delegate(1) returns (address) {
        if (_node == 0) return 0;
        DBNode(_node).setParent(this);

        CBDBDatabase(database_).setDelegate(_node, 1);
        DBNode(_node).setDelegatedModules(database_, controller_, posAdv_, walletGM_, simulatorGM_, factories_);

        children_.push(_node);
        childMap_[DBNode(_node).name()] = _node;
        return _node;
    }

    function getChild(bytes32 _name) public only_delegate(1) constant returns(address) {
        require(childMap_[_name] != 0);
        return childMap_[_name];
    }
    
    function getChildByIndex(uint _index) public only_delegate(1) constant returns(address) {
        require(_index < children_.length);
        return children_[_index];
    }

    function removeChild(bytes32 _name) public only_delegate(1) returns (address) {
        require(childMap_[_name] != 0);

        address nd;
        for (uint i = 0; i < children_.length; ++i) {
            if (DBNode(children_[i]).name() == _name) {
                nd = children_[i];
                children_[i] = children_[children_.length - 1];
                break;
            }
        }
        delete children_[children_.length - 1];
        children_.length --;
        delete childMap_[_name];

        DBNode(nd).setDelegate(parent_, 1);
        return nd;
    }

    function removeAndDestroyAllChildren() public only_delegate(1) {
        if (children_.length == 0) {
            return;
        }

        for (uint i = 0; i < children_.length; ++i) {
            CBDBDatabase(database_).destroyNode(children_[i]);
            delete childMap_[DBNode(children_[i]).name()];
        }
        children_.length = 0;
    }  
}


