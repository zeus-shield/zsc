/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.17;

library PlatMath {

    function greater(uint a, uint b) internal pure returns (bool) {
        if (a > b) return true;
        return false;
    }

    function less(uint a, uint b) internal pure returns (bool) {
        if (a < b) return true;
        return false;
    }

    function equal(uint a, uint b) internal pure returns (bool) {
        if (a == b) return true;
        return false;
    }

    function mul(uint a, uint b) internal pure returns (uint) {
        uint c = a * b;
        assertErr(a == 0 || c / a == b);
        return c;
    }

    function div(uint a, uint b) internal pure returns (uint) {
        assertErr(b != 0);
        uint c = a / b;
        return c;
    }

    function sub(uint a, uint b) internal pure returns (uint) {
        assertErr(b <= a);
        return a - b;
    }

    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        assertErr(c>=a && c>=b);
        return c;
    }

    function sqrt(uint x) internal pure returns (uint) {
        uint z = (x + 1) / 2;
        uint y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }


    function mul(int a, int b) internal pure returns (int) {
        int c = a * b;
        assertErr(a == 0 || c / a == b);
        return c;
    }

    function div(int a, int b) internal pure returns (int) {
        assertErr(b != 0);
        int c = a / b;
        return c;
    }

    function sub(int a, int b) internal pure returns (int) {
        return a - b;
    }

    function add(int a, int b) internal pure returns (int) {
        return a + b;
    }

    function sqrt(int x) internal pure returns (int) {
        //assertErr(x > 0);
        int z = (x + 1) / 2;
        int y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    function assertErr(bool assertion) internal pure {
        if (!assertion) revert();
    }
}
