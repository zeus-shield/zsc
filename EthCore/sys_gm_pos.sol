/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmPosEffect {
    function getExtraStakePoint(uint _robotId) public view returns (uint);
    function getExtraRewardRatio(uint _robotId) public view returns (uint);
    function getExtraUpgradeProbability(uint _robotId) public view returns (uint);
}

contract SysGmPos is Erc721Adv, SysGmBase {
    uint internal constant DAY_IN_SECONDS = 86400;
    uint internal constant MAX_RATIO_VALUE = 10000;
    uint public dayInSeconds_;

    struct RobotUnit {
        bytes32 status_;
        bytes32 ctg_;
        bytes32 name_;
        bool specific_;
        uint rare_;

        uint spLev_;
        uint spCur_;
        uint spMax_;
        uint spBase_;
        uint spBirth_;

        uint mineStart_;
        uint mineEnd_;

        uint rrType_; //days
        uint rrBirth_;  //xx&
        uint rrLevEft_; //xx%

        uint upProbBase_;
        uint upProbBirth_;
        uint upPrice_;

        uint sellPrice_;
        address seller_;
    }
    uint private robotNos_;
    mapping(uint => RobotUnit) private robots_;

    struct CtgUnit {
        bytes32 ctg_;
        bytes32 name_;
        uint rare_;
        uint spBirthMin_;
        uint spBirthMax_;
        uint rrBirthMin_;
        uint rrBirthMax_;
        uint upProbBirthMin_;
        uint upProbBirthMax_;
    }
    uint private ctgNos_;
    mapping(uint => CtgUnit) private ctgs_;
    mapping(bytes32 => bool) private ctgExits_;
    mapping(bytes32 => uint) private ctgIndice_;

    struct RareGroup {
        uint size_;
        mapping(uint => bytes32) ctgs_;
    }
    mapping(uint => RareGroup) private rares_;
    mapping(bytes32 => uint) private rareProb_;

    address public extraEffectObj_;

    uint public priceToCreate_;
    bool public publicTradeable_ = true;
    string public tokenUri_;

    uint public minePerDay_;
    uint public rewardPerDay_;

    uint public admPri_ = 5;
    uint public subPri_ = 10;

    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
        dayInSeconds_ = DAY_IN_SECONDS;
    } 

    //////////////////////////
    function checkTradeAble(uint256 _unitId) internal view returns (bool) {
        require(robots_[_unitId].status_ == "idle");
        return publicTradeable_;
    }

    function tokenURI(uint _tokenId) public view returns (string) {
        string memory url = PlatString.append(tokenUri_, PlatString.uintToString(_tokenId));
        return url;
    }

    //////////////////////////    
    function checkUnitUser(address _user, uint _unitId) internal view {
        require(_user == ownerOf(_unitId));
    }

    function getRandomUnitCategory() internal view returns (bytes32) {
        uint ran = random(0, 10000);
        uint rareLev;
        if (ran <= rareProb_["R"]) {
            rareLev = 0;
        } else if (ran >rareProb_["R"] && ran <= rareProb_["SR"]) {
            rareLev = 1;
        } else if (ran >rareProb_["SR"] && ran <= rareProb_["SSR"]) {
            rareLev = 2;
        } else {
            rareLev = 3;
        }

        ran = random(0, rares_[rareLev].size_);
        return rares_[rareLev].ctgs_[ran];
    }

    function mintUnit(address _user, bytes32 _ctg) internal returns (uint) {
        uint index = robotNos_;
        robotNos_++;
        _mint(_user, index);

        //bytes32 ctgName = getRandomUnitCategory();
        uint ctgIndex = ctgIndice_[_ctg];

        robots_[index].specific_  = false;
        robots_[index].status_ = "idle";
        robots_[index].ctg_    = _ctg;
        robots_[index].name_   = ctgs_[ctgIndex].name_;
        robots_[index].rare_   = ctgs_[ctgIndex].rare_;
        robots_[index].spLev_  = 0;
        robots_[index].spCur_     = 0;
        robots_[index].spMax_     = 0;
        robots_[index].spBase_    = 0;
        robots_[index].mineStart_ = 0;
        robots_[index].mineEnd_   = 0;
        robots_[index].upProbBase_   = 0;

        if (ctgs_[ctgIndex].spBirthMin_ == ctgs_[ctgIndex].spBirthMax_) {
            robots_[index].spBirth_ = ctgs_[ctgIndex].spBirthMin_;
        } else {
            robots_[index].spBirth_  = random(ctgs_[ctgIndex].spBirthMin_, ctgs_[ctgIndex].spBirthMax_);
        }

        if (ctgs_[ctgIndex].rrBirthMin_ == ctgs_[ctgIndex].rrBirthMax_) {
            robots_[index].rrBirth_ = ctgs_[ctgIndex].rrBirthMin_;
        } else {
            robots_[index].rrBirth_  = random(ctgs_[ctgIndex].rrBirthMin_, ctgs_[ctgIndex].rrBirthMax_);
        }

        if (ctgs_[ctgIndex].upProbBirthMin_ == ctgs_[ctgIndex].upProbBirthMax_) {
            robots_[index].upProbBirth_ = ctgs_[ctgIndex].upProbBirthMin_;
        } else {
            robots_[index].upProbBirth_  = random(ctgs_[ctgIndex].upProbBirthMin_, ctgs_[ctgIndex].upProbBirthMax_);
        }

        return index;
    }

    //////////////////////////
    function setPublicTradeable(bool _tag) public {
        checkDelegate(msg.sender, 1);
        publicTradeable_ = _tag;
    }

    function setCommenTokenURI(string _uri) public {
        checkDelegate(msg.sender, admPri_);
        tokenUri_ = _uri;
    }

    function setCreatePrice(uint _price) public {
        checkDelegate(msg.sender, admPri_);
        require(_price > 0);
        priceToCreate_ = _price;
    }

    function setExtraEffectObj(address _adr) public {
        checkDelegate(msg.sender, admPri_);
        extraEffectObj_ = _adr;
    }

    function downscaledDay(uint ratio) public {
        checkDelegate(msg.sender, admPri_);

        require(ratio > 0 && ratio <= DAY_IN_SECONDS);
        dayInSeconds_ = DAY_IN_SECONDS;
        dayInSeconds_ = dayInSeconds_.div(ratio);   
    }

    function setPosRatio(uint _mineRaioPerDay, uint _rewardRatioPerDay) public {
        checkDelegate(msg.sender, admPri_);

        minePerDay_ = _mineRaioPerDay;
        rewardPerDay_ = _rewardRatioPerDay;
    }

    function setRareThreshold(uint _N, uint _R, uint _SR, uint _SSR) public {
        checkDelegate(msg.sender, admPri_);
        rareProb_["N"] = _N;
        rareProb_["R"] = _R;
        rareProb_["SR"] = _SR;
        rareProb_["SSR"] = _SSR;
    }
   
    function setUnitCategory(string _ctgStr, string _nameStr, uint _rare, uint _spBirthMin, uint _spBirthMax, uint _rrBirthMin, uint _rrBirthMax, uint _upProbBirthMin, uint _upProbBirthMax) public {
        checkDelegate(msg.sender, subPri_);
        require(_rare < 4);
        uint index;
        bytes32 _name = PlatString.tobytes32(_nameStr);
        bytes32 _ctg  = PlatString.tobytes32(_ctgStr);

        if (!ctgExits_[_ctg]) {
            index = ctgNos_;
            ctgNos_++;
    
            ctgExits_[_ctg] = true;
            ctgIndice_[_ctg] = index;

            uint ctgIndex = rares_[_rare].size_;
            rares_[_rare].size_++;
            rares_[_rare].ctgs_[ctgIndex] = _ctg;
        } else {
            index = ctgIndice_[_ctg];
            require(ctgs_[index].rare_ == _rare);
        }

        ctgs_[index].ctg_      = _ctg;
        ctgs_[index].name_     = _name;
        ctgs_[index].spBirthMin_ = _spBirthMin;
        ctgs_[index].spBirthMax_ = _spBirthMax;
        ctgs_[index].rrBirthMin_ = _rrBirthMin;
        ctgs_[index].rrBirthMax_ = _rrBirthMax;
        ctgs_[index].upProbBirthMin_ = _upProbBirthMin;
        ctgs_[index].upProbBirthMax_ = _upProbBirthMax;
    }
    
    function numUnitCatetories() public view returns (uint) {
        return ctgNos_;
    }

    function getUnitCategoryByIndex(uint _index) public view returns (string) {
        require(_index < ctgNos_);
        string memory str ="info?";

        str = PlatString.append(str, "ctg=",          PlatString.bytes32ToString(ctgs_[_index].ctg_), "&");
        str = PlatString.append(str, "name=",         PlatString.bytes32ToString(ctgs_[_index].name_), "&");
        str = PlatString.append(str, "rare=",         PlatString.uintToString(ctgs_[_index].rare_), "&");
        str = PlatString.append(str, "spBirthMin=",     PlatString.uintToString(ctgs_[_index].spBirthMin_), "&");
        str = PlatString.append(str, "spBirthMax=",     PlatString.uintToString(ctgs_[_index].spBirthMax_), "&");
        str = PlatString.append(str, "rrBirthMin=",     PlatString.uintToString(ctgs_[_index].rrBirthMin_), "&");
        str = PlatString.append(str, "rrBirthMax=",     PlatString.uintToString(ctgs_[_index].rrBirthMax_), "&");
        str = PlatString.append(str, "upProbBirthMin=", PlatString.uintToString(ctgs_[_index].upProbBirthMin_), "&");
        str = PlatString.append(str, "upProbBirthMax=", PlatString.uintToString(ctgs_[_index].upProbBirthMax_), "&");
        
        return str;
    }

    ///////////////
    function setUnitSpec(uint _unitId, bool _tag) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].specific_ = _tag;
    }

    function setUnitBirthValue(uint _unitId, uint _sp, uint _rr, uint _up) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].spBirth_ = _sp;
        robots_[_unitId].rrBirth_ = _rr;
        robots_[_unitId].upProbBirth_ = _up;
    }

    function setUnitStatus(uint _unitId, bytes32 _status) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].status_ = _status;
    }

    function setUnitSPLev(uint _unitId, uint _lev) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].spLev_ = _lev;
    }

    function setUnitSPBase(uint _unitId, uint _base) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].spBase_ = _base;
    }

    function setUnitSPMax(uint _unitId, uint _max) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].spMax_ = _max;
    }

    function setUnitSPCur(uint _unitId, uint _cur) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].spCur_ = _cur;
    }

    function setUnitUPBase(uint _unitId, uint _base) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].upProbBase_ = _base;
    }

    function setUnitUPPrice(uint _unitId, uint _price) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].upPrice_ = _price;
    }

    function setUnitRRType(uint _unitId, uint _type) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].rrType_ = _type;
    }

    function setUnitRRLevEft(uint _unitId, uint _eft) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].rrLevEft_ = _eft;
    }

    function setUnitMineStart(uint _unitId, uint _tm) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].mineStart_ = _tm;
    }

    function setUnitMineEnd(uint _unitId, uint _tm) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].mineEnd_ = _tm;
    }

    function setUnitSeller(uint _unitId, address _seller) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].seller_ = _seller;
    }

    function setUnitSellPrice(uint _unitId, uint _price) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].sellPrice_ = _price;
    }

    function resetUnitMineInfo(uint _robotId) public {
        checkDelegate(msg.sender, 1);
        robots_[_robotId].spCur_     = 0;
        robots_[_robotId].spMax_     = 0; 
        robots_[_robotId].mineStart_ = 0;
        robots_[_robotId].mineEnd_   = 0;
        robots_[_robotId].rrType_    = 0;
        robots_[_robotId].rrLevEft_  = 0;
    }

    //////////////////////
    function numAllUnits() public view returns (uint) {
        return robotNos_;  
    }

    function getCreatePrice() public view returns (uint) {
        return priceToCreate_;
    }

    function getPublicTradeableTag() public view returns (uint) {
        if (publicTradeable_) {
            return 1;
        } else {
            return 0;
        }
    }    

    function getDayInSeconds() public view returns (uint) {
        return dayInSeconds_;
    }
    
    function getUnitRRMinedPerday() public view returns (uint) {
        return minePerDay_;
    }

    function getUnitRRRewardPerday() public view returns (uint) {
        return rewardPerDay_;
    }

    function getUnitName(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].name_;
    }

    function getCategoryName(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].ctg_;
    }

    function getUnitSpec(uint _unitId) public view returns (bool) {
        return (robots_[_unitId].specific_);
    }

    function getUnitStatus(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].status_;
    }

    function getUnitSPBase(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spBase_;
    }

    function getUnitRare(uint _unitId) public view returns (uint) {
        return robots_[_unitId].rare_;
    }

    function getUnitSPLev(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spLev_;
    }

    function getUnitSPBirth(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spBirth_;
    }

    function getUnitRRType(uint _unitId) public view returns (uint) {
        return robots_[_unitId].rrType_;
    }

    function getUnitRRBirth(uint _unitId) public view returns (uint) {
        return robots_[_unitId].rrBirth_;
    }

    function getUnitRRLevEft(uint _unitId) public view returns (uint) {
        return robots_[_unitId].rrLevEft_;
    }

    function getUnitUPBase(uint _unitId) public view returns (uint) {
        return robots_[_unitId].upProbBase_;
    }

    function getUnitUPBirth(uint _unitId) public view returns (uint) {
        return robots_[_unitId].upProbBirth_;
    }

    function getUnitUpPrice(uint _unitId) public view returns (uint) {
        return robots_[_unitId].upPrice_;
    }

    function getUnitSPCur(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spCur_;
    }

    function getUnitSPMax(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spMax_;
    }

    function getUnitMineStart(uint _unitId) public view returns (uint) {
        return robots_[_unitId].mineStart_;
    }

    function getUnitMineEnd(uint _unitId) public view returns (uint) {
        return robots_[_unitId].mineEnd_;
    }

    function getUnitSPExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraStakePoint(_unitId);
    }

    function getUnitRRExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraRewardRatio(_unitId);
    }

    function getUnitUPExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraUpgradeProbability(_unitId);
    }

    function getUnitSeller(uint _unitId) public view returns (address) {
        return robots_[_unitId].seller_;
    }

    function getUnitSellPrice(uint _unitId) public view returns (uint) {
        return robots_[_unitId].sellPrice_;
    }
}
