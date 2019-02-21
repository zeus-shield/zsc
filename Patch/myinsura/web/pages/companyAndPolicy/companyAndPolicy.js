const app = getApp();
const PolicyInfo = require("policyInfo.js");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    //navbar控制参数
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    //navbar数据
    tabs: [],
    //九宫格数据
    grids: [],
    //九宫格被选中选项
    policyKey: "DB_Policy_中国人保_寿险鑫利年金险",

})