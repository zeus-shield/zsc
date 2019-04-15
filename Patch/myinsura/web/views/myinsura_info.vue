<template>
    <div class="page-body">
        <div>
        <el-row :gutter="40">
                <el-col :span="24">
                    <div class="up-card">
                        <div class="up-card-title">
                            <span>{{policyinfo.title}}</span>
                        </div>
                        <div class="up-card-page" v-for="(item,key) in policyinfo.content" :key="key" >
                            <el-card class="box-card" shadow="hover">
                                <div class="up-card-page-title">
                                    <span>{{item.title}}</span>
                                </div>
                                <div class="up-card-page-item" v-for="(dataItem) in item.data" :key="dataItem">
                                    <span>{{dataItem}}</span>
                                </div>
                            </el-card>
                        </div>
                    </div>
                    <div class="bottom-card">
                        <button class="bottom-button" @click="check()">{{language.info.button}}</button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import policyInfo from '../api/policyInfo.js'
import policyInfo_EN from '../api/policyInfo-en.js'
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';

export default {
    data() {
        return {
            policyInfotemp:api.getCookie('language') == 'en' ? policyInfo_EN : policyInfo,
            policyName:"",
            policyinfo:{},
            islogin:"",
            language:"",
            language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
        };
    },
    methods: {
        check:function(){
            if(this.islogin == false || this.islogin == null) {
                this.$message({
                    message: this.language.message.needlogin,
                    type: 'warning'
                });
            } else {
                this.$router.push({path: this.$route.path,query: {input: 'true'}});
            }
        },

    

    },
    watch: {
        
    },
    mounted() {
        this.policyName = "DB_Policy_"+this.$route.params.id;
        this.policyinfo = this.policyInfotemp[this.policyName];
        this.islogin = window.sessionStorage.getItem("isLogin");
    },
    created() {
        
    },
};
</script>

<style lang="scss" scoped>
    .page-body{
        width:80%;
        margin:56px auto auto auto;
    }
    .bottom-card{
        margin:56px auto auto auto;
        height: 300px;
        text-align: center;
        //border-right: 1px solid rgba(187, 187, 187, 1);
    }
    .bottom-button {
        margin-bottom:20px;
        width: 180px;
        height: 50px;
        border-radius: 5px;
        background-color: rgb(102, 177, 255);
        color: white;
        font-size: 20px;
        text-align: center;
        font-family: Arial;
        border: 1px solid rgba(187, 187, 187, 1);
    }
    .up-card{
        
        text-align: center;
        color:black
    }        
    .up-card-title{
        width:100%;
        text-align:center;
        line-height:60px;
        font-size:30px
    }
    .up-card-page-line{
        width:10%;
        height:32px;
        background:url(../assets/images/test.png)
    }
