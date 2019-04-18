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
