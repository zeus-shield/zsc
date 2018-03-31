/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract SimulatorBase is Object {
    struct SimultionRun {
        bool running_ ;
        bool autoReward_;    //1: provider; 2: receiver 
        uint duration_; // in secons
        uint256 probability_;   //from 0 to 1000
        bytes32 provider_ ;
        bytes32 receiver_;
        bytes32 agreement_;
    }
    mapping(bytes32 => SimultionRun) private simulationRuns_;

    address private database_;
    address private controlApis_;

    function SimulatorBase() public Object("zsc_simulation") {}

    // Generates a random number
    // Original file at 
    // https://gist.github.com/anonymous/06a86a039f01dc15fd14
    function randGen(uint min, uint max) internal constant returns (uint256){
        uint256 lastBlockNumber = block.number - 1;
        uint256 hashVal = uint256(block.blockhash(lastBlockNumber));
        
        // This turns the input data into a 100-sided die
        // by dividing by ceil(2 ^ 256 / 100).
        uint256 FACTOR = 1157920892373161954235709850086879078532699846656405640394575840079131296399;
        return uint256(uint256(hashVal) / FACTOR) + 1;
    }

    function initSimulation(address _controller, address _database) public only_delegate  {
        require(_controller != 0 && _database != 0);
        database_ = _database;
        controlApis_ = _controller;

        setDelegate(_controller, true);
        setDelegate(_database, true);
    }

    function addSimulationRun(bytes32 _name, bytes32 _provider, bytes32 _receiver, bytes32 _agreement, uint _duration) public only_delegate {
        simulationRuns_[_name] = SimultionRun(true, true,_duration, ranGen(70, 100), _provider, _receiver, _agreement);
    }
}
