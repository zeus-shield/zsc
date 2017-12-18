pragma solidity ^0.4.17;

library DBEntity {
    enum EntityType { UNDEFINED, RECEIVER, PROVIDER}

    struct Entity {
        EntityType    type_;
        string  name_ ;  
        uint    id_ ;
        uint    ethTotal_;
        uint    zscTotal_;
        uint    zscSuspend_;
        bool    activated_;
    }

    function setName(Entity storage _entity, string _name) public {
        _entity.name_ = _name;
    }

    function setID(Entity storage _entity, uint _id) public {
        _entity.id_ = _id;
    }

    function setType(Entity storage _entity, EntityType _type) public {
        _entity.type_ = _type;
    }

    function setEthValue(Entity storage _entity, uint _eth) public {
        _entity.ethTotal_ = _eth;
    }

    function setZscValue(Entity storage _entity, uint _zsc) public {
        _entity.zscTotal_ = _zsc;
    }

    function setActivated(Entity storage _entity, bool _activated) public {
        _entity.activated_ = _activated;
    } 

    function getName(Entity storage _entity, string _name) public returns (string) {
        return _entity.name_;
    }

    function getID(Entity storage _entity, uint _id) public returns (uint) {
        return _entity.id_;
    }

    function getType(Entity storage _entity, EntityType _type) public returns (EntityType) {
        return _entity.type_;
    }

    function getEthValue(Entity storage _entity, uint _eth) public returns (uint) {
        return _entity.ethTotal_;
    }

    function getZscValue(Entity storage _entity, uint _zsc) public returns (uint) {
        return _entity.zscTotal_;
    }

    function getActivated(Entity storage _entity, bool _activated) public returns (bool) {
        return _entity.activated_;
    } 
}


