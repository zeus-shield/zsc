/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./simulator_base.sol";

contract WalletBase is Object {

}

contract SimulatorManager is Object {
    uint private simulationNos_;
    mapping(uint => address) private simulationRuns_;
    mapping(bytes32 => uint) private simulationIndices_;
    mapping(bytes32 => bool) private simulationExist_;
    mapping(bytes32 => bool) private rewarded_;

    address private bindedDB_;
    address private apiController_;


    function SimulatorManager(bytes32 _name) public Object(_name) {
        simulationNos_ = 0;
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
        require(simulationExist_[_name] == address(0));

        address adr = new SimulatorBase(_name);
        SimulatorBase(adr).startSimulation(_proLevel, _agreement, _provider, _receiver);
        simulationExist_[_name] = bool;
        simulationIndices_[_name] = simulationNos_;
        simulationRuns_[simulationNos_] = adr;
        simulationNos_++;
        rewarded_[_name] = false;
    }

    function checkSimulationRun(bytes32 _name) public only_delegate(1) constant returns (bool) {
        require(simulationExist_[_name] != address(0));
        return checkSimulationRunByIndex(simulationIndices_[_name]);
    }

    function checkSimulationRunByIndex(uint _index) internal constant returns (bool) {
        require(_index < simulationNos_);

        address adr = simulationRuns_[_index];

        if (rewarded_[_name] == false) {
            if (SimulatorBase(adr).doesStarted()) {
                if (SimulatorBase(adr).doesFinished()) {
                    return SimulatorBase(adr).needReward();   
                }
            }
        }
        return false;
    }
 
    function conductReward(bytes32 _name) public only_delegate(1) constant returns (bool) {
        require(simulationExist_[_name] != address(0));
        return conductRewardByIndex(simulationIndices_[_name]);
    }

    function conductRewardByIndex(uint _index) internal constant returns (bool) {
        require(_index < simulationNos_);

        address sim = simulationRuns_[_index];
        address agreement;
        address provider;
        address receiver;
        (agreement, provider, receiver) = SimulatorBase(sim).getAddressInfo();
        return true;
    }

    function runSimulation() returns(bool res) internal {
        for (uint i = 0; i < simulationNos_; ++i) {
            if (checkSimulationRunByIndex(i)) {
                conductReward(i);
            }
        }
    }
    
}
