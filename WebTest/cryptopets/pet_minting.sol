/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./pet_auction.sol";

contract PetMinting is PetAuction {

    function PetMinting() public PetAuction() {}
}