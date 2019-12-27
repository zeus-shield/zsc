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
    // aside: {
    //   slot: [
    //     {
    //       title: '保险公司',
    //       item: ['中国人保', '中国平安', '中国太平洋', '中国人寿', '新华保险']
    //     }
    //   ]
    // }
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
      },
      policy: {
        title: '保单信息',
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
      reLogin: '用未登录或证书过期，请重新登录!',
    },
    error: {
      USER_HAS_EXIST: '用户已存在！',
      USER_NOT_EXIST: '用户不存在!',
    },

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
      analytics: '大数据分析中........'
    }
  }
};
export default cn;
