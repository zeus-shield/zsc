/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AISearch is Object {

    struct ElementInfo {
        // element base info
        // element address
        address addr_;
        // element type
        bytes32 type_;
        // element name
        bytes32 name_;

        // parameter info for the element
        // parameter count
        uint parameterCount;
        // parameter index => parameter name
        mapping(uint => bytes32) parameterNames_;
        // parameter name => parameter index
        mapping(bytes32 => uint) parameterIndexs_;
        // parameter name => exist flag
        mapping(bytes32 => bool) parameterExists_;
        // parameter name => parameter value
        mapping(bytes32 => bytes32) parameters_;
    }

    struct FactoryInfo {
        // factory base info
        /* factory type:
           provider
           receiver
           staker
           template
           agreement
           wallet-eth
           wallet-erc20
         */
        bytes32 type_;

        // element info for the factory
        // element count
        uint elementCount_;
        // elemet index => elemet name
        mapping(uint => bytes32) elementNames_;
        // elemet name => elemet index
        mapping(bytes32 => uint) elementIndexs_;
        // elemet name => exist flag
        mapping(bytes32 => bool) elementExists_;
        // elemet name => ElemetInfo
        mapping(bytes32 => ElementInfo) elements_;
    }   

    // factory count
    uint factoryCount_;
    // factory index => factory name
    mapping(uint => bytes32) factoryNames_;
    // factory name => factory index
    mapping(bytes32 => uint) factoryIndexs_;
    // factory type => exist flag
    mapping(bytes32 => bool) factoryExists_;
    // factory type => FactoryInfo
    mapping(bytes32 => FactoryInfo) private factorys_;

    modifier checkMsgSender() {
        checkDelegate(msg.sender, 1);
        _;
    }

    function AISearch(bytes32 _name) public Object(_name) {}

    function kill() public {
        // check sender
        checkDelegate(msg.sender, 1);

        // delete all data
        removeAll();

        super.kill();
    }

    function debugParameter(bytes32 _factoryType, bytes32 _elementName, bytes32 _parameterName) public returns (bool) {
        uint count = 0;
        uint index = 0;
        bytes32 name = 0;
        bool exist = false;
        bytes32 value = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(bytes32(0) != _parameterName);

        if (!checkParameterExist(_factoryType, _elementName, _parameterName)) {
            return false;
        }

        count = factorys_[_factoryType].elements_[_elementName].parameterCount;
        if (0 == count) {
            return false;
        }

        // debug parameter
        index = factorys_[_factoryType].elements_[_elementName].parameterIndexs_[_parameterName];
        name = factorys_[_factoryType].elements_[_elementName].parameterNames_[index];
        exist = factorys_[_factoryType].elements_[_elementName].parameterExists_[_parameterName];
        value = factorys_[_factoryType].elements_[_elementName].parameters_[_parameterName];
        require(_parameterName == name);

        // layer, index, name, exist, subcount
        /*
        if (exist) {
            log4(0xF3, bytes32(index), _parameterName, 1, value);
        } else {
            log4(0xF3, bytes32(index), _parameterName, 0, value);
        }
        */
        if (exist) {
            log3(0xF3, bytes32(index), _parameterName, value);
        }

        return true;
    }

    function debugElement(bytes32 _factoryType, bytes32 _elementName) public returns (bool) {
        uint elementCount = 0;
        bytes32 elementName = 0;
        uint elementIndex = 0;
        bool elementExists = false;
        address elementAddress = 0;
        uint parameterCount = 0;
        bytes32 parameterName = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);

        if (!checkElementExist(_factoryType, _elementName)) {
            return false;
        }

        elementCount = factorys_[_factoryType].elementCount_;
        if (0 == elementCount) {
            return false;
        }

        // debug element
        elementIndex = factorys_[_factoryType].elementIndexs_[_elementName];
        elementName = factorys_[_factoryType].elementNames_[elementIndex];
        elementExists = factorys_[_factoryType].elementExists_[_elementName];
        elementAddress = factorys_[_factoryType].elements_[_elementName].addr_;
        require(_elementName == elementName);
        require(_factoryType == factorys_[_factoryType].elements_[_elementName].type_);

        parameterCount = factorys_[_factoryType].elements_[_elementName].parameterCount;

        // layer, index, name, exist, subcount
        /*
        if (elementExists) {
            log4(0xF2, bytes32(elementIndex), _elementName, bytes32(elementAddress), bytes32(parameterCount));
        } else {
            //log4(0xF2, bytes32(elementIndex), _elementName, 0, bytes32(elementAddress), bytes32(parameterCount));
        }
        */
        if (elementExists) {
            log4(0xF2, bytes32(elementIndex), _elementName, bytes32(elementAddress), bytes32(parameterCount));
        }

        // debug all parameters of element
        if (0 < parameterCount) {
            for (uint i=0; i<parameterCount; i++) {
                parameterName = factorys_[_factoryType].elements_[_elementName].parameterNames_[i];
                debugParameter(_factoryType, _elementName, parameterName);
            }
        }

        return true;
    }

    function debugFactory(bytes32 _factoryType) public returns (bool) {
        bytes32 factoryType = 0;
        uint factoryIndex = 0;
        bool factoryExists = false;
        uint elementCount = 0;
        bytes32 elementName = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        if (!checkFactoryExist(_factoryType)) {
            return false;
        }

        if (0 == factoryCount_) {
            return false;
        }

        // debug factory
        factoryIndex = factoryIndexs_[_factoryType];
        factoryType = factoryNames_[factoryIndex];
        factoryExists = factoryExists_[_factoryType];
        require(_factoryType == factoryType);
        require(_factoryType == factorys_[_factoryType].type_);

        elementCount = factorys_[_factoryType].elementCount_;

        // layer, index, name, exist, subcount
        /*
        if (factoryExists) {
            log4(0xF1, bytes32(factoryIndex), _factoryType, 1, bytes32(elementCount));
        } else {
            log4(0xF1, bytes32(factoryIndex), _factoryType, 0, bytes32(elementCount));
        }
        */
        if (factoryExists) {
            log3(0xF1, bytes32(factoryIndex), _factoryType, bytes32(elementCount));
        }

        // debug all elements of factory
        if (0 < elementCount) {
            for (uint i=0; i<elementCount; i++) {
                elementName = factorys_[_factoryType].elementNames_[i];
                debugElement(_factoryType, elementName);
            }
        }

        return true;
    }

    function debugAll() public returns (bool) {
        bytes32 factoryType = 0;
    
        // check sender
        checkDelegate(msg.sender, 1);

        // remove all factorys
        if (0 < factoryCount_) {
            for (uint i=0; i<factoryCount_; i++) {
                factoryType = factoryNames_[i];
                debugFactory(factoryType);
            }
        }

        return true;
    }

    function checkFactoryExist(bytes32 _factoryType) private view returns (bool) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        return factoryExists_[_factoryType];
    }

    function checkElementExist(bytes32 _factoryType, bytes32 _elementName) private view returns (bool) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);

        // check factory exist
        if (!checkFactoryExist(_factoryType)) {
            return false;
        }

        return factorys_[_factoryType].elementExists_[_elementName];
    }

    function checkParameterExist(bytes32 _factoryType, bytes32 _elementName, bytes32 _parameterName) private view returns (bool) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(bytes32(0) != _parameterName);

        // check factory exist
        if (!checkFactoryExist(_factoryType)) {
            return false;
        }

        // check element exist
        if (!checkElementExist(_factoryType, _elementName)) {
            return false;
        }

        return factorys_[_factoryType].elements_[_elementName].parameterExists_[_parameterName];
    }

    function addFactory(bytes32 _factoryType) public returns (bool) {

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        // If there is data, update. If there is no data, add.
        factorys_[_factoryType].type_ = _factoryType;
        if (!checkFactoryExist(_factoryType)) {
            factoryNames_[factoryCount_] = _factoryType;
            // index start from '1'
            factoryIndexs_[_factoryType] = factoryCount_ + 1;
            factoryExists_[_factoryType] = true;
            factoryCount_ ++;
        }

        return true;
    }

    function addElement(bytes32 _factoryType, bytes32 _elementName, address _elementAddress) public returns (bool) {
        uint count = 0;

        // If there is data, update. If there is no data, add.

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(address(0) != _elementAddress);

        // add factory base info
        require(addFactory(_factoryType));

        // If there is data, update. If there is no data, add.
        factorys_[_factoryType].elements_[_elementName].addr_ = _elementAddress;
        factorys_[_factoryType].elements_[_elementName].type_ = _factoryType;
        factorys_[_factoryType].elements_[_elementName].name_ = _elementName;
        if (!checkElementExist(_factoryType, _elementName)) {
            count = factorys_[_factoryType].elementCount_;
            factorys_[_factoryType].elementNames_[count] = _elementName;
            // index start from '1'
            factorys_[_factoryType].elementIndexs_[_elementName] = count + 1;
            factorys_[_factoryType].elementExists_[_elementName] = true;
            factorys_[_factoryType].elementCount_ ++;
        }

        return true;
    }

    function addParameter(bytes32 _factoryType, bytes32 _elementName, address _elementAddress, bytes32 _parameterName, bytes32 _parameterValue) public returns (bool) {
        uint count = 0;

        // If there is data, update. If there is no data, add.

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(address(0) != _elementAddress);
        require(bytes32(0) != _parameterName);
        require(bytes32(0) != _parameterValue);

        require(addElement(_factoryType, _elementName, _elementAddress));

        // If there is data, update. If there is no data, add.
        factorys_[_factoryType].elements_[_elementName].parameters_[_parameterName] = _parameterValue;
        if (!checkParameterExist(_factoryType, _elementName, _parameterName)) {
            count = factorys_[_factoryType].elements_[_elementName].parameterCount;
            factorys_[_factoryType].elements_[_elementName].parameterNames_[count] = _parameterName;
            // index start from '1'
            factorys_[_factoryType].elements_[_elementName].parameterIndexs_[_parameterName] = count + 1;
            factorys_[_factoryType].elements_[_elementName].parameterExists_[_parameterName] = true;
            factorys_[_factoryType].elements_[_elementName].parameterCount ++;
        }

        return true;
    }

    function removeParameter(bytes32 _factoryType, bytes32 _elementName, bytes32 _parameterName) public returns (bool) {
        uint index = 0;
        uint count = 0;
        bytes32 name = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(bytes32(0) != _parameterName);

        if (!checkParameterExist(_factoryType, _elementName, _parameterName)) {
            return false;
        }

        count = factorys_[_factoryType].elements_[_elementName].parameterCount;
        if (0 == count) {
            return false;
        }

        // remove parameter
        index = factorys_[_factoryType].elements_[_elementName].parameterIndexs_[_parameterName];
        name = factorys_[_factoryType].elements_[_elementName].parameterNames_[count-1];

        factorys_[_factoryType].elements_[_elementName].parameterNames_[index] = name;
        factorys_[_factoryType].elements_[_elementName].parameterNames_[count-1] = _parameterName;
        factorys_[_factoryType].elements_[_elementName].parameterIndexs_[name] = index;
        factorys_[_factoryType].elements_[_elementName].parameterIndexs_[_parameterName] = count-1;

        delete factorys_[_factoryType].elements_[_elementName].parameterNames_[count-1];
        delete factorys_[_factoryType].elements_[_elementName].parameterExists_[_parameterName];
        delete factorys_[_factoryType].elements_[_elementName].parameters_[_parameterName];

        factorys_[_factoryType].elements_[_elementName].parameterCount --;

        return true;
    }

    function removeElement(bytes32 _factoryType, bytes32 _elementName) public returns (bool) {
        uint elementCount = 0;
        bytes32 elementName = 0;
        uint elementIndex = 0;
        uint parameterCount = 0;
        bytes32 parameterName = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);

        if (!checkElementExist(_factoryType, _elementName)) {
            return false;
        }

        elementCount = factorys_[_factoryType].elementCount_;
        if (0 == elementCount) {
            return false;
        }

        // remove all parameters of element
        parameterCount = factorys_[_factoryType].elements_[_elementName].parameterCount;
        if (0 < parameterCount) {
            for (uint i=0; i<parameterCount; i++) {
                parameterName = factorys_[_factoryType].elements_[_elementName].parameterNames_[i];
                require(removeParameter(_factoryType, _elementName, parameterName));
            }
        }
        require(0 == factorys_[_factoryType].elements_[_elementName].parameterCount);

        // remove element
        elementIndex = factorys_[_factoryType].elementIndexs_[_elementName];
        elementName = factorys_[_factoryType].elementNames_[elementCount-1];

        factorys_[_factoryType].elementNames_[elementIndex] = elementName;
        factorys_[_factoryType].elementNames_[elementCount-1] = _elementName;
        factorys_[_factoryType].elementIndexs_[elementName] = elementIndex;
        factorys_[_factoryType].elementIndexs_[_elementName] = elementCount-1;

        delete factorys_[_factoryType].elementNames_[elementCount-1];
        delete factorys_[_factoryType].elementExists_[_elementName];
        delete factorys_[_factoryType].elements_[_elementName];

        factorys_[_factoryType].elementCount_ --;

        return true;
    }

    function removeFactory(bytes32 _factoryType) public returns (bool) {
        bytes32 factoryType = 0;
        uint factoryIndex = 0;
        uint elementCount = 0;
        bytes32 elementName = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        if (!checkFactoryExist(_factoryType)) {
            return false;
        }

        if (0 == factoryCount_) {
            return false;
        }

        // remove all elements of factory
        elementCount = factorys_[_factoryType].elementCount_;
        if (0 < elementCount) {
            for (uint i=0; i<elementCount; i++) {
                elementName = factorys_[_factoryType].elementNames_[i];
                require(removeElement(_factoryType, elementName));
            }
        }
        require(0 == factorys_[_factoryType].elementCount_);

        // remove factory
        factoryIndex = factoryIndexs_[_factoryType];
        factoryType = factoryNames_[factoryCount_-1];

        factoryNames_[factoryIndex] = factoryType;
        factoryNames_[factoryCount_-1] = _factoryType;
        factoryIndexs_[factoryType] = factoryIndex;
        factoryIndexs_[_factoryType] = factoryCount_-1;

        delete factoryNames_[factoryCount_-1];
        delete factoryExists_[_factoryType];
        delete factorys_[_factoryType];

        factoryCount_ --;

        return true;
    }

    function removeAll() public returns (bool) {
        bytes32 factoryType = 0;

        // check sender
        checkDelegate(msg.sender, 1);

        // remove all factorys
        if (0 < factoryCount_) {
            for (uint i=0; i<factoryCount_; i++) {
                factoryType = factoryNames_[i];
                require(removeFactory(factoryType));
            }
        }
        require(0 == factoryCount_);

        return true;
    }

    function numElements(bytes32 _factoryType) public view returns (uint) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        if (!checkFactoryExist(_factoryType)) {
            return 0;
        }

        return factorys_[_factoryType].elementCount_;
    }

    function getElementNameByIndex(bytes32 _factoryType, uint _index) public view returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        if (!checkFactoryExist(_factoryType)) {
            return 0;
        }

        // check param
        require(factorys_[_factoryType].elementCount_ > _index);

        return factorys_[_factoryType].elementNames_[_index];
    }

    function numParameters(bytes32 _factoryType, bytes32 _elementName) public view returns (uint) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);

        if (!checkElementExist(_factoryType, _elementName)) {
            return 0;
        }

        return factorys_[_factoryType].elements_[_elementName].parameterCount;
    }

    function getParameterNameByIndex(bytes32 _factoryType, bytes32 _elementName, uint _index) public view returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);

        if (!checkElementExist(_factoryType, _elementName)) {
            return 0;
        }

        require(factorys_[_factoryType].elements_[_elementName].parameterCount > _index);

        return factorys_[_factoryType].elements_[_elementName].parameterNames_[_index];
    }

    function getParameter(bytes32 _factoryType, bytes32 _elementName, bytes32 _parameterName) public view returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(bytes32(0) != _parameterName);

        if (!checkParameterExist(_factoryType, _elementName, _parameterName)) {
            return 0;
        }

        return factorys_[_factoryType].elements_[_elementName].parameters_[_parameterName];
    }
}