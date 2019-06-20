<template>
<div v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p3" element-loading-spinner="el-icon-loading">
  <el-dialog :title="language.integralTrace.title" :visible.sync="dialogFormVisible" center :width="dialogWidth">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div>
            <el-form-item :label="language.integralTrace.p1"  prop="startTime">
              <el-date-picker style="width:100%" type="date" :placeholder="language.integralTrace.p1" v-model="form.startTime" ></el-date-picker>
            </el-form-item>
            <el-form-item :label="language.integralTrace.p2" prop="endTime">
              <el-date-picker style="width:100%" type="date" :placeholder="language.integralTrace.p2" v-model="form.endTime" ></el-date-picker>
            </el-form-item>
          </div> 
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="onSubmit('form')">{{language.integralTrace.button.p1}}</el-button>
            <el-button id="cancel" @click="hidden()">{{language.integralTrace.button.p2}}</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {integralTransfer} from '../api/api'
import { log } from 'util';
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';

export default {
  data() {
    var checkTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(api.getCookie('language') == 'en' ? 'Select time please' : '请选择时间'));
      } else if (this.form.startTime) {
        if(this.form.startTime === ''){
          callback(new Error(api.getCookie('language') == 'en' ? 'Select start time please' : '请先选择开始时间'));
        } else if(this.form.startTime >= value){
          callback(new Error(api.getCookie('language') == 'en' ? 'The end time has to be earlier than the beginning time' : '结束时间不得早于开始时间'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      code:'',
      loading:false,
      dialogFormVisible:true,
      integral:0,
      dialogWidth:"",
      language:api.getCookie('language') == 'en' ? en_GB : zh_CN,

      form:{
        startTime:"",
        endTime:"",
      },

      rules: {
        startTime: [
          { type: 'date', required: true, message: api.getCookie('language') == 'en' ? 'Select time please' : '请选择时间', trigger: 'change' },
        ],
        endTime: [
          { type: 'date', required: true, message: api.getCookie('language') == 'en' ? 'Select time please' : '请选择时间', trigger: 'change' },
          { validator: checkTime, trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    onSubmit(formName) {
      let handler = this;
      handler.$refs[formName].validate((valid) => {
          if (valid) {
            handler.backToMine();
          } else {
              console.log('error submit!!');
              return false;
          }
      })
    },

    //获取积分记录
    backToMine: function(){
        let startTime = this.getTime(this.form.startTime);
        let endTime = this.getTime(this.form.endTime);
        window.sessionStorage.setItem("StartTime",startTime);
        window.sessionStorage.setItem("EndTime",endTime);
        this.$router.push({
          path: this.$router.path,
        })
    },
    getTime(str) {
        let date = new Date(str);
        let utc = parseInt(date.getTime()/1000);
