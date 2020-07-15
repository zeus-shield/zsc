'use strict';

const en = {
  header: {
    brand: 'Dashboard',
    home: 'Home',
    insurance: 'Market',
    market: 'Products',
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
    slot1: {
      title: ['Dashboard', 'Data Analysis', 'Privacy Protection'],
      content: [
        'Innovative insurance data service platform based on blockchain technology',
        'Data analysis based on AI',
        'Data security and privacy protection'
      ]
    },
    slot2: {
      header: 'Product Advantages',
      title: ['Upload the data onto the Ethereum blockchain', 'Big Data Analysis', 'Privacy Security', 'Industry Credit'],
      content: [
        'Upload the insurance data onto the Ethereum blockchain. The information which built on blockchain is authentic, reliable, traceable, and the digital identity cannot be tampered with, removed, edited or forged.',
        'Combined with artificial intelligence for customizing accurate risk control schemes for the insurance industry, pricing models, personalized policies and new types of insurance and so on to provides big data support.',
        'The account digital identity information is highly encrypted, and the information is protected for privacy before the authorization of the provider, the data security and personal privacy will be guaranteed.',
        'Establish the integral investigation system through block chain technology. The information shall not be tampered with or falsified to provide authentic and reliable data sources for integral investigation institutions.'
      ]
    },
    slot3: {
      title: 'Product introduction',
      content: 'Dashboard is an innovative insurance platform based on blockchain technology. Upload insurance record of the users and insurance certificate information onto the Ethereum blockchain system. User information is protected without the authorization of the provider. The platform combines with artificial intelligence to conduct customized analysis of big data on the blockchain.'
    },
    slot4: {
      header: 'Product Feature',
      title: ['', '', '', ''],
      content: [
        'Ordinary users can browse the insurance products of various insurance companies through the platform, and to find suitable insurance products through big data analysis.',
        'Provides data services based on privacy protection for paying users or premium members.(Data can be used to design new types of insurance, customized policies, precision marketing, etc).',
        'The platform provides independent function module APIs for third parties, and provides charging services such as interface docking for system customization development and system integration.',
        'The intermediate cost is reduced by resource sharing. Value can be allocated to each node according to its contribution to the blockchain network,and other nodes can be encouraged to participate actively.'
      ]
    },
    slot5: {
      header: 'Contact us'
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
    quickTitle: 'Qucik',
    phonePlaceholder: 'Phone Number',
    emailPlaceholder: 'Email',
    quickPlaceholder: 'Account',
    getCode: 'Get Code',
    retrieveCode: 'Retrieve Code',
    code: '6-bit Verification Code',
    password: 'Password',
    password2: 'Password again',
    submit: 'Sign Up'
  },
  market: {
    operation: {
      title: ['Select Company', 'Search for products']
    },
    pingan: {
      category: 'Category: ',
      period: 'Period: ',
      input: 'Submit My Policy'
    },
    picc: {
      category: 'Category: ',
      age: 'Age',
      period: 'Period: ',
      input: 'Submit My Policy'
    },
    dialog: {
      title: 'My Policy',
      product: {
        title: 'Product Information',
        company: 'Company',
        category: 'Category',
        name: 'Name'
      },
      user: {
        title: 'Personal Information',
        holder: 'Holder',
        insurant: 'Insurant',
        credentials: 'Credentials',
        age: 'Age',
        sex: {
          title: 'Sex',
          content: ['Male', 'Female']
        },
        status: {
          title: 'Status',
          content: ['Unmarried', 'Married']
        },
        address: 'Address',
        contact: 'Contact'
      },
      policy: {
        title: 'Policy Information',
        amount: 'Amount',
        renewal: 'Eenewal',
        startTime: {
          title: 'Start Time',
          placeholder: 'Please select the date'
        },
        period: 'Period',
        description: 'Description'
      },
      blockchain: {
        title: 'Block Chain Information',
        key: 'Key',
        hash: 'Hash',
        view: 'View'
      }
    }
  },
  user: {
    aside: {
      slot: [
        {
          title: 'Profile',
          item: ['My Policies', 'My Points', 'Account Safety']
        },
        {
          title: 'Support',
          item: ['Submit a ticket', 'My Tickets']
        }
      ]
    },
    // DONE
    detail: {
      account: {
        title: 'Account Info',
        tip: {
          title: 'Security Tip',
          description: 'For the safety of your account, please check carefully the domain you are visiting, enable two factor authentication, and do NOT disclose your verification codes to anyone including Dashboard staff.'
        },
        info: {
          title: ['Account', 'Last Login At']
        }
      },
      security: {
        title: 'Security Setting',
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
        title: 'Google Authenticator',
        placeholder: 'Please enter the 6-digit Google code',
        buttonText: 'Confirm'
      }
    },
    // DONE
    google: {
      title: ['Install Google Auth', 'Reset Google Auth'],
      step: [
        {
          text: 'After installation, open Google authenticator and scan the below or enter the key to get a 6-digit code.',
          tip: {
            title: 'Security Tip',
            description: 'Please keep your private key secure to avoid login problem if you change or lose your phone.'
          },
          qr: 'Key'
        },
        {
          text: 'Please enter the 6-digit code and SMS code to complete the settings.',
          form: {
            label: 'New Google authenticator code',
            placeholder: 'Please input Google auth code',
            buttonText: 'Comfirm'
          }
        }
      ]
    },
    policy: {
      // the content follow same as market.dialog
      refresh: 'Refresh'
    },
    point: {
      title: 'My points',
      profile: {
      },
      trace: {
        title: 'Detail',
        time: 'Time',
        amount: 'Revenue/Expense',
        description: 'Description'
      },
    }
  },
  admin: {
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
      reLogin: 'User do not login, please login at first!',
      jwtExpires: 'JWT expires, please re-login!',
      jwtMalformed: 'JWT malformed, please re-login!',
      invalidToken: 'JWT invalid, please re-login!',
      googleAuthNone: 'Please set Google authenticator at first!',
      googleAuthSetted: 'Google authenticator has been setted!',
      googleAuthErr: 'Google authenticator code error!',

      companyRemove: 'Remove the company records permanently, continue?',
      companyCategoryExist: 'Company category exist, continue?',
      companyCategoryRemove: 'Remove the company category records permanently, continue?',

      insuranceRemove: 'Remove the insurance records permanently, continue?',

      addAccount: 'External account detected!',
      removeAccount: 'External account login out',
      changeAccount: 'Switch external account',
      refreshAccount: 'Refresh external account',
      changeNetwork: 'Switch network in external account'
    },
    error: {
      USER_HAS_EXISTED: 'User has already existed!',
      USER_NOT_EXIST: 'User does not exist!',
      USER_IS_ACTIVE: 'User is active!',
      USER_IS_NOT_ACTIVE: 'User is not active!',
      USER_PASSWORD_WRONG: 'Incorrect login password!',
      USER_CODE_WRONG: 'User code incorrect !',
      USER_CODE_TIMEOUT: 'User code timeout!',
      USER_GOOGLE_CODE_NONE: 'Please input Google code',
      USER_GOOGLE_CODE_LEN_ERR: 'Length of 6-bit number',
      USER_GOOGLE_AUTH_ERR: 'Google authenticator code error!',
      USER_GOOGLE_AUTH_NOT_SET: 'Google authenticator not set!',
      USER_ADD_POLICY_FAIL: 'User failed to add policy!',
      USER_MINT_FAIL: 'User failed to mint!',
      USER_POINT_TRANSFER_FAIL: 'User failed to transfer points!',
      USER_POINT_TRANSFER_TARGET_NONE: 'Please input target account!',
      USER_POINT_TRANSFER_AMOUNT_NONE: 'Please input the amount!',
      USER_CHECK_IN_FAIL: 'User failed to check in!',
      USER_SIGNUP_CMD_ERR: 'User sign up cmd error!',

      COMPANY_CATEGORIES_HAS_EXIST: 'Company and category have already existed!',
      COMPANY_CATEGORIES_NOT_EXIST: 'Company and category does not exist!',
      COMPANY_HAS_EXISTED: 'Company has already existed!',
      COMPANY_CODE_HAS_EXISTED: 'Company code has already existed!',
      COMPANY_NOT_EXIST: 'Company does not exist!',

      INSURANCE_HAS_EXISTED: 'Insurance has already existed!',
      INSURANCE_CODE_HAS_EXISTED: 'Insurance code has already existed!',
      INSURANCE_NOT_EXIST: 'Insurance does not exist!',

      POLICY_COMPANY_NONE: 'Please input company name',
      POLICY_COMPANY_LEN_ERR: 'Length must be more than 3',
      POLICY_CATEGORY_NONE: 'Please input category',
      POLICY_CATEGORY_LEN_ERR: 'Length must be more than 3',
      POLICY_TITLE_NONE: 'Please input title',
      POLICY_TITLE_LEN_ERR: 'Length must be more than 3',
      POLICY_HOLDER_NONE: 'Please input holder',
      POLICY_HOLDER_LEN_ERR: 'Length must be more than 1',
      POLICY_INSURANT_NONE: 'Please input insurant',
      POLICY_INSURANT_LEN_ERR: 'Length must be more than 1',
      POLICY_AMOUNT_NONE: 'Please input amount',
      POLICY_AMOUNT_LEN_ERR: 'Length must be more than 1',
      POLICY_STARTTIME_NONE: 'Please input start time',
      POLICY_PERIOD_NONE: 'Please input period',
      POLICY_PERIOD_LEN_ERR: 'Length must be more than 1',

      LOGIN_ACCOUNT_NONE: 'Please input phone number or email',
      LOGIN_ACCOUNT_LEN_ERR: 'Length of 6 to 64 characters',
      LOGIN_PWD_NONE: 'Please input password',
      LOGIN_PWD_LEN_ERR: 'Length of 3 to 6 characters',

      SIGNUP_ACCOUNT_NONE: 'Please input phone number or email',
      SIGNUP_QUICK_ACCOUNT_NONE: 'Please input account',
      SIGNUP_ACCOUNT_LEN_ERR: 'Length of 6 to 64 characters',
      SIGNUP_CODE_NONE: 'Please input 6-digit Verification code',
      SIGNUP_CODE_LEN_ERR: 'Length must be 6',
      SIGNUP_PWD_NONE: 'Please input password',
      SIGNUP_PWD_LEN_ERR: 'Length of 3 to 6 characters',
      SIGNUP_PWD2_ERR: 'Passwords do not match',
      'No recipients defined': 'No recipients defined!',

      TOKEN_IS_MISSING: 'Token is missing!',
      ROUTE_NOT_EXIST: 'Route does not exist!',
      TIMEOUT: 'The connection timed out. Please try again!',

      COMMON_PARAM_ERROR: 'Parameter error!',

      'Network Error': 'System cross domain connection error!',

      UNKNOWN: 'Unknown Error!'
    }
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
      analytics: 'Analyzing data...',

      myInsuranceSaving: 'Saving my insurance...',
      myInsuranceLoading: 'Loading my insurance...',

      user: {
        point: {
          amount: 'Getting user points...',
          trace: 'Getting user points details...'
        }
      }
    }
  }
};
export default en;
