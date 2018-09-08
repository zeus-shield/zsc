/*
 Copyright (c) 2018, ZSC Dev Team
 2017-12-18: v0.01
*/

pragma solidity ^0.4.21;

contract Sample {
    mapping(uint => string) public data_;

    // Constructor
    function Sample() public { 
    }

    function set(uint _index, string _data) public { 
        data_[_index] = _data;
    }

    function get(uint _index) public view returns (string) {
        return data_[_index];
    }   
}
