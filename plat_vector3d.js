pragma solidity ^0.4.17;
import "./plat_math.js";

library PlatVector3d {
    int constant NORMAL_VALUE = 1 ether;

    struct Val {
        int nx_;
        int ny_;
        int nz_;  
    }

    function init(int x, int y, int z) internal pure returns (Val)  {       
        Val memory t = Val(x, y , z);
        return t;
    }

    function add(Val v1, Val v2) internal pure returns (Val)  {
        int x = PlatMath.add(v1.nx_, v2.nx_);
        int y = PlatMath.add(v1.ny_, v2.ny_);
        int z = PlatMath.add(v1.nz_, v2.nz_);
        
        Val memory t = Val(x, y , z);
        return t;
    }

    function sub(Val v1, Val v2) internal pure returns (Val)  {
        int x = PlatMath.sub(v1.nx_, v2.nx_);
        int y = PlatMath.sub(v1.ny_, v2.ny_);
        int z = PlatMath.sub(v1.nz_, v2.nz_);
        
        Val memory t = Val(x, y , z);
        return t;
    }

    function mul(Val v1, Val v2) internal pure returns (Val)  {
        int x = PlatMath.mul(v1.nx_, v2.nx_);
        int y = PlatMath.mul(v1.ny_, v2.ny_);
        int z = PlatMath.mul(v1.nz_, v2.nz_);
        
        Val memory t = Val(x, y , z);
        return t;
    }

    function mul(Val v1, int scale) internal pure returns (Val)  {
        int x = PlatMath.mul(v1.nx_, scale);
        int y = PlatMath.mul(v1.ny_, scale);
        int z = PlatMath.mul(v1.nz_, scale);
        
        Val memory t = Val(x, y , z);
        return t;
    }

    function div(Val v1, Val v2) internal pure returns (Val)  {
        int x = PlatMath.div(v1.nx_, v2.nx_);
        int y = PlatMath.div(v1.ny_, v2.ny_);
        int z = PlatMath.div(v1.nz_, v2.nz_);
        
        Val memory t = Val(x, y , z);
        return t;
    }

    function div(Val v1, int scale) internal pure returns (Val)  {
        int x = PlatMath.div(v1.nx_, scale);
        int y = PlatMath.div(v1.ny_, scale);
        int z = PlatMath.div(v1.nz_, scale);
        
        Val memory t = Val(x, y , z);
        return t;
    }

    function normal(Val v) internal pure returns (Val) {
        Val memory t = div(v, getLength(v));
        return t;
    } 

    function getLength(Val v) internal pure returns (int) {
        int lenSQ = v.nx_ * v.nx_ + v.ny_ * v.ny_ + v.nz_ * v.nz_;
        int len = PlatMath.sqrt(lenSQ);
        return len;
    } 

    function setLength(Val v) internal pure returns (Val) {
        Val memory t = mul(v, getLength(v));
        return t;
    } 

    function getDistance(Val v1, Val v2) internal pure returns (int) {
        Val memory t = sub(v1, v2);
        return getLength(t);
    } 
}

