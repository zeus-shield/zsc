/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../common/hashmap.sol";

contract InsuranceTemplate is Ownable {

    address private tempMgr_;

    constructor() public {
        tempMgr_ = new Hashmap();
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(tempMgr_).kill();
        selfdestruct(owner_);   
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] update template.
      * [param] _name: name of template.
      * [param] _data: data of template.
      * [return] none.
      */
    function update(bytes32 _name, string _data) external _onlyOwner {
        // check param
        require(bytes32(0) != _name);
        Hashmap(tempMgr_).set(_name, bytes32(0), _data, address(0));
    }

    /** [desc] Get size of templates.
      * [param] none.
      * [return] size of templates.
      */
    function size() external view returns (uint) {
        return Hashmap(tempMgr_).size();
    }

    /** [desc] Get template by id.
      * [param] _id: _id of template.
      * [return] template name and data.
      */
    function getById(uint _id) external view returns (bytes32, string) {
        bytes32 name = bytes32(0);
        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);

        // check param
        require(Hashmap(tempMgr_).size() > _id);

        (name, data0, data1, data2) = Hashmap(tempMgr_).get(_id);
        
        return (name, data1);
    }

    /** [desc] Get template by name.
      * [param] _name: name of template.
      * [return] template data.
      */
    function getByName(bytes32 _name) external view returns (string) {
        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);

        // check param
        require(0 != byte(_name).length);

        (data0, data1, data2) = Hashmap(tempMgr_).get(_name);
        
        return data1;
    }
}
