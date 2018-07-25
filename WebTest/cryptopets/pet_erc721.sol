/*
 Copyright (c) 2018, ZSC Dev Team
*/

import "./pet_base.sol";
import "./erc721.sol";

pragma solidity ^0.4.21;

contract PetERC721 is PetBase, ERC721 {

    function PetERC721() public PetBase() {}

    function totalSupply() public view returns (uint256) {
        return pets_.length - 1;
    }
}