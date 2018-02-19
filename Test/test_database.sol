/*
Copyright (c) 2017 ZSC Dev
*/

import "../Database/plat_string.sol";
import "../Database/db_provider.sol";
import "../Database/db_receiver.sol";
import "../Database/db_item.sol";
import "../Database/db_template.sol";
import "../Database/db_agreement.sol";
import "../Database/db_database.sol";

contract TestDatabase is DBDatabase {
    function TestDatabase(bytes32 _name) public DBDatabase(_name) {
    }

    function createIndependentNode(bytes32 _type, bytes32 _name) public returns (bool) {
        if (getNode(_name) != 0) return false;

        if (PlatString.equalto(_type, "provider")) {
            DBProvider nd = new DBProvider(_name);
            DBNode(getNode("provider")).addChild(address(nd));
        } else if (PlatString.equalto(_type, "receiver")) {
            DBReceiver nd = new DBReceiver(_name);
            DBNode(getNode("receiver")).addChild(address(nd));
        } else if (PlatString.equalto(_type, "agreement")) {
            DBAgreement nd = new DBAgreement(_name);
            DBNode(getNode("agreement")).addChild(address(nd));
        } else {
            return false;
        }
        return true;
    }

    function createOtherNode(bytes32 _type, bytes32 _node, bytes32 _name) public returns (bool) {
        if (getNode(_node) == 0) return false;
        if (getNode(_name) != 0) return false;

        if (PlatString.equalto(_type, "item")) {
            DBItem nd = new DBItem(_name);
            DBNode(getNode(_node)).addChild(address(nd));
        } else if (PlatString.equalto(_type, "template")) {
            DBTemplate nd = new DBTemplate(_name);
            DBNode(getNode(_node)).addChild(address(nd));
        } else {
            return false;
        }
        return true;
    }

    function deleteNode(bytes32 _name) public returns (bool) {
        if (getNode(_name) != 0) return false;

        return destroyNode(getNode(_name));
    }

    function findNodeByName(bytes32 _name) public constant returns (address) {
        return getNode(_name);
    }
}
