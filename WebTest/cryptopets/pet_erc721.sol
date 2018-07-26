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

    function balanceOf(address _owner) public view returns (uint256) {
        return ownerToCount_[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        address owner = indexToOwner_[_tokenId];

        require(address(0) != owner);

        return owner;
    }
}