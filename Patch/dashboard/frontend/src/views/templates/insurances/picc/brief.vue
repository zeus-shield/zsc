<template>
  <div class="insurance-picc-brief">
    <el-row class="insurance" :gutter="0" type="flex" justify="start">
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.insurance {
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
}
.insurance .thumb .col .img {
  width: 100%;
  height: 100%;
  // height: auto;
}
.insurance .thumb .col .brief {
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
}
.insurance .info .col .content {
  margin-top: 20px;
  font-size: 14px;
}
.insurance .info .col .insured-table {
}
.insurance .info .col .insured-table .item {
}
.insurance .info .col .insured-table .amount {
}
.insurance .operation {
  background: #fff9f2;
}
.insurance .operation .col {
  margin: 40px auto;
}
.insurance .operation .col .desc {
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
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';
</script>