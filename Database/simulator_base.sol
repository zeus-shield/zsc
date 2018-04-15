/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_node.sol";

contract SimulatorBase is DBNode {
    bool started_;
    bool running_ ;
    bool autoReward_;  
    uint startTime_;
    uint endTime_; // in secons
    uint probability_;   //from 0 to 1000
    address agreement_ ;
    address provider_ ;
    address receiver_;
    
    uint private randSeed = 0;

    function SimulatorBase(bytes32 _name) public DBNode(_name) {
        running_ = false;
    }

    function initParameters() internal {
    }

    function startSimulation(bool _autoReward, address _agreement, address _provider, address _receiver, uint _duration) public only_delegate(1) {
        running_ = true;
        autoReward_ = _autoReward;
 
        startTime_   = now; 
        endTime_     = startTime_ + _duration;
        probability_ = ranGen(70, 100);
        agreement_   = _agreement;
        provider_    = _provider;
        receiver_    = _receiver
    }

    function doesStarted() public only_delegate(1) constant returns (bool) { 
        return started_;
    } 

    function doesFinished() public only_delegate(1) constant returns (bool) { 
        return (!running_);
    } 

    function getSimulationProvider(bytes32 _agreement) public only_delegate(1) constant returns (bytes32) {
        return provider_;
    }

    function getSimulationReceiver(bytes32 _agreement) public only_delegate(1) constant returns (bytes32) {
        return receiver_;
    }

    function getSimulationReceiver(bytes32 _agreement) public only_delegate(1) constant returns (bytes32) {
        return agreement_;
    }

    function getAddressInfo() public only_delegate(1) constant returns (address, address, address) {
        return (agreement_, provider_, receiver_);
    }
    
}
