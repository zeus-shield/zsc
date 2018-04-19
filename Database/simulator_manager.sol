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
        string memory str = PlatString.uintToString(1000 + simulationNos_);
        return PlatString.tobytes32(str);
    }
    
    function checkPayable(uint _price, bytes32 _tokenSymbol, address _buyer) {
        string memory strRec = PlatString.append(Object(_buyer).name(), "-", _tokenSymbol);
        address recWalletAdr = DBDatabase(bindedDB_).getNode(PlatString.tobytes32(strRec));
        uint freeBalance = WalletBase(recWalletAdr).getBlance(false) - WalletBase(recWalletAdr).getBlance(true);
        return (freeBalance >= _price);
    }

    /*_proLev: 1 : 100*/
    function addSimulationRun(uint _proLevel, uint _price, bytes32 _tokenSymbol, address _agreement, address _provider, address _receiver) public only_delegate(1) returns (bytes32) {
        bytes32 runName = formatSimulationName();
        require(!simulationExist_[runName]);

        if (!checkPayable(_price, _tokenSymbol, _receiver)) return "null";

        address adr = new SimulatorBase(runName);
        SimulatorBase(adr).startSimulation(_proLevel, _tokenSymbol, _agreement, _provider, _receiver);
        simulationExist_[runName] = true;
        simulationIndices_[runName] = simulationNos_;
        simulationRuns_[simulationNos_] = adr;
        simulationNos_++;
        rewarded_[adr] = false;
        return runName;
    }

    function checkSimulationRun(bytes32 _name) public only_delegate(1) constant returns (bool) {
        require(simulationExist_[_name]);
        return checkSimulationRunByIndex(simulationIndices_[_name]);
    }

    function checkSimulationRunByIndex(uint _index) internal constant returns (bool) {
        require(_index < simulationNos_);

        address adr = simulationRuns_[_index];

        if (rewarded_[adr] == false) {
            if (SimulatorBase(adr).doesStarted()) {
                if (SimulatorBase(adr).doesFinished()) {
                    return SimulatorBase(adr).needReward();   
                }
            }
        }
        return false;
    }

    function getRewardWalletInfoByIndex(uint _index) private constant returns (address, address, address) {
        require(_index < simulationNos_);

        address sim = simulationRuns_[_index];
        address agreement;
        address provider;
        address receiver;
        bytes32 symbol;
        (symbol, agreement, provider, receiver) = SimulatorBase(sim).getAddressInfo();

        string memory strPro = PlatString.append(Object(provider).name(), "-", symbol);
        string memory strRec = PlatString.append(Object(receiver).name(), "-", symbol);
        address proWalletAdr = DBDatabase(bindedDB_).getNode(PlatString.tobytes32(strPro));
        address recWalletAdr = DBDatabase(bindedDB_).getNode(PlatString.tobytes32(strRec));
        require(proWalletAdr != address(0) && recWalletAdr != address(0));

        return (agreement, proWalletAdr, recWalletAdr);
    }

    function conductReward(address _agreementAdr, address _proWalletAdr, address _recWalletAdr) private returns (bool) {
        uint amount;
        uint time;
        uint duration;
        address agreement;
        (amount, time, duration, agreement) = WalletBase(_proWalletAdr).getLockBalanceInfoByAgreement(_agreementAdr);

        WalletBase(_proWalletAdr).setLockValue(false, amount, duration, agreement);
        if (WalletBase(_proWalletAdr).executeTransaction(_recWalletAdr, amount, "reward") == false) {
            WalletBase(_proWalletAdr).setLockValue(true, amount, duration, agreement);
            return false;
        }
        return true;
    }

    function runSimulation() public only_delegate(1) returns (bool) {
        address agreementAdr;
        address proWalletAdr;
        address recWalletAdr;
        for (uint i = 0; i < simulationNos_; ++i) {
            if (checkSimulationRunByIndex(i)) {
                (agreementAdr, proWalletAdr, recWalletAdr) = getRewardWalletInfoByIndex(i);
                conductReward(agreementAdr, proWalletAdr, recWalletAdr);
            }
        }
        return true;
    }
    
}
