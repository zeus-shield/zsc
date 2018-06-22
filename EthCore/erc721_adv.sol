/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_base.sol";
import "./delegated.sol";

/**
 * @title ERC721Deed
 * Generic implementation for the required functionality of the ERC721 standard
 */
contract ERC721Adv is ERC721, Delegated {
    using SafeMath for uint256;

    // Total amount of tokens
    uint256 private totalTokens;

    // Mapping from token ID to owner
    mapping (uint256 => address) private tokenOwner;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private tokenApprovedFor;

    // Mapping from owner to list of owned token IDs
    mapping (address => uint256[]) private ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private ownedTokensIndex;

    function checkOnlyOwnerOf(uint256 _tokenId, address _user) private {
      require(deedOwner[_tokenId] == _user);
    }

    function totoalSupply() external view returns (uint256) {
      return totalTokens;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0));
        return ownedTokens[_owner].length;
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        require(tokenOwner[_tokenId] != address(0));
        return deedOwner[_deedId];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable {
        checkOnlyOwnerOf(_tokenId, _from);


    }

    function approve(address _to, uint256 _tokenId) external payable {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        require(_to != msg.sender);

        if(_to != address(0) || getApproved(_deedId) != address(0)) {
            Approval(msg.sender, _to, _deedId);
        }
        tokenApprovedFor[_tokenId] = _to;
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return tokenApprovedFor[_tokenId];
    }

    function tokenIDOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256) {
        require(_owner != address(0));
        require(_index < ownedTokens[_owner].length);
        return ownedTokens[_owner][_index];
    }

    function takeOwnership(uint256 _tokenId) external payable { 
        require(getApproved(_tokenId) == msg.sender);
        clearApprovalAndTransfer(deedOwner[_tokenId], msg.sender, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        clearApprovalAndTransfer(msg.sender, _to, _tokenId);
    }

    function clearApprovalAndTransfer(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0));
        require(_to != _from);
        require(deedOwner[_tokenId] == _from);

        clearApproval(_from, _tokenId);
        Transfer(_from, _to, _tokenId);
    }

    function clearApproval(address _owner, uint256 _deedId) private {
        require(deedOwner[_deedId] == _owner);
        deedApprovedFor[_deedId] = 0;
        Approval(_owner, 0, _deedId);
    }
}



