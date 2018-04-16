/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract SimulatorBase is Object {
    bool started_;
    bool running_ ;
    uint probability_;   //from 0 to 1000
    address agreement_ ;
    address provider_ ;
    address receiver_;
    
    uint private randSeed = 0;

    function SimulatorBase(bytes32 _name) public Object(_name) {
        running_ = false;
    }

    // Generates a random number
    // Original file at 
    // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
    function randGen(uint _min, uint _max, uint _seed) private constant returns (uint){
        require(_max > _min);
        uint randValue = uint(keccak256(block.blockhash(block.number-1), _seed ))%(_max - _min);

        return (randValue + _min);
    }

    function startSimulation(uint _probLevel, address _agreement, address _provider, address _receiver) public only_delegate(1) {
        running_ = true;
        probability_ = randGen(_probLevel, 100, now);
        agreement_   = _agreement;
        provider_    = _provider;
        receiver_    = _receiver;
    }

    function doesStarted() public only_delegate(1) constant returns (bool) { 
        return started_;
    } 

    function doesFinished() public only_delegate(1) constant returns (bool) { 
        return (!running_);
    } 

    function needReward() public only_delegate(1) constant returns (bool) {
        uint rand = randGen(0, 100, now);
        if (rand < probability_) {
            return true;
        }
        return false;
    }

    function getAddressInfo() public only_delegate(1) constant returns (address, address, address) {
        return (agreement_, provider_, receiver_);
    }
    
}
