'use strict';

const cn = {
  header: {
    brand: 'Dashboard',

    home: '首页', // 1

    insurance: '保险市场', // 2
    market: '保险集市', // 21
    analytics: '数据分析', // 22

    whitePaper: '白皮书', // 3
    faq: '常见问题', // 4
    login: '登录', // 5
    signUp: '免费注册', // 6
    admin: '管理员', // 6

    // pic 7
    user: '个人中心', // 71
    logout: '注销', // 72

    lang: '中文（简体）' // 8
  },
  // DONE
  home: {
    slot1: {
      title: ['Dashboard', '大数据分析', '隐私安全'],
      content: [
        '基于区块链技术的创新型保险数据服务平台',
        '基于人工智能的大数据分析',
        '保障数据安全和个人隐私权'
      ]
    },
    slot2: {
      header: '产品优势',
      title: ['数据上链', '大数据分析', '隐私安全', '行业征信'],
      content: [
        '保险业务数据上链。构建在区块链之上的信息真实可靠，并且数字身份不可篡改、移除、编辑和伪造。',
        '结合人工智能，为保险行业定制精准的风控方案、定价模型，个性化保单和新型险种等提供大数据支撑。',
        '账户身份信息高度加密，信息在没有得到提供方授权下是隐私保护的，保证了数据安全和个人隐私权。',
        '通过区块链技术建立征信系统，信息不可篡改，不可伪造，为征信机构提供真实可靠的数据来源。'
      ]
    },
    slot3: {
      title: '产品介绍',
      content: 'Myinsura是一个基于区块链技术的创新型保险数据服务平台。用户和保单信息通过平台上链。用户信息在没有得到提供方授权下是隐私保护的。平台结合人工智能对区块链上的大数据进行定制化分析。'
    },
    slot4: {
      header: '产品特色',
      title: ['', '', '', ''],
      content: [
        '普通用户可通过平台查阅目前各个保险公司的保险产品。通过大数据分析来找到适合自己的保险产品。',
        '为付费用户或高级会员，提供基于隐私保护的数据支撑服务（数据可用来设计新型险种，定制个性化保单，精准营销等）。',
        '提供平台的各种独立功能模块API，为系统定制化开发和系统集成提供接口对接服务。',
        '通过资源共享降低中间成本。价值根据对区块链网络贡献程度分配到各节点，并激励其他节点积极参与。'
      ]
    },
    slot5: {
      header: '联系方式'
    }
  },
  login: {
    title: '用户登录',
    account: '请输入手机号或邮箱地址',
    password: '请输入登录密码',
    submit: '登录',
    dialog: {
      title: '谷歌验证',
      placeholder: '请输入谷歌验证码',
      buttonText: '确认'
    }
  },
  signUp: {
    phoneTitle: '手机注册',
    emailTitle: '邮箱注册',
    phonePlaceholder: '请输入手机号',
    emailPlaceholder: '请输入邮箱地址',
    getCode: '获取验证码',
    retrieveCode: '重新获取',
    code: '请输入6位验证码',
    password: '请输入密码',
    password2: '请再次输入密码',
    submit: '注册'
  },
  market: {
    operation: {
      title: ['选择保险公司', '搜索保险产品']
    },
    pingan: {
      category: '保障类型：',
      period: '保障期限：',
      input: '录入我的保单'
    },
    picc: {
      category: '保障类型：',
      age: '适用年龄：',
      period: '保障期限：',
      input: '录入我的保单'
    },
    dialog: {
      title: '我的保单',
      product: {
        title: '产品信息',
        company: '公司名称',
        category: '产品类别',
        name: '产品名称'
      },
      user: {
        title: '个人信息',
        holder: '投保人',
        insurant: '承保人',
        credentials: '有效证件',
        age: '年龄',
        sex: {
          title: '性别',
          content: ['男', '女']
        },
        status: {
          title: '婚姻状况',
          content: ['未婚', '已婚']
        },
        address: '通讯地址',
        contact: '联系方式'
      },
      policy: {
        title: '保单信息',
        amount: '保额',
        renewal: '是否续保',
        startTime: {
          title: '生效日期',
          placeholder: '选择日期'
        },
        period: '保障期限',
        description: '详细描述'
      }
    }
  },
  user: {
    aside: {
      slot: [
        {
          title: '个人信息',
          item: ['账户和安全', '我的保单']
        },
        {
          title: '支持',
          item: ['问题反馈', '问题列表']
        }
      ]
    },
    // DONE
    detail: {
      account: {
        title: '账户信息',
        tip: {
          title: '安全提示',
          description: '为了您的账户安全，请检查访问网址，开启安全认证，不要透露短信和谷歌验证码给任何人，包括Dashboard客服。'
        },
        info: {
          title: ['账户', '上次登录时间']
        }
      },
      security: {
        title: '安全设置',
        google: {
          title: '谷歌验证',
          description: '登录时，进行谷歌验证。',
          operation: {
            set: '设置',
            reset: '重置',
            open: '开启'
          }
        }
      },
      dialog: {
        title: '谷歌开关',
        placeholder: '请输入谷歌验证码',
        buttonText: '确认'
      }
    },
    // DONE
    google: {
      title: ['设置 谷歌验证', '重置 谷歌验证'],
      step: [
        {
          text: '安装完成后打开谷歌验证，扫描下方二维码或手动输入秘钥，得到6位数验证码。',
          tip: {
            title: '安全提示',
            description: '请务必妥善保管谷歌验证秘钥，以免更换或丢失手机导致无法换绑。'
          },
          qr: '秘钥'
        },
        {
          text: '请将您获得的验证码填入下方输入框中，并完成验证。',
          form: {
            label: '新谷歌验证码',
            placeholder: '请输入新谷歌验证码',
            buttonText: '确认'
          }
        }
      ]
    },
    policy: {
      // the content follow same as market.dialog
    }
  },
  notFound: {
    content: '您访问的页面不存在!',
    back: '返回首页'
  },
  company: {
  },
  message: {
    info: {},
    warning: {
      reLogin: '用户未登录，请重先登录!',
      jwtExpires: 'JWT已过期，请重新登录!',
      jwtMalformed: 'JWT格式错误，请重新登录!',
      invalidToken: 'JWT无效，请重新登录!',
      googleAuthNone: '请先设置谷歌认证!',
      googleAuthSetted: '已设置过谷歌认证!',
      googleAuthErr: '谷歌认证码错误!',

      companyRemove: '该保险公司记录将永久被删除, 是否继续?',
      companyCategoryExist: '公司险种记录存在, 是否继续?',
      companyCategoryRemove: '公司险种记录将永久被删除, 是否继续?',

      insuranceRemove: '该保险产品记录将永久被删除, 是否继续?'
    },
    error: {
      USER_HAS_EXIST: '用户已存在！',
      USER_NOT_EXIST: '用户不存在!',
      USER_IS_ACTIVE: '用户已激活!',
      USER_IS_NOT_ACTIVE: '用户未激活!',
      USER_PASSWORD_WRONG: '登录密码不正确!',
      USER_CODE_WRONG: '验证码不正确！',
      USER_CODE_TIMEOUT: '验证码超时！',
      USER_GOOGLE_CODE_NONE: '请输入谷歌验证码',
      USER_GOOGLE_CODE_LEN_ERR: '请输入6位数字',
      USER_GOOGLE_AUTH_ERR: '谷歌认证码错误',
      USER_GOOGLE_AUTH_NOT_SET: '谷歌认证未开启',

      COMPANY_CATEGORIES_HAS_EXIST: '该保险公司下险种已存在！',
      COMPANY_CATEGORIES_NOT_EXIST: '该保险公司下险种不存在！',
      COMPANY_NOT_EXIST: '该保险公司不存在!',

      INSURANCE_HAS_EXIST: '该保险产品已存在！',
      INSURANCE_NOT_EXIST: '该保险产品不存在！',

      POLICY_COMPANY_NONE: '请输入公司名称',
      POLICY_COMPANY_LEN_ERR: '长度大于3个字符',
      POLICY_CATEGORY_NONE: '请输入产品类型',
      POLICY_CATEGORY_LEN_ERR: '长度大于3个字符',
      POLICY_TITLE_NONE: '请输入产品名称',
      POLICY_TITLE_LEN_ERR: '长度大于3个字符',
      POLICY_HOLDER_NONE: '请输入投保人',
      POLICY_HOLDER_LEN_ERR: '长度大于1个字符',
      POLICY_INSURANT_NONE: '请输入承保人',
      POLICY_INSURANT_LEN_ERR: '长度大于1个字符',
      POLICY_AMOUNT_NONE: '请输入保额',
      POLICY_AMOUNT_LEN_ERR: '长度大于1个字符',
      POLICY_STARTTIME_NONE: '请选择生效日期',
      POLICY_PERIOD_NONE: '请输入保障期限',
      POLICY_PERIOD_LEN_ERR: '长度大于1个字符',

      LOGIN_ACCOUNT_NONE: '请输入手机号/邮箱地址',
      LOGIN_ACCOUNT_LEN_ERR: '长度在 6 到 18 个字符',
  },
  component: {
    button: {
      confirm: '确认',
      cancel: '取消',
      save: '保存'
    },
    alert: {
      errorTitle: '错误',
      warningTitle: '提示'
    },
    loading: {
      login: '用户登录中......',
      signUp: '用户注册中......',
      insurance: '保险产品获取中......',
      analytics: '大数据分析中........',

      myInsuranceSaving: '录入我的保单中......'
    }
  }
};
export default cn;
