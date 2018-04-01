/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_node.sol";

contract DBSimulator is DBNode {
    struct SimultionRun {
        bool started_;
        bool running_ ;
        bool autoReward_;  
        uint startTime_;
        uint endTime_; // in secons
        uint probability_;   //from 0 to 1000
        bytes32 provider_ ;
        bytes32 receiver_;
        bytes32 agreement_;
    }
    mapping(bytes32 => SimultionRun) private simulationRuns_;

    uint private randSeed = 0;

    function DBSimulator(bytes32 _name) public DBNode(_name) {
    }

    function initParameters() internal {
    }

    // Generates a random number
    // Original file at 
    // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
    function randGen(uint _min, uint _max) internal constant returns (uint256){
        require(_max > _min);
        randSeed++;
        uint randValue = uint(sha3(block.blockhash(block.number-1), randSeed ))%(_max - _min);

        return (randValue + _min);
    }

    function addSimulationRun(bytes32 _name, bytes32 _provider, bytes32 _receiver, bytes32 _agreement, uint _duration) public only_delegate {
        require(!simulationRuns_[_name].started_);
        uint current = now; 
        simulationRuns_[_name] = SimultionRun(true, true, true, current, current + _duration, ranGen(70, 100), _provider, _receiver, _agreement);
    }

    function checkSimulationRun(bytes32 _name) public only_delegate constant returns (bool) {
        require(simulationRuns_[_name].started_);

        if (simulationRuns_[_name].running_ == true) {
            if (now > simulationRuns_[_name].endTime_) {
                simulationRuns_[_name].running_ = true;
                uint rand = randGen(0, 100);
                if (rand > simulationRuns_[_name].probability_) {
                    return true;
                }
            }
        }
        return false;
    }
}
