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
