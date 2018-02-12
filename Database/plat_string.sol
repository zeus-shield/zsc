/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.17;

library Platbytes32 {
    function append(bytes32 _a, bytes32 _b, bytes32 _c, bytes32 _d, bytes32 _e) internal pure returns (bytes32){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        bytes32 memory abcde = new bytes32(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return bytes32(babcde);
    }

    function append(bytes32 _a, bytes32 _b, bytes32 _c, bytes32 _d) internal pure returns (bytes32) {
        return append(_a, _b, _c, _d, "");
    }

    function append(bytes32 _a, bytes32 _b, bytes32 _c) internal pure returns (bytes32) {
        return append(_a, _b, _c, "", "");
    }

    function append(bytes32 _a, bytes32 _b) internal pure returns (bytes32) {
        return append(_a, _b, "", "", "");
    }

    //function getIntFromBuff(bytes32 str, du32 offset);

    function getbytes32FromBuff(bytes32 src, uint len, uint offset) internal pure returns (bytes32) {
        bytes memory s = bytes(src);
        bytes memory result = new bytes(len);
        uint start = offset;
        uint end = offset + len;
        for (uint i = start; i < end; i++) {
            result[i - start] = s[i];
        }
        return bytes32(result);
    }

    //function getCharFromBuff(d8 *buff,  du32 offset);
    //function addIntToBuff(bytes32 buff, d32 value, du32 offset);
    //function addbytes32ToBuff(bytes32 dst, bytes32 src, d32 len, du32 offset);
    //function addCharToBuff(bytes32 buff, d8 value, du32 offset);
}
