/*
 Copyright (c) 2018, ZSC Dev Team
*/

import "./pet_control.sol";

pragma solidity ^0.4.21;

contract PetBase is PetControl {

    function PetBase() public PetControl() {}
}