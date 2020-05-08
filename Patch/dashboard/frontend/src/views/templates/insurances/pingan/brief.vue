<template>
  <div class="insurance-pingan-brief">
    <el-row class="insurance" :gutter="0" type="flex" justify="start">
      <el-col class="img" :span="4">
        <div class="col">
          <img v-if="item.brief.img_url && item.brief.img_url !== '' && item.brief.img_url !== 'null'" class="content" :src="require('@/assets/' + item.brief.img_url)">
        </div>
      </el-col>

      <el-col class="info" :span="15">
        <div class="col">
          <div class="title">
            <span>{{ item.brief.title }}</span>
          </div>
          <div v-if="item.brief.hot === true" class="corner hot"></div>
          <div class="content">
            <span>{{ item.brief.text }}</span>
          </div>
        </div>
      </el-col>

      <el-col class="operation" :span="5">
        <div class="col">
          <el-row class="desc" :gutter="0">
            <i class="el-icon-success icon"></i>
            <span><b>{{ langSet.market.pingan.category }}</b>{{ item.category }}</span>
          </el-row>
          <el-row class="desc" :gutter="0">
            <i class="el-icon-success icon"></i>
            <span><b>{{ langSet.market.pingan.period }}</b>{{ item.brief.period }}</span>
          </el-row>
          <el-row class="click" :gutter="0">
            <el-button class="button" type="primary" @click="dialogVisible = true">{{ langSet.market.pingan.input }}</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.insurance {
  margin: 20px auto;
  // background: #fff;
  box-shadow: 0 2px 20px 0 rgba(0,0,0,.05);
  border-radius: 8px;
  padding: 0px 0px 0px 20px;
  // box-sizing: border-box;
}
.insurance .hot {
  background: url(../../../../assets/images/remai.png) no-repeat center center;
}
.insurance .col {
  // border-radius: 4px;
  // background: #d3dce6;
  // min-height: 36px;
}

.insurance .img .col {
  margin: 20px auto;

  display: flex;
  justify-content: center;
  align-items: center;
}
.insurance .img .col .content {
  width: 100%;
  // height: 100%;
  height: auto;
}
.insurance .info .col {
  margin: 40px 20px 0px 20px;
}
.insurance .info .col .title {
  font-size: 16px;
  font-weight: 700;
}
.insurance .info .col .corner {
  position: absolute;
  width: 61px;
  height: 61px;
  left: 20px;
  top: 20px;
}
.insurance .info .col .content {
  margin-top: 20px;
  font-size: 14px;
}
.insurance .operation {
  background: #fff9f2;
}
.insurance .operation .col {
  margin: 40px auto;
}
.insurance .operation .col .desc {
  font-size: 14px;
  margin: 0px 0px 5px 20px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.insurance .operation .col .desc .icon {
  font-size: 20px;
  color: #67C23A;
  margin-right: 5px;
}
.insurance .operation .col .click {
  margin-top: 100px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.insurance .operation .col .click .button {
  font-size: 0.875rem;
  color: #fff;
  width: 60%;
  // border-color: #e76d0c #e15500 #e15500;
  // background-color: #ec7211;
  // background-image: linear-gradient(180deg,#f67c1b 0,#e15500);
}
.dialog .form .space {
  margin-top: 22px;
}
.dialog .form .divider-content {
  font-size: 12px;
}
.dialog .form .date {
  width: 100%;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';
// import APIs from '@/apis';

export default {
  name: 'InsurancePingAnBrief',
  // components: {
  // },
  data() {
    let validate = (cmd, rule, value, callback) => {
      if (value === '') {
        let none = 'POLICY_' + cmd + '_NONE';
        callback(new Error(this.langSet['message']['error'][none]));
      } else {
        if (cmd === 'STARTTIME') {
          callback();
        } else {
        }
      }
    };
    let validateCompany = (rule, value, callback) => {
      validate('COMPANY', rule, value, callback);
    };
    let validateCategory = (rule, value, callback) => {
      validate('CATEGORY', rule, value, callback);
    };
    let validateTitle = (rule, value, callback) => {
      validate('TITLE', rule, value, callback);
    };
    let validateHolder = (rule, value, callback) => {
      validate('HOLDER', rule, value, callback);
    };
    let validateInsurant = (rule, value, callback) => {
      validate('INSURANT', rule, value, callback);
    };
  },
};
</script>
