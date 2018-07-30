/*
 Copyright (c) 2018, ZSC Dev Team
*/

import "./pet_base.sol";
import "./erc721.sol";

pragma solidity ^0.4.21;

contract PetERC721 is PetBase, ERC721 {

    string constant name = "CryptoPets";
    string constant symbol = "CP";

    bytes4 constant InterfaceSignature_ERC165_ =
        bytes4(keccak256('supportsInterface(bytes4)'));

    bytes4 constant InterfaceSignature_ERC721_ =
        bytes4(keccak256('name()')) ^
        bytes4(keccak256('symbol()')) ^
        bytes4(keccak256('totalSupply()')) ^
        bytes4(keccak256('balanceOf(address)')) ^
        bytes4(keccak256('ownerOf(uint256)')) ^
        bytes4(keccak256('approve(address,uint256)')) ^
        bytes4(keccak256('transfer(address,uint256)')) ^
        bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        bytes4(keccak256('tokensOfOwner(address)')) ^
        bytes4(keccak256('tokenMetadata(uint256,string)'));

    function PetERC721() public PetBase() {}

    function _owns(address _owner, uint256 _tokenId) internal view returns (bool) {
        return indexToOwner[_tokenId] == _owner;
    }

    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return indexToApproved_[_tokenId] == _claimant;
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

    function transfer(address _to, uint256 _tokenId) external whenNotPaused {
 
        require(_to != address(0));
        require(_to != address(this));
        require(_to != address(saleAuction));
        require(_to != address(siringAuction));
        require(_owns(msg.sender, _tokenId));

        _transfer(msg.sender, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external whenNotPaused {
        
        require(_to != address(0));
        require(_to != address(this));
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        _transfer(_from, _to, _tokenId);
    }

    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        return ((_interfaceID == InterfaceSignature_ERC165_) || (_interfaceID == InterfaceSignature_ERC721_));
    }
}