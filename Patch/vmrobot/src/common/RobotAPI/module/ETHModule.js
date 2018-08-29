/*
Copyright (c) 2018 ZSC Dev Team
*/
import ZSCWallet from '../common/zsc_wallet';
import ZSCLogin from '../common/zsc_login';
import ZSCRobotOwned from '../pos/pos_robot_owned';
import ZSCRobotMarket from '../pos/pos_robot_market';
import Robot from '../../Robot';

const ETHModule = {
    LoadModule(acount, module) {
    },

    /**
     * 获取交易市场机器人
     * @param {*} acount 用户钱包地址
     * @param {*} RobotId 机器人ID
     */
    getMarketRobot(acount, RobotId) {
    },
    GetDealRobot(acount, RobotId, wallet) {
    },
}
export default ETHModule;