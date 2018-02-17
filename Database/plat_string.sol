/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.17;

library PlatString {
    function append(string _a, string _b, string _c, string _d, string _e) internal pure returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function append(string _a, string _b, string _c, string _d) internal pure returns (string) {
        return append(_a, _b, _c, _d, "");
    }

    function append(string _a, string _b, string _c) internal pure returns (string) {
        return append(_a, _b, _c, "", "");
    }

    function append(string _a, string _b) internal pure returns (string) {
        return append(_a, _b, "", "", "");
    }

    function substring(string _str, uint _startpos, uint _endpos) internal pure returns (string) {
        bytes memory str = bytes(_str);
        require(_startpos <= _endpos && _endpos < str.length);
        string memory sub = new string(_endpos - _startpos);
        bytes memory substr = bytes(sub);

        uint k = 0;
        for (uint i = _startpos; i < _endpos; ++i) { 
            substr[k] = str[i];
            ++k;
        }
        return string(substr);
    }

    function findbyte(string _str, bytes1 _c, uint _startpos) internal pure returns (bool, uint) {
        bytes memory str = bytes(_str);

        for (uint i = _startpos; i < str.length; ++i) { 
            if (str[i] == _c) {
                return (true, i);
            }
        }

        return (false, 0);
    }

    function length(string _str) internal pure returns (uint) {
        bytes memory str = bytes(_str);

        return str.length;
    }

    function tobytes32(string _str, uint _offset) internal pure returns (bytes32) {
        bytes32 out;
        bytes memory str = bytes(_str);
        uint len = str.length;

        if (len  > 32 ) len = 32;

        for (uint i = 0; i < len; ++i) {
            out |= bytes32(str[_offset + i] & 0xFF) >> (i * 8);
        }

        return out;
    }

    //function getIntFromBuff(string str, du32 offset);

    function getstringFromBuff(string src, uint len, uint offset) internal pure returns (string) {
        bytes memory s = bytes(src);
        bytes memory result = new bytes(len);
        uint start = offset;
        uint end = offset + len;
        for (uint i = start; i < end; i++) {
            result[i - start] = s[i];
        }
        return string(result);
    }

    //function getCharFromBuff(d8 *buff,  du32 offset);
    //function addIntToBuff(string buff, d32 value, du32 offset);
    //function addstringToBuff(string dst, string src, d32 len, du32 offset);
    //function addCharToBuff(string buff, d8 value, du32 offset);
}
