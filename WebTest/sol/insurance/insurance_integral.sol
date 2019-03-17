/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;

import "../common/delegate.sol";
import "../common/integral.sol";

contract InsuranceIntegral is Delegate, Integral {
    uint private cap_;
    mapping (uint8 => uint) private threshold_;

    /** @dev Trace info */
    struct Trace {
        uint8 type_;
        uint id_;
        uint time_;
        uint value_;
    }

    /** @dev Trace for one day */
    struct TraceDay {
        uint8 type_;
        uint size_;
        mapping (uint => Trace) list_;
    }

    /** @dev address => bonus type => day index => TraceDay */
    mapping (address => mapping (uint8 => mapping (uint => TraceDay))) private trace_;

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    modifier _onlyReaderOrHigher() {
        require(checkDelegate(msg.sender, 3));
        _;
    }

    /**
     * @dev Construct the contract.
     */
    constructor () public {
        cap_ = 100000;
        threshold_[0] = 40;
        threshold_[1] = 30;
        threshold_[2] = 20;
        threshold_[3] = 20;
        threshold_[4] = 20;
        threshold_[5] = 20;
        threshold_[6] = 20;
        threshold_[7] = 20;
    }

    /**
     * @dev Destroy the contract.
     */
    function destroy() public _onlyOwner {
        super.kill();
    }

    /**
     * @dev Claim integrals.
     * @param _account address The address that will claim the integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     */
    function claim(address _account, uint8 _type) public _onlyAdminOrHigher {
        require(0 <= _type && 8 > _type);
        mint(_account, threshold_[_type]);
    }    

    /**
     * @dev Mint integrals.
     * @param _account address The address that will receive the minted integrals.
     * @param _value uint The amount of integrals to mint.
     */
    function mint(address _account, uint _value) public _onlyAdminOrHigher {
        require(totalSupply().add(_value) <= cap_);
        _mint(_account, _value);
    }

    /**
     * @dev Burns a specific amount of integrals.
     * @param _account address The account whose integrals will be burnt.
     * @param _value uint The amount of integral to be burned.
     */
    function burn(address _account, uint _value) public _onlyAdminOrHigher {
        _burn(_account, _value);
    }

    /**
     * @dev Transfer integral to a specified address
     * @param _owner address The address which owns the integrals.
     * @param _to address The address to transfer to.
     * @param _value uint The amount to be transferred.
     */
    function transfer(address _owner, address _to, uint _value) public _onlyAdminOrHigher returns (bool) {
        return super.transfer(_owner, _to, _value);
    }

    /**
     * @dev Update the threshold of different types of bonus integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _threshold uint The threshold of different types of bonus integrals.
     */
    function updateThreshold(uint8 _type, uint _threshold) public _onlyAdminOrHigher {
        // check params
        require(0 <= _type && 8 > _type);
        threshold_[_type] = _threshold;
    }

    /**
     * @dev Update cap of integrals.
     * @param _newCap uint The new cap of integrals.
     */
    function updateCap(uint _newCap) public _onlyAdminOrHigher {
        require(_newCap > totalSupply());
        cap_ = _newCap;
    }

    /**
     * @dev Get the threshold of different types of bonus integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @return The threshold of different types of bonus integrals.
     */
    function threshold(uint8 _type) public view _onlyReaderOrHigher returns (uint) {
        return threshold_[_type];
    }

    /**
     * @dev Get the cap of integrals.
     * @return The cap of integrals.
     */
    function cap() public view _onlyReaderOrHigher returns (uint) {
        return cap_;
    }

    /**
     * @dev Total number of integrals in existence
     * @return The total of integrals.
     */
    function totalSupply() public view _onlyReaderOrHigher returns (uint) {
        return super.totalSupply();
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param _owner The address to query the balance of.
     * @return A uint representing the amount owned by the passed address.
     */
    function balanceOf(address _owner) public view _onlyReaderOrHigher returns (uint) {
        return super.balanceOf(_owner);
    }
}
