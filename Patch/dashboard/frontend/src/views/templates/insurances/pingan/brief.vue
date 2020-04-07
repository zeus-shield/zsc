<template>
  <div class="insurance-pingan-brief">
    <el-row class="insurance" :gutter="0" type="flex" justify="start">
      <el-col class="img" :span="4">
        <div class="col">
          <img v-if="item.brief.img_url && item.brief.img_url !== '' && item.brief.img_url !== 'null'" class="content" :src="require('@/assets/' + item.brief.img_url)">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.insurance {
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
}
.insurance .operation .col .click .button {
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
</script>
