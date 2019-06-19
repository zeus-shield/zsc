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
