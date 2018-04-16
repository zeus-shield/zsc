/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract SimulatorBase is Object {
    function doesStarted() public only_delegate(1) constant returns (bool);
    function doesFinished() public only_delegate(1) constant returns (bool);
    function getSimulationProvider(bytes32 _name) public only_delegate(1) constant returns (bytes32);
    function getSimulationReceiver(bytes32 _name) public only_delegate(1) constant returns (bytes32);
    function getSimulationAgreement(bytes32 _name) public only_delegate(1) constant returns (bytes32);
    function getAddressInfo() public only_delegate(1) constant returns (address, address, address);
}

contract SimulatorManager is Object {
    struct SimultionRun {
        bool rewarded_;
        address adr_;
        uint probability_;
    }
    mapping(bytes32 => SimultionRun) private simulationRuns_;
    mapping(bytes32 => bool) private simulationExists_;

    uint private randSeed_= 0;
    address private bindedDB_;
    address private apiController_;


    function SimulatorManager(bytes32 _name) public Object(_name) {
    }

    function initSimulatorManager(address _controller, address _database) public only_delegate(1)  {
        require(_database != 0);
        bindedDB_ = _database;

        if (_controller != 0 && _controller != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, 0);
            }
            apiController_ = _controller;
            setDelegate(_controller, 1);
        }
    }


    // Generates a random number
    // Original file at 
    // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
    function randGen(uint _min, uint _max, uint _seed) internal constant returns (uint){
        require(_max > _min);
        uint randValue = uint(keccak256(block.blockhash(block.number-1), _seed ))%(_max - _min);

        return (randValue + _min);
    }

    function addSimulationRun(bytes32 _name, address _adr,  uint _proLevel /*1 : 100*/) public only_delegate(1) {
        require(!simulationExists_[_name]);
        uint prob = randGen(_proLevel, 100, randSeed_++);

        simulationExists_[_name] = true;
        simulationRuns_[_name] = SimultionRun(false, _adr, prob);
    }

    function checkSimulationRun(bytes32 _name) public only_delegate(1) constant returns (bool) {
        require(simulationExists_[_name]);
        address adr = simulationRuns_[_name].adr_;
        uint seed = 0;

        if (simulationRuns_[_name].rewarded_ == false) {
            if (SimulatorBase(adr).doesStarted()) {
                if (SimulatorBase(adr).doesFinished()) {
                    uint rand = randGen(0, 100, seed++);
                    if (rand < simulationRuns_[_name].probability_) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
 
    function conductReward(bytes32 _name) public only_delegate(1) constant {
        require(simulationExists_[_name]);
        address sim = simulationRuns_[_name].adr_;
        address agreement;
        address provider;
        address receiver;
        (agreement, provider, receiver) = SimulatorBase(sim).getAddressInfo();
    }
}
