/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./simulator_base.sol";

contract SimulatorManager is Object {
    mapping(bytes32 => address) private simulationRuns_;
    mapping(bytes32 => bool) private rewarded_;

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
    
    /*_proLev: 1 : 100*/
    function addSimulationRun(bytes32 _name, uint _proLevel, address _agreement, address _provider, address _receiver) public only_delegate(1) {
        require(simulationRuns_[_name] == address(0));

        address adr = new SimulatorBase(_name);
        SimulatorBase(adr).startSimulation(_proLevel, _agreement, _provider, _receiver);
        simulationRuns_[_name] = adr;
        rewarded_[_name] = false;
    }

    function checkSimulationRun(bytes32 _name) public only_delegate(1) constant returns (bool) {
        require(simulationRuns_[_name] != address(0));

        address adr = simulationRuns_[_name];

        if (rewarded_[_name] == false) {
            if (SimulatorBase(adr).doesStarted()) {
                if (SimulatorBase(adr).doesFinished()) {
                    return SimulatorBase(adr).needReward();   
                }
            }
        }
        return false;
    }
 
    function conductReward(bytes32 _name) public only_delegate(1) constant {
        require(simulationRuns_[_name] != address(0));

        address sim = simulationRuns_[_name];
        address agreement;
        address provider;
        address receiver;
        (agreement, provider, receiver) = SimulatorBase(sim).getAddressInfo();
    }
}
