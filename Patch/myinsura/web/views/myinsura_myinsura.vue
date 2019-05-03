<template>
<div class="page-body">
    <el-tabs v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p2" element-loading-spinner="el-icon-loading" v-model="activeName" type="card" @tab-click="handleClick" >
        <el-tab-pane :key="tabitem.name" v-for="(tabitem,tabkey) in companyListShow" :label="generateCompany(tabitem.title)" :id="tabitem.name">
            <div>
                <el-row :gutter="50" >
                    <el-col :span="24" :sm="12" :md="8" v-for="(item) in policyListShow[tabkey]" :key="item" :id="item">
                        <div class="square-card" >
                            <router-link :to="`/info/${focusCompany}_${item}`">
                                <div class="square-card-image">
                                    <img :src="getImgUrl(item)">
                                </div>
                                <div class="square-card-page">
                                    <span>{{generatePolicy(tabitem.title,item)}}</span>
                                </div>
                            </router-link>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script>
import api from '../common/api'
import { getAllcompanyAndpolicy,companyGetByKey} from '../api/api';
import policyInfo from '../api/policyInfo.js'
import policyInfo_EN from '../api/policyInfo-en.js'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';
