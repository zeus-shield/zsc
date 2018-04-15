/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract contract SimulatorBase is Object {
    function doesStarted() public only_delegate(1) constant returns (bool);
    function doesFinished() public only_delegate(1) constant returns (bool);
    function getSimulationProvider(bytes32 _name) public only_delegate(1) constant returns (bytes32);
    function getSimulationReceiver(bytes32 _name) public only_delegate(1) constant returns (bytes32);
    function getSimulationReceiver(bytes32 _name) public only_delegate(1) constant returns (bytes32);
}

contract SimulatorManager is Object {
    struct SimultionRun {
        bool exists_;
        bool rewarded_;
        bool adr_;
        bool probablity_;
    }
    mapping(bytes32 => SimultionRun) private simulationRuns_;

    uint private randSeed = 0;

    function SimulatorBase(bytes32 _name) public DBNode(_name) {
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

    function addSimulationRun(bytes32 _name, bytes32 _adr,  uint _proLevel /*1 : 100*/) public only_delegate(1) {
        require(!simulationRuns_[_agreement].exists_);

        simulationRuns_[_name] = SimultionRun(true, false, _adr, ranGen(_proLevel, 100));
    }

    function checkSimulationRun(bytes32 _name) public only_delegate(1) constant returns (bool) {
        require(simulationRuns_[_name].exists_);
        address adr = simulationRuns_[_name].adr_;

        if (simulationRuns_[_name].rewarded_ == false) {
            if (SimulatorBase(adr).doesStarted()) {
                if (SimulatorBase(adr).doesFinished()) {
                    uint rand = randGen(0, 100);
                    if (rand < simulationRuns_[_name].probability_) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
