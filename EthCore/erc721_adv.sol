/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";


/// @title ERC-721 Non-Fungible Token Standard
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
contract ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function approve(address _approved, uint256 _tokenId) external payable;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) public view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}

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

    function checkOnlyOwnerOf(uint256 _tokenId, address _user) private view {
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

    function getApproved(uint256 _tokenId) public view returns (address) {
        return tokenApprovedFor_[_tokenId];
    }

    /**
    * @dev Gets the token ID of the specified address at the specified index
    * @param _owner address for the token's owner
    * @param _index uint256 for the n-th token in the list of tokens owned by this owner
    * @return uint256 representing the ID of the token
    */
    function tokenIDOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256) {
        require(_owner != address(0));
        require(_index < ownedTokens_[_owner].length);
        return ownedTokens_[_owner][_index];
    }

    /**
    * @dev Claims the ownership of a given token ID
    * @param _tokenId uint256 ID of the token being claimed by the msg.sender
    */
    function takeOwnership(uint256 _tokenId) external payable { 
        require(getApproved(_tokenId) == msg.sender);
        clearApprovalAndTransfer(tokenOwner_[_tokenId], msg.sender, _tokenId);
    }

    /**
    * @dev Transfers the ownership of a given token ID to another address
    * @param _to address to receive the ownership of the given token ID
    * @param _tokenId uint256 ID of the token to be transferred
    */
    function transfer(address _to, uint256 _tokenId) public {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        clearApprovalAndTransfer(msg.sender, _to, _tokenId);
    }

    /**
    * @dev Mint token function
    * @param _to The address that will own the minted token
    */
    function _mint(address _to, uint256 _tokenId) internal {
        require(_to != address(0));
        addToken(_to, _tokenId);
        Transfer(0x0, _to, _tokenId);
    }

    /**
    * @dev Burns a specific token
    * @param _tokenId uint256 ID of the token being burned by the msg.sender
    */
    function _burn(uint256 _tokenId) internal {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        if (getApproved(_tokenId) != 0) {
            clearApproval(msg.sender, _tokenId);
        }
        removeToken(msg.sender, _tokenId);
        Transfer(msg.sender, 0x0, _tokenId);
    }

    /**
    * @dev Internal function to clear current approval and transfer the ownership of a given token ID
    * @param _from address which you want to send tokens from
    * @param _to address which you want to transfer the token to
    * @param _tokenId uint256 ID of the token to be transferred
    */
    function clearApprovalAndTransfer(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0));
        require(_to != _from);
        require(tokenOwner_[_tokenId] == _from);
  
        clearApproval(_from, _tokenId);
        removeToken(_from, _tokenId);
        addToken(_to, _tokenId);
        Transfer(_from, _to, _tokenId);
    }

    /**
    * @dev Internal function to clear current approval of a given token ID
    * @param _tokenId uint256 ID of the token to be transferred
    */
    function clearApproval(address _owner, uint256 _tokenId) private {
        require(tokenOwner_[_tokenId] == _owner);
        tokenApprovedFor_[_tokenId] = 0;
        Approval(_owner, 0, _tokenId);
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * @param _to address representing the new owner of the given token ID
    * @param _tokenId uint256 ID of the token to be added to the tokens list of the given address
    */
    function addToken(address _to, uint256 _tokenId) private {
        require(tokenOwner_[_tokenId] == address(0));
        
        tokenOwner_[_tokenId] = _to;
        uint256 length = ownedTokens_[_to].length;
        ownedTokens_[_to].push(_tokenId);
        ownedTokensIndex_[_tokenId] = length;
        totalTokens_ = totalTokens_.add(1);
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * @param _from address representing the previous owner of the given token ID
    * @param _tokenId uint256 ID of the token to be removed from the tokens list of the given address
    */
    function removeToken(address _from, uint256 _tokenId) private {
        require(tokenOwner_[_tokenId] == _from);
  
        uint256 tokenIndex = ownedTokensIndex_[_tokenId];
        uint256 lastTokenIndex = ownedTokens_[_from].length.sub(1);
        uint256 lastToken = ownedTokens_[_from][lastTokenIndex];
  
        tokenOwner_[_tokenId] = 0;
        ownedTokens_[_from][tokenIndex] = lastToken;
        ownedTokens_[_from][lastTokenIndex] = 0;
        // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
        // be zero. Then we can make sure that we will remove _tokenId from the ownedTokens list since we are first swapping
        // the lastToken to the first position, and then dropping the element placed in the last position of the list
  
        ownedTokens_[_from].length--;
        ownedTokensIndex_[_tokenId] = 0;
        ownedTokensIndex_[lastToken] = tokenIndex;
        totalTokens_ = totalTokens_.sub(1);
    }
}

