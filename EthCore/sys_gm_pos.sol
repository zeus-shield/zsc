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
    event ExternalSetPara(address indexed _sender, bytes32 _para);

    uint internal constant DAY_IN_SECONDS = 86400;
    uint internal constant MAX_RATIO_VALUE = 1000000;
    uint public dayInSeconds_;

    struct RobotUnit {
        /*
        bytes32 status_;
        bytes32 ctg_;
        bytes32 name_;
        bool spec_;
        uint rare_;

        uint spLev_;
        uint spCur_;
        uint spMax_;
        uint spBase_;
        uint spBirth_;

        uint mineStart_;
        uint mineEnd_;

        uint rrBirth_;  //xx&
        uint rrLevEft_; //xx%

        uint upProbBase_;
        uint upProbBirth_;
        uint upPrice_;

        uint price_;
        address seller_;

        bytes32 posToken_;
        */

        mapping(bytes32 => uint)    paraUint_;
        mapping(bytes32 => bytes32) paraBytes32_;
        mapping(bytes32 => bool)    paraBool_;
        mapping(bytes32 => address) paraAdr_;
    }
    uint private robotNos_;
    mapping(uint => RobotUnit) private robots_;

    struct CtgUnit {
        bytes32 ctg_;
        bytes32 name_;
        uint rare_;
        uint probWeight_;
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
        mapping(uint => bytes32) ctgTypes_;
    }
    mapping(uint => RareGroup) internal rares_;
    mapping(bytes32 => uint) internal rareProb_;

    address public extraEffectObj_;

    uint public priceToCreate_;
    bool public publicTradeable_ = true;
    string public tokenUri_;

    uint public minedRatioPerDay_;
    uint public rewardRatioPerDay_;

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
    function getRandomUnitCategory() internal view returns (bytes32) {
        uint ran = random(0, MAX_RATIO_VALUE);
        uint rareLev;
        if (ran <= rareProb_["R"]) {
            rareLev = 0;
        } else if (ran > rareProb_["R"] && ran <= rareProb_["SR"]) {
            rareLev = 1;
        } else {
            rareLev = 2;
        }

        ran = random(0, rares_[rareLev].size_);
        return rares_[rareLev].ctgTypes_[ran];
    }

    function mintUnit(address _user, bytes32 _ctg) internal returns (uint) {
        uint index = robotNos_;
        robotNos_++;
        _mint(_user, index);

        //bytes32 ctgName = getRandomUnitCategory();
        uint ctgIndex = ctgIndice_[_ctg];

        robots_[index].paraBool_["spec"] = false;
        robots_[index].paraBytes32_["status"] = "idle";
        robots_[index].paraBytes32_["ctg"]    = _ctg;
        robots_[index].paraBytes32_["name"]   = ctgs_[ctgIndex].name_;
        robots_[index].paraUint_["rare"]      = ctgs_[ctgIndex].rare_;
        robots_[index].paraUint_["spLev"]     = 0;
        robots_[index].paraUint_["spCur"]     = 0;
        robots_[index].paraUint_["spMax"]     = 0;
        robots_[index].paraUint_["spBase"]    = 0;
        robots_[index].paraUint_["mineStart"] = 0;
        robots_[index].paraUint_["mineEnd"]   = 0;
        robots_[index].paraUint_["upProbBase"]   = 0;

        if (ctgs_[ctgIndex].spBirthMin_ == ctgs_[ctgIndex].spBirthMax_) {
            robots_[index].paraUint_["spBirth"] = ctgs_[ctgIndex].spBirthMin_;
        } else {
            robots_[index].paraUint_["spBirth"]  = random(ctgs_[ctgIndex].spBirthMin_, ctgs_[ctgIndex].spBirthMax_);
        }

        if (ctgs_[ctgIndex].rrBirthMin_ == ctgs_[ctgIndex].rrBirthMax_) {
            robots_[index].paraUint_["rrBirth"] = ctgs_[ctgIndex].rrBirthMin_;
        } else {
            robots_[index].paraUint_["rrBirth"] = random(ctgs_[ctgIndex].rrBirthMin_, ctgs_[ctgIndex].rrBirthMax_);
        }

        if (ctgs_[ctgIndex].upProbBirthMin_ == ctgs_[ctgIndex].upProbBirthMax_) {
            robots_[index].paraUint_["upProbBirth"] = ctgs_[ctgIndex].upProbBirthMin_;
        } else {
            robots_[index].paraUint_["upProbBirth"]  = random(ctgs_[ctgIndex].upProbBirthMin_, ctgs_[ctgIndex].upProbBirthMax_);
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

        minedRatioPerDay_ = _mineRaioPerDay;
        rewardRatioPerDay_ = _rewardRatioPerDay;
    }

    function setRareThreshold(uint _R, uint _SR, uint _SSR) public {
        checkDelegate(msg.sender, admPri_);
        rareProb_["R"]   = _R;
        rareProb_["SR"]  = rareProb_["R"].add(_SR);
        rareProb_["SSR"] = rareProb_["SR"].add(_SSR);
    }
   
    function setUnitCategory(string _ctgStr, string _nameStr, uint _rareValue, uint _probWeight, uint _spBirthMin, uint _spBirthMax, uint _rrBirthMin, uint _rrBirthMax, uint _upProbBirthMin, uint _upProbBirthMax) public {
        checkDelegate(msg.sender, subPri_);
        require(_probWeight >= 2);

        uint index;
        bytes32 ctgType  = PlatString.tobytes32(_ctgStr);

        if (ctgExits_[ctgType]) {
            index = ctgIndice_[ctgType];
            require(ctgs_[index].rare_ == _rareValue);
            require(ctgs_[index].probWeight_ == _probWeight);
        } else {
            index = ctgNos_;
            ctgNos_++;

            ctgExits_[ctgType] = true;
            ctgIndice_[ctgType] = index;

            ctgs_[index].ctg_ = ctgType;
            ctgs_[index].rare_ = _rareValue;
            ctgs_[index].probWeight_  = _probWeight;
        }

        uint start = rares_[_rareValue].size_;
        rares_[_rareValue].size_ = rares_[_rareValue].size_.add(_probWeight);

        for (uint i = start; i < rares_[_rareValue].size_; ++i) {
            rares_[_rareValue].ctgTypes_[i] = ctgType;
        }

        ctgs_[index].name_       = PlatString.tobytes32(_nameStr);
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

        str = PlatString.append(str, "ctg=",            PlatString.bytes32ToString(ctgs_[_index].ctg_), "&");
        str = PlatString.append(str, "name=",           PlatString.bytes32ToString(ctgs_[_index].name_), "&");
        str = PlatString.append(str, "rare=",           PlatString.uintToString(ctgs_[_index].rare_), "&");
        str = PlatString.append(str, "probWeight=",     PlatString.uintToString(ctgs_[_index].probWeight_), "&");
        str = PlatString.append(str, "spBirthMin=",     PlatString.uintToString(ctgs_[_index].spBirthMin_), "&");
        str = PlatString.append(str, "spBirthMax=",     PlatString.uintToString(ctgs_[_index].spBirthMax_), "&");
        str = PlatString.append(str, "rrBirthMin=",     PlatString.uintToString(ctgs_[_index].rrBirthMin_), "&");
        str = PlatString.append(str, "rrBirthMax=",     PlatString.uintToString(ctgs_[_index].rrBirthMax_), "&");
        str = PlatString.append(str, "upProbBirthMin=", PlatString.uintToString(ctgs_[_index].upProbBirthMin_), "&");
        str = PlatString.append(str, "upProbBirthMax=", PlatString.uintToString(ctgs_[_index].upProbBirthMax_), "&");
        
        return str;
    }

    ///////////////
    function resetUnitMineInfo(uint _robotId) internal {
        robots_[_robotId].paraUint_["spCur"]     = 0;
        robots_[_robotId].paraUint_["spMax"]     = 0; 
        robots_[_robotId].paraUint_["mineStart"] = 0;
        robots_[_robotId].paraUint_["mineEnd"]   = 0;
        robots_[_robotId].paraUint_["rrLevEft"]  = 0;
    }

    function setUintParaBool(uint _unitId, bytes32 _para, bool _value) internal {
        robots_[_unitId].paraBool_[_para] = _value;
    }

    function setUintParaBytes32(uint _unitId, bytes32 _para, bytes32 _value) internal {
        robots_[_unitId].paraBytes32_[_para] = _value;
    }

    function setUintParaAdr(uint _unitId, bytes32 _para, address _value) internal {
        robots_[_unitId].paraAdr_[_para] = _value;
    }

    function setUintParaUint(uint _unitId, bytes32 _para, uint _value) internal {
        robots_[_unitId].paraUint_[_para] = _value;
    }

    ////////////////
    function exsetUintParaBool(uint _unitId, bytes32 _para, bool _value) external {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].paraBool_[_para] = _value;
        emit ExternalSetPara(msg.sender, _para);
    }

    function exsetUintParaBytes32(uint _unitId, bytes32 _para, bytes32 _value) external {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].paraBytes32_[_para] = _value;
        emit ExternalSetPara(msg.sender, _para);
    }

    function exsetUintParaAdr(uint _unitId, bytes32 _para, address _value) external {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].paraAdr_[_para] = _value;
        emit ExternalSetPara(msg.sender, _para);
    }

    function exsetUintParaUint(uint _unitId, bytes32 _para, uint _value) external {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].paraUint_[_para] = _value;
        emit ExternalSetPara(msg.sender, _para);
    }

    //////////////
    function getDayInSeconds() public view returns (uint) {
        return dayInSeconds_;
    }

    function getPriceToCreate() public view returns (uint) {
        return priceToCreate_;
    }

    function getPosMineRatioPerday() public view returns (uint) {
        return minedRatioPerDay_;
    }

    function getPosRewardRatioPerday() public view returns (uint) {
        return rewardRatioPerDay_;
    }

    function getUintParaBool(uint _unitId, bytes32 _para) public returns (bool) {
        return robots_[_unitId].paraBool_[_para];
    }

    function getUintParaBytes32(uint _unitId, bytes32 _para) public returns (bytes32) {
        return robots_[_unitId].paraBytes32_[_para];
    }

    function getUintParaAdr(uint _unitId, bytes32 _para) public returns (address) {
        return robots_[_unitId].paraAdr_[_para];
    }

    function getUnitParaUint(uint _unitId, bytes32 _para) public returns (uint) {
        return robots_[_unitId].paraUint_[_para];
    }

    function getUnitSPExtra(uint _unitId) public view returns (uint) {
        if (extraEffectObj_ == address(0))
            return 0;
        return SysGmPosEffect(extraEffectObj_).getExtraStakePoint(_unitId);
    }

    function getUnitRRExtra(uint _unitId) public view returns (uint) {
        if (extraEffectObj_ == address(0))
            return 0;
        return SysGmPosEffect(extraEffectObj_).getExtraRewardRatio(_unitId);
    }

    function getUnitUPExtra(uint _unitId) public view returns (uint) {
        if (extraEffectObj_ == address(0)) 
            return 0;
        return SysGmPosEffect(extraEffectObj_).getExtraUpgradeProbability(_unitId);
    }

    /*
    ///////////////////////////
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
        //checkDelegate(msg.sender, 1);

        addLog(PlatString.addressToString(msg.sender), true);
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

    function setUnitPosToken(uint _unitId, bytes32 _token) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].posToken_ = _token;
    }

    function setUnitSeller(uint _unitId, address _seller) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].seller_ = _seller;
    }

    function setUnitSellPrice(uint _unitId, uint _price) public {
        checkDelegate(msg.sender, 1);
        robots_[_unitId].sellPrice_ = _price;
    }


    //////////////////////
    function getPosRatio() public view returns (uint, uint) {
        return (minedRatioPerDay_, rewardRatioPerDay_);
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

    function getUnitPosToken(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].posToken_;
    }

    function getUnitSPExtra(uint _unitId) public view returns (uint) {
        if (extraEffectObj_ == address(0))
            return 0;
        return SysGmPosEffect(extraEffectObj_).getExtraStakePoint(_unitId);
    }

    function getUnitRRExtra(uint _unitId) public view returns (uint) {
        if (extraEffectObj_ == address(0))
            return 0;
        return SysGmPosEffect(extraEffectObj_).getExtraRewardRatio(_unitId);
    }

    function getUnitUPExtra(uint _unitId) public view returns (uint) {
        if (extraEffectObj_ == address(0)) 
            return 0;
        return SysGmPosEffect(extraEffectObj_).getExtraUpgradeProbability(_unitId);
    }

    function getUnitSeller(uint _unitId) public view returns (address) {
        return robots_[_unitId].seller_;
    }

    function getUnitSellPrice(uint _unitId) public view returns (uint) {
        return robots_[_unitId].sellPrice_;
    }
    */
}
