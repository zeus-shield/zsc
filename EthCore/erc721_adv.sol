/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

/// @title ERC-721 Non-Fungible Token Standard
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
contract ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    function totalSupply() public view returns (uint);
    function balanceOf(address _owner) public view returns (uint);
    function ownerOf(uint _tokenId) public view returns (address);
    function transfer(address _to, uint256 _tokenId) public;
    //function safeTransferFrom(address _from, address _to, uint _tokenId, bytes data) public;
    function safeTransferFrom(address _from, address _to, uint _tokenId) public;
    //function transferFrom(address _from, address _to, uint _tokenId) public;
    function approve(address _approved, uint _tokenId) public;
    //function setApprovalForAll(address _operator, bool _approved) public;
    function getApproved(uint _tokenId) public view returns (address);
    function takeOwnership(uint _tokenId) public;
    function tokenOfOwnerByIndex(address _owner, uint _index) public view returns (uint);
    //function isApprovedForAll(address _owner, address _operator) public view returns (bool);
}

/**
 * @title ERC721Adv
 * Generic implementation for the required functionality of the ERC721 standard
 */
contract Erc721Adv is ERC721, Delegated {
    using SafeMath for uint;

    uint private generatedTokenNos_;

    // Total amount of tokens
    uint private totalTokens_;

    // Mapping from token ID to owner
    mapping (uint => address) private tokenOwner_;

    // Mapping from token ID to approved address
    mapping (uint => address) private tokenApprovedFor_;

    // Mapping from owner to list of owned token IDs
    mapping (address => uint[]) private ownedTokens_;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint => uint) private ownedTokensIndex_;

    string private tokenSymbol_ = "VMB";
    
    string private tokenName_ = "Virtual Miner Robot";
    
    function Erc721Adv() public {
    }

    function checkTradeAble(uint256 _tokenId) internal view returns (bool);
    function tokenURI(uint _tokenId) public view returns (string);

    function checkOnlyOwnerOf( address _user, uint _tokenId) private view {
        require(tokenOwner_[_tokenId] == _user);
    }

    function checkCanTransfer(address _sender, uint256 _tokenId) private view {
        address owner = tokenOwner_[_tokenId];
        if (isDelegate(msg.sender, 1)) return;
        
        if (checkTradeAble(_tokenId)) {
            require(_sender == owner || msg.sender == tokenApprovedFor_[_tokenId]);
        }
    }

    function setTokenNameInfo(string _name, string _symbole) public {
        checkDelegate(msg.sender, 1);
        tokenName_ = _name;
        tokenSymbol_ = _symbole;
    }

    function getGeneratedTokenNos() public view returns (uint) {
        return generatedTokenNos_;
    }

    ////////////////////////
    function name() public view returns (string) { 
        return tokenName_; 
    }
    
    function symbol() public view returns (string) {
        return tokenSymbol_;
    }

    function totalSupply() public view returns (uint) {
        return totalTokens_;
    }

    function balanceOf(address _owner) public view returns (uint) {
        require(_owner != address(0));
        return ownedTokens_[_owner].length;
    }

    function ownerOf(uint _tokenId) public view returns (address) {
        //require(tokenOwner_[_tokenId] != address(0));
        return tokenOwner_[_tokenId];
    }

    function transfer(address _to, uint _tokenId) public {
        checkCanTransfer(msg.sender, _tokenId);
        _transfer(msg.sender, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint _tokenId) public {
        checkCanTransfer(msg.sender, _tokenId);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _to, uint _tokenId) public {
        checkOnlyOwnerOf( msg.sender, _tokenId);
        require(_to != msg.sender);

        if(_to != address(0) || tokenApprovedFor_[_tokenId] != address(0)) {
            emit Approval(msg.sender, _to, _tokenId);
        }
        tokenApprovedFor_[_tokenId] = _to;
    }

    function getApproved(uint _tokenId) public view returns (address) {
        return tokenApprovedFor_[_tokenId];
    }

    /**
    * @dev Gets the token ID of the specified address at the specified index
    * @param _owner address for the token's owner
    * @param _index uint for the n-th token in the list of tokens owned by this owner
    * @return uint representing the ID of the token
    */
    function tokenOfOwnerByIndex(address _owner, uint _index) public view returns (uint) {
        require(_owner != address(0));
        require(_index < ownedTokens_[_owner].length);
        return ownedTokens_[_owner][_index];
    }

    /**
    * @dev Claims the ownership of a given token ID
    * @param _tokenId uint ID of the token being claimed by the msg.sender
    */
    function takeOwnership(uint _tokenId) public { 
        checkCanTransfer(msg.sender, _tokenId);
        require(tokenApprovedFor_[_tokenId] == msg.sender);
        clearApprovalAndTransfer(tokenOwner_[_tokenId], msg.sender, _tokenId);
    }

    /**
    * @dev Transfers the ownership of a given token ID to another address
    * @param _to address to receive the ownership of the given token ID
    * @param _tokenId uint ID of the token to be transferred
    */
    function _transfer(address _from, address _to, uint _tokenId) internal {
        checkOnlyOwnerOf(_from, _tokenId);
        clearApprovalAndTransfer(_from, _to, _tokenId);
    }

    /**
    * @dev Mint token function
    * @param _to The address that will own the minted token
    */
    function _mint(address _to, uint _tokenId) internal {
        require(_to != address(0));
        addToken(_to, _tokenId);
        emit Transfer(address(0), _to, _tokenId);
    }

    /**
    * @dev Burns a specific token
    * @param _tokenId uint ID of the token being burned by the msg.sender
    */
    function _burn(address _from, uint _tokenId) internal {
        checkOnlyOwnerOf(_from, _tokenId);
        if (tokenApprovedFor_[_tokenId] != 0) {
            clearApproval(_from, _tokenId);
        }
        removeToken(_from, _tokenId);
        emit Transfer(_from, address(0), _tokenId);
    }

    /**
    * @dev Internal function to clear current approval and transfer the ownership of a given token ID
    * @param _from address which you want to send tokens from
    * @param _to address which you want to transfer the token to
    * @param _tokenId uint ID of the token to be transferred
    */
    function clearApprovalAndTransfer(address _from, address _to, uint _tokenId) internal {
        require(_to != address(0));
        require(_to != _from);
        require(tokenOwner_[_tokenId] == _from);
  
        clearApproval(_from, _tokenId);
        removeToken(_from, _tokenId);
        addToken(_to, _tokenId);
        emit Transfer(_from, _to, _tokenId);
    }

    /**
    * @dev Internal function to clear current approval of a given token ID
    * @param _tokenId uint ID of the token to be transferred
    */
    function clearApproval(address _owner, uint _tokenId) private {
        require(tokenOwner_[_tokenId] == _owner);
        tokenApprovedFor_[_tokenId] = 0;
        emit Approval(_owner, 0, _tokenId);
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * @param _to address representing the new owner of the given token ID
    * @param _tokenId uint ID of the token to be added to the tokens list of the given address
    */
    function addToken(address _to, uint _tokenId) private {
        require(tokenOwner_[_tokenId] == address(0));
        
        tokenOwner_[_tokenId] = _to;
        uint length = ownedTokens_[_to].length;
        ownedTokens_[_to].push(_tokenId);
        ownedTokensIndex_[_tokenId] = length;
        totalTokens_ = totalTokens_.add(1);
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * @param _from address representing the previous owner of the given token ID
    * @param _tokenId uint ID of the token to be removed from the tokens list of the given address
    */
    function removeToken(address _from, uint _tokenId) private {
        require(tokenOwner_[_tokenId] == _from);
  
        uint tokenIndex = ownedTokensIndex_[_tokenId];
        uint lastTokenIndex = ownedTokens_[_from].length.sub(1);
        uint lastToken = ownedTokens_[_from][lastTokenIndex];
  
        tokenOwner_[_tokenId] = 0;
        ownedTokens_[_from][tokenIndex] = lastToken;
        ownedTokens_[_from][lastTokenIndex] = 0;
        // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
        // be zero. Then we can make sure that we will remove _tokenId from the ownedTokens list since we are first swapping
        // the lastToken to the first position, and then dropping the element placed in the last position of the list
  
        ownedTokens_[_from].length = ownedTokens_[_from].length.sub(1);
        ownedTokensIndex_[_tokenId] = 0;
        ownedTokensIndex_[lastToken] = tokenIndex;
        totalTokens_ = totalTokens_.sub(1);
    }
}

