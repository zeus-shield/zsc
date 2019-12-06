
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
    menu1: {
      title1: 'Myinsura',
      page1: 'Innovative insurance data service platform based on blockchain technology',
      title2: 'Data Analysis',
      page2: 'Data analysis based on AI',
      title3: 'Privacy Protection',
      page3: 'Data security and privacy protection'
    },
    menu2: {
      title: 'Product introduction',
      page: 'Myinsura is an innovative insurance platform based on blockchain technology. Upload logistics record of the users and insurance certificate information onto the Ethereum blockchain system. User information is protected without the authorization of the provider. The platform combines with artificial intelligence to conduct customized analysis of big data on the blockchain.'
    },
    menu3: {
    },
    menu4: {
      title: 'Product Feature',

      page1: 'Ordinary users can browse the insurance products of various insurance companies through the platform, and to find suitable insurance products through big data analysis.',
      page2: 'Minetrack provides data services based on privacy protection for paying users or premium members.(Data can be used to design new types of insurance, customized policies, precision marketing, etc).',
      page3: 'The platform provides independent function module APIs for third parties, and provides charging services such as interface docking for system customization development and system integration.'
    },
    menu5: {
      title: 'Contact us'
    }
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
    phonePlaceholder: 'Phone Number',
    emailPlaceholder: 'Email',
    getCode: 'Get Code',
    retrieveCode: 'Retrieve Code',
    code: '6-bit Verification Code',
    password: 'Password',
    password2: 'Password again',
    submit: 'Sign Up'
  },
  market: {
    // aside: {
    //   slot: [
    //     {
    //       title: 'Company',
    //       item: ['PICC', 'PING AN', 'CPIC', 'CHINA LIFE', 'NCI']
    //     }
    //   ]
    // }
    pingan: {
      category: 'Category: ',
      period: 'Period: ',
      input: 'Submit My Policy'
    },
    picc: {
    },
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
        {
          title: 'After installation, open Google Authenticator and scan the below or enter the key to get a 6-digit code',
          tip: 'Please keep your private key secure to avoid login problem if you change or lose your phone.',
          qr: 'Key'
        },
        {
          title: 'Please enter the 6-digit code and SMS code to complete the settings',
          form: {
            label: 'New Google code',
            placeholder: 'Please input Google code',
            buttonText: 'Comfirm'
          }
        }
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
