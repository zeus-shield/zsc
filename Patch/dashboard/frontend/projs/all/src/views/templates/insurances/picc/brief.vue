<template>
  <div class="insurance-picc-brief">
    <el-row class="insurance" :gutter="0" type="flex" justify="start">
      <el-col class="thumb" :span="4">
        <div class="col">
          <el-row :gutter="0" type="flex" justify="start">
            <img v-if="item.brief.img_url && item.brief.img_url !== '' && item.brief.img_url !== 'null'" class="img" :src="require('@/assets/' + item.brief.img_url)"></img>
          </el-row>
          <el-row :gutter="0" type="flex" justify="start">
            <span class="brief">
              {{ item.brief.text }}
            </span>
          </el-row>
        </div>
      </el-col>

      <el-col class="info" :span="15">
        <div class="col">
          <div class="title">
            <span>{{ item.brief.title }}</span>
          </div>
          <div v-if="item.brief.hot === true" class="corner hot"></div>

          <el-row class="insured-table" v-for="(scheme, index) in item.detail.schemes" :key="index" :gutter="0" type="" justify="">
            <el-col class="item" :span="14">{{ scheme.name }}</el-col>
            <el-col class="amount" :span="4">{{ scheme.amount }}</el-col>
          </el-row>

        </div>
      </el-col>
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

export default {
  name: 'InsurancePICCBrief',
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
          let lenErr = 'POLICY_' + cmd + '_LEN_ERR';
          let lenMin = 0;
          if (cmd === 'HOLDER' || cmd === 'INSURANT' || cmd === 'AMOUNT' || cmd === 'PERIOD') {
            lenMin = 1;
          } else {
            lenMin = 2;
          }
          if (value.length < lenMin + 1) {
            callback(new Error(this.langSet['message']['error'][lenErr]));
          } else {
            callback();
          }
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
    let validateAmount = (rule, value, callback) => {
      validate('AMOUNT', rule, value, callback);
    };
    let validateStartTime = (rule, value, callback) => {
      validate('STARTTIME', rule, value, callback);
    };
    let validatePeriod = (rule, value, callback) => {
      validate('PERIOD', rule, value, callback);
    };
    return {
      loading: false,
      loadingText: '',
      dialogVisible: false,
      buttonDisabled: true,
      addPolicyToDatabaseDone: false,
      form: {
        insurance: {
          id: '',
          company: '',
          category: '',
          title: '',
          code: {
            company: '',
            category: '',
            title: ''
          }
        },
        user: {
          holder: '',
          insurant: '',
          credentials: '',
          age: '',
          sex: '',
          status: '',
          address: '',
          contact: ''
        },
        policy: {
          amount: '',
          renewal: false,
          start_time: '',
          period: '',
          description: ''
        }
      },
      rules: {
        insurance: {
          company: [
            // { required: true, message: '请输入公司名称', trigger: 'blur' },
            // { min: 3, message: '长度大于3个字符', trigger: 'blur' }
            { required: true, validator: validateCompany, trigger: 'blur' }
          ],
          category: [
            // { required: true, message: '请输入产品类型', trigger: 'blur' },
            // { min: 3, message: '长度大于3个字符', trigger: 'blur' }
            { required: true, validator: validateCategory, trigger: 'blur' }
          ],
          title: [
            // { required: true, message: '请输入产品名称', trigger: 'blur' },
            // { min: 3, message: '长度大于3个字符', trigger: 'blur' }
            { required: true, validator: validateTitle, trigger: 'blur' }
          ]
        },
        user: {
          holder: [
            // { required: true, message: '请输入投保人', trigger: 'blur' },
            // { min: 3, message: '长度大于3个字符', trigger: 'blur' }
            { required: true, validator: validateHolder, trigger: 'blur' }
          ],
          insurant: [
            // { required: true, message: '请输入承保人', trigger: 'blur' },
            // { min: 3, message: '长度大于3个字符', trigger: 'blur' }
            { required: true, validator: validateInsurant, trigger: 'blur' }
          ]
        },
        policy: {
        }
      }
    };
  },
  props: {
    item: {}
  },
  computed: {
  },
};
</script>
