
const cn = {
  header: {
    home: '首页', // 1
    
    insurance: '保单', // 2
    certificate: '录入', // 21
    analytics: '分析', // 22

    whitePaper: '白皮书', // 3
    faq: '常见问题', // 4
    login: '登录', // 5
    signUp: '免费注册', // 6
    
    // pic 7
    user: '个人中心', // 71
    logout: '注销', // 72
    
    lang: '中文（简体）' // 8
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
  },
  insurance: {
    aside: {
      slot: [
        {
          title: '保险公司',
          item: ['中国人保', '中国平安', '中国太平洋', '中国人寿', '新华保险']
        }
      ]
    }
  },
  user: {
    aside: {
      slot: [
      ]
    },

    detail: {
      title: '账户和安全',
      securityTip: {
        title: '安全提示',
        description: '为了您的账户安全，请检查访问网址，开启安全认证，不要透露短信和谷歌验证码给任何人，包括Dashboard客服'
      },
      info: {
      },
      securitySetting: {
        google: {
        }
      },
      dialog: {
      }
    },

    google: {
    }
  },
  message: {
    info: {},
    warning: {},
    error: {},

  },
  component: {
  }
};
export default cn;
