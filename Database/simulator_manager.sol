/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./simulator_base.sol";

contract WalletBase is Object {
    function getBlance(bool _locked) public only_delegate(1) constant returns (uint256);
    function getLockBalanceInfoByAgreement(address _agreementAdr) public only_delegate(1) constant returns (uint, uint, uint, address);
    function setLockValue(bool _tag, uint _amount, uint _duration, address _agreementAdr) public only_delegate(1) returns (bool);
    function executeTransaction(address _dest, uint256 _amount, bytes _data) public only_delegate(1) returns (bool);
}

contract DBDatabase is Object { 
    function getNode(bytes32 _name) public only_delegate(1) constant returns (address);
}

contract SimulatorManager is Object {
    uint private simulationNos_;
    uint private simulationTempNos_;
    mapping(uint => address) private simulationRuns_;
    mapping(bytes32 => uint) private simulationIndices_;
    mapping(bytes32 => bool) private simulationExist_;
    mapping(address => bool) private rewarded_;

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

    function formatSimulationName() private constant returns (bytes32) {
        string memory str = PlatString.uintToString(1000 + simulationTempNos_);
        return PlatString.tobytes32(str);
    }

    /*_proLev: 1 : 100*/
    function addSimulationRun(uint _proLevel, uint _price, uint _lockedAmount, address _agrWallet, address _proWallet, address _recWallet) public only_delegate(1) returns (bytes32) {
        bytes32 runName = formatSimulationName();
        require(!simulationExist_[runName]);

        address adr = new SimulatorBase(runName);
        SimulatorBase(adr).startSimulation(_proLevel, _price, _lockedAmount, _agrWallet, _proWallet, _recWallet);
        simulationExist_[runName] = true;
        simulationIndices_[runName] = simulationTempNos_;
        simulationRuns_[simulationTempNos_] = adr;
        simulationTempNos_++;
        rewarded_[adr] = false;
        return runName;
    }

    function checkSimulationRunByIndex(uint _index) private constant returns (bool) {
        address sim = simulationRuns_[_index];
        if (rewarded_[sim] == false) {
            if (SimulatorBase(sim).doesStarted() && SimulatorBase(sim).doesFinished()) {
                return true;
            }
        }
        return false;
    }

    function conductClaimAndReward(uint _simIndex) private returns (bool) {
        address sim = simulationRuns_[_simIndex];

        address agrWallet = SimulatorBase(sim).getWalletAddress("agreement");
        address proWallet = SimulatorBase(sim).getWalletAddress("provider");
        address recWallet = SimulatorBase(sim).getWalletAddress("receiver");
        uint agrPrice_ = SimulatorBase(sim).getAgreementPrice();
        uint proLockedAmount_ = SimulatorBase(sim).getProviderLockedAmount();

        if (SimulatorBase(sim).needClaim()) {
            WalletBase(agrWallet).executeTransaction(proWallet, agrPrice_, "purchase fee");
            WalletBase(agrWallet).executeTransaction(recWallet, proLockedAmount_, "claimed fee");
        } else {
            WalletBase(agrWallet).executeTransaction(proWallet, agrPrice_ + proLockedAmount_, "reward fee");
        }
        return true;
    }

    function runSimulation() public only_delegate(1) returns (bool) {
        simulationNos_ = simulationTempNos_;
        
        for (uint i = 0; i < simulationNos_; ++i) {
            if (checkSimulationRunByIndex(i)) {
                conductClaimAndReward(i);
            }
        }
        return true;
    }
    
}
