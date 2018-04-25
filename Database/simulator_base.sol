/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";
import "./plat_math.sol";

contract SimulatorBase is Object {
    bool private started_;
    bool private running_ ;
    uint private probability_;   //from 0 to 1000
    uint private agrPrice_;
    uint private proLockedAmount_;
    bytes32 private tokeSymbol_;
    address private agrWalletAdr_ ;
    address private proWalletAdr_ ;
    address private recWalletAdr_;
    
    uint private randSeed = 0;

    function SimulatorBase(bytes32 _name) public Object(_name) {
        running_ = false;
    }

    // Generates a random number
    // Original file at 
    // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
    function randGen(uint _min, uint _max, uint _seed) private constant returns (uint){
        require(_max > _min);
        uint randValue = uint(keccak256(block.blockhash(block.number-1), _seed ))%(_max - _min);

        return SafeMath.add(randValue, _min);
    }

    function startSimulation(uint _probLevel, uint _price, uint _lockedAmount, address _agrWallet, address _proWallet, address _recWallet) public only_delegate(1) {
        require(_agrWallet != address(0), _proWallet != address(0), _recWallet != address(0), )
        running_         = true;
        probability_     = randGen(_probLevel, 100, now);
        agrPrice_        = _price;
        proLockedAmount_ = _lockedAmount;
        agrWalletAdr_    = _agrWallet;
        proWalletAdr_    = _proWallet;
        recWalletAdr_    = _recWallet;
    }

    function doesStarted() public only_delegate(1) constant returns (bool) { 
        return started_;
    } 

    function doesFinished() public only_delegate(1) constant returns (bool) { 
        return (!running_);
    } 

    function needClaim() public only_delegate(1) constant returns (bool) {
        uint rand = randGen(0, 100, now);
        if (rand < probability_) {
            return true;
        }
        return false;
    }

    function getAgreementPrice() public only_delegate(1) constant returns (uint) {
        return agrPrice_;
    }

    function getProviderLockedAmount() public only_delegate(1) constant returns (uint) {
        return proLockedAmount_;
    }

    function getWalletAddress(bytes32 _type) public only_delegate(1) constant returns (address) {
        if (_type == "proivder") {
            return proWalletAdr_;
        } else if (_type == "agreement") {
            return agrWalletAdr_;
        } else if (_type == "receiver") {
            return recWalletAdr_;
        } else {
            return 0;
        }
    }
    
}
