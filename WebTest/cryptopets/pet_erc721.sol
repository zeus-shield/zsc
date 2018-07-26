/*
 Copyright (c) 2018, ZSC Dev Team
*/

import "./pet_base.sol";
import "./erc721.sol";

pragma solidity ^0.4.21;

contract PetERC721 is PetBase, ERC721 {

    function PetERC721() public PetBase() {}

    function _owns(address _owner, uint256 _tokenId) internal view returns (bool) {
        return kittyIndexToOwner[_tokenId] == _owner;
    }

    function _approve(uint256 _tokenId, address _approved) internal {
        indexToApproved_[_tokenId] = _approved;
    }

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

    function approve(address _to, uint256 _tokenId) external whenNotPaused {

        require(_owns(msg.sender, _tokenId));

        _approve(_tokenId, _to);

        Approval(msg.sender, _to, _tokenId);
    }
}