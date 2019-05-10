<template>
<div class="page-body">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p13" element-loading-spinner="el-icon-loading" >
    <el-row :gutter="40">
            <el-col :span="24" :md="12">
                <div class="echarts-card">
                    <div id="chartPie" class="echarts"></div>
                </div>
            </el-col>
            <el-col :span="24" :md="12">
                <div class="echarts-card">
                    <div id="chartLine" class="echarts"></div>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import {getStatisticData} from '../api/api'
import echarts from 'echarts'
import api from '../common/api'
