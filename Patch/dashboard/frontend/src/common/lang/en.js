
const en = {
  header: {
    home: 'Home',
    insurance: 'Insurance',
    certificate: 'Certificate',
    analytics: 'Analytics',
    whitePaper: 'White Paper',
    faq: 'FAQ',
    login: 'Login',
    signUp: 'Sign Up',
    user: 'User',
    logout: 'Logout',
    lang: 'English'
  },
  login: {
    title: 'LOGIN',
    account: 'Phone Number/Email',
    password: 'Password',
    submit: 'Login',
    dialog: {
      title: 'Google Authenticator',
      placeholder: 'Please enter the 6-digit Google code',
      buttonText: 'Confirm'
    }
  },
  signUp: {
  },
  insurance: {
    aside: {
      slot: [
        {
          title: 'Company',
          item: ['PICC', 'PING AN', 'CPIC', 'CHINA LIFE', 'NCI']
        }
      ]
    }
  },
  user: {
    aside: {
      slot: [
        {
          title: 'Profile',
          item: ['Account Safety']
        },
        {
          title: 'Support',
          item: ['Submit a ticket', 'My tickets']
        }
      ]
    },
    detail: {
      title: 'Account Safety',
      securityTip: {
        title: 'Security Tip',
        description: 'For the safety of your account, please check carefully the domain you are visiting, enable two factor authentication, and do NOT disclose your verification codes to anyone including Dashboard staff.'
      },
      info: {
        title1: 'Account',
        title2: 'Last Login At'
      },
      securitySetting: {
        title: 'Security',
      },
      dialog: {
        title: 'Google authenticator',
        placeholder: 'Please enter the 6-digit Google code',
        buttonText: 'Confirm'
      }
    },
    google: {
    }
  },
  company: {
  },
  message: {
    info: {},
    warning: {
      reLogin: 'User not logged in or token expires, please re-login!',
    },
    error: {},
  },
  component: {
    button: {
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    alert: {
      errorTitle: 'Error',
      warningTitle: 'Warning'
    },
    loading: {
      login: 'User login...',
      signUp: 'User is signing up...'
    }
  }
};
export default en;
