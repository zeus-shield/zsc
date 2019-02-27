const app = getApp()

Page({
  data: {

    createTemp: {},
    companyArray: {},
    policyInfo: {},

    //保单模板
    policyTemp: "",
    policyTempArray: [],
    policyTempData: {},

    multiArray: [],
    multiIndex: [0, 0],

    bol: false,

    accounts: [],
    accountIndex: 0,
    accounts1: [],
    accountIndex1: 0,
    radioText: "",
    para:"",
    title:"",

    radio: [
      { value: "0", name: "年交", checked: 'true' },
      { value: "1", name: "月交" }
    ],
    flag: false,
    date: "1980-01-01",
    date1: "1980-01-01"


  },
	
})