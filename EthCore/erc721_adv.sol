/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_base.sol";
import "./delegated.sol";

/**
 * @title ERC721Adv
 * Generic implementation for the required functionality of the ERC721 standard
 */
contract ERC721Adv is ERC721, Delegated {
    using SafeMath for uint256;

    // Total amount of tokens
    uint256 private totalTokens_;

    // Mapping from token ID to owner
    mapping (uint256 => address) private tokenOwner_;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private tokenApprovedFor_;

    // Mapping from owner to list of owned token IDs
    mapping (address => uint256[]) private ownedTokens_;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private ownedTokensIndex_;

    function checkOnlyOwnerOf(uint256 _tokenId, address _user) private {
      require(tokenOwner_[_tokenId] == _user);
    }

    function totoalSupply() external view returns (uint256) {
      return totalTokens_;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0));
        return ownedTokens_[_owner].length;
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        require(tokenOwner_[_tokenId] != address(0));
        return tokenOwner_[_tokenId];
    }

    /*
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable {
        checkOnlyOwnerOf(_tokenId, _from);
    }
    */

    function approve(address _to, uint256 _tokenId) external payable {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        require(_to != msg.sender);

        if(_to != address(0) || getApproved(_tokenId) != address(0)) {
            Approval(msg.sender, _to, _tokenId);
        }
        tokenApprovedFor_[_tokenId] = _to;
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return tokenApprovedFor_[_tokenId];
    }

    function tokenIDOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256) {
        require(_owner != address(0));
        require(_index < ownedTokens_[_owner].length);
        return ownedTokens_[_owner][_index];
    }

    function transfer(address _to, uint256 _tokenId) public {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        clearApprovalAndTransfer(msg.sender, _to, _tokenId);
    }

    function clearApprovalAndTransfer(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0));
        require(_to != _from);
        require(tokenOwner[_tokenId] == _from);
  
        clearApproval(_from, _tokenId);
        removeToken(_from, _tokenId);
        addToken(_to, _tokenId);
        Transfer(_from, _to, _tokenId);
    }

    function clearApproval(address _owner, uint256 _tokenId) private {
        require(tokenOwner_[_tokenId] == _owner);
        tokenApprovedFor_[_tokenId] = 0;
        Approval(_owner, 0, _tokenId);
    }

    function addToken(address _to, uint256 _tokenId) private {
    }

    function removeToken(address _from, uint256 _tokenId) private {
    }
}
