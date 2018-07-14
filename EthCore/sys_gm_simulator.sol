/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./simulator_base.sol";
import "./sys_com_module.sol";
import "./sys_include.sol";

contract SysGmSimulator is SysComModule {
    uint private simulationNos_;
    uint private simulationTempNos_;
    mapping(uint => address) private simulationRuns_;
    mapping(bytes32 => uint) private simulationIndices_;
    mapping(bytes32 => bool) private simulationExist_;
    mapping(address => bool) private rewarded_;

    function SysGmSimulator(bytes32 _name) public SysComModule(_name) {
        simulationNos_ = 0;
    }

    function formatSimulationName() private view returns (bytes32) {
        string memory str = PlatString.uintToString(SafeMath.add(1000, simulationTempNos_));
        return PlatString.tobytes32(str);
    }

    /*_proLev: 1 : 100*/
    function addSimulationRun(uint _proLevel, uint _price, uint _lockedAmount, uint _end,  address _agrWallet, address _proWallet, address _recWallet) public returns (bytes32) {
        checkDelegate(msg.sender, 1);

        bytes32 runName = formatSimulationName();
        require(!simulationExist_[runName]);

        address adr = new SimulatorBase(runName);
        require(adr != address(0));

        SimulatorBase(adr).startSimulation(_proLevel, _price, _end, _lockedAmount, _agrWallet, _proWallet, _recWallet);
        
        simulationExist_[runName] = true;
        simulationIndices_[runName] = simulationTempNos_;
        simulationRuns_[simulationTempNos_] = adr;
        simulationTempNos_++;
        rewarded_[adr] = false;
        
        return runName;
    }

    function checkSimulationRunByIndex(uint _index) private view returns (bool) {
        require(_index < simulationNos_);
        address sim = simulationRuns_[_index];
        return (rewarded_[sim] == false &&  SimulatorBase(sim).doesFinished());
    }

    function conductClaimAndReward(uint _simIndex) private returns (bool) {
        require(_simIndex < simulationNos_);
        address sim = simulationRuns_[_simIndex];
        address agrWallet = SimulatorBase(sim).getWalletAddress("agreement");
        address proWallet = SimulatorBase(sim).getWalletAddress("provider");
        address recWallet = SimulatorBase(sim).getWalletAddress("receiver");
        uint agrPrice_    = SimulatorBase(sim).getAgreementPrice();
        uint proLockedAmount_ = SimulatorBase(sim).getProviderLockedAmount();

        if (SimulatorBase(sim).needClaim()) {
            DBNode(agrWallet).executeTransaction(proWallet, agrPrice_);
            DBNode(agrWallet).executeTransaction(recWallet, proLockedAmount_);
        } else {
            DBNode(agrWallet).executeTransaction(proWallet, SafeMath.add(agrPrice_, proLockedAmount_));
        }
        SimulatorBase(sim).setFinished();
        rewarded_[sim] == true;
        return true;
    }

    function runSingleSimulation() private {        
        for (uint i = 0; i < simulationNos_; ++i) {
            if (checkSimulationRunByIndex(i)) {
                conductClaimAndReward(i);
            }
        }
    }
    
    function runSimulation(uint _steps) public {
        checkDelegate(msg.sender, 1);
        simulationNos_ = simulationTempNos_;
        
        for (uint i = 0; i < _steps; ++i) {
            runSingleSimulation();
        }
    }
}
