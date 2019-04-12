<template>
<div class="page-body">
    <el-row :gutter="40">
        <el-col :span="24">    
            <div style="font-size:40px;font:'PingFang SC';color:black;">
                {{language.FAQ.title}}
            </div>
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item name="1">
                    <template slot="title">
                    <span class="FAQ-title">{{language.FAQ.question1}}</span>&nbsp;&nbsp;<i class="header-icon el-icon-info"></i>
                    </template>
                    <div>{{language.FAQ.answer1.p1}}</div>
                    <div>{{language.FAQ.answer1.p2}}</div>
                    <br>
                    <div>{{language.FAQ.answer1.p3}}</div>
                    <div>{{language.FAQ.answer1.p4}}</div>
                    <br>
                    <div>{{language.FAQ.answer1.p5}}</div>
                    <div>{{language.FAQ.answer1.p6}}</div>
                    <br>
                    <div>{{language.FAQ.answer1.p7}}</div>
                    <div>{{language.FAQ.answer1.p8}}</div>
                    <br>
                    <div>{{language.FAQ.answer1.p9}}</div>
                    <div>{{language.FAQ.answer1.p10}}</div>
                    <br>
                    <div>{{language.FAQ.answer1.p11}}</div>
                    <div>{{language.FAQ.answer1.p12}}</div>
                </el-collapse-item>
                <el-collapse-item  name="2">
                    <template slot="title">
                     <span class="FAQ-title" style="line-height:13px">{{language.FAQ.question2}}</span>&nbsp;&nbsp;<i class="header-icon el-icon-info"></i>
                    </template>
                    <div>{{language.FAQ.answer2.p1}}</div>
                </el-collapse-item>
            </el-collapse>
        </el-col>
    </el-row>
    <br>
    <br>
</div>
</template>

<script>
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';
import api from '../common/api'

export default {
    data() {
        return {
            activeName: '',
            language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
        };
    },
    methods: {
       
    },
    watch: {
        
    },
    mounted() {
   
    },
    created() {
        
    },
};
