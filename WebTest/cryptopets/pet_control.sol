/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract PetControl {

    address ceoAddress_;
    address cfoAddress_;
    address cooAddress_;

    modifier onlyCEO() {
        require(msg.sender == ceoAddress_);
        _;
    }

    modifier onlyCFO() {
        require(msg.sender == cfoAddress_);
        _;
    }

    modifier onlyCOO() {
        require(msg.sender == cooAddress_);
        _;
    }

    modifier onlyCLevel() {
        require(msg.sender == cooAddress_
            || msg.sender == ceoAddress_
            || msg.sender == cfoAddress_
        );
        _;
    }

    function PetControl() public {}

}