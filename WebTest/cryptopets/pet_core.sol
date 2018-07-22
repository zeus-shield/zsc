/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./pet_minting.sol";

contract PetCore is PetMinting {

    function PetCore() public PetMinting() {}
}