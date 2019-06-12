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
