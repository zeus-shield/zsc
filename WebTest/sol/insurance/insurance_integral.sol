/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;

import "../common/integral.sol";
import "../common/pausable.sol";
import "../common/delegate.sol";

contract InsuranceIntegral is Integral, Pausable, Delegate {
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

    /**
     * @dev Construct the contract.
     */
    constructor () public {
        cap_ = 100000;
        threshold_[0] = 40;
        threshold_[1] = 20;
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
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _account address The address that will claim the integrals.
     */
    function claim(uint8 _type, address _account) public _onlyAdminOrHigher whenNotPaused {
        require(0 <= _type && 8 > _type);
        mint(_account, threshold_[_type]);
    }    

    /**
     * @dev Transfer integral to a specified address
     * @param _owner address The address which owns the integrals.
     * @param _to address The address to transfer to.
     * @param _value uint The amount to be transferred.
     */
    function transfer(address _owner, address _to, uint _value) public _onlyAdminOrHigher whenNotPaused returns (bool) {
        return super.transfer(_owner, _to, _value);
    }

    /**
     * @dev Transfer integrals from one address to another.
     * Note that while this function emits an Approval event, this is not required as per the specification,
     * and other compliant implementations may not emit the event.
     * @param _from address The address which you want to send integrals from
     * @param _to address The address which you want to transfer to
     * @param _spender address The address which will spend the integrals.
     * @param _value uint the amount of integrals to be transferred
     */
    function transferFrom(address _from, address _to, address _spender, uint _value) public _onlyAdminOrHigher whenNotPaused returns (bool) {
        return super.transferFrom(_from, _to, _spender, _value);
    }

    /**
     * @dev Approve the passed address to spend the specified amount of integrals on behalf of owner.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param _owner address The address which owns the integrals.
     * @param _spender address The address which will spend the integrals.
     * @param _value uint The amount of integrals to be spent.
     */
    function approve(address _owner, address _spender, uint _value) public _onlyAdminOrHigher whenNotPaused returns (bool) {
        return super.approve(_owner, _spender, _value);
    }

    /**
     * @dev Increase the amount of integrals that an owner allowed to a spender.
     * approve should be called when _allowed[owner][spender] == 0. To increment
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * Emits an Approval event.
     * @param _owner address The address which owns the integrals.
     * @param _spender address The address which will spend the integrals.
     * @param _addedValue uint The amount of integrals to increase the allowance by.
     */
    function increaseAllowance(address _owner, address _spender, uint _addedValue) public _onlyAdminOrHigher whenNotPaused returns (bool success) {
        return super.increaseAllowance(_owner, _spender, _addedValue);
    }

    /**
     * @dev Decrease the amount of integrals that an owner allowed to a spender.
     * approve should be called when _allowed[owner][spender] == 0. To decrement
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * Emits an Approval event.
     * @param _owner address The address which owns the integrals.
     * @param _spender address The address which will spend the integrals.
     * @param _subtractedValue uint The amount of integrals to decrease the allowance by.
     */
    function decreaseAllowance(address _owner, address _spender, uint _subtractedValue) public _onlyAdminOrHigher whenNotPaused returns (bool success) {
        return super.decreaseAllowance(_owner, _spender, _subtractedValue);
    }

    /**
     * @dev Mint integrals.
     * @param _account address The address that will receive the minted integrals.
     * @param _value uint The amount of integrals to mint.
     */
    function mint(address _account, uint _value) public _onlyAdminOrHigher whenNotPaused {
        require(totalSupply().add(_value) <= cap_);
        _mint(_account, _value);
    }

    /**
     * @dev Burns a specific amount of integrals.
     * @param _account address The account whose integrals will be burnt.
     * @param _value uint The amount of integral to be burned.
     */
    function burn(address _account, uint _value) public _onlyAdminOrHigher whenNotPaused {
        _burn(_account, _value);
    }

    /**
     * @dev Burns a specific amount of integrals from the target address and decrements allowance
     * @param _from address The account whose integrals will be burned.
     * @param _spender address The address that will spend the integrals.
     * @param _value uint The amount of integral to be burned.
     */
    function burnFrom(address _from, address _spender, uint _value) public _onlyAdminOrHigher whenNotPaused {
        _burnFrom(_from, _spender, _value);
    }

    /**
     * @dev Update trace.
     * @param _account address The address that will claim the integrals.
     * @param _type uint8 The types of claiming integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _traceTime uint The time for tracing.
     */
    function updateTrace(address _account, uint8 _type, uint _traceTime) public _onlyAdminOrHigher whenNotPaused {
        require(address(0) != _account);
        require(0 <= _type && 8 > _type);

        uint day = (_traceTime + 8 hours)/(1 days);
        uint id = trace_[_account][_type][day].size_;

        trace_[_account][_type][day].type_ = _type;
        trace_[_account][_type][day].list_[id].type_ = _type;
        trace_[_account][_type][day].list_[id].id_ = id;
        trace_[_account][_type][day].list_[id].time_ = _traceTime;
        trace_[_account][_type][day].list_[id].value_ = threshold_[_type];
        trace_[_account][_type][day].size_ ++;
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
    function updateThreshold(uint8 _type, uint _threshold) public _onlyOwner whenNotPaused {
        // check params
        require(0 <= _type && 8 > _type);
        threshold_[_type] = _threshold;
    }

    /**
     * @dev Update cap of integrals.
     * @param _newCap uint The new cap of integrals.
     */
    function updateCap(uint _newCap) public _onlyOwner whenNotPaused {
        require((_newCap > totalSupply()) && (_newCap > cap_));
        cap_ = _newCap;
    }

    /**
     * @dev Get the claiming trace size.
     * @param _account address The address that will claim the integrals.
     * @param _type uint8 The types of claiming integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _time uint The time for searching.
     * @return The claiming trace size.
     */
    function traceSize(address _account, uint8 _type, uint _time) public view whenNotPaused returns (uint) {
        require(address(0) != _account);
        require(0 <= _type && 8 > _type);
        uint day = (_time + 8 hours)/(1 days);
        return trace_[_account][_type][day].size_;
    }

    /**
     * @dev Get the claiming trace info.
     * @param _account address The address that will claim the integrals.
     * @param _type uint8 The types of claiming integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _time uint The time for searching.
     * @param _id uint The id of recording.
     * @return The time and value for tracing.
     */
    function trace(address _account, uint8 _type, uint _time, uint _id) public view whenNotPaused returns (uint, uint) {
        require(address(0) != _account);
        require(0 <= _type && 8 > _type);
        uint day = (_time + 8 hours)/(1 days);
        require(trace_[_account][_type][day].size_ > _id);
        return (trace_[_account][_type][day].list_[_id].time_, trace_[_account][_type][day].list_[_id].value_);
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
    function threshold(uint8 _type) public view _onlyOwner whenNotPaused returns (uint) {
        return threshold_[_type];
    }

    /**
     * @dev Get the cap of integrals.
     * @return The cap of integrals.
     */
    function cap() public view _onlyOwner whenNotPaused returns (uint) {
        return cap_;
    }
}
