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

    // Total amount of deeds
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

    function approve(address _to, uint256 _tokenId) external onlyOwnerOf(_deedId) payable {
        checkOnlyOwnerOf(_tokenId, msg.sender);
        require(_to != msg.sender);

        if(_to != address(0) || approvedFor(_deedId) != address(0)) {
            Approval(msg.sender, _to, _deedId);
        }
        tokenApprovedFor[_tokenId] = _to;
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return tokenApprovedFor[_tokenId];
    }

    /**
    * @dev Gets the deed ID of the specified address at the specified index
    * @param _owner address for the deed's owner
    * @param _index uint256 for the n-th deed in the list of deeds owned by this owner
    * @return uint256 representing the ID of the deed
    */
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256) {
        require(_owner != address(0));
        require(_index < ownedTokens[_owner].length);
        return ownedTokens[_owner][_index];
    }

    /**
    * @dev Gets all token IDs of the specified address
    * @param _owner address for the deed's owner
    * @return uint256[] representing all deed IDs owned by the passed address
    */
    function tokensOf(address _owner) external view returns (uint256[] _ownedDeedIds) {
      require(_owner != address(0));
      _ownedDeedIds = ownedDeeds[_owner];
    }

    /**
    * @dev Claims the ownership of a given deed ID
    * @param _deedId uint256 ID of the deed being claimed by the msg.sender
    */
    function takeOwnership(uint256 _deedId)
    external payable {
      require(approvedFor(_deedId) == msg.sender);
      clearApprovalAndTransfer(deedOwner[_deedId], msg.sender, _deedId);
    }

    /**
     * @dev Gets the approved address to take ownership of a given deed ID
     * @param _deedId uint256 ID of the deed to query the approval of
     * @return address currently approved to take ownership of the given deed ID
     */
    function approvedFor(uint256 _deedId)
    public view returns (address) {
      return deedApprovedFor[_deedId];
    }

    /**
    * @dev Transfers the ownership of a given deed ID to another address
    * @param _to address to receive the ownership of the given deed ID
    * @param _deedId uint256 ID of the deed to be transferred
    */
    function transfer(address _to, uint256 _deedId)
    public onlyOwnerOf(_deedId) {
      clearApprovalAndTransfer(msg.sender, _to, _deedId);
    }

    /**
    * @dev Mint deed function
    * @param _to The address that will own the minted deed
    */
    function _mint(address _to, uint256 _deedId)
    internal {
      require(_to != address(0));
      addDeed(_to, _deedId);
      Transfer(0x0, _to, _deedId);
    }

    /**
    * @dev Burns a specific deed
    * @param _deedId uint256 ID of the deed being burned by the msg.sender
    */
    function _burn(uint256 _deedId) onlyOwnerOf(_deedId)
    internal {
      if (approvedFor(_deedId) != 0) {
        clearApproval(msg.sender, _deedId);
      }
      removeDeed(msg.sender, _deedId);
      Transfer(msg.sender, 0x0, _deedId);
    }

    /**
    * @dev Internal function to clear current approval and transfer the ownership of a given deed ID
    * @param _from address which you want to send deeds from
    * @param _to address which you want to transfer the deed to
    * @param _deedId uint256 ID of the deed to be transferred
    */
    function clearApprovalAndTransfer(address _from, address _to, uint256 _deedId)
    internal {
      require(_to != address(0));
      require(_to != _from);
      require(deedOwner[_deedId] == _from);

      clearApproval(_from, _deedId);
      removeDeed(_from, _deedId);
      addDeed(_to, _deedId);
      Transfer(_from, _to, _deedId);
    }

    /**
    * @dev Internal function to clear current approval of a given deed ID
    * @param _deedId uint256 ID of the deed to be transferred
    */
    function clearApproval(address _owner, uint256 _deedId)
    private {
      require(deedOwner[_deedId] == _owner);
      deedApprovedFor[_deedId] = 0;
      Approval(_owner, 0, _deedId);
    }

    /**
    * @dev Internal function to add a deed ID to the list of a given address
    * @param _to address representing the new owner of the given deed ID
    * @param _deedId uint256 ID of the deed to be added to the deeds list of the given address
    */
    function addDeed(address _to, uint256 _deedId)
    private {
      require(deedOwner[_deedId] == address(0));
      deedOwner[_deedId] = _to;
      uint256 length = ownedDeeds[_to].length;
      ownedDeeds[_to].push(_deedId);
      ownedDeedsIndex[_deedId] = length;
      totalDeeds = totalDeeds.add(1);
    }

    /**
    * @dev Internal function to remove a deed ID from the list of a given address
    * @param _from address representing the previous owner of the given deed ID
    * @param _deedId uint256 ID of the deed to be removed from the deeds list of the given address
    */
    function removeDeed(address _from, uint256 _deedId)
    private {
      require(deedOwner[_deedId] == _from);

      uint256 deedIndex = ownedDeedsIndex[_deedId];
      uint256 lastDeedIndex = ownedDeeds[_from].length.sub(1);
      uint256 lastDeed = ownedDeeds[_from][lastDeedIndex];

      deedOwner[_deedId] = 0;
      ownedDeeds[_from][deedIndex] = lastDeed;
      ownedDeeds[_from][lastDeedIndex] = 0;
      // Note that this will handle single-element arrays. In that case, both deedIndex and lastDeedIndex are going to
      // be zero. Then we can make sure that we will remove _deedId from the ownedDeeds list since we are first swapping
      // the lastDeed to the first position, and then dropping the element placed in the last position of the list

      ownedDeeds[_from].length--;
      ownedDeedsIndex[_deedId] = 0;
      ownedDeedsIndex[lastDeed] = deedIndex;
      totalDeeds = totalDeeds.sub(1);
    }
}


