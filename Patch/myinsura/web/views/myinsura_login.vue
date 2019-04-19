<template>
<div class="page-body">
  <div v-loading.fullscreen.lock="loading" :element-loading-text="!this.isRegister?language.loading.p5:language.loading.p6" element-loading-spinner="el-icon-loading">
    <el-row :gutter="40">
      <el-col :span="22" :offset="1" :md=" {span: 8, offset: 8}" :sm=" {span: 14, offset: 5}">
        <div v-if="!isRegister">
          <el-card class="box-card" shadow="hover"> 
            <div class="card-title">
              <span>{{language.login.login}}</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <div>
                <el-form-item :label="language.login.p1" prop="code">
                  <el-input v-model="form.code" :placeholder="language.login.p4"></el-input>
                </el-form-item>
                <el-form-item :label="language.login.p2" prop="password">
                  <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
              </div> 
            </el-form>
            <div>
              <div class="card-s-button-block">
                <a class="card-s-button" @click="switchState()">{{language.login.register}}</a>
              </div>
              <div class="card-xs-button-block">
                <el-button type="primary" style="width:100%;" @click="onSubmit('form')">{{language.login.login}}</el-button>
              </div>
            </div>
            <div class="card-none-block"></div>
          </el-card>
        </div>

        <div v-if="isRegister">
          <el-card class="box-card" shadow="hover">
            <div class="card-title">
              <span>{{language.login.register}}</span>
            </div>
            <el-form ref="regform" :model="regform" :rules="regrules" label-width="80px">
              <div>
                <el-form-item :label="language.login.p1" prop="code">
                  <el-input v-model="regform.code" :placeholder="language.login.p4"></el-input>
                </el-form-item>
                <el-form-item :label="language.login.p2" prop="password">
                  <el-input v-model="regform.password"  show-password></el-input>
                </el-form-item>
                <el-form-item :label="language.login.p3" prop="repassword">
                  <el-input v-model="regform.repassword" show-password></el-input>
                </el-form-item>
              </div> 
            </el-form>
            <div >
              <div class="card-s-button-block">
                <a class="card-s-button" @click="switchState()">{{language.login.login}}</a>
              </div>
              <div class="card-xs-button-block">
                <el-button type="primary" style="width:100%;" @click="onSubmit('regform')">{{language.login.register}}</el-button>
              </div>
            </div>
            <div class="card-none-block"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <br>
    <br>
  </div>
</div>
</template>

<script>
import {userLogin,userRegister} from '../api/api'
import { log } from 'util';
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';

export default {
  data() {
    var checkRepassword = (rule, value, callback) => {
        if (value == this.regform.password) {
            callback();
        } else {
            callback(new Error(api.getCookie('language') == 'en' ? 'The passwords are not the same!' : '请确保两次输入的密码相同'));
        }
    };

    var checkCode = (rule, value, callback) => {
        if (/^1[34578]\d{9}$/.test(value)) {
            callback();
        } else if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)){
            callback();
        } else {
            callback(new Error(api.getCookie('language') == 'en' ? 'Phone number or email incorrect!' : '请输入正确的手机号或邮箱地址'));
        }
    };
  
    return {
      loading:false,
      dialogFormVisible:true,
      dialogWidth:"",
      language:api.getCookie('language') == 'en' ? en_GB : zh_CN,

      form:{
        code:"",
        password:"",
      },

      regform:{
        code:"",
        password:"",
        repassword:"",
      },

      rules: {
        password:[
          { required: true, message: api.getCookie('language') == 'en' ? 'The password cannot blank！' : '密码不能为空', trigger: 'blur'},
          { min: 6, message: api.getCookie('language') == 'en' ? 'More than 6 characters' : '长度不得少于6个字符', trigger: 'blur'}
        ],
        code: [
          { required: true, message: api.getCookie('language') == 'en' ? 'The account cannot blank！' : '账号不能为空', trigger: 'blur'},
          { validator: checkCode, trigger: 'blur' }
        ],
      },

      regrules: {
        password:[
          { required: true, message: api.getCookie('language') == 'en' ? 'The password cannot blank！' : '密码不能为空', trigger: 'blur'},
          { min: 6, message: api.getCookie('language') == 'en' ? 'More than 6 characters' : '长度不得少于6个字符', trigger: 'blur'}
        ],
        repassword:[
          { required: true, message: api.getCookie('language') == 'en' ? 'The password cannot blank！' : '密码不能为空', trigger: 'blur'},
          { min: 6, message: api.getCookie('language') == 'en' ? 'More than 6 characters' : '长度不得少于6个字符', trigger: 'blur'},
          { validator: checkRepassword, trigger: 'blur' }
        ],
        code: [
          { required: true, message: api.getCookie('language') == 'en' ? 'The account cannot blank！' : '账号不能为空', trigger: 'blur'},
          { validator: checkCode, trigger: 'blur' }
        ],
      },

      isRegister:false
    };
  },
  methods: {
    switchState() {
      if(this.isRegister == false) {
        this.isRegister = true;
      } else {
        this.isRegister = false;
      }
    },
    
    onSubmit(formName) {
      let handler = this;
        handler.$refs[formName].validate((valid) => {
            if (valid) {
              if(formName == 'form') {
                handler.userLogin();
              } else {
                handler.userRegister();
              }
            } else {
                console.log('error submit!!');
                return false;
            }
        })
    },

    userLogin() {
      let handler = this;
      let para = [];
      handler.loading = true;
      para.push(`Code=${handler.form.code}`);
      para.push(`Password=${handler.form.password}`);
      userLogin(para.join("&"))
      .then((res) => {
          if (res.code == "-1" || res.code == "-2" || res.code == "-3") {
              handler.loading = false;
              handler.$message({
                  message: handler.language.message.dataError,
                  type: 'warning'
              });
          } else if (res.code == "-9" || res.code == "-6") {
              handler.loading = false;
              handler.$message({
                  message: handler.language.message.trackError,
                  type: 'warning'
              });
          } else if (res.code == "1") {//登录成功
              api.setCookie("Code",handler.form.code);
              api.setCookie("Password",handler.form.password);
              window.sessionStorage.setItem("isLogin",true);
              handler.loading = false;
              window.location.href="/mine";
              // handler.$router.push({
              //     path: "/mine",
              // })
          } else if (res.code == "2") {//登录失败
              handler.loading = false;
              handler.$message({
                  message: handler.language.message.loginFail,
                  type: 'warning'
              });
          } else if (res.code == "3") {//没有账号
              handler.loading = false;
              handler.$message({
                  message: handler.language.message.noAccount,
                  type: 'warning'
              });
          }
      })
      .catch((error) => {
          this.$message({
              message: handler.language.message.postError,
              type: 'warning'
          });
          this.loading = false;
          console.log(error);
      })
    },

    userRegister() {
      let handler = this;
      let para = [];
      handler.loading = true;
      para.push(`Code=${handler.regform.code}`);
      para.push(`Password=${handler.regform.password}`);
      userRegister(para.join("&"))
      .then((res) => {
          if (res.code == "-1" || res.code == "-2" || res.code == "-3") {
              this.loading = false;
              this.$message({
                  message: handler.language.message.dataError,
                  type: 'warning'
              });
          } else if (res.code == "-9" || res.code == "-6") {
              this.loading = false;
              this.$message({
                  message: handler.language.message.trackError,
                  type: 'warning'
              });
          } else if (res.code == "0") {//注册成功
              api.setCookie("Code",handler.regform.code);
              api.setCookie("Password",handler.regform.password);
              window.sessionStorage.setItem("isLogin",true);
              handler.loading = false;
              this.$message({
                  message: handler.language.message.registerSuccess,
              });
              window.location.href="/mine";
              // handler.$router.push({
              //     path: "/mine",
              // })
          }
      })
      .catch((error) => {
          this.$message({
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
    
  },
  created() {
    
  },
};
</script>

<style lang="scss" scoped>
 .page-body{
      width:100%;
      margin:56px auto auto auto;
  }
  .card-title{
    font-size:30px;
    line-height:30px;
    text-align:center;
    margin-bottom:15px
  }
  .card-s-button-block{
    width:30%;
    float:right;
    margin-left:2%
  }
  .card-s-button{
    width:30px;
    font-size:12px;
    line-height:40px;
    float:left
  }
  .card-xs-button-block{
    width:36%;
    height:100%;
    float:right;
  }
  .card-none-block{
    height:30px;
    width:100%
  }
