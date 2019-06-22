<template>
<div v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p9" element-loading-spinner="el-icon-loading">
  <el-dialog :title="language.integralTransfer.title" :visible.sync="dialogFormVisible" center :width="dialogWidth">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <div>
        <el-form-item :label="language.integralTransfer.p1" prop="code">
          <el-input v-model="form.code" :placeholder="language.integralTransfer.p3"></el-input>
        </el-form-item>
        <el-form-item :label="language.integralTransfer.p2" prop="value">
          <el-input v-model.number="form.value"  :placeholder="language.integralTransfer.p4"></el-input>
        </el-form-item>
      </div> 
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="onSubmit('form')">{{language.integralTransfer.button.p1}}</el-button>
        <el-button id="cancel" @click="hidden()">{{language.integralTransfer.button.p2}}</el-button>
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
    var checkIntegral = (rule, value, callback) => {
        if (value > this.integral) {
          callback(new Error(api.getCookie('language') == 'en' ? 'More than the number of owned!' : '大于已拥有的积分数'));
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
        code:"",
        value:"",
      },


      rules: {
        value:[
          { required: true, message: api.getCookie('language') == 'en' ? 'No blank!' : '赠送金额不能为空', trigger: 'blur'},
          { type: 'number', message: api.getCookie('language') == 'en' ? 'Must be a numeric value!' : '赠送金额必须为数字值', trigger: 'blur' },
          { validator: checkIntegral, trigger: 'blur' }
        ],
        code: [
          { required: true, message: api.getCookie('language') == 'en' ? 'No blank!' : '账号不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    onSubmit(formName) {
      let handler = this;
      handler.$refs[formName].validate((valid) => {
          if (valid) {
            handler.loading = true;
            handler.integralTransfer();
          } else {
              console.log('error submit!!');
              return false;
          }
      })
    },

    //赠送积分
    integralTransfer: function() {
        let handler = this;
        let para = [];
        para.push(`Owner=${handler.code}`);
        para.push(`ToOwner=${handler.form.code}`);
        para.push(`Value=${handler.form.value}`);
        integralTransfer(para.join("&"))
        .then((res) => {
            if(res.code == "-9") {
                handler.$message({
                    message: handler.language.message.trackError,
                    type: 'warning'
                });
                this.loading = false;
            } else if(res.code == "0"){
                handler.$message({
                    message: handler.language.message.transferSuccess,
                    type: 'warning'
                });
                // handler.$router.push({
                //   path: "/mine",
                // })
                window.location.href="/mine";
            } else {
                handler.$message({
                    message: handler.language.message.postError,
                    type: 'warning'
                });
                this.loading = false;
            }
        })
        .catch((error) => {
            handler.$message({
                message: handler.language.message.postError,
                type: 'warning'
            });
            this.loading = false;
            console.log(error);
        })
    },

    hidden: function() {
      this.$router.push({
        path: this.$router.path,
      })
    }
  

  },
  watch: {
    
  },
  mounted() {
    this.code = api.getCookie("Code");
    this.integral = window.sessionStorage.getItem("Integral");

    api.hidden(this);
    let clientWidth = document.body.clientWidth;
    if(clientWidth >= 992) {
      this.dialogWidth = "50%";
    } else if (clientWidth <= 375){
      this.dialogWidth = "100%";
    } else {
      this.dialogWidth = (1.3 - clientWidth / 1234)*100 + "%" ;
    }
    
    let handler = this;
    api.addEventOnResize(function(){
      let clientWidth = document.body.clientWidth;
      if(clientWidth >= 992) {
        handler.dialogWidth = "50%";
      } else if (clientWidth <= 375){
        handler.dialogWidth = "100%";
      } else {
        handler.dialogWidth = (1.3 - clientWidth / 1234)*100 + "%" ;
      }
    })
  },
