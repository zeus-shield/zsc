
const en = {
  header: {
    home: 'Home',
    insurance: 'Market',
    market: 'Product',
    analytics: 'Analytics',
    whitePaper: 'White Paper',
    faq: 'FAQ',
    login: 'Login',
    signUp: 'Sign Up',
    admin: 'Admin',
    user: 'Personal Center',
    logout: 'Logout',
    lang: 'English'
  },
  home: {
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
    phoneTitle: 'Phone',
    emailTitle: 'Email',
  },
  market: {
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
          item: ['Account Safety', 'My Policy']
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
        google: {
          title: 'Google Authenticator',
          description: 'Receive verification codes for login.',
          operation: {
            reset: 'Reset',
            open: 'ON'
          }
        }
      },
      dialog: {
        title: 'Google authenticator',
        placeholder: 'Please enter the 6-digit Google code',
        buttonText: 'Confirm'
      }
    },
    google: {
      title: ['Install Google Authenticator', 'Reset Google Authenticator'],
      step: [
      ]
    }
  },
  notFound: {
    content: 'The page you visited does not exist!',
    back: 'Back to home page!'
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
      cancel: 'Cancel',
      save: 'Save'
    },
    alert: {
      errorTitle: 'Error',
      warningTitle: 'Warning'
    },
    loading: {
      login: 'User is logging in...',
      signUp: 'User is signing up...',
      insurance: 'Getting insurance products...',
      analytics: 'Analyzing data........'
    }
  }
};
export default en;
