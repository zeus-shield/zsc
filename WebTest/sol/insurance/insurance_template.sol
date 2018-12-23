/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../common/hashmap.sol";

contract InsuranceTemplate is Ownable {

    address private tempMgr;

    constructor() public {
        tempMgr = new Hashmap();
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(tempMgr).kill();
        selfdestruct(owner_);   
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] create template.
      * [param] _name: name of template.
      * [param] _data: data of template.
      * [return] none.
      */
    function create(bytes32 _name, string _data) external _onlyOwner {
        // check param
        require(bytes32(0) != _name);
        Hashmap(tempMgr).set(_name, bytes32(0), _data);
    }

    /** [desc] Get size of templates.
      * [param] none.
      * [return] size of templates.
      */
    function size() external view _onlyOwner returns (uint) {
        return Hashmap(tempMgr).size();
    }

    /** [desc] Get template by id.
      * [param] _name: _id of template.
      * [return] template.
      */
    function get(uint _id) external view _onlyOwner returns (bytes32, string) {
        bytes32 name = bytes32(0);
        bytes32 data0 = bytes32(0);
        string memory data1 = "";

        // check param
        require(Hashmap(tempMgr).size() > _id);

        (name, data0, data1) = Hashmap(tempMgr).get(_id);
        
        return (name, data1);
    }
}
