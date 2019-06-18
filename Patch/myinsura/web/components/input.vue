<template>
<div v-loading.fullscreen.lock="loading" :element-loading-text="isInput?language.loading.p1:language.loading.p2 " element-loading-spinner="el-icon-loading" >
  <el-dialog :title="title" :visible.sync="dialogFormVisible" center :width="dialogWidth">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <div v-for="(item,key) in policyTemArray" :key="key">
        <el-form-item v-if="item == '投保人'" :label="language.input.p1" prop="投保人">
            <el-input v-model="form.投保人"></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '被保人'" :label="language.input.p2" prop="被保人">
            <el-input v-model="form.被保人"></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '保障额度'" :label="language.input.p3" prop="保障额度">
            <el-input v-model.number="form.保障额度" ><template slot="append">RMB</template></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '保单编号'" :label="language.input.p4" prop="保单编号">
            <el-input v-model="form.保单编号" ></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '保障期限'" :label="language.input.p5" prop="保障期限">
            <el-input v-model.number="form.保障期限"><template slot="append">{{language.input.p17}}</template></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '车牌号'" :label="language.input.p6" prop="车牌号">
            <el-input v-model="form.车牌号" ></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '车龄'" :label="language.input.p7" prop="车龄">
            <el-input v-model.number="form.车龄" ><template slot="append">{{language.input.p17}}</template></el-input>
        </el-form-item>
        <el-form-item v-else-if="item == '开始时间'" :label="language.input.p8"  prop="开始时间">
          <el-date-picker style="width:100%" type="date" v-model="form.开始时间" ></el-date-picker>
        </el-form-item>
        <el-form-item v-else-if="item == '结束时间'" :label="language.input.p9" prop="结束时间">
          <el-date-picker style="width:100%" item="date" v-model="form.结束时间" ></el-date-picker>
        </el-form-item>
        <el-form-item v-else-if="item == '自动续保'" :label="language.input.p10" :content="form.自动续保" placement="top">
            <el-switch v-model="form.自动续保" active-value="自动续保" inactive-value="不自动续保"></el-switch>
        </el-form-item>
        <el-form-item v-else-if="item == '有无社保（被保人）'" :label="language.input.p11">
            <el-switch v-model="form.有无社保" active-value="有社保" inactive-value="无社保"></el-switch>
        </el-form-item>
        <el-form-item v-else-if="item == '有无交通事故'" :label="language.input.p12">
            <el-switch v-model="form.有无交通事故" active-value="有交通事故" inactive-value="无交通事故"></el-switch>
        </el-form-item>
        <el-form-item v-else-if="item == '缴费方式'" :label="language.input.p13">
            <el-radio-group v-model="form.缴费方式">
            <el-radio :label="language.input.p14"></el-radio>
            <el-radio :label="language.input.p15"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item v-else-if="item == '描述'" :label="language.input.p16">
            <el-input type="textarea" v-model="form.描述"></el-input>
        </el-form-item>
      </div> 
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('form')">{{language.input.button.p1}}</el-button>
        <el-button  id="cancel" @click="hidden()">{{language.input.button.p2}}</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {getPolicyTemp,submitPolicy} from '../api/api'
import { log } from 'util';
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';
import policyInfo from '../api/policyInfo.js'
import policyInfo_EN from '../api/policyInfo-en.js'

import Insurance from '../api/insurance.js';
import ContractInfo from '../api/ContractInfo';

const insuranceAbi = ContractInfo.insuranceAbi;
const insuranceAddress = ContractInfo.insuranceAddress;

export default {
  data() {

    var checkTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(api.getCookie('language') == 'en' ? 'Select time please' : '请选择时间'));
        } else if (this.form.开始时间) {
          if(this.form.开始时间 === ''){
            callback(new Error(api.getCookie('language') == 'en' ? 'Select start time please' : '请先选择开始时间'));
          } else if(this.form.开始时间 >= value){
            callback(new Error(api.getCookie('language') == 'en' ? 'The end time has to be earlier than the beginning time' : '结束时间不得早于开始时间'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

    return {
      policyName:"",
      dialogFormVisible:true,
      title:"",
      form:{
        投保人:"",
        被保人:"",
        保单编号: "",
        保障期限:  "",
        保障额度: "",
        车牌号:"",
        车龄:"",

        开始时间: "",
        结束时间:"",

        自动续保:"不自动续费",
        有无社保:"无社保",
        有无交通事故:"无交通事故",
        
        缴费方式: "按年缴费",
        描述:  ""
      },

      rules: {
        投保人: [
          { required: true, message: api.getCookie('language') == 'en' ? 'Please enter the correct name' : '请输入正确的姓名', trigger: 'blur' },
        ],
        被保人: [
          { required: true, message: api.getCookie('language') == 'en' ? 'Please enter the correct name' : '请输入正确的姓名', trigger: 'blur' },
        ],
        保单编号: [
          { required: true, message: api.getCookie('language') == 'en' ? 'The number cannot blank' : '保单编号不能为空', trigger: 'blur' },
        ],
        保障期限:[
          { required: true, message: api.getCookie('language') == 'en' ? 'Insurance Period cannot blank' : '保障期限不能为空', trigger: 'blur' },
          { type: 'number', message: api.getCookie('language') == 'en' ? 'Insurance Period must be a numeric value' : '保障期限必须为数字值', trigger: 'blur' }
        ],
        保障额度:[
          { required: true, message: api.getCookie('language') == 'en' ? 'Insurance Amount cannot blank' : '保障额度不能为空', trigger: 'blur' },
          { type: 'number', message: api.getCookie('language') == 'en' ? 'Insurance Amount must be a numeric value' : '保障额度必须为数字值', trigger: 'blur' }
        ],
        车牌号:[
          { required: true, message: api.getCookie('language') == 'en' ? 'Car License Number cannot blank' : '车牌号不能为空', trigger: 'blur'},
        ],
        车龄:[
          { required: true, message: api.getCookie('language') == 'en' ? 'Vehicle Age cannot blank' : '车龄不能为空', trigger: 'blur' },
          { type: 'number', message: api.getCookie('language') == 'en' ? 'Vehicle Age must be a numeric value' : '车龄必须为数字值', trigger: 'blur' }
        ],
        开始时间: [
          { type: 'date', required: true, message: api.getCookie('language') == 'en' ? 'Select time please' : '请选择时间', trigger: 'change' },
        ],
        结束时间: [
          { type: 'date', required: true, message: api.getCookie('language') == 'en' ? 'Select time please' : '请选择时间', trigger: 'change' },
          { validator: checkTime, trigger: 'blur' }
        ],
      },
            
      loading:false,
      policyTemArray:[],
      policyTemData:{},
      code:"",
      dialogWidth:"",
      isInput:false,
      language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
    };
  },
  methods: {
    //获取数据
    getPolicyTemp: function () {
      let handler = this;
      let key = "DB_Policy_"+this.policyName;
      let insurance = new Insurance(insuranceAbi,insuranceAddress);
      insurance.templateGetByKey(key,function(error, result) {
        if(error) {
            handler.$message({
              message: handler.language.message.trackError,
              type: 'warning'
            });
            handler.loading = false;
        } else {
          if(result[0] == -3 || result[0] == -1 || result[0] == -2) {//判断状态值//inner error
              handler.$message({
                message: handler.language.message.noPolicy2,
                type: 'warning'
              });
              handler.loading = false;
          }  else if (result[0] == 0) {//success
            handler.createPolicyTemp(result[1]);
          }
        }
      })
    },
      
    //创建保单
    createPolicyTemp: function (policyTemp) {
      this.policyTemArray = policyTemp.split("#");
      for (let i = 0; i < this.policyTemArray.length; i++) {
          if (this.policyTemArray[i] == "Key" || this.policyTemArray[i] == "UserKey") {
              this.policyTemArray.splice(i, 1);
              i--;
          }
      }
      for(var key in this.form) {
        let isfind = false;

        for(var i in this.policyTemArray) {
          if(key == "有无社保") {
            let keyTemp = key+"（被保人）";
            if(this.policyTemArray[i] == keyTemp) {
              isfind = true;
            }
          } else {
            if(this.policyTemArray[i] == key) {
              isfind = true;
            }
          }
        }
        if(isfind == false) {
          delete this.form[key];
        }
      }
      this.loading = false;
    },

    //提交保单
    onSubmit(formName) {
      let handler = this;
      handler.$refs[formName].validate((valid) => {
        if (valid) {
          if(handler.code == null) {
            this.$message({
              message: handler.language.message.needlogin,
              type: 'warning'
            });
          } else {
            handler.isInput = true;
            handler.loading = true;
            let userKey = handler.code;
            let data = handler.form;
            if(data.缴费方式) {
              if(data.缴费方式 == "Premium paid each year") {
                data.缴费方式 = "按年缴费";
              } else if(data.缴费方式 == "Premium paid each month") {
                data.缴费方式 = "按月缴费";
              }
            }
            for(var key in data) {
              if(typeof data[key] == "number") {
                data[key] = data[key].toString()
              }
            }
            data = JSON.stringify(data);

            let para = [];
            para.push(`UserKey=${userKey}`);
            para.push(`PolicyName=${handler.policyName}`);
            para.push(`Data=${data}`);
            submitPolicy(para.join("&"))
            .then((res) => {
              if (res.code == "-6") {//交易失败 
                handler.isInput = false;
                handler.loading = false; 
                this.$message({
                  message: handler.language.message.submitfail,
                  type: 'warning'
                });
              } else if (res.code == "0") {//交易成功
                handler.isInput = false;
                handler.loading = false; 
                handler.hidden();
                this.$message({
                  message: handler.language.message.submitSuccess,
                });
              } else if (res.code == "-9") {//交易报错
                handler.isInput = false;
                handler.loading = false; 
                this.$message({
                  message: handler.language.message.trackError,
                  type: 'warning'
                });
              }
            })
            .catch((error) => {
              console.log(error);
              handler.isInput = false;
              handler.loading = false; 
              this.$message({