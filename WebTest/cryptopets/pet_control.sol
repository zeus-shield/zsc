/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract PetControl {

    address ceoAddress_;
    address cfoAddress_;
    address cooAddress_;

    bool paused_ = false;

    modifier onlyCEO() {
        require(msg.sender == ceoAddress_);
        _;
    }

    modifier onlyCFO() {
        require(msg.sender == cfoAddress_);
        _;
    }

    modifier onlyCOO() {
        require(msg.sender == cooAddress_);
        _;
    }

    modifier onlyCLevel() {
        require(msg.sender == cooAddress_
            || msg.sender == ceoAddress_
            || msg.sender == cfoAddress_
        );
        _;
    }

    modifier whenNotPaused() {
        require(!paused_);
        _;
    }

    modifier whenPaused {
        require(paused_);
        _;
    }

    function PetControl() public {}

    function setCEO(address _newCEO) external onlyCEO {
        require(address(0) != _newCEO);

        ceoAddress_ = _newCEO;
    }

    function setCFO(address _newCFO) external onlyCEO {
        require(address(0) != _newCFO);

        cfoAddress_ = _newCFO;
    }

    function setCOO(address _newCOO) external onlyCEO {
        require(address(0) != _newCOO);

        cooAddress_ = _newCOO;
    }

}