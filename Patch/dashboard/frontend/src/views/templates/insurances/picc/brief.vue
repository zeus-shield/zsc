<template>
  <div class="insurance-picc-brief">
    <el-row class="insurance" :gutter="0" type="flex" justify="start">
      <el-col class="thumb" :span="4">
        <div class="col">
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
  background: url('../../../../assets/images/remai.png') no-repeat center center;
}
.insurance .col {
  // border-radius: 4px;
  // background: #d3dce6;
  // min-height: 36px;
}

.insurance .thumb .col {
  margin: 20px auto;

  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.insurance .thumb .col .img {
  width: 100%;
  height: 100%;
  // height: auto;
}
.insurance .thumb .col .brief {
  font-size: 12px;
  padding: 10px;
  color: #999;
  background: #f5f2f2;
}
// .insurance .thumb .col .brief strong {
//   color: #666;
//   font-weight: normal;
// }
.insurance .info .col {
  margin: 40px 20px 0px 20px;
}
.insurance .info .col .title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
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
.insurance .info .col .insured-table {
  font-size: 12px;
  margin: 0px 20px 10px 20px;

  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.insurance .info .col .insured-table .item {
  padding-left: 15px;
  // display: inline;
  // width: 70%;
  background: url('../../../../assets/images/insurances/picc/li_dot_red.gif') 0 6px no-repeat;
}
.insurance .info .col .insured-table .amount {
  // float: right;
  // width: 25%;
  text-align: right;
  color: #ff4e33;
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
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'InsurancePICCBrief',
};
</script>
